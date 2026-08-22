export function createScheduler(requestFrame = (callback) => requestAnimationFrame(callback), cancelFrame = (handle) => cancelAnimationFrame(handle)) {
    const flushes = new Map();
    const animations = new Map();
    let frameHandle = null;
    let disposed = false;
    function schedule() {
        if (frameHandle !== null || disposed) {
            return;
        }
        frameHandle = requestFrame((now) => {
            runFrame(now);
            frameHandle = null;
            if (animations.size > 0 || flushes.size > 0) {
                schedule();
            }
        });
    }
    function runFrame(now) {
        for (const [key, tick] of animations) {
            if (!tick(now)) {
                animations.delete(key);
            }
        }
        const pending = [...flushes.values()];
        flushes.clear();
        for (const flush of pending) {
            flush(now);
        }
    }
    return {
        markDirty(key, flush) {
            if (disposed) {
                return;
            }
            flushes.set(key, flush);
            schedule();
        },
        setAnimation(key, tick) {
            if (disposed) {
                return;
            }
            if (tick === null) {
                animations.delete(key);
                return;
            }
            animations.set(key, tick);
            schedule();
        },
        flushNow(now) {
            runFrame(now);
        },
        dispose() {
            disposed = true;
            if (frameHandle !== null) {
                cancelFrame(frameHandle);
                frameHandle = null;
            }
            flushes.clear();
            animations.clear();
        },
    };
}
//# sourceMappingURL=scheduler.js.map