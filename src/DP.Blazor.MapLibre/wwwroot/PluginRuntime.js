// Shared helpers for MapLibre plugin modules.
// Served as _content/DP.Blazor.MapLibre/PluginRuntime.js and imported by plugin modules.
// Plugins must not keep module-level state tied to a single map: use getMapState so that several maps
// (and several instances of the same plugin) can coexist.

const mapStates = new WeakMap();
const pendingAssets = new Map();

/**
 * Returns the state object stored for (map, key). The object is created with factory() on first use.
 * State is held in a WeakMap, so it is released together with the map.
 * @param {object} map MapLibre map instance.
 * @param {string} key Namespace of the state, usually the plugin name.
 * @param {() => object} factory Creates the initial state.
 */
export function getMapState(map, key, factory) {
    let byKey = mapStates.get(map);
    if (!byKey) {
        byKey = new Map();
        mapStates.set(map, byKey);
    }

    if (!byKey.has(key)) {
        byKey.set(key, factory());
    }

    return byKey.get(key);
}

/** Returns the state stored for (map, key) without creating it. */
export function peekMapState(map, key) {
    return mapStates.get(map)?.get(key);
}

/** Removes and returns the state stored for (map, key). */
export function deleteMapState(map, key) {
    const byKey = mapStates.get(map);
    if (!byKey) {
        return undefined;
    }

    const state = byKey.get(key);
    byKey.delete(key);
    if (byKey.size === 0) {
        mapStates.delete(map);
    }

    return state;
}

/**
 * Adds a stylesheet once per id. A failed load removes the element so a later call can retry.
 * @param {string} id Stable id used to deduplicate the stylesheet.
 * @param {string} href Stylesheet URL.
 * @returns {Promise<void>}
 */
export function loadStylesheet(id, href) {
    const key = `css:${id}`;
    if (pendingAssets.has(key)) {
        return pendingAssets.get(key);
    }

    const existing = document.querySelector(`link[data-maplibre-asset="${CSS.escape(id)}"]`);
    if (existing) {
        return Promise.resolve();
    }

    const promise = new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.dataset.maplibreAsset = id;
        link.addEventListener('load', () => resolve(), { once: true });
        link.addEventListener('error', () => {
            link.remove();
            reject(new Error(`Failed to load stylesheet ${href}`));
        }, { once: true });
        document.head.appendChild(link);
    }).finally(() => pendingAssets.delete(key));

    pendingAssets.set(key, promise);
    return promise;
}

/**
 * Loads a classic script once per id. Resolves when isLoaded() reports the expected global.
 * A failed load removes the element so a later call can retry.
 * @param {string} id Stable id used to deduplicate the script.
 * @param {string} src Script URL.
 * @param {() => boolean} isLoaded Returns true once the script's global is available.
 * @returns {Promise<void>}
 */
export function loadScript(id, src, isLoaded) {
    if (isLoaded()) {
        return Promise.resolve();
    }

    const key = `js:${id}`;
    if (pendingAssets.has(key)) {
        return pendingAssets.get(key);
    }

    const promise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.dataset.maplibreAsset = id;

        const fail = (message) => {
            script.remove();
            reject(new Error(message));
        };

        script.addEventListener('load', () => {
            if (isLoaded()) {
                resolve();
            } else {
                fail(`Script ${src} loaded, but its global is missing.`);
            }
        }, { once: true });
        script.addEventListener('error', () => fail(`Failed to load script ${src}`), { once: true });
        document.head.appendChild(script);
    }).finally(() => pendingAssets.delete(key));

    pendingAssets.set(key, promise);
    return promise;
}
