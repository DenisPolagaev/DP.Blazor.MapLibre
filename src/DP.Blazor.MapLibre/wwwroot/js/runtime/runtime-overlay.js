function clone(value) {
    if (value === undefined || value === null || typeof value !== 'object') {
        return value;
    }
    return JSON.parse(JSON.stringify(value));
}
export function createOverlayStore() {
    return {
        sources: new Map(),
        layers: [],
        images: new Map(),
    };
}
export function recordSource(store, id, spec) {
    store.sources.set(id, clone(spec));
}
export function recordSourceData(store, id, data) {
    const spec = store.sources.get(id);
    if (spec && typeof spec === 'object') {
        spec.data = clone(data);
        return;
    }
    store.sources.set(id, { type: 'geojson', data: clone(data) });
}
export function recordSourceTiles(store, id, tiles) {
    const spec = store.sources.get(id);
    if (spec && typeof spec === 'object') {
        spec.tiles = clone(tiles);
    }
}
export function recordSourceUrl(store, id, url) {
    const spec = store.sources.get(id);
    if (spec && typeof spec === 'object') {
        spec.url = url;
    }
}
export function forgetSource(store, id) {
    store.sources.delete(id);
    store.layers = store.layers.filter((layer) => layer.spec['source'] !== id);
}
export function recordLayer(store, spec, beforeId) {
    const id = String(spec['id'] ?? '');
    if (!id) {
        return;
    }
    const cloned = { spec: clone(spec), beforeId: beforeId ?? null };
    const index = store.layers.findIndex((layer) => String(layer.spec['id'] ?? '') === id);
    if (index >= 0) {
        store.layers[index] = cloned;
        return;
    }
    store.layers.push(cloned);
}
export function forgetLayer(store, id) {
    store.layers = store.layers.filter((layer) => String(layer.spec['id'] ?? '') !== id);
}
export function recordImage(store, id, url, options) {
    store.images.set(id, { id, url, options: clone(options) });
}
export function forgetImage(store, id) {
    store.images.delete(id);
}
export function clearOverlay(store) {
    store.sources.clear();
    store.layers = [];
    store.images.clear();
}
export function snapshotOverlay(store) {
    return {
        sources: [...store.sources.entries()].map(([id, spec]) => ({ id, spec: clone(spec) })),
        layers: store.layers.map((layer) => ({ spec: clone(layer.spec), beforeId: layer.beforeId })),
        images: [...store.images.values()].map((image) => ({ ...image, options: clone(image.options) })),
    };
}
export async function replayOverlay(map, store, addImage) {
    const snapshot = snapshotOverlay(store);
    for (const image of snapshot.images) {
        if (map.hasImage?.(image.id)) {
            continue;
        }
        await addImage(image.id, image.url, image.options);
    }
    for (const source of snapshot.sources) {
        if (!map.getSource(source.id)) {
            map.addSource(source.id, clone(source.spec));
        }
    }
    for (const layer of snapshot.layers) {
        const id = String(layer.spec['id'] ?? '');
        if (!id || map.getLayer(id)) {
            continue;
        }
        const beforeId = layer.beforeId && map.getLayer(layer.beforeId) ? layer.beforeId : undefined;
        map.addLayer(clone(layer.spec), beforeId ?? undefined);
    }
}
const overlays = new Map();
export function overlayFor(container) {
    let store = overlays.get(container);
    if (!store) {
        store = createOverlayStore();
        overlays.set(container, store);
    }
    return store;
}
export function disposeOverlay(container) {
    overlays.delete(container);
}
//# sourceMappingURL=runtime-overlay.js.map