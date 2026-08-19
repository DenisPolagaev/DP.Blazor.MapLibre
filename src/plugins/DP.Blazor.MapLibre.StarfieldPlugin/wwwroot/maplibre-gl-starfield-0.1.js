/**
 * MapLibreStarryBackground — starfield + atmospheric glow for MapLibre Globe.
 *
 * Upstream idea: https://github.com/markmclaren/maplibre-gl-starfield (MIT)
 * DP fork: Canvas stars, attribute-only glow, rAF coalescing, auto-pause when
 * the globe disk covers the viewport (typical mid/high zoom).
 */

class MapLibreStarryBackground {
  constructor(options = {}) {
    this.config = {
      starCount: options.starCount || 1500,
      glowIntensity: options.glowIntensity || 1.0,
      /**
       * Outer glow disk radius as a multiple of the globe radius.
       * Visible halo ≈ (extent − 1) × R beyond the limb (keep near 1.1).
       */
      glowExtent: options.glowExtent ?? 1.12,
      /** Soft white rim just outside the limb. */
      coronaExtent: options.coronaExtent ?? 1.02,
      glowColors: {
        inner: options.glowColors?.inner || "rgba(150, 200, 255, 0.7)",
        middle: options.glowColors?.middle || "rgba(100, 160, 255, 0.35)",
        outer: options.glowColors?.outer || "rgba(70, 130, 255, 0.12)",
        fade: options.glowColors?.fade || "rgba(40, 80, 220, 0)",
      },
      maxGlowBlurPx: options.maxGlowBlurPx ?? 10,
      /**
       * Pause only when the globe covers viewport corners (radius ≥ half-diagonal).
       */
      coverPauseFactor: options.coverPauseFactor ?? 1.0,
    };

    this.mapInstance = null;
    this.lastBearing = 0;
    this.lastPitch = 0;
    this.lastCenter = null;

    const uid = Math.random().toString(36).slice(2, 9);
    this.glowGradientId = `globe-glow-gradient-${uid}`;
    this.coronaGradientId = `globe-corona-gradient-${uid}`;

    this.containers = { starfield: null, glow: null };
    this.elements = {
      starCanvas: null,
      starCtx: null,
      glowSvg: null,
      glowCircle: null,
      coronaCircle: null,
    };

    /** @type {Float32Array|null} */
    this._sx = null;
    /** @type {Float32Array|null} */
    this._sy = null;
    /** @type {Float32Array|null} */
    this._sz = null;
    /** @type {Float32Array|null} */
    this._sr = null;
    /** @type {Float32Array|null} */
    this._sa = null;
    /** @type {string[]|null} */
    this._sc = null;

    this._width = 0;
    this._height = 0;
    this._dpr = 1;
    this._active = true;
    this._starsDirty = false;
    this._glowDirty = false;
    this._raf = 0;
    this._lastGlowRadius = -1;
    /** Last known globe radius used to cull stars under the Earth disk. */
    this._globeRadius = 0;
    this._globeCenterX = 0;
    this._globeCenterY = 0;
    this._handlers = null;
    this._attached = false;
  }

  /**
   * @param {string|HTMLElement} value
   * @returns {HTMLElement|null}
   */
  resolveContainer(value) {
    if (!value) {
      return null;
    }
    if (typeof value === "string") {
      return document.getElementById(value);
    }
    return value;
  }

  /**
   * @param {string|HTMLElement} starfieldContainer
   * @param {string|HTMLElement} glowContainer
   */
  setupContainers(starfieldContainer, glowContainer) {
    this.containers.starfield = this.resolveContainer(starfieldContainer);
    this.containers.glow = this.resolveContainer(glowContainer);

    if (!this.containers.starfield || !this.containers.glow) {
      console.error("Starfield or glow container not found");
      return false;
    }

    for (const el of [this.containers.starfield, this.containers.glow]) {
      el.style.position = "absolute";
      el.style.top = "0";
      el.style.left = "0";
      el.style.width = "100%";
      el.style.height = "100%";
      el.style.pointerEvents = "none";
      el.style.overflow = "hidden";
      el.style.contain = "strict";
    }

    this.containers.starfield.style.zIndex = "1";
    this.containers.glow.style.zIndex = "2";
    return true;
  }

  /**
   * @param {string} type
   * @param {Record<string, string|number>} attributes
   * @param {string} [ns]
   */
  createSvgElement(type, attributes = {}, ns = "http://www.w3.org/2000/svg") {
    const element = document.createElementNS(ns, type);
    for (const [key, value] of Object.entries(attributes)) {
      element.setAttribute(key, String(value));
    }
    return element;
  }

  createStarfield() {
    if (!this.containers.starfield) {
      return;
    }

    this.containers.starfield.innerHTML = "";
    this.elements.starCanvas = null;
    this.elements.starCtx = null;
    this._sx = this._sy = this._sz = this._sr = this._sa = null;
    this._sc = null;

    const width = this.containers.starfield.clientWidth;
    const height = this.containers.starfield.clientHeight;
    if (width <= 0 || height <= 0) {
      this._width = 0;
      this._height = 0;
      return;
    }

    this._width = width;
    this._height = height;
    this._dpr = Math.min(window.devicePixelRatio || 1, 2);

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.floor(width * this._dpr));
    canvas.height = Math.max(1, Math.floor(height * this._dpr));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.style.display = "block";
    canvas.setAttribute("aria-hidden", "true");

    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) {
      return;
    }

    this.containers.starfield.appendChild(canvas);
    this.elements.starCanvas = canvas;
    this.elements.starCtx = ctx;

    const n = Math.max(0, this.config.starCount | 0);
    this._sx = new Float32Array(n);
    this._sy = new Float32Array(n);
    this._sz = new Float32Array(n);
    this._sr = new Float32Array(n);
    this._sa = new Float32Array(n);
    this._sc = new Array(n);

    for (let i = 0; i < n; i++) {
      const z = Math.random() * 50;
      this._sx[i] = Math.random() * width;
      this._sy[i] = Math.random() * height;
      this._sz[i] = z;
      this._sr[i] = Math.random() * 2 + 0.5;
      this._sa[i] = 0.4 + (z / 50) * 0.6;
      const brightness = Math.random() * 0.6 + 0.4;
      this._sc[i] = this._hslToRgb(0.6, 0.2, brightness);
    }

    this._starsDirty = true;
    this.drawStars();
  }

  /** @param {number} h @param {number} s @param {number} l */
  _hslToRgb(h, s, l) {
    let r;
    let g;
    let b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        let tt = t;
        if (tt < 0) tt += 1;
        if (tt > 1) tt -= 1;
        if (tt < 1 / 6) return p + (q - p) * 6 * tt;
        if (tt < 1 / 2) return q;
        if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - s * l;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return `rgb(${(r * 255) | 0},${(g * 255) | 0},${(b * 255) | 0})`;
  }

  drawStars() {
    const ctx = this.elements.starCtx;
    const canvas = this.elements.starCanvas;
    if (!ctx || !canvas || !this._sx) {
      return;
    }

    const width = this._width;
    const height = this._height;
    const dpr = this._dpr;
    const n = this._sx.length;
    const cx = this._globeCenterX || width * 0.5;
    const cy = this._globeCenterY || height * 0.5;
    // Cull under the globe disk (slightly inset so limb stars still show).
    const cullR = Math.max(0, this._globeRadius * 0.98);
    const cullR2 = cullR * cullR;
    const cull = cullR2 > 16;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Tiny squares are far cheaper than arc() and look fine as stars.
    for (let i = 0; i < n; i++) {
      const x = this._sx[i];
      const y = this._sy[i];
      if (cull) {
        const dx = x - cx;
        const dy = y - cy;
        if (dx * dx + dy * dy < cullR2) {
          continue;
        }
      }
      const size = this._sr[i];
      ctx.globalAlpha = this._sa[i];
      ctx.fillStyle = this._sc[i];
      ctx.fillRect(x, y, size, size);
    }

    ctx.globalAlpha = 1;
    this._starsDirty = false;
  }

  createGlobeGlow() {
    if (!this.containers.glow) {
      return;
    }

    this.containers.glow.innerHTML = "";
    this.elements.glowSvg = null;
    this.elements.glowCircle = null;
    this.elements.coronaCircle = null;
    this._lastGlowRadius = -1;

    const width = this.containers.glow.clientWidth;
    const height = this.containers.glow.clientHeight;
    if (width <= 0 || height <= 0) {
      return;
    }

    const svg = this.createSvgElement("svg", {
      width,
      height,
      viewBox: `0 0 ${width} ${height}`,
    });
    svg.style.backgroundColor = "transparent";
    svg.style.overflow = "visible";
    this.containers.glow.appendChild(svg);
    this.elements.glowSvg = svg;

    const defs = this.createSvgElement("defs");
    svg.appendChild(defs);
    this.updateGlowGradient(defs);

    const coronaGrad = this.createSvgElement("radialGradient", {
      id: this.coronaGradientId,
      cx: "50%",
      cy: "50%",
      r: "50%",
      fx: "50%",
      fy: "50%",
    });
    for (const stop of [
      { offset: "0%", color: "#FFFFFF", opacity: "0" },
      { offset: "88%", color: "#FFFFFF", opacity: "0" },
      { offset: "94%", color: "#FFFFE0", opacity: "0.55" },
      { offset: "100%", color: "#FFFFFF", opacity: "0" },
    ]) {
      coronaGrad.appendChild(
        this.createSvgElement("stop", {
          offset: stop.offset,
          "stop-color": stop.color,
          "stop-opacity": stop.opacity,
        })
      );
    }
    defs.appendChild(coronaGrad);

    let initialRadius = 200;
    let initialCx = width / 2;
    let initialCy = height / 2;
    if (this.mapInstance) {
      const globe = this.resolveGlobeScreen(this.mapInstance);
      initialRadius = globe.radius;
      initialCx = globe.cx;
      initialCy = globe.cy;
    } else {
      initialRadius = Math.min(width, height) * 0.35;
    }

    const extent = Math.max(1.02, this.config.glowExtent);
    const coronaExtent = Math.max(1.005, this.config.coronaExtent);

    const corona = this.createSvgElement("circle", {
      class: "corona-ring",
      cx: initialCx,
      cy: initialCy,
      r: initialRadius * coronaExtent,
      fill: `url(#${this.coronaGradientId})`,
    });
    corona.style.mixBlendMode = "screen";
    svg.appendChild(corona);
    this.elements.coronaCircle = corona;

    // Filled disk sized to the globe — gradient puts color only near the limb.
    const glowCircle = this.createSvgElement("circle", {
      class: "globe-glow",
      cx: initialCx,
      cy: initialCy,
      r: initialRadius * extent,
      fill: `url(#${this.glowGradientId})`,
    });
    glowCircle.style.mixBlendMode = "screen";
    svg.appendChild(glowCircle);
    this.elements.glowCircle = glowCircle;

    this.applyGlowGeometry(width, height, initialRadius, initialCx, initialCy);
  }

  /** @param {SVGDefsElement} defs */
  updateGlowGradient(defs) {
    defs.querySelector(`#${this.glowGradientId}`)?.remove();

    const colors = this.config.glowColors;
    const extent = Math.max(1.02, this.config.glowExtent);
    // Limb is at R / (extent·R) of the disk — concentrate color there.
    const limbPct = Math.min(94, Math.max(55, 100 / extent));
    const preLimb = Math.max(0, limbPct - 8);
    const mid = Math.min(98, limbPct + 2);

    const gradient = this.createSvgElement("radialGradient", {
      id: this.glowGradientId,
      cx: "50%",
      cy: "50%",
      r: "50%",
    });

    for (const stop of [
      { offset: "0%", color: colors.fade },
      { offset: `${preLimb.toFixed(1)}%`, color: colors.fade },
      { offset: `${limbPct.toFixed(1)}%`, color: colors.inner },
      { offset: `${mid.toFixed(1)}%`, color: colors.middle },
      { offset: "100%", color: colors.fade },
    ]) {
      gradient.appendChild(
        this.createSvgElement("stop", {
          offset: stop.offset,
          "stop-color": stop.color,
        })
      );
    }
    defs.appendChild(gradient);
  }

  /**
   * Mutate star positions in typed arrays only (no DOM). Invisible when paused.
   * @param {number} bearingDelta
   * @param {number} pitchDelta
   * @param {number} lngDelta
   * @param {number} [latDelta=0]
   */
  updateStarPositions(bearingDelta, pitchDelta, lngDelta, latDelta = 0) {
    if (!this._active || !this._sx || this._sx.length === 0) {
      return;
    }

    const width = this._width;
    const height = this._height;
    if (width <= 0 || height <= 0) {
      return;
    }

    // Skip near-zero camera deltas (float noise / no-op frames).
    if (
      Math.abs(bearingDelta) < 1e-6
      && Math.abs(pitchDelta) < 1e-6
      && Math.abs(lngDelta) < 1e-8
      && Math.abs(latDelta) < 1e-8
    ) {
      return;
    }

    const bearingFactor = 2.5;
    const pitchFactor = 2.5;
    const lngFactor = 8.0;
    const latFactor = 8.0;
    const bx = bearingDelta * bearingFactor + lngDelta * lngFactor;
    const by = pitchDelta * pitchFactor - latDelta * latFactor;

    const sx = this._sx;
    const sy = this._sy;
    const sz = this._sz;
    const n = sx.length;

    for (let i = 0; i < n; i++) {
      const depth = 0.35 + (sz[i] / 50) * 0.9;
      let x = (sx[i] + bx * depth) % width;
      let y = (sy[i] + by * depth) % height;
      if (x < 0) x += width;
      if (y < 0) y += height;
      sx[i] = x;
      sy[i] = y;
    }

    this._starsDirty = true;
  }

  /**
   * Logical globe radius used by MapLibre pan/zoom math (NOT the 2D silhouette).
   * Kept as fallback only — perspective makes the on-screen disk smaller.
   * @param {number} worldSize
   * @param {number} latitudeDegrees
   */
  getGlobeRadiusPixels(worldSize, latitudeDegrees) {
    const cosLat = Math.cos((latitudeDegrees * Math.PI) / 180);
    const safeCos = Math.max(0.2, Math.abs(cosLat));
    return worldSize / (2.0 * Math.PI) / safeCos;
  }

  /** @param {object} map */
  resolveTransform(map) {
    try {
      let transform = null;
      if (typeof map._getTransformForUpdate === "function") {
        transform = map._getTransformForUpdate();
      }
      if (!transform && map.transform) {
        transform = map.transform;
      }
      if (!transform) {
        return null;
      }

      const worldSize =
        transform.worldSize
        ?? (typeof transform.getWorldSize === "function"
          ? transform.getWorldSize()
          : null);
      const center = transform.center ?? transform._center;
      const lat = center?.lat ?? map.getCenter?.()?.lat;
      if (worldSize == null || lat == null || !Number.isFinite(worldSize)) {
        return null;
      }

      return { worldSize, lat };
    } catch {
      return null;
    }
  }

  /**
   * MapLibre unproject of off-globe pixels snaps to the horizon, so
   * project(unproject(p)) diverges from p. Use that to find the silhouette.
   * @param {object} map
   * @param {number} mapX
   * @param {number} mapY
   */
  isScreenPointOnGlobe(map, mapX, mapY) {
    try {
      const ll = map.unproject([mapX, mapY]);
      const p = map.project(ll);
      const dx = p.x - mapX;
      const dy = p.y - mapY;
      return dx * dx + dy * dy < 4; // ~2px
    } catch {
      return false;
    }
  }

  /**
   * Measure the visible globe disk in glow-container CSS pixels.
   * This matches what the user sees (perspective), unlike getGlobeRadiusPixels.
   *
   * `project(getCenter())` is the look-at *surface* point, not the silhouette
   * centroid. Pitching (Ctrl+drag) orbits the camera around that point, so the
   * Earth disk slides on screen while the look-at stays put. Searching only +X/+Y
   * from there also inflates the radius (a long downward chord). Measure all four
   * limbs and take the midpoint.
   *
   * @param {object} map
   * @returns {{ cx: number, cy: number, radius: number }|null}
   */
  measureGlobeScreen(map) {
    if (!map || !this.containers.glow) {
      return null;
    }

    const glowEl = this.containers.glow;
    const mapEl = map.getContainer?.();
    if (!mapEl) {
      return null;
    }

    const gr = glowEl.getBoundingClientRect();
    const mr = mapEl.getBoundingClientRect();
    if (gr.width <= 0 || gr.height <= 0 || mr.width <= 0 || mr.height <= 0) {
      return null;
    }

    const ox = mr.left - gr.left;
    const oy = mr.top - gr.top;

    let center;
    try {
      center = map.project(map.getCenter());
    } catch {
      return null;
    }

    const originX = center.x;
    const originY = center.y;

    if (!this.isScreenPointOnGlobe(map, originX, originY)) {
      return null;
    }

    const maxR = Math.hypot(gr.width, gr.height);
    const searchFrom = (fromX, fromY, dx, dy) => {
      let lo = 0;
      let hi = maxR;
      for (let i = 0; i < 22; i++) {
        const mid = (lo + hi) * 0.5;
        const on = this.isScreenPointOnGlobe(
          map,
          fromX + dx * mid,
          fromY + dy * mid
        );
        if (on) {
          lo = mid;
        } else {
          hi = mid;
        }
      }
      return lo;
    };

    const rRight = searchFrom(originX, originY, 1, 0);
    const rLeft = searchFrom(originX, originY, -1, 0);
    const rDown = searchFrom(originX, originY, 0, 1);
    const rUp = searchFrom(originX, originY, 0, -1);

    const mapCx = originX + (rRight - rLeft) * 0.5;
    const mapCy = originY + (rDown - rUp) * 0.5;

    // Left/right from the look-at point are chords when pitch offsets the disk.
    // Re-measure the horizontal axis at the silhouette center.
    let rx;
    let ry = (rUp + rDown) * 0.5;
    if (this.isScreenPointOnGlobe(map, mapCx, mapCy)) {
      rx =
        (searchFrom(mapCx, mapCy, 1, 0) + searchFrom(mapCx, mapCy, -1, 0)) * 0.5;
      ry =
        (searchFrom(mapCx, mapCy, 0, 1) + searchFrom(mapCx, mapCy, 0, -1)) * 0.5;
    } else {
      rx = (rLeft + rRight) * 0.5;
    }

    const radius = (rx + ry) * 0.5;
    if (!Number.isFinite(radius) || radius < 2) {
      return null;
    }

    return { cx: mapCx + ox, cy: mapCy + oy, radius };
  }

  /**
   * @param {object} map
   * @returns {{ cx: number, cy: number, radius: number }}
   */
  resolveGlobeScreen(map) {
    const measured = this.measureGlobeScreen(map);
    if (measured) {
      return measured;
    }

    const width = this.containers.glow?.clientWidth || this._width || 800;
    const height = this.containers.glow?.clientHeight || this._height || 600;
    const cx = width * 0.5;
    const cy = height * 0.5;

    const resolved = this.resolveTransform(map);
    if (resolved) {
      // Fallback overestimates under perspective — shrink so we don't draw a
      // detached ring if measurement fails (e.g. during style reload).
      const logical = this.getGlobeRadiusPixels(resolved.worldSize, resolved.lat);
      return { cx, cy, radius: Math.max(1, logical * 0.55) };
    }

    const zoom = typeof map.getZoom === "function" ? map.getZoom() : 1;
    const viewportSize = Math.min(width, height);
    return {
      cx,
      cy,
      radius: Math.max(1, viewportSize * 0.35 * Math.pow(2, zoom - 1)),
    };
  }

  /** @param {object} map */
  calculateGlowRadius(map) {
    return this.resolveGlobeScreen(map).radius;
  }

  /**
   * True while space/limb can show (globe has not covered the corners).
   * @param {number} width
   * @param {number} height
   * @param {number} globeRadius
   */
  isBackdropNeeded(width, height, globeRadius) {
    if (width <= 0 || height <= 0 || !Number.isFinite(globeRadius)) {
      return false;
    }
    const halfDiag = Math.hypot(width * 0.5, height * 0.5);
    return globeRadius < halfDiag * this.config.coverPauseFactor;
  }

  /**
   * @param {boolean} active
   */
  setActive(active) {
    if (this._active === active) {
      return;
    }
    this._active = active;

    const visibility = active ? "visible" : "hidden";
    if (this.containers.starfield) {
      this.containers.starfield.style.visibility = visibility;
    }
    if (this.containers.glow) {
      this.containers.glow.style.visibility = visibility;
    }

    // Drop expensive SVG filters while paused (huge blur radii were the jank).
    if (!active) {
      if (this.elements.glowCircle) {
        this.elements.glowCircle.style.filter = "none";
      }
      if (this.elements.coronaCircle) {
        this.elements.coronaCircle.style.filter = "none";
      }
    } else {
      this._glowDirty = true;
      this._starsDirty = true;
    }
  }

  /**
   * @param {number} width
   * @param {number} height
   * @param {number} baseRadius
   * @param {number} [cx]
   * @param {number} [cy]
   */
  applyGlowGeometry(width, height, baseRadius, cx, cy) {
    const centerX = cx ?? width / 2;
    const centerY = cy ?? height / 2;
    const extent = Math.max(1.02, this.config.glowExtent);
    const coronaExtent = Math.max(1.005, this.config.coronaExtent);
    const haloPx = Math.max(2, baseRadius * (extent - 1));
    const blurPx = Math.min(
      this.config.maxGlowBlurPx,
      Math.max(1.5, haloPx * 0.35)
    );
    const coronaBlur = Math.min(4, Math.max(0.5, baseRadius * 0.006));

    if (this.elements.glowSvg) {
      this.elements.glowSvg.setAttribute("width", String(width));
      this.elements.glowSvg.setAttribute("height", String(height));
      this.elements.glowSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    }

    if (this.elements.glowCircle) {
      this.elements.glowCircle.setAttribute("cx", String(centerX));
      this.elements.glowCircle.setAttribute("cy", String(centerY));
      this.elements.glowCircle.setAttribute("r", String(baseRadius * extent));
      this.elements.glowCircle.setAttribute("fill", `url(#${this.glowGradientId})`);
      this.elements.glowCircle.removeAttribute("stroke");
      this.elements.glowCircle.removeAttribute("stroke-width");
      this.elements.glowCircle.style.filter =
        blurPx > 0.5 ? `blur(${blurPx}px)` : "none";
      this.elements.glowCircle.style.opacity = String(this.config.glowIntensity);
    }

    if (this.elements.coronaCircle) {
      this.elements.coronaCircle.setAttribute("cx", String(centerX));
      this.elements.coronaCircle.setAttribute("cy", String(centerY));
      this.elements.coronaCircle.setAttribute("r", String(baseRadius * coronaExtent));
      this.elements.coronaCircle.style.filter =
        coronaBlur > 0.5 ? `blur(${coronaBlur}px)` : "none";
    }

    this._lastGlowRadius = baseRadius;
    this._globeRadius = baseRadius;
    this._globeCenterX = centerX;
    this._globeCenterY = centerY;
    this._glowDirty = false;
    this._starsDirty = true;
  }

  /** @param {object} map */
  updateGlobeGlow(map) {
    if (!map || !this.containers.glow) {
      return;
    }

    const width = this.containers.glow.clientWidth;
    const height = this.containers.glow.clientHeight;
    if (width <= 0 || height <= 0) {
      return;
    }

    const globe = this.resolveGlobeScreen(map);
    const needed = this.isBackdropNeeded(width, height, globe.radius);
    this.setActive(needed);

    if (!needed) {
      return;
    }

    if (
      Math.abs(globe.radius - this._lastGlowRadius) < 0.5
      && Math.abs(globe.cx - (this._globeCenterX ?? globe.cx)) < 0.5
      && Math.abs(globe.cy - (this._globeCenterY ?? globe.cy)) < 0.5
      && !this._glowDirty
    ) {
      return;
    }

    this.applyGlowGeometry(width, height, globe.radius, globe.cx, globe.cy);
  }

  scheduleFrame() {
    if (this._raf) {
      return;
    }
    this._raf = requestAnimationFrame(() => {
      this._raf = 0;
      this.flushFrame();
    });
  }

  flushFrame() {
    if (!this.mapInstance || !this._attached) {
      return;
    }

    // Always re-evaluate cover state (cheap); heavy work only while active.
    this.updateGlobeGlow(this.mapInstance);

    if (this._active && this._starsDirty) {
      this.drawStars();
    }
  }

  /** @param {object} map */
  handleResize(map) {
    if (!map) {
      return;
    }
    this.createStarfield();
    this.createGlobeGlow();
    this.updateGlobeGlow(map);
    if (this._active) {
      this.drawStars();
    }
  }

  /**
   * @param {object} map
   * @param {string|HTMLElement} starfieldContainer
   * @param {string|HTMLElement} glowContainer
   */
  attachToMap(map, starfieldContainer, glowContainer) {
    if (!map) {
      console.error("MapLibre map instance is required");
      return;
    }

    this.detach();
    this.mapInstance = map;

    if (!this.setupContainers(starfieldContainer, glowContainer)) {
      return;
    }

    const canvas = map.getCanvas();
    if (canvas) {
      canvas.style.background = "transparent";
    }
    const canvasContainer = map.getCanvasContainer?.();
    if (canvasContainer) {
      canvasContainer.style.background = "transparent";
    }

    this.createStarfield();
    this.createGlobeGlow();

    this.lastCenter = map.getCenter();
    this.lastBearing = map.getBearing();
    this.lastPitch = map.getPitch();

    const onMove = () => {
      const currentBearing = map.getBearing();
      const currentPitch = map.getPitch();
      const currentCenter = map.getCenter();

      const bearingDelta = currentBearing - this.lastBearing;
      const pitchDelta = currentPitch - this.lastPitch;
      const lngDelta = currentCenter.lng - this.lastCenter.lng;
      const latDelta = currentCenter.lat - this.lastCenter.lat;

      this.lastBearing = currentBearing;
      this.lastPitch = currentPitch;
      this.lastCenter = currentCenter;

      // While covered, only schedule a cheap cover check — no star math.
      if (this._active) {
        this.updateStarPositions(bearingDelta, pitchDelta, lngDelta, latDelta);
      }

      this._glowDirty = true;
      this.scheduleFrame();
    };

    const onZoom = () => {
      this._glowDirty = true;
      this.scheduleFrame();
    };

    // idle: one final sync after interaction settles (catch missed frames)
    const onIdle = () => {
      this._glowDirty = true;
      this.scheduleFrame();
    };

    const onResize = () => this.handleResize(map);
    const onStyleLoad = () => {
      setTimeout(() => this.handleResize(map), 100);
    };

    map.on("move", onMove);
    map.on("zoom", onZoom);
    map.on("idle", onIdle);
    map.on("style.load", onStyleLoad);
    window.addEventListener("resize", onResize);

    this._handlers = { onMove, onZoom, onIdle, onResize, onStyleLoad };
    this._attached = true;

    const ensureSized = () => {
      if (!this._attached) {
        return;
      }
      const w = this.containers.starfield?.clientWidth || 0;
      const h = this.containers.starfield?.clientHeight || 0;
      if (w > 0 && h > 0) {
        if (
          !this.elements.starCanvas
          || this._width !== w
          || this._height !== h
        ) {
          this.handleResize(map);
        } else {
          this.updateGlobeGlow(map);
        }
        return;
      }
      requestAnimationFrame(ensureSized);
    };
    requestAnimationFrame(ensureSized);
    setTimeout(() => {
      if (this._attached) {
        this.handleResize(map);
      }
    }, 200);
  }

  detach() {
    if (this._raf) {
      cancelAnimationFrame(this._raf);
      this._raf = 0;
    }

    if (this.mapInstance && this._handlers) {
      const map = this.mapInstance;
      const { onMove, onZoom, onIdle, onResize, onStyleLoad } = this._handlers;
      map.off("move", onMove);
      map.off("zoom", onZoom);
      map.off("idle", onIdle);
      map.off("style.load", onStyleLoad);
      window.removeEventListener("resize", onResize);
    }

    this._handlers = null;
    this._attached = false;
    this.mapInstance = null;
    this._sx = this._sy = this._sz = this._sr = this._sa = null;
    this._sc = null;
    this.elements = {
      starCanvas: null,
      starCtx: null,
      glowSvg: null,
      glowCircle: null,
      coronaCircle: null,
    };
    this._active = true;
    this._lastGlowRadius = -1;
    this._globeCenterX = 0;
    this._globeCenterY = 0;

    if (this.containers.starfield) {
      this.containers.starfield.style.visibility = "";
      this.containers.starfield.innerHTML = "";
    }
    if (this.containers.glow) {
      this.containers.glow.style.visibility = "";
      this.containers.glow.innerHTML = "";
    }
  }

  /** @param {object} options */
  updateConfig(options = {}) {
    if (options.glowIntensity !== undefined) {
      this.config.glowIntensity = options.glowIntensity;
      if (this.elements.glowCircle) {
        this.elements.glowCircle.style.opacity = String(this.config.glowIntensity);
      }
    }

    if (options.glowExtent !== undefined) {
      this.config.glowExtent = options.glowExtent;
      if (this.elements.glowSvg) {
        const defs = this.elements.glowSvg.querySelector("defs");
        if (defs) {
          this.updateGlowGradient(defs);
        }
      }
      this._glowDirty = true;
    }

    if (options.coronaExtent !== undefined) {
      this.config.coronaExtent = options.coronaExtent;
      this._glowDirty = true;
    }

    if (options.glowColors) {
      this.config.glowColors = {
        ...this.config.glowColors,
        ...options.glowColors,
      };
      if (this.elements.glowSvg) {
        const defs = this.elements.glowSvg.querySelector("defs");
        if (defs) {
          this.updateGlowGradient(defs);
        }
      }
    }

    if (options.maxGlowBlurPx !== undefined) {
      this.config.maxGlowBlurPx = options.maxGlowBlurPx;
      this._glowDirty = true;
    }

    if (options.coverPauseFactor !== undefined) {
      this.config.coverPauseFactor = options.coverPauseFactor;
      this._glowDirty = true;
    }

    if (
      options.starCount !== undefined
      && options.starCount !== this.config.starCount
    ) {
      this.config.starCount = options.starCount;
      this.createStarfield();
    }

    if (this.mapInstance) {
      this.scheduleFrame();
    }
  }
}

export { MapLibreStarryBackground };
