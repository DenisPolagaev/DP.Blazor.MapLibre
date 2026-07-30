function getSiteBasePath() {
    const isLocalhost = window.location.hostname === 'localhost';
    return isLocalhost ? '/' : '/DP.Blazor.MapLibre/';
}

function absolutizePageRelativeLinks() {
    document.querySelectorAll('a[href]').forEach((anchor) => {
        const href = anchor.getAttribute('href');
        if (!href ||
            href.startsWith('#') ||
            href.startsWith('mailto:') ||
            href.startsWith('http://') ||
            href.startsWith('https://')) {
            return;
        }

        if (href.startsWith('/')) {
            return;
        }

        const absolute = new URL(href, window.location.href);
        anchor.setAttribute('href', absolute.pathname + absolute.search + absolute.hash);
    });
}

function ensureSiteBaseHref() {
    if (document.querySelector('base')) {
        return;
    }

    const baseElement = document.createElement('base');
    baseElement.href = getSiteBasePath();
    document.head.insertBefore(baseElement, document.head.firstChild);
}

function appendStylesheet(href) {
    if (document.querySelector(`link[rel="stylesheet"][href="${href}"]`)) {
        return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}

function appendScript(src) {
    if ([...document.scripts].some((script) => script.src.endsWith(src))) {
        return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    document.body.appendChild(script);
}

function ensureBlazorHostElements() {
    if (!document.getElementById('app')) {
        const app = document.createElement('div');
        app.id = 'app';
        app.hidden = true;
        document.body.appendChild(app);
    }

    if (!document.getElementById('blazor-error-ui')) {
        const errorUi = document.createElement('div');
        errorUi.id = 'blazor-error-ui';
        errorUi.innerHTML = 'An unhandled error has occurred. <a href="" class="reload">Reload</a> <a class="dismiss">🗙</a>';
        document.body.appendChild(errorUi);
    }
}

export default {
    start: () => {
        // Convert docfx relative links before <base>, so navbar/toc links keep working.
        absolutizePageRelativeLinks();

        // Blazor and MapLibre resolve ./_content and ./_framework from the site root.
        ensureSiteBaseHref();

        const mapLibreContent = '_content/DP.Blazor.MapLibre/';

        appendStylesheet(`${mapLibreContent}maplibre-gl/dist/maplibre-gl.css`);
        appendStylesheet('_content/MapComparePlugin/maplibre-gl-compare/dist/maplibre-gl-compare.css');
        appendStylesheet('DP.Blazor.MapLibre.Examples.styles.css');
        appendStylesheet('css/app.css');

        ensureBlazorHostElements();

        appendScript('_content/DP.Blazor.MapLibre/maplibre-gl/dist/maplibre-gl.js');
        appendScript('_framework/blazor.webassembly.js');

        scheduleLinkFixAfterDocFx();
    },
};

function scheduleLinkFixAfterDocFx() {
    const fix = () => absolutizePageRelativeLinks();

    if (window.docfx?.ready) {
        fix();
        return;
    }

    const waitForDocFx = () => {
        if (window.docfx?.ready) {
            fix();
            return;
        }

        requestAnimationFrame(waitForDocFx);
    };

    requestAnimationFrame(waitForDocFx);
}
