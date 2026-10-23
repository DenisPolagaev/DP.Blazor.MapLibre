// Map compare (swipe) plugin backed by maplibre-gl-compare.
// Served as _content/MapComparePlugin/ComparePlugin.js. ComparePlugin.cs imports it through
// MapLibrePluginModules, which prepares the maplibregl global before this module is evaluated.
//
// State: no module-level state. Each (before map, plugin instance) pair keeps its control and
// slide-end listeners in getMapState, so several maps and several plugin instances stay isolated.

import { getMap, resize } from '../DP.Blazor.MapLibre/MapLibre.razor.js';
import { getMapState, peekMapState, deleteMapState, loadStylesheet, loadScript } from '../DP.Blazor.MapLibre/PluginRuntime.js';

const compareScriptUrl = new URL('./maplibre-gl-compare/dist/maplibre-gl-compare.js', import.meta.url).href;
const compareStylesheetUrl = new URL('./maplibre-gl-compare/dist/maplibre-gl-compare.css', import.meta.url).href;
const pluginStylesheetUrl = new URL('./ComparePlugin.css', import.meta.url).href;
const stateNamespace = 'compare:';

const defaultHandleOptions = {
    cssClass: null,
    size: 36,
    backgroundColor: null,
    borderColor: null,
    borderWidth: null,
    borderRadius: null,
    boxShadow: null,
    lineColor: null,
    lineWidth: null,
    icon: 'chevrons',
    customIconHtml: null,
};

const handleIcons = {
    chevrons: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M6 4L2 8l4 4M10 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    grip: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <circle cx="4.5" cy="3" r="1.1" fill="currentColor"/>
        <circle cx="9.5" cy="3" r="1.1" fill="currentColor"/>
        <circle cx="4.5" cy="7" r="1.1" fill="currentColor"/>
        <circle cx="9.5" cy="7" r="1.1" fill="currentColor"/>
        <circle cx="4.5" cy="11" r="1.1" fill="currentColor"/>
        <circle cx="9.5" cy="11" r="1.1" fill="currentColor"/>
    </svg>`,
};

// Attributes that can carry a script URL in customIconHtml.
const urlAttributes = new Set(['href', 'src', 'xlink:href', 'action', 'formaction']);

function createState() {
    return {
        control: null,
        container: null,
        // listenerId -> { handler }; kept while the plugin instance lives on this map, so subscriptions
        // are re-attached when the control is created again.
        listeners: new Map(),
        nextListenerId: 1,
    };
}

function stateKey(instanceKey) {
    return `${stateNamespace}${instanceKey}`;
}

function requireMap(mapId) {
    const map = getMap(mapId);
    if (!map) {
        throw new Error(`Map "${mapId}" was not found`);
    }

    return map;
}

function findState(mapId, instanceKey) {
    const map = getMap(mapId);
    return map ? peekMapState(map, stateKey(instanceKey)) : undefined;
}

function resolveContainer(container) {
    const element = typeof container === 'string'
        ? document.querySelector(container)
        : container;

    if (!element) {
        throw new Error(`Compare container "${container}" was not found`);
    }

    return element;
}

async function loadDependencies() {
    if (!globalThis.maplibregl?.Map) {
        throw new Error('MapLibre GL JS is not prepared. Load the plugin through MapLibrePluginModules.');
    }

    await Promise.all([
        loadStylesheet('maplibre-gl-compare', compareStylesheetUrl),
        loadStylesheet('blazor-compare-plugin', pluginStylesheetUrl),
    ]);

    // The UMD bundle assigns maplibregl.Compare; loadScript resolves only once that global exists.
    await loadScript('maplibre-gl-compare', compareScriptUrl, () => Boolean(globalThis.maplibregl?.Compare));
}

async function waitForLayout() {
    await new Promise((resolve) => requestAnimationFrame(() => resolve()));
    await new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

function mergeHandleOptions(handle) {
    return {
        ...defaultHandleOptions,
        ...(handle ?? {}),
    };
}

function setCssVariable(element, name, value) {
    if (value !== null && value !== undefined && value !== '') {
        element.style.setProperty(name, value);
    }
}

/**
 * Returns the DOM nodes of customIconHtml. The HTML is developer-supplied and trusted, but <script> elements,
 * on* event-handler attributes and javascript: URLs are removed before insertion, so an accidental attribute
 * cannot run code. Built-in icons are static strings and are not passed through this function.
 */
function toSafeIconFragment(html) {
    const template = document.createElement('template');
    template.innerHTML = html;

    const fragment = template.content;
    fragment.querySelectorAll('script').forEach((element) => element.remove());
    fragment.querySelectorAll('*').forEach((element) => {
        for (const attribute of [...element.attributes]) {
            const name = attribute.name.toLowerCase();
            const value = attribute.value.replace(/[\s\u0000-\u001f]/g, '').toLowerCase();
            if (name.startsWith('on') || (urlAttributes.has(name) && value.startsWith('javascript:'))) {
                element.removeAttribute(attribute.name);
            }
        }
    });

    return fragment;
}

function applyHandleOptions(containerElement, handle) {
    const options = mergeHandleOptions(handle);
    containerElement.classList.add('blazor-maplibre-compare');

    if (options.cssClass) {
        containerElement.classList.add(options.cssClass);
    }

    setCssVariable(containerElement, '--blazor-compare-handle-size', `${options.size}px`);
    setCssVariable(containerElement, '--blazor-compare-handle-bg', options.backgroundColor);
    setCssVariable(containerElement, '--blazor-compare-handle-border-color', options.borderColor);
    setCssVariable(containerElement, '--blazor-compare-handle-border-width', options.borderWidth !== null ? `${options.borderWidth}px` : null);
    setCssVariable(containerElement, '--blazor-compare-handle-radius', options.borderRadius);
    setCssVariable(containerElement, '--blazor-compare-handle-shadow', options.boxShadow);
    setCssVariable(containerElement, '--blazor-compare-line-color', options.lineColor);
    setCssVariable(containerElement, '--blazor-compare-line-width', options.lineWidth !== null ? `${options.lineWidth}px` : null);

    const swiper = containerElement.querySelector('.compare-swiper-vertical, .compare-swiper-horizontal');
    if (!swiper) {
        return;
    }

    swiper.style.backgroundImage = 'none';

    const iconName = (options.icon ?? 'chevrons').toLowerCase();
    swiper.innerHTML = '';

    const icon = document.createElement('span');
    icon.className = 'blazor-compare-handle-icon';

    if (options.customIconHtml) {
        icon.append(toSafeIconFragment(options.customIconHtml));
        swiper.appendChild(icon);
        return;
    }

    if (iconName === 'none') {
        return;
    }

    icon.innerHTML = handleIcons[iconName] ?? handleIcons.chevrons;
    swiper.appendChild(icon);
}

function clearHandleOptions(containerElement) {
    if (!containerElement) {
        return;
    }

    containerElement.classList.remove('blazor-maplibre-compare');
    containerElement.style.removeProperty('--blazor-compare-handle-size');
    containerElement.style.removeProperty('--blazor-compare-handle-bg');
    containerElement.style.removeProperty('--blazor-compare-handle-border-color');
    containerElement.style.removeProperty('--blazor-compare-handle-border-width');
    containerElement.style.removeProperty('--blazor-compare-handle-radius');
    containerElement.style.removeProperty('--blazor-compare-handle-shadow');
    containerElement.style.removeProperty('--blazor-compare-line-color');
    containerElement.style.removeProperty('--blazor-compare-line-width');
}

/** Removes the control of a state and its listeners from it. Listener records are kept. */
function detachControl(state) {
    if (!state.control) {
        return;
    }

    for (const entry of state.listeners.values()) {
        state.control.off('slideend', entry.handler);
    }

    clearHandleOptions(state.container);
    state.control.remove();
    state.control = null;
    state.container = null;
}

/** Called by the base module loader; the map argument is not needed here. */
export async function initialize() {
    await loadDependencies();
}

export function mapsReady(beforeMapId, afterMapId) {
    return Boolean(getMap(beforeMapId) && getMap(afterMapId));
}

export async function createCompare(beforeMapId, afterMapId, instanceKey, container, options) {
    await loadDependencies();

    const beforeMap = requireMap(beforeMapId);
    const afterMap = requireMap(afterMapId);
    const containerElement = resolveContainer(container);

    resize(beforeMapId);
    resize(afterMapId);
    await waitForLayout();

    const state = getMapState(beforeMap, stateKey(instanceKey), createState);
    detachControl(state);

    const Compare = globalThis.maplibregl.Compare;
    const control = new Compare(beforeMap, afterMap, containerElement, {
        mousemove: options?.mousemove ?? false,
        orientation: options?.orientation ?? 'vertical',
    });

    state.control = control;
    state.container = containerElement;

    for (const entry of state.listeners.values()) {
        control.on('slideend', entry.handler);
    }

    applyHandleOptions(containerElement, options?.handle);

    resize(beforeMapId);
    resize(afterMapId);

    return control.currentPosition ?? 0;
}

export function getCurrentPosition(mapId, instanceKey) {
    return findState(mapId, instanceKey)?.control?.currentPosition ?? 0;
}

/**
 * @returns {{ position: number, width: number, height: number, ratio: number }}
 */
export function getSliderState(mapId, instanceKey) {
    const state = findState(mapId, instanceKey);
    if (!state?.control) {
        return { position: 0, width: 0, height: 0, ratio: 0.5 };
    }

    // Size comes from the container element, not from the control's private bounds field.
    const rect = state.container?.getBoundingClientRect();
    const width = rect?.width ?? 0;
    const height = rect?.height ?? 0;
    const position = state.control.currentPosition ?? 0;

    return {
        position,
        width,
        height,
        ratio: width > 0 ? position / width : 0.5,
    };
}

export function setSlider(mapId, instanceKey, position) {
    findState(mapId, instanceKey)?.control?.setSlider(position);
}

/**
 * Subscribes to slideend. The subscription is kept even when no control exists yet and is attached on create.
 * @returns {string} Listener id used by off().
 */
export function onSlideEnd(mapId, instanceKey, dotnetReference) {
    const map = requireMap(mapId);
    const state = getMapState(map, stateKey(instanceKey), createState);
    const listenerId = `${instanceKey}:${state.nextListenerId++}`;

    const handler = async (event) => {
        try {
            await dotnetReference.invokeMethodAsync('Invoke', JSON.stringify(event));
        } catch (error) {
            console.error('ComparePlugin slideend callback failed.', error);
        }
    };

    state.listeners.set(listenerId, { handler });
    state.control?.on('slideend', handler);
    return listenerId;
}

/**
 * Unsubscribes one slideend listener. Idempotent: an unknown or already removed id is ignored.
 * The listener id has the form "<instanceKey>:<n>", which selects the per-instance state.
 */
export function off(mapId, listenerId) {
    const map = getMap(mapId);
    if (!map) {
        return;
    }

    const state = peekMapState(map, stateKey(listenerId.slice(0, listenerId.lastIndexOf(':'))));
    const entry = state?.listeners.get(listenerId);
    if (!entry) {
        return;
    }

    state.listeners.delete(listenerId);
    state.control?.off('slideend', entry.handler);
}

/** Removes the control and all slideend listeners of this instance. Idempotent. */
export function remove(mapId, instanceKey) {
    const state = findState(mapId, instanceKey);
    if (!state) {
        return;
    }

    detachControl(state);
    state.listeners.clear();
}

/** Removes everything this instance created on the map and forgets its state. Idempotent. */
export function dispose(mapId, instanceKey) {
    remove(mapId, instanceKey);

    const map = getMap(mapId);
    if (map) {
        deleteMapState(map, stateKey(instanceKey));
    }
}
