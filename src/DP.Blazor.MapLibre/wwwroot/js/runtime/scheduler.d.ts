export type FrameRequest = (callback: (now: number) => void) => number;
export type FrameCancel = (handle: number) => void;
export interface Scheduler {
    markDirty(key: string, flush: (now: number) => void): void;
    setAnimation(key: string, tick: ((now: number) => boolean) | null): void;
    flushNow(now: number): void;
    dispose(): void;
}
export declare function createScheduler(requestFrame?: FrameRequest, cancelFrame?: FrameCancel): Scheduler;
//# sourceMappingURL=scheduler.d.ts.map