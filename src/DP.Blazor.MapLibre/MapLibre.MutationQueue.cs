using System.Runtime.ExceptionServices;
using DP.Blazor.MapLibre.Models;
using Microsoft.Extensions.Logging;
using Microsoft.JSInterop;

namespace DP.Blazor.MapLibre;

public partial class MapLibre
{
    private static readonly HashSet<string> QueuedMutationEvents =
    [
        "addControl",
        "addGeolocateControl",
        "addNavigationControl",
        "addScaleControl",
        "addImage",
        "addLayer",
        "ensureLayer",
        "addSource",
        "addSprite",
        "removeControl",
        "removeFeatureState",
        "removeImage",
        "removeLayer",
        "removeSource",
        "removeSprite",
        "setSourceData",
        "setSourceDataAsJson",
        "setSourceTiles",
        "upsertTileSource",
        "ensureImages",
        "updateSourceData",
        "moveLayer",
        "setLayerOrder",
        "setFilter",
        "setLayoutProperty",
        "setLayoutProperties",
        "setPaintProperty",
        "setPaintProperties",
        "setLayerZoomRange",
        "setFeatureState",
        "setTerrain",
        "setSky",
        "setLight",
        "setProjection",
        "removeLayerIfExists",
        "removeLayersIfExist",
        "removeSourceIfExists",
        "removeSourcesIfExist",
    ];

    private static readonly HashSet<string> AwaitedMutationEvents =
    [
        "setSourceData",
        "setSourceDataAsJson",
        "updateSourceData",
        "addImage",
        "ensureImages",
    ];

    private bool _explicitTransaction;
    private bool _flushScheduled;

    /// <summary>
    /// Serializes batch delivery to JavaScript so two batches can never interleave on the wire.
    /// </summary>
    private readonly SemaphoreSlim _flushLock = new(1, 1);

    /// <summary>
    /// Ordered steps of an explicit transaction. Consecutive queued mutations are sealed into one
    /// JS batch; every non-queued void call becomes its own step. Steps run in call order on Commit.
    /// </summary>
    private readonly List<Func<ValueTask>> _transactionSteps = [];

    private void ScheduleMutationFlush()
    {
        if (_explicitTransaction || _flushScheduled || _jsModule is null)
        {
            return;
        }

        _flushScheduled = true;
        _ = FlushAfterYieldAsync();
    }

    private async Task FlushAfterYieldAsync()
    {
        try
        {
            await Task.Yield();
            await FlushQueuedMutationsAsync();
        }
        catch (JSDisconnectedException)
        {
            // The circuit went away; nothing left to apply to.
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            Logger.LogError(ex, "Applying queued mutations for map container '{ContainerId}' failed.", JsContainerId);
        }
        finally
        {
            _flushScheduled = false;
        }
    }

    /// <summary>
    /// Delivers every queued batch in order. Mutations queued while a batch is in flight are picked up by the
    /// loop, so nothing is left behind waiting for a flush that was already consumed.
    /// </summary>
    private async ValueTask FlushQueuedMutationsAsync()
    {
        if (_explicitTransaction || _jsModule is null)
        {
            return;
        }

        await _flushLock.WaitAsync();
        try
        {
            while (!_explicitTransaction && _bulkTransaction is { Transactions.Count: > 0 })
            {
                var batch = TakeBulkTransaction();
                await ExecuteBatchAsync(batch);
            }
        }
        finally
        {
            _flushLock.Release();
        }
    }

    private BulkTransaction TakeBulkTransaction()
    {
        var batch = _bulkTransaction!;
        _bulkTransaction = null;
        BulkTransactionCoalescer.Coalesce(batch);
        return batch;
    }

    private ValueTask ExecuteBatchAsync(BulkTransaction batch) =>
        _jsModule.InvokeVoidAsync("executeTransaction", JsContainerId, batch.Transactions);

    private async ValueTask InvokeMapJsVoidAsync(string identifier, params object?[] args)
    {
        if (QueuedMutationEvents.Contains(identifier))
        {
            EnqueueQueuedMutation(identifier, SkipContainer(args));
            if (_explicitTransaction)
            {
                return;
            }

            if (AwaitedMutationEvents.Contains(identifier))
            {
                await FlushQueuedMutationsAsync();
            }
            else
            {
                ScheduleMutationFlush();
            }

            return;
        }

        if (_explicitTransaction)
        {
            // Keep call order inside the transaction: seal the queued work before this direct call.
            SealExplicitSegment();
            _transactionSteps.Add(async () => await _jsModule.InvokeVoidAsync(identifier, args));
            return;
        }

        await FlushQueuedMutationsAsync();
        await _jsModule.InvokeVoidAsync(identifier, args);
    }

    private async ValueTask<T> InvokeMapJsAsync<T>(string identifier, params object?[] args)
    {
        await FlushQueuedMutationsAsync();
        return await _jsModule.InvokeAsync<T>(identifier, args);
    }

    private void EnqueueQueuedMutation(string eventName, object?[] data)
    {
        _bulkTransaction ??= new BulkTransaction();
        BulkTransactionCoalescer.Enqueue(_bulkTransaction, eventName, data);
        if (!_explicitTransaction)
        {
            ScheduleMutationFlush();
        }
    }

    /// <summary>
    /// Moves the queued mutations collected so far into the explicit transaction's step list.
    /// </summary>
    private void SealExplicitSegment()
    {
        if (_bulkTransaction is not { Transactions.Count: > 0 } segment)
        {
            _bulkTransaction = null;
            return;
        }

        _bulkTransaction = null;
        _transactionSteps.Add(async () =>
        {
            BulkTransactionCoalescer.Coalesce(segment);
            await ExecuteBatchAsync(segment);
        });
    }

    /// <summary>
    /// Runs the explicit transaction steps in call order. A failing step does not stop the rest;
    /// the first error (or an aggregate of several) is rethrown after all steps ran.
    /// </summary>
    private async ValueTask CommitExplicitTransactionAsync()
    {
        SealExplicitSegment();
        var steps = _transactionSteps.ToArray();
        _transactionSteps.Clear();

        // Hold the flush lock so a mutation queued by another caller during the commit cannot interleave with it.
        List<Exception>? errors = null;
        await _flushLock.WaitAsync();
        try
        {
            foreach (var step in steps)
            {
                try
                {
                    await step();
                }
                catch (JSDisconnectedException)
                {
                    throw;
                }
                catch (Exception ex)
                {
                    (errors ??= []).Add(ex);
                }
            }
        }
        finally
        {
            _flushLock.Release();
        }

        if (errors is null)
        {
            return;
        }

        if (errors.Count == 1)
        {
            ExceptionDispatchInfo.Capture(errors[0]).Throw();
        }

        throw new AggregateException("One or more operations in the bulk transaction failed.", errors);
    }

    private static object?[] SkipContainer(object?[] args)
    {
        if (args.Length == 0)
        {
            return args;
        }

        var rest = new object?[args.Length - 1];
        Array.Copy(args, 1, rest, 0, rest.Length);
        return rest;
    }
}

/// <summary>
/// Latest-wins coalescing for idempotent map mutations in a bulk transaction.
/// Property bags (<c>setPaintProperties</c>, <c>setLayoutProperties</c>) are merged per layer instead, so a
/// second call only overrides the keys it actually sets. Merging never crosses a layer lifecycle change
/// (add, ensure or remove of a layer, or a style replacement), because those recreate the layer.
/// </summary>
public static class BulkTransactionCoalescer
{
    /// <summary>Events that create, replace or destroy layers. Property bags are not merged across them.</summary>
    private static readonly HashSet<string> LayerLifecycleEvents =
    [
        "setStyle",
        "addLayer",
        "ensureLayer",
        "removeLayer",
        "removeLayerIfExists",
        "removeLayersIfExist",
        "upsertTileSource",
    ];

    public static void Enqueue(BulkTransaction transaction, string eventName, params object?[]? data)
    {
        if (LayerLifecycleEvents.Contains(eventName) && transaction.CoalesceIndex is { } barrierIndex)
        {
            RemovePropertyBagKeys(barrierIndex);
        }

        var key = Key(eventName, data);
        if (key is not null)
        {
            var index = transaction.CoalesceIndex ?? BuildIndex(transaction);
            var found = index.TryGetValue(key, out var existing);

            // The cached index can go stale if the list was mutated outside Enqueue;
            // fall back to a linear scan so coalescing never drops the wrong entry.
            if (found
                && (existing >= transaction.Transactions.Count
                    || Key(transaction.Transactions[existing].Event, transaction.Transactions[existing].Data) != key))
            {
                existing = transaction.Transactions.FindIndex(item => Key(item.Event, item.Data) == key);
                found = existing >= 0;
            }

            if (found)
            {
                if (IsPropertyBag(eventName))
                {
                    data = MergePropertyBags(transaction.Transactions[existing].Data, data);
                }

                transaction.Transactions.RemoveAt(existing);
                index.Remove(key);
                foreach (var entry in index.ToArray())
                {
                    if (entry.Value > existing)
                    {
                        index[entry.Key] = entry.Value - 1;
                    }
                }
            }

            transaction.CoalesceIndex = index;
        }

        transaction.Add(eventName, data);

        if (key is not null)
        {
            transaction.CoalesceIndex![key] = transaction.Transactions.Count - 1;
        }
    }

    private static Dictionary<string, int> BuildIndex(BulkTransaction transaction)
    {
        var index = new Dictionary<string, int>(StringComparer.Ordinal);
        for (var position = 0; position < transaction.Transactions.Count; position++)
        {
            var item = transaction.Transactions[position];
            if (LayerLifecycleEvents.Contains(item.Event))
            {
                RemovePropertyBagKeys(index);
            }

            var key = Key(item.Event, item.Data);
            if (key is not null)
            {
                index[key] = position;
            }
        }

        return index;
    }

    /// <summary>
    /// Removes superseded idempotent mutations. The last occurrence of each key keeps its position.
    /// Property bags for the same layer are merged into that occurrence, but only within one segment
    /// (between layer lifecycle changes).
    /// </summary>
    public static void Coalesce(BulkTransaction transaction)
    {
        transaction.CoalesceIndex = null;
        var items = transaction.Transactions;

        var segments = new int[items.Count];
        var segment = 0;
        for (var index = 0; index < items.Count; index++)
        {
            if (LayerLifecycleEvents.Contains(items[index].Event))
            {
                segment++;
            }

            segments[index] = segment;
        }

        var groupKeys = new string?[items.Count];
        var lastIndex = new Dictionary<string, int>(StringComparer.Ordinal);
        for (var index = 0; index < items.Count; index++)
        {
            var groupKey = GroupKey(items[index], segments[index]);
            groupKeys[index] = groupKey;
            if (groupKey is not null)
            {
                lastIndex[groupKey] = index;
            }
        }

        // Accumulate property bags per group in call order (later calls win per property),
        // then store the result on the last occurrence of that group.
        var accumulated = new Dictionary<string, object?[]?>(StringComparer.Ordinal);
        for (var index = 0; index < items.Count; index++)
        {
            var groupKey = groupKeys[index];
            if (groupKey is null || !IsPropertyBag(items[index].Event))
            {
                continue;
            }

            accumulated[groupKey] = accumulated.TryGetValue(groupKey, out var previous)
                ? MergePropertyBags(previous, items[index].Data)
                : items[index].Data;
        }

        foreach (var (groupKey, data) in accumulated)
        {
            items[lastIndex[groupKey]].Data = data;
        }

        for (var index = items.Count - 1; index >= 0; index--)
        {
            var groupKey = groupKeys[index];
            if (groupKey is not null && lastIndex[groupKey] != index)
            {
                items.RemoveAt(index);
            }
        }
    }

    private static void RemovePropertyBagKeys(Dictionary<string, int> index)
    {
        foreach (var key in index.Keys.Where(IsPropertyBagKey).ToArray())
        {
            index.Remove(key);
        }
    }

    private static bool IsPropertyBagKey(string key) =>
        key.StartsWith("setPaintProperties:", StringComparison.Ordinal)
        || key.StartsWith("setLayoutProperties:", StringComparison.Ordinal);

    private static bool IsPropertyBag(string eventName) =>
        eventName is "setPaintProperties" or "setLayoutProperties";

    private static string? GroupKey(Transaction item, int segment)
    {
        var key = Key(item.Event, item.Data);
        if (key is null)
        {
            return null;
        }

        return IsPropertyBag(item.Event) ? $"{key}@{segment}" : key;
    }

    /// <summary>
    /// Combines two <c>(layerId, properties, options)</c> payloads; keys from <paramref name="newer"/> win.
    /// </summary>
    private static object?[] MergePropertyBags(object?[]? older, object?[]? newer)
    {
        var merged = new Dictionary<string, object?>(StringComparer.Ordinal);
        foreach (var source in new[] { older, newer })
        {
            if (source is { Length: > 1 } && source[1] is System.Collections.IEnumerable)
            {
                foreach (var pair in ToPairs(source[1]!))
                {
                    merged[pair.Key] = pair.Value;
                }
            }
        }

        var options = newer is { Length: > 2 } ? newer[2] : older is { Length: > 2 } ? older[2] : null;
        return [newer?[0] ?? older?[0], merged, options];
    }

    private static IEnumerable<KeyValuePair<string, object?>> ToPairs(object properties)
    {
        if (properties is System.Collections.IDictionary dictionary)
        {
            foreach (System.Collections.DictionaryEntry entry in dictionary)
            {
                yield return new KeyValuePair<string, object?>(entry.Key.ToString() ?? string.Empty, entry.Value);
            }

            yield break;
        }

        foreach (var pair in (System.Collections.IEnumerable)properties)
        {
            if (pair is KeyValuePair<string, object> typed)
            {
                yield return new KeyValuePair<string, object?>(typed.Key, typed.Value);
            }
        }
    }

    private static string? Key(string eventName, object?[]? data)
    {
        var first = data is { Length: > 0 } ? data[0]?.ToString() ?? "" : "";
        var second = data is { Length: > 1 } ? data[1]?.ToString() ?? "" : "";
        return eventName switch
        {
            "setSourceData" or "setSourceDataAsJson" or "setSourceTiles"
                => $"{eventName}:{first}",
            "setPaintProperty" or "setLayoutProperty"
                => $"{eventName}:{first}:{second}",
            "setPaintProperties" or "setLayoutProperties" or "setFilter" or "setLayerZoomRange"
                => $"{eventName}:{first}",
            _ => null
        };
    }
}
