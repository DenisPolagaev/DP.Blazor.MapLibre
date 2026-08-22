export type FrameRequest = (callback: (now: number) => void) => number;
export type FrameCancel = (handle: number) => void;

export interface Scheduler {
    markDirty(key: string, flush: (now: number) => void): void;
    setAnimation(key: string, tick: ((now: number) => boolean) | null): void;
    flushNow(now: number): void;
    dispose(): void;
}

export function createScheduler(
    requestFrame: FrameRequest = (callback) => requestAnimationFrame(callback),
    cancelFrame: FrameCancel = (handle) => cancelAnimationFrame(handle),
): Scheduler {
    const flushes = new Map<string, (now: number) => void>();
    const animations = new Map<string, (now: number) => boolean>();
    let frameHandle: number | null = null;
    let disposed = false;

    function schedule(): void {
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

    function runFrame(now: number): void {
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
