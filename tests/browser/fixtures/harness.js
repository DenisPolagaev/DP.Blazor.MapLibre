/**
 * Browser harness mirroring MapLibre.razor.js lifecycle contracts:
 * listener registry + throttle cancel + idempotent remove + diagnostics.
 */
const mapInstances = {};
const listenerRegistry = {};

function createMapEventHandler(callback, throttleMs) {
  let lastInvoke = 0;
  let throttleTimer = null;
  let pendingEvent = null;
  let cancelled = false;

  const handler = function (e) {
    if (cancelled) return;
    const payload = {
      type: e?.type ?? null,
      point: e?.point ? { x: e.point.x, y: e.point.y } : null,
      lngLat: e?.lngLat ? { lng: e.lngLat.lng, lat: e.lngLat.lat } : null,
    };

    if (!throttleMs || throttleMs <= 0) {
      callback(payload);
      return;
    }

    const now = Date.now();
    if (now - lastInvoke >= throttleMs) {
      lastInvoke = now;
      callback(payload);
      return;
    }

    pendingEvent = payload;
    if (throttleTimer === null) {
      throttleTimer = setTimeout(() => {
        throttleTimer = null;
        if (cancelled || pendingEvent === null) {
          pendingEvent = null;
          return;
        }
        lastInvoke = Date.now();
        callback(pendingEvent);
        pendingEvent = null;
      }, throttleMs - (now - lastInvoke));
    }
  };

  handler.cancel = () => {
    cancelled = true;
    pendingEvent = null;
    if (throttleTimer !== null) {
      clearTimeout(throttleTimer);
      throttleTimer = null;
    }
  };

  return handler;
}

function on(container, eventType, callback, layerIds, throttleMs) {
  const map = mapInstances[container];
  if (!map) throw new Error(`map '${container}' missing`);
  const handler = createMapEventHandler(callback, throttleMs);
  if (layerIds == null) map.on(eventType, handler);
  else map.on(eventType, layerIds, handler);
  const listenerId = crypto.randomUUID();
  listenerRegistry[listenerId] = { container, eventType, handler, layerIds };
  return listenerId;
}

function off(container, listenerId) {
  const entry = listenerRegistry[listenerId];
  if (!entry || entry.container !== container) return;
  entry.handler?.cancel?.();
  const map = mapInstances[container];
  if (map) {
    if (entry.layerIds == null) map.off(entry.eventType, entry.handler);
    else map.off(entry.eventType, entry.layerIds, entry.handler);
  }
  delete listenerRegistry[listenerId];
}

function offAll(container) {
  for (const [listenerId, entry] of Object.entries(listenerRegistry)) {
    if (entry.container === container) off(container, listenerId);
  }
}

function remove(container) {
  offAll(container);
  if (mapInstances[container]) {
    mapInstances[container].remove();
    delete mapInstances[container];
  }
}

function getLifecycleDiagnostics() {
  return {
    maps: Object.keys(mapInstances).length,
    listeners: Object.keys(listenerRegistry).length,
  };
}

async function createMap(containerId) {
  const host = document.getElementById('map');
  if (!host) {
    throw new Error('Harness container #map is missing.');
  }

  // Reuse a clean host: previous map.remove() should have emptied it, but CI headless
  // can leave a half-initialized MapLibre root after WebGL pressure.
  host.replaceChildren();

  let map;
  try {
    map = new maplibregl.Map({
      container: host,
      style: {
        version: 8,
        sources: {
          points: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  properties: { id: '1' },
                  geometry: { type: 'Point', coordinates: [0, 0] },
                },
              ],
            },
            cluster: true,
            clusterRadius: 50,
            clusterMaxZoom: 14,
          },
        },
        layers: [
          {
            id: 'points-circle',
            type: 'circle',
            source: 'points',
            paint: { 'circle-radius': 6, 'circle-color': '#088' },
          },
        ],
      },
      center: [0, 0],
      zoom: 1,
      attributionControl: false,
      failIfMajorPerformanceCaveat: false,
    });
  } catch (error) {
    throw new Error(`createMap('${containerId}') constructor failed: ${error?.message ?? error}`);
  }

  try {
    if (!map.loaded()) {
      await map.once('load');
    }
  } catch (error) {
    try {
      map.remove();
    } catch {
      // ignore cleanup failures
    }
    throw new Error(`createMap('${containerId}') load failed: ${error?.message ?? error}`);
  }

  mapInstances[containerId] = map;
  return map;
}

async function applyViewState(containerId, state) {
  const map = mapInstances[containerId];
  if (!map) {
    throw new Error(`applyViewState: map '${containerId}' missing`);
  }

  map.jumpTo({
    center: state.center,
    zoom: state.zoom,
    bearing: state.bearing,
    pitch: state.pitch,
    padding: state.padding,
  });
}

async function setGeoJson(containerId, sourceId, data) {
  const map = mapInstances[containerId];
  if (!map) {
    throw new Error(`setGeoJson: map '${containerId}' missing`);
  }

  const source = map.getSource(sourceId);
  if (!source || typeof source.setData !== 'function') {
    throw new Error(`setGeoJson: source '${sourceId}' missing or has no setData`);
  }

  source.setData(data);

  // Wait until the source has been reprocessed / redrawn.
  if (!map.isStyleLoaded() || map.areTilesLoaded?.() === false) {
    await map.once('idle');
  } else {
    await new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });
  }
}

async function queryRendered(containerId, layers) {
  const map = mapInstances[containerId];
  if (!map) {
    throw new Error(`queryRendered: map '${containerId}' missing`);
  }

  return map.queryRenderedFeatures({ layers });
}

async function getClusterLeaves(containerId, sourceId, clusterId, limit = 10, offset = 0) {
  const map = mapInstances[containerId];
  if (!map) {
    throw new Error(`getClusterLeaves: map '${containerId}' missing`);
  }

  const source = map.getSource(sourceId);
  if (!source || typeof source.getClusterLeaves !== 'function') {
    throw new Error(`Source '${sourceId}' does not support getClusterLeaves.`);
  }

  // MapLibre GL JS 5.x returns a Promise from getClusterLeaves(clusterId, limit, offset).
  return await source.getClusterLeaves(clusterId, limit, offset);
}

window.__mapHarness = {
  createMap,
  on,
  off,
  offAll,
  remove,
  getLifecycleDiagnostics,
  applyViewState,
  setGeoJson,
  queryRendered,
  getClusterLeaves,
};
