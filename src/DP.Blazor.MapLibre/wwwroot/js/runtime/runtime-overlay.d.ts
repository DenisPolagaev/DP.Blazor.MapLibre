export type OverlaySource = {
    id: string;
    spec: unknown;
};
export type OverlayLayer = {
    spec: Record<string, unknown>;
    beforeId?: string | null;
};
export type OverlayImage = {
    id: string;
    url: string;
    options?: unknown;
};
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
export declare function createOverlayStore(): OverlayStore;
export declare function recordSource(store: OverlayStore, id: string, spec: unknown): void;
export declare function recordSourceData(store: OverlayStore, id: string, data: unknown): void;
export declare function recordSourceTiles(store: OverlayStore, id: string, tiles: unknown): void;
export declare function recordSourceUrl(store: OverlayStore, id: string, url: string): void;
export declare function forgetSource(store: OverlayStore, id: string): void;
export declare function recordLayer(store: OverlayStore, spec: Record<string, unknown>, beforeId?: string | null): void;
export declare function forgetLayer(store: OverlayStore, id: string): void;
export declare function recordImage(store: OverlayStore, id: string, url: string, options?: unknown): void;
export declare function forgetImage(store: OverlayStore, id: string): void;
export declare function clearOverlay(store: OverlayStore): void;
export declare function snapshotOverlay(store: OverlayStore): {
    sources: OverlaySource[];
    layers: OverlayLayer[];
    images: OverlayImage[];
};
export declare function replayOverlay(map: OverlayMapLike, store: OverlayStore, addImage: (id: string, url: string, options?: unknown) => Promise<void> | void): Promise<void>;
export declare function overlayFor(container: string): OverlayStore;
export declare function disposeOverlay(container: string): void;
//# sourceMappingURL=runtime-overlay.d.ts.map