import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { navItems } from "../../data/portfolio";

interface FlightPathProgressProps {
    activeSection: string;
    scrollToSection: (id: string) => void;
}

const RAIL_HEIGHT = 320;

/**
 * A GPS flight-track scroll indicator: dashed route down the right edge with
 * waypoint stops for each section and a position marker that tracks scroll.
 */
export const FlightPathProgress = ({ activeSection, scrollToSection }: FlightPathProgressProps) => {
    const { scrollYProgress } = useScroll();
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
    const markerY = useTransform(smoothProgress, [0, 1], [0, RAIL_HEIGHT]);
    const fillHeight = useTransform(smoothProgress, (v) => `${v * 100}%`);

    // Waypoints positioned by each section's real scroll offset
    const [stops, setStops] = useState<{ id: string; label: string; frac: number }[]>([]);

    useEffect(() => {
        const measure = () => {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollable <= 0) return;
            setStops(
                navItems.map((item) => {
                    const el = document.getElementById(item.id);
                    const frac = el ? Math.min(1, Math.max(0, (el.offsetTop - 100) / scrollable)) : 0;
                    return { id: item.id, label: item.label, frac };
                })
            );
        };
        // Measure after layout settles (images/fonts shift offsets)
        measure();
        const timeout = setTimeout(measure, 1500);
        window.addEventListener("resize", measure);
        return () => {
            clearTimeout(timeout);
            window.removeEventListener("resize", measure);
        };
    }, []);

    return (
        <nav
            aria-label="Section progress"
            className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center"
        >
            <span className="font-mono text-[8px] tracking-[0.25em] text-primary/50 uppercase mb-3 [writing-mode:vertical-rl]">
                Track
            </span>
            <div className="relative" style={{ height: RAIL_HEIGHT, width: 20 }}>
                {/* Dashed route (unflown) */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0 border-l border-dashed border-primary/25" />
                {/* Flown route */}
                <motion.div
                    className="absolute left-1/2 -translate-x-1/2 top-0 w-[2px] bg-gradient-to-b from-primary/80 to-primary rounded-full"
                    style={{ height: fillHeight }}
                />
                {/* Position marker */}
                <motion.div
                    className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
                    style={{ top: markerY }}
                >
                    <div className="w-3 h-3 rotate-45 border-2 border-primary bg-background shadow-[0_0_10px_rgba(18,194,133,0.7)]" />
                </motion.div>
                {/* Waypoints */}
                {stops.map((stop) => {
                    const isActive = activeSection === stop.id;
                    return (
                        <button
                            key={stop.id}
                            onClick={() => scrollToSection(stop.id)}
                            aria-label={`Fly to ${stop.label}`}
                            className="group absolute left-1/2 -translate-x-1/2 -translate-y-1/2 p-1.5"
                            style={{ top: stop.frac * RAIL_HEIGHT }}
                        >
                            <span
                                className={`block w-2 h-2 rounded-full border transition-all duration-300 ${isActive
                                    ? "bg-primary border-primary scale-125 shadow-[0_0_8px_rgba(18,194,133,0.8)]"
                                    : "bg-background border-primary/50 group-hover:border-primary group-hover:scale-110"
                                    }`}
                            />
                            <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-2 py-0.5 rounded bg-background/90 backdrop-blur-sm border border-primary/20 font-mono text-[9px] tracking-wider text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                WPT · {stop.label.toUpperCase()}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};
