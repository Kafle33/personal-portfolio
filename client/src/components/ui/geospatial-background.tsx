import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const SatelliteTrack = React.memo(({ delay = 0, duration = 20, top = "20%" }: { delay?: number; duration?: number; top?: string }) => {
    return (
        <motion.div
            className="absolute h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent w-full"
            style={{ top, willChange: "transform" }}
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
                duration,
                repeat: Infinity,
                delay,
                ease: "linear",
            }}
        >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(18,194,133,0.8)]" />
        </motion.div>
    );
});

const NetworkNode = React.memo(({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) => {
    return (
        <div className="absolute" style={{ left: `${x}%`, top: `${y}%` }}>
            <motion.div
                className="w-1.5 h-1.5 bg-primary/60 rounded-full"
                animate={{
                    scale: [1, 1.8, 1],
                    opacity: [0.6, 1, 0.6],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay,
                }}
                style={{ willChange: "transform, opacity" }}
            />
        </div>
    );
});

const ContourIsland = React.memo(({ x, y, scale = 1, levels = 6 }: { x: number; y: number; scale?: number; levels?: number }) => {
    const paths = React.useMemo(() => {
        const generatedPaths = [];
        const pointsCount = 12;

        // Generate base offsets for irregularity
        const baseOffsets = Array.from({ length: pointsCount }).map(() => 0.7 + Math.random() * 0.6);

        for (let level = 0; level < levels; level++) {
            const radius = (level + 1) * 20 * scale;
            const pts: { x: number; y: number }[] = [];

            for (let i = 0; i < pointsCount; i++) {
                const angle = (i / pointsCount) * Math.PI * 2;
                // Add level-specific noise to make nested lines slightly different but following the same trend
                const r = radius * (baseOffsets[i] + (Math.random() * 0.1 - 0.05));
                pts.push({
                    x: Math.cos(angle) * r,
                    y: Math.sin(angle) * r
                });
            }

            // Create smooth SVG path using Quadratic Bezier curves
            // We use midpoints as start/end and the actual points as control points
            let d = "";
            for (let i = 0; i < pts.length; i++) {
                const p0 = pts[i];
                const p1 = pts[(i + 1) % pts.length];
                const midX = (p0.x + p1.x) / 2;
                const midY = (p0.y + p1.y) / 2;

                if (i === 0) {
                    const prevP = pts[pts.length - 1];
                    const startMidX = (prevP.x + p0.x) / 2;
                    const startMidY = (prevP.y + p0.y) / 2;
                    d += `M ${startMidX},${startMidY} `;
                }
                d += `Q ${p0.x},${p0.y} ${midX},${midY} `;
            }
            generatedPaths.push(d + " Z");
        }
        return generatedPaths;
    }, [scale, levels]);

    return (
        <g transform={`translate(${x}, ${y})`}>
            {paths.map((d, i) => (
                <path
                    key={i}
                    d={d}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={i % 5 === 0 ? "1.2" : "0.6"}
                    className="text-primary"
                    style={{ opacity: i % 5 === 0 ? 0.25 : 0.12 }}
                />
            ))}
        </g>
    );
});

export const GeospatialBackground = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 1000], [0, -50]);
    const y2 = useTransform(scrollY, [0, 1000], [0, -100]);

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-background pointer-events-none">
            {/* Deep Space Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(18,194,133,0.05)_0%,transparent_70%)]" />

            {/* Lat/Long Grid */}
            <motion.div style={{ y: y1, willChange: "transform" }} className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </motion.div>

            {/* Topographic Contours */}
            <motion.div style={{ y: y2, willChange: "transform" }} className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 1000 1000" className="w-full h-full opacity-40">
                    <ContourIsland x={200} y={200} scale={1.2} levels={8} />
                    <ContourIsland x={700} y={150} scale={0.8} levels={6} />
                    <ContourIsland x={400} y={500} scale={1.5} levels={10} />
                    <ContourIsland x={800} y={700} scale={1.1} levels={7} />
                    <ContourIsland x={150} y={800} scale={0.9} levels={5} />
                </svg>
            </motion.div>

            {/* Satellite Tracks */}
            <SatelliteTrack top="15%" delay={0} duration={25} />
            <SatelliteTrack top="45%" delay={5} duration={35} />
            <SatelliteTrack top="75%" delay={12} duration={30} />

            {/* Network Nodes */}
            <NetworkNode x={25} y={30} delay={0} />
            <NetworkNode x={45} y={60} delay={1} />
            <NetworkNode x={75} y={20} delay={2} />
            <NetworkNode x={85} y={70} delay={0.5} />
            <NetworkNode x={15} y={80} delay={1.5} />

            {/* Subtle Scan Line */}
            <motion.div
                className="absolute w-full h-[2px] bg-primary/5"
                animate={{ top: ["0%", "100%"] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                style={{ willChange: "top" }}
            />
        </div>
    );
};
