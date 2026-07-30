const MIN_LATTITUDE = -90;
const MAX_LATTITUDE = 90;
const MAX_LONGITUDE = 180;
const MIN_LONGITUDE = -180;
const PLUGIN_PREFIX = 'geo-grid';
const geoGridKey = Symbol('DP.Blazor.MapLibre.geogrid');
const classnames = {
    container: 'geogrid',
    containerOverride: 'geogrid-overrides',
    label: 'geogrid__label'
};

const createMultiLineString = (coordinates) => ({
    type: 'MultiLineString',
    coordinates
});

const createParallelsGeometry = (densityInDegrees, bounds) => {
    const geometry = [];
    const west = Math.max(bounds.getWest(), MIN_LONGITUDE);
    const east = Math.min(bounds.getEast(), MAX_LONGITUDE);
    let currentLattitude = Math.ceil(bounds.getSouth() / densityInDegrees) * densityInDegrees;
    for (; currentLattitude < bounds.getNorth(); currentLattitude += densityInDegrees) {
        if (currentLattitude < MIN_LATTITUDE || currentLattitude > MAX_LATTITUDE) {
            continue;
        }

        // Clip to viewport instead of drawing full-world parallels.
        geometry.push([[west, currentLattitude], [east, currentLattitude]]);
    }
    return geometry;
};
const createMeridiansGeometry = (densityInDegrees, bounds) => {
    const geometry = [];
    const south = Math.max(bounds.getSouth(), MIN_LATTITUDE);
    const north = Math.min(bounds.getNorth(), MAX_LATTITUDE);
    let currentLongitude = Math.ceil(bounds.getWest() / densityInDegrees) * densityInDegrees;
    for (; currentLongitude < bounds.getEast(); currentLongitude += densityInDegrees) {
        // Clip to viewport instead of drawing pole-to-pole meridians.
        geometry.push([[currentLongitude, south], [currentLongitude, north]]);
    }
    return geometry;
};

const createLabelsContainerElement = () => {
    const el = document.createElement('div');
    el.classList.add(classnames.container, classnames.containerOverride);
    el.style.position = 'relative';
    el.style.height = '100%';
    el.style.pointerEvents = 'none';
    return el;
};
const createLabelElement = (value, x, y, align, format, labelStyle) => {
    const alignTopOrBottom = align === 'top' || align === 'bottom';
    const el = document.createElement('div');
    el.classList.add(classnames.label, `${classnames.label}--${align}`);
    if (labelStyle.color) {
        el.style.color = labelStyle.color;
    }
    if (labelStyle.fontFamily) {
        el.style.fontFamily = labelStyle.fontFamily;
    }
    if (labelStyle.fontSize) {
        el.style.fontSize = labelStyle.fontSize;
    }
    if (labelStyle.textShadow) {
        el.style.textShadow = labelStyle.textShadow;
    }
    el.innerText = format(value);
    el.setAttribute(alignTopOrBottom ? 'longitude' : 'latitude', value.toFixed(20));
    el.style.position = 'absolute';
    el.style[alignTopOrBottom ? 'left' : align] = `${x.toString()}px`;
    el.style[alignTopOrBottom ? align : 'top'] = `${y.toString()}px`;
    return el;
};

function getGridDensity(zoom) {
    switch (zoom) {
        case 0:
            return 30;
        case 1:
            return 15;
        case 2:
            return 10;
        case 3:
            return 7.5;
        case 4:
            return 5;
        case 5:
            return 3;
        case 6:
            return 2;
        case 7:
            return 1.5;
        case 8:
            return 0.75;
        case 9:
            return 0.5;
        case 10:
            return 0.25;
        case 11:
            return 0.125;
        case 12:
            return 0.075;
        case 13:
            return 0.05;
        case 14:
            return 0.025;
        default:
            return 30;
    }
}

const formatDegrees = (degressFloat) => {
    const degrees = Math.floor(degressFloat);
    const degreessFractionalPart = degressFloat - degrees;
    const minutesFloat = degreessFractionalPart * 60;
    const minutes = Math.floor(minutesFloat);
    const minutesFractionalPart = minutesFloat - minutes;
    const seconds = Math.round(minutesFractionalPart * 60);
    let output = `${degrees.toString()}°`;
    if (minutes !== 0) {
        output += ` ${minutes}′`;
    }
    if (seconds !== 0) {
        output += ` ${seconds}′′`;
    }
    return output;
};

const calculateTopMostNotOcludedLatitude = (map, longitude) => {
    let result = undefined;
    const step = map.getZoom() > 12 ? 0.01 : 1;
    const centerLat = map.getCenter().lat;
    for (let latitude = centerLat; latitude < 85; latitude += step) {
        // @ts-expect-error
        const isOccluded = map.transform.isLocationOccluded?.({ lng: longitude, lat: latitude });
        if (!isOccluded) {
            result = latitude;
        }
    }
    return result;
};
const calculateLeftMostNotOcludedLongitude = (map, latitude) => {
    let result = undefined;
    const step = 0.5;
    const centerLng = map.getCenter().lng;
    for (let longitude = centerLng; longitude > centerLng - 90; longitude -= step) {
        // @ts-expect-error
        const isOccluded = map.transform.isLocationOccluded?.({ lng: longitude, lat: latitude });
        if (!isOccluded) {
            result = longitude;
        }
    }
    return result;
};
const calculateRightMostNotOccludedLongitude = (map, latitude) => {
    let result = undefined;
    const step = 0.5;
    const centerLng = map.getCenter().lng;
    for (let longitude = centerLng; longitude < centerLng + 90; longitude += step) {
        // @ts-expect-error
        const isOccluded = map.transform.isLocationOccluded({ lng: longitude, lat: latitude });
        if (!isOccluded) {
            result = longitude;
        }
    }
    return result;
};
const calculateBottomMostNotOcludedLatitude = (map, longitude) => {
    let result = undefined;
    const step = map.getZoom() > 12 ? 0.01 : 1;
    const centerLat = map.getCenter().lat;
    for (let latitude = centerLat; latitude > -85; latitude -= step) {
        // @ts-expect-error
        const isOccluded = map.transform.isLocationOccluded?.({ lng: longitude, lat: latitude });
        if (!isOccluded) {
            result = latitude;
        }
    }
    return result;
};
const calculateLeftEdgeLongitude = (map, latitude) => {
    let lng = map.getCenter().lng;
    let intersects = false;
    const maxIterations = 180;
    let it = 0;
    // We are limiting the loop because some meridians may never intersect with the screen edge
    // and will pass the break condition (x <= 0)
    while (it < maxIterations) {
        lng--;
        const x = map.project([lng, latitude]).x;
        if (x <= 0) {
            intersects = true;
            break;
        }
        it++;
    }
    return intersects ? lng : null;
};
const calculateRightEdgeLongitude = (map, latitude) => {
    let lng = map.getCenter().lng;
    let intersects = false;
    const maxIterations = 180;
    let it = 0;
    const screenWidth = map.getContainer().offsetWidth;
    // Limiting the loop because some meridians may never intersect with the screen edge
    // and will pass the break condition (x <= 0)
    while (it < maxIterations) {
        lng++;
        const x = map.project([lng, latitude]).x;
        if (x >= screenWidth) {
            intersects = true;
            break;
        }
        it++;
    }
    return intersects ? lng : null;
};

/**
 * Creates customizable geographic grid and adds it to the map.
 */
class GeoGrid {
    map;
    config = {
        beforeLayerId: undefined,
        zoomLevelRange: [0, 22],
        parallersLayerName: `${PLUGIN_PREFIX}_parallers`,
        parallersSourceName: `${PLUGIN_PREFIX}_parallers_source`,
        meridiansLayerName: `${PLUGIN_PREFIX}_meridians`,
        meridiansSourceName: `${PLUGIN_PREFIX}_meridians_source`,
        style: {
            color: '#000000',
            width: 1,
            dasharray: undefined
        },
        labelStyle: {},
        gridDensity: getGridDensity,
        formatLabels: formatDegrees
    };
    elements = {
        labels: [],
        labelsContainer: createLabelsContainerElement()
    };
    _moveRafId = 0;
    _isMoving = false;
    _lastDensity = null;
    _pendingRebuildLabels = false;
    constructor(options) {
        if (!options.map) {
            throw new Error('GeoGrid: "map" option is required');
        }
        this.map = options.map;
        this.config.beforeLayerId = options.beforeLayerId || this.config.beforeLayerId;
        this.config.zoomLevelRange = options.zoomLevelRange || this.config.zoomLevelRange;
        this.config.style.color = options.gridStyle?.color || options.style?.color || this.config.style.color;
        this.config.style.width = options.gridStyle?.width || options.style?.width || this.config.style.width;
        this.config.style.dasharray = options.gridStyle?.dasharray || options.style?.dasharray || this.config.style.dasharray;
        this.config.labelStyle.color = options.labelStyle?.color;
        this.config.labelStyle.fontSize = options.labelStyle?.fontSize;
        this.config.labelStyle.fontFamily = options.labelStyle?.fontFamily;
        this.config.labelStyle.textShadow = options.labelStyle?.textShadow;
        this.config.formatLabels = options.formatLabels || this.config.formatLabels;
        this.config.gridDensity = options.gridDensity || this.config.gridDensity;

        this.map[geoGridKey]?.remove();
        this.map[geoGridKey] = this;
    }
    /**
    * Adds grid to the map. Call after the map style is loaded.
    */
    add = () => {
        const mapContainer = this.map.getContainer();
        mapContainer.querySelectorAll(`.${classnames.container}`).forEach((element) => {
            if (element !== this.elements.labelsContainer) {
                element.remove();
            }
        });

        if (!mapContainer.contains(this.elements.labelsContainer)) {
            mapContainer.appendChild(this.elements.labelsContainer);
            // moveend: full rebuild after gesture. move: cheap rAF-throttled updates only.
            this.map.on('movestart', this.onMoveStart);
            this.map.on('move', this.onMove);
            this.map.on('moveend', this.onMoveEnd);
            this.map.on('remove', this.removeEventListeners);
            this.map.on('projectiontransition', this.onProjectionTransition);
        }

        const densityInDegrees = this.config.gridDensity(
        // Zoom can be negative in the globe projection, so we clamp it
        Math.max(Math.floor(this.map.getZoom()), 0));

        if (!this.map.getLayer(this.config.parallersLayerName)) {
            this.addLayersAndSources(densityInDegrees);
        } else {
            this.refresh(densityInDegrees);
        }
    };
    /**
     * Removes grid from the map.
     */
    remove = () => {
        if (!this.map) {
            return;
        }

        try {
            if (this.map[geoGridKey] === this) {
                delete this.map[geoGridKey];
            }

            this.map.off('remove', this.removeEventListeners);
            this.removeEventListeners();
            this.removeLabels();

            const labelsContainer = this.elements.labelsContainer;
            if (labelsContainer?.parentNode) {
                labelsContainer.remove();
            }

            if (typeof this.map.isStyleLoaded === 'function' && this.map.isStyleLoaded()) {
                this.removeGridLayersAndSources();
            }
        } catch {
            // Map may already be destroyed during navigation/disposal.
        }
    };
    removeEventListeners = () => {
        if (!this.map) {
            return;
        }

        try {
            this.map.off('movestart', this.onMoveStart);
            this.map.off('move', this.onMove);
            this.map.off('moveend', this.onMoveEnd);
            this.map.off('projectiontransition', this.onProjectionTransition);
        } catch {
            // Map may already be destroyed during navigation/disposal.
        }

        if (this._moveRafId) {
            cancelAnimationFrame(this._moveRafId);
            this._moveRafId = 0;
        }
    };
    onMoveStart = () => {
        this._isMoving = true;
    };
    onMoveEnd = () => {
        this._isMoving = false;
        this.scheduleRefresh({ rebuildLabels: true });
    };
    onMove = () => {
        // Throttle to one update per frame. Skip label DOM rebuild while gesturing —
        // that was the main cost (innerHTML clear + recreate on every move event).
        this.scheduleRefresh({ rebuildLabels: false });
    };
    scheduleRefresh = ({ rebuildLabels }) => {
        if (this._moveRafId) {
            this._pendingRebuildLabels = this._pendingRebuildLabels || rebuildLabels;
            return;
        }

        this._pendingRebuildLabels = rebuildLabels;
        this._moveRafId = requestAnimationFrame(() => {
            this._moveRafId = 0;
            const densityInDegrees = this.config.gridDensity(
                Math.max(Math.floor(this.map.getZoom()), 0));
            const rebuildLabelsNow = this._pendingRebuildLabels || densityInDegrees !== this._lastDensity;
            this._pendingRebuildLabels = false;
            this.refresh(densityInDegrees, { rebuildLabels: rebuildLabelsNow });
        });
    };
    refresh = (densityInDegrees, { rebuildLabels = true } = {}) => {
        if (typeof this.map.isStyleLoaded === 'function' && !this.map.isStyleLoaded()) {
            return;
        }

        this.updateLabelsVisibility();

        if (!this.hasGridLayersAndSources()) {
            this.addLayersAndSources(densityInDegrees);
            return;
        }

        this.updateGrid(densityInDegrees);

        if (rebuildLabels) {
            this.removeLabels();
            this.drawLabels(densityInDegrees);
        }

        this._lastDensity = densityInDegrees;
    };
    onProjectionTransition = () => {
        this.map.once('idle', () => this.scheduleRefresh({ forceLabels: true }));
    };
    hasGridLayersAndSources = () =>
        !!this.map.getLayer(this.config.parallersLayerName)
        && !!this.map.getLayer(this.config.meridiansLayerName)
        && !!this.map.getSource(this.config.parallersSourceName)
        && !!this.map.getSource(this.config.meridiansSourceName);
    removeGridLayersAndSources = () => {
        if (typeof this.map.isStyleLoaded === 'function' && !this.map.isStyleLoaded()) {
            return;
        }

        try {
            if (this.map.getLayer(this.config.parallersLayerName)) {
                this.map.removeLayer(this.config.parallersLayerName);
            }

            if (this.map.getLayer(this.config.meridiansLayerName)) {
                this.map.removeLayer(this.config.meridiansLayerName);
            }

            if (this.map.getSource(this.config.parallersSourceName)) {
                this.map.removeSource(this.config.parallersSourceName);
            }

            if (this.map.getSource(this.config.meridiansSourceName)) {
                this.map.removeSource(this.config.meridiansSourceName);
            }
        } catch {
            // Style may be reloading during projection transition.
        }
    };
    addLayersAndSources = (densityInDegrees) => {
        if (typeof this.map.isStyleLoaded === 'function' && !this.map.isStyleLoaded()) {
            return;
        }

        if (this.hasGridLayersAndSources()) {
            this.updateGrid(densityInDegrees);
            this.drawLabels(densityInDegrees);
            return;
        }

        this.removeGridLayersAndSources();

        const bounds = this.map.getBounds();
        const filter = [
            'all',
            ['>=', ['zoom'], this.config.zoomLevelRange[0]],
            ['<=', ['zoom'], this.config.zoomLevelRange[1]]
        ];
        this.map.addSource(this.config.parallersSourceName, {
            type: 'geojson',
            data: {
                type: 'MultiLineString',
                coordinates: createParallelsGeometry(densityInDegrees, bounds)
            }
        });
        this.map.addLayer({
            id: this.config.parallersLayerName,
            filter,
            type: 'line',
            source: this.config.parallersSourceName,
            paint: {
                'line-color': this.config.style.color,
                'line-width': this.config.style.width,
                ...(this.config.style.dasharray && { 'line-dasharray': this.config.style.dasharray })
            }
        }, this.config.beforeLayerId);
        this.map.addSource(this.config.meridiansSourceName, {
            type: 'geojson',
            data: {
                type: 'MultiLineString',
                coordinates: createMeridiansGeometry(densityInDegrees, bounds)
            }
        });
        this.map.addLayer({
            id: this.config.meridiansLayerName,
            filter,
            type: 'line',
            source: this.config.meridiansSourceName,
            paint: {
                'line-color': this.config.style.color,
                'line-width': this.config.style.width,
                ...(this.config.style.dasharray && { 'line-dasharray': this.config.style.dasharray })
            }
        }, this.config.beforeLayerId);
        this.drawLabels(densityInDegrees);
    };
    drawLabels = (densityInDegrees) => {
        const currentZoomLevel = Math.floor(this.map.getZoom());
        const isInZoomLevelRange = currentZoomLevel >= this.config.zoomLevelRange[0] || currentZoomLevel <= this.config.zoomLevelRange[1];
        if (!isInZoomLevelRange) {
            return;
        }
        const bounds = this.map.getBounds();
        const isGlobeProjection = this.map.getStyle().projection?.type === 'globe';
        let currentLattitude = Math.ceil(bounds.getSouth() / densityInDegrees) * densityInDegrees;
        for (; currentLattitude < bounds.getNorth(); currentLattitude += densityInDegrees) {
            if (isGlobeProjection) {
                const leftLabel = this.drawLeftLabel(currentLattitude);
                if (leftLabel) {
                    this.elements.labels.push(leftLabel);
                    this.elements.labelsContainer.appendChild(leftLabel);
                }
                const rightLabel = this.drawRightLabel(currentLattitude);
                if (rightLabel) {
                    this.elements.labels.push(rightLabel);
                    this.elements.labelsContainer.appendChild(rightLabel);
                }
            }
            else {
                const y = this.map.project([0, currentLattitude]).y;
                const elements = [
                    createLabelElement(currentLattitude, 0, y, 'left', this.config.formatLabels, this.config.labelStyle),
                    createLabelElement(currentLattitude, 0, y, 'right', this.config.formatLabels, this.config.labelStyle),
                ];
                elements.forEach(element => {
                    this.elements.labels.push(element);
                    this.elements.labelsContainer.appendChild(element);
                });
            }
        }
        let currentLongitude = Math.ceil(bounds.getWest() / densityInDegrees) * densityInDegrees;
        for (; currentLongitude < bounds.getEast(); currentLongitude += densityInDegrees) {
            if (isGlobeProjection) {
                const topLabel = this.drawTopLabel(currentLongitude, bounds);
                const bottomLabel = this.drawBottomLabel(currentLongitude, bounds);
                if (topLabel) {
                    this.elements.labels.push(topLabel);
                    this.elements.labelsContainer.appendChild(topLabel);
                }
                if (bottomLabel) {
                    this.elements.labels.push(bottomLabel);
                    this.elements.labelsContainer.appendChild(bottomLabel);
                }
            }
            else {
                const x = this.map.project([currentLongitude, 0]).x;
                const topLabel = createLabelElement(currentLongitude, x, 0, 'top', this.config.formatLabels, this.config.labelStyle);
                const bottomLabel = createLabelElement(currentLongitude, x, 0, 'bottom', this.config.formatLabels, this.config.labelStyle);
                this.elements.labels.push(topLabel);
                this.elements.labels.push(bottomLabel);
                this.elements.labelsContainer.appendChild(topLabel);
                this.elements.labelsContainer.appendChild(bottomLabel);
            }
        }
    };
    updateGrid = (densityInDegrees) => {
        const parallersSource = this.map.getSource(this.config.parallersSourceName);
        const meridiansSource = this.map.getSource(this.config.meridiansSourceName);

        if (!parallersSource?.setData || !meridiansSource?.setData) {
            return;
        }

        const bounds = this.map.getBounds();
        parallersSource.setData(createMultiLineString(createParallelsGeometry(densityInDegrees, bounds)));
        meridiansSource.setData(createMultiLineString(createMeridiansGeometry(densityInDegrees, bounds)));
    };
    updateLabelsVisibility = () => {
        const isFacingNorth = Math.abs(this.map.getBearing()) === 0;
        this.elements.labelsContainer.style.display = isFacingNorth ? 'block' : 'none';
    };
    removeLabels = () => {
        this.elements.labels = [];
        this.elements.labelsContainer.innerHTML = '';
    };
    drawBottomLabel(currentLongitude, bounds) {
        const bottomMostNotOcludedLatitude = calculateBottomMostNotOcludedLatitude(this.map, currentLongitude);
        if (!bottomMostNotOcludedLatitude) {
            return;
        }
        const mostSouthNotOccludedLat = bottomMostNotOcludedLatitude % -90;
        // The case when the bottom of the screen is beyond (on the other side) the south pole in the globe projection.
        if (mostSouthNotOccludedLat > bounds.getSouth()) {
            return;
        }
        const x = this.map.project([currentLongitude, bounds.getSouth()]).x;
        // @ts-expect-error
        const isBottomYOccluded = this.map.transform.isLocationOccluded?.(this.map.unproject([x, this.map.getCanvas().offsetHeight]));
        if (isBottomYOccluded) {
            return;
        }
        return createLabelElement(currentLongitude, x, 0, 'bottom', this.config.formatLabels, this.config.labelStyle);
    }
    drawTopLabel(currentLongitude, bounds) {
        const topMostNotOcludedLatitute = calculateTopMostNotOcludedLatitude(this.map, currentLongitude);
        if (!topMostNotOcludedLatitute) {
            return;
        }
        const mostNorthNotOccludedLat = topMostNotOcludedLatitute % 90;
        // The case when top of the screen is beyond (on the other side) north pole in the globe projection.
        if (mostNorthNotOccludedLat < bounds.getNorth()) {
            return;
        }
        const x = this.map.project([currentLongitude, bounds.getNorth()]).x;
        // @ts-expect-error
        const isTopYOccluded = this.map.transform.isLocationOccluded?.(this.map.unproject([x, 0]));
        if (isTopYOccluded) {
            return;
        }
        return createLabelElement(currentLongitude, x, 0, 'top', this.config.formatLabels, this.config.labelStyle);
    }
    drawLeftLabel(currentLatitude) {
        const leftMostNotOcludedLongitude = calculateLeftMostNotOcludedLongitude(this.map, currentLatitude);
        if (leftMostNotOcludedLongitude === undefined) {
            return;
        }
        const edgeIntersectionLng = calculateLeftEdgeLongitude(this.map, currentLatitude);
        if (edgeIntersectionLng === null) {
            return;
        }
        const x = 0;
        const y = this.map.project([edgeIntersectionLng, currentLatitude]).y;
        return createLabelElement(currentLatitude, x, y, 'left', this.config.formatLabels, this.config.labelStyle);
    }
    drawRightLabel(currentLatitude) {
        const rightMostNotOccludedLongitude = calculateRightMostNotOccludedLongitude(this.map, currentLatitude);
        if (rightMostNotOccludedLongitude === undefined) {
            return;
        }
        const edgeIntersectionLng = calculateRightEdgeLongitude(this.map, currentLatitude);
        if (edgeIntersectionLng === null) {
            return;
        }
        const x = 0;
        const y = this.map.project([edgeIntersectionLng, currentLatitude]).y;
        return createLabelElement(currentLatitude, x, y, 'right', this.config.formatLabels, this.config.labelStyle);
    }
}

export function detachGeoGrid(map) {
    try {
        map?.[geoGridKey]?.remove();
    } catch {
        // Map may already be destroyed during navigation/disposal.
    }
}

export { GeoGrid };
