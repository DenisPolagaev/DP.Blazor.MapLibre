import { getMapState, loadScript } from '../DP.Blazor.MapLibre/PluginRuntime.js';

const STATE_KEY = 'MapboxGlDrawPlugin';

const mapboxDrawUrl = new URL('mapbox-gl-draw.js', import.meta.url).href;
const turfUrl = new URL('turf.min.js', import.meta.url).href;

function stateFor(map) {
    return getMapState(map, STATE_KEY, () => ({ draw: null, dotnetReference: null }));
}

/**
 * Loads the third-party UMD bundles, then binds the plugin to the map.
 * @param {object} map MapLibre map instance.
 * @param {object} dotnetReference Reference used to call back into .NET.
 */
export async function initialize(map, dotnetReference) {
    const state = stateFor(map);
    state.dotnetReference = dotnetReference;

    await Promise.all([
        loadScript('mapbox-gl-draw', mapboxDrawUrl, () => Boolean(globalThis.MapboxDraw)),
        loadScript('turf', turfUrl, () => Boolean(globalThis.turf)),
    ]);
}

/**
 * Adds a Mapbox Draw control to the map instance.
 * @param {object} map MapLibre map instance.
 * @param {object} drawOptions Options for the Mapbox Draw control.
 */
export function addControl(map, drawOptions) {
    const state = stateFor(map);

    globalThis.MapboxDraw.constants.classes.CANVAS = 'maplibregl-canvas';
    globalThis.MapboxDraw.constants.classes.CONTROL_BASE = 'maplibregl-ctrl';
    globalThis.MapboxDraw.constants.classes.CONTROL_PREFIX = 'maplibregl-ctrl-';
    globalThis.MapboxDraw.constants.classes.CONTROL_GROUP = 'maplibregl-ctrl-group';
    globalThis.MapboxDraw.constants.classes.ATTRIBUTION = 'maplibregl-ctrl-attrib';

    if (state.draw) {
        map.removeControl(state.draw);
    }

    const draw = new globalThis.MapboxDraw(drawOptions ?? {});
    map.addControl(draw);
    state.draw = draw;

    const updateArea = (event) => {
        state.dotnetReference
            ?.invokeMethodAsync('OnDrawUpdateCallback', draw.getAll(), event.type)
            .catch((error) => console.error('OnDrawUpdateCallback failed.', error));
    };

    state.updateArea = updateArea;
    map.on('draw.create', updateArea);
    map.on('draw.delete', updateArea);
    map.on('draw.update', updateArea);
}

/**
 * Removes the draw control and its event listeners.
 * @param {object} map MapLibre map instance.
 */
export function removeControl(map) {
    const state = stateFor(map);
    if (!state.draw) {
        return;
    }

    if (state.updateArea) {
        map.off('draw.create', state.updateArea);
        map.off('draw.delete', state.updateArea);
        map.off('draw.update', state.updateArea);
        state.updateArea = null;
    }

    map.removeControl(state.draw);
    state.draw = null;
}

/**
 * Adds a feature to the draw instance of the map.
 * @param {object} map MapLibre map instance.
 * @param {object} feature Feature to add.
 */
export function addFeature(map, feature) {
    const state = stateFor(map);
    if (!state.draw) {
        throw new Error('Mapbox Draw is not initialized. Add the control first.');
    }

    state.draw.add(feature);
}
