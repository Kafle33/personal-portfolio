import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GeospatialPreloaderProps {
  onComplete: () => void;
}

export function GeospatialPreloader({ onComplete }: GeospatialPreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "INITIALIZING GIS CORE...",
    "ESTABLISHING SATELLITE UPLINK...",
    "CALIBRATING GEODETIC DATUM...",
    "FETCHING MULTISPECTRAL TILES...",
    "PROCESSING SPATIAL TOPOLOGY...",
    "SYNCHRONIZING COORDINATE GRID...",
    "RENDERING VECTOR LAYERS...",
    "FINALIZING GEOSPATIAL STACK..."
  ];

  const thematicTitles = [
    "ROSHAN KAFLE",
    "WEBGIS  Developer",
    "SPATIAL DATA ENGINEER",
    "GEOMATICS SPECIALIST",
    "MAPPING THE FUTURE"
  ];

  // Satellite configurations for truly randomized, distinct orbits
  const satellites = useMemo(() => {
    // Randomize number of satellites between 4 and 8
    const count = Math.floor(Math.random() * 5) + 4;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      // Strictly distinct radii with a random offset to ensure no overlapping orbits
      radius: 120 + (i * 35) + (Math.random() * 15),
      // Random speed (10s to 30s) and direction
      duration: 10 + Math.random() * 20,
      direction: Math.random() > 0.5 ? 1 : -1,
      // Random orbital orientation (full 360 degree range)
      rotateX: Math.random() * 360,
      rotateY: Math.random() * 360,
      inclination: Math.random() * 360,
      initialAngle: Math.random() * 360
    }));
  }, []);

  useEffect(() => {
    const duration = 3000; // 3 seconds total
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);

      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        setTimeout(onComplete, 300); // Brief pause before transitioning
      }
    }, 30); // Update every 30ms for smooth animation

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    const stepIndex = Math.floor((progress / 100) * (steps.length - 1));
    setCurrentStep(stepIndex);
  }, [progress]);

  const currentThematicTitle = useMemo(() => {
    const index = Math.floor((progress / 100) * (thematicTitles.length - 1));
    return thematicTitles[index];
  }, [progress]);

  // Generate tiles for the loading matrix
  const matrixTiles = useMemo(() => {
    return Array.from({ length: 64 }).map((_, i) => ({
      id: i,
      x: i % 8,
      y: Math.floor(i / 8)
    }));
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020406] overflow-hidden font-mono text-primary/80">
      {/* 1. Full-screen Coordinate Grid */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Main Grid Lines */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(34, 197, 94, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(34, 197, 94, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '10% 10%'
        }} />

        {/* Sub-grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(34, 197, 94, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(34, 197, 94, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '2% 2%'
        }} />

        {/* Edge Coordinate Labels */}
        <div className="absolute top-4 left-0 right-0 flex justify-around text-[8px] opacity-40">
          {[83.9, 83.92, 83.94, 83.96, 83.98, 84.0].map(lon => <span key={lon}>{lon}° E</span>)}
        </div>
        <div className="absolute bottom-4 left-0 right-0 flex justify-around text-[8px] opacity-40">
          {[83.9, 83.92, 83.94, 83.96, 83.98, 84.0].map(lon => <span key={lon}>{lon}° E</span>)}
        </div>
        <div className="absolute left-4 top-0 bottom-0 flex flex-col justify-around text-[8px] opacity-40">
          {[28.24, 28.22, 28.20, 28.18, 28.16].map(lat => <span key={lat}>{lat}° N</span>)}
        </div>
        <div className="absolute right-4 top-0 bottom-0 flex flex-col justify-around text-[8px] opacity-40">
          {[28.24, 28.22, 28.20, 28.18, 28.16].map(lat => <span key={lat}>{lat}° N</span>)}
        </div>
      </div>

      {/* 2. Background Topographic Details (Subtle) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <path d="M0,200 Q250,150 500,200 T1000,200" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M0,400 Q250,350 500,400 T1000,400" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M0,600 Q250,550 500,600 T1000,600" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M0,800 Q250,750 500,800 T1000,800" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      {/* 3. HUD Elements (Corners) */}
      <div className="absolute top-8 left-8 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] tracking-widest uppercase">System: Online</span>
        </div>
        <div className="text-[8px] opacity-50 space-y-1">
          <div>SENSOR_TYPE: MULTISPECTRAL_V3</div>
          <div>UPLINK_STRENGTH: 98.4%</div>
          <div>BBOX: [28.16, 83.90, 28.24, 84.00]</div>
        </div>
      </div>

      <div className="absolute top-8 right-8 text-right">
        <div className="text-[10px] tracking-widest uppercase mb-2">Data Stream</div>
        <div className="text-[8px] opacity-50 font-mono">
          {steps.slice(0, currentStep + 1).map((step, i) => (
            <div key={i} className="text-primary/60">{`> ${step}`}</div>
          ))}
          <div className="animate-pulse text-primary">{`> ${steps[currentStep]}`}</div>
        </div>
      </div>

      {/* 4. Central Geospatial Core */}
      <div className="relative z-20 flex flex-col items-center" style={{ perspective: "1200px" }}>
        {/* Satellite / Orbiting System - Responsive sizing */}
        <div
          className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] mb-8 flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >

          {/* Central Earth Node - Responsive */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full border border-primary/40 bg-primary/5 backdrop-blur-md flex items-center justify-center relative overflow-hidden"
              style={{ transform: "translateZ(0px)" }}
            >
              {/* Globe Grid */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                backgroundSize: '10px 10px'
              }} />
              <i className="fas fa-globe-asia text-4xl sm:text-5xl md:text-5xl lg:text-6xl text-primary/70" />

              {/* Scanning Glint */}
              <motion.div
                animate={{ top: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent"
              />
            </motion.div>
          </div>

          {/* Dynamic Orbiting Satellites */}
          {satellites.map((sat) => (
            <div
              key={sat.id}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                transformStyle: "preserve-3d",
                transform: `rotateX(${sat.rotateX}deg) rotateY(${sat.rotateY}deg) rotateZ(${sat.inclination}deg)`
              }}
            >
              {/* Visual Orbit Path - Increased visibility */}
              <div
                className="absolute border border-primary/20 rounded-full"
                style={{
                  width: sat.radius * 2,
                  height: sat.radius * 2,
                  transform: "translateZ(0px)"
                }}
              />

              {/* Satellite Container */}
              <motion.div
                animate={{ rotate: sat.direction * 360 }}
                initial={{ rotate: sat.initialAngle }}
                transition={{ duration: sat.duration, repeat: Infinity, ease: "linear" }}
                className="absolute"
                style={{
                  width: sat.radius * 2,
                  height: sat.radius * 2,
                  transformStyle: "preserve-3d"
                }}
              >
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                  style={{
                    transform: "rotateX(-90deg) translateZ(2px)", // Slightly above the orbit line
                    transformStyle: "preserve-3d"
                  }}
                >
                  {/* Detailed Satellite Representation */}
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="relative"
                  >
                    {/* Satellite Body & Solar Panels - More technical look */}
                    <svg width="48" height="32" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">
                      {/* Left Solar Panel Array */}
                      <g opacity="0.8">
                        <rect x="2" y="10" width="14" height="12" rx="1" fill="#1a3a2a" stroke="currentColor" strokeWidth="1" />
                        <line x1="2" y1="14" x2="16" y2="14" stroke="currentColor" strokeWidth="0.5" />
                        <line x1="2" y1="18" x2="16" y2="18" stroke="currentColor" strokeWidth="0.5" />
                        <line x1="9" y1="10" x2="9" y2="22" stroke="currentColor" strokeWidth="0.5" />
                      </g>

                      {/* Right Solar Panel Array */}
                      <g opacity="0.8">
                        <rect x="32" y="10" width="14" height="12" rx="1" fill="#1a3a2a" stroke="currentColor" strokeWidth="1" />
                        <line x1="32" y1="14" x2="46" y2="14" stroke="currentColor" strokeWidth="0.5" />
                        <line x1="32" y1="18" x2="46" y2="18" stroke="currentColor" strokeWidth="0.5" />
                        <line x1="39" y1="10" x2="39" y2="22" stroke="currentColor" strokeWidth="0.5" />
                      </g>

                      {/* Connection Struts */}
                      <rect x="16" y="15" width="4" height="2" fill="currentColor" />
                      <rect x="28" y="15" width="4" height="2" fill="currentColor" />

                      {/* Main Bus (Body) */}
                      <rect x="20" y="8" width="8" height="16" rx="1" fill="currentColor" stroke="currentColor" strokeWidth="1" />

                      {/* High-Gain Antenna */}
                      <path d="M24 8V2" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M20 4C20 4 22 2 24 2C26 2 28 4 28 4" stroke="currentColor" strokeWidth="1" fill="none" />

                      {/* Sensor Lens */}
                      <circle cx="24" cy="20" r="2" fill="#020406" stroke="currentColor" strokeWidth="0.5" />
                    </svg>

                    {/* Signal Pulse */}
                    <motion.div
                      animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border border-primary/50"
                    />
                  </motion.div>

                  {/* Signal Beam to Center */}
                  <div
                    className="w-[1px] bg-gradient-to-b from-primary/60 to-transparent opacity-40"
                    style={{ height: sat.radius, transform: "translateY(16px)" }}
                  />
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* 5. Tile Loading Matrix (Progress Indicator) */}
        <div className="space-y-6 flex flex-col items-center">
          <div className="text-center h-16 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.h2
                key={currentThematicTitle}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-xl font-bold tracking-[0.3em] text-white uppercase mb-1"
              >
                {currentThematicTitle}
              </motion.h2>
            </AnimatePresence>
            <div className="text-[10px] text-primary/60 tracking-widest uppercase">
              Initializing Map Layers
            </div>
          </div>

          {/* Matrix of Tiles */}
          <div className="grid grid-cols-8 gap-1 p-2 border border-white/5 bg-white/[0.02] backdrop-blur-sm">
            {matrixTiles.map((tile) => {
              const isActive = progress > (tile.id / matrixTiles.length) * 100;
              return (
                <motion.div
                  key={tile.id}
                  initial={false}
                  animate={{
                    backgroundColor: isActive ? "rgba(34, 197, 94, 0.4)" : "rgba(255, 255, 255, 0.05)",
                    opacity: isActive ? 1 : 0.3
                  }}
                  className="w-3 h-3 rounded-[1px]"
                />
              );
            })}
          </div>

          {/* Progress Metadata */}
          <div className="w-64 flex justify-between items-end">
            <div className="space-y-1">
              <div className="text-[8px] text-white/40 uppercase tracking-tighter">Current Task</div>
              <div className="text-[10px] text-primary h-4 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {steps[currentStep]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[8px] text-white/40 uppercase tracking-tighter">Progress</div>
              <div className="text-xl font-bold text-primary">{Math.round(progress)}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Bottom Status Bar */}
      <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center border-t border-white/5 pt-4">
        <div className="flex gap-8">
          <div className="flex flex-col">
            <span className="text-[7px] text-white/30 uppercase tracking-widest">Lat</span>
            <span className="text-[10px] text-primary/80">28.2096° N</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[7px] text-white/30 uppercase tracking-widest">Lon</span>
            <span className="text-[10px] text-primary/80">83.9856° E</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[7px] text-white/30 uppercase tracking-widest">Alt</span>
            <span className="text-[10px] text-primary/80">822.00m MSL</span>
          </div>
        </div>
        <div className="text-[8px] text-white/20 tracking-widest uppercase">
          © 2026 ROSHAN KAFLE | GEOSPATIAL ENGINEER
        </div>
      </div>

      {/* Corner Accents (Technical Brackets) */}
      <div className="absolute top-4 left-4 w-16 h-16 border-t border-l border-primary/20" />
      <div className="absolute top-4 right-4 w-16 h-16 border-t border-r border-primary/20" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-b border-l border-primary/20" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-b border-r border-primary/20" />
    </div>
  );
}