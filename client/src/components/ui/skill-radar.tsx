import { motion, useReducedMotion } from "framer-motion";
import { skillsData } from "../../data/portfolio";
import { easing, viewportOnce } from "../../lib/animations";

/** Blip placement: one per skill category, spread around the scope */
const BLIP_POSITIONS = [
    { angle: 305, radius: 0.52 },
    { angle: 20, radius: 0.72 },
    { angle: 92, radius: 0.6 },
    { angle: 165, radius: 0.78 },
    { angle: 232, radius: 0.45 },
];

/**
 * A radar scope that "detects" each skill category as a blip.
 * Pure CSS/SVG — the sweep is a rotating conic gradient, ~zero GPU cost.
 */
export const SkillRadar = () => {
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, ease: easing.smooth }}
            className="relative w-56 h-56 sm:w-64 sm:h-64 mx-auto select-none"
            aria-hidden
        >
            {/* Rings */}
            {[1, 0.66, 0.33].map((r) => (
                <div
                    key={r}
                    className="absolute rounded-full border border-primary/25"
                    style={{
                        inset: `${((1 - r) / 2) * 100}%`,
                    }}
                />
            ))}
            {/* Crosshair axes */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary/15" />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-primary/15" />

            {/* Sweep */}
            {!shouldReduceMotion && (
                <div
                    className="absolute inset-0 rounded-full overflow-hidden"
                    style={{ animation: "radar-sweep 6s linear infinite" }}
                >
                    <div
                        className="absolute inset-0 rounded-full"
                        style={{
                            background:
                                "conic-gradient(from 0deg, rgba(18,194,133,0.35) 0deg, rgba(18,194,133,0.08) 55deg, transparent 90deg)",
                        }}
                    />
                </div>
            )}

            {/* Blips */}
            {skillsData.map((category, i) => {
                const pos = BLIP_POSITIONS[i % BLIP_POSITIONS.length];
                const rad = (pos.angle * Math.PI) / 180;
                const x = 50 + Math.cos(rad) * pos.radius * 50;
                const y = 50 + Math.sin(rad) * pos.radius * 50;
                return (
                    <motion.div
                        key={category.category}
                        className="absolute -translate-x-1/2 -translate-y-1/2 group/blip"
                        style={{ left: `${x}%`, top: `${y}%` }}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={viewportOnce}
                        transition={{ duration: 0.4, ease: easing.bounce, delay: 0.4 + i * 0.35 }}
                    >
                        <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(18,194,133,0.9)]" />
                        <div className="absolute inset-0 w-2 h-2 rounded-full bg-primary/50 animate-ping motion-reduce:animate-none" style={{ animationDuration: "2.5s" }} />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[8px] tracking-wider text-primary/70 whitespace-nowrap">
                            {category.category.toUpperCase()}
                        </span>
                    </motion.div>
                );
            })}

            {/* Scope label */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-[0.3em] text-primary/50 uppercase whitespace-nowrap">
                Sensor sweep · 5 clusters
            </div>
        </motion.div>
    );
};
