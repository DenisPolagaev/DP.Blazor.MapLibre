const compareRelativeBase = '_content/MapComparePlugin/maplibre-gl-compare/dist/';
const mapLibreModulePath = '_content/DP.Blazor.MapLibre/MapLibre.razor.js';
const pluginStylesheet = '_content/MapComparePlugin/ComparePlugin.css';

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

let compareControl = null;
let compareContainerElement = null;
let dependenciesLoaded = false;
let mapLibreModulePromise = null;

function contentUrl(relativePath) {
    return new URL(relativePath, document.baseURI).href;
}

function findLoadedScript(absoluteUrl) {
    return [...document.scripts].find((script) => script.src === absoluteUrl);
}

function removeLoadedScript(absoluteUrl) {
    findLoadedScript(absoluteUrl)?.remove();
}

function loadStylesheet(relativePath) {
    const href = contentUrl(relativePath);
    if (document.querySelector(`link[href="${href}"]`)) {
        return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}

function loadClassicScript(relativePath, forceReload = false) {
    const src = contentUrl(relativePath);

    if (forceReload) {
        removeLoadedScript(src);
    } else if (findLoadedScript(src)) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(script);
    });
}

function getMapLibreModule() {
    if (!mapLibreModulePromise) {
        mapLibreModulePromise = import(contentUrl(mapLibreModulePath));
    }

    return mapLibreModulePromise;
}

async function waitForLayout() {
    await new Promise((resolve) => requestAnimationFrame(() => resolve()));
    await new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

async function ensureMapLibreGlobal() {
    if (globalThis.maplibregl?.Map) {
        return;
    }

    await loadClassicScript('_content/DP.Blazor.MapLibre/maplibre-gl/dist/maplibre-gl.js');

    if (!globalThis.maplibregl?.Map) {
        throw new Error('MapLibre GL JS failed to load');
    }
}

async function ensureCompareAttached() {
    if (globalThis.maplibregl?.Compare) {
        return;
    }

    if (!globalThis.maplibregl?.Map) {
        throw new Error('MapLibre GL JS must be loaded before maplibre-gl-compare');
    }

    const compareScript = `${compareRelativeBase}maplibre-gl-compare.js`;
    await loadClassicScript(compareScript);

    if (!globalThis.maplibregl?.Compare) {
        await loadClassicScript(compareScript, true);
    }

    if (!globalThis.maplibregl?.Compare) {
        throw new Error('maplibre-gl-compare failed to attach to window.maplibregl');
    }
}

async function loadDependencies() {
    if (!globalThis.maplibregl?.Compare) {
        dependenciesLoaded = false;
    }

    if (dependenciesLoaded && globalThis.maplibregl?.Compare) {
        return;
    }

    await ensureMapLibreGlobal();
    loadStylesheet(`${compareRelativeBase}maplibre-gl-compare.css`);
    loadStylesheet(pluginStylesheet);
    await ensureCompareAttached();
    dependenciesLoaded = true;
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

function applyHandleOptions(containerElement, handle) {
    if (!containerElement) {
        return;
    }

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

    if (options.customIconHtml) {
        const icon = document.createElement('span');
        icon.className = 'blazor-compare-handle-icon';
        icon.innerHTML = options.customIconHtml;
        swiper.appendChild(icon);
        return;
    }

    if (iconName === 'none') {
        return;
    }

    const icon = document.createElement('span');
    icon.className = 'blazor-compare-handle-icon';
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

export async function initialize() {
    await loadDependencies();
}

export async function mapsReady(beforeMapId, afterMapId) {
    const { getMap } = await getMapLibreModule();
    return Boolean(getMap(beforeMapId) && getMap(afterMapId));
}

export async function createCompare(beforeMapId, afterMapId, container, options) {
    await loadDependencies();

    const Compare = globalThis.maplibregl?.Compare;
    if (!Compare) {
        throw new Error('maplibre-gl-compare is not loaded');
    }

    const { getMap, resize } = await getMapLibreModule();
    const beforeMap = getMap(beforeMapId);
    const afterMap = getMap(afterMapId);

    if (!beforeMap) {
        throw new Error(`Before map "${beforeMapId}" was not found`);
    }

    if (!afterMap) {
        throw new Error(`After map "${afterMapId}" was not found`);
    }

    const containerElement = typeof container === 'string'
        ? document.querySelector(container)
        : container;

    if (!containerElement) {
        throw new Error(`Compare container "${container}" was not found`);
    }

    resize(beforeMapId);
    resize(afterMapId);
    await waitForLayout();

    if (compareControl) {
        clearHandleOptions(compareContainerElement);
        compareControl.remove();
        compareControl = null;
        compareContainerElement = null;
    }

    compareControl = new Compare(beforeMap, afterMap, containerElement, {
        mousemove: options?.mousemove ?? false,
        orientation: options?.orientation ?? 'vertical',
    });

    compareContainerElement = containerElement;
    applyHandleOptions(containerElement, options?.handle);

    resize(beforeMapId);
    resize(afterMapId);

    return compareControl.currentPosition ?? 0;
}

export function getCurrentPosition() {
    return compareControl?.currentPosition ?? 0;
}

/**
 * @returns {{ position: number, width: number, height: number, ratio: number }}
 */
export function getSliderState() {
    if (!compareControl) {
        return { position: 0, width: 0, height: 0, ratio: 0.5 };
    }

    const width = compareControl._bounds?.width
        || compareContainerElement?.clientWidth
        || 0;
    const height = compareControl._bounds?.height
        || compareContainerElement?.clientHeight
        || 0;
    const position = compareControl.currentPosition ?? 0;
    return {
        position,
        width,
        height,
        ratio: width > 0 ? position / width : 0.5,
    };
}

export function setSlider(position) {
    compareControl?.setSlider(position);
}

export function onSlideEnd(dotnetReference) {
    if (!compareControl) {
        return;
    }

    compareControl.on('slideend', (event) => {
        dotnetReference.invokeMethodAsync('Invoke', JSON.stringify(event));
    });
}

export function remove() {
    if (compareControl) {
        clearHandleOptions(compareContainerElement);
        compareControl.remove();
        compareControl = null;
        compareContainerElement = null;
    }
}

export function dispose() {
    remove();
}
