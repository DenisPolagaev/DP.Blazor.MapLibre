const scriptBase = '/_content/TerraDrawPlugin/maplibre-gl-terradraw/dist/';
const stylesheetHref = '/_content/TerraDrawPlugin/maplibre-gl-terradraw/dist/maplibre-gl-terradraw.css';

let mapObject;
let dependenciesLoaded = false;
let activeControlId = null;
const controls = new Map();
const editedFeatureIds = new Map();

function loadScript(src) {
    if (document.querySelector(`script[src="${src}"]`)) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

function ensureStylesheet() {
    if (document.querySelector(`link[href="${stylesheetHref}"]`)) {
        return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = stylesheetHref;
    document.head.appendChild(link);
}

function getLibrary() {
    const library = globalThis.MaplibreTerradrawControl;
    if (!library?.MaplibreTerradrawControl) {
        throw new Error('maplibre-gl-terradraw is not loaded. Ensure MapLibre GL JS is available on globalThis.maplibregl.');
    }

    return library;
}

async function loadDependencies() {
    if (dependenciesLoaded) {
        return;
    }

    if (!globalThis.maplibregl?.Map) {
        throw new Error('MapLibre GL JS must be loaded before the Terra Draw plugin.');
    }

    ensureStylesheet();
    await loadScript(`${scriptBase}maplibre-gl-terradraw.umd.js`);
    dependenciesLoaded = true;
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

function resolveControlId(controlId) {
    const id = controlId ?? activeControlId;
    if (!id) {
        throw new Error('No Terra Draw control is active. Add a control first or pass a controlId.');
    }

    return id;
}

function getEntry(controlId) {
    const id = resolveControlId(controlId);
    const entry = controls.get(id);
    if (!entry) {
        throw new Error(`Terra Draw control '${id}' was not found.`);
    }

    return entry;
}

function getControl(controlId) {
    return getEntry(controlId).control;
}

function getTerraDraw(controlId) {
    const terraDraw = getControl(controlId).getTerraDrawInstance?.();
    if (!terraDraw) {
        throw new Error('Terra Draw instance is not available yet. Wait for the control to finish initialising.');
    }

    return terraDraw;
}

function filterInternalFeatures(features) {
    return features.filter(f =>
        !f.properties?.coordinatePoint &&
        !f.properties?.closingPoint &&
        !f.properties?.snappingPoint &&
        !f.properties?.midPoint &&
        !f.properties?.selectionPoint
    );
}

function throttle(func, intervalInMs) {
    let lastFunc;
    let lastRan;

    return function (...args) {
        if (!lastRan) {
            func.apply(this, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(() => {
                if ((Date.now() - lastRan) >= intervalInMs) {
                    func.apply(this, args);
                    lastRan = Date.now();
                }
            }, intervalInMs - (Date.now() - lastRan));
        }
    };
}

function removeEntryListeners(entry) {
    for (const [listenerId, listener] of entry.controlListeners.entries()) {
        try {
            entry.control.off(listener.eventType, listener.handler);
        } catch {
            // best-effort
        }

        entry.controlListeners.delete(listenerId);
    }

    const terraDraw = entry.control.getTerraDrawInstance?.();
    for (const [listenerId, listener] of entry.terraDrawListeners.entries()) {
        try {
            terraDraw?.off(listener.eventType, listener.handler);
        } catch {
            // best-effort
        }

        entry.terraDrawListeners.delete(listenerId);
    }
}

export function getSnapshot(controlId = null) {
    return getSnapshotInternal(controlId);
}

function getSnapshotInternal(controlId) {
    const id = resolveControlId(controlId);
    const snapshot = getTerraDraw(id).getSnapshot();
    const editedFeatureId = editedFeatureIds.get(id);
    if (editedFeatureId != null) {
        return snapshot.filter(f => f.id === editedFeatureId);
    }

    return filterInternalFeatures(snapshot);
}

function normalizeModeOptions(options) {
    if (!options) {
        return options;
    }

    if (options.modeOptions && !Array.isArray(options.modeOptions)) {
        return options;
    }

    return options;
}

export async function initialize(map) {
    await loadDependencies();
    mapObject = map;
}

export async function addControl(controlType, options, position = 'top-left', controlId = null) {
    await loadDependencies();

    if (!mapObject) {
        throw new Error('Terra Draw plugin is not initialized.');
    }

    const id = controlId ?? crypto.randomUUID();
    if (controls.has(id)) {
        await removeControl(id);
    }

    const ControlClass = getControlClass(controlType);
    const control = new ControlClass(normalizeModeOptions(options) ?? {});
    mapObject.addControl(control, position);
    control.activate?.();

    controls.set(id, {
        control,
        controlType,
        position,
        controlListeners: new Map(),
        terraDrawListeners: new Map(),
    });

    activeControlId = id;
    return id;
}

export function setActiveControl(controlId) {
    if (!controls.has(controlId)) {
        throw new Error(`Terra Draw control '${controlId}' was not found.`);
    }

    activeControlId = controlId;
}

export function getActiveControlId() {
    return activeControlId;
}

export function getControlIds() {
    return [...controls.keys()];
}

export function getControlType(controlId) {
    return getEntry(controlId).controlType;
}

export function removeControl(controlId = null) {
    const id = controlId ?? activeControlId;
    if (!id) {
        return;
    }

    const entry = controls.get(id);
    if (!entry) {
        return;
    }

    removeEntryListeners(entry);

    if (mapObject) {
        mapObject.removeControl(entry.control);
    }

    controls.delete(id);
    editedFeatureIds.delete(id);

    if (activeControlId === id) {
        activeControlId = controls.size > 0 ? [...controls.keys()][0] : null;
    }
}

export function removeAllControls() {
    for (const id of [...controls.keys()]) {
        removeControl(id);
    }
}

export function activateControl(controlId = null) {
    getControl(controlId).activate?.();
}

export function deactivateControl(controlId = null) {
    getControl(controlId).deactivate?.();
}

export function setControlExpanded(expanded, controlId = null) {
    getControl(controlId).isExpanded = expanded;
}

export function getControlExpanded(controlId = null) {
    return getControl(controlId).isExpanded === true;
}

export function setShowDeleteConfirmation(value, controlId = null) {
    getControl(controlId).showDeleteConfirmation = value;
}

export function getShowDeleteConfirmation(controlId = null) {
    return getControl(controlId).showDeleteConfirmation === true;
}

export function resetActiveMode(controlId = null) {
    getControl(controlId).resetActiveMode?.();
}

export function setMode(mode, controlId = null) {
    const id = resolveControlId(controlId);
    getTerraDraw(id).setMode(mode);

    if (mode !== 'select') {
        editedFeatureIds.delete(id);
    }
}

export function getMode(controlId = null) {
    return getTerraDraw(controlId).getMode();
}

export function getFeatures(onlySelected = false, controlId = null) {
    const features = getControl(controlId).getFeatures?.(onlySelected);
    return features?.features ?? [];
}

export function addFeatures(featuresJson, controlId = null) {
    const parsed = JSON.parse(featuresJson);
    const features = parsed.type === 'FeatureCollection'
        ? parsed.features
        : [parsed];

    return getTerraDraw(controlId).addFeatures(features);
}

export function removeFeatures(featureIds, controlId = null) {
    getTerraDraw(controlId).removeFeatures(featureIds);
}

export function clearFeatures(controlId = null) {
    getTerraDraw(controlId).clear?.();
}

export function startDrawing(controlId = null) {
    getTerraDraw(controlId).start();
}

export function stopDrawing(controlId = null) {
    const id = resolveControlId(controlId);
    const terraDraw = getTerraDraw(id);
    terraDraw.setMode('static');
    terraDraw.stop();
    editedFeatureIds.delete(id);
}

export function isDrawingEnabled(controlId = null) {
    const terraDraw = getTerraDraw(controlId);
    return terraDraw.enabled === true || terraDraw._enabled === true;
}

export function selectFeature(featureId, controlId = null) {
    getTerraDraw(controlId).selectFeature?.(featureId);
}

export function updateModeOptions(mode, options, controlId = null) {
    getTerraDraw(controlId).updateModeOptions(mode, options ?? {});
}

export function editFeature(featureJson, mode, controlId = null) {
    const id = resolveControlId(controlId);
    const editedFeatureId = editedFeatureIds.get(id);
    if (editedFeatureId != null) {
        try {
            getTerraDraw(id).removeFeatures([editedFeatureId]);
        } catch {
            // best-effort
        }

        editedFeatureIds.delete(id);
    }

    const feature = JSON.parse(featureJson);
    feature.type = 'Feature';
    feature.properties = feature.properties || {};
    feature.properties.mode = mode;

    const result = getTerraDraw(id).addFeatures([feature]);
    const entry = Array.isArray(result) ? result[0] : null;
    if (entry?.valid === false) {
        throw new Error(entry.reason ?? 'Terra Draw rejected the feature.');
    }

    getTerraDraw(id).setMode('select');

    const featureId = entry?.id;
    if (featureId != null) {
        editedFeatureIds.set(id, featureId);
        if (typeof getTerraDraw(id).selectFeature === 'function') {
            try {
                getTerraDraw(id).selectFeature(featureId);
            } catch {
                // best-effort
            }
        }
    }
}

export function finishGeometry() {
    if (!mapObject) {
        return;
    }

    const event = new KeyboardEvent('keyup', { key: 'Enter' });
    mapObject.getCanvas().dispatchEvent(event);
}

export function recalc(controlId = null) {
    const control = getControl(controlId);
    if (typeof control.recalc !== 'function') {
        throw new Error('Recalc is only available on MaplibreMeasureControl.');
    }

    control.recalc();
}

export function cleanControlStyle(styleJson, options, controlId = null) {
    const control = getControl(controlId);
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

function getMeasureControl(controlId = null) {
    const control = getControl(controlId);
    if (typeof control.recalc !== 'function') {
        throw new Error('This operation requires MaplibreMeasureControl.');
    }

    return control;
}

function getValhallaControl(controlId = null) {
    const entry = getEntry(controlId);
    if (entry.controlType !== 'valhalla') {
        throw new Error('This operation requires MaplibreValhallaControl.');
    }

    return entry.control;
}

export function getMeasureUnitType(controlId = null) {
    return getMeasureControl(controlId).measureUnitType;
}

export function setMeasureUnitType(value, controlId = null) {
    getMeasureControl(controlId).measureUnitType = value;
}

export function getDistancePrecision(controlId = null) {
    return getMeasureControl(controlId).distancePrecision;
}

export function setDistancePrecision(value, controlId = null) {
    getMeasureControl(controlId).distancePrecision = value;
}

export function getDistanceUnit(controlId = null) {
    return getMeasureControl(controlId).distanceUnit;
}

export function setDistanceUnit(value, controlId = null) {
    getMeasureControl(controlId).distanceUnit = value;
}

export function getAreaPrecision(controlId = null) {
    return getMeasureControl(controlId).areaPrecision;
}

export function setAreaPrecision(value, controlId = null) {
    getMeasureControl(controlId).areaPrecision = value;
}

export function getAreaUnit(controlId = null) {
    return getMeasureControl(controlId).areaUnit;
}

export function setAreaUnit(value, controlId = null) {
    getMeasureControl(controlId).areaUnit = value;
}

export function getMeasureUnitSymbols(controlId = null) {
    return getMeasureControl(controlId).measureUnitSymbols;
}

export function setMeasureUnitSymbols(value, controlId = null) {
    getMeasureControl(controlId).measureUnitSymbols = value;
}

export function getComputeElevation(controlId = null) {
    return getMeasureControl(controlId).computeElevation === true;
}

export function setComputeElevation(value, controlId = null) {
    getMeasureControl(controlId).computeElevation = value;
}

export function getFontGlyphs(controlId = null) {
    const control = getControl(controlId);
    return control.fontGlyphs ?? [];
}

export function setFontGlyphs(value, controlId = null) {
    getControl(controlId).fontGlyphs = value;
}

export function getValhallaUrl(controlId = null) {
    return getValhallaControl(controlId).valhallaUrl;
}

export function setValhallaUrl(value, controlId = null) {
    getValhallaControl(controlId).valhallaUrl = value;
}

export function getRoutingCostingModel(controlId = null) {
    return getValhallaControl(controlId).routingCostingModel;
}

export function setRoutingCostingModel(value, controlId = null) {
    getValhallaControl(controlId).routingCostingModel = value;
}

export function getRoutingDistanceUnit(controlId = null) {
    return getValhallaControl(controlId).routingDistanceUnit;
}

export function setRoutingDistanceUnit(value, controlId = null) {
    getValhallaControl(controlId).routingDistanceUnit = value;
}

export function getTimeIsochroneCostingModel(controlId = null) {
    return getValhallaControl(controlId).timeIsochroneCostingModel;
}

export function setTimeIsochroneCostingModel(value, controlId = null) {
    getValhallaControl(controlId).timeIsochroneCostingModel = value;
}

export function getDistanceIsochroneCostingModel(controlId = null) {
    return getValhallaControl(controlId).distanceIsochroneCostingModel;
}

export function setDistanceIsochroneCostingModel(value, controlId = null) {
    getValhallaControl(controlId).distanceIsochroneCostingModel = value;
}

export function getIsochroneContours(controlId = null) {
    return getValhallaControl(controlId).isochroneContours;
}

export function setIsochroneContours(value, controlId = null) {
    getValhallaControl(controlId).isochroneContours = value;
}

export function onControlEvent(eventType, dotnetReference, controlId = null) {
    const entry = getEntry(controlId);
    const listenerId = crypto.randomUUID();
    const handler = (args) => dotnetReference.invokeMethodAsync('Invoke', JSON.stringify(args ?? {}));

    entry.control.on(eventType, handler);
    entry.controlListeners.set(listenerId, { eventType, handler });

    return listenerId;
}

export function offListener(listenerId) {
    for (const entry of controls.values()) {
        const controlListener = entry.controlListeners.get(listenerId);
        if (controlListener) {
            entry.control.off(controlListener.eventType, controlListener.handler);
            entry.controlListeners.delete(listenerId);
            return;
        }

        const terraListener = entry.terraDrawListeners.get(listenerId);
        if (terraListener) {
            const terraDraw = entry.control.getTerraDrawInstance?.();
            terraDraw?.off(terraListener.eventType, terraListener.handler);
            entry.terraDrawListeners.delete(listenerId);
            return;
        }
    }
}

export function onTerraDrawEvent(eventType, dotnetReference, controlId = null, throttleTime = null) {
    const entry = getEntry(controlId);
    const terraDraw = getTerraDraw(controlId);
    const listenerId = crypto.randomUUID();

    let handler;
    if (eventType === 'finish') {
        handler = (id, context) => {
            dotnetReference.invokeMethodAsync('Invoke', JSON.stringify({
                id,
                action: context?.action,
                features: getSnapshotInternal(controlId),
            }));
        };
    } else if (eventType === 'change' && throttleTime != null) {
        const throttledInvoke = throttle(() => {
            dotnetReference.invokeMethodAsync('Invoke', JSON.stringify({
                features: getSnapshotInternal(controlId),
            }));
        }, throttleTime);
        handler = (ids, type) => {
            if (type === 'create' || type === 'update' || type === 'delete') {
                throttledInvoke();
            }
        };
    } else if (eventType === 'change') {
        handler = (ids, type) => {
            dotnetReference.invokeMethodAsync('Invoke', JSON.stringify({
                ids,
                type,
                features: getSnapshotInternal(controlId),
            }));
        };
    } else {
        handler = (...args) => {
            dotnetReference.invokeMethodAsync('Invoke', JSON.stringify({
                args,
                features: getSnapshotInternal(controlId),
            }));
        };
    }

    terraDraw.on(eventType, handler);
    entry.terraDrawListeners.set(listenerId, { eventType, handler });
    return listenerId;
}

export function onTerraDrawFinish(dotnetReference, controlId = null) {
    return onTerraDrawEvent('finish', dotnetReference, controlId);
}

export function onTerraDrawDelete(dotnetReference, controlId = null) {
    const entry = getEntry(controlId);
    const listenerId = crypto.randomUUID();
    const handler = (ids, type) => {
        if (type === 'delete') {
            dotnetReference.invokeMethodAsync('Invoke', JSON.stringify(getSnapshotInternal(controlId)));
        }
    };

    getTerraDraw(controlId).on('change', handler);
    entry.terraDrawListeners.set(listenerId, { eventType: 'change', handler });
    return listenerId;
}

export function onTerraDrawChange(dotnetReference, throttleTime = 100, controlId = null) {
    const entry = getEntry(controlId);
    const listenerId = crypto.randomUUID();
    const throttledInvoke = throttle(() => {
        dotnetReference.invokeMethodAsync('Invoke', JSON.stringify(getSnapshotInternal(controlId)));
    }, throttleTime);

    const handler = (ids, type) => {
        if (type === 'create' || type === 'update' || type === 'delete') {
            throttledInvoke();
        }
    };

    getTerraDraw(controlId).on('change', handler);
    entry.terraDrawListeners.set(listenerId, { eventType: 'change', handler });
    return listenerId;
}

export function disableMapZoomGestures() {
    if (!mapObject) {
        return;
    }

    mapObject.doubleClickZoom.disable();
    mapObject.touchZoomRotate?._tapDragZoom?.disable?.();
}

export function enableMapZoomGestures() {
    if (!mapObject) {
        return;
    }

    mapObject.doubleClickZoom.enable();
    mapObject.touchZoomRotate?._tapDragZoom?.enable?.();
}

export function dispose() {
    removeAllControls();
    mapObject = null;
    activeControlId = null;
}
