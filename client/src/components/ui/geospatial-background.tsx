import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const SatelliteTrack = ({ delay = 0, duration = 20, top = "20%" }) => {
    return (
        <motion.div
            className="absolute h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent w-full"
            style={{ top }}
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
};

const NetworkNode = ({ x, y, delay = 0 }) => {
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
            />
        </div>
    );
};

export const GeospatialBackground = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 1000], [0, -50]);
    const y2 = useTransform(scrollY, [0, 1000], [0, -100]);

    // Simplified world map paths (approximate continents)
    const mapPaths = [
        "M 200,100 Q 250,80 300,120 T 350,150 T 300,200 T 200,180 Z", // North America
        "M 350,250 Q 400,280 380,350 T 320,400 T 280,350 Z", // South America
        "M 500,100 Q 550,80 650,100 T 750,150 T 700,250 T 600,200 Z", // Eurasia
        "M 550,250 Q 600,280 620,350 T 580,420 T 520,350 Z", // Africa
        "M 750,350 Q 800,380 780,420 T 720,450 T 680,400 Z", // Australia
    ];

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-background pointer-events-none">
            {/* Deep Space Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(18,194,133,0.05)_0%,transparent_70%)]" />

            {/* Lat/Long Grid */}
            <motion.div style={{ y: y1 }} className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </motion.div>

            {/* World Map Contours */}
            <motion.div style={{ y: y2 }} className="absolute inset-0 opacity-[0.08] flex items-center justify-center">
                <svg viewBox="0 0 1000 500" className="w-full h-full max-w-6xl">
                    {mapPaths.map((path, i) => (
                        <path key={i} d={path} fill="none" stroke="currentColor" strokeWidth="1" className="text-primary" />
                    ))}
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
            />
        </div>
    );
};
