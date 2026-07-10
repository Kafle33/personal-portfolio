import { useMemo } from "react";

export type PerformanceTier = "high" | "low";

/**
 * Decides whether heavy visuals (WebGL scenes, continuous canvases) should render.
 * "low" ⇒ show static fallbacks. Checked once — these signals don't change mid-session.
 */
export const getPerformanceTier = (): PerformanceTier => {
    if (typeof window === "undefined") return "low";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "low";

    const cores = navigator.hardwareConcurrency ?? 4;
    const memory = (navigator as any).deviceMemory as number | undefined;
    if (cores <= 2 || (memory !== undefined && memory <= 2)) return "low";

    try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
        if (!gl) return "low";
    } catch {
        return "low";
    }

    return "high";
};

export const usePerformanceTier = (): PerformanceTier =>
    useMemo(getPerformanceTier, []);

export const useIsTouchDevice = (): boolean =>
    useMemo(
        () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches,
        []
    );
