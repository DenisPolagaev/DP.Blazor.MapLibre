// Sample/experiment GeoportalMapHandle bundle — not used by DP.Geoportal.Web or the examples host.
// src/events.ts
function createCompactMapEventDto(e, options) {
  const includeGeometry = options?.includeGeometry === true;
  const rawFeatures = Array.isArray(e?.["features"]) ? e["features"] : void 0;
  const features = rawFeatures?.map((feature) => {
    const layer = feature["layer"];
    const dto = {
      id: feature["id"] ?? null,
      source: feature["source"] ?? null,
      sourceLayer: feature["sourceLayer"] ?? null,
      layerId: layer?.["id"] ?? null,
      properties: feature["properties"] ?? null
    };
    if (includeGeometry) {
      dto.geometry = feature["geometry"] ?? null;
    }
    return dto;
  });
  const point = e?.["point"];
  const lngLat = e?.["lngLat"];
  const originalEvent = e?.["originalEvent"];
  const tile = e?.["tile"];
  const tileId = tile?.["tileID"];
  const canonical = tileId?.["canonical"];
  return {
    type: e?.["type"] ?? null,
    point: point ? { x: point.x ?? 0, y: point.y ?? 0 } : null,
    lngLat: lngLat ? { lng: lngLat.lng ?? 0, lat: lngLat.lat ?? 0 } : null,
    originalEvent: originalEvent ? {
      type: originalEvent["type"] ?? null,
      button: originalEvent["button"] ?? null,
      ctrlKey: !!originalEvent["ctrlKey"],
      shiftKey: !!originalEvent["shiftKey"],
      altKey: !!originalEvent["altKey"],
      metaKey: !!originalEvent["metaKey"]
    } : null,
    layerId: features?.[0]?.layerId ?? null,
    features,
    dataType: e?.["dataType"] ?? null,
    isSourceLoaded: e?.["isSourceLoaded"] ?? null,
    sourceId: e?.["sourceId"] ?? null,
    sourceDataType: e?.["sourceDataType"] ?? null,
    sourceDataChanged: e?.["sourceDataChanged"] ?? null,
    tile: canonical ? { z: canonical.z ?? 0, x: canonical.x ?? 0, y: canonical.y ?? 0 } : tile ?? null,
    newProjection: e?.["newProjection"] ?? null,
    id: e?.["id"] ?? null
  };
}

// src/geoportal-map-handle.ts
function asPromise(run) {
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
var GeoportalMapHandle = class {
  constructor(map, containerId) {
    this.map = map;
    this.containerId = containerId;
  }
  disposed = false;
  disposers = /* @__PURE__ */ new Set();
  get id() {
    return this.containerId;
  }
  get native() {
    this.ensureAlive();
    return this.map;
  }
  onLayer(eventType, layerId, handler) {
    this.ensureAlive();
    const listener = (e) => {
      handler(createCompactMapEventDto(e));
    };
    this.map.on(eventType, layerId, listener);
    const dispose = () => {
      this.map.off(eventType, layerId, listener);
      this.disposers.delete(dispose);
    };
    this.disposers.add(dispose);
    return dispose;
  }
  queryRendered(geometry, options) {
    this.ensureAlive();
    if (geometry === void 0 || geometry === null) {
      return this.map.queryRenderedFeatures(options);
    }
    return this.map.queryRenderedFeatures(geometry, options);
  }
  setGeoJson(sourceId, data, options) {
    this.ensureAlive();
    const source = this.getSourceLike(sourceId);
    if (options?.incremental && typeof source.updateData === "function") {
      source.updateData(data);
      return;
    }
    if (typeof source.setData !== "function") {
      throw new Error(`GeoportalMapHandle.setGeoJson: source '${sourceId}' is not a GeoJSON source.`);
    }
    source.setData(data);
  }
  upsertTileSource(sourceId, spec) {
    this.ensureAlive();
    const existing = this.map.getSource(sourceId);
    const sourceSpec = {
      type: spec.type,
      tiles: spec.tiles,
      minzoom: spec.minzoom,
      maxzoom: spec.maxzoom,
      bounds: spec.bounds,
      tileSize: spec.tileSize,
      promoteId: spec.promoteId,
      attribution: spec.attribution
    };
    if (!existing) {
      this.map.addSource(sourceId, sourceSpec);
      return;
    }
    if (typeof existing.setTiles !== "function") {
      throw new Error(`Source '${sourceId}' exists but does not support setTiles.`);
    }
    const current = typeof existing.serialize === "function" ? existing.serialize() : {};
    if (tileSourceSpecNeedsReplace(current, spec)) {
      replaceTileSource(this.map, sourceId, sourceSpec);
      return;
    }
    existing.setTiles(spec.tiles);
  }
  applyViewState(state) {
    this.ensureAlive();
    const camera = {
      center: state.center,
      zoom: state.zoom,
      bearing: state.bearing,
      pitch: state.pitch,
      padding: state.padding
    };
    if (state.animate) {
      this.map.easeTo(camera);
      return;
    }
    this.map.jumpTo(camera);
  }
  getViewState() {
    this.ensureAlive();
    const center = this.map.getCenter();
    return {
      center: { lng: center.lng, lat: center.lat },
      zoom: this.map.getZoom(),
      bearing: this.map.getBearing(),
      pitch: this.map.getPitch()
    };
  }
  setFeatureState(feature, state) {
    this.ensureAlive();
    this.map.setFeatureState(feature, state);
  }
  removeFeatureState(feature, key) {
    this.ensureAlive();
    this.map.removeFeatureState(feature, key);
  }
  async getClusterLeaves(sourceId, clusterId, limit = 10, offset = 0) {
    this.ensureAlive();
    const source = this.getSourceLike(sourceId);
    if (typeof source.getClusterLeaves !== "function") {
      throw new Error(`Source '${sourceId}' does not support getClusterLeaves.`);
    }
    return asPromise((cb) => source.getClusterLeaves(clusterId, limit, offset, cb));
  }
  async getClusterChildren(sourceId, clusterId) {
    this.ensureAlive();
    const source = this.getSourceLike(sourceId);
    if (typeof source.getClusterChildren !== "function") {
      throw new Error(`Source '${sourceId}' does not support getClusterChildren.`);
    }
    return asPromise((cb) => source.getClusterChildren(clusterId, cb));
  }
  /**
   * Installs a JS-only transformRequest policy (cookie / signed URL / constant headers).
   * Do not bridge this to synchronous .NET invoke on every tile.
   */
  setJsTransformRequestPolicy(policy) {
    this.ensureAlive();
    if (!policy) {
      this.map.setTransformRequest(null);
      return;
    }
    this.map.setTransformRequest(((url, resourceType) => {
      const result = policy(url, resourceType);
      return result ?? { url };
    }));
  }
  dispose() {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    for (const dispose of [...this.disposers]) {
      try {
        dispose();
      } catch {
      }
    }
    this.disposers.clear();
  }
  getSourceLike(sourceId) {
    const source = this.map.getSource(sourceId);
    if (!source) {
      throw new Error(`Source '${sourceId}' was not found.`);
    }
    return source;
  }
  ensureAlive() {
    if (this.disposed) {
      throw new Error(`GeoportalMapHandle '${this.containerId}' has been disposed.`);
    }
  }
};
function createGeoportalMapHandle(map, containerId) {
  return new GeoportalMapHandle(map, containerId);
}
function tileSourceSpecNeedsReplace(current, next) {
  return !sameSourceField(next.minzoom, current.minzoom)
    || !sameSourceField(next.maxzoom, current.maxzoom)
    || !sameSourceField(next.tileSize, current.tileSize)
    || !sameSourceField(next.bounds, current.bounds)
    || !sameSourceField(next.promoteId, current.promoteId);
}
function sameSourceField(next, current) {
  if (next == null) {
    return true;
  }
  return JSON.stringify(next) === JSON.stringify(current);
}
function replaceTileSource(map, id, source) {
  const layers = map.getStyle()?.layers ?? [];
  const dependent = [];
  let beforeId;
  for (let i = 0; i < layers.length; i++) {
    if (layers[i].source === id) {
      dependent.push(layers[i]);
      beforeId = void 0;
    } else if (dependent.length > 0 && beforeId === void 0) {
      beforeId = layers[i].id;
    }
  }
  for (const layer of dependent) {
    map.removeLayer(layer.id);
  }
  map.removeSource(id);
  map.addSource(id, source);
  for (const layer of dependent) {
    map.addLayer(layer, beforeId);
  }
}
export {
  GeoportalMapHandle,
  createCompactMapEventDto,
  createGeoportalMapHandle
};
//# sourceMappingURL=geoportal-map-facade.js.map
