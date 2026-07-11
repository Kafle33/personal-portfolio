import { MutableRefObject, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * One shared ambient layer for the whole page: a single fixed WebGL canvas
 * behind the content that crossfades between six featherweight scenes as the
 * active section changes. Points and lines only — no shadows, no textures —
 * and every scene skips all work while its fade is zero.
 */

type Fades = MutableRefObject<Record<string, number>>;

const GREEN = new THREE.Color("#12c285");
const BLUE = new THREE.Color("#3b82f6");

const hash = (a: number, b = 0) => {
    const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
    return s - Math.floor(s);
};

/** Shared per-variant plumbing: visibility + eased opacity from the fade map */
const useVariant = (
    fades: Fades,
    id: string,
    group: MutableRefObject<THREE.Group | null>,
    materials: THREE.Material[],
    baseOpacities: number[],
    onTick?: (g: THREE.Group, delta: number, time: number, fade: number) => void
) => {
    useFrame((state, delta) => {
        const g = group.current;
        if (!g) return;
        const f = fades.current[id] ?? 0;
        g.visible = f > 0.01;
        if (!g.visible) return;
        materials.forEach((m, i) => {
            (m as THREE.Material & { opacity: number }).opacity = baseOpacities[i] * f;
        });
        onTick?.(g, delta, state.clock.elapsedTime, f);
    });
};

/* ---------- About: floating contour rings with depth ---------- */
const ContourRings = ({ fades }: { fades: Fades }) => {
    const group = useRef<THREE.Group>(null);
    const material = useMemo(
        () => new THREE.LineBasicMaterial({ color: GREEN, transparent: true, opacity: 0 }),
        []
    );
    const rings = useMemo(() => {
        const list: THREE.BufferGeometry[] = [];
        for (let r = 0; r < 7; r++) {
            const pts: THREE.Vector3[] = [];
            const radius = 2.2 + r * 1.15;
            for (let i = 0; i <= 90; i++) {
                const a = (i / 90) * Math.PI * 2;
                const wobble = 1 + 0.16 * Math.sin(a * 3 + r * 1.7) + 0.08 * Math.sin(a * 7 + r);
                pts.push(new THREE.Vector3(Math.cos(a) * radius * wobble, Math.sin(a) * radius * wobble, r * 0.55));
            }
            list.push(new THREE.BufferGeometry().setFromPoints(pts));
        }
        return list;
    }, []);

    useVariant(fades, "about", group, [material], [0.16], (g, delta) => {
        g.rotation.z += delta * 0.03;
    });

    return (
        <group ref={group} position={[5, -1, -6]} rotation={[0.9, 0.15, 0]} visible={false}>
            {rings.map((geo, i) => (
                // eslint-disable-next-line react/no-unknown-property
                <primitive key={i} object={new THREE.LineLoop(geo, material)} />
            ))}
        </group>
    );
};

/* ---------- Skills: the classic exploded GIS layer stack ----------
   Bottom-up: TIN terrain → coordinate grid → vector features → POI points,
   sliding gently along corner rails. The toolkit, drawn as the diagram
   every GIS engineer has on a slide somewhere. */
const LayerStack = ({ fades }: { fades: Fades }) => {
    const group = useRef<THREE.Group>(null);
    const layersRef = useRef<THREE.Object3D[]>([]);

    const LAYER_W = 8;
    const LAYER_D = 5.5;
    const SEP = 1.5;

    const { terrainMat, gridMat, vectorMat, poiMat, railMat, parts } = useMemo(() => {
        const tMat = new THREE.MeshBasicMaterial({ color: GREEN, wireframe: true, transparent: true, opacity: 0 });
        const gMat = new THREE.LineBasicMaterial({ color: GREEN, transparent: true, opacity: 0 });
        const vMat = new THREE.LineBasicMaterial({ color: BLUE, transparent: true, opacity: 0 });
        const pMat = new THREE.PointsMaterial({ color: GREEN, size: 0.14, transparent: true, opacity: 0 });
        const rMat = new THREE.LineDashedMaterial({
            color: GREEN, transparent: true, opacity: 0, dashSize: 0.22, gapSize: 0.18,
        });

        // Layer 0 — TIN terrain (displaced wireframe plane, echoes the hero)
        const terrainGeo = new THREE.PlaneGeometry(LAYER_W, LAYER_D, 10, 7);
        const pos = terrainGeo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            pos.setZ(i, 0.45 * Math.sin(x * 0.9 + 1) * Math.cos(y * 1.1) + 0.2 * (hash(i) - 0.5));
        }
        terrainGeo.computeVertexNormals();

        // Layer 1 — coordinate grid (clean lines, no diagonals)
        const gridPts: number[] = [];
        for (let i = 0; i <= 8; i++) {
            const x = -LAYER_W / 2 + (i / 8) * LAYER_W;
            gridPts.push(x, -LAYER_D / 2, 0, x, LAYER_D / 2, 0);
        }
        for (let j = 0; j <= 5; j++) {
            const y = -LAYER_D / 2 + (j / 5) * LAYER_D;
            gridPts.push(-LAYER_W / 2, y, 0, LAYER_W / 2, y, 0);
        }
        const gridGeo = new THREE.BufferGeometry();
        gridGeo.setAttribute("position", new THREE.Float32BufferAttribute(gridPts, 3));

        // Layer 2 — vector features: a meandering river + two road polylines
        const mkPolyline = (seed: number, segs: number) => {
            const pts: THREE.Vector3[] = [];
            for (let i = 0; i <= segs; i++) {
                const t = i / segs;
                pts.push(new THREE.Vector3(
                    -LAYER_W / 2 + t * LAYER_W,
                    (hash(seed) - 0.5) * LAYER_D * 0.5
                    + Math.sin(t * Math.PI * (2 + seed * 0.6) + seed) * LAYER_D * 0.18,
                    0
                ));
            }
            return new THREE.BufferGeometry().setFromPoints(pts);
        };
        const vectorGeos = [mkPolyline(1, 26), mkPolyline(3, 18), mkPolyline(6, 14)];

        // Layer 3 — POI points
        const poiPts: THREE.Vector3[] = [];
        for (let i = 0; i < 26; i++) {
            poiPts.push(new THREE.Vector3(
                (hash(i, 3) - 0.5) * LAYER_W * 0.92,
                (hash(i, 11) - 0.5) * LAYER_D * 0.92,
                0
            ));
        }
        const poiGeo = new THREE.BufferGeometry().setFromPoints(poiPts);

        // Corner rails the layers ride on
        const railGeos = ([[-1, -1], [1, -1], [-1, 1], [1, 1]] as const).map(([sx, sy]) => {
            const geo = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3((sx * LAYER_W) / 2, -1.1, (sy * LAYER_D) / 2),
                new THREE.Vector3((sx * LAYER_W) / 2, SEP * 3 + 1.1, (sy * LAYER_D) / 2),
            ]);
            return geo;
        });

        return {
            terrainMat: tMat, gridMat: gMat, vectorMat: vMat, poiMat: pMat, railMat: rMat,
            parts: { terrainGeo, gridGeo, vectorGeos, poiGeo, railGeos },
        };
    }, []);

    useVariant(
        fades,
        "skills",
        group,
        [terrainMat, gridMat, vectorMat, poiMat, railMat],
        [0.2, 0.13, 0.24, 0.55, 0.12],
        (g, _d, t) => {
            g.rotation.y = -0.5 + Math.sin(t * 0.07) * 0.1;
            // The stack breathes: layers drift apart and settle again
            const sep = SEP + Math.sin(t * 0.35) * 0.14;
            layersRef.current.forEach((layer, i) => {
                if (layer) layer.position.y = i * sep;
            });
        }
    );

    const layer = (i: number) => (el: THREE.Object3D | null) => {
        if (el) layersRef.current[i] = el;
    };

    return (
        <group ref={group} position={[5.2, -3, -8]} rotation={[0.38, -0.5, 0]} scale={0.9} visible={false}>
            {/* Rails */}
            {parts.railGeos.map((geo, i) => {
                const ln = new THREE.Line(geo, railMat);
                ln.computeLineDistances();
                // eslint-disable-next-line react/no-unknown-property
                return <primitive key={i} object={ln} />;
            })}
            {/* 0 · TIN terrain */}
            <mesh ref={layer(0)} geometry={parts.terrainGeo} material={terrainMat} rotation={[-Math.PI / 2, 0, 0]} />
            {/* 1 · Coordinate grid */}
            <group ref={layer(1)} rotation={[-Math.PI / 2, 0, 0]}>
                {/* eslint-disable-next-line react/no-unknown-property */}
                <primitive object={new THREE.LineSegments(parts.gridGeo, gridMat)} />
            </group>
            {/* 2 · Vector features */}
            <group ref={layer(2)} rotation={[-Math.PI / 2, 0, 0]}>
                {parts.vectorGeos.map((geo, i) => (
                    // eslint-disable-next-line react/no-unknown-property
                    <primitive key={i} object={new THREE.Line(geo, vectorMat)} />
                ))}
            </group>
            {/* 3 · POI points */}
            <group ref={layer(3)} rotation={[-Math.PI / 2, 0, 0]}>
                {/* eslint-disable-next-line react/no-unknown-property */}
                <primitive object={new THREE.Points(parts.poiGeo, poiMat)} />
            </group>
        </group>
    );
};

/* ---------- Experience: dashed survey route with marching fix ---------- */
const SurveyRoute = ({ fades }: { fades: Fades }) => {
    const group = useRef<THREE.Group>(null);
    const dotRef = useRef<THREE.Mesh>(null);
    const { curve, lineMat, waypointMat, line, waypointGeo, waypoints } = useMemo(() => {
        const knots = [
            new THREE.Vector3(-11, -4, -2), new THREE.Vector3(-6, -1, 1),
            new THREE.Vector3(-2, -3.5, -1), new THREE.Vector3(2, 0.5, 2),
            new THREE.Vector3(6, -2, -2), new THREE.Vector3(10, 2, 0),
        ];
        const c = new THREE.CatmullRomCurve3(knots);
        const geo = new THREE.BufferGeometry().setFromPoints(c.getPoints(140));
        const lm = new THREE.LineDashedMaterial({
            color: GREEN, transparent: true, opacity: 0, dashSize: 0.45, gapSize: 0.3,
        });
        const ln = new THREE.Line(geo, lm);
        ln.computeLineDistances();
        return {
            curve: c,
            lineMat: lm,
            waypointMat: new THREE.MeshBasicMaterial({ color: BLUE, transparent: true, opacity: 0, wireframe: true }),
            line: ln,
            waypointGeo: new THREE.OctahedronGeometry(0.22),
            waypoints: knots,
        };
    }, []);

    useVariant(fades, "experience", group, [lineMat, waypointMat], [0.22, 0.3], (_g, _d, t) => {
        if (dotRef.current) {
            dotRef.current.position.copy(curve.getPoint((t * 0.045) % 1));
        }
    });

    return (
        <group ref={group} position={[0, 1, -3]} rotation={[0.15, 0, 0.04]} visible={false}>
            {/* eslint-disable-next-line react/no-unknown-property */}
            <primitive object={line} />
            {waypoints.map((p, i) => (
                // eslint-disable-next-line react/no-unknown-property
                <mesh key={i} geometry={waypointGeo} material={waypointMat} position={p} />
            ))}
            <mesh ref={dotRef}>
                {/* eslint-disable-next-line react/no-unknown-property */}
                <sphereGeometry args={[0.14, 8, 8]} />
                {/* eslint-disable-next-line react/no-unknown-property */}
                <meshBasicMaterial color={GREEN} transparent opacity={0.7} />
            </mesh>
        </group>
    );
};

/* ---------- Projects: three floating point-cloud map tiles ---------- */
const PointTiles = ({ fades }: { fades: Fades }) => {
    const group = useRef<THREE.Group>(null);
    const { mat, tiles } = useMemo(() => {
        const m = new THREE.PointsMaterial({ color: GREEN, size: 0.07, transparent: true, opacity: 0 });
        const makeTile = (seed: number) => {
            const pts: THREE.Vector3[] = [];
            for (let gx = 0; gx < 14; gx++) {
                for (let gz = 0; gz < 14; gz++) {
                    const e = 0.5 * Math.sin(gx * 0.7 + seed) * Math.cos(gz * 0.6 + seed * 2)
                        + 0.25 * (hash(gx * 14 + gz, seed) - 0.5);
                    pts.push(new THREE.Vector3((gx - 6.5) * 0.5, e, (gz - 6.5) * 0.5));
                }
            }
            return new THREE.BufferGeometry().setFromPoints(pts);
        };
        return { mat: m, tiles: [makeTile(1), makeTile(5), makeTile(9)] };
    }, []);

    useVariant(fades, "projects", group, [mat], [0.45], (g, _d, t) => {
        g.children.forEach((child, i) => {
            child.rotation.y = t * 0.05 * (i % 2 === 0 ? 1 : -1);
            child.position.y = child.userData.y0 + Math.sin(t * 0.4 + i * 2) * 0.3;
        });
    });

    const placements: [number, number, number][] = [[-7, 2, -6], [6, -2, -4], [0, 4.5, -9]];

    return (
        <group ref={group} visible={false}>
            {tiles.map((geo, i) => {
                const pts = new THREE.Points(geo, mat);
                pts.position.set(...placements[i]);
                pts.userData.y0 = placements[i][1];
                pts.rotation.x = 0.35;
                // eslint-disable-next-line react/no-unknown-property
                return <primitive key={i} object={pts} />;
            })}
        </group>
    );
};

/* ---------- Certifications: tumbling wireframe polyhedra ---------- */
const Polyhedra = ({ fades }: { fades: Fades }) => {
    const group = useRef<THREE.Group>(null);
    const mat = useMemo(
        () => new THREE.MeshBasicMaterial({ color: GREEN, wireframe: true, transparent: true, opacity: 0 }),
        []
    );
    const shapes = useMemo(
        () => [
            { geo: new THREE.IcosahedronGeometry(1.4, 0), pos: [-8, 2.5, -5], sp: 0.1 },
            { geo: new THREE.OctahedronGeometry(1.0, 0), pos: [7, -2, -3], sp: -0.14 },
            { geo: new THREE.TetrahedronGeometry(0.9, 0), pos: [4, 4, -8], sp: 0.12 },
            { geo: new THREE.IcosahedronGeometry(0.7, 0), pos: [-4, -4, -6], sp: -0.09 },
        ] as const,
        []
    );

    useVariant(fades, "certifications", group, [mat], [0.14], (g, delta) => {
        g.children.forEach((child, i) => {
            child.rotation.x += delta * shapes[i].sp;
            child.rotation.y += delta * shapes[i].sp * 0.7;
        });
    });

    return (
        <group ref={group} visible={false}>
            {shapes.map((s, i) => (
                <mesh key={i} geometry={s.geo} material={mat} position={[...s.pos] as [number, number, number]} />
            ))}
        </group>
    );
};

/* ---------- Contact: horizon arc + comm arcs + signal dots ---------- */
const HorizonComms = ({ fades }: { fades: Fades }) => {
    const group = useRef<THREE.Group>(null);
    const dots = useRef<THREE.Mesh[]>([]);
    const { horizonMat, arcMat, horizon, arcs, arcCurves } = useMemo(() => {
        const hm = new THREE.LineBasicMaterial({ color: GREEN, transparent: true, opacity: 0 });
        const am = new THREE.LineBasicMaterial({ color: BLUE, transparent: true, opacity: 0 });
        // Planet-limb horizon low in the frame
        const hPts: THREE.Vector3[] = [];
        for (let i = 0; i <= 80; i++) {
            const a = Math.PI * (0.15 + 0.7 * (i / 80));
            hPts.push(new THREE.Vector3(Math.cos(a) * 24, -13.5 + Math.sin(a) * 7, -6));
        }
        const hGeo = new THREE.BufferGeometry().setFromPoints(hPts);
        const mkArc = (x1: number, x2: number, h: number) => {
            const a = new THREE.Vector3(x1, -7.2, -6);
            const b = new THREE.Vector3(x2, -7.2, -6);
            const mid = new THREE.Vector3((x1 + x2) / 2, -7.2 + h, -6);
            return new THREE.QuadraticBezierCurve3(a, mid, b);
        };
        const curves = [mkArc(-10, 2, 6.5), mkArc(-3, 11, 8.5), mkArc(-13, -4, 4.5)];
        return {
            horizonMat: hm,
            arcMat: am,
            horizon: new THREE.Line(hGeo, hm),
            arcs: curves.map((c) => new THREE.Line(new THREE.BufferGeometry().setFromPoints(c.getPoints(48)), am)),
            arcCurves: curves,
        };
    }, []);

    useVariant(fades, "contact", group, [horizonMat, arcMat], [0.2, 0.16], (_g, _d, t) => {
        dots.current.forEach((dot, i) => {
            if (dot) dot.position.copy(arcCurves[i].getPoint((t * 0.09 + i * 0.33) % 1));
        });
    });

    return (
        <group ref={group} visible={false}>
            {/* eslint-disable-next-line react/no-unknown-property */}
            <primitive object={horizon} />
            {arcs.map((a, i) => (
                // eslint-disable-next-line react/no-unknown-property
                <primitive key={i} object={a} />
            ))}
            {arcCurves.map((_, i) => (
                <mesh key={i} ref={(el) => { if (el) dots.current[i] = el; }}>
                    {/* eslint-disable-next-line react/no-unknown-property */}
                    <sphereGeometry args={[0.12, 8, 8]} />
                    {/* eslint-disable-next-line react/no-unknown-property */}
                    <meshBasicMaterial color={GREEN} transparent opacity={0.65} />
                </mesh>
            ))}
        </group>
    );
};

/* ---------- Conductor: eases fades, drives camera parallax ---------- */
const AmbientScene = ({ activeRef }: { activeRef: MutableRefObject<string> }) => {
    const fades = useRef<Record<string, number>>({
        about: 0, skills: 0, experience: 0, projects: 0, certifications: 0, contact: 0,
    });

    useFrame((state, delta) => {
        const active = activeRef.current;
        const k = Math.min(1, delta * 2.2);
        for (const key of Object.keys(fades.current)) {
            const target = key === active ? 1 : 0;
            fades.current[key] += (target - fades.current[key]) * k;
        }
        // Gentle mouse parallax, shared by every scene
        state.camera.position.x += (state.pointer.x * 0.7 - state.camera.position.x) * 0.03;
        state.camera.position.y += (state.pointer.y * 0.4 - state.camera.position.y) * 0.03;
        state.camera.lookAt(0, 0, -4);
    });

    return (
        <>
            <ContourRings fades={fades} />
            <LayerStack fades={fades} />
            <SurveyRoute fades={fades} />
            <PointTiles fades={fades} />
            <Polyhedra fades={fades} />
            <HorizonComms fades={fades} />
        </>
    );
};

interface AmbientBackgroundProps {
    activeSection: string;
}

const AmbientBackground = ({ activeSection }: AmbientBackgroundProps) => {
    // Ref, not prop-drilling: section changes must not re-render the canvas tree
    const activeRef = useRef(activeSection);
    activeRef.current = activeSection;

    return (
        <div className="fixed inset-0 -z-10 pointer-events-none" aria-hidden>
            <Canvas
                dpr={[1, 1.5]}
                camera={{ position: [0, 0, 11], fov: 50 }}
                gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
                style={{ background: "transparent" }}
            >
                <AmbientScene activeRef={activeRef} />
            </Canvas>
        </div>
    );
};

export default AmbientBackground;
