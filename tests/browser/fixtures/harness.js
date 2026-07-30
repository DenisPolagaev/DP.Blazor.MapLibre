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
  const map = new maplibregl.Map({
    container: 'map',
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
              {
                type: 'Feature',
                properties: { cluster_id: 9, point_count: 4 },
                geometry: { type: 'Point', coordinates: [1, 1] },
              },
            ],
          },
          cluster: true,
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
  });

  await map.once('load');
  mapInstances[containerId] = map;
  return map;
}

async function applyViewState(containerId, state) {
  const map = mapInstances[containerId];
  map.jumpTo({
    center: state.center,
    zoom: state.zoom,
    bearing: state.bearing,
    pitch: state.pitch,
    padding: state.padding,
  });
}

async function setGeoJson(containerId, sourceId, data) {
  mapInstances[containerId].getSource(sourceId).setData(data);
}

async function queryRendered(containerId, layers) {
  return mapInstances[containerId].queryRenderedFeatures({ layers });
}

async function getClusterLeaves(containerId, sourceId, clusterId, limit = 10, offset = 0) {
  const source = mapInstances[containerId].getSource(sourceId);
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
