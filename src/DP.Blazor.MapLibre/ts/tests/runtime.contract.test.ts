import assert from 'node:assert/strict';
import test from 'node:test';
import { createGeoJsonSkipCache, payloadKeyFromValue } from '../src/geojson-skip.ts';
import { createScheduler } from '../src/scheduler.ts';
import { coalesceTransactions } from '../src/transaction-coalesce.ts';
import {
    createOverlayStore,
    forgetSource,
    recordLayer,
    recordSource,
    recordSourceData,
    replayOverlay,
} from '../src/runtime-overlay.ts';

test('geojson skip cache ignores identical payloads', () => {
    const cache = createGeoJsonSkipCache();
    const key = payloadKeyFromValue('{"type":"FeatureCollection","features":[]}');
    assert.equal(cache.shouldSkip('src', key), false);
    cache.remember('src', key);
    assert.equal(cache.shouldSkip('src', key), true);
    cache.forget('src');
    assert.equal(cache.shouldSkip('src', key), false);
});

test('scheduler latest-wins per key', () => {
    const queued = [];
    const scheduler = createScheduler(
        (callback) => {
            queued.push(callback);
            return queued.length;
        },
        () => {},
    );

    const calls = [];
    scheduler.markDirty('a', () => calls.push('first'));
    scheduler.markDirty('a', () => calls.push('second'));
    queued[0](0);
    assert.deepEqual(calls, ['second']);
});

test('coalesceTransactions keeps last setSourceData per id', () => {
    const result = coalesceTransactions([
        { event: 'addSource', data: ['a'] },
        { event: 'setSourceData', data: ['a', '1'] },
        { event: 'setSourceData', data: ['a', '2'] },
        { event: 'addLayer', data: ['layer'] },
    ]);
    assert.equal(result.length, 3);
    assert.equal(result[1].data[1], '2');
});

test('runtime overlay replays missing sources and layers', async () => {
    const store = createOverlayStore();
    recordSource(store, 'pts', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
    recordLayer(store, { id: 'pts-circle', type: 'circle', source: 'pts' });
    recordSourceData(store, 'pts', { type: 'FeatureCollection', features: [{ type: 'Feature' }] });

    const added = [];
    const map = {
        getSource: () => undefined,
        getLayer: () => undefined,
        addSource: (id, spec) => added.push(['source', id, spec]),
        addLayer: (spec) => added.push(['layer', spec.id]),
    };

    await replayOverlay(map, store, async () => {});
    assert.equal(added[0][0], 'source');
    assert.equal(added[1][0], 'layer');
    forgetSource(store, 'pts');
    assert.equal(store.layers.length, 0);
});
