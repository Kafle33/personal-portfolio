import { MutableRefObject, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * The guide drone — a procedural sci-fi survey quad that escorts visitors
 * through the portfolio. It patrols an anchor per section (flying over when
 * the section changes), head-tracks the cursor when approached, eases away
 * if crowded, banks into its motion, fires LiDAR pulses on arrival, and
 * unfolds a small holographic readout when idle.
 *
 * Fully procedural (no model asset), one draw batch of simple primitives,
 * desktop + high-performance devices only.
 */

const HULL = "#16241d";
const GREEN = "#12c285";
const CYAN = "#67e8f9";

/** Patrol anchors per section, in viewport fractions (x from left, y from top) */
const ANCHORS: Record<string, [number, number]> = {
    hero: [0.62, 0.16],
    about: [0.10, 0.62],
    skills: [0.88, 0.50],
    experience: [0.10, 0.42],
    projects: [0.88, 0.26],
    certifications: [0.12, 0.38],
    contact: [0.86, 0.55],
};

interface DroneState {
    pos: THREE.Vector3;
    vel: THREE.Vector3;
    mouse: THREE.Vector3;
    hasMouse: boolean;
    lastSection: string;
    arrived: boolean;
    idleTime: number;
    scanStart: number;
    holoOpacity: number;
    spawn: number;
}

const RotorPod = ({ position }: { position: [number, number, number] }) => (
    <group position={position}>
        {/* Duct ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
            {/* eslint-disable-next-line react/no-unknown-property */}
            <torusGeometry args={[0.17, 0.022, 6, 18]} />
            {/* eslint-disable-next-line react/no-unknown-property */}
            <meshStandardMaterial color={HULL} metalness={0.6} roughness={0.4} flatShading />
        </mesh>
        {/* Spinning blades (tagged for the frame loop) */}
        <group name="rotor">
            {[0, Math.PI / 2].map((r) => (
                <mesh key={r} rotation={[0, r, 0]}>
                    {/* eslint-disable-next-line react/no-unknown-property */}
                    <boxGeometry args={[0.30, 0.008, 0.035]} />
                    {/* eslint-disable-next-line react/no-unknown-property */}
                    <meshStandardMaterial color="#2b4438" metalness={0.4} roughness={0.5} />
                </mesh>
            ))}
        </group>
        {/* Motion-blur disc */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
            {/* eslint-disable-next-line react/no-unknown-property */}
            <circleGeometry args={[0.16, 20]} />
            {/* eslint-disable-next-line react/no-unknown-property */}
            <meshBasicMaterial color={GREEN} transparent opacity={0.07} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
    </group>
);

const DroneModel = () => (
    <group>
        {/* Hull — flattened faceted body */}
        <mesh scale={[1.35, 0.42, 1.0]}>
            {/* eslint-disable-next-line react/no-unknown-property */}
            <sphereGeometry args={[0.34, 8, 5]} />
            {/* eslint-disable-next-line react/no-unknown-property */}
            <meshStandardMaterial color={HULL} metalness={0.65} roughness={0.35} flatShading />
        </mesh>
        {/* Visor — the scanner eye, faces the viewer */}
        <mesh position={[0, 0.02, 0.30]}>
            {/* eslint-disable-next-line react/no-unknown-property */}
            <boxGeometry args={[0.26, 0.05, 0.06]} />
            {/* eslint-disable-next-line react/no-unknown-property */}
            <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={2.2} toneMapped={false} />
        </mesh>
        {/* Spine accent */}
        <mesh position={[0, 0.13, 0]}>
            {/* eslint-disable-next-line react/no-unknown-property */}
            <boxGeometry args={[0.08, 0.02, 0.5]} />
            {/* eslint-disable-next-line react/no-unknown-property */}
            <meshStandardMaterial color={GREEN} emissive={GREEN} emissiveIntensity={1.6} toneMapped={false} />
        </mesh>
        {/* Arms */}
        {[45, 135, 225, 315].map((deg) => (
            <mesh key={deg} rotation={[0, (deg * Math.PI) / 180, 0]} position={[
                Math.cos((deg * Math.PI) / 180) * 0.33,
                0,
                Math.sin((deg * Math.PI) / 180) * 0.33,
            ]}>
                {/* eslint-disable-next-line react/no-unknown-property */}
                <boxGeometry args={[0.06, 0.03, 0.36]} />
                {/* eslint-disable-next-line react/no-unknown-property */}
                <meshStandardMaterial color={HULL} metalness={0.6} roughness={0.4} flatShading />
            </mesh>
        ))}
        {/* Rotor pods */}
        <RotorPod position={[0.52, 0.03, 0.52]} />
        <RotorPod position={[-0.52, 0.03, 0.52]} />
        <RotorPod position={[0.52, 0.03, -0.52]} />
        <RotorPod position={[-0.52, 0.03, -0.52]} />
        {/* Aviation nav lights: port red, starboard green */}
        <mesh position={[-0.52, 0.09, 0.52]} name="navL">
            {/* eslint-disable-next-line react/no-unknown-property */}
            <sphereGeometry args={[0.025, 6, 6]} />
            {/* eslint-disable-next-line react/no-unknown-property */}
            <meshBasicMaterial color="#f87171" toneMapped={false} />
        </mesh>
        <mesh position={[0.52, 0.09, 0.52]} name="navR">
            {/* eslint-disable-next-line react/no-unknown-property */}
            <sphereGeometry args={[0.025, 6, 6]} />
            {/* eslint-disable-next-line react/no-unknown-property */}
            <meshBasicMaterial color="#4ade80" toneMapped={false} />
        </mesh>
        {/* Tail strobe */}
        <mesh position={[0, 0.05, -0.36]} name="strobe">
            {/* eslint-disable-next-line react/no-unknown-property */}
            <sphereGeometry args={[0.03, 6, 6]} />
            {/* eslint-disable-next-line react/no-unknown-property */}
            <meshBasicMaterial color="#ffffff" transparent opacity={0} toneMapped={false} />
        </mesh>
        {/* Sensor gimbal */}
        <group position={[0, -0.17, 0.05]}>
            <mesh>
                {/* eslint-disable-next-line react/no-unknown-property */}
                <sphereGeometry args={[0.09, 8, 6]} />
                {/* eslint-disable-next-line react/no-unknown-property */}
                <meshStandardMaterial color={HULL} metalness={0.7} roughness={0.3} flatShading />
            </mesh>
            <mesh position={[0, -0.02, 0.07]}>
                {/* eslint-disable-next-line react/no-unknown-property */}
                <sphereGeometry args={[0.028, 6, 6]} />
                {/* eslint-disable-next-line react/no-unknown-property */}
                <meshBasicMaterial color={CYAN} toneMapped={false} />
            </mesh>
        </group>
    </group>
);

/** Small holographic readout that unfolds beside the drone when idle */
const HoloPanel = () => (
    <group name="holo" position={[0.85, 0.15, 0]}>
        {[0, 1, 2].map((i) => (
            <mesh key={i} position={[0.12 * (i - 1) * 0 + 0, 0.1 - i * 0.1, 0]}>
                {/* eslint-disable-next-line react/no-unknown-property */}
                <planeGeometry args={[0.34 - i * 0.08, 0.03]} />
                {/* eslint-disable-next-line react/no-unknown-property */}
                <meshBasicMaterial color={CYAN} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
            </mesh>
        ))}
        <mesh position={[-0.28, 0, 0]}>
            {/* eslint-disable-next-line react/no-unknown-property */}
            <ringGeometry args={[0.07, 0.085, 20]} />
            {/* eslint-disable-next-line react/no-unknown-property */}
            <meshBasicMaterial color={CYAN} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
    </group>
);

/** Expanding LiDAR ring fired beneath the drone */
const LidarRing = () => (
    <mesh name="lidar" rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]}>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <ringGeometry args={[0.42, 0.46, 32]} />
        {/* eslint-disable-next-line react/no-unknown-property */}
        <meshBasicMaterial color={GREEN} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
);

const DroneRig = ({ activeRef }: { activeRef: MutableRefObject<string> }) => {
    const rigRef = useRef<THREE.Group>(null);
    const bodyRef = useRef<THREE.Group>(null);

    const state = useRef<DroneState>({
        pos: new THREE.Vector3(20, 4, 0),
        vel: new THREE.Vector3(),
        mouse: new THREE.Vector3(999, 999, 0),
        hasMouse: false,
        lastSection: "hero",
        arrived: false,
        idleTime: 0,
        scanStart: -10,
        holoOpacity: 0,
        spawn: -1,
    });

    // Cursor tracked as viewport fractions; converted to world in the frame loop
    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            const s = state.current;
            s.hasMouse = true;
            s.mouse.set(e.clientX / window.innerWidth, e.clientY / window.innerHeight, 0);
        };
        window.addEventListener("mousemove", onMove, { passive: true });
        return () => window.removeEventListener("mousemove", onMove);
    }, []);

    useFrame((three, delta) => {
        const rig = rigRef.current;
        const body = bodyRef.current;
        if (!rig || !body) return;
        const s = state.current;
        const t = three.clock.elapsedTime;
        const dt = Math.min(delta, 0.05);
        const { width: vw, height: vh } = three.viewport;

        if (s.spawn < 0) s.spawn = t;

        // --- Anchor for the active section (viewport fractions → world) ---
        const frac = ANCHORS[activeRef.current] ?? ANCHORS.hero;
        const anchor = new THREE.Vector3((frac[0] - 0.5) * vw, (0.5 - frac[1]) * vh, 0);

        if (activeRef.current !== s.lastSection) {
            s.lastSection = activeRef.current;
            s.arrived = false;
            s.idleTime = 0;
        }

        // --- Cursor interaction ---
        const mouseWorld = new THREE.Vector3((s.mouse.x - 0.5) * vw, (0.5 - s.mouse.y) * vh, 0);
        const mouseDist = s.hasMouse ? s.pos.distanceTo(mouseWorld) : 999;

        // Ease away when crowded
        if (mouseDist < 1.6) {
            const flee = s.pos.clone().sub(mouseWorld).normalize().multiplyScalar(4.5 * dt);
            s.vel.add(flee);
            s.idleTime = 0;
        }

        // --- Spring toward anchor, damped ---
        const toAnchor = anchor.clone().sub(s.pos);
        s.vel.add(toAnchor.multiplyScalar(2.1 * dt));
        s.vel.multiplyScalar(Math.max(0, 1 - 2.6 * dt));
        s.pos.add(s.vel.clone().multiplyScalar(dt * 60 * 0.016 * 3.2));

        // Keep it on screen
        s.pos.x = THREE.MathUtils.clamp(s.pos.x, -vw / 2 + 0.8, vw / 2 - 0.8);
        s.pos.y = THREE.MathUtils.clamp(s.pos.y, -vh / 2 + 0.8, vh / 2 - 0.8);

        // Arrival → LiDAR inspection pulse
        const distToAnchor = s.pos.distanceTo(anchor);
        if (!s.arrived && distToAnchor < 0.5 && s.vel.length() < 0.6) {
            s.arrived = true;
            s.scanStart = t;
        }

        // Hover bob
        const bob = Math.sin(t * 1.7) * 0.07 + Math.sin(t * 0.61) * 0.04;
        rig.position.set(s.pos.x, s.pos.y + bob, 0);

        // Spawn scale-in
        const spawnK = THREE.MathUtils.smoothstep(Math.min(1, (t - s.spawn) / 1.2), 0, 1);
        rig.scale.setScalar(0.55 * spawnK);

        // --- Attitude: bank into motion, head-track the cursor nearby ---
        const speed = s.vel.length();
        const bankZ = THREE.MathUtils.clamp(-s.vel.x * 0.22, -0.5, 0.5);
        const bankX = THREE.MathUtils.clamp(s.vel.y * 0.16, -0.35, 0.35);
        let lookYaw = Math.sin(t * 0.4) * 0.18; // idle sway
        let lookPitch = 0;
        if (mouseDist < 4.2 && s.hasMouse) {
            const dx = mouseWorld.x - s.pos.x;
            const dy = mouseWorld.y - s.pos.y;
            lookYaw = THREE.MathUtils.clamp(dx * 0.22, -0.65, 0.65);
            lookPitch = THREE.MathUtils.clamp(-dy * 0.2, -0.45, 0.45);
            s.idleTime = 0;
        }
        body.rotation.z += (bankZ - body.rotation.z) * Math.min(1, dt * 6);
        body.rotation.x += (bankX + lookPitch - body.rotation.x) * Math.min(1, dt * 5);
        body.rotation.y += (lookYaw - body.rotation.y) * Math.min(1, dt * 5);

        // --- Animated parts ---
        body.traverse((child) => {
            if (child.name === "rotor") child.rotation.y += dt * 38;
        });

        const strobe = body.getObjectByName("strobe") as THREE.Mesh | undefined;
        if (strobe) {
            const phase = t % 1.6;
            (strobe.material as THREE.MeshBasicMaterial).opacity = phase < 0.09 || (phase > 0.18 && phase < 0.27) ? 1 : 0;
        }

        // LiDAR pulse: on arrival, then every ~9s while idle
        if (s.arrived && t - s.scanStart > 9) s.scanStart = t;
        const lidar = rig.getObjectByName("lidar") as THREE.Mesh | undefined;
        if (lidar) {
            const k = (t - s.scanStart) / 1.4;
            if (k >= 0 && k < 1) {
                lidar.visible = true;
                lidar.scale.setScalar(0.3 + k * 2.6);
                (lidar.material as THREE.MeshBasicMaterial).opacity = (1 - k) * 0.5;
            } else {
                lidar.visible = false;
            }
        }

        // Holographic readout after a few calm seconds
        if (speed < 0.25 && mouseDist > 4.2) s.idleTime += dt;
        const holoTarget = s.idleTime > 3.5 ? 1 : 0;
        s.holoOpacity += (holoTarget - s.holoOpacity) * Math.min(1, dt * 3);
        const holo = rig.getObjectByName("holo") as THREE.Group | undefined;
        if (holo) {
            holo.visible = s.holoOpacity > 0.02;
            holo.position.y = 0.15 + Math.sin(t * 1.1) * 0.03;
            holo.children.forEach((child, i) => {
                const m = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
                m.opacity = s.holoOpacity * (0.5 - i * 0.08);
            });
        }
    });

    return (
        <group ref={rigRef} scale={0}>
            <group ref={bodyRef}>
                <DroneModel />
            </group>
            <LidarRing />
            <HoloPanel />
        </group>
    );
};

interface DroneCompanionProps {
    activeSection: string;
}

const DroneCompanion = ({ activeSection }: DroneCompanionProps) => {
    const activeRef = useRef(activeSection);
    activeRef.current = activeSection;

    return (
        <div className="fixed inset-0 z-30 pointer-events-none" aria-hidden>
            <Canvas
                dpr={[1, 1.5]}
                camera={{ position: [0, 0, 11], fov: 50 }}
                gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
                style={{ background: "transparent" }}
            >
                {/* eslint-disable-next-line react/no-unknown-property */}
                <ambientLight intensity={0.55} />
                {/* eslint-disable-next-line react/no-unknown-property */}
                <directionalLight position={[3, 5, 6]} intensity={1.3} />
                <DroneRig activeRef={activeRef} />
            </Canvas>
        </div>
    );
};

export default DroneCompanion;
