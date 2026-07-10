import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { SectionHeader } from "../layout/SectionHeader";
import { experiencesData, PortfolioItem } from "../../data/portfolio";
import { PortfolioCard } from "../portfolio/PortfolioCard";
import { easing, viewportOnce } from "../../lib/animations";

interface ExperienceProps {
    onItemClick: (item: PortfolioItem) => void;
}

const formatCoord = (lat: number, lng: number) =>
    `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}  ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? "E" : "W"}`;

/**
 * Career as a GPS track: a route line draws down the section as you scroll,
 * with each role logged as a numbered survey waypoint.
 */
export const Experience = ({ onItemClick }: ExperienceProps) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: trackRef,
        offset: ["start 0.75", "end 0.55"],
    });
    const drawProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 26 });

    return (
        <section id="experience" className="py-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader
                    title="Professional Experience"
                    icon="fa-briefcase"
                    iconColor="text-primary"
                    subtitle="A survey log of the journey — every role a recorded waypoint."
                />

                <div ref={trackRef} className="relative">
                    {/* Route line: dashed base + scroll-drawn track */}
                    <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-0 border-l-2 border-dashed border-primary/20" aria-hidden />
                    <motion.div
                        className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 w-[3px] -ml-px bg-gradient-to-b from-primary/90 via-primary to-accent rounded-full origin-top"
                        style={{ scaleY: drawProgress, height: "100%" }}
                        aria-hidden
                    />

                    <div className="space-y-16">
                        {experiencesData.map((exp, index) => {
                            const side = index % 2 === 0 ? "md:pr-[calc(50%+2.5rem)]" : "md:pl-[calc(50%+2.5rem)]";
                            return (
                                <div key={exp.id} className="relative pl-12 md:pl-0">
                                    {/* Waypoint node */}
                                    <motion.div
                                        className="absolute left-4 md:left-1/2 top-2 -translate-x-1/2 z-10"
                                        initial={{ scale: 0, opacity: 0 }}
                                        whileInView={{ scale: 1, opacity: 1 }}
                                        viewport={viewportOnce}
                                        transition={{ duration: 0.45, ease: easing.bounce }}
                                    >
                                        <div className="relative">
                                            <div className="w-4 h-4 rotate-45 bg-background border-2 border-primary shadow-[0_0_12px_rgba(18,194,133,0.6)]" />
                                            <div className="absolute inset-0 w-4 h-4 rotate-45 border-2 border-primary/40 animate-ping motion-reduce:animate-none" />
                                        </div>
                                    </motion.div>

                                    <div className={side}>
                                        {/* Survey-log header */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 12 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={viewportOnce}
                                            transition={{ duration: 0.5, ease: easing.smooth }}
                                            className="font-mono text-[10px] sm:text-xs tracking-[0.15em] text-primary/80 mb-3 flex flex-wrap gap-x-3 gap-y-1 uppercase"
                                        >
                                            <span className="text-primary font-bold">WPT {String(index + 1).padStart(3, "0")}</span>
                                            {exp.period && <span className="text-muted-foreground">· {exp.period}</span>}
                                            {exp.location && (
                                                <span className="text-muted-foreground/70 w-full sm:w-auto">
                                                    · {formatCoord(exp.location.lat, exp.location.lng)}
                                                </span>
                                            )}
                                        </motion.div>

                                        <PortfolioCard
                                            item={exp}
                                            index={index}
                                            type="experience"
                                            onClick={() => onItemClick(exp)}
                                        />
                                    </div>
                                </div>
                            );
                        })}

                        {/* Track terminus */}
                        <motion.div
                            className="relative pl-12 md:pl-0 md:text-center"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={viewportOnce}
                            transition={{ duration: 0.6, ease: easing.smooth }}
                        >
                            <div className="absolute left-4 md:left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping motion-reduce:animate-none absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-accent" />
                                </span>
                            </div>
                            <span className="inline-block md:mx-auto pl-4 md:pl-0 md:pt-8 font-mono text-[10px] tracking-[0.25em] text-muted-foreground uppercase">
                                Tracking · next waypoint loading…
                            </span>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};
