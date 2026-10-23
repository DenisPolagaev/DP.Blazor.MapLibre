import {
    deleteMapState,
    getMapState,
    loadStylesheet,
    peekMapState,
} from '../DP.Blazor.MapLibre/PluginRuntime.js';
import { MapLibreStarryBackground, StyleSnapshot } from './maplibre-gl-starfield-0.1.js';

// Per-map state key. The module itself keeps no map-level variables: this module is a
// singleton per URL, so state held here would be shared by every map that uses the plugin.
const STATE_KEY = 'DP.Blazor.MapLibre.StarfieldPlugin';
const STYLESHEET_ID = 'DP.Blazor.MapLibre.StarfieldPlugin';
const HOST_CLASS = 'maplibre-starfield-host';

function createState() {
    return {
        /** @type {MapLibreStarryBackground|null} */
        starry: null,
        /** @type {HTMLElement|null} */
        host: null,
        addedHostClass: false,
        /** @type {HTMLElement[]} Layers created by this plugin (removed on detach). */
        ownedContainers: [],
        /** Original inline styles of the host and the map container. */
        styles: new StyleSnapshot(),
    };
}

/**
 * Creates (or reuses) starfield + glow layers behind the MapLibre container.
 * Styles that change are recorded in state.styles so detach can restore them.
 * @param {import('maplibre-gl').Map} map
 * @param {ReturnType<typeof createState>} state
 */
function ensureOwnedContainers(map, state) {
    const mapContainer = map.getContainer();
    const host = mapContainer.parentElement;
    if (!host) {
        throw new Error('Starfield plugin: the map container has no parent element to host the backdrop layers.');
    }

    state.host = host;
    if (getComputedStyle(host).position === 'static') {
        state.styles.set(host, { position: 'relative' });
    }
    if (!host.classList.contains(HOST_CLASS)) {
        host.classList.add(HOST_CLASS);
        state.addedHostClass = true;
    }

    if (getComputedStyle(mapContainer).position === 'static') {
        state.styles.set(mapContainer, { position: 'relative' });
    }
    state.styles.set(mapContainer, {
        zIndex: mapContainer.style.zIndex || '3',
        background: 'transparent',
    });

    let starfield = host.querySelector(':scope > .maplibre-starfield-layer');
    let glow = host.querySelector(':scope > .maplibre-starfield-glow');

    if (!starfield) {
        starfield = document.createElement('div');
        starfield.className = 'maplibre-starfield-layer';
        host.insertBefore(starfield, mapContainer);
        state.ownedContainers.push(starfield);
    }

    if (!glow) {
        glow = document.createElement('div');
        glow.className = 'maplibre-starfield-glow';
        host.insertBefore(glow, mapContainer);
        state.ownedContainers.push(glow);
    }

    return { starfield, glow };
}

/**
 * Undoes everything attach did for one map: stops the backdrop, removes the layers,
 * removes the host class and restores the saved styles. Restoration runs even when
 * the backdrop fails to stop.
 * @param {ReturnType<typeof createState>} state
 */
function releaseState(state) {
    try {
        state.starry?.detach();
    } finally {
        for (const el of state.ownedContainers) {
            el.remove();
        }
        state.ownedContainers = [];

        if (state.addedHostClass) {
            state.host?.classList.remove(HOST_CLASS);
        }
        state.addedHostClass = false;
        state.host = null;

        state.styles.restore();
    }
}

/**
 * Loads the plugin stylesheet. Resolves before any attach call is made.
 * @param {import('maplibre-gl').Map} map
 */
export async function initialize(map) {
    if (!map) {
        throw new Error('Starfield plugin: initialize requires a MapLibre map instance.');
    }

    await loadStylesheet(STYLESHEET_ID, new URL('StarfieldPlugin.css', import.meta.url).href);
}

/**
 * Attaches the starfield and glow to one map. Attaching again replaces the previous backdrop.
 * @param {import('maplibre-gl').Map} map
 * @param {object} [options]
 * @param {string} [options.starfieldContainerId]
 * @param {string} [options.glowContainerId]
 * @param {number} [options.starCount]
 * @param {number} [options.glowIntensity]
 * @param {number} [options.glowExtent]
 * @param {number} [options.coronaExtent]
 * @param {object} [options.glowColors]
 */
export function attach(map, options) {
    if (!map) {
        throw new Error('Starfield plugin: attach requires a MapLibre map instance.');
    }

    const config = options ?? {};
    detach(map);

    const state = getMapState(map, STATE_KEY, createState);
    try {
        let starfieldContainer = config.starfieldContainerId;
        let glowContainer = config.glowContainerId;

        if (!starfieldContainer || !glowContainer) {
            const owned = ensureOwnedContainers(map, state);
            starfieldContainer = owned.starfield;
            glowContainer = owned.glow;
        }

        state.starry = new MapLibreStarryBackground({
            starCount: config.starCount,
            glowIntensity: config.glowIntensity,
            glowExtent: config.glowExtent,
            coronaExtent: config.coronaExtent,
            glowColors: config.glowColors,
        });
        state.starry.attachToMap(map, starfieldContainer, glowContainer);
    } catch (error) {
        // Roll back so a failed attach leaves the map as it was before the call.
        detach(map);
        throw error;
    }
}

/**
 * Updates glow and star settings of an attached backdrop. Does nothing when the map has no backdrop.
 * @param {import('maplibre-gl').Map} map
 * @param {object} [options] Same shape as attach options.
 */
export function updateConfig(map, options) {
    peekMapState(map, STATE_KEY)?.starry?.updateConfig(options ?? {});
}

/**
 * Removes the backdrop of one map and restores the host and map styles.
 * Safe to call when the map is not attached.
 * @param {import('maplibre-gl').Map} map
 */
export function detach(map) {
    const state = deleteMapState(map, STATE_KEY);
    if (state) {
        releaseState(state);
    }
}

/**
 * Releases everything held for one map. Equivalent to detach; the plugin keeps no other state.
 * @param {import('maplibre-gl').Map} map
 */
export function dispose(map) {
    detach(map);
}
