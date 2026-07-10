import { useEffect, useRef, RefObject } from "react";

interface CrosshairOverlayProps {
    /** The section element the crosshair lives inside */
    containerRef: RefObject<HTMLElement>;
    /** Center of the fake coordinate space */
    baseLat?: number;
    baseLng?: number;
}

/**
 * GIS-software style crosshair: two hairlines tracking the cursor with a live
 * coordinate readout, scoped to the hero section. Pointer-fine devices only.
 * Uses refs + rAF (no React state) so mousemove costs nothing per frame.
 */
export const CrosshairOverlay = ({
    containerRef,
    baseLat = 28.2096,
    baseLng = 83.9856,
}: CrosshairOverlayProps) => {
    const hLineRef = useRef<HTMLDivElement>(null);
    const vLineRef = useRef<HTMLDivElement>(null);
    const readoutRef = useRef<HTMLDivElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const root = rootRef.current;
        if (!container || !root) return;
        if (!window.matchMedia("(pointer: fine)").matches) return;

        let raf = 0;
        let targetX = -1;
        let targetY = -1;

        const render = () => {
            raf = 0;
            const rect = container.getBoundingClientRect();
            const x = targetX;
            const y = targetY;
            if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
                root.style.opacity = "0";
                return;
            }
            root.style.opacity = "1";
            if (hLineRef.current) hLineRef.current.style.transform = `translateY(${y}px)`;
            if (vLineRef.current) vLineRef.current.style.transform = `translateX(${x}px)`;
            if (readoutRef.current) {
                const lat = baseLat + (0.5 - y / rect.height) * 0.18;
                const lng = baseLng + (x / rect.width - 0.5) * 0.32;
                readoutRef.current.textContent = `${lat.toFixed(4)}° N  ${lng.toFixed(4)}° E`;
                const flipX = x > rect.width - 190;
                const flipY = y < 40;
                readoutRef.current.style.transform =
                    `translate(${x + (flipX ? -178 : 14)}px, ${y + (flipY ? 16 : -30)}px)`;
            }
        };

        const onMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            targetX = e.clientX - rect.left;
            targetY = e.clientY - rect.top;
            if (!raf) raf = requestAnimationFrame(render);
        };
        const onLeave = () => {
            targetX = -1;
            targetY = -1;
            if (!raf) raf = requestAnimationFrame(render);
        };

        container.addEventListener("mousemove", onMove);
        container.addEventListener("mouseleave", onLeave);
        return () => {
            container.removeEventListener("mousemove", onMove);
            container.removeEventListener("mouseleave", onLeave);
            if (raf) cancelAnimationFrame(raf);
        };
    }, [containerRef, baseLat, baseLng]);

    return (
        <div
            ref={rootRef}
            className="absolute inset-0 pointer-events-none z-[5] opacity-0 transition-opacity duration-300 hidden md:block"
            aria-hidden
        >
            <div
                ref={hLineRef}
                className="absolute left-0 right-0 top-0 h-px bg-primary/20"
            />
            <div
                ref={vLineRef}
                className="absolute top-0 bottom-0 left-0 w-px bg-primary/20"
            />
            <div
                ref={readoutRef}
                className="absolute top-0 left-0 font-mono text-[10px] tracking-wider text-primary/80 bg-background/70 backdrop-blur-sm px-2 py-0.5 rounded border border-primary/20 whitespace-nowrap"
            />
        </div>
    );
};
