import { getMapState, peekMapState, loadStylesheet } from '../DP.Blazor.MapLibre/PluginRuntime.js';
import { createMinimapControl } from './maplibregl-control-minimap.js';

// Stable ids and URLs; the stylesheet is shared by all maps and deduplicated by loadStylesheet.
const STYLESHEET_ID = 'minimap-plugin';
const STYLESHEET_HREF = new URL('MinimapPlugin.css', import.meta.url).href;

// Per-map state: the registration promise and the control belong to one map only.
const STATE_KEY = 'minimap-plugin';

function stateFor(map) {
    return getMapState(map, STATE_KEY, () => ({
        registration: null,
        Minimap: null,
        control: null,
    }));
}

function requireMapLibre() {
    const maplibregl = globalThis.maplibregl;
    if (!maplibregl?.Map) {
        throw new Error('MapLibre GL JS failed to load');
    }

    return maplibregl;
}

/**
 * Loads the stylesheet and creates the control class for this map. The promise is memoized per map, so
 * concurrent callers share one registration. A failed registration is cleared and can be retried.
 */
function ensureRegistered(map) {
    const state = stateFor(map);
    if (!state.registration) {
        state.registration = loadStylesheet(STYLESHEET_ID, STYLESHEET_HREF)
            .then(() => {
                if (!state.Minimap) {
                    state.Minimap = createMinimapControl(requireMapLibre());
                }

                return state;
            })
            .catch((error) => {
                state.registration = null;
                throw error;
            });
    }

    return state.registration;
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

export async function initialize(map) {
    await ensureRegistered(map);
}

export async function addControl(map, options, position = 'bottom-left') {
    const state = await ensureRegistered(map);

    removeControl(map);

    const control = new state.Minimap(normalizeOptions(options) ?? {});
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
