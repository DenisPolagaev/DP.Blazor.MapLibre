import { MapLibreStarryBackground } from './maplibre-gl-starfield-0.1.js';

let mapObject = null;
let starry = null;
/** @type {HTMLElement[]} */
let ownedContainers = [];

function ensureStylesheet() {
    const href = new URL('StarfieldPlugin.css', import.meta.url).href;
    if (document.querySelector(`link[href="${href}"]`)) {
        return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}

/**
 * Creates (or reuses) starfield + glow layers behind the MapLibre container.
 * @param {import('maplibre-gl').Map} map
 */
function ensureOwnedContainers(map) {
    const mapContainer = map.getContainer();
    const host = mapContainer.parentElement;
    if (!host) {
        throw new Error('Map container has no parent element for starfield backdrop.');
    }

    const hostStyle = getComputedStyle(host);
    if (hostStyle.position === 'static') {
        host.style.position = 'relative';
    }

    if (!host.classList.contains('maplibre-starfield-host')) {
        host.classList.add('maplibre-starfield-host');
    }

    const mapStyle = getComputedStyle(mapContainer);
    if (mapStyle.position === 'static') {
        mapContainer.style.position = 'relative';
    }

    mapContainer.style.zIndex = mapContainer.style.zIndex || '3';
    mapContainer.style.background = 'transparent';

    let starfield = host.querySelector(':scope > .maplibre-starfield-layer');
    let glow = host.querySelector(':scope > .maplibre-starfield-glow');

    if (!starfield) {
        starfield = document.createElement('div');
        starfield.className = 'maplibre-starfield-layer';
        host.insertBefore(starfield, mapContainer);
        ownedContainers.push(starfield);
    }

    if (!glow) {
        glow = document.createElement('div');
        glow.className = 'maplibre-starfield-glow';
        host.insertBefore(glow, mapContainer);
        ownedContainers.push(glow);
    }

    return { starfield, glow };
}

function removeOwnedContainers() {
    for (const el of ownedContainers) {
        el.remove();
    }
    ownedContainers = [];

    if (mapObject) {
        const host = mapObject.getContainer()?.parentElement;
        if (host?.classList.contains('maplibre-starfield-host')
            && !host.querySelector(':scope > .maplibre-starfield-layer')
            && !host.querySelector(':scope > .maplibre-starfield-glow')) {
            host.classList.remove('maplibre-starfield-host');
        }
    }
}

export async function initialize(map) {
    mapObject = map;
    ensureStylesheet();
}

/**
 * @param {object} [options]
 * @param {string} [options.starfieldContainerId]
 * @param {string} [options.glowContainerId]
 * @param {number} [options.starCount]
 * @param {number} [options.glowIntensity]
 * @param {number} [options.glowExtent]
 * @param {number} [options.coronaExtent]
 * @param {object} [options.glowColors]
 */
export function attach(options = {}) {
    if (!mapObject) {
        throw new Error('Starfield plugin is not initialized.');
    }

    detach();
    ensureStylesheet();

    const starCount = options.starCount;
    const glowIntensity = options.glowIntensity;
    const glowColors = options.glowColors;

    starry = new MapLibreStarryBackground({
        starCount,
        glowIntensity,
        glowExtent: options.glowExtent,
        coronaExtent: options.coronaExtent,
        glowColors,
    });

    let starfield = options.starfieldContainerId;
    let glow = options.glowContainerId;

    if (!starfield || !glow) {
        const owned = ensureOwnedContainers(mapObject);
        starfield = owned.starfield;
        glow = owned.glow;
    }

    starry.attachToMap(mapObject, starfield, glow);
}

export function updateConfig(options = {}) {
    if (!starry) {
        return;
    }

    starry.updateConfig(options);
}

export function detach() {
    if (starry) {
        starry.detach();
        starry = null;
    }

    removeOwnedContainers();
}

export function dispose() {
    detach();
    mapObject = null;
}
