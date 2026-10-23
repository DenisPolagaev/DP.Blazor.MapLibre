import { GeoGrid, detachGeoGrid } from './geogrid/index.js';
import { loadStylesheet } from '../DP.Blazor.MapLibre/PluginRuntime.js';

const STYLESHEET_ID = 'geogrid';
// geogrid.css positions the edge labels; it is shared by all maps on the page.
const STYLESHEET_HREF = new URL('geogrid/geogrid.css', import.meta.url).href;

/**
 * Resolves the grid density options into the single `gridDensity(zoom) => degrees` function that
 * geogrid-maplibre-gl expects. Two forms are accepted from C#:
 *  - `gridDensityDegrees`: fixed spacing in degrees, used at every zoom level.
 *  - `gridDensityByZoom`: `[{ zoom, densityDegrees }]` steps. The step with the greatest `zoom`
 *    that is less than or equal to the current zoom (floored, never negative) wins; zoom levels
 *    below the first step use the first step's density.
 * When both are present, `gridDensityDegrees` takes precedence.
 * Both source keys are removed from `options`, so geogrid never sees them.
 * @param {object} options Mutable options object (modified in place).
 */
function resolveGridDensity(options) {
    const fixedDensity = options.gridDensityDegrees;
    const densitySteps = options.gridDensityByZoom;
    delete options.gridDensityDegrees;
    delete options.gridDensityByZoom;

    if (fixedDensity != null) {
        options.gridDensity = () => fixedDensity;
        return;
    }

    if (Array.isArray(densitySteps) && densitySteps.length > 0) {
        const steps = [...densitySteps].sort((left, right) => left.zoom - right.zoom);
        options.gridDensity = (zoomLevel) => {
            const zoom = Math.max(Math.floor(zoomLevel), 0);
            let density = steps[0].densityDegrees;
            for (const step of steps) {
                if (zoom >= step.zoom) {
                    density = step.densityDegrees;
                }
            }

            return density;
        };
    }
}

/**
 * Maps the `labelFormat` preset name from C# to geogrid's `formatLabels` callback.
 * The default preset leaves geogrid's own DMS formatting in place.
 * @param {object} options Mutable options object (modified in place).
 */
function resolveLabelFormat(options) {
    switch (options.labelFormat) {
        case 'DegreesOnly':
            options.formatLabels = (degreesFloat) => `${Math.floor(degreesFloat)}°`;
            break;
        case 'IntegerDegrees':
            options.formatLabels = (degreesFloat) => String(Math.round(degreesFloat));
            break;
        default:
            break;
    }

    delete options.labelFormat;
}

function normalizeOptions(options) {
    if (!options) {
        return {};
    }

    const normalized = { ...options };
    resolveGridDensity(normalized);
    resolveLabelFormat(normalized);
    return normalized;
}

/**
 * Called once after the module is imported. Loads geogrid.css and rejects if it cannot be loaded,
 * so the failure reaches the C# caller instead of showing unstyled labels.
 */
export async function initialize() {
    await loadStylesheet(STYLESHEET_ID, STYLESHEET_HREF);
}

/**
 * Adds (or replaces) the grid on `map`.
 * @param {object} map MapLibre map instance.
 * @param {object} options Grid options as serialized from GeoGridOptions.
 */
export function add(map, options) {
    if (!map) {
        throw new Error('GeoGrid plugin requires a map instance.');
    }

    detachGeoGrid(map);
    const instance = new GeoGrid({
        map,
        ...normalizeOptions(options),
    });
    instance.add();
}

export function remove(map) {
    detachGeoGrid(map);
}

export function dispose(map) {
    detachGeoGrid(map);
}
