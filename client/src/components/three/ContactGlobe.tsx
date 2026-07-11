import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { CONTINENTS } from "../ui/continents-data";
import { experiencesData, projectsData } from "../../data/portfolio";

const GLOBE_RADIUS = 2;
const HOME = { lat: 28.2096, lng: 83.9856 }; // Pokhara

const latLngToVector3 = (lat: number, lng: number, radius = GLOBE_RADIUS) => {
    const phi = ((90 - lat) * Math.PI) / 180;
    const theta = ((lng + 180) * Math.PI) / 180;
    return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
    );
};

/** All continent outlines merged into a single LineSegments draw call */
const ContinentLines = () => {
    const geometry = useMemo(() => {
        const positions: number[] = [];
        for (const polygon of CONTINENTS) {
            for (let i = 0; i < polygon.length - 1; i++) {
                const [lat1, lng1] = polygon[i];
                const [lat2, lng2] = polygon[i + 1];
                const a = latLngToVector3(lat1, lng1);
                const b = latLngToVector3(lat2, lng2);
                positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
            }
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        return geo;
    }, []);

    return (
        <lineSegments geometry={geometry}>
            <lineBasicMaterial color="#12c285" transparent opacity={0.55} />
        </lineSegments>
    );
};

/** Faint graticule every 30 degrees */
const Graticule = () => {
    const geometry = useMemo(() => {
        const positions: number[] = [];
        const push = (a: THREE.Vector3, b: THREE.Vector3) =>
            positions.push(a.x, a.y, a.z, b.x, b.y, b.z);
        for (let lat = -60; lat <= 60; lat += 30) {
            for (let lng = -180; lng < 180; lng += 5) {
                push(latLngToVector3(lat, lng), latLngToVector3(lat, lng + 5));
            }
        }
        for (let lng = -180; lng < 180; lng += 30) {
            for (let lat = -85; lat < 85; lat += 5) {
                push(latLngToVector3(lat, lng), latLngToVector3(lat + 5, lng));
            }
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        return geo;
    }, []);

    return (
        <lineSegments geometry={geometry}>
            <lineBasicMaterial color="#12c285" transparent opacity={0.12} />
        </lineSegments>
    );
};

/** Great-circle-ish arc with a comet dot travelling along it */
const Arc = ({ from, to, color = "#3b82f6", speed = 0.25, offset = 0 }: {
    from: { lat: number; lng: number };
    to: { lat: number; lng: number };
    color?: string;
    speed?: number;
    offset?: number;
}) => {
    const dotRef = useRef<THREE.Mesh>(null);

    const curve = useMemo(() => {
        const a = latLngToVector3(from.lat, from.lng);
        const b = latLngToVector3(to.lat, to.lng);
        const dist = a.distanceTo(b);
        const mid = a.clone().add(b).multiplyScalar(0.5).normalize()
            .multiplyScalar(GLOBE_RADIUS + dist * 0.35);
        return new THREE.QuadraticBezierCurve3(a, mid, b);
    }, [from.lat, from.lng, to.lat, to.lng]);

    const geometry = useMemo(() => {
        const points = curve.getPoints(64);
        return new THREE.BufferGeometry().setFromPoints(points);
    }, [curve]);

    useFrame(({ clock }) => {
        if (dotRef.current) {
            const t = (clock.elapsedTime * speed + offset) % 1;
            dotRef.current.position.copy(curve.getPoint(t));
        }
    });

    return (
        <group>
            {/* eslint-disable-next-line react/no-unknown-property */}
            <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.45 }))} />
            <mesh ref={dotRef}>
                <sphereGeometry args={[0.028, 8, 8]} />
                <meshBasicMaterial color={color} />
            </mesh>
        </group>
    );
};

const LocationMarker = ({ lat, lng, color = "#12c285", size = 0.045 }: {
    lat: number; lng: number; color?: string; size?: number;
}) => {
    const position = useMemo(() => latLngToVector3(lat, lng), [lat, lng]);
    return (
        <mesh position={position}>
            <sphereGeometry args={[size, 12, 12]} />
            <meshBasicMaterial color={color} />
        </mesh>
    );
};

const GlobeScene = ({ visitor, reducedMotion }: {
    visitor: { lat: number; lng: number } | null;
    reducedMotion: boolean;
}) => {
    const groupRef = useRef<THREE.Group>(null);
    const dragState = useRef({ dragging: false, lastX: 0, velocity: 0.0016 });
    const { gl } = useThree();

    // Drag on the canvas DOM element, not via raycast hits on the sphere —
    // raycast-based moves die the moment the cursor leaves the globe's
    // silhouette, which made dragging feel broken. Pointer capture keeps
    // the drag alive even outside the canvas.
    useEffect(() => {
        const el = gl.domElement;
        el.style.cursor = "grab";
        // Horizontal drags rotate; vertical swipes still scroll the page
        el.style.touchAction = "pan-y";

        const down = (e: PointerEvent) => {
            dragState.current.dragging = true;
            dragState.current.lastX = e.clientX;
            el.setPointerCapture?.(e.pointerId);
            el.style.cursor = "grabbing";
        };
        const move = (e: PointerEvent) => {
            if (!dragState.current.dragging || !groupRef.current) return;
            const dx = e.clientX - dragState.current.lastX;
            dragState.current.lastX = e.clientX;
            groupRef.current.rotation.y += dx * 0.005;
            dragState.current.velocity = dx * 0.0009;
        };
        const up = (e: PointerEvent) => {
            dragState.current.dragging = false;
            el.releasePointerCapture?.(e.pointerId);
            el.style.cursor = "grab";
        };

        el.addEventListener("pointerdown", down);
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerup", up);
        el.addEventListener("pointercancel", up);
        return () => {
            el.removeEventListener("pointerdown", down);
            el.removeEventListener("pointermove", move);
            el.removeEventListener("pointerup", up);
            el.removeEventListener("pointercancel", up);
        };
    }, [gl]);

    const destinations = useMemo(() => {
        const seen = new Set<string>();
        return [...experiencesData, ...projectsData]
            .filter((item) => {
                if (!item.location) return false;
                const key = `${item.location.lat},${item.location.lng}`;
                if (seen.has(key)) return false;
                seen.add(key);
                // Skip points basically on top of home
                return Math.abs(item.location.lat - HOME.lat) > 0.5 || Math.abs(item.location.lng - HOME.lng) > 0.5;
            })
            .map((item) => item.location!);
    }, []);

    useFrame(() => {
        const group = groupRef.current;
        if (!group) return;
        if (!dragState.current.dragging) {
            // Ease back toward idle rotation speed after a drag
            const idle = reducedMotion ? 0 : 0.0016;
            dragState.current.velocity += (idle - dragState.current.velocity) * 0.02;
            group.rotation.y += dragState.current.velocity;
        }
    });

    return (
        <group ref={groupRef} rotation={[0.35, 1.35, 0]}>
            {/* Occluder sphere hides back-side lines */}
            <mesh>
                <sphereGeometry args={[GLOBE_RADIUS - 0.015, 48, 48]} />
                <meshBasicMaterial color="#04120c" />
            </mesh>
            <ContinentLines />
            <Graticule />

            {/* Home base */}
            <LocationMarker lat={HOME.lat} lng={HOME.lng} color="#f59e0b" size={0.06} />

            {destinations.map((loc, i) => (
                <group key={`${loc.lat}-${loc.lng}`}>
                    <LocationMarker lat={loc.lat} lng={loc.lng} />
                    <Arc from={HOME} to={loc} speed={reducedMotion ? 0 : 0.18} offset={i * 0.23} />
                </group>
            ))}

            {visitor && (
                <group>
                    <LocationMarker lat={visitor.lat} lng={visitor.lng} color="#38bdf8" size={0.06} />
                    <Arc from={visitor} to={HOME} color="#38bdf8" speed={reducedMotion ? 0 : 0.3} />
                </group>
            )}
        </group>
    );
};

const haversineKm = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
    const R = 6371;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLng = ((b.lng - a.lng) * Math.PI) / 180;
    const s =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
    return Math.round(R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s)));
};

/**
 * Interactive globe: continent outlines, arcs from Pokhara to every project
 * location, drag to spin. Visitors can plot their own position and see the
 * great-circle distance to me.
 */
const ContactGlobe = () => {
    const [visitor, setVisitor] = useState<{ lat: number; lng: number } | null>(null);
    const [geoState, setGeoState] = useState<"idle" | "locating" | "done" | "denied">("idle");
    const reducedMotion = typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const locate = () => {
        if (!navigator.geolocation) {
            setGeoState("denied");
            return;
        }
        setGeoState("locating");
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setVisitor({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setGeoState("done");
            },
            () => setGeoState("denied"),
            { timeout: 8000, maximumAge: 600000 }
        );
    };

    return (
        <div className="mb-16">
            <div className="relative h-[380px] sm:h-[440px] rounded-2xl overflow-hidden border border-border/60 bg-[#020806]/60">
                <Canvas
                    dpr={[1, 1.5]}
                    camera={{ position: [0, 0.6, 5.2], fov: 45 }}
                    gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                >
                    <GlobeScene visitor={visitor} reducedMotion={reducedMotion} />
                </Canvas>

                {/* HUD */}
                <div className="absolute top-4 left-4 font-mono text-[9px] tracking-[0.25em] text-primary/60 uppercase pointer-events-none select-none">
                    <div>Ground station · Pokhara</div>
                    <div className="opacity-60">28.2096° N 83.9856° E</div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3">
                    <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/70 uppercase select-none">
                        Drag to rotate
                    </span>
                    <div className="flex items-center gap-3">
                        {geoState === "done" && visitor && (
                            <span className="font-mono text-[10px] text-sky-400/90 bg-background/70 backdrop-blur-sm border border-sky-400/20 rounded-md px-2 py-1">
                                You ↔ Me: {haversineKm(visitor, HOME).toLocaleString()} km
                            </span>
                        )}
                        {geoState === "denied" && (
                            <span className="font-mono text-[10px] text-muted-foreground">
                                Location unavailable
                            </span>
                        )}
                        <button
                            onClick={locate}
                            disabled={geoState === "locating"}
                            className="px-3 py-1.5 rounded-md font-mono text-[10px] tracking-wide uppercase bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition-colors disabled:opacity-50"
                        >
                            {geoState === "locating" ? "Acquiring fix…" : geoState === "done" ? "↻ Re-plot" : "📍 Plot my location"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactGlobe;
