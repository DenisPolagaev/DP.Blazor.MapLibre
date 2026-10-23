// Terra Draw controls for DP.Blazor.MapLibre, built on @watergis/maplibre-gl-terradraw.
// The bundled library version is pinned in wwwroot/maplibre-gl-terradraw/VERSION (1.13.2). Upstream members that
// are not part of the documented library API are accessed only in the helpers of the "Upstream member access"
// section.
//
// State model: every exported function takes the map instance as its first argument. Controls, the active
// control id and the zoom-gesture bookkeeping live in getMapState, so several maps do not share state.

import { deleteMapState, getMapState, loadScript, loadStylesheet } from '../DP.Blazor.MapLibre/PluginRuntime.js';

const STATE_KEY = 'maplibre-terradraw';
const DIST_URL = new URL('./maplibre-gl-terradraw/dist/', import.meta.url);
const SCRIPT_URL = new URL('maplibre-gl-terradraw.umd.js', DIST_URL).href;
const STYLESHEET_URL = new URL('maplibre-gl-terradraw.css', DIST_URL).href;

// Listener id -> listener record. This is an index only: the records are owned by the per-map control entries.
// It exists because offListener receives just the listener id from the .NET side.
const listenerRecords = new Map();

let idCounter = 0;

// crypto.randomUUID is only available in secure contexts (HTTPS / localhost), so plain HTTP hosts need a fallback.
function createId(prefix) {
    if (globalThis.crypto?.randomUUID) {
        return crypto.randomUUID();
    }

    idCounter += 1;
    return `${prefix}-${Date.now().toString(36)}-${idCounter}-${Math.random().toString(36).slice(2, 10)}`;
}

function isLibraryLoaded() {
    return Boolean(globalThis.MaplibreTerradrawControl?.MaplibreTerradrawControl);
}

async function loadDependencies() {
    if (!globalThis.maplibregl?.Map) {
        throw new Error('MapLibre GL JS is not loaded. Register the plugin through MapLibre.RegisterPlugin.');
    }

    await Promise.all([
        loadStylesheet('maplibre-gl-terradraw', STYLESHEET_URL),
        loadScript('maplibre-gl-terradraw', SCRIPT_URL, isLibraryLoaded),
    ]);
}

function getLibrary() {
    const library = globalThis.MaplibreTerradrawControl;
    if (!library?.MaplibreTerradrawControl) {
        throw new Error('maplibre-gl-terradraw is not loaded. Ensure MapLibre GL JS is available on globalThis.maplibregl.');
    }

    return library;
}

function getControlClass(controlType) {
    const library = getLibrary();
    switch (controlType) {
        case 'measure':
            return library.MaplibreMeasureControl;
        case 'valhalla':
            return library.MaplibreValhallaControl;
        case 'draw':
        default:
            return library.MaplibreTerradrawControl;
    }
}

// ---------------------------------------------------------------------------------------------------------------
// Per-map state
// ---------------------------------------------------------------------------------------------------------------

function requireMap(map) {
    if (!map) {
        throw new Error('Terra Draw plugin is not initialized for a map.');
    }

    return map;
}

function getMapStateFor(map) {
    return getMapState(requireMap(map), STATE_KEY, () => ({
        controls: new Map(),
        activeControlId: null,
        // Gestures disabled by disableMapZoomGestures, with the values they had before. null when nothing is saved.
        zoomGestures: null,
    }));
}

function createEntry(id, control, controlType, position) {
    return {
        id,
        control,
        controlType,
        position,
        // Feature that is being edited through editFeature; the snapshot is limited to it while set.
        editedFeatureId: null,
        // Listener id -> listener record for listeners registered on this control.
        listeners: new Map(),
    };
}

function resolveControlId(state, controlId) {
    const id = controlId ?? state.activeControlId;
    if (!id) {
        throw new Error('No Terra Draw control is active. Add a control first or pass a controlId.');
    }

    return id;
}

function getEntry(map, controlId = null) {
    const state = getMapStateFor(map);
    const id = resolveControlId(state, controlId);
    const entry = state.controls.get(id);
    if (!entry) {
        throw new Error(`Terra Draw control '${id}' was not found.`);
    }

    return entry;
}

function getControl(map, controlId = null) {
    return getEntry(map, controlId).control;
}

function getTerraDrawOf(entry) {
    const terraDraw = entry.control.getTerraDrawInstance?.();
    if (!terraDraw) {
        throw new Error('Terra Draw instance is not available yet. Wait for the control to finish initialising.');
    }

    return terraDraw;
}

function getTerraDraw(map, controlId = null) {
    return getTerraDrawOf(getEntry(map, controlId));
}

function getMeasureControl(map, controlId = null) {
    const control = getControl(map, controlId);
    if (typeof control.recalc !== 'function') {
        throw new Error('This operation requires MaplibreMeasureControl.');
    }

    return control;
}

function getValhallaControl(map, controlId = null) {
    const entry = getEntry(map, controlId);
    if (entry.controlType !== 'valhalla') {
        throw new Error('This operation requires MaplibreValhallaControl.');
    }

    return entry.control;
}

// ---------------------------------------------------------------------------------------------------------------
// Upstream member access (maplibre-gl-terradraw 1.13.2, see VERSION). Keep every direct access to members that
// the library does not document here, so that a library upgrade only needs changes in this section.
// ---------------------------------------------------------------------------------------------------------------

// Control toolbar expanded flag (accessor on the control).
function getExpandedFlag(control) {
    return control.isExpanded === true;
}

function setExpandedFlag(control, value) {
    control.isExpanded = value;
}

// Delete confirmation flag (accessor on the control, stored in its options).
function getDeleteConfirmationFlag(control) {
    return control.showDeleteConfirmation === true;
}

function setDeleteConfirmationFlag(control, value) {
    control.showDeleteConfirmation = value;
}

// Terra Draw exposes `enabled` as a public getter. `_enabled` is the private field of the same state and is kept
// as a fallback for the pinned version.
function isTerraDrawEnabled(terraDraw) {
    return terraDraw.enabled === true || terraDraw._enabled === true;
}

// Measure unit type accessor. Its setter also triggers a recalculation, so writes must go through it.
function readMeasureUnitType(control) {
    return control.measureUnitType;
}

function writeMeasureUnitType(control, value) {
    control.measureUnitType = value;
}

// MapLibre GL JS keeps tap-drag zoom only in the private field TouchZoomRotateHandler._tapDragZoom; there is no
// public toggle for it. It is used only by the zoom-gesture helpers below. Remove when MapLibre exposes it.
function getTapDragZoomHandler(map) {
    return map.touchZoomRotate?._tapDragZoom;
}

// ---------------------------------------------------------------------------------------------------------------
// Feature helpers
// ---------------------------------------------------------------------------------------------------------------

function filterInternalFeatures(features) {
    return features.filter(f =>
        !f.properties?.coordinatePoint &&
        !f.properties?.closingPoint &&
        !f.properties?.snappingPoint &&
        !f.properties?.midPoint &&
        !f.properties?.selectionPoint
    );
}

function getEntrySnapshot(entry) {
    const snapshot = getTerraDrawOf(entry).getSnapshot();
    if (entry.editedFeatureId != null) {
        return snapshot.filter(f => f.id === entry.editedFeatureId);
    }

    return filterInternalFeatures(snapshot);
}

// Wire shape of every terra-draw 'change' derived event: { ids, type, features }.
function createChangePayload(entry, ids, type) {
    return { ids, type, features: getEntrySnapshot(entry) };
}

function isContentChangeType(type) {
    return type === 'create' || type === 'update' || type === 'delete';
}

// ---------------------------------------------------------------------------------------------------------------
// Listener plumbing
// ---------------------------------------------------------------------------------------------------------------

// Leading-edge throttle with trailing call. The latest arguments are delivered; cancel() drops a pending call.
function throttle(func, intervalInMs) {
    let timer = null;
    let lastRan = null;
    let pendingArgs = [];

    const run = () => {
        timer = null;
        lastRan = Date.now();
        const args = pendingArgs;
        pendingArgs = [];
        func(...args);
    };

    return {
        call(...args) {
            pendingArgs = args;
            if (lastRan === null) {
                run();
                return;
            }

            clearTimeout(timer);
            timer = setTimeout(run, Math.max(0, intervalInMs - (Date.now() - lastRan)));
        },
        cancel() {
            clearTimeout(timer);
            timer = null;
            pendingArgs = [];
        },
    };
}

// Registers a listener on an entry. subscribe(isActive) attaches the handler and returns
// { unsubscribe, cancelPending }. Handlers must check isActive() before calling .NET, so that a call that is
// already queued (e.g. a throttled one) does not run after the listener was removed.
function registerListener(entry, subscribe) {
    const listenerId = createId('listener');
    const record = {
        active: true,
        unsubscribe: () => {},
        cancelPending: () => {},
        dispose: () => {},
    };

    record.dispose = () => {
        if (!record.active) {
            return;
        }

        record.active = false;
        record.cancelPending();
        try {
            record.unsubscribe();
        } catch (error) {
            console.warn(`[TerraDraw] Failed to remove listener ${listenerId}.`, error);
        }

        entry.listeners.delete(listenerId);
        listenerRecords.delete(listenerId);
    };

    entry.listeners.set(listenerId, record);
    listenerRecords.set(listenerId, record);

    try {
        const subscription = subscribe(() => record.active);
        record.unsubscribe = subscription.unsubscribe;
        record.cancelPending = subscription.cancelPending ?? (() => {});
    } catch (error) {
        record.dispose();
        throw error;
    }

    return listenerId;
}

function removeEntryListeners(entry) {
    for (const record of [...entry.listeners.values()]) {
        record.dispose();
    }
}

// Sends one event to .NET. Payload errors and delivery failures are logged with context, never dropped.
function notifyDotNet(dotnetReference, description, buildPayload) {
    let payload;
    try {
        payload = JSON.stringify(buildPayload());
    } catch (error) {
        console.error(`[TerraDraw] Failed to build the ${description} payload.`, error);
        return;
    }

    dotnetReference.invokeMethodAsync('Invoke', payload).catch(error => {
        console.error(`[TerraDraw] Failed to deliver the ${description} event to .NET.`, error);
    });
}

// ---------------------------------------------------------------------------------------------------------------
// Module lifecycle
// ---------------------------------------------------------------------------------------------------------------

export async function initialize(map) {
    await loadDependencies();
    getMapStateFor(map);
}

export function dispose(map) {
    if (!map) {
        return;
    }

    removeAllControls(map);
    deleteMapState(map, STATE_KEY);
}

// ---------------------------------------------------------------------------------------------------------------
// Snapshot and controls
// ---------------------------------------------------------------------------------------------------------------

export function getSnapshot(map, controlId = null) {
    return getEntrySnapshot(getEntry(map, controlId));
}

export async function addControl(map, controlType, options, position = 'top-left', controlId = null) {
    await loadDependencies();

    const state = getMapStateFor(map);
    const id = controlId ?? createId('terradraw');
    if (state.controls.has(id)) {
        removeControl(map, id);
    }

    const ControlClass = getControlClass(controlType);
    const control = new ControlClass(options ?? {});
    map.addControl(control, position);
    control.activate?.();

    state.controls.set(id, createEntry(id, control, controlType, position));
    state.activeControlId = id;
    return id;
}

export function setActiveControl(map, controlId) {
    const state = getMapStateFor(map);
    if (!state.controls.has(controlId)) {
        throw new Error(`Terra Draw control '${controlId}' was not found.`);
    }

    state.activeControlId = controlId;
}

export function getActiveControlId(map) {
    return getMapStateFor(map).activeControlId;
}

export function getControlIds(map) {
    return [...getMapStateFor(map).controls.keys()];
}

export function getControlType(map, controlId = null) {
    return getEntry(map, controlId).controlType;
}

export function removeControl(map, controlId = null) {
    const state = getMapStateFor(map);
    const id = controlId ?? state.activeControlId;
    if (!id) {
        return;
    }

    const entry = state.controls.get(id);
    if (!entry) {
        return;
    }

    // Listeners first, then the control itself, then the bookkeeping.
    removeEntryListeners(entry);
    map.removeControl(entry.control);
    state.controls.delete(id);
    restoreZoomGestures(map, state);

    if (state.activeControlId === id) {
        state.activeControlId = state.controls.size > 0 ? [...state.controls.keys()][0] : null;
    }
}

export function removeAllControls(map) {
    const state = getMapStateFor(map);
    for (const id of [...state.controls.keys()]) {
        removeControl(map, id);
    }

    restoreZoomGestures(map, state);
}

export function activateControl(map, controlId = null) {
    getControl(map, controlId).activate?.();
}

export function deactivateControl(map, controlId = null) {
    getControl(map, controlId).deactivate?.();
}

export function setControlExpanded(map, expanded, controlId = null) {
    setExpandedFlag(getControl(map, controlId), expanded);
}

export function getControlExpanded(map, controlId = null) {
    return getExpandedFlag(getControl(map, controlId));
}

export function setShowDeleteConfirmation(map, value, controlId = null) {
    setDeleteConfirmationFlag(getControl(map, controlId), value);
}

export function getShowDeleteConfirmation(map, controlId = null) {
    return getDeleteConfirmationFlag(getControl(map, controlId));
}

export function resetActiveMode(map, controlId = null) {
    getControl(map, controlId).resetActiveMode?.();
}

// ---------------------------------------------------------------------------------------------------------------
// Terra Draw instance
// ---------------------------------------------------------------------------------------------------------------

export function setMode(map, mode, controlId = null) {
    const entry = getEntry(map, controlId);
    getTerraDrawOf(entry).setMode(mode);

    if (mode !== 'select') {
        entry.editedFeatureId = null;
    }
}

export function getMode(map, controlId = null) {
    return getTerraDraw(map, controlId).getMode();
}

export function getFeatures(map, onlySelected = false, controlId = null) {
    const features = getControl(map, controlId).getFeatures?.(onlySelected);
    return features?.features ?? [];
}

export function addFeatures(map, featuresJson, controlId = null) {
    const parsed = JSON.parse(featuresJson);
    const features = parsed.type === 'FeatureCollection'
        ? parsed.features
        : [parsed];

    return getTerraDraw(map, controlId).addFeatures(features);
}

export function removeFeatures(map, featureIds, controlId = null) {
    getTerraDraw(map, controlId).removeFeatures(featureIds);
}

export function clearFeatures(map, controlId = null) {
    getTerraDraw(map, controlId).clear?.();
}

export function startDrawing(map, controlId = null) {
    getTerraDraw(map, controlId).start();
}

export function stopDrawing(map, controlId = null) {
    const entry = getEntry(map, controlId);
    const terraDraw = getTerraDrawOf(entry);
    terraDraw.setMode('static');
    terraDraw.stop();
    entry.editedFeatureId = null;
}

export function isDrawingEnabled(map, controlId = null) {
    return isTerraDrawEnabled(getTerraDraw(map, controlId));
}

export function selectFeature(map, featureId, controlId = null) {
    getTerraDraw(map, controlId).selectFeature?.(featureId);
}

export function updateModeOptions(map, mode, options, controlId = null) {
    getTerraDraw(map, controlId).updateModeOptions(mode, options ?? {});
}

export function editFeature(map, featureJson, mode, controlId = null) {
    const entry = getEntry(map, controlId);
    const terraDraw = getTerraDrawOf(entry);

    if (entry.editedFeatureId != null) {
        try {
            terraDraw.removeFeatures([entry.editedFeatureId]);
        } catch (error) {
            console.warn('[TerraDraw] Failed to remove the previously edited feature.', error);
        }

        entry.editedFeatureId = null;
    }

    const feature = JSON.parse(featureJson);
    feature.type = 'Feature';
    feature.properties = feature.properties || {};
    feature.properties.mode = mode;

    const result = terraDraw.addFeatures([feature]);
    const added = Array.isArray(result) ? result[0] : null;
    if (added?.valid === false) {
        throw new Error(added.reason ?? 'Terra Draw rejected the feature.');
    }

    terraDraw.setMode('select');

    const featureId = added?.id;
    if (featureId != null) {
        entry.editedFeatureId = featureId;
        if (typeof terraDraw.selectFeature === 'function') {
            try {
                terraDraw.selectFeature(featureId);
            } catch (error) {
                console.warn('[TerraDraw] Failed to select the edited feature.', error);
            }
        }
    }
}

// Limitation: Terra Draw listens for Enter on the map canvas, which is shared by all controls of the map.
// The keyup is dispatched on that canvas, so it reaches whichever control is drawing. controlId is not accepted
// by the .NET API; the active control is validated (an error is thrown when there is none) but not targeted.
export function finishGeometry(map) {
    getEntry(map, null);
    const event = new KeyboardEvent('keyup', { key: 'Enter' });
    map.getCanvas().dispatchEvent(event);
}

// ---------------------------------------------------------------------------------------------------------------
// Library helpers (no map state needed; they only use the loaded library)
// ---------------------------------------------------------------------------------------------------------------

export function cleanControlStyle(map, styleJson, options, controlId = null) {
    const control = getControl(map, controlId);
    const style = JSON.parse(styleJson);
    const cleaned = control.cleanStyle(style, options ?? {});
    return JSON.stringify(cleaned);
}

export function cleanLibraryStyle(styleJson, options, sourceIds, prefixId) {
    const library = getLibrary();
    const style = JSON.parse(styleJson);
    const cleaned = library.cleanMaplibreStyle(style, options ?? {}, sourceIds, prefixId);
    return JSON.stringify(cleaned);
}

export function getDefaultControlOptions() {
    return getLibrary().defaultControlOptions;
}

export function getDefaultMeasureControlOptions() {
    return getLibrary().defaultMeasureControlOptions;
}

export function getDefaultValhallaControlOptions() {
    return getLibrary().defaultValhallaControlOptions;
}

export function getDefaultMeasureUnitSymbols() {
    return getLibrary().defaultMeasureUnitSymbols;
}

export function getDefaultModeOptions() {
    return getLibrary().getDefaultModeOptions();
}

export function getTerradrawSourceIds() {
    return getLibrary().TERRADRAW_SOURCE_IDS;
}

export function getMeasureSourceIds() {
    return getLibrary().TERRADRAW_MEASURE_SOURCE_IDS;
}

export function getValhallaSourceIds() {
    return getLibrary().TERRADRAW_VALHALLA_SOURCE_IDS;
}

export function getAwsElevationTiles() {
    return getLibrary().AWS_ELEVATION_TILES;
}

export function getMapterhornTiles() {
    return getLibrary().MAPTERHORN_TILES;
}

export function calcArea(featureJson, measureUnitType, areaPrecision, areaUnit, measureUnitSymbols) {
    const feature = JSON.parse(featureJson);
    const result = getLibrary().calcArea(feature, measureUnitType, areaPrecision, areaUnit, measureUnitSymbols);
    return JSON.stringify(result);
}

export function calcDistance(featureJson, measureUnitType, distancePrecision, distanceUnit, measureUnitSymbols) {
    const feature = JSON.parse(featureJson);
    const result = getLibrary().calcDistance(feature, measureUnitType, distancePrecision, distanceUnit, measureUnitSymbols);
    return JSON.stringify(result);
}

export function convertArea(valueInSquareMeters, unit) {
    return getLibrary().convertArea(valueInSquareMeters, unit);
}

export function convertDistance(valueInMeters, unit) {
    return getLibrary().convertDistance(valueInMeters, unit);
}

export function convertElevation(valueInMeters, unit) {
    return getLibrary().convertElevation(valueInMeters, unit);
}

// ---------------------------------------------------------------------------------------------------------------
// Measure control properties
// ---------------------------------------------------------------------------------------------------------------

export function recalc(map, controlId = null) {
    getMeasureControl(map, controlId).recalc();
}

export function getMeasureUnitType(map, controlId = null) {
    return readMeasureUnitType(getMeasureControl(map, controlId));
}

export function setMeasureUnitType(map, value, controlId = null) {
    writeMeasureUnitType(getMeasureControl(map, controlId), value);
}

export function getDistancePrecision(map, controlId = null) {
    return getMeasureControl(map, controlId).distancePrecision;
}

export function setDistancePrecision(map, value, controlId = null) {
    getMeasureControl(map, controlId).distancePrecision = value;
}

export function getDistanceUnit(map, controlId = null) {
    return getMeasureControl(map, controlId).distanceUnit;
}

export function setDistanceUnit(map, value, controlId = null) {
    getMeasureControl(map, controlId).distanceUnit = value;
}

export function getAreaPrecision(map, controlId = null) {
    return getMeasureControl(map, controlId).areaPrecision;
}

export function setAreaPrecision(map, value, controlId = null) {
    getMeasureControl(map, controlId).areaPrecision = value;
}

export function getAreaUnit(map, controlId = null) {
    return getMeasureControl(map, controlId).areaUnit;
}

export function setAreaUnit(map, value, controlId = null) {
    getMeasureControl(map, controlId).areaUnit = value;
}

export function getMeasureUnitSymbols(map, controlId = null) {
    return getMeasureControl(map, controlId).measureUnitSymbols;
}

export function setMeasureUnitSymbols(map, value, controlId = null) {
    getMeasureControl(map, controlId).measureUnitSymbols = value;
}

export function getComputeElevation(map, controlId = null) {
    return getMeasureControl(map, controlId).computeElevation === true;
}

export function setComputeElevation(map, value, controlId = null) {
    getMeasureControl(map, controlId).computeElevation = value;
}

export function getFontGlyphs(map, controlId = null) {
    return getControl(map, controlId).fontGlyphs ?? [];
}

export function setFontGlyphs(map, value, controlId = null) {
    getControl(map, controlId).fontGlyphs = value;
}

// ---------------------------------------------------------------------------------------------------------------
// Valhalla control properties
// ---------------------------------------------------------------------------------------------------------------

export function getValhallaUrl(map, controlId = null) {
    return getValhallaControl(map, controlId).valhallaUrl;
}

export function setValhallaUrl(map, value, controlId = null) {
    getValhallaControl(map, controlId).valhallaUrl = value;
}

export function getRoutingCostingModel(map, controlId = null) {
    return getValhallaControl(map, controlId).routingCostingModel;
}

export function setRoutingCostingModel(map, value, controlId = null) {
    getValhallaControl(map, controlId).routingCostingModel = value;
}

export function getRoutingDistanceUnit(map, controlId = null) {
    return getValhallaControl(map, controlId).routingDistanceUnit;
}

export function setRoutingDistanceUnit(map, value, controlId = null) {
    getValhallaControl(map, controlId).routingDistanceUnit = value;
}

export function getTimeIsochroneCostingModel(map, controlId = null) {
    return getValhallaControl(map, controlId).timeIsochroneCostingModel;
}

export function setTimeIsochroneCostingModel(map, value, controlId = null) {
    getValhallaControl(map, controlId).timeIsochroneCostingModel = value;
}

export function getDistanceIsochroneCostingModel(map, controlId = null) {
    return getValhallaControl(map, controlId).distanceIsochroneCostingModel;
}

export function setDistanceIsochroneCostingModel(map, value, controlId = null) {
    getValhallaControl(map, controlId).distanceIsochroneCostingModel = value;
}

export function getIsochroneContours(map, controlId = null) {
    return getValhallaControl(map, controlId).isochroneContours;
}

export function setIsochroneContours(map, value, controlId = null) {
    getValhallaControl(map, controlId).isochroneContours = value;
}

// ---------------------------------------------------------------------------------------------------------------
// Listeners
// ---------------------------------------------------------------------------------------------------------------

// Control (toolbar) events. Payload: the event args, or {} when the library dispatches none.
export function onControlEvent(map, eventType, dotnetReference, controlId = null) {
    const entry = getEntry(map, controlId);

    return registerListener(entry, isActive => {
        const handler = args => {
            if (!isActive()) {
                return;
            }

            notifyDotNet(dotnetReference, `control '${eventType}'`, () => args ?? {});
        };

        entry.control.on(eventType, handler);
        return { unsubscribe: () => entry.control.off(eventType, handler) };
    });
}

// Terra Draw instance events. Payload shapes:
//   finish                -> { id, action, features }
//   change                -> { ids, type, features }   (throttled calls only deliver create/update/delete)
//   any other event type  -> { args, features }
export function onTerraDrawEvent(map, eventType, dotnetReference, controlId = null, throttleTime = null) {
    const entry = getEntry(map, controlId);

    return registerListener(entry, isActive => {
        const terraDraw = getTerraDrawOf(entry);
        let handler;
        let cancelPending = null;

        if (eventType === 'finish') {
            handler = (id, context) => {
                if (!isActive()) {
                    return;
                }

                notifyDotNet(dotnetReference, 'finish', () => ({
                    id,
                    action: context?.action,
                    features: getEntrySnapshot(entry),
                }));
            };
        } else if (eventType === 'change' && throttleTime != null) {
            const throttled = throttle((ids, type) => {
                if (!isActive()) {
                    return;
                }

                notifyDotNet(dotnetReference, 'change', () => createChangePayload(entry, ids, type));
            }, throttleTime);

            handler = (ids, type) => {
                if (isContentChangeType(type)) {
                    throttled.call(ids, type);
                }
            };
            cancelPending = () => throttled.cancel();
        } else if (eventType === 'change') {
            handler = (ids, type) => {
                if (!isActive()) {
                    return;
                }

                notifyDotNet(dotnetReference, 'change', () => createChangePayload(entry, ids, type));
            };
        } else {
            handler = (...args) => {
                if (!isActive()) {
                    return;
                }

                notifyDotNet(dotnetReference, eventType, () => ({
                    args,
                    features: getEntrySnapshot(entry),
                }));
            };
        }

        terraDraw.on(eventType, handler);
        return {
            unsubscribe: () => terraDraw.off(eventType, handler),
            cancelPending: cancelPending ?? (() => {}),
        };
    });
}

export function onTerraDrawFinish(map, dotnetReference, controlId = null) {
    return onTerraDrawEvent(map, 'finish', dotnetReference, controlId);
}

// Deleted features: the 'change' event with type 'delete'. Payload: { ids, type, features }.
export function onTerraDrawDelete(map, dotnetReference, controlId = null) {
    const entry = getEntry(map, controlId);

    return registerListener(entry, isActive => {
        const terraDraw = getTerraDrawOf(entry);
        const handler = (ids, type) => {
            if (!isActive() || type !== 'delete') {
                return;
            }

            notifyDotNet(dotnetReference, 'delete', () => createChangePayload(entry, ids, type));
        };

        terraDraw.on('change', handler);
        return { unsubscribe: () => terraDraw.off('change', handler) };
    });
}

// Throttled content changes. Payload: { ids, type, features }.
export function onTerraDrawChange(map, dotnetReference, controlId = null, throttleTime = 100) {
    const entry = getEntry(map, controlId);

    return registerListener(entry, isActive => {
        const terraDraw = getTerraDrawOf(entry);
        const throttled = throttle((ids, type) => {
            if (!isActive()) {
                return;
            }

            notifyDotNet(dotnetReference, 'change', () => createChangePayload(entry, ids, type));
        }, throttleTime);

        const handler = (ids, type) => {
            if (isContentChangeType(type)) {
                throttled.call(ids, type);
            }
        };

        terraDraw.on('change', handler);
        return {
            unsubscribe: () => terraDraw.off('change', handler),
            cancelPending: () => throttled.cancel(),
        };
    });
}

export function offListener(listenerId) {
    listenerRecords.get(listenerId)?.dispose();
}

// ---------------------------------------------------------------------------------------------------------------
// Map zoom gestures
// ---------------------------------------------------------------------------------------------------------------

// Disables double-click zoom and tap-drag zoom and remembers which of them were enabled before. Gestures are
// restored by enableMapZoomGestures, when a control is removed, or when the plugin is detached or disposed.
export function disableMapZoomGestures(map) {
    const state = getMapStateFor(map);
    if (state.zoomGestures) {
        return;
    }

    const tapDragZoom = getTapDragZoomHandler(map);
    state.zoomGestures = {
        doubleClickZoom: map.doubleClickZoom.isEnabled() === true,
        tapDragZoom: tapDragZoom?.isEnabled?.() === true,
    };

    map.doubleClickZoom.disable();
    tapDragZoom?.disable?.();
}

export function enableMapZoomGestures(map) {
    const state = getMapStateFor(map);
    if (state.zoomGestures) {
        restoreZoomGestures(map, state);
        return;
    }

    map.doubleClickZoom.enable();
    getTapDragZoomHandler(map)?.enable?.();
}

function restoreZoomGestures(map, state) {
    const saved = state.zoomGestures;
    if (!saved) {
        return;
    }

    state.zoomGestures = null;
    if (saved.doubleClickZoom) {
        map.doubleClickZoom.enable();
    }

    if (saved.tapDragZoom) {
        getTapDragZoomHandler(map)?.enable?.();
    }
}
