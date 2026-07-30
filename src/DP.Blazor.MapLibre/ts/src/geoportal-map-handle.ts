import type { Map as MapLibreMap, MapLayerMouseEvent } from 'maplibre-gl';
import { createCompactMapEventDto } from './events.js';
import type {
  ApplyViewStateOptions,
  Disposer,
  GeoJsonSetOptions,
  JsTransformRequestPolicy,
  MapViewState,
  TileSourceSpec,
} from './types.js';

interface ClusterSourceLike {
  setData?: (data: unknown) => void;
  updateData?: (data: unknown) => void;
  setTiles?: (tiles: string[]) => void;
  getClusterLeaves?: (
    clusterId: number,
    limit: number,
    offset: number,
    callback: (error: Error | null, features: unknown[]) => void,
  ) => void;
  getClusterChildren?: (
    clusterId: number,
    callback: (error: Error | null, features: unknown[]) => void,
  ) => void;
}

function asPromise<T>(
  run: (cb: (error: Error | null, value: T) => void) => void,
): Promise<T> {
  return new Promise((resolve, reject) => {
    run((error, value) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(value);
    });
  });
}

/**
 * Typed handle for a single MapLibre map instance used by Geoportal.
 * All subscriptions return disposers; dispose() is idempotent.
 */
export class GeoportalMapHandle {
  private disposed = false;
  private readonly disposers = new Set<Disposer>();

  constructor(
    private readonly map: MapLibreMap,
    private readonly containerId: string,
  ) {}

  get id(): string {
    return this.containerId;
  }

  get native(): MapLibreMap {
    this.ensureAlive();
    return this.map;
  }

  onLayer(
    eventType: string,
    layerId: string | string[],
    handler: (event: ReturnType<typeof createCompactMapEventDto>) => void,
  ): Disposer {
    this.ensureAlive();
    const listener = (e: MapLayerMouseEvent) => {
      handler(createCompactMapEventDto(e as unknown as Record<string, unknown>));
    };

    this.map.on(eventType as 'click', layerId as string, listener);
    const dispose: Disposer = () => {
      this.map.off(eventType as 'click', layerId as string, listener);
      this.disposers.delete(dispose);
    };
    this.disposers.add(dispose);
    return dispose;
  }

  queryRendered(geometry?: unknown, options?: object): unknown[] {
    this.ensureAlive();
    if (geometry === undefined || geometry === null) {
      return this.map.queryRenderedFeatures(options as never);
    }

    return this.map.queryRenderedFeatures(geometry as never, options as never);
  }

  setGeoJson(sourceId: string, data: unknown, options?: GeoJsonSetOptions): void {
    this.ensureAlive();
    const source = this.getSourceLike(sourceId);
    if (options?.incremental && typeof source.updateData === 'function') {
      source.updateData(data);
      return;
    }

    if (typeof source.setData !== 'function') {
      throw new Error(`GeoportalMapHandle.setGeoJson: source '${sourceId}' is not a GeoJSON source.`);
    }

    source.setData(data);
  }

  upsertTileSource(sourceId: string, spec: TileSourceSpec): void {
    this.ensureAlive();
    const existing = this.map.getSource(sourceId) as ClusterSourceLike | undefined;
    if (existing && typeof existing.setTiles === 'function') {
      existing.setTiles(spec.tiles);
      return;
    }

    if (existing) {
      this.map.removeSource(sourceId);
    }

    this.map.addSource(sourceId, {
      type: spec.type,
      tiles: spec.tiles,
      minzoom: spec.minzoom,
      maxzoom: spec.maxzoom,
      promoteId: spec.promoteId,
      attribution: spec.attribution,
    } as never);
  }

  applyViewState(state: ApplyViewStateOptions): void {
    this.ensureAlive();
    const camera = {
      center: state.center,
      zoom: state.zoom,
      bearing: state.bearing,
      pitch: state.pitch,
      padding: state.padding,
    };

    if (state.animate) {
      this.map.easeTo(camera as never);
      return;
    }

    this.map.jumpTo(camera as never);
  }

  getViewState(): MapViewState {
    this.ensureAlive();
    const center = this.map.getCenter();
    return {
      center: { lng: center.lng, lat: center.lat },
      zoom: this.map.getZoom(),
      bearing: this.map.getBearing(),
      pitch: this.map.getPitch(),
    };
  }

  setFeatureState(
    feature: { source: string; sourceLayer?: string; id: string | number },
    state: Record<string, unknown>,
  ): void {
    this.ensureAlive();
    this.map.setFeatureState(feature, state);
  }

  removeFeatureState(
    feature: { source: string; sourceLayer?: string; id?: string | number },
    key?: string,
  ): void {
    this.ensureAlive();
    this.map.removeFeatureState(feature as never, key);
  }

  async getClusterLeaves(sourceId: string, clusterId: number, limit = 10, offset = 0): Promise<unknown[]> {
    this.ensureAlive();
    const source = this.getSourceLike(sourceId);
    if (typeof source.getClusterLeaves !== 'function') {
      throw new Error(`Source '${sourceId}' does not support getClusterLeaves.`);
    }

    return asPromise((cb) => source.getClusterLeaves!(clusterId, limit, offset, cb));
  }

  async getClusterChildren(sourceId: string, clusterId: number): Promise<unknown[]> {
    this.ensureAlive();
    const source = this.getSourceLike(sourceId);
    if (typeof source.getClusterChildren !== 'function') {
      throw new Error(`Source '${sourceId}' does not support getClusterChildren.`);
    }

    return asPromise((cb) => source.getClusterChildren!(clusterId, cb));
  }

  /**
   * Installs a JS-only transformRequest policy (cookie / signed URL / constant headers).
   * Do not bridge this to synchronous .NET invoke on every tile.
   */
  setJsTransformRequestPolicy(policy: JsTransformRequestPolicy | null): void {
    this.ensureAlive();
    if (!policy) {
      this.map.setTransformRequest(null as never);
      return;
    }

    this.map.setTransformRequest(((url: string, resourceType?: string) => {
      const result = policy(url, resourceType);
      return result ?? { url };
    }) as never);
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }

    this.disposed = true;
    for (const dispose of [...this.disposers]) {
      try {
        dispose();
      } catch {
        // ignore disposer failures during teardown
      }
    }

    this.disposers.clear();
  }

  private getSourceLike(sourceId: string): ClusterSourceLike {
    const source = this.map.getSource(sourceId) as ClusterSourceLike | undefined;
    if (!source) {
      throw new Error(`Source '${sourceId}' was not found.`);
    }

    return source;
  }

  private ensureAlive(): void {
    if (this.disposed) {
      throw new Error(`GeoportalMapHandle '${this.containerId}' has been disposed.`);
    }
  }
}

export function createGeoportalMapHandle(map: MapLibreMap, containerId: string): GeoportalMapHandle {
  return new GeoportalMapHandle(map, containerId);
}
