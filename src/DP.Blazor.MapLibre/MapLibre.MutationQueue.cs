using DP.Blazor.MapLibre.Models;
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
        "setVectorSourceTiles",
        "upsertTileSource",
        "setSourceUrl",
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
    private Task? _flushTask;

    private void ScheduleMutationFlush()
    {
        if (_explicitTransaction || _flushScheduled || _jsModule is null)
        {
            return;
        }

        _flushScheduled = true;
        _flushTask = FlushAfterYieldAsync();
    }

    private async Task FlushAfterYieldAsync()
    {
        try
        {
            await Task.Yield();
            if (!_explicitTransaction)
            {
                await FlushQueuedMutationsAsync();
            }
        }
        finally
        {
            _flushScheduled = false;
        }
    }

    private async ValueTask FlushQueuedMutationsAsync()
    {
        if (_explicitTransaction || _bulkTransaction is null || _bulkTransaction.Transactions.Count == 0 || _jsModule is null)
        {
            return;
        }

        BulkTransactionCoalescer.Coalesce(_bulkTransaction);
        var batch = _bulkTransaction;
        _bulkTransaction = null;
        await _jsModule.InvokeVoidAsync("executeTransaction", JsContainerId, batch.Transactions);
    }

    private async ValueTask InvokeMapJsVoidAsync(string identifier, params object?[] args)
    {
        if (!_explicitTransaction && QueuedMutationEvents.Contains(identifier))
        {
            EnqueueQueuedMutation(identifier, SkipContainer(args));
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
/// </summary>
public static class BulkTransactionCoalescer
{
    public static void Enqueue(BulkTransaction transaction, string eventName, params object?[]? data)
    {
        var key = Key(eventName, data);
        if (key is not null)
        {
            var existing = transaction.Transactions.FindIndex(item => Key(item.Event, item.Data) == key);
            if (existing >= 0)
            {
                transaction.Transactions.RemoveAt(existing);
            }
        }

        transaction.Add(eventName, data);
    }

    public static void Coalesce(BulkTransaction transaction)
    {
        var lastIndex = new Dictionary<string, int>(StringComparer.Ordinal);
        for (var index = 0; index < transaction.Transactions.Count; index++)
        {
            var key = Key(transaction.Transactions[index].Event, transaction.Transactions[index].Data);
            if (key is not null)
            {
                lastIndex[key] = index;
            }
        }

        for (var index = transaction.Transactions.Count - 1; index >= 0; index--)
        {
            var key = Key(transaction.Transactions[index].Event, transaction.Transactions[index].Data);
            if (key is not null && lastIndex[key] != index)
            {
                transaction.Transactions.RemoveAt(index);
            }
        }
    }

    private static string? Key(string eventName, object?[]? data)
    {
        var first = data is { Length: > 0 } ? data[0]?.ToString() ?? "" : "";
        var second = data is { Length: > 1 } ? data[1]?.ToString() ?? "" : "";
        return eventName switch
        {
            "setSourceData" or "setSourceDataAsJson" or "setSourceTiles" or "setVectorSourceTiles" or "setSourceUrl"
                => $"{eventName}:{first}",
            "setPaintProperty" or "setLayoutProperty"
                => $"{eventName}:{first}:{second}",
            "setPaintProperties" or "setLayoutProperties" or "setFilter" or "setLayerZoomRange"
                => $"{eventName}:{first}",
            _ => null
        };
    }
}
