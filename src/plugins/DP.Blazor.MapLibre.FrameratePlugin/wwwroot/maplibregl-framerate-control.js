/*
 * Adapted from mapbox-gl-framerate (https://github.com/mapbox/mapbox-gl-framerate), version unknown,
 * for MapLibre GL JS. License: ISC. See THIRD-PARTY-NOTICES.txt in this folder.
 */

/**
 * Frame rate control for MapLibre GL JS. The class is exported from the module only; it is not
 * published on the global maplibregl object.
 */
export class FrameRateControl {
    constructor(options = {}) {
        const dpr = window.devicePixelRatio;
        const defaultOptions = {
            background: 'rgba(0,0,0,0.9)',
            barWidth: 4 * dpr,
            color: '#7cf859',
            font: 'Monaco, Consolas, Courier, monospace',
            graphHeight: 60 * dpr,
            graphWidth: 90 * dpr,
            graphTop: 0,
            graphRight: 5 * dpr,
            width: 100 * dpr,
        };

        this.frames = 0;
        this.totalTime = 0;
        this.totalFrames = 0;
        // Start time of the current measurement; null while the map is not moving.
        this.time = null;
        this.options = { ...defaultOptions, ...options };
    }

    onAdd = (map) => {
        this.map = map;

        const dpr = window.devicePixelRatio;
        const { width, graphWidth, graphHeight, color, background, font } = this.options;

        const el = (this.container = document.createElement('div'));
        el.className = 'maplibregl-ctrl maplibregl-ctrl-fps';
        el.style.backgroundColor = background;
        el.style.borderRadius = '6px';

        this.readOutput = document.createElement('div');
        this.readOutput.style.color = color;
        this.readOutput.style.fontFamily = font;
        this.readOutput.style.padding = '0 5px 5px';
        this.readOutput.style.fontSize = '9px';
        this.readOutput.style.fontWeight = 'bold';
        this.readOutput.textContent = 'Waiting:';

        this.canvas = document.createElement('canvas');
        this.canvas.className = 'maplibregl-ctrl-canvas';
        this.canvas.width = width;
        this.canvas.height = graphHeight;
        this.canvas.style.cssText = `width: ${width / dpr}px; height: ${graphHeight / dpr}px;`;

        el.appendChild(this.readOutput);
        el.appendChild(this.canvas);

        this.map.on('movestart', this.onMoveStart);
        this.map.on('moveend', this.onMoveEnd);
        return this.container;
    };

    onMoveStart = () => {
        this.frames = 0;
        this.time = performance.now();
        this.map.on('render', this.onRender);
    };

    onMoveEnd = () => {
        // moveend can arrive without a preceding movestart; there is no measurement to close then.
        if (this.time === null) {
            return;
        }

        const now = performance.now();
        this.updateGraph(this.getFPS(now));
        this.frames = 0;
        this.time = null;
        this.map.off('render', this.onRender);
    };

    onRender = () => {
        this.frames++;
        const now = performance.now();
        if (now >= this.time + 1000) {
            this.updateGraph(this.getFPS(now));
            this.frames = 0;
            this.time = now;
        }
    };

    getFPS = (now) => {
        const elapsed = now - this.time;
        // A zero or negative interval carries no information; do not add it to the averages.
        if (!(elapsed > 0)) {
            return 0;
        }

        this.totalTime += elapsed;
        this.totalFrames += this.frames;
        return Math.round((1000 * this.frames) / elapsed) || 0;
    };

    updateGraph = (fpsNow) => {
        const { barWidth, graphRight, graphTop, graphWidth, graphHeight, background, color } = this.options;

        const context = this.canvas.getContext('2d');
        const fps = this.totalTime > 0 ? Math.round((1000 * this.totalFrames) / this.totalTime) : 0;
        const rect = barWidth;

        context.fillStyle = background;
        context.globalAlpha = 1;
        context.fillRect(0, 0, graphWidth, graphTop);
        context.fillStyle = color;

        this.readOutput.textContent = `${fpsNow} FPS (${fps} Avg)`;
        context.drawImage(
            this.canvas,
            graphRight + rect,
            graphTop,
            graphWidth - rect,
            graphHeight,
            graphRight,
            graphTop,
            graphWidth - rect,
            graphHeight,
        );
        context.fillRect(graphRight + graphWidth - rect, graphTop, rect, graphHeight);
        context.fillStyle = background;
        context.globalAlpha = 0.75;
        context.fillRect(
            graphRight + graphWidth - rect,
            graphTop,
            rect,
            (1 - fpsNow / 100) * graphHeight,
        );
    };

    onRemove = () => {
        this.map.off('render', this.onRender);
        this.map.off('movestart', this.onMoveStart);
        this.map.off('moveend', this.onMoveEnd);
        this.container?.remove();
        this.frames = 0;
        this.time = null;
        this.map = null;
        return this;
    };
}
