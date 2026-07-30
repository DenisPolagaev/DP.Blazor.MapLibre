import { GeoGrid, detachGeoGrid } from './geogrid/index.js';

function resolveGridDensity(options) {
    if (options.gridDensityDegrees != null) {
        const density = options.gridDensityDegrees;
        delete options.gridDensityDegrees;
        options.gridDensity = () => density;
        return;
    }

    if (Array.isArray(options.gridDensityByZoom) && options.gridDensityByZoom.length > 0) {
        const steps = [...options.gridDensityByZoom].sort((left, right) => left.zoom - right.zoom);
        delete options.gridDensityByZoom;
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
