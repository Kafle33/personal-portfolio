import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface GeospatialPreloaderProps {
  onComplete: () => void;
}

import { CONTINENTS } from "./continents-data";
import { NEPAL_BORDER } from "./nepal-data";

const TAU = Math.PI * 2;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * The full cinematic center stage: starfield, lit globe with atmosphere and
 * clouds, two satellites on inclined orbits (correctly passing behind and in
 * front of the globe), scan beams that lock onto Nepal, and a rotation that
 * decelerates to frame Nepal center just as loading completes.
 */
function GlobeScene({ reducedMotion }: { reducedMotion: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let W = 0;
    let H = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = rect.width;
      H = rect.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const TILT = (-28.2 * Math.PI) / 180;
    const NEPAL = { lat: 28.2096, lon: 83.9856 };

    // Rotation choreography: one full revolution plus the offset needed so the
    // deceleration lands Nepal exactly front-center (λ=0) as loading completes.
    // ease-in-out: the globe spins up, sweeps around, and settles on Nepal.
    const ROT_START = (-154 * Math.PI) / 180;
    const ROT_END = (-NEPAL.lon * Math.PI) / 180; // Nepal at λ=0 → front-center
    const ROT_DELTA = ROT_END - ROT_START + TAU; // full extra revolution, same end
    const SPIN_MS = 3050;

    // Deterministic ambience
    const stars = Array.from({ length: 90 }, (_, i) => {
      const h1 = Math.sin(i * 127.1) * 43758.5453;
      const h2 = Math.sin(i * 311.7) * 43758.5453;
      const h3 = Math.sin(i * 74.7) * 43758.5453;
      const f = (v: number) => v - Math.floor(v);
      return {
        x: f(h1),
        y: f(h2),
        r: 0.4 + f(h3) * 1.1,
        tw: 0.0012 + f(h1 * 3) * 0.0018,
        ph: f(h2 * 7) * TAU,
        a: 0.2 + f(h3 * 5) * 0.45,
      };
    });

    const clouds = [
      { lat: 42, lon0: 30, w: 0.52, h: 0.14, sp: 0.000022, al: 0.06 },
      { lat: 8, lon0: 150, w: 0.62, h: 0.18, sp: -0.000018, al: 0.05 },
      { lat: -18, lon0: 260, w: 0.48, h: 0.13, sp: 0.000026, al: 0.055 },
      { lat: -45, lon0: 80, w: 0.58, h: 0.16, sp: -0.000021, al: 0.05 },
      { lat: 25, lon0: 210, w: 0.42, h: 0.12, sp: 0.00003, al: 0.045 },
    ];

    // GPS/Starlink-style constellation: varied planes, altitudes, speeds.
    // Only the two prominent low-orbit birds fire scan beams — the rest are
    // ambient traffic so the scene reads busy without becoming noisy.
    const deg = Math.PI / 180;
    const sats = [
      { incl: 64 * deg, raan: 0.7, altF: 1.3, speed: 0.00082, a0: 0.4, scale: 1, beams: true },
      { incl: -38 * deg, raan: -1.1, altF: 1.56, speed: -0.00048, a0: 2.6, scale: 0.78, beams: true },
      { incl: 14 * deg, raan: 0.3, altF: 1.4, speed: 0.0006, a0: 4.4, scale: 0.64, beams: false },
      { incl: 82 * deg, raan: -0.5, altF: 1.22, speed: -0.00096, a0: 1.5, scale: 0.58, beams: false },
      { incl: -58 * deg, raan: 1.9, altF: 1.5, speed: 0.00052, a0: 5.6, scale: 0.68, beams: false },
      { incl: 43 * deg, raan: 2.6, altF: 1.58, speed: -0.00038, a0: 3.3, scale: 0.52, beams: false },
      { incl: -22 * deg, raan: -2.3, altF: 1.36, speed: 0.0007, a0: 0.9, scale: 0.48, beams: false },
    ];

    const t0 = performance.now();

    /** Orbit position in view space: inclined circle → RAAN → view tilt */
    const orbitPoint = (a: number, incl: number, raan: number, r: number) => {
      const x1 = Math.cos(a) * r;
      const z1 = Math.sin(a) * r;
      const y2 = -z1 * Math.sin(incl);
      const z2 = z1 * Math.cos(incl);
      const x3 = x1 * Math.cos(raan) + z2 * Math.sin(raan);
      const z3 = -x1 * Math.sin(raan) + z2 * Math.cos(raan);
      const y = y2 * Math.cos(TILT) - z3 * Math.sin(TILT);
      const z = y2 * Math.sin(TILT) + z3 * Math.cos(TILT);
      return { x: x3, y, z };
    };

    const render = (now: number) => {
      const elapsed = now - t0;
      const cx = W / 2;
      const cy = H / 2;
      const spinP = Math.min(1, elapsed / SPIN_MS);
      const rotation = reducedMotion
        ? ROT_END
        : ROT_START + ROT_DELTA * easeInOutCubic(spinP) + Math.max(0, elapsed - SPIN_MS) * 0.00001;
      // Slow dolly-in over the load
      const R = Math.min(W, H) * (0.285 + 0.02 * easeOutCubic(Math.min(1, elapsed / SPIN_MS)));
      const sceneA = reducedMotion ? 1 : Math.min(1, elapsed / 500);

      const project = (lat: number, lon: number, altF = 1) => {
        const phi = (lat * Math.PI) / 180;
        const lambda = (lon * Math.PI) / 180 + rotation;
        const r = R * altF;
        const x0 = r * Math.cos(phi) * Math.sin(lambda);
        const y0 = -r * Math.sin(phi);
        const z0 = r * Math.cos(phi) * Math.cos(lambda);
        const y = y0 * Math.cos(TILT) - z0 * Math.sin(TILT);
        const z = y0 * Math.sin(TILT) + z0 * Math.cos(TILT);
        return { x: cx + x0, y: cy + y, z: z / r };
      };

      /** Trace lat/lon polylines, keeping only segments on the requested hemisphere */
      const tracePolys = (polys: number[][][], front: boolean) => {
        ctx.beginPath();
        for (const polygon of polys) {
          let first = true;
          for (const [lat, lon] of polygon) {
            const p = project(lat, lon);
            const ok = front ? p.z > 0 : p.z <= 0;
            if (ok) {
              if (first) ctx.moveTo(p.x, p.y);
              else ctx.lineTo(p.x, p.y);
              first = false;
            } else {
              first = true;
            }
          }
        }
      };

      const drawSatellite = (x: number, y: number, z: number, scale: number, heading: number) => {
        const depth = 0.68 + 0.32 * ((z + 1) / 2);
        const s = (Math.min(W, H) / 460) * scale * depth;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(heading);
        ctx.scale(s, s);
        ctx.globalAlpha *= 0.55 + 0.45 * ((z + 1) / 2);
        // Solar panels
        ctx.fillStyle = "rgba(16, 60, 40, 0.95)";
        ctx.strokeStyle = "rgba(34, 197, 94, 0.95)";
        ctx.lineWidth = 1;
        [-1, 1].forEach((side) => {
          ctx.fillRect(side * 7 - (side > 0 ? 0 : 13), -5, 13, 10);
          ctx.strokeRect(side * 7 - (side > 0 ? 0 : 13), -5, 13, 10);
          ctx.beginPath();
          ctx.moveTo(side * 7 - (side > 0 ? 0 : 13), 0);
          ctx.lineTo(side * 7 - (side > 0 ? 0 : 13) + 13, 0);
          ctx.moveTo(side * 13.5, -5);
          ctx.lineTo(side * 13.5, 5);
          ctx.stroke();
        });
        // Struts + bus
        ctx.fillStyle = "rgba(34, 197, 94, 1)";
        ctx.fillRect(-7, -1, 14, 2);
        ctx.fillRect(-3.5, -6, 7, 12);
        // Antenna dish toward nadir
        ctx.beginPath();
        ctx.arc(0, 8.5, 3, Math.PI, 0);
        ctx.strokeStyle = "rgba(34, 197, 94, 0.9)";
        ctx.stroke();
        ctx.restore();
      };

      ctx.clearRect(0, 0, W, H);
      ctx.globalAlpha = sceneA;

      /* Starfield */
      for (const st of stars) {
        const sx = st.x * W;
        const sy = st.y * H;
        const dx = sx - cx;
        const dy = sy - cy;
        if (dx * dx + dy * dy < R * R * 1.1) continue; // behind the globe
        const tw = reducedMotion ? 0.8 : 0.55 + 0.45 * Math.sin(now * st.tw + st.ph);
        ctx.fillStyle = `rgba(190, 230, 210, ${st.a * tw})`;
        ctx.fillRect(sx, sy, st.r, st.r);
      }

      /* Outer atmosphere halo */
      const halo = ctx.createRadialGradient(cx, cy, R * 0.96, cx, cy, R * 1.22);
      halo.addColorStop(0, "rgba(34, 197, 94, 0.18)");
      halo.addColorStop(0.5, "rgba(45, 212, 191, 0.06)");
      halo.addColorStop(1, "rgba(34, 197, 94, 0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.22, 0, TAU);
      ctx.fill();

      /* Satellites behind the globe (drawn before the sphere occludes them) */
      const satScreens = sats.map((s) => {
        const a = s.a0 + elapsed * (reducedMotion ? 0 : s.speed);
        const p = orbitPoint(a, s.incl, s.raan, R * s.altF);
        const p2 = orbitPoint(a + 0.03, s.incl, s.raan, R * s.altF);
        return {
          ...s,
          a,
          x: cx + p.x,
          y: cy + p.y,
          z: p.z / (R * s.altF),
          heading: Math.atan2(p2.y - p.y, p2.x - p.x),
        };
      });

      for (const s of satScreens) {
        // Orbit trail (always drawn — reads as the orbit path); shorter and
        // dimmer for the small ambient birds
        const trailLen = s.beams ? 14 : 9;
        const trailA = s.beams ? 0.32 : 0.2;
        for (let k = 1; k <= trailLen; k++) {
          const ta = s.a - k * 0.055 * Math.sign(s.speed || 1);
          const tp = orbitPoint(ta, s.incl, s.raan, R * s.altF);
          const tz = tp.z / (R * s.altF);
          const behind = tz < 0 ? 0.35 : 1;
          ctx.fillStyle = `rgba(34, 197, 94, ${(1 - k / trailLen) * trailA * behind})`;
          ctx.fillRect(cx + tp.x - 0.75, cy + tp.y - 0.75, 1.5, 1.5);
        }
        if (s.z < 0) drawSatellite(s.x, s.y, s.z, s.scale, s.heading);
      }

      /* Sphere base with day-side lighting */
      const lightX = cx - R * 0.5;
      const lightY = cy - R * 0.55;
      const base = ctx.createRadialGradient(lightX, lightY, R * 0.15, cx, cy, R * 1.35);
      base.addColorStop(0, "rgba(14, 46, 34, 0.98)");
      base.addColorStop(0.45, "rgba(6, 20, 16, 0.98)");
      base.addColorStop(1, "rgba(2, 5, 4, 0.99)");
      ctx.fillStyle = base;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, TAU);
      ctx.fill();

      /* Far-side continents — faint, sells the sphere's depth */
      tracePolys(CONTINENTS, false);
      ctx.strokeStyle = "rgba(34, 197, 94, 0.09)";
      ctx.lineWidth = 0.75;
      ctx.stroke();

      /* Graticule */
      ctx.strokeStyle = "rgba(34, 197, 94, 0.14)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let lon = -180; lon < 180; lon += 30) {
        let first = true;
        for (let lat = -90; lat <= 90; lat += 5) {
          const p = project(lat, lon);
          if (p.z > 0) {
            if (first) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
            first = false;
          } else first = true;
        }
      }
      for (let lat = -60; lat <= 60; lat += 30) {
        let first = true;
        for (let lon = -180; lon <= 180; lon += 5) {
          const p = project(lat, lon);
          if (p.z > 0) {
            if (first) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
            first = false;
          } else first = true;
        }
      }
      ctx.stroke();

      /* Equator highlight */
      ctx.beginPath();
      let firstEq = true;
      for (let lon = -180; lon <= 180; lon += 5) {
        const p = project(0, lon);
        if (p.z > 0) {
          if (firstEq) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
          firstEq = false;
        } else firstEq = true;
      }
      ctx.strokeStyle = "rgba(34, 197, 94, 0.32)";
      ctx.lineWidth = 1;
      ctx.stroke();

      /* Front continents */
      tracePolys(CONTINENTS, true);
      ctx.strokeStyle = "rgba(52, 211, 153, 0.75)";
      ctx.lineWidth = 1;
      ctx.lineJoin = "round";
      ctx.stroke();

      /* Nepal: golden glow, pulsing border, marker, ping rings, callout */
      const nepal = project(NEPAL.lat, NEPAL.lon);
      if (nepal.z > 0) {
        const vis = Math.min(1, nepal.z * 1.6);
        const glow = ctx.createRadialGradient(nepal.x, nepal.y, 0, nepal.x, nepal.y, R * 0.22);
        glow.addColorStop(0, `rgba(251, 191, 36, ${0.16 * vis})`);
        glow.addColorStop(1, "rgba(251, 191, 36, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(nepal.x, nepal.y, R * 0.22, 0, TAU);
        ctx.fill();

        const borderPulse = reducedMotion ? 0.5 : (Math.sin(now / 240) + 1) / 2;
        ctx.beginPath();
        let firstNp = true;
        for (const [lat, lon] of NEPAL_BORDER) {
          const p = project(lat, lon);
          if (p.z > 0) {
            if (firstNp) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
            firstNp = false;
          } else firstNp = true;
        }
        ctx.strokeStyle = `rgba(251, 191, 36, ${(0.55 + borderPulse * 0.45) * vis})`;
        ctx.lineWidth = 1.4 + borderPulse * 0.6;
        ctx.stroke();

        // Expanding ping rings
        if (!reducedMotion) {
          for (let k = 0; k < 2; k++) {
            const ring = ((now / 1400 + k * 0.5) % 1);
            ctx.beginPath();
            ctx.arc(nepal.x, nepal.y, 3 + ring * R * 0.13, 0, TAU);
            ctx.strokeStyle = `rgba(251, 191, 36, ${(1 - ring) * 0.5 * vis})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Marker core
        ctx.beginPath();
        ctx.arc(nepal.x, nepal.y, 2, 0, TAU);
        ctx.fillStyle = `rgba(251, 191, 36, ${vis})`;
        ctx.fill();

        // Leader-line callout once Nepal is well onto the visible face
        const callA = Math.max(0, (nepal.z - 0.35) / 0.65);
        if (callA > 0.02) {
          const lx = nepal.x + R * 0.24;
          const ly = nepal.y - R * 0.3;
          ctx.strokeStyle = `rgba(251, 191, 36, ${0.55 * callA})`;
          ctx.lineWidth = 0.75;
          ctx.beginPath();
          ctx.moveTo(nepal.x + 4, nepal.y - 4);
          ctx.lineTo(lx, ly);
          ctx.lineTo(lx + 52, ly);
          ctx.stroke();
          ctx.fillStyle = `rgba(251, 191, 36, ${0.95 * callA})`;
          ctx.font = "600 9px ui-monospace, SFMono-Regular, monospace";
          ctx.fillText("NEPAL · GS-01", lx + 3, ly - 4);
          ctx.fillStyle = `rgba(190, 230, 210, ${0.7 * callA})`;
          ctx.font = "8px ui-monospace, SFMono-Regular, monospace";
          ctx.fillText("28.2096°N 83.9856°E", lx + 3, ly + 9);
        }
      }

      /* Cloud wisps drifting over the surface */
      for (const c of clouds) {
        const lon = c.lon0 + (reducedMotion ? 0 : now * c.sp * 57.3);
        const p = project(c.lat, lon % 360);
        if (p.z <= 0.05) continue;
        ctx.fillStyle = `rgba(220, 245, 235, ${c.al * p.z})`;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, R * c.w * 0.4 * p.z, R * c.h * 0.4 * p.z, 0, 0, TAU);
        ctx.fill();
      }

      /* Terminator shading + specular, clipped to the sphere */
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, TAU);
      ctx.clip();
      const shade = ctx.createRadialGradient(lightX, lightY, R * 0.3, lightX, lightY, R * 2.15);
      shade.addColorStop(0, "rgba(0, 0, 0, 0)");
      shade.addColorStop(0.55, "rgba(0, 0, 0, 0.08)");
      shade.addColorStop(1, "rgba(0, 0, 0, 0.6)");
      ctx.fillStyle = shade;
      ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
      const spec = ctx.createRadialGradient(lightX, lightY, 0, lightX, lightY, R * 0.55);
      spec.addColorStop(0, "rgba(230, 255, 245, 0.10)");
      spec.addColorStop(1, "rgba(230, 255, 245, 0)");
      ctx.fillStyle = spec;
      ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
      ctx.restore();

      /* Inner rim atmosphere */
      const rim = ctx.createRadialGradient(cx, cy, R * 0.82, cx, cy, R);
      rim.addColorStop(0, "rgba(34, 197, 94, 0)");
      rim.addColorStop(1, "rgba(45, 212, 191, 0.16)");
      ctx.fillStyle = rim;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, TAU);
      ctx.fill();

      /* Front satellites + scan beams locked on Nepal */
      for (const s of satScreens) {
        if (s.z < 0) continue;
        if (s.beams && nepal.z > 0.1 && !reducedMotion) {
          const beamA = Math.min(1, s.z * 1.4) * Math.min(1, nepal.z * 1.4) * 0.9;
          const grad = ctx.createLinearGradient(s.x, s.y, nepal.x, nepal.y);
          grad.addColorStop(0, `rgba(34, 197, 94, ${0.55 * beamA})`);
          grad.addColorStop(1, `rgba(251, 191, 36, ${0.18 * beamA})`);
          // Cone: narrow at the satellite, footprint at Nepal
          const dx = nepal.x - s.x;
          const dy = nepal.y - s.y;
          const len = Math.hypot(dx, dy) || 1;
          const px = (-dy / len) * 7;
          const py = (dx / len) * 7;
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(nepal.x + px, nepal.y + py);
          ctx.lineTo(nepal.x - px, nepal.y - py);
          ctx.closePath();
          ctx.fill();
          // Data packets travelling down the beam
          for (let k = 0; k < 3; k++) {
            const t = (now * 0.00055 + k / 3 + s.a0) % 1;
            ctx.beginPath();
            ctx.arc(s.x + dx * t, s.y + dy * t, 2.1, 0, TAU);
            ctx.fillStyle = `rgba(190, 240, 215, ${Math.sin(t * Math.PI) * 0.9 * beamA})`;
            ctx.fill();
          }
        }
        drawSatellite(s.x, s.y, s.z, s.scale, s.heading);
      }

      ctx.globalAlpha = 1;
      if (!reducedMotion) raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

export function GeospatialPreloader({ onComplete }: GeospatialPreloaderProps) {
  const shouldReduceMotion = useReducedMotion();
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
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020406] overflow-hidden font-mono text-primary/80"
      style={{ transformOrigin: "50% 44%" }}
      exit={{ scale: 1.45, opacity: 0 }}
      transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
      role="status"
      aria-label="Loading portfolio"
    >
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

      {/* 4. Central Geospatial Core — unified canvas: globe, satellites, beams */}
      <div className="relative z-20 flex flex-col items-center">
        <div className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] lg:w-[480px] lg:h-[480px] mb-4">
          <GlobeScene reducedMotion={!!shouldReduceMotion} />
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
              {progress >= 100
                ? "✓ FIX ACQUIRED — 3D POSITION LOCK"
                : `ACQUIRING SATELLITES: ${Math.min(12, Math.floor((progress / 100) * 13))}/12`}
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
    </motion.div>
  );
}