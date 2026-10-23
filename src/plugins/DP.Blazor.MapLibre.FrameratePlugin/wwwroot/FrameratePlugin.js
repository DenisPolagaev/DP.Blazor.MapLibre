import { getMapState, peekMapState, loadStylesheet } from '../DP.Blazor.MapLibre/PluginRuntime.js';
import { FrameRateControl } from './maplibregl-framerate-control.js';

// Stable ids and URLs; the stylesheet is shared by all maps and deduplicated by loadStylesheet.
const STYLESHEET_ID = 'framerate-plugin';
const STYLESHEET_HREF = new URL('FrameratePlugin.css', import.meta.url).href;

// Per-map state: several maps (and several plugin instances) must not share the control.
const STATE_KEY = 'framerate-plugin';

function stateFor(map) {
    return getMapState(map, STATE_KEY, () => ({ control: null }));
}

export async function initialize(map) {
    await loadStylesheet(STYLESHEET_ID, STYLESHEET_HREF);
    stateFor(map);
}

export async function addControl(map, options, position = 'top-right') {
    await loadStylesheet(STYLESHEET_ID, STYLESHEET_HREF);

    removeControl(map);

    const state = stateFor(map);
    const control = new FrameRateControl(options ?? {});
    state.control = control;
    map.addControl(control, position);
}

export function removeControl(map) {
    const state = peekMapState(map, STATE_KEY);
    const control = state?.control;
    if (!control) {
        return;
    }

    state.control = null;
    map.removeControl(control);
}
