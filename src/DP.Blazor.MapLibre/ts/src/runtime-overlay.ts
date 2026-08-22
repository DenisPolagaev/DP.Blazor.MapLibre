export type OverlaySource = { id: string; spec: unknown };
export type OverlayLayer = { spec: Record<string, unknown>; beforeId?: string | null };
export type OverlayImage = { id: string; url: string; options?: unknown };

export type OverlayStore = {
    sources: Map<string, unknown>;
    layers: OverlayLayer[];
    images: Map<string, OverlayImage>;
};

export type OverlayMapLike = {
    getSource: (id: string) => unknown;
    getLayer: (id: string) => unknown;
    addSource: (id: string, spec: unknown) => void;
    addLayer: (spec: unknown, beforeId?: string) => void;
    hasImage?: (id: string) => boolean;
};

function clone<T>(value: T): T {
    if (value === undefined || value === null || typeof value !== 'object') {
        return value;
    }

    return JSON.parse(JSON.stringify(value)) as T;
}

export function createOverlayStore(): OverlayStore {
    return {
        sources: new Map(),
        layers: [],
        images: new Map(),
    };
}

export function recordSource(store: OverlayStore, id: string, spec: unknown): void {
    store.sources.set(id, clone(spec));
}

export function recordSourceData(store: OverlayStore, id: string, data: unknown): void {
    const spec = store.sources.get(id);
    if (spec && typeof spec === 'object') {
        (spec as Record<string, unknown>).data = clone(data);
        return;
    }

    store.sources.set(id, { type: 'geojson', data: clone(data) });
}

export function recordSourceTiles(store: OverlayStore, id: string, tiles: unknown): void {
    const spec = store.sources.get(id);
    if (spec && typeof spec === 'object') {
        (spec as Record<string, unknown>).tiles = clone(tiles);
    }
}

export function recordSourceUrl(store: OverlayStore, id: string, url: string): void {
    const spec = store.sources.get(id);
    if (spec && typeof spec === 'object') {
        (spec as Record<string, unknown>).url = url;
    }
}

export function forgetSource(store: OverlayStore, id: string): void {
    store.sources.delete(id);
    store.layers = store.layers.filter((layer) => layer.spec['source'] !== id);
}

export function recordLayer(store: OverlayStore, spec: Record<string, unknown>, beforeId?: string | null): void {
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

export function forgetLayer(store: OverlayStore, id: string): void {
    store.layers = store.layers.filter((layer) => String(layer.spec['id'] ?? '') !== id);
}

export function recordImage(store: OverlayStore, id: string, url: string, options?: unknown): void {
    store.images.set(id, { id, url, options: clone(options) });
}

export function forgetImage(store: OverlayStore, id: string): void {
    store.images.delete(id);
}

export function clearOverlay(store: OverlayStore): void {
    store.sources.clear();
    store.layers = [];
    store.images.clear();
}

export function snapshotOverlay(store: OverlayStore): {
    sources: OverlaySource[];
    layers: OverlayLayer[];
    images: OverlayImage[];
} {
    return {
        sources: [...store.sources.entries()].map(([id, spec]) => ({ id, spec: clone(spec) })),
        layers: store.layers.map((layer) => ({ spec: clone(layer.spec), beforeId: layer.beforeId })),
        images: [...store.images.values()].map((image) => ({ ...image, options: clone(image.options) })),
    };
}

export async function replayOverlay(
    map: OverlayMapLike,
    store: OverlayStore,
    addImage: (id: string, url: string, options?: unknown) => Promise<void> | void,
): Promise<void> {
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

const overlays = new Map<string, OverlayStore>();

export function overlayFor(container: string): OverlayStore {
    let store = overlays.get(container);
    if (!store) {
        store = createOverlayStore();
        overlays.set(container, store);
    }

    return store;
}

export function disposeOverlay(container: string): void {
    overlays.delete(container);
}
