import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = /* glsl */ `
    uniform float uTime;
    varying float vElevation;
    varying float vDistance;

    // Simplex-style value noise (cheap, good enough for a wireframe ridge field)
    vec2 hash(vec2 p) {
        p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
        return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
    }

    float noise(vec2 p) {
        const float K1 = 0.366025404;
        const float K2 = 0.211324865;
        vec2 i = floor(p + (p.x + p.y) * K1);
        vec2 a = p - i + (i.x + i.y) * K2;
        vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec2 b = a - o + K2;
        vec2 c = a - 1.0 + 2.0 * K2;
        vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
        vec3 n = h * h * h * h * vec3(dot(a, hash(i)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
        return dot(n, vec3(70.0));
    }

    float fbm(vec2 p) {
        float v = 0.0;
        float amp = 0.55;
        for (int i = 0; i < 4; i++) {
            v += amp * noise(p);
            p *= 2.1;
            amp *= 0.45;
        }
        return v;
    }

    void main() {
        vec3 pos = position;
        // Drift the terrain slowly toward the camera for a "flyover" feel
        vec2 samplePos = vec2(pos.x * 0.09, pos.y * 0.09 + uTime * 0.035);
        float elevation = fbm(samplePos);
        // Flatten a valley through the middle so ridges frame the content
        float valley = smoothstep(1.5, 9.0, abs(pos.x));
        elevation *= mix(0.3, 1.0, valley);
        pos.z = elevation * 7.5;

        vElevation = elevation;
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        vDistance = -mvPosition.z;
        gl_Position = projectionMatrix * mvPosition;
    }
`;

const fragmentShader = /* glsl */ `
    uniform vec3 uColorLow;
    uniform vec3 uColorHigh;
    uniform float uOpacity;
    varying float vElevation;
    varying float vDistance;

    void main() {
        float t = smoothstep(-0.2, 0.9, vElevation);
        vec3 color = mix(uColorLow, uColorHigh, t);
        // Fade toward the horizon like atmospheric haze
        float fade = 1.0 - smoothstep(26.0, 62.0, vDistance);
        gl_FragColor = vec4(color, uOpacity * fade * (0.4 + 0.6 * t));
    }
`;

const TerrainMesh = () => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uColorLow: { value: new THREE.Color("#1b7a55") },
            uColorHigh: { value: new THREE.Color("#3ff2b5") },
            uOpacity: { value: 0.72 },
        }),
        []
    );

    useFrame((state, delta) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value += delta;
        }
        // Gentle mouse parallax on the camera
        const px = state.pointer.x * 1.6;
        const py = state.pointer.y * 0.8;
        state.camera.position.x += (px - state.camera.position.x) * 0.03;
        state.camera.position.y += (6.5 + py - state.camera.position.y) * 0.03;
        state.camera.lookAt(0, 0, -18);
    });

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -20]}>
            <planeGeometry args={[90, 70, 110, 85]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                wireframe
                transparent
                depthWrite={false}
            />
        </mesh>
    );
};

/**
 * Wireframe terrain flyover rendered behind the hero content.
 * Lazy-loaded; only mounted on high-performance, motion-friendly devices.
 */
const TerrainBackdrop = () => {
    return (
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <Canvas
                dpr={[1, 1.5]}
                camera={{ position: [0, 6.5, 14], fov: 50, near: 0.1, far: 120 }}
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                style={{ background: "transparent", pointerEvents: "none" }}
            >
                <TerrainMesh />
            </Canvas>
            {/* Soften the terrain into the next section */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </div>
    );
};

export default TerrainBackdrop;
