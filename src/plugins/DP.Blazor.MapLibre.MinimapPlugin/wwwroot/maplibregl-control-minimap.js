/* Adapted from https://github.com/aesqe/mapboxgl-minimap (MIT) for MapLibre GL JS */

export function registerMinimapControl(maplibregl) {
    if (!maplibregl) {
        throw new Error('MapLibre GL JS must be loaded before registering the minimap control.');
    }

    if (maplibregl.Minimap) {
        return maplibregl.Minimap;
    }

    function Minimap(options) {
        Object.assign(this.options, options);
        this._ticking = false;
        this._lastMouseMoveEvent = null;
        this._parentMap = null;
        this._isDragging = false;
        this._isCursorOverFeature = false;
        this._previousPoint = [0, 0];
        this._currentPoint = [0, 0];
        this._trackingRectCoordinates = [[[], [], [], [], []]];
        this._onParentMove = null;
        this._onMiniMouseMove = null;
        this._onMiniMouseDown = null;
        this._onMiniMouseUp = null;
        this._trackingBounds = null;
        this._removed = false;
        this._initFrameId = null;
        this._updateFrameId = null;
        this._onMiniMapLoad = null;
    }

    Minimap.prototype = {
        options: {
            id: 'maplibregl-minimap',
            width: '320px',
            height: '180px',
            style: 'https://demotiles.maplibre.org/style.json',
            center: [0, 0],
            zoom: 6,
            zoomAdjust: null,
            zoomLevels: [
                [18, 14, 16],
                [16, 12, 14],
                [14, 10, 12],
                [12, 8, 10],
                [10, 6, 8],
            ],
            lineColor: '#08F',
            lineWidth: 1,
            lineOpacity: 1,
            fillColor: '#F80',
            fillOpacity: 0.25,
            dragPan: false,
            scrollZoom: false,
            boxZoom: false,
            dragRotate: false,
            keyboard: false,
            doubleClickZoom: false,
            touchZoomRotate: false,
        },

        onAdd(parentMap) {
            this._removed = false;
            this._parentMap = parentMap;
            this._container = this._createContainer();

            // Wait until the control container is attached and laid out.
            this._initFrameId = requestAnimationFrame(() => {
                this._initFrameId = requestAnimationFrame(() => {
                    this._initFrameId = null;
                    this._initMiniMap();
                });
            });

            return this._container;
        },

        _initMiniMap() {
            if (this._removed || !this._container || !this._parentMap || this._miniMap) {
                return;
            }

            const opts = this.options;
            const parentMap = this._parentMap;
            const miniMap = (this._miniMap = new maplibregl.Map({
                attributionControl: false,
                container: this._container,
                style: opts.style,
                zoom: opts.zoom,
                center: parentMap.getCenter(),
            }));

            if (opts.maxBounds) {
                miniMap.setMaxBounds(opts.maxBounds);
            }

            this._onParentResize = () => {
                if (this._removed) {
                    return;
                }
                miniMap.resize();
                this._update();
            };
            parentMap.on('resize', this._onParentResize);

            this._onMiniMapLoad = () => {
                if (this._removed) {
                    return;
                }
                miniMap.resize();
                this._load();
            };
            miniMap.on('load', this._onMiniMapLoad);
        },

        onRemove() {
            this._removed = true;

            if (this._initFrameId !== null) {
                cancelAnimationFrame(this._initFrameId);
                this._initFrameId = null;
            }

            if (this._updateFrameId !== null) {
                cancelAnimationFrame(this._updateFrameId);
                this._updateFrameId = null;
            }

            if (this._parentMap && this._onParentMove) {
                this._parentMap.off('move', this._onParentMove);
                this._onParentMove = null;
            }

            if (this._parentMap && this._onParentResize) {
                this._parentMap.off('resize', this._onParentResize);
                this._onParentResize = null;
            }

            if (this._miniMap) {
                if (this._onMiniMapLoad) {
                    this._miniMap.off('load', this._onMiniMapLoad);
                    this._onMiniMapLoad = null;
                }

                if (this._onMiniMouseMove) {
                    this._miniMap.off('mousemove', this._onMiniMouseMove);
                    this._miniMap.off('touchmove', this._onMiniMouseMove);
                }
                if (this._onMiniMouseDown) {
                    this._miniMap.off('mousedown', this._onMiniMouseDown);
                    this._miniMap.off('touchstart', this._onMiniMouseDown);
                }
                if (this._onMiniMouseUp) {
                    this._miniMap.off('mouseup', this._onMiniMouseUp);
                    this._miniMap.off('touchend', this._onMiniMouseUp);
                }

                this._miniMap.remove();
                this._miniMap = null;
            }

            if (this._miniMapCanvas) {
                this._miniMapCanvas.removeEventListener('wheel', this._preventDefault);
                this._miniMapCanvas.removeEventListener('mousewheel', this._preventDefault);
                this._miniMapCanvas = null;
            }

            this._trackingRect = null;
            this._container?.remove();
            this._container = null;
            this._parentMap = null;
        },

        _load() {
            if (this._removed || !this._parentMap || !this._miniMap) {
                return;
            }

            const opts = this.options;
            const parentMap = this._parentMap;
            const miniMap = this._miniMap;
            const interactions = [
                'dragPan',
                'scrollZoom',
                'boxZoom',
                'dragRotate',
                'keyboard',
                'doubleClickZoom',
                'touchZoomRotate',
            ];

            interactions.forEach((interaction) => {
                if (opts[interaction] !== true) {
                    miniMap[interaction].disable();
                }
            });

            if (typeof opts.zoomAdjust === 'function') {
                this.options.zoomAdjust = opts.zoomAdjust.bind(this);
            } else if (opts.zoomAdjust === null) {
                this.options.zoomAdjust = this._zoomAdjust.bind(this);
            }

            this._trackingData = createTrackingFeature(this._trackingRectCoordinates);

            miniMap.addSource('trackingRect', {
                type: 'geojson',
                data: this._trackingData,
            });

            miniMap.addLayer({
                id: 'trackingRectOutline',
                type: 'line',
                source: 'trackingRect',
                layout: {},
                paint: {
                    'line-color': opts.lineColor,
                    'line-width': opts.lineWidth,
                    'line-opacity': opts.lineOpacity,
                },
            });

            miniMap.addLayer({
                id: 'trackingRectFill',
                type: 'fill',
                source: 'trackingRect',
                layout: {},
                paint: {
                    'fill-color': opts.fillColor,
                    'fill-opacity': opts.fillOpacity,
                },
            });

            this._trackingRect = miniMap.getSource('trackingRect');

            if (this._onParentMove) {
                parentMap.off('move', this._onParentMove);
            }
            this._onParentMove = () => this._update();
            parentMap.on('move', this._onParentMove);

            this._onMiniMouseMove = (e) => this._mouseMove(e);
            this._onMiniMouseDown = (e) => this._mouseDown(e);
            this._onMiniMouseUp = () => this._mouseUp();

            miniMap.on('mousemove', this._onMiniMouseMove);
            miniMap.on('mousedown', this._onMiniMouseDown);
            miniMap.on('mouseup', this._onMiniMouseUp);
            miniMap.on('touchmove', this._onMiniMouseMove);
            miniMap.on('touchstart', this._onMiniMouseDown);
            miniMap.on('touchend', this._onMiniMouseUp);

            this._miniMapCanvas = miniMap.getCanvasContainer();
            this._miniMapCanvas.addEventListener('wheel', this._preventDefault);
            this._miniMapCanvas.addEventListener('mousewheel', this._preventDefault);

            miniMap.resize();
            this._updateFrameId = requestAnimationFrame(() => {
                this._updateFrameId = null;
                this._update();
            });
        },

        _mouseDown(e) {
            if (this._isCursorOverFeature) {
                this._isDragging = true;
                this._previousPoint = this._currentPoint;
                this._currentPoint = [e.lngLat.lng, e.lngLat.lat];
            }
        },

        _mouseMove(e) {
            if (this._removed || !this._miniMap || !this._miniMapCanvas) {
                return;
            }

            this._ticking = false;

            const miniMap = this._miniMap;
            const features = miniMap.queryRenderedFeatures(e.point, {
                layers: ['trackingRectFill'],
            });

            if (!(this._isCursorOverFeature && features.length > 0)) {
                this._isCursorOverFeature = features.length > 0;
                this._miniMapCanvas.style.cursor = this._isCursorOverFeature ? 'move' : '';
            }

            if (this._isDragging) {
                this._previousPoint = this._currentPoint;
                this._currentPoint = [e.lngLat.lng, e.lngLat.lat];

                const offset = [
                    this._previousPoint[0] - this._currentPoint[0],
                    this._previousPoint[1] - this._currentPoint[1],
                ];

                const newBounds = this._moveTrackingRect(offset);

                this._parentMap.fitBounds(newBounds, {
                    duration: 80,
                    noMoveStart: true,
                });
            }
        },

        _mouseUp() {
            this._isDragging = false;
            this._ticking = false;
        },

        _moveTrackingRect(offset) {
            const bounds = this._trackingBounds;
            if (!bounds) {
                return bounds;
            }

            const ne = getNorthEast(bounds);
            const sw = getSouthWest(bounds);
            const newBounds = createLngLatBoundsFromCorners(
                sw.lng - offset[0],
                sw.lat - offset[1],
                ne.lng - offset[0],
                ne.lat - offset[1],
            );

            if (!newBounds) {
                return bounds;
            }

            this._setTrackingRectBounds(newBounds);
            return newBounds;
        },

        _setTrackingRectBounds(bounds) {
            this._trackingBounds = bounds;

            if (!this._applyTrackingRectGeometry(bounds)) {
                this._hideTrackingRect();
                return;
            }

            this._showTrackingRect();
            this._trackingData = createTrackingFeature(cloneCoordinates(this._trackingRectCoordinates));
            this._trackingRect.setData(this._trackingData);
        },

        _applyTrackingRectGeometry(bounds) {
            const parentZoom = this._parentMap.getZoom();
            const parentCorners = getBoundsCorners(bounds);

            if (!isValidTrackingBounds(parentCorners, parentZoom)) {
                return false;
            }

            const miniCorners = getBoundsCorners(this._miniMap.getBounds());
            if (miniCorners.sw.lng > miniCorners.ne.lng) {
                return false;
            }

            const clipped = intersectCorners(parentCorners, miniCorners);
            if (!clipped) {
                return false;
            }

            const { ne, sw } = clipped;
            const trc = this._trackingRectCoordinates;

            trc[0][0][0] = ne.lng;
            trc[0][0][1] = ne.lat;
            trc[0][1][0] = sw.lng;
            trc[0][1][1] = ne.lat;
            trc[0][2][0] = sw.lng;
            trc[0][2][1] = sw.lat;
            trc[0][3][0] = ne.lng;
            trc[0][3][1] = sw.lat;
            trc[0][4][0] = ne.lng;
            trc[0][4][1] = ne.lat;
            return true;
        },

        _hideTrackingRect() {
            if (!this._miniMap?.getLayer('trackingRectFill')) {
                return;
            }

            this._miniMap.setLayoutProperty('trackingRectFill', 'visibility', 'none');
            this._miniMap.setLayoutProperty('trackingRectOutline', 'visibility', 'none');
        },

        _showTrackingRect() {
            if (!this._miniMap?.getLayer('trackingRectFill')) {
                return;
            }

            this._miniMap.setLayoutProperty('trackingRectFill', 'visibility', 'visible');
            this._miniMap.setLayoutProperty('trackingRectOutline', 'visibility', 'visible');
        },

        _update() {
            if (this._removed || this._isDragging || !this._parentMap || !this._miniMap || !this._trackingRect) {
                return;
            }

            if (typeof this.options.zoomAdjust === 'function') {
                this.options.zoomAdjust();
            }

            const parentBounds = this._parentMap.getBounds();
            this._setTrackingRectBounds(parentBounds);
        },

        _zoomAdjust() {
            const miniMap = this._miniMap;
            const parentMap = this._parentMap;
            if (!miniMap || !parentMap) {
                return;
            }

            const parentZoom = parentMap.getZoom();
            let targetZoom = this.options.zoom;

            for (const level of this.options.zoomLevels) {
                if (parentZoom >= level[0]) {
                    targetZoom = level[2];
                    break;
                }
            }

            // Keep a stable world overview on the minimap when zoomed far out.
            if (parentZoom <= 2) {
                targetZoom = Math.min(this.options.zoom, 2);
            }

            miniMap.jumpTo({
                center: parentMap.getCenter(),
                zoom: targetZoom,
            });

            const parentBounds = parentMap.getBounds();
            if (!areBoundsInsideMapView(parentBounds, miniMap)) {
                miniMap.fitBounds(parentBounds, {
                    padding: 12,
                    duration: 0,
                    maxZoom: targetZoom,
                });
            }
        },

        _createContainer() {
            const opts = this.options;
            const container = document.createElement('div');

            container.className = 'maplibregl-ctrl-minimap maplibregl-ctrl';
            container.setAttribute('style', `width: ${opts.width}; height: ${opts.height};`);
            container.addEventListener('contextmenu', this._preventDefault);

            if (opts.id !== '') {
                container.id = opts.id;
            }

            return container;
        },

        _preventDefault(e) {
            e.preventDefault();
        },
    };

    maplibregl.Minimap = Minimap;
    return Minimap;
}

function getNorthEast(bounds) {
    return bounds.getNorthEast?.() ?? bounds._ne;
}

function getSouthWest(bounds) {
    return bounds.getSouthWest?.() ?? bounds._sw;
}

function clampLat(lat) {
    return Math.max(-90, Math.min(90, lat));
}

function clampLng(lng) {
    if (lng < -180) {
        return -180;
    }
    if (lng > 180) {
        return 180;
    }
    return lng;
}

function getBoundsCorners(bounds) {
    const ne = getNorthEast(bounds);
    const sw = getSouthWest(bounds);

    return {
        ne: { lng: clampLng(ne.lng), lat: clampLat(ne.lat) },
        sw: { lng: clampLng(sw.lng), lat: clampLat(sw.lat) },
    };
}

function getLongitudeSpan(swLng, neLng) {
    if (swLng <= neLng) {
        return neLng - swLng;
    }

    return 360 - (swLng - neLng);
}

function isValidTrackingBounds(corners, parentZoom) {
    if (parentZoom <= 2) {
        return false;
    }

    const latSpan = Math.abs(corners.ne.lat - corners.sw.lat);
    if (latSpan > 150) {
        return false;
    }

    const lngSpan = getLongitudeSpan(corners.sw.lng, corners.ne.lng);
    if (lngSpan > 270) {
        return false;
    }

    // A simple lng/lat rectangle cannot represent antimeridian-crossing bounds.
    if (corners.sw.lng > corners.ne.lng) {
        return false;
    }

    return true;
}

function intersectCorners(a, b) {
    if (a.sw.lng > a.ne.lng || b.sw.lng > b.ne.lng) {
        return null;
    }

    const west = Math.max(a.sw.lng, b.sw.lng);
    const east = Math.min(a.ne.lng, b.ne.lng);
    const south = Math.max(a.sw.lat, b.sw.lat);
    const north = Math.min(a.ne.lat, b.ne.lat);

    if (west >= east || south >= north) {
        return null;
    }

    return {
        sw: { lng: west, lat: south },
        ne: { lng: east, lat: north },
    };
}

function areBoundsInsideMapView(innerBounds, map) {
    const inner = getBoundsCorners(innerBounds);
    const outer = getBoundsCorners(map.getBounds());

    if (inner.sw.lng > inner.ne.lng || outer.sw.lng > outer.ne.lng) {
        return false;
    }

    return inner.sw.lng >= outer.sw.lng
        && inner.ne.lng <= outer.ne.lng
        && inner.sw.lat >= outer.sw.lat
        && inner.ne.lat <= outer.ne.lat;
}

function createLngLatBoundsFromCorners(west, south, east, north) {
    const swLng = clampLng(west);
    const swLat = clampLat(south);
    const neLng = clampLng(east);
    const neLat = clampLat(north);

    const minLng = Math.min(swLng, neLng);
    const maxLng = Math.max(swLng, neLng);
    const minLat = Math.min(swLat, neLat);
    const maxLat = Math.max(swLat, neLat);

    if (minLat >= maxLat) {
        return null;
    }

    if (minLng >= maxLng) {
        return null;
    }

    return new globalThis.maplibregl.LngLatBounds([minLng, minLat], [maxLng, maxLat]);
}

function createTrackingFeature(coordinates) {
    return {
        type: 'Feature',
        properties: {
            name: 'trackingRect',
        },
        geometry: {
            type: 'Polygon',
            coordinates,
        },
    };
}

function cloneCoordinates(coordinates) {
    return [coordinates[0].map(([lng, lat]) => [lng, lat])];
}
