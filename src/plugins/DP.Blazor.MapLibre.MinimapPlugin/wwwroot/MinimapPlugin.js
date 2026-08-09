import { registerMinimapControl } from './maplibregl-control-minimap.js';

const mapLibreModulePath = '_content/DP.Blazor.MapLibre/MapLibre.razor.js';

let mapObject = null;
let minimapControl = null;
let dependenciesLoaded = false;

function contentUrl(relativePath) {
    return new URL(relativePath, document.baseURI).href;
}

async function ensureMapLibreGlobal() {
    if (globalThis.maplibregl?.Map) {
        return;
    }

    const mapLibre = await import(contentUrl(mapLibreModulePath));
    await mapLibre.prepareMapLibreGl();
    if (!globalThis.maplibregl?.Map) {
        throw new Error('MapLibre GL JS failed to load');
    }
}

function ensureStylesheet() {
    const href = new URL('MinimapPlugin.css', import.meta.url).href;
    if (document.querySelector(`link[href="${href}"]`)) {
        return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}

function normalizeOptions(options) {
    if (!options) {
        return null;
    }

    const normalized = { ...options };

    if (Array.isArray(normalized.zoomLevels)) {
        normalized.zoomLevels = normalized.zoomLevels.map((level) => {
            if (Array.isArray(level)) {
                return level;
            }

            if (level && typeof level === 'object') {
                return [level.parentZoom, level.minimapZoom, level.targetZoom];
            }

            return level;
        });
    }

    if (normalized.center && typeof normalized.center === 'object' && !Array.isArray(normalized.center)) {
        normalized.center = [normalized.center.lng, normalized.center.lat];
    }

    return normalized;
}

async function loadDependencies() {
    if (dependenciesLoaded) {
        return;
    }

    await ensureMapLibreGlobal();
    ensureStylesheet();
    registerMinimapControl(globalThis.maplibregl);
    dependenciesLoaded = true;
}

export async function initialize(map) {
    mapObject = map;
    await loadDependencies();
}

export async function addControl(options, position = 'bottom-left') {
    await loadDependencies();

    if (!mapObject) {
        throw new Error('Minimap plugin is not initialized.');
    }

    removeControl();

    const Minimap = globalThis.maplibregl.Minimap;
    minimapControl = new Minimap(normalizeOptions(options) ?? {});
    mapObject.addControl(minimapControl, position);
}

export function removeControl() {
    if (mapObject && minimapControl) {
        mapObject.removeControl(minimapControl);
        minimapControl = null;
    }
}

export function dispose() {
    removeControl();
    mapObject = null;
}
