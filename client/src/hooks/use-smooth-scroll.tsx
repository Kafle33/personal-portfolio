import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import Lenis from "lenis";

interface SmoothScrollContextValue {
    lenis: Lenis | null;
    scrollTo: (target: string | number, offset?: number) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
    lenis: null,
    scrollTo: () => { },
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

/**
 * Wraps the app with a Lenis smooth-scroll instance.
 * Disabled automatically for users who prefer reduced motion —
 * scrollTo falls back to native window.scrollTo in that case.
 */
export const SmoothScrollProvider = ({ children }: { children: ReactNode }) => {
    const [lenis, setLenis] = useState<Lenis | null>(null);
    const rafRef = useRef<number>();

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReducedMotion) return;

        const instance = new Lenis({
            duration: 1.1,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 1.5,
        });

        const raf = (time: number) => {
            instance.raf(time);
            rafRef.current = requestAnimationFrame(raf);
        };
        rafRef.current = requestAnimationFrame(raf);
        setLenis(instance);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            instance.destroy();
            setLenis(null);
        };
    }, []);

    const scrollTo = (target: string | number, offset = -72) => {
        if (lenis) {
            lenis.scrollTo(target, { offset, duration: 1.4 });
        } else {
            const top = typeof target === "number"
                ? target
                : (document.querySelector(target) as HTMLElement | null)?.offsetTop ?? 0;
            window.scrollTo({ top: top + offset, behavior: "smooth" });
        }
    };

    return (
        <SmoothScrollContext.Provider value={{ lenis, scrollTo }}>
            {children}
        </SmoothScrollContext.Provider>
    );
};
