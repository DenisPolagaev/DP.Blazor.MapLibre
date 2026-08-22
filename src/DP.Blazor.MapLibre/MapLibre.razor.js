import splitGeoJSON from './geojson-antimeridian-cut/cut.js'
import {
    coalesceTransactions,
    disposeOverlay,
    disposeSkipCache,
    forgetImage,
    forgetLayer,
    forgetSource,
    overlayFor,
    payloadKeyFromValue,
    recordImage,
    recordLayer,
    recordSource,
    recordSourceData,
    recordSourceTiles,
    recordSourceUrl,
    replayOverlay,
    skipCacheFor,
} from './js/runtime/index.js'

const mapInstances = globalThis.__blazorMapLibreMapInstances ??= {};
const optionsInstances = globalThis.__blazorMapLibreOptionsInstances ??= {};
const projectionInstances = globalThis.__blazorMapLibreProjectionInstances ??= {};
const markerInstances = globalThis.__blazorMapLibreMarkerInstances ??= {};
const popupInstances = globalThis.__blazorMapLibrePopupInstances ??= {};
const currentLocationMarkerInstances = globalThis.__blazorMapLibreCurrentLocationMarkers ??= {};
const markerListenerRegistry = globalThis.__blazorMapLibreMarkerListeners ??= {};
const popupListenerRegistry = globalThis.__blazorMapLibrePopupListeners ??= {};
const markerContainers = globalThis.__blazorMapLibreMarkerContainers ??= {};
const popupContainers = globalThis.__blazorMapLibrePopupContainers ??= {};
const scaleControlInstances = globalThis.__blazorMapLibreScaleControls ??= {};
const listenerRegistry = globalThis.__blazorMapLibreListenerRegistry ??= {};

/**
 * Ensures maplibre-gl is on globalThis before creating maps.
 * MapLibre GL JS v6 is ESM-only; we re-export the namespace onto globalThis
 * so plugins and existing interop that expect window.maplibregl keep working.
 * Does not load any plugins.
 */
export async function prepareMapLibreGl() {
    if (globalThis.maplibregl?.Map) {
        return;
    }

    const maplibre = await import('./maplibre-gl/dist/maplibre-gl.mjs');
    globalThis.maplibregl = maplibre;

    if (!globalThis.maplibregl?.Map) {
        throw new Error('MapLibre GL JS is not available on globalThis.maplibregl');
    }
}

/**
 * Cuts the GeoJSON source at the antimeridian if the option is enabled.
 *
 * @param {string} container - The identifier for the map container instance.
 * @param {Object} data - The GeoJSON data you wish to apply to the source
 * @returns {Object} - The GeoJSON data with the antimeridian cut if the option is enabled
 */
function cutAntiMeridian(container, data) {
    if (optionsInstances[container]?.cutAtAntimeridian !== true) {
        return data;
    }

    return splitGeoJSON(data);
}

const customLayerHandlers = new Map();

const REQUEST_METHODS = new Set(['GET', 'POST', 'PUT']);
const REQUEST_CREDENTIALS = new Set(['same-origin', 'include']);
const RESPONSE_BODY_TYPES = new Set(['string', 'json', 'arrayBuffer', 'image']);

/**
 * Normalizes a .NET transformRequest payload to MapLibre GL JS RequestParameters.
 * MapLibre passes the result directly to fetch/XMLHttpRequest; optional fields must be
 * omitted rather than set to null. See maplibre-gl-js src/util/ajax.ts and request_manager.ts.
 * @param {unknown} result
 * @param {string} fallbackUrl
 * @returns {{ url: string, headers?: object, method?: string, body?: string, type?: string, credentials?: string, collectResourceTiming?: boolean, cache?: string, referrerPolicy?: string }}
 */
function normalizeRequestParameters(result, fallbackUrl) {
    const source = result && typeof result === 'object' ? result : {};
    const normalized = {
        url: typeof source.url === 'string' && source.url.length > 0 ? source.url : fallbackUrl
    };

    if (source.headers && typeof source.headers === 'object' && !Array.isArray(source.headers)) {
        normalized.headers = source.headers;
    }

    if (REQUEST_METHODS.has(source.method)) {
        normalized.method = source.method;
    }

    if (typeof source.body === 'string') {
        normalized.body = source.body;
    }

    if (RESPONSE_BODY_TYPES.has(source.type)) {
        normalized.type = source.type;
    }

    if (REQUEST_CREDENTIALS.has(source.credentials)) {
        normalized.credentials = source.credentials;
    }

    if (source.collectResourceTiming === true) {
        normalized.collectResourceTiming = true;
    }

    if (typeof source.cache === 'string' && source.cache.length > 0) {
        normalized.cache = source.cache;
    }

    if (typeof source.referrerPolicy === 'string' && source.referrerPolicy.length > 0) {
        normalized.referrerPolicy = source.referrerPolicy;
    }

    return normalized;
}

function createTransformRequestFn(dotnetReference) {
    return (url, resourceType) => {
        const payload = JSON.stringify({ url, resourceType });
        const resultJson = dotnetReference.invokeMethod('Invoke', payload);

        try {
            return normalizeRequestParameters(JSON.parse(resultJson), url);
        } catch {
            return { url };
        }
    };
}

function createTransformConstrainFn(dotnetReference) {
    return (transform) => {
        const payload = JSON.stringify({
            center: transform.center,
            zoom: transform.zoom,
            bearing: transform.bearing,
            pitch: transform.pitch,
            roll: transform.roll,
            elevation: transform.elevation,
        });

        const resultJson = dotnetReference.invokeMethod('Invoke', payload);
        const result = JSON.parse(resultJson);
        if (result.center) {
            transform.center = result.center;
        }
        if (result.zoom !== undefined) {
            transform.zoom = result.zoom;
        }
        if (result.bearing !== undefined) {
            transform.bearing = result.bearing;
        }
        if (result.pitch !== undefined) {
            transform.pitch = result.pitch;
        }
        if (result.roll !== undefined) {
            transform.roll = result.roll;
        }
        if (result.elevation !== undefined) {
            transform.elevation = result.elevation;
        }

        return transform;
    };
}

function resolveContainerKey(container) {
    if (typeof container === 'string') {
        return container;
    }

    if (container && typeof container === 'object' && container.id) {
        return container.id;
    }

    return null;
}

function resolveContainerElement(container) {
    if (typeof container === 'string') {
        return document.getElementById(container);
    }

    return container;
}

/**
 * Initializes a MapLibre map instance with the given options and connects it to a .NET reference for interop functionality.
 *
 * @param {Object} options - Configuration options for initializing the MapLibre map instance.
 * @param {Object} dotnetReference - A .NET instance reference for invoking interop methods.
 * @param {Object} [transformConstrainReference] - Optional .NET reference for transformConstrain callback.
 */
export async function initializeMap(options, dotnetReference, transformConstrainReference) {
    await prepareMapLibreGl();

    if (transformConstrainReference) {
        options = {
            ...options,
            transformConstrain: createTransformConstrainFn(transformConstrainReference),
        };
    }

    const containerKey = resolveContainerKey(options?.container);
    if (!containerKey) {
        throw new Error('MapOptions.container must be a DOM element id or an element with an id.');
    }

    const containerElement = resolveContainerElement(options.container);
    if (!containerElement) {
        throw new Error(`Map container element "${containerKey}" was not found in the DOM.`);
    }

    const preserveRuntimeOverlay = options?.preserveRuntimeOverlayOnStyleChange !== false;
    const mapConstructorOptions = { ...options };
    delete mapConstructorOptions.preserveRuntimeOverlayOnStyleChange;

    if (options?.projection) {
        projectionInstances[containerKey] = options.projection;
    }

    const userTransformStyle = options?.transformStyle;
    const transformStyle = (previousStyle, nextStyle) => {
        let style = nextStyle;
        if (typeof userTransformStyle === 'function') {
            style = userTransformStyle(previousStyle, nextStyle) ?? style;
        }
        const activeProj = projectionInstances[containerKey];
        if (activeProj && style && typeof style === 'object' && !style.projection) {
            style = { ...style, projection: activeProj };
        }
        return style;
    };

    const map = new globalThis.maplibregl.Map({
        ...mapConstructorOptions,
        transformStyle,
        container: containerElement,
    });

    optionsInstances[containerKey] = options;
    mapInstances[containerKey] = map;

    const invokeLoadCallback = () => {
        dotnetReference.invokeMethodAsync("OnLoadCallback").catch(console.error);
    };

    map.on('style.load', () => {
        const replay = preserveRuntimeOverlay
            ? replayOverlay(map, overlayFor(containerKey), (id, url, imageOptions) => addImage(containerKey, id, url, imageOptions))
            : Promise.resolve();
        replay
            .catch((error) => console.error('MapLibre runtime overlay replay failed.', error))
            .finally(() => {
                dotnetReference.invokeMethodAsync("OnStyleLoadCallback").catch(console.error);
            });
    });

    // Central async error reporting for failed style fetches and source/tile loads.
    // We forward a compact DTO to .NET to allow UI to dismiss "loading" overlays.
    map.on('error', (e) => {
        const payload = {
            type: 'error',
            resourceType: e?.resourceType ?? null,
            sourceId: e?.sourceId ?? null,
            dataType: e?.dataType ?? null,
            error: {
                message: e?.error?.message ?? e?.message ?? null,
                status: e?.error?.status ?? null,
            }
        };
        dotnetReference.invokeMethodAsync("OnErrorCallback", payload).catch(console.error);
    });

    if (map.loaded()) {
        queueMicrotask(invokeLoadCallback);
    } else {
        map.once('load', invokeLoadCallback);
    }

    return map;
}

/**
 * Returns whether a map instance is registered for the given container id.
 */
export function hasMap(container) {
    return Boolean(mapInstances[container]);
}

/**
 * Returns the MapLibre map instance for the given container id.
 *
 * @param {string} container - The map container element id.
 */
export function getMap(container) {
    return mapInstances[container];
}

/**
 * Returns the zoom level at which the given cluster expands.
 */
export async function getClusterExpansionZoom(container, sourceId, clusterId) {
    const map = requireMap(container, 'getClusterExpansionZoom');
    const source = map.getSource(sourceId);
    if (!source || typeof source.getClusterExpansionZoom !== 'function') {
        throw new Error(`Source '${sourceId}' does not support clustering.`);
    }

    return await source.getClusterExpansionZoom(clusterId);
}

/**
 * Returns leaf features contained by a cluster (GeoJSON source).
 */
export async function getClusterLeaves(container, sourceId, clusterId, limit = 10, offset = 0) {
    const map = requireMap(container, 'getClusterLeaves');
    const source = map.getSource(sourceId);
    if (!source || typeof source.getClusterLeaves !== 'function') {
        throw new Error(`Source '${sourceId}' does not support getClusterLeaves.`);
    }

    return await source.getClusterLeaves(clusterId, limit, offset);
}

/**
 * Returns the immediate children of a cluster (GeoJSON source).
 */
export async function getClusterChildren(container, sourceId, clusterId) {
    const map = requireMap(container, 'getClusterChildren');
    const source = map.getSource(sourceId);
    if (!source || typeof source.getClusterChildren !== 'function') {
        throw new Error(`Source '${sourceId}' does not support getClusterChildren.`);
    }

    return await source.getClusterChildren(clusterId);
}


function createMapEventHandler(dotnetReference, throttleMs) {
    let lastInvoke = 0;
    let throttleTimer = null;
    let pendingEvent = null;
    let cancelled = false;

    const handler = function (e) {
        if (cancelled) {
            return;
        }

        // Never mutate MapLibre's event object — clone a compact DTO instead.
        const dto = createCompactMapEventDto(e);
        const result = JSON.stringify(dto);

        if (!throttleMs || throttleMs <= 0) {
            dotnetReference.invokeMethodAsync('Invoke', result).catch(console.error);
            return;
        }

        const now = Date.now();
        if (now - lastInvoke >= throttleMs) {
            lastInvoke = now;
            dotnetReference.invokeMethodAsync('Invoke', result).catch(console.error);
            return;
        }

        pendingEvent = result;
        if (throttleTimer === null) {
            throttleTimer = setTimeout(() => {
                throttleTimer = null;
                if (cancelled || pendingEvent === null) {
                    pendingEvent = null;
                    return;
                }

                lastInvoke = Date.now();
                dotnetReference.invokeMethodAsync('Invoke', pendingEvent).catch(console.error);
                pendingEvent = null;
            }, throttleMs - (now - lastInvoke));
        }
    };

    handler.cancel = function cancel() {
        cancelled = true;
        pendingEvent = null;
        if (throttleTimer !== null) {
            clearTimeout(throttleTimer);
            throttleTimer = null;
        }
    };

    return handler;
}

/**
 * MapLibre's queryRenderedFeatures / layer events return MapGeoJSONFeature objects
 * whose geometry getter expands vector-tile coordinates. Crossing to .NET must not
 * serialize that payload (see MapLibre "Get features under the mouse pointer").
 */
function toCompactFeature(feature, includeGeometry = false) {
    return {
        type: 'Feature',
        id: feature?.id ?? null,
        source: feature?.source ?? null,
        sourceLayer: feature?.sourceLayer ?? null,
        layer: feature?.layer?.id ? { id: feature.layer.id } : null,
        layerId: feature?.layer?.id ?? null,
        properties: feature?.properties ?? null,
        geometry: includeGeometry
            ? (feature?.geometry ?? null)
            : (feature?.geometry
                ? { type: feature.geometry.type, coordinates: [] }
                : { type: 'Point', coordinates: [0, 0] })
    };
}

/**
 * Builds a compact, serializable event payload without mutating MapLibre's event.
 * Geometry is omitted by default to keep the interop cold-path small.
 */
function createCompactMapEventDto(e, options) {
    const includeGeometry = options?.includeGeometry === true;
    const features = Array.isArray(e?.features)
        ? e.features.map((feature) => toCompactFeature(feature, includeGeometry))
        : undefined;

    return {
        type: e?.type ?? null,
        point: e?.point ? { x: e.point.x, y: e.point.y } : null,
        lngLat: e?.lngLat ? { lng: e.lngLat.lng, lat: e.lngLat.lat } : null,
        originalEvent: e?.originalEvent
            ? {
                type: e.originalEvent.type ?? null,
                button: e.originalEvent.button ?? null,
                ctrlKey: !!e.originalEvent.ctrlKey,
                shiftKey: !!e.originalEvent.shiftKey,
                altKey: !!e.originalEvent.altKey,
                metaKey: !!e.originalEvent.metaKey
            }
            : null,
        layerId: e?.features?.[0]?.layer?.id ?? null,
        features,
        // Source / style data events (MapLibre 6 MapSourceDataEvent / MapStyleDataEvent).
        dataType: e?.dataType ?? null,
        isSourceLoaded: e?.isSourceLoaded ?? null,
        sourceId: e?.sourceId ?? null,
        sourceDataType: e?.sourceDataType ?? null,
        sourceDataChanged: e?.sourceDataChanged ?? null,
        tile: e?.tile?.tileID?.canonical
            ? {
                z: e.tile.tileID.canonical.z,
                x: e.tile.tileID.canonical.x,
                y: e.tile.tileID.canonical.y
            }
            : (e?.tile ?? null),
        // Projection / missing-image events.
        newProjection: e?.newProjection ?? null,
        id: e?.id ?? null
    };
}

function requireMap(container, apiName) {
    const map = mapInstances[container];
    if (!map) {
        throw new Error(`MapLibre.${apiName}: map instance '${container}' was not found. It may have been disposed.`);
    }

    return map;
}

function registerListener(container, eventType, handler, layerIds) {
    const listenerId = crypto.randomUUID();
    listenerRegistry[listenerId] = { container, eventType, handler, layerIds };
    return listenerId;
}

function attachMapListener(map, eventType, handler, layerIds) {
    if (layerIds === undefined || layerIds === null) {
        map.on(eventType, handler);
    } else {
        map.on(eventType, layerIds, handler);
    }
}

function detachMapListener(map, entry) {
    if (entry.layerIds === undefined || entry.layerIds === null) {
        map.off(entry.eventType, entry.handler);
    } else {
        map.off(entry.eventType, entry.layerIds, entry.handler);
    }
}

/**
 * Attaches an event listener to a specified map instance.
 *
 * @param {string} container - The identifier for the specific map instance.
 * @param {string} eventType - The type of event to listen for (e.g., "click", "zoom").
 * @param {object} dotnetReference - A reference to a .NET object used for invoking asynchronous methods.
 * @param {string | string[]} layerIds - Optional layer to pass when adding the event listener.
 * @returns {string} Listener id for use with off().
 */
export function on(container, eventType, dotnetReference, layerIds, throttleMs) {
    const map = requireMap(container, 'on');
    const handler = createMapEventHandler(dotnetReference, throttleMs);
    attachMapListener(map, eventType, handler, layerIds);
    return registerListener(container, eventType, handler, layerIds);
}

/**
 * Removes a previously registered event listener.
 *
 * @param {string} container - The identifier for the specific map instance.
 * @param {string} listenerId - The id returned from on() or once().
 */
export function off(container, listenerId) {
    const entry = listenerRegistry[listenerId];
    if (!entry || entry.container !== container) {
        return;
    }

    if (typeof entry.handler?.cancel === 'function') {
        entry.handler.cancel();
    }

    const map = mapInstances[container];
    if (map) {
        detachMapListener(map, entry);
    }

    delete listenerRegistry[listenerId];
}

/**
 * Removes all registered listeners for a map container, optionally filtered by event type.
 * @param {string} container - The map container identifier.
 * @param {string} [eventType] - Optional event type filter.
 */
export function offAll(container, eventType) {
    for (const [listenerId, entry] of Object.entries(listenerRegistry)) {
        if (entry.container !== container) {
            continue;
        }
        if (eventType && entry.eventType !== eventType) {
            continue;
        }
        off(container, listenerId);
    }
}

/**
 * Attaches a one-time event listener to a specified map instance.
 *
 * @param {string} container - The identifier for the specific map instance.
 * @param {string} eventType - The type of event to listen for.
 * @param {object} dotnetReference - A reference to a .NET object used for invoking asynchronous methods.
 * @param {string | string[]} layerIds - Optional layer ids.
 * @returns {string} Listener id for use with off() before the event fires.
 */
export function once(container, eventType, dotnetReference, layerIds, throttleMs) {
    const map = requireMap(container, 'once');
    const listenerId = crypto.randomUUID();
    const baseHandler = createMapEventHandler(dotnetReference, throttleMs);
    const handler = function (e) {
        baseHandler(e);
        off(container, listenerId);
    };
    handler.cancel = function cancel() {
        baseHandler.cancel();
    };

    if (layerIds === undefined || layerIds === null) {
        map.once(eventType, handler);
    } else {
        map.once(eventType, layerIds, handler);
    }

    listenerRegistry[listenerId] = { container, eventType, handler, layerIds, once: true };
    return listenerId;
}
/**
 * Adds a specified control to the given map container.
 *
 * @param {string} container - The identifier of the map container.
 * @param {string} controlType - The type of control to add. Supported types include:
 *                               "AttributionControl", "FullscreenControl", "GeolocateControl",
 *                               "GlobeControl", "LogoControl", "NavigationControl", "ScaleControl",
 *                               and "TerrainControl".
 * @param {string} position - position on the map to which the control will be added. Valid values are 'top-left', 'top-right', 'bottom-left', and 'bottom-right'. Defaults to 'top-right'.
 *
 * @throws {Error} Logs a warning if the specified control type is not supported.
 */
/**
 * Adds a control to the map.
 *
 * @param {string} container - The identifier of the map container.
 * @param {string} controlType - The type of control to add. Supported values are:
 *                               "AttributionControl", "FullscreenControl", "GeolocateControl",
 *                               "GlobeControl", "LogoControl", "NavigationControl", "ScaleControl",
 *                               and "TerrainControl".
 * @param {string} position - position on the map to which the control will be added. Valid values are 'top-left', 'top-right', 'bottom-left', and 'bottom-right'. Defaults to 'top-right'.
 * @param {Object} [options] - Options passed to the control's own constructor (e.g. `{customAttribution}`
 *                              for AttributionControl, `{showCompass, showZoom}` for NavigationControl).
 * @returns {Object|null} The created control instance (usable with hasControl/removeControl), or null if
 *                         the control type is not supported.
 *
 * @throws {Error} Logs a warning if the specified control type is not supported.
 */
export function addControl(container, controlType, position, options) {
    const map = mapInstances[container];
    const controlsMap = {
        AttributionControl: globalThis.maplibregl.AttributionControl,
        FullscreenControl: globalThis.maplibregl.FullscreenControl,
        GeolocateControl: globalThis.maplibregl.GeolocateControl,
        GlobeControl: globalThis.maplibregl.GlobeControl,
        LogoControl: globalThis.maplibregl.LogoControl,
        NavigationControl: globalThis.maplibregl.NavigationControl,
        ScaleControl: globalThis.maplibregl.ScaleControl,
        TerrainControl: globalThis.maplibregl.TerrainControl
    };

    const ControlClass = controlsMap[controlType];
    if (ControlClass) {
        // options belong to the control's own constructor (e.g. AttributionControl's
        // customAttribution); position is a separate argument to map.addControl(), not part of the
        // control's constructor at all.
        const control = new ControlClass(options);
        map.addControl(control, position);
        return control;
    }

    console.warn(`Control type '${controlType}' is not supported.`);
    return null;
}

/**
 * Adds a geolocate control to the given map container.
 *
 * @param {string} container - The identifier of the map container.
 * @param {Object} options - Configuration settings for the Geolocate Control.
 * @param {string} position - position on the map to which the control will be added. Valid values are 'top-left', 'top-right', 'bottom-left', and 'bottom-right'. Defaults to 'top-right'.
 */
export function addGeolocateControl(container, options, position) {
    const map = mapInstances[container];

    if (options === undefined || options === null) {
        map.addControl(new globalThis.maplibregl.GeolocateControl(), position || undefined);
    } else {
        map.addControl(new globalThis.maplibregl.GeolocateControl(options), position || undefined);
    }
}

/**
 * Adds a navigation control to the given map container.
 *
 * @param {string} container - The identifier of the map container.
 * @param {Object} options - Configuration settings for the Navigation Control.
 * @param {string} position - position on the map to which the control will be added. Valid values are 'top-left', 'top-right', 'bottom-left', and 'bottom-right'. Defaults to 'top-right'.
 */
export function addNavigationControl(container, options, position) {
    const map = mapInstances[container];

    if (options === undefined || options === null) {
        map.addControl(new globalThis.maplibregl.NavigationControl(), position || undefined);
    } else {
        map.addControl(new globalThis.maplibregl.NavigationControl(options), position || undefined);
    }
}


/**
 * Adds a scale control to the given map container.
 *
 * @param {string} container - The identifier of the map container.
 * @param {Object} options - Configuration settings for the Scale Control.
 * @param {string} position - position on the map to which the control will be added. Valid values are 'top-left', 'top-right', 'bottom-left', and 'bottom-right'. Defaults to 'top-right'.
 */
export function addScaleControl(container, options, position) {
    const map = mapInstances[container];
    if (!map) {
        return;
    }

    const scaleControl = (options === undefined || options === null)
        ? new globalThis.maplibregl.ScaleControl()
        : new globalThis.maplibregl.ScaleControl(options);

    map.addControl(scaleControl, position || undefined);
    scaleControlInstances[container] = scaleControl;
}

/**
 * Updates the unit of the scale control for the given map container.
 *
 * @param {string} container - The identifier of the map container.
 * @param {string} unit - The unit to set ("metric", "imperial", or "nautical").
 */
export function setScaleControlUnit(container, unit) {
    const scaleControl = scaleControlInstances[container];
    if (scaleControl) {
        scaleControl.setUnit(unit);
    }
}

/**
 * Loads an image for map.addImage. MapLibre map.loadImage uses fetch + decode and
 * cannot reliably decode SVG. For SVG (and as a fallback for other decode failures)
 * we load through HTMLImageElement, which MapLibre also accepts.
 * @param {import('maplibre-gl').Map} map
 * @param {string} url
 * @returns {Promise<HTMLImageElement|ImageBitmap|ImageData>}
 */
async function loadMapImageSource(map, url) {
    const normalizedUrl = typeof url === 'string' ? url.trim() : '';
    const isSvg = normalizedUrl.toLowerCase().includes('.svg');

    if (!isSvg) {
        try {
            const resourceResponse = await map.loadImage(url);
            return resourceResponse.data;
        } catch {
            // Fall back to HTMLImageElement below.
        }
    }

    return await loadHtmlImageElement(url);
}

function loadHtmlImageElement(url) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error(`Unable to decode map image '${url}'.`));
        image.src = url;
    });
}

/**
 * Asynchronously adds an image to a map instance for the specified container.
 *
 * @param {string} container - The identifier of the map container.
 * @param {string} id - The unique identifier for the image to add.
 * @param {string} url - The URL from which the image should be loaded.
 * @param {Object} [options] - Optional configuration settings for the image.
 * @returns {Promise<void>} Resolves when the image is successfully added or if the image already exists.
 */
export async function addImage(container, id, url, options) {
    const map = mapInstances[container];
    if (map.hasImage(id)) return;

    const image = await loadMapImageSource(map, url);
    // Sprite / concurrent resolver may have inserted the id while we awaited.
    if (map.hasImage(id)) return;

    try {
        if (options === undefined || options === null) {
            map.addImage(id, image);
        } else {
            map.addImage(id, image, options);
        }
        recordImage(overlayFor(container), id, url, options);
    } catch (error) {
        const message = error?.message ?? String(error);
        if (message.includes('already exists')) {
            return;
        }
        throw error;
    }
}

/**
 * Adds a layer to the specified map container.
 *
 * @function
 * @param {string} container - The identifier for the map container where the layer will be added.
 * @param {Object} layer - The layer object to be added to the map.
 * @param {string} [beforeId] - The ID of an existing layer before which the new layer will be added. Optional.
 */
export function addLayer(container, layer, beforeId) {
    mapInstances[container].addLayer(layer, beforeId);
    if (layer && typeof layer === 'object') {
        recordLayer(overlayFor(container), layer, beforeId);
    }
}

/**
 * Adds a layer when missing; otherwise refreshes zoom, filter, layout, paint, and order.
 * Uses only public MapLibre APIs (getLayer / addLayer / setLayerZoomRange / setFilter /
 * setLayoutProperty / setPaintProperty / moveLayer).
 */
export function ensureLayer(container, layer, beforeId) {
    const map = mapInstances[container];
    if (!map.getLayer(layer.id)) {
        addLayer(container, layer, beforeId);
        return "added";
    }

    if (layer.minzoom != null || layer.maxzoom != null) {
        setLayerZoomRange(container, layer.id, layer.minzoom ?? 0, layer.maxzoom ?? 24);
    }

    if (Object.prototype.hasOwnProperty.call(layer, 'filter')) {
        map.setFilter(layer.id, layer.filter ?? null);
    }

    if (layer.layout && typeof layer.layout === 'object') {
        for (const [key, value] of Object.entries(layer.layout)) {
            if (value !== undefined) {
                map.setLayoutProperty(layer.id, key, value);
            }
        }
    }

    if (layer.paint && typeof layer.paint === 'object') {
        for (const [key, value] of Object.entries(layer.paint)) {
            if (value !== undefined) {
                map.setPaintProperty(layer.id, key, value);
            }
        }
    }

    if (beforeId) {
        moveLayer(container, layer.id, beforeId);
    }

    recordLayer(overlayFor(container), layer, beforeId);
    return "updated";
}

/**
 * Adds a new source to the specified map container instance.
 *
 * @param {string} container - The identifier for the map container instance.
 * @param {string} id - The unique identifier for the new source.
 * @param {Object} source - The source configuration object to be added.
 */
export function addSource(container, id, source) {
    const map = mapInstances[container];
    if (!map) {
        throw new Error(`Map instance not found for container "${container}". Ensure the map is initialized before calling addSource.`);
    }

    if (source.type === 'geojson') {
        const data = cutAntiMeridian(container, source.data);
        source.data = data;
        skipCacheFor(container).remember(id, payloadKeyFromValue(data));
    }

    map.addSource(id, source);
    recordSource(overlayFor(container), id, source);
}


/**
 * Updates the data of a specific GeoJSON source.
 * MapLibre GL JS v6: setData always returns a Promise (no waitForCompletion flag).
 *
 * @param {string} container - The identifier for the map container instance.
 * @param {string} id - The unique identifier for the source you wish to update.
 * @param {Object} data - The GeoJSON data you wish to apply to the source
 */
export async function setSourceData(container, id, data) {
    const cache = skipCacheFor(container);
    const key = payloadKeyFromValue(data);
    if (cache.shouldSkip(id, key)) {
        return;
    }

    data = cutAntiMeridian(container, data);
    const source = mapInstances[container].getSource(id);
    if (source === undefined) {
        throw new Error(`Could not find source with id ${id}`);
    }
    await source.setData(data);
    cache.remember(id, key);
    recordSourceData(overlayFor(container), id, data);
}

/**
 * Updates the data of a specific GeoJSON source from a JSON string.
 * MapLibre GL JS v6: setData always returns a Promise.
 *
 * @param {string} container - The identifier for the map container instance.
 * @param {string} id - The unique identifier for the source you wish to update.
 * @param {string} data - The GeoJSON data you wish to apply to the source
 */
export async function setSourceDataAsJson(container, id, data) {
    const cache = skipCacheFor(container);
    const key = payloadKeyFromValue(data);
    if (cache.shouldSkip(id, key)) {
        return;
    }

    let jsonData = JSON.parse(data);
    jsonData = cutAntiMeridian(container, jsonData);
    const source = mapInstances[container].getSource(id);
    if (source === undefined) {
        throw new Error(`Could not find source with id ${id}`);
    }
    await source.setData(jsonData);
    cache.remember(id, key);
    recordSourceData(overlayFor(container), id, jsonData);
}

/**
 * Updates tile URLs for an existing raster or vector tile source without removing dependent layers.
 * @param {string} container - The map container.
 * @param {string} id - The source id.
 * @param {string[]} tiles - The new tile URL templates.
 */
export function setSourceTiles(container, id, tiles) {
    const source = mapInstances[container].getSource(id);
    if (source === undefined) {
        throw new Error(`Could not find source with id ${id}`);
    }

    if (typeof source.setTiles !== "function") {
        throw new Error(`Source "${id}" does not support setTiles.`);
    }

    source.setTiles(tiles);
    recordSourceTiles(overlayFor(container), id, tiles);
}

/**
 * Adds a tile source when missing; otherwise updates it with MapLibre public APIs only.
 * Native RasterTileSource/VectorTileSource expose setTiles (and setUrl), not setBounds.
 * bounds / minzoom / maxzoom / tileSize take effect only in the addSource specification,
 * so those changes recreate the source via removeLayer → removeSource → addSource → addLayer.
 * @param {string} container
 * @param {string} id
 * @param {object} source - MapLibre SourceSpecification (type, tiles, bounds, …).
 * @returns {"added"|"updated"}
 */
export function upsertTileSource(container, id, source) {
    const map = mapInstances[container];
    const existing = map.getSource(id);
    if (!existing) {
        addSource(container, id, source);
        return "added";
    }

    const nextUrl = typeof source?.url === "string" ? source.url : null;
    const nextTiles = Array.isArray(source?.tiles) ? source.tiles : null;
    if (!nextUrl && !nextTiles) {
        throw new Error(`upsertTileSource requires source.url or source.tiles for id "${id}".`);
    }

    const current = typeof existing.serialize === "function" ? existing.serialize() : {};
    if (tileSourceSpecNeedsReplace(current, source)) {
        replaceTileSource(map, id, source);
        recordSource(overlayFor(container), id, source);
        return "updated";
    }

    if (nextUrl && typeof existing.setUrl === "function") {
        existing.setUrl(nextUrl);
        recordSourceUrl(overlayFor(container), id, nextUrl);
        return "updated";
    }

    if (nextTiles && typeof existing.setTiles === "function") {
        existing.setTiles(nextTiles);
        recordSourceTiles(overlayFor(container), id, nextTiles);
        return "updated";
    }

    replaceTileSource(map, id, source);
    recordSource(overlayFor(container), id, source);
    return "updated";
}

function tileSourceSpecNeedsReplace(current, next) {
    return !sameSourceField(next.minzoom, current.minzoom)
        || !sameSourceField(next.maxzoom, current.maxzoom)
        || !sameSourceField(next.tileSize, current.tileSize)
        || !sameSourceField(next.scheme, current.scheme)
        || !sameSourceField(next.promoteId, current.promoteId)
        || !sameSourceField(next.bounds, current.bounds);
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
            beforeId = undefined;
        } else if (dependent.length > 0 && beforeId === undefined) {
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

/**
 * @deprecated Prefer {@link setSourceTiles}. Kept for transaction/API compatibility.
 */
export function setVectorSourceTiles(container, id, tiles) {
    setSourceTiles(container, id, tiles);
}

/**
 * Updates the TileJSON / style URL for an existing source that supports setUrl.
 * @param {string} container - The map container.
 * @param {string} id - The source id.
 * @param {string} url - The new source URL.
 */
export function setSourceUrl(container, id, url) {
    const source = mapInstances[container].getSource(id);
    if (source === undefined) {
        throw new Error(`Could not find source with id ${id}`);
    }

    if (typeof source.setUrl !== "function") {
        throw new Error(`Source "${id}" does not support setUrl.`);
    }

    source.setUrl(url);
    recordSourceUrl(overlayFor(container), id, url);
}

/**
 * Applies an incremental diff to a GeoJSON source.
 * MapLibre GL JS v6: updateData always returns a Promise (no waitForCompletion flag).
 *
 * @param {string} container - The map container id.
 * @param {string} id - The GeoJSON source id.
 * @param {object} diff - A GeoJSONSourceDiff object (add, remove, removeAll, update).
 * @returns {Promise<void>}
 */
export async function updateSourceData(container, id, diff) {
    const source = mapInstances[container].getSource(id);
    if (source === undefined) {
        throw new Error(`Could not find source with id ${id}`);
    }

    if (typeof source.updateData !== 'function') {
        throw new Error(`Source with id ${id} does not support updateData`);
    }

    await source.updateData(diff);
}

/**
 * Shows the tile boundaries for debug purposes.
 *
 * @param {string} container - The identifier for the map container instance.
 * @param {boolean} shouldShowTileBoundaries
 */
export function showTileBoundaries(container, shouldShowTileBoundaries) {
    const map = mapInstances[container];
    map.showTileBoundaries = shouldShowTileBoundaries;
}

/**
 * Adds a sprite to the specified map container.
 *
 * @function
 * @param {string} container - The identifier for the map container.
 * @param {string} id - The unique identifier for the sprite.
 * @param {string} url - The URL of the sprite image.
 * @param {Object} [options] - Optional parameters for the sprite, such as pixel ratio.
 */
export function addSprite(container, id, url, options) {
    const map = mapInstances[container];
    if (options === undefined || options === null) {
        map.addSprite(id, url);
    } else {
        map.addSprite(id, url, options);
    }
}

/**
 * Checks if all map tiles are loaded for the given container.
 *
 * @param {string} container - The identifier of the map container to check.
 * @returns {boolean} Returns true if all tiles are loaded, otherwise false.
 */
export function areTilesLoaded(container) {
    return mapInstances[container].areTilesLoaded();
}

/**
 * Calculates the camera options based on the provided longitude, latitude, altitude, bearing, pitch, and roll.
 *
 * @param {string} container - The container identifier for the map instance.
 * @param {Array<number>} cameraLngLat - The longitude and latitude of the camera position as an array [longitude, latitude].
 * @param {number} cameraAltitude - The altitude of the camera in meters.
 * @param {number} bearing - The bearing of the camera in degrees.
 * @param {number} pitch - The pitch of the camera in degrees.
 * @param {number} roll - The roll of the camera in degrees.
 * @returns {Object} The calculated camera options.
 */
export function calculateCameraOptionsFromCameraLngLatAltRotation(container, cameraLngLat, cameraAltitude, bearing, pitch, roll) {
    return mapInstances[container].calculateCameraOptionsFromCameraLngLatAltRotation(cameraLngLat, cameraAltitude, bearing, pitch, roll);
}

/**
 * Calculates camera options for transitioning from one location to another.
 *
 * @param {string} container - The identifier of the map container.
 * @param {Array<number>} from - The starting coordinates of the transition [latitude, longitude].
 * @param {number} altitudeFrom - The altitude at the starting location.
 * @param {Array<number>} to - The destination coordinates of the transition [latitude, longitude].
 * @param {number} altitudeTo - The altitude at the destination location.
 * @returns {Object} The calculated camera options for the transition.
 */
export function calculateCameraOptionsFromTo(container, from, altitudeFrom, to, altitudeTo) {
    return mapInstances[container].calculateCameraOptionsFromTo(from, altitudeFrom, to, altitudeTo);
}

/**
 * Calculates and returns the camera options needed to fit the provided bounds within the specified container.
 *
 * @param {string} container - The identifier for the map container.
 * @param {Object} bounds - The geographical bounds to be displayed within the container.
 * @param {Object} [options] - Optional settings for adjusting the camera view, such as padding or max zoom.
 * @returns {Object} The camera options to fit the bounds within the specified container.
 */
export function cameraForBounds(container, bounds, options) {
    return mapInstances[container].cameraForBounds(bounds, options);
}

/**
 * Smoothly animates the map viewport to the specified location and zoom level.
 *
 * @param {string} container - The identifier of the map container.
 * @param {Object} options - Configuration options for easing to the target state, such as center, zoom, bearing, and pitch.
 * @param {Object} [eventData] - Optional additional metadata for the event triggered by the easing action.
 */
export function easeTo(container, options, eventData) {
    mapInstances[container].easeTo(options, eventData);
}

/**
 * Adjusts the map view within the specified container to fit the given geographical bounds.
 *
 * @param {string} container - The identifier for the map container that needs to fit the bounds.
 * @param {Object} bounds - The geographical bounds to fit within the map view.
 * @param {Object} [options] - Optional settings for fitting the bounds, such as padding or animation.
 * @param {Object} [eventData] - Optional event-related data to be associated with this operation.
 */
export function fitBounds(container, bounds, options, eventData) {
    mapInstances[container].fitBounds([
        [bounds._sw.lng, bounds._sw.lat], // Southwest corner
        [bounds._ne.lng, bounds._ne.lat]  // Northeast corner
    ], options, eventData);
}

/**
 * Fits the map view to an added style layer.
 * Prefers stable source bounds (GeoJSON getBounds, vector/raster bounds, image/video coordinates)
 * and falls back to the layer's currently loaded source features.
 * @param {string} container - The map container identifier.
 * @param {string} layerId - The style layer id.
 * @param {Object} [options] - fitBounds options.
 * @returns {Promise<boolean>} True when bounds were applied.
 */
export async function fitToLayer(container, layerId, options) {
    const map = mapInstances[container];
    const layer = map?.getLayer(layerId);
    if (!layer?.source) {
        return false;
    }

    const bounds = await resolveLayerBounds(map, layer, true);
    return fitResolvedBounds(map, bounds, options);
}

/**
 * Fits the map view to stable bounds declared or calculated by a source.
 * For vector/raster sources this uses the source `bounds` metadata when present.
 * @param {string} container - The map container identifier.
 * @param {string} sourceId - The source id.
 * @param {Object} [options] - fitBounds options.
 * @returns {Promise<boolean>} True when bounds were applied.
 */
export async function fitToSourceBounds(container, sourceId, options) {
    const map = mapInstances[container];
    if (!map) {
        return false;
    }

    const bounds = await resolveSourceBounds(map, sourceId);
    return fitResolvedBounds(map, bounds, options);
}

/**
 * Fits the map view to source features that are currently loaded for a layer.
 * This is useful for vector tiles, but it is viewport/tile-cache dependent.
 * @param {string} container - The map container identifier.
 * @param {string} layerId - The style layer id.
 * @param {Object} [options] - fitBounds options.
 * @returns {Promise<boolean>} True when bounds were applied.
 */
export async function fitToLoadedLayerFeatures(container, layerId, options) {
    const map = mapInstances[container];
    const layer = map?.getLayer(layerId);
    if (!layer?.source) {
        return false;
    }

    const bounds = await resolveLoadedLayerFeatureBounds(map, layer);
    return fitResolvedBounds(map, bounds, options);
}

async function resolveLayerBounds(map, layer, includeLoadedFeatures) {
    const sourceBounds = await resolveSourceBounds(map, layer.source);
    if (sourceBounds) {
        return sourceBounds;
    }

    return includeLoadedFeatures ? await resolveLoadedLayerFeatureBounds(map, layer) : null;
}

async function resolveSourceBounds(map, sourceId) {
    const source = map.getSource(sourceId);
    if (!source) {
        return null;
    }

    if (typeof source.getBounds === 'function') {
        try {
            const result = source.getBounds();
            const bounds = result instanceof Promise ? await result : result;
            if (bounds && !bounds.isEmpty()) {
                return bounds;
            }
        } catch {
            // Fall back to declared source metadata below.
        }
    }

    const sourceSpec = map.getStyle()?.sources?.[sourceId];
    return boundsFromRuntimeSource(source) ?? boundsFromSourceSpec(sourceSpec);
}

async function resolveLoadedLayerFeatureBounds(map, layer) {
    let bounds = querySourceFeatureBounds(map, layer);
    if (bounds) {
        return bounds;
    }

    // Map may already be "loaded" (basemap ready) while a newly added vector
    // source still has no tiles in cache — always wait once for idle/source data.
    await waitForSourceFeatures(map, layer.source);
    return querySourceFeatureBounds(map, layer);
}

function querySourceFeatureBounds(map, layer) {
    const queryParams = createLayerFeatureQuery(layer);
    const sourceId = layer.source;
    const features = map.querySourceFeatures(sourceId, queryParams);
    if (!features?.length) {
        return null;
    }

    const bounds = new globalThis.maplibregl.LngLatBounds();
    for (const feature of features) {
        extendGeometryBounds(bounds, feature.geometry);
    }

    return bounds.isEmpty() ? null : bounds;
}

function createLayerFeatureQuery(layer) {
    const queryParams = {};
    if (layer['source-layer']) {
        queryParams.sourceLayer = layer['source-layer'];
    }
    if (layer.filter) {
        queryParams.filter = layer.filter;
    }

    return Object.keys(queryParams).length > 0 ? queryParams : undefined;
}

function boundsFromSourceSpec(sourceSpec) {
    if (!sourceSpec) {
        return null;
    }

    const declaredBounds = boundsFromLngLatArray(sourceSpec.bounds);
    if (declaredBounds) {
        return declaredBounds;
    }

    return boundsFromCoordinates(sourceSpec.coordinates);
}

function boundsFromRuntimeSource(source) {
    return boundsFromLngLatArray(source.bounds) ?? boundsFromCoordinates(source.coordinates);
}

function boundsFromLngLatArray(boundsArray) {
    if (!Array.isArray(boundsArray) || boundsArray.length < 4) {
        return null;
    }

    const bounds = new globalThis.maplibregl.LngLatBounds(
        [boundsArray[0], boundsArray[1]],
        [boundsArray[2], boundsArray[3]]
    );

    return bounds.isEmpty() ? null : bounds;
}

function boundsFromCoordinates(coordinates) {
    if (!Array.isArray(coordinates) || coordinates.length === 0) {
        return null;
    }

    const bounds = new globalThis.maplibregl.LngLatBounds();
    for (const coordinate of coordinates) {
        if (Array.isArray(coordinate) && coordinate.length >= 2) {
            bounds.extend(coordinate);
        }
    }

    return bounds.isEmpty() ? null : bounds;
}

function fitResolvedBounds(map, bounds, options) {
    if (!map || !bounds || bounds.isEmpty()) {
        return false;
    }

    map.fitBounds(bounds, options);
    return true;
}

function waitForSourceFeatures(map, sourceId) {
    return new Promise(resolve => {
        let resolved = false;
        const finish = () => {
            if (resolved) {
                return;
            }

            resolved = true;
            clearTimeout(timeoutId);
            map.off('idle', finish);
            map.off('sourcedata', onSourceData);
            resolve();
        };
        const onSourceData = event => {
            if (event?.sourceId === sourceId && event.isSourceLoaded) {
                finish();
            }
        };
        const timeoutId = setTimeout(finish, 2000);

        map.on('sourcedata', onSourceData);
        map.once('idle', finish);

        if (typeof map.isSourceLoaded === 'function' && map.isSourceLoaded(sourceId)) {
            finish();
        }
    });
}

function extendGeometryBounds(bounds, geometry) {
    if (!geometry?.coordinates) {
        return;
    }

    extendCoordinateBounds(bounds, geometry.coordinates, geometry.type);
}

function extendCoordinateBounds(bounds, coordinates, geometryType) {
    if (!coordinates?.length) {
        return;
    }

    if (geometryType === 'Point' || typeof coordinates[0] === 'number') {
        bounds.extend(coordinates);
        return;
    }

    for (const child of coordinates) {
        extendCoordinateBounds(bounds, child, null);
    }
}

/**
 * Adjusts the map view to fit the given screen coordinates.
 *
 * @function fitScreenCoordinates
 * @param {string} container - The identifier for the map container instance.
 * @param {Array<number>} p0 - The first screen coordinate as [x, y].
 * @param {Array<number>} p1 - The second screen coordinate as [x, y].
 * @param {number} bearing - The map's bearing in degrees to apply during the fit.
 * @param {Object} [options] - Optional configuration parameters for fitting the coordinates.
 * @param {Object} [eventData] - Optional event data to be dispatched with the fit operation.
 */
export function fitScreenCoordinates(container, p0, p1, bearing, options, eventData) {
    mapInstances[container].fitScreenCoordinates(p0, p1, bearing, options, eventData);
}

/**
 * Animates the map view to a specified center and zoom level with a smooth transition effect.
 *
 * @function
 * @param {string} container - The identifier for the map container instance to apply the flyTo action.
 * @param {Object} options - The flyTo options containing the target coordinates, zoom level, and optional padding.
 * @param {Object} eventData - Optional additional event data associated with the flyTo action.
 */
export function flyTo(container, options, eventData) {
    mapInstances[container].flyTo(options, eventData);
}

/**
 * Retrieves the current bearing (direction) of the map associated with the specified container.
 * The bearing typically refers to the compass direction, in degrees, that the map is rotated to.
 *
 * @param {string} container - The identifier of the container associated with the map instance.
 * @returns {number} The bearing of the map in degrees.
 */
export function getBearing(container) {
    return mapInstances[container].getBearing();
}

/**
 * Retrieves the geographical boundaries of a map instance associated with the specified container.
 *
 * @param {string} container - The identifier of the container associated with the map instance.
 * @returns {Object} An object representing the geographical boundaries of the map instance.
 */
export function getBounds(container) {
    return mapInstances[container].getBounds();
}

/**
 * Retrieves the camera target elevation for the specified map container.
 *
 * This function checks if the `getCameraTargetElevation` method is available
 * for the given map instance. If it is, the method is invoked to obtain the
 * camera target elevation. If the method is not supported, a warning message
 * is logged to the console, and `null` is returned.
 *
 * @param {string} container - The identifier of the map container for which the
 * camera target elevation is to be retrieved.
 * @returns {number|null} The camera target elevation if supported, or `null`
 * if the method is not available for the map instance.
 */
export function getCameraTargetElevation(container) {
    if (mapInstances[container].getCameraTargetElevation) {
        return mapInstances[container].getCameraTargetElevation();
    } else {
        console.warn("getCameraTargetElevation is not supported for this map instance.");
        return null;
    }
}

/**
 * Retrieves the canvas element associated with a specific container.
 *
 * @param {string} container - The identifier for the container whose canvas is to be retrieved.
 * @returns {HTMLCanvasElement} The canvas element associated with the specified container.
 */
export function getCanvas(container) {
    return mapInstances[container].getCanvas();
}

/**
 * Waits until the map is idle (or timeout). Safe no-op when already loaded and tiles ready.
 * @param {string} container
 * @param {number} [timeoutMs=3000]
 * @returns {Promise<void>}
 */
export function waitForIdle(container, timeoutMs = 3000) {
    const map = mapInstances[container];
    if (!map) {
        return Promise.reject(new Error(`Map instance not found for container "${container}".`));
    }

    const tilesReady = typeof map.areTilesLoaded !== "function" || map.areTilesLoaded();
    if (map.loaded() && tilesReady) {
        return Promise.resolve();
    }

    return new Promise((resolve) => {
        let settled = false;
        const finish = () => {
            if (settled) {
                return;
            }

            settled = true;
            clearTimeout(timer);
            map.off("idle", onIdle);
            resolve();
        };

        const onIdle = () => finish();
        const timer = setTimeout(finish, timeoutMs);
        map.once("idle", onIdle);
        try {
            map.triggerRepaint();
        } catch {
            // Rely on timeout / existing frame.
        }
    });
}

/**
 * Captures the map canvas as a data URL after waiting for idle + one render frame.
 * @param {string} container
 * @param {{ idleTimeoutMs?: number, renderTimeoutMs?: number, mimeType?: string }} [options]
 * @returns {Promise<string>}
 */
export async function captureCanvasDataUrl(container, options = {}) {
    const idleTimeoutMs = options.idleTimeoutMs ?? 3000;
    const renderTimeoutMs = options.renderTimeoutMs ?? 2500;
    const mimeType = options.mimeType ?? "image/png";
    const map = mapInstances[container];
    if (!map) {
        throw new Error(`Map instance not found for container "${container}".`);
    }

    await waitForIdle(container, idleTimeoutMs);

    const copy = await new Promise((resolve, reject) => {
        let settled = false;
        const finish = (result, error) => {
            if (settled) {
                return;
            }

            settled = true;
            clearTimeout(timer);
            map.off("render", onRender);
            if (error) {
                reject(error);
                return;
            }

            resolve(result);
        };

        const onRender = () => {
            try {
                const source = map.getCanvas();
                if (!source || source.width < 1 || source.height < 1) {
                    finish(null, new Error("Failed to capture map canvas."));
                    return;
                }

                const canvas = document.createElement("canvas");
                canvas.width = source.width;
                canvas.height = source.height;
                canvas.style.width = source.style.width;
                canvas.style.height = source.style.height;
                const ctx = canvas.getContext("2d", { alpha: false });
                if (!ctx) {
                    finish(null, new Error("Failed to create export canvas."));
                    return;
                }

                ctx.drawImage(source, 0, 0);
                finish(canvas);
            } catch (error) {
                finish(null, error instanceof Error ? error : new Error(String(error)));
            }
        };

        const timer = setTimeout(
            () => finish(null, new Error("Timed out while capturing map frame.")),
            renderTimeoutMs);

        map.once("render", onRender);
        try {
            map.triggerRepaint();
        } catch (error) {
            finish(null, error instanceof Error ? error : new Error(String(error)));
        }
    });

    return copy.toDataURL(mimeType);
}

/**
 * Sets the CSS cursor style on the map canvas.
 *
 * @param {string} container - The identifier for the map container instance.
 * @param {string} cursor - The CSS cursor value (empty string restores the default).
 */
export function setCanvasCursor(container, cursor) {
    const map = mapInstances[container];
    if (!map) {
        return;
    }

    map.getCanvas().style.cursor = cursor || '';
}

/**
 * Retrieves the canvas container associated with the given container.
 *
 * @param {string} container - The identifier for the container whose canvas container is to be retrieved.
 * @returns {Object} The canvas container associated with the specified container.
 */
export function getCanvasContainer(container) {
    return mapInstances[container].getCanvasContainer();
}

/**
 * Retrieves the center coordinates of the map instance associated with the specified container.
 *
 * @param {string} container - The identifier of the container associated with the map instance.
 * @returns {Object} An object representing the center coordinates of the map.
 */
export function getCenter(container) {
    return mapInstances[container].getCenter();
}

/**
 * Retrieves the center point of the map clamped to the ground for the specified container.
 * The center point corresponds to the geographical coordinates at the center of the map view.
 *
 * @param {string} container - The identifier for the map container instance.
 * @returns {Object} An object representing the center coordinates clamped to the ground.
 */
export function getCenterClampedToGround(container) {
    return mapInstances[container].getCenterClampedToGround();
}

/**
 * Gets the center elevation of the map instance associated with the provided container.
 *
 * @function
 * @param {string} container - The identifier for the container whose map instance's center elevation is to be retrieved.
 * @returns {number} The elevation value at the center of the map.
 */
export function getCenterElevation(container) {
    return mapInstances[container].getCenterElevation();
}

/**
 * Retrieves the container instance corresponding to the given container identifier.
 *
 * @param {string} container - The identifier for the desired container.
 * @returns {*} The container instance associated with the specified container identifier.
 */
export function getContainer(container) {
    return mapInstances[container].getContainer();
}

/**
 * Retrieves the state of a specific feature within a given container.
 *
 * @param {string} container - The identifier for the container where the feature is located.
 * @param {Object} feature - The feature object whose state needs to be retrieved.
 * @returns {Object} The current state of the specified feature.
 */
export function getFeatureState(container, feature) {
    return mapInstances[container].getFeatureState(feature);
}

/**
 * Retrieves the filter configuration for a specified layer in the given map container.
 *
 * @param {string} container - The identifier of the map container instance.
 * @param {string} layerId - The identifier of the layer whose filter is being retrieved.
 * @returns {Array|Object|null} The filter configuration applied to the specified layer, or null if no filter exists.
 */
export function getFilter(container, layerId) {
    return mapInstances[container].getFilter(layerId);
}

/**
 * Retrieves the glyphs associated with the specified container.
 *
 * @param {string} container - The identifier of the container to fetch glyphs for.
 * @returns {Array} An array of glyph objects associated with the container.
 */
export function getGlyphs(container) {
    return mapInstances[container].getGlyphs();
}

/**
 * Retrieves an image from the specified container using its identifier.
 *
 * @param {string} container - The name of the container from which to retrieve the image.
 * @param {string} id - The unique identifier of the image to retrieve.
 * @returns {*} The image associated with the given identifier in the specified container.
 */
export function getImage(container, id) {
    return mapInstances[container].getImage(id);
}

/**
 * Retrieves a specific layer from a map instance associated with the given container.
 *
 * @param {string} container - The identifier of the container holding the map instance.
 * @param {string} id - The unique identifier of the layer to retrieve.
 * @returns {Object|undefined} The layer object if found, or undefined if the layer does not exist.
 */
export function getLayer(container, id) {
    return mapInstances[container]?.getLayer(id);
}

/**
 * Checks whether a layer with the given id exists in the map style.
 * @param {string} container - The map container identifier.
 * @param {string} id - The layer id.
 * @returns {boolean} True if the layer exists.
 */
export function hasLayer(container, id) {
    return mapInstances[container]?.getLayer(id) != null;
}

/**
 * Retrieves the order of layers within a specific map container.
 *
 * @param {string} container - The identifier for the map container whose layer order is to be retrieved.
 * @returns {Array} An array representing the order of layers in the specified container.
 */
export function getLayersOrder(container) {
    return mapInstances[container].getLayersOrder();
}

/**
 * Returns the subset of layer ids that currently exist in the style.
 * @param {string} container - The map container.
 * @param {string[]} ids - Candidate layer ids.
 * @returns {string[]}
 */
export function whichLayersExist(container, ids) {
    const map = mapInstances[container];
    if (!map || !Array.isArray(ids) || ids.length === 0) {
        return [];
    }

    return ids.filter((id) => !!map.getLayer(id));
}

/**
 * Returns the subset of source ids that currently exist in the style.
 * @param {string} container - The map container.
 * @param {string[]} ids - Candidate source ids.
 * @returns {string[]}
 */
export function whichSourcesExist(container, ids) {
    const map = mapInstances[container];
    if (!map || !Array.isArray(ids) || ids.length === 0) {
        return [];
    }

    return ids.filter((id) => !!map.getSource(id));
}

/**
 * Returns the subset of image ids that currently exist in the style.
 * @param {string} container
 * @param {string[]} ids
 * @returns {string[]}
 */
export function whichImagesExist(container, ids) {
    const map = mapInstances[container];
    if (!Array.isArray(ids) || ids.length === 0) {
        return [];
    }

    return ids.filter((id) => map.hasImage(id));
}

/**
 * Ensures images exist: loads and adds only missing ones.
 * @param {string} container
 * @param {Array<{ id: string, url: string, options?: object }>} images
 * @returns {Promise<string[]>} Ids that were newly added.
 */
export async function ensureImages(container, images) {
    const map = mapInstances[container];
    if (!Array.isArray(images) || images.length === 0) {
        return [];
    }

    const missing = images.filter((image) => image?.id && image?.url && !map.hasImage(image.id));
    await Promise.all(missing.map((image) => addImage(container, image.id, image.url, image.options)));
    return missing.map((image) => image.id);
}

/**
 * Returns a camera snapshot in one call.
 * @param {string} container
 * @returns {{ center: { lng: number, lat: number }, zoom: number, bearing: number, pitch: number }}
 */
export function getViewState(container) {
    const map = requireMap(container, 'getViewState');
    const center = map.getCenter();
    return {
        center: { lng: center.lng, lat: center.lat },
        zoom: map.getZoom(),
        bearing: map.getBearing(),
        pitch: map.getPitch()
    };
}

/**
 * Atomically applies center/zoom/bearing/pitch/padding.
 * @param {string} container
 * @param {{ center?: object, zoom?: number, bearing?: number, pitch?: number, padding?: object, animate?: boolean }} state
 */
export function applyViewState(container, state) {
    const map = requireMap(container, 'applyViewState');
    const options = state ?? {};
    const camera = {
        center: options.center,
        zoom: options.zoom,
        bearing: options.bearing,
        pitch: options.pitch,
        padding: options.padding
    };

    if (options.animate) {
        map.easeTo(camera);
        return;
    }

    map.jumpTo(camera);
}

/**
 * Retrieves the value of a specified layout property for a given layer in a map container.
 *
 * @function
 * @param {string} container - The identifier of the map container instance.
 * @param {string} layerId - The unique identifier of the layer whose property is being accessed.
 * @param {string} name - The name of the layout property to retrieve.
 * @returns {*} The value of the requested layout property, as defined within the specified layer.
 */
export function getLayoutProperty(container, layerId, name) {
    return mapInstances[container].getLayoutProperty(layerId, name);
}

/**
 * Retrieves the light object of the map style.
 * @param {string} container - The identifier of the map container.
 * @returns {Object} The light specification of the map style.
 */
export function getLight(container) {
    return mapInstances[container].getLight();
}

/**
 * Retrieves the maximum geographical bounds the map is constrained to.
 * @param {string} container - The map container identifier.
 * @returns {Object|null} The max bounds (LngLatBounds) or null if not set.
 */
export function getMaxBounds(container) {
    return mapInstances[container].getMaxBounds();
}

/**
 * Sets or clears the map's geographical bounds.
 * @param {string} container - The map container identifier.
 * @param {Object|null|undefined} bounds - LngLatBounds-like object, or null/undefined to clear.
 */
export function setMaxBounds(container, bounds) {
    mapInstances[container].setMaxBounds(bounds ?? null);
}

/**
 * Retrieves the map's maximum allowable pitch.
 * @param {string} container - The identifier of the map container.
 * @returns {number} Maximum allowable pitch in degrees.
 */
export function getMaxPitch(container) {
    return mapInstances[container].getMaxPitch();
}

/**
 * Retrieves the map's maximum allowable zoom level.
 * @param {string} container - The identifier of the map container.
 * @returns {number} Maximum allowable zoom level.
 */
export function getMaxZoom(container) {
    return mapInstances[container].getMaxZoom();
}

/**
 * Retrieves the map's minimum allowable pitch.
 * @param {string} container - The identifier of the map container.
 * @returns {number} Minimum allowable pitch in degrees.
 */
export function getMinPitch(container) {
    return mapInstances[container].getMinPitch();
}

/**
 * Retrieves the map's minimum allowable zoom level.
 * @param {string} container - The identifier of the map container.
 * @returns {number} Minimum allowable zoom level.
 */
export function getMinZoom(container) {
    return mapInstances[container].getMinZoom();
}

/**
 * Retrieves the current padding applied around the map viewport.
 * @param {string} container - The identifier of the map container.
 * @returns {Object} Padding options applied to the map.
 */
export function getPadding(container) {
    return mapInstances[container].getPadding();
}

/**
 * Retrieves the value of a paint property of a specified layer.
 * @param {string} container - The identifier of the map container.
 * @param {string} layerId - The ID of the layer to get the paint property from.
 * @param {string} name - The name of the paint property.
 * @returns {*} The value of the specified paint property.
 */
export function getPaintProperty(container, layerId, name) {
    return mapInstances[container].getPaintProperty(layerId, name);
}

/**
 * Retrieves the current pitch (tilt) of the map in degrees.
 * @param {string} container - The identifier of the map container.
 * @returns {number} The current pitch of the map.
 */
export function getPitch(container) {
    return mapInstances[container].getPitch();
}

/**
 * Retrieves the map's pixel ratio.
 * Note: The actual applied pixel ratio may be lower than specified due to max canvas size restrictions.
 * @param {string} container - The identifier of the map container.
 * @returns {number} The pixel ratio of the map.
 */
export function getPixelRatio(container) {
    return mapInstances[container].getPixelRatio();
}

/**
 * Retrieves the projection specification of the map.
 * @param {string} container - The identifier of the map container.
 * @returns {Object} The projection specification of the map.
 */
export function getProjection(container) {
    return mapInstances[container]?.getProjection() ?? projectionInstances[container] ?? null;
}

/**
 * Retrieves the state of `renderWorldCopies`.
 * @param {string} container - The identifier of the map container.
 * @returns {boolean} True if multiple world copies are rendered, false otherwise.
 */
export function getRenderWorldCopies(container) {
    return mapInstances[container].getRenderWorldCopies();
}

/**
 * Retrieves the current roll angle of the map in degrees.
 * @param {string} container - The identifier of the map container.
 * @returns {number} The roll angle of the map.
 */
export function getRoll(container) {
    return mapInstances[container].getRoll();
}

/**
 * Retrieves the sky properties of the map style.
 * @param {string} container - The identifier of the map container.
 * @returns {Object} The sky properties of the map.
 */
export function getSky(container) {
    return mapInstances[container].getSky();
}

/**
 * Retrieves a source by its ID from the map's style.
 * @param {string} container - The identifier of the map container.
 * @param {string} id - The ID of the source to retrieve.
 * @returns {Object|undefined} The source object if found, or undefined.
 */
export function getSource(container, id) {
    return mapInstances[container].getSource(id);
}

/**
 * Checks whether a source with the given id exists in the map style.
 * @param {string} container - The map container identifier.
 * @param {string} id - The source id.
 * @returns {boolean} True if the source exists.
 */
export function hasSource(container, id) {
    return mapInstances[container].getSource(id) != null;
}

/**
 * Returns the value of a global state property.
 * @param {string} container - The map container identifier.
 * @param {string} propertyName - The global state property name.
 * @returns {*} The property value.
 */
export function getGlobalStateProperty(container, propertyName) {
    return mapInstances[container].getGlobalStateProperty(propertyName);
}

/**
 * Retrieves the style's sprite as a list of objects.
 * @param {string} container - The identifier of the map container.
 * @returns {Array} The list of sprite objects for the style.
 */
export function getSprite(container) {
    return mapInstances[container].getSprite();
}

/**
 * Retrieves the map's style specification.
 * @param {string} container - The identifier of the map container.
 * @returns {Object} The style specification object of the map.
 */
export function getStyle(container) {
    return mapInstances[container].getStyle();
}

/**
 * Retrieves the terrain options if terrain is loaded.
 * @param {string} container - The identifier of the map container.
 * @returns {Object|undefined} The terrain specification object or undefined if not loaded.
 */
export function getTerrain(container) {
    return mapInstances[container].getTerrain();
}

/**
 * Retrieves the map's current vertical field of view in degrees.
 * @param {string} container - The identifier of the map container.
 * @returns {number} The vertical field of view of the map.
 */
export function getVerticalFieldOfView(container) {
    return mapInstances[container].getVerticalFieldOfView();
}

/**
 * Retrieves the map's current zoom level.
 * @param {string} container - The identifier of the map container.
 * @returns {number} The current zoom level of the map.
 */
export function getZoom(container) {
    return mapInstances[container].getZoom();
}

/**
 * Checks if a control exists on the map.
 * @param {string} container - The identifier of the map container.
 * @param {IControl} control - The control to check.
 * @returns {boolean} True if the control exists on the map.
 */
export function hasControl(container, control) {
    return mapInstances[container].hasControl(control);
}

/**
 * Checks whether an image with the given ID exists in the style.
 * @param {string} container - The identifier of the map container.
 * @param {string} id - ID of the image.
 * @returns {boolean} True if the image exists.
 */
export function hasImage(container, id) {
    return mapInstances[container].hasImage(id);
}

/**
 * Returns true if the map is moving.
 * @param {string} container - The identifier of the map container.
 * @returns {boolean} True if the map is moving.
 */
export function isMoving(container) {
    return mapInstances[container].isMoving();
}

/**
 * Returns true if the map is rotating.
 * @param {string} container - The identifier of the map container.
 * @returns {boolean} True if the map is rotating.
 */
export function isRotating(container) {
    return mapInstances[container].isRotating();
}

/**
 * Returns true if the specified source is loaded.
 * @param {string} container - The identifier of the map container.
 * @param {string} id - The source ID.
 * @returns {boolean} True if the source is loaded.
 */
export function isSourceLoaded(container, id) {
    return mapInstances[container].isSourceLoaded(id);
}

/**
 * Returns true if the map's style is fully loaded.
 * @param {string} container - The identifier of the map container.
 * @returns {boolean} True if the style is loaded.
 */
export function isStyleLoaded(container) {
    return mapInstances[container].isStyleLoaded();
}

/**
 * Returns true if the map is zooming.
 * @param {string} container - The identifier of the map container.
 * @returns {boolean} True if the map is zooming.
 */
export function isZooming(container) {
    return mapInstances[container].isZooming();
}

/**
 * Changes any combination of center, zoom, bearing, pitch, or roll without animation.
 * @param {string} container - The map container.
 * @param {object} options - JumpToOptions for updating the map view.
 * @param {any} eventData - Optional event data.
 */
export function jumpTo(container, options, eventData) {
    mapInstances[container].jumpTo(options, eventData);
}

/**
 * Returns true if there is at least one registered listener for a given event type.
 * @param {string} container - The map container.
 * @param {string} type - The event type.
 * @returns {boolean} True if a listener exists for the event type.
 */
export function listens(container, type) {
    return mapInstances[container].listens(type);
}

/**
 * Lists all image IDs available in the map's style.
 * @param {string} container - The map container.
 * @returns {string[]} A list of all image IDs.
 */
export function listImages(container) {
    return mapInstances[container].listImages();
}

/**
 * Checks if the map is fully loaded.
 * @param {string} container - The map container.
 * @returns {boolean} True if the map is fully loaded.
 */
export function loaded(container) {
    return mapInstances[container].loaded();
}

/**
 * Loads an image from an external URL.
 * @param {string} container - The map container.
 * @param {string} url - The URL for the image.
 * @returns {Promise<*>} A promise resolving when the image is loaded.
 */
/**
 * Loads an image from an external URL.
 * @param {string} container - The map container.
 * @param {string} url - The URL for the image.
 * @returns {Promise<*>} The loaded image resource (usable directly with addImage/updateImage).
 */
export async function loadImage(container, url) {
    const map = mapInstances[container];
    return await loadMapImageSource(map, url);
}

/**
 * Moves a layer to a different z-position.
 * @param {string} container - The map container.
 * @param {string} id - The ID of the layer to move.
 * @param {string} beforeId - The ID of the target layer to place the moved layer before.
 */
export function moveLayer(container, id, beforeId) {
    const map = mapInstances[container];
    if (beforeId === undefined || beforeId === null) {
        map.moveLayer(id);
    } else {
        map.moveLayer(id, beforeId);
    }
}

/**
 * Sets layer z-order. <c>ids</c> are bottom-to-top (same convention as getLayersOrder).
 * Missing ids are skipped.
 * @param {string} container
 * @param {string[]} ids
 */
export function setLayerOrder(container, ids) {
    const map = mapInstances[container];
    if (!Array.isArray(ids) || ids.length === 0) {
        return;
    }

    for (const id of ids) {
        if (map.getLayer(id)) {
            map.moveLayer(id);
        }
    }
}

/**
 * Pans the map by the specified offset.
 * @param {string} container - The map container.
 * @param {Array} offset - The pan offset.
 * @param {object} options - Pan options.
 * @param {any} eventData - Optional event data.
 */
export function panBy(container, offset, options, eventData) {
    mapInstances[container].panBy(offset, options, eventData);
}

/**
 * Pans the map to the specified location.
 * @param {string} container - The map container.
 * @param {Array<number>} lngLat - The target longitude and latitude.
 * @param {object} options - Pan animation options.
 * @param {any} eventData - Optional event data.
 */
export function panTo(container, lngLat, options, eventData) {
    mapInstances[container].panTo(lngLat, options, eventData);
}

/**
 * Projects geographical coordinates to pixel coordinates.
 * @param {string} container - The map container.
 * @param {Array<number>} lngLat - Longitude and latitude to project.
 * @returns {Object} The projected point.
 */
export function project(container, lngLat) {
    return mapInstances[container].project(lngLat);
}

/**
 * Queries rendered features.
 * @param {string} container - The map container.
 * @param {object} query - The query options or geometry.
 * @param {object} options - Rendered features query options.
 * @returns {Array} Query results.
 */
export function queryRenderedFeatures(container, query, options) {
    return requireMap(container, 'queryRenderedFeatures')
        .queryRenderedFeatures(query, options)
        .map((feature) => toCompactFeature(feature));
}

export function queryRenderedFeaturesJson(container, query, options) {
    return JSON.stringify(queryRenderedFeatures(container, query, options));
}

export function queryRenderedFeaturesWithoutGeometriesReturned(container, query, options) {
    const map = requireMap(container, 'queryRenderedFeaturesWithoutGeometriesReturned');
    return map.queryRenderedFeatures(query, options).map(feature => toCompactFeature(feature, false));
}

/**
 * Queries features from a source.
 * @param {string} container - The map container.
 * @param {string} sourceId - The source ID.
 * @param {object} parameters - Query parameters.
 * @returns {Array} Query results.
 */
export function querySourceFeatures(container, sourceId, parameters) {
    return mapInstances[container].querySourceFeatures(sourceId, parameters);
}

/**
 * Queries terrain elevation at a given location.
 * @param {string} container - The map container.
 * @param {Array<number>} lngLat - Longitude and latitude to query.
 * @returns {number} Elevation in meters.
 */
export function queryTerrainElevation(container, lngLat) {
    return mapInstances[container].queryTerrainElevation(lngLat);
}

/**
 * Forces a redraw of the map.
 * @param {string} container - The map container.
 */
export function redraw(container) {
    mapInstances[container].redraw();
}

/**
 * Cleans up internal resources associated with the map.
 * Teardown is idempotent: safe to call multiple times for the same container.
 * @param {string} container - The map container.
 */
export function remove(container) {
    // Cancel throttle timers and drop DotNet callback closures before map.remove().
    offAll(container);

    for (const [markerId, markerContainer] of Object.entries(markerContainers)) {
        if (markerContainer === container) {
            removeMarker(markerId);
        }
    }

    for (const [popupId, popupContainer] of Object.entries(popupContainers)) {
        if (popupContainer === container) {
            removePopup(popupId);
        }
    }

    if (mapInstances[container]) {
        try {
            mapInstances[container].remove();
        } catch (error) {
            console.warn(`MapLibre.remove: map.remove() failed for '${container}'.`, error);
        }
        delete mapInstances[container];
    }

    if (optionsInstances[container]) {
        delete optionsInstances[container];
    }

    if (projectionInstances[container]) {
        delete projectionInstances[container];
    }

    if (currentLocationMarkerInstances[container]) {
        delete currentLocationMarkerInstances[container];
    }

    disposeSkipCache(container);
    disposeOverlay(container);
}

/**
 * Dev diagnostics for lifecycle leaks (not used on the production hot path).
 * @returns {{ maps: number, listeners: number, markers: number, popups: number }}
 */
export function getLifecycleDiagnostics() {
    return {
        maps: Object.keys(mapInstances).length,
        listeners: Object.keys(listenerRegistry).length,
        markers: Object.keys(markerInstances).length,
        popups: Object.keys(popupInstances).length
    };
}

/**
 * Removes a control from the map.
 * @param {string} container - The map container.
 * @param {IControl} control - The control to remove.
 */
export function removeControl(container, control) {
    mapInstances[container].removeControl(control);
}

/**
 * Removes feature states from the map.
 * @param {string} container - The map container.
 * @param {Object} target - The feature or source to remove states.
 * @param {string} key - Optional key of the state to remove.
 */
export function removeFeatureState(container, target, key) {
    mapInstances[container].removeFeatureState(target, key);
}

/**
 * Removes an image from the map.
 * @param {string} container - The map container.
 * @param {string} id - The ID of the image to remove.
 */
export function removeImage(container, id) {
    mapInstances[container].removeImage(id);
    forgetImage(overlayFor(container), id);
}

/**
 * Removes a layer by its ID.
 * @param {string} container - The map container.
 * @param {string} id - The ID of the layer to remove.
 */
export function removeLayer(container, id) {
    mapInstances[container].removeLayer(id);
    forgetLayer(overlayFor(container), id);
}

/**
 * Removes a layer when it exists; no-op otherwise.
 * @param {string} container - The map container.
 * @param {string} id - The ID of the layer to remove.
 * @returns {boolean} True when a layer was removed.
 */
export function removeLayerIfExists(container, id) {
    const map = mapInstances[container];
    if (!map?.getLayer(id)) {
        return false;
    }

    map.removeLayer(id);
    forgetLayer(overlayFor(container), id);
    return true;
}

/**
 * Removes multiple layers when they exist; missing ids are skipped.
 * @param {string} container
 * @param {string[]} ids
 */
export function removeLayersIfExist(container, ids) {
    if (!Array.isArray(ids) || ids.length === 0) {
        return;
    }

    for (const id of ids) {
        removeLayerIfExists(container, id);
    }
}

/**
 * Removes a source from the map's style.
 * @param {string} container - The map container.
 * @param {string} id - The ID of the source to remove.
 */
export function removeSource(container, id) {
    mapInstances[container].removeSource(id);
    skipCacheFor(container).forget(id);
    forgetSource(overlayFor(container), id);
}

/**
 * Removes a source when it exists; no-op otherwise.
 * @param {string} container - The map container.
 * @param {string} id - The ID of the source to remove.
 * @returns {boolean} True when a source was removed.
 */
export function removeSourceIfExists(container, id) {
    const map = mapInstances[container];
    if (!map.getSource(id)) {
        return false;
    }

    map.removeSource(id);
    skipCacheFor(container).forget(id);
    forgetSource(overlayFor(container), id);
    return true;
}

/**
 * Removes multiple sources when they exist; missing ids are skipped.
 * @param {string} container
 * @param {string[]} ids
 */
export function removeSourcesIfExist(container, ids) {
    if (!Array.isArray(ids) || ids.length === 0) {
        return;
    }

    for (const id of ids) {
        removeSourceIfExists(container, id);
    }
}

/**
 * Removes the sprite from the map's style.
 * @param {string} container - The map container.
 * @param {string} id - The ID of the sprite to remove.
 */
export function removeSprite(container, id) {
    mapInstances[container].removeSprite(id);
}

/**
 * Rotates the map so that north is up.
 * @param {string} container - The map container.
 * @param {object} [options] - Animation options.
 * @param {any} [eventData] - Additional event data.
 */
export function resetNorth(container, options, eventData) {
    mapInstances[container].resetNorth(options, eventData);
}

/**
 * Resets the map's north and pitch angles with an animated transition.
 * @param {string} container - The map container.
 * @param {object} [options] - Animation options.
 * @param {any} [eventData] - Additional event data.
 */
export function resetNorthPitch(container, options, eventData) {
    mapInstances[container].resetNorthPitch(options, eventData);
}

/**
 * Resizes the map according to its container's dimensions.
 * @param {string} container - The map container.
 * @param {any} [eventData] - Additional event data.
 * @param {boolean} [constrainTransform=true] - Transform constraint flag.
 */
export function resize(container, eventData, constrainTransform = true) {
    mapInstances[container].resize(eventData, constrainTransform);
}

/**
 * Rotates the map to the specified bearing.
 * @param {string} container - The map container.
 * @param {number} bearing - The target bearing.
 * @param {object} [options] - Animation options.
 * @param {any} [eventData] - Additional event data.
 */
export function rotateTo(container, bearing, options, eventData) {
    mapInstances[container].rotateTo(bearing, options, eventData);
}

/**
 * Sets the map's bearing (rotation).
 * @param {string} container - The map container.
 * @param {number} bearing - The target bearing.
 * @param {any} [eventData] - Additional event data.
 */
export function setBearing(container, bearing, eventData) {
    mapInstances[container].setBearing(bearing, eventData);
}

/**
 * Sets the map's geographical center point.
 * @param {string} container - The map container.
 * @param {Array<number>} center - The center coordinates [lng, lat].
 * @param {any} [eventData] - Additional event data.
 */
export function setCenter(container, center, eventData) {
    mapInstances[container].setCenter(center, eventData);
}

/**
 * Sets the map's centerClampedToGround value.
 * @param {string} container - The map container.
 * @param {boolean} centerClampedToGround - Clamped to ground flag.
 */
export function setCenterClampedToGround(container, centerClampedToGround) {
    mapInstances[container].setCenterClampedToGround(centerClampedToGround);
}

/**
 * Sets the elevation of the map's center point.
 * @param {string} container - The map container.
 * @param {number} elevation - The target elevation in meters.
 * @param {any} [eventData] - Additional event data.
 */
export function setCenterElevation(container, elevation, eventData) {
    mapInstances[container].setCenterElevation(elevation, eventData);
}

/**
 * Sets the event parent to bubble events to.
 * @param {string} container - The map container.
 * @param {Evented} parent - The parent Evented instance.
 * @param {any} [data] - Additional data.
 */
export function setEventedParent(container, parentContainer, data) {
    const parent = parentContainer ? mapInstances[parentContainer] : null;
    mapInstances[container].setEventedParent(parent, data);
}

/**
 * Sets the state of a specific feature.
 * @param {string} container - The map container.
 * @param {Object} feature - Feature identifier object.
 * @param {Object} state - State to apply.
 */
export function setFeatureState(container, feature, state) {
    mapInstances[container].setFeatureState(feature, state);
}

/**
 * Sets a global state property.
 * @param {string} container - The map container.
 * @param {Object} propertyName - The name of the state property to set.
 * @param {Object} value - The value of the state property to set.
 */
export function setGlobalStateProperty(container, propertyName, value) {
    mapInstances[container].setGlobalStateProperty(propertyName, value);
}

/**
 * Sets a filter for a specified layer.
 * @param {string} container - The map container.
 * @param {string} layerId - The layer ID.
 * @param {object} [filter] - Filter to apply.
 * @param {object} [options] - Filter options.
 */
export function setFilter(container, layerId, filter, options) {
    const map = mapInstances[container];
    if (!map?.getLayer(layerId)) return;
    map.setFilter(layerId, filter, options);
}

/**
 * Sets the zoom range for a layer.
 * @param {string} container - The map container.
 * @param {string} layerId - The layer id.
 * @param {number} minzoom - Minimum zoom level.
 * @param {number} maxzoom - Maximum zoom level.
 */
export function setLayerZoomRange(container, layerId, minzoom, maxzoom) {
    mapInstances[container].setLayerZoomRange(layerId, minzoom, maxzoom);
}

/**
 * Sets the map's glyph source URL.
 * @param {string} container - The map container.
 * @param {string} glyphsUrl - The glyph URL.
 * @param {object} options - Options object.
 */
export function setGlyphs(container, glyphsUrl, options) {
    mapInstances[container].setGlyphs(glyphsUrl, options);
}

/**
 * Updates the map's style.
 * @param {string} container - The map container.
 * @param {string | object} style - The new style URL or JSON.
 * @param {object} [options] - Style options.
 */
export function setStyle(container, style, options) {
    skipCacheFor(container).forget();
    mapInstances[container].setStyle(style, options);
}

/**
 * Loads a 3D terrain mesh using a "raster-dem" source.
 * @param {string} container - The map container.
 * @param {object} options - Terrain specification options.
 */
export function setTerrain(container, options) {
    mapInstances[container].setTerrain(options);
}

export function setSky(container, sky) {
    mapInstances[container].setSky(sky);
}

export function setLight(container, light) {
    mapInstances[container].setLight(light);
}

export function setTransformConstrain(container, dotnetReference) {
    mapInstances[container].transformConstrain = createTransformConstrainFn(dotnetReference);
}

function matrixFromCustomRenderInput(optionsOrMatrix) {
    if (!optionsOrMatrix) {
        return [];
    }

    // MapLibre GL JS v6+: second arg is CustomRenderMethodInput, not a raw matrix.
    const matrix = optionsOrMatrix.modelViewProjectionMatrix ?? optionsOrMatrix;
    if (typeof matrix.length === 'number') {
        return Array.from(matrix);
    }

    return [];
}

export function addCustomLayer(container, layerId, options, dotnetReference, beforeId) {
    const map = mapInstances[container];
    customLayerHandlers.set(layerId, dotnetReference);

    const layer = {
        id: layerId,
        type: 'custom',
        renderingMode: options?.renderingMode ?? '2d',
        onAdd(mapInstance, gl) {
            dotnetReference.invokeMethodAsync('OnAdd', !!gl).catch(console.error);
        },
        onRemove() {
            dotnetReference.invokeMethodAsync('OnRemove').catch(console.error);
            customLayerHandlers.delete(layerId);
        },
        prerender(gl, optionsOrMatrix) {
            dotnetReference.invokeMethodAsync('OnPrerender', matrixFromCustomRenderInput(optionsOrMatrix)).catch(console.error);
        },
        render(gl, optionsOrMatrix) {
            dotnetReference.invokeMethodAsync('OnRender', matrixFromCustomRenderInput(optionsOrMatrix)).catch(console.error);
        },
    };

    if (options?.minzoom !== undefined && options?.minzoom !== null) {
        layer.minzoom = options.minzoom;
    }
    if (options?.maxzoom !== undefined && options?.maxzoom !== null) {
        layer.maxzoom = options.maxzoom;
    }

    if (beforeId === undefined || beforeId === null) {
        map.addLayer(layer);
    } else {
        map.addLayer(layer, beforeId);
    }
}

export function timeControlSetNow(timestamp) {
    // MapLibre GL JS v6: setNow/restoreNow/isTimeFrozen are top-level exports (timeControl removed).
    globalThis.maplibregl.setNow(timestamp);
}

export function timeControlRestoreNow() {
    globalThis.maplibregl.restoreNow();
}

export function timeControlIsFrozen() {
    return globalThis.maplibregl.isTimeFrozen();
}

/**
 * Supplies missing style images (MapLibre GL JS v6+).
 * Replaces resolving images inside a styleimagemissing listener via addImage.
 * @param {string} container
 * @param {Object|null} dotnetReference - .NET handler with Invoke(id) => Promise, or null to clear.
 */
export function setMissingStyleImageResolver(container, dotnetReference) {
    const map = requireMap(container, 'setMissingStyleImageResolver');
    if (!dotnetReference) {
        map.setMissingStyleImageResolver(null);
        return;
    }

    map.setMissingStyleImageResolver(async (id) => {
        await dotnetReference.invokeMethodAsync('Invoke', id);
    });
}

/**
 * Updates the requestManager's transform request with a .NET callback.
 * Prefer setJsTransformRequestPolicy for tile/glyph/sprite traffic — .NET
 * callbacks on every resource request are a hot-path anti-pattern.
 * @param {string} container - The map container.
 * @param {Object|null} dotnetReference - .NET reference for the transform request callback, or null to clear.
 */
export function setTransformRequest(container, dotnetReference) {
    const map = requireMap(container, 'setTransformRequest');
    if (!dotnetReference) {
        map.setTransformRequest(null);
        return;
    }

    map.setTransformRequest(createTransformRequestFn(dotnetReference));
}

/**
 * Sets a JS-only transformRequest policy (constant URL/header rewrite).
 * Prefer this over SetTransformRequest for tile/glyph/sprite traffic so .NET
 * is not invoked on the map hot path. Auth should use cookies or signed URLs.
 * @param {string} container
 * @param {function|null} policyFn - (url, resourceType) => RequestParameters | undefined
 */
export function setJsTransformRequestPolicy(container, policyFn) {
    const map = requireMap(container, 'setJsTransformRequestPolicy');
    if (!policyFn) {
        map.setTransformRequest(null);
        return;
    }

    map.setTransformRequest((url, resourceType) => {
        const result = policyFn(url, resourceType);
        return normalizeRequestParameters(result, url);
    });
}

/**
 * Sets the map's vertical field of view in degrees.
 * @param {string} container - The map container.
 * @param {number} fov - The target vertical field of view (0-180 degrees).
 * @param {any} [eventData] - Additional event data.
 */
export function setVerticalFieldOfView(container, fov, eventData) {
    mapInstances[container].setVerticalFieldOfView(fov, eventData);
}

/**
 * Sets the map's projection.
 * @param {string} container - The map container.
 * @param {object} projection - The projection object.
 */
export function setProjection(container, projection) {
    projectionInstances[container] = projection;
    mapInstances[container]?.setProjection(projection);
}

/**
 * Sets the map's zoom level.
 * @param {string} container - The map container.
 * @param {number} zoom - The desired zoom level (0-20).
 * @param {any} [eventData] - Additional event data.
 */
export function setZoom(container, zoom, eventData) {
    mapInstances[container].setZoom(zoom, eventData);
}

export function setPitch(container, pitch, eventData) {
    mapInstances[container].setPitch(pitch, eventData);
}

export function setRoll(container, roll, eventData) {
    mapInstances[container].setRoll(roll, eventData);
}

export function setPadding(container, padding, eventData) {
    mapInstances[container].setPadding(padding, eventData);
}

export function setMaxZoom(container, maxZoom) {
    mapInstances[container].setMaxZoom(maxZoom);
}

export function setMinZoom(container, minZoom) {
    mapInstances[container].setMinZoom(minZoom);
}

export function setMaxPitch(container, maxPitch) {
    mapInstances[container].setMaxPitch(maxPitch);
}

export function setMinPitch(container, minPitch) {
    mapInstances[container].setMinPitch(minPitch);
}

export function setRenderWorldCopies(container, renderWorldCopies) {
    mapInstances[container].setRenderWorldCopies(renderWorldCopies);
}

/**
 * Snaps the map so that north (0? bearing) is up, if the current bearing is close enough.
 * @param {string} container - The map container.
 * @param {object} [options] - Animation options.
 * @param {any} [eventData] - Additional event data.
 */
export function snapToNorth(container, options, eventData) {
    mapInstances[container].snapToNorth(options, eventData);
}

/**
 * Stops any animated transition currently underway.
 * @param {string} container - The map container.
 */
export function stop(container) {
    mapInstances[container].stop();
}

/**
 * Triggers the rendering of a single frame.
 * Use this method with custom layers to force rendering updates.
 * @param {string} container - The map container.
 */
export function triggerRepaint(container) {
    mapInstances[container].triggerRepaint();
}

/**
 * Converts pixel coordinates (x, y) to geographical coordinates (longitude, latitude).
 * @param {string} container - The map container.
 * @param {Array<number>} point - The pixel coordinates [x, y].
 * @returns {Array<number>} Geographical coordinates [lng, lat].
 */
export function unproject(container, point) {
    return mapInstances[container].unproject(point);
}

/**
 * Updates an existing image in the map's sprite.
 * @param {string} container - The map container.
 * @param {string} id - The image ID.
 * @param {ImageBitmap|HTMLImageElement|ImageData|Object} image - The new image data to update.
 */
export function updateImage(container, id, image) {
    mapInstances[container].updateImage(id, image);
}

/**
 * Increases the map's zoom level by 1.
 * @param {string} container - The map container.
 * @param {object} [options] - Animation options object.
 * @param {any} [eventData] - Additional event data.
 */
export function zoomIn(container, options, eventData) {
    mapInstances[container].zoomIn(options, eventData);
}

/**
 * Decreases the map's zoom level by 1.
 * @param {string} container - The map container.
 * @param {object} [options] - Animation options object.
 * @param {any} [eventData] - Additional event data.
 */
export function zoomOut(container, options, eventData) {
    mapInstances[container].zoomOut(options, eventData);
}

/**
 * Zooms the map to a specific zoom level with animation.
 * @param {string} container - The map container.
 * @param {number} zoom - The target zoom level.
 * @param {object} [options] - Options for animation like duration, offset, etc.
 * @param {any} [eventData] - Additional event data.
 */
export function zoomTo(container, zoom, options, eventData) {
    mapInstances[container].zoomTo(zoom, options, eventData);
}

function resolveMarkerOptions(options) {
    const resolved = { ...options };
    delete resolved.extensions;
    delete resolved.elementId;

    if (options?.elementId) {
        resolved.element = document.getElementById(options.elementId);
    }

    return resolved;
}

function applyMarkerExtensions(marker, extensions) {
    if (!extensions) {
        return;
    }

    if (extensions.htmlContent?.length > 0) {
        marker.getElement().innerHTML = extensions.htmlContent;
    }

    if (extensions.popupHtmlContent?.length > 0) {
        marker.setPopup(
            new globalThis.maplibregl.Popup({ offset: 25 })
                .setHTML(extensions.popupHtmlContent)
        );
    }
}

function getMarker(markerId) {
    return markerInstances[markerId];
}

function getPopup(popupId) {
    return popupInstances[popupId];
}

function removeMarkerListeners(markerId) {
    for (const [listenerId, entry] of Object.entries(markerListenerRegistry)) {
        if (entry.markerId === markerId) {
            markerOff(listenerId);
        }
    }
}

function removePopupListeners(popupId) {
    for (const [listenerId, entry] of Object.entries(popupListenerRegistry)) {
        if (entry.popupId === popupId) {
            popupOff(listenerId);
        }
    }
}

export function createPopup(container, popupId, options, lngLat, content) {
    const map = mapInstances[container];
    if (!map) {
        return;
    }

    const popup = new globalThis.maplibregl.Popup(options ?? {});

    if (content?.html) {
        popup.setHTML(content.html);
    } else if (content?.text) {
        popup.setText(content.text);
    }

    if (lngLat) {
        popup.setLngLat([lngLat.lng, lngLat.lat]);
    }

    popup.addTo(map);
    popupInstances[popupId] = popup;
    popupContainers[popupId] = container;
}

export function createMarker(container, markerId, options, position) {
    const map = mapInstances[container];
    if (!map) {
        return;
    }

    const extensions = options?.extensions;
    const resolvedOptions = resolveMarkerOptions(options ?? {});
    const marker = new globalThis.maplibregl.Marker(resolvedOptions)
        .setLngLat([position.lng, position.lat]);
    marker.addTo(map);

    applyMarkerExtensions(marker, extensions);

    markerInstances[markerId] = marker;
    markerContainers[markerId] = container;
}

export function removeMarker(markerId) {
    removeMarkerListeners(markerId);

    const marker = markerInstances[markerId];
    if (!marker) {
        return;
    }

    marker.remove();
    delete markerInstances[markerId];
    delete markerContainers[markerId];
}

export function removePopup(popupId) {
    removePopupListeners(popupId);

    const popup = popupInstances[popupId];
    if (!popup) {
        return;
    }

    popup.remove();
    delete popupInstances[popupId];
    delete popupContainers[popupId];
}

export function invokeMarker(markerId, method, args) {
    const marker = getMarker(markerId);
    if (!marker) {
        throw new Error(`Marker not found: ${markerId}`);
    }

    const payload = args ?? [];

    switch (method) {
        case 'setLngLat': {
            const position = payload[0];
            marker.setLngLat([position.lng, position.lat]);
            return null;
        }
        case 'getLngLat': {
            const lngLat = marker.getLngLat();
            return { lng: lngLat.lng, lat: lngLat.lat };
        }
        case 'setOffset': {
            marker.setOffset(payload[0]);
            return null;
        }
        case 'getOffset': {
            const point = marker.getOffset();
            return [point.x, point.y];
        }
        case 'setOpacity': {
            marker.setOpacity(payload[0], payload[1]);
            return null;
        }
        case 'setPopup': {
            const popupId = payload[0];
            marker.setPopup(popupId ? getPopup(popupId) : null);
            return null;
        }
        case 'getPopup': {
            const popup = marker.getPopup();
            if (!popup) {
                return null;
            }

            for (const [popupId, instance] of Object.entries(popupInstances)) {
                if (instance === popup) {
                    return popupId;
                }
            }

            return null;
        }
        case 'addTo': {
            const container = payload[0];
            marker.addTo(mapInstances[container]);
            markerContainers[markerId] = container;
            return null;
        }
        case 'setPitchAlignment':
            marker.setPitchAlignment(payload[0] ?? undefined);
            return null;
        case 'setRotationAlignment':
            marker.setRotationAlignment(payload[0] ?? undefined);
            return null;
        default: {
            const result = marker[method](...(payload.length ? payload : []));
            return result ?? null;
        }
    }
}

export function invokePopup(popupId, method, args) {
    const popup = getPopup(popupId);
    if (!popup) {
        throw new Error(`Popup not found: ${popupId}`);
    }

    const payload = args ?? [];

    switch (method) {
        case 'setLngLat': {
            const position = payload[0] ?? {};
            const lng = position.lng ?? position.longitude ?? position.Longitude;
            const lat = position.lat ?? position.latitude ?? position.Latitude;
            if (Number.isFinite(lng) && Number.isFinite(lat)) {
                popup.setLngLat([lng, lat]);
            }
            return null;
        }
        case 'getLngLat': {
            const lngLat = popup.getLngLat();
            return { lng: lngLat.lng, lat: lngLat.lat };
        }
        case 'setHTML':
            popup.setHTML(payload[0]);
            return null;
        case 'setText':
            popup.setText(payload[0]);
            return null;
        case 'setPadding':
            popup.setPadding(payload[0]);
            return null;
        case 'addTo': {
            const container = payload[0];
            popup.addTo(mapInstances[container]);
            popupContainers[popupId] = container;
            return null;
        }
        default: {
            const result = popup[method](...(payload.length ? payload : []));
            return result ?? null;
        }
    }
}

export function markerOn(markerId, eventType, dotnetReference) {
    const marker = getMarker(markerId);
    if (!marker) {
        throw new Error(`Marker not found: ${markerId}`);
    }

    const listenerId = crypto.randomUUID();
    const handler = () => {
        const lngLat = marker.getLngLat();
        const payload = JSON.stringify({
            type: eventType,
            lngLat: { lng: lngLat.lng, lat: lngLat.lat },
        });
        dotnetReference.invokeMethodAsync('Invoke', payload).catch(console.error);
    };

    marker.on(eventType, handler);
    markerListenerRegistry[listenerId] = { markerId, eventType, handler };
    return listenerId;
}

export function markerOff(listenerId) {
    const entry = markerListenerRegistry[listenerId];
    if (!entry) {
        return;
    }

    const marker = getMarker(entry.markerId);
    marker?.off(entry.eventType, entry.handler);
    delete markerListenerRegistry[listenerId];
}

export function popupOn(popupId, eventType, dotnetReference) {
    const popup = getPopup(popupId);
    if (!popup) {
        throw new Error(`Popup not found: ${popupId}`);
    }

    const listenerId = crypto.randomUUID();
    const handler = () => {
        const lngLat = popup.getLngLat();
        const payload = JSON.stringify({
            type: eventType,
            lngLat: { lng: lngLat.lng, lat: lngLat.lat },
        });
        dotnetReference.invokeMethodAsync('Invoke', payload).catch(console.error);
    };

    popup.on(eventType, handler);
    popupListenerRegistry[listenerId] = { popupId, eventType, handler };
    return listenerId;
}

export function popupOff(listenerId) {
    const entry = popupListenerRegistry[listenerId];
    if (!entry) {
        return;
    }

    const popup = getPopup(entry.popupId);
    popup?.off(entry.eventType, entry.handler);
    delete popupListenerRegistry[listenerId];
}

export function moveMarker(markerId, position) {
    invokeMarker(markerId, 'setLngLat', [position]);
}

export function createCurrentLocationMarker(container, options, position) {
    let elementId = options.elementId;
    if (!!elementId) {
        options.element = document.getElementById(elementId);
    }

    let marker = new globalThis.maplibregl.Marker(options);
    marker
        .setLngLat([position.lng, position.lat])
        .addTo(mapInstances[container]);

    currentLocationMarkerInstances[container] = marker;
}

export function moveCurrentLocationMarker(container, position) {
    let marker = currentLocationMarkerInstances[container];
    if (marker) {
        marker.setLngLat([position.lng, position.lat]);
    }
}

export function removeCurrentLocationMarker(container) {
    let marker = currentLocationMarkerInstances[container];
    if (marker) {
        marker.remove()
        delete currentLocationMarkerInstances[container];
    }
}

/**
 * Perform all applied bulk transactions.
 * The only purpose of bulk transaction send multiple transactions in one message, reducing the roundtrip time.
 * Each action in the transaction is performed in the order they are received.
 * @param {string} container - The map container.
 * @param {object} data - Options for animation like duration, offset, etc.
 */
export async function executeTransaction(container, data) {
    const transactions = coalesceTransactions(Array.isArray(data) ? data : []);
    for (const d of transactions) {
        switch (d.event) {
            case "addControl":
                addControl(container, d.data[0], d.data[1], d.data[2]);
                break;
            case "addGeolocateControl":
                addGeolocateControl(container, d.data[0], d.data[1]);
                break;
            case "addNavigationControl":
                addNavigationControl(container, d.data[0], d.data[1]);
                break;
            case "addScaleControl":
                addScaleControl(container, d.data[0], d.data[1]);
                break;
            case "addImage":
                await addImage(container, d.data[0], d.data[1], d.data[2]);
                break;
            case "addLayer":
                addLayer(container, d.data[0], d.data[1]);
                break;
            case "ensureLayer":
                ensureLayer(container, d.data[0], d.data[1]);
                break;
            case "addSource":
                addSource(container, d.data[0], d.data[1]);
                break;
            case "addSprite":
                addSprite(container, d.data[0], d.data[1], d.data[2]);
                break;
            case "removeControl":
                removeControl(container, d.data[0]);
                break;
            case "removeFeatureState":
                removeFeatureState(container, d.data[0], d.data[1]);
                break;
            case "removeImage":
                removeImage(container, d.data[0]);
                break;
            case "removeLayer":
                removeLayer(container, d.data[0]);
                break;
            case "removeSource":
                removeSource(container, d.data[0]);
                break;
            case "removeSprite":
                removeSprite(container, d.data[0]);
                break;
            case "setSourceData":
                await setSourceData(container, d.data[0], d.data[1]);
                break;
            case "setSourceDataAsJson":
                await setSourceDataAsJson(container, d.data[0], d.data[1]);
                break;
            case "setSourceTiles":
            case "setVectorSourceTiles":
                setSourceTiles(container, d.data[0], d.data[1]);
                break;
            case "upsertTileSource":
                upsertTileSource(container, d.data[0], d.data[1]);
                break;
            case "setSourceUrl":
                setSourceUrl(container, d.data[0], d.data[1]);
                break;
            case "ensureImages":
                await ensureImages(container, d.data[0]);
                break;
            case "updateSourceData":
                await updateSourceData(container, d.data[0], d.data[1]);
                break;
            case "moveLayer":
                moveLayer(container, d.data[0], d.data[1]);
                break;
            case "setLayerOrder":
                setLayerOrder(container, d.data[0]);
                break;
            case "setFilter":
                setFilter(container, d.data[0], d.data[1], d.data[2]);
                break;
            case "setLayoutProperty":
                setLayoutProperty(container, d.data[0], d.data[1], d.data[2], d.data[3]);
                break;
            case "setLayoutProperties":
                setLayoutProperties(container, d.data[0], d.data[1], d.data[2]);
                break;
            case "setPaintProperty":
                setPaintProperty(container, d.data[0], d.data[1], d.data[2], d.data[3]);
                break;
            case "setPaintProperties":
                setPaintProperties(container, d.data[0], d.data[1], d.data[2]);
                break;
            case "setLayerZoomRange":
                setLayerZoomRange(container, d.data[0], d.data[1], d.data[2]);
                break;
            case "setFeatureState":
                setFeatureState(container, d.data[0], d.data[1]);
                break;
            case "setTerrain":
                setTerrain(container, d.data[0]);
                break;
            case "setSky":
                setSky(container, d.data[0]);
                break;
            case "setLight":
                setLight(container, d.data[0]);
                break;
            case "setProjection":
                setProjection(container, d.data[0]);
                break;
            case "setStyle":
                setStyle(container, d.data[0], d.data[1]);
                break;
            case "removeLayerIfExists":
                removeLayerIfExists(container, d.data[0]);
                break;
            case "removeLayersIfExist":
                removeLayersIfExist(container, d.data[0]);
                break;
            case "removeSourceIfExists":
                removeSourceIfExists(container, d.data[0]);
                break;
            case "removeSourcesIfExist":
                removeSourcesIfExist(container, d.data[0]);
                break;
            default:
                console.warn(`Unknown transaction event: ${d.event}`);
                throw new Error(`Unknown transaction event: ${d.event}`);
        }
    }
}

const INTERACTION_HANDLERS = {
    dragPan: 'dragPan',
    dragRotate: 'dragRotate',
    scrollZoom: 'scrollZoom',
    boxZoom: 'boxZoom',
    doubleClickZoom: 'doubleClickZoom',
    keyboard: 'keyboard',
    touchZoomRotate: 'touchZoomRotate',
    touchPitch: 'touchPitch',
    cooperativeGestures: 'cooperativeGestures'
};

function resolveInteractionHandler(map, handlerName, apiName) {
    const key = INTERACTION_HANDLERS[handlerName] ?? handlerName;
    const handler = map[key];
    if (!handler || typeof handler.enable !== 'function' || typeof handler.disable !== 'function') {
        throw new Error(`MapLibre.${apiName}: interaction handler '${handlerName}' was not found.`);
    }

    return handler;
}

/**
 * Enables or disables a MapLibre interaction handler.
 * @param {string} container
 * @param {string} handlerName - dragPan|dragRotate|scrollZoom|boxZoom|doubleClickZoom|keyboard|touchZoomRotate|touchPitch|cooperativeGestures
 * @param {boolean} enabled
 */
export function setInteractionHandlerEnabled(container, handlerName, enabled) {
    const map = requireMap(container, 'setInteractionHandlerEnabled');
    const handler = resolveInteractionHandler(map, handlerName, 'setInteractionHandlerEnabled');
    if (enabled) {
        handler.enable();
    } else {
        handler.disable();
    }
}

/**
 * Returns whether the given interaction handler is enabled.
 * @param {string} container
 * @param {string} handlerName
 * @returns {boolean}
 */
export function isInteractionHandlerEnabled(container, handlerName) {
    const map = requireMap(container, 'isInteractionHandlerEnabled');
    const handler = resolveInteractionHandler(map, handlerName, 'isInteractionHandlerEnabled');
    return typeof handler.isEnabled === 'function' ? !!handler.isEnabled() : true;
}

/**
 * Snapshot of all standard interaction handlers.
 * @param {string} container
 */
export function getInteractionHandlersState(container) {
    const map = requireMap(container, 'getInteractionHandlersState');
    const state = {};
    for (const name of Object.keys(INTERACTION_HANDLERS)) {
        const handler = map[INTERACTION_HANDLERS[name]];
        state[name] = typeof handler?.isEnabled === 'function' ? !!handler.isEnabled() : false;
    }
    return state;
}

/**
 * Enables or disables cooperative gestures (boolean MapLibre option).
 * @param {string} container
 * @param {boolean} enabled
 */
export function setCooperativeGestures(container, enabled) {
    setInteractionHandlerEnabled(container, 'cooperativeGestures', enabled);
}

/**
 * @param {string} container
 * @returns {boolean}
 */
export function isCooperativeGesturesEnabled(container) {
    return isInteractionHandlerEnabled(container, 'cooperativeGestures');
}

function requireSourceWithMethod(container, sourceId, methodName, apiName) {
    const map = requireMap(container, apiName);
    const source = map.getSource(sourceId);
    if (!source) {
        throw new Error(`MapLibre.${apiName}: source '${sourceId}' was not found.`);
    }

    if (typeof source[methodName] !== 'function') {
        throw new Error(`MapLibre.${apiName}: source '${sourceId}' does not support ${methodName}().`);
    }

    return source;
}

/**
 * Updates ImageSource URL and/or decoded image, with optional coordinates.
 * MapLibre 6.1+: options may be { url } or { image } (+ coordinates).
 * @param {string} container
 * @param {string} sourceId
 * @param {{ url?: string, image?: ImageBitmap|HTMLImageElement|HTMLCanvasElement|ImageData, coordinates?: number[][] }} options
 */
export async function updateImageSource(container, sourceId, options) {
    const source = requireSourceWithMethod(container, sourceId, 'updateImage', 'updateImageSource');
    source.updateImage(options ?? {});
}

/**
 * Sets or clears premultiply-alpha for a raster tile source (MapLibre 6+).
 * @param {string} container
 * @param {string} sourceId
 * @param {boolean} premultiplyAlpha
 */
export function setRasterPremultiplyAlpha(container, sourceId, premultiplyAlpha) {
    const source = requireSourceWithMethod(container, sourceId, 'setPremultiplyAlpha', 'setRasterPremultiplyAlpha');
    source.setPremultiplyAlpha(!!premultiplyAlpha);
}

/**
 * @param {string} container
 * @param {string} sourceId
 * @param {object} options
 */
export async function setClusterOptions(container, sourceId, options) {
    const source = requireSourceWithMethod(container, sourceId, 'setClusterOptions', 'setClusterOptions');
    const payload = {};
    if (options && typeof options === 'object') {
        if (options.cluster !== undefined) payload.cluster = options.cluster;
        if (options.clusterRadius !== undefined) payload.clusterRadius = options.clusterRadius;
        if (options.clusterMaxZoom !== undefined) payload.clusterMaxZoom = options.clusterMaxZoom;
    }
    await source.setClusterOptions(payload);
}

/**
 * @param {string} container
 * @param {string} sourceId
 * @returns {{ cluster?: boolean, clusterMaxZoom?: number, clusterRadius?: number }}
 */
export function getClusterOptions(container, sourceId) {
    const source = requireSourceWithMethod(container, sourceId, 'getClusterOptions', 'getClusterOptions');
    return source.getClusterOptions();
}

/**
 * @param {string} container
 * @param {string} sourceId
 * @returns {Promise<object>}
 */
export async function getGeoJsonData(container, sourceId) {
    const source = requireSourceWithMethod(container, sourceId, 'getData', 'getGeoJsonData');
    return await source.getData();
}

/**
 * @param {string} container
 * @param {string} sourceId
 * @returns {Promise<{ _sw: { lng: number, lat: number }, _ne: { lng: number, lat: number } } | object>}
 */
export async function getGeoJsonBounds(container, sourceId) {
    const source = requireSourceWithMethod(container, sourceId, 'getBounds', 'getGeoJsonBounds');
    const bounds = await source.getBounds();
    if (!bounds) {
        return null;
    }

    if (typeof bounds.getSouthWest === 'function' && typeof bounds.getNorthEast === 'function') {
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();
        return {
            _sw: { lng: sw.lng, lat: sw.lat },
            _ne: { lng: ne.lng, lat: ne.lat }
        };
    }

    if (typeof bounds.toArray === 'function') {
        const [[west, south], [east, north]] = bounds.toArray();
        return {
            _sw: { lng: west, lat: south },
            _ne: { lng: east, lat: north }
        };
    }

    return bounds;
}

/**
 * Sets corner coordinates for image/video/canvas sources.
 * @param {string} container
 * @param {string} sourceId
 * @param {number[][]} coordinates
 */
export function setSourceCoordinates(container, sourceId, coordinates) {
    const source = requireSourceWithMethod(container, sourceId, 'setCoordinates', 'setSourceCoordinates');
    source.setCoordinates(coordinates);
}

/**
 * Returns the HTMLVideoElement for a video source.
 * @param {string} container
 * @param {string} sourceId
 */
export function getVideoSourceElement(container, sourceId) {
    const source = requireSourceWithMethod(container, sourceId, 'getVideo', 'getVideoSourceElement');
    return source.getVideo();
}

/**
 * Starts CanvasSource animation frames.
 */
export function playCanvasSource(container, sourceId) {
    const source = requireSourceWithMethod(container, sourceId, 'play', 'playCanvasSource');
    source.play();
}

/**
 * Pauses CanvasSource animation frames.
 */
export function pauseCanvasSource(container, sourceId) {
    const source = requireSourceWithMethod(container, sourceId, 'pause', 'pauseCanvasSource');
    source.pause();
}

/**
 * Disables all rotation functionality
 * @param {string} container - The map container.
 */
export function disableRotation(container) {
    const map = requireMap(container, 'disableRotation');
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();
    map.keyboard.disableRotation();
}

/**
 * Disables map zoom gestures that conflict with terra-draw point editing:
 * double-click / double-tap zoom, and tap-then-drag-vertical zoom.
 * Pinch-to-zoom and scroll-wheel zoom remain enabled.
 * @param {string} container - The map container.
 */
export function disableMapZoomGestures(container) {
    const map = mapInstances[container];
    if (!map) return;
    map.doubleClickZoom.disable();
    // _tapDragZoom is an internal handler inside touchZoomRotate; there is no
    // public API to toggle it independently of pinch-zoom.
    map.touchZoomRotate?._tapDragZoom?.disable?.();
}

/**
 * Re-enables map zoom gestures previously disabled by disableMapZoomGestures.
 * @param {string} container - The map container.
 */
export function enableMapZoomGestures(container) {
    const map = mapInstances[container];
    if (!map) return;
    map.doubleClickZoom.enable();
    map.touchZoomRotate?._tapDragZoom?.enable?.();
}

export function setLayoutProperty(container, layerId, name, value, options) {
    mapInstances[container].setLayoutProperty(layerId, name, value, options);
}

/**
 * Sets multiple layout properties on a style layer in one call.
 * @param {string} container
 * @param {string} layerId
 * @param {Record<string, *>} properties
 * @param {object} [options]
 */
export function setLayoutProperties(container, layerId, properties, options) {
    if (!properties) {
        return;
    }

    for (const [name, value] of Object.entries(properties)) {
        setLayoutProperty(container, layerId, name, value, options);
    }
}

/**
 * Sets a paint property on a style layer.
 *
 * @param {string} container - The map container id.
 * @param {string} layerId - The layer id.
 * @param {string} name - The paint property name.
 * @param {*} value - The paint property value.
 * @param {object} [options] - Optional style setter options.
 */
export function setPaintProperty(container, layerId, name, value, options) {
    mapInstances[container].setPaintProperty(layerId, name, value, options);
}

/**
 * Sets multiple paint properties on a style layer in one call.
 * @param {string} container
 * @param {string} layerId
 * @param {Record<string, *>} properties
 * @param {object} [options]
 */
export function setPaintProperties(container, layerId, properties, options) {
    if (!properties) {
        return;
    }

    for (const [name, value] of Object.entries(properties)) {
        setPaintProperty(container, layerId, name, value, options);
    }
}

/**
 * Refreshes tiles in a specified source.
 * @param {string} container - The map container.
 * @param {string} sourceId - The source id
 */
export function refreshTiles(container, sourceId) {
    mapInstances[container].refreshTiles(sourceId);
}
/**
 * Refreshes specific tiles in a source when possible.
 * @param {string} container - The map container.
 * @param {string} sourceId - The source id
 * @param {Array<object>} [tileIds] - Tile id objects with { z, x, y }
 */
export function refreshTileIDs(container, sourceId, tileIds) {
    const mapInstance = requireMap(container, 'refreshTileIDs');
    if (typeof mapInstance.refreshTiles === 'function') {
        mapInstance.refreshTiles(sourceId);
    }
}
