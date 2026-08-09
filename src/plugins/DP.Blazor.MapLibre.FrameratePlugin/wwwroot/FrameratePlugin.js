import { registerFramerateControl } from './maplibregl-framerate-control.js';

const mapLibreModulePath = '_content/DP.Blazor.MapLibre/MapLibre.razor.js';

let mapObject = null;
let framerateControl = null;
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
    const href = new URL('FrameratePlugin.css', import.meta.url).href;
    if (document.querySelector(`link[href="${href}"]`)) {
        return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}

async function loadDependencies() {
    if (dependenciesLoaded) {
        return;
    }

    await ensureMapLibreGlobal();
    ensureStylesheet();
    registerFramerateControl(globalThis.maplibregl);
    dependenciesLoaded = true;
}

export async function initialize(map) {
    mapObject = map;
    await loadDependencies();
}

export async function addControl(options, position = 'top-right') {
    await loadDependencies();

    if (!mapObject) {
        throw new Error('Framerate plugin is not initialized.');
    }

    removeControl();

    const FrameRateControl = globalThis.maplibregl.FrameRateControl;
    framerateControl = new FrameRateControl(options ?? {});
    mapObject.addControl(framerateControl, position);
}

export function removeControl() {
    if (mapObject && framerateControl) {
        mapObject.removeControl(framerateControl);
        framerateControl = null;
    }
}

export function dispose() {
    removeControl();
    mapObject = null;
}
