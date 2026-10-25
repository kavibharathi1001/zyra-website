import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function FashionOrb() {
  const orb = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (orb.current) {
      orb.current.rotation.y += delta * 0.15;
      orb.current.rotation.x = THREE.MathUtils.lerp(
        orb.current.rotation.x,
        state.pointer.y * 0.16,
        0.04
      );
      orb.current.rotation.z = THREE.MathUtils.lerp(
        orb.current.rotation.z,
        -state.pointer.x * 0.12,
        0.04
      );
    }

    if (ring.current) {
      ring.current.rotation.x += delta * 0.08;
      ring.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group>
      <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.35}>
        <mesh ref={orb}>
          <icosahedronGeometry args={[1.25, 5]} />
          <meshPhysicalMaterial
            color="#073b29"
            metalness={0.8}
            roughness={0.22}
            emissive="#003d28"
            emissiveIntensity={0.7}
            clearcoat={1}
            clearcoatRoughness={0.12}
          />
        </mesh>

        <mesh ref={ring} rotation={[1.1, 0.2, 0.3]}>
          <torusGeometry args={[1.7, 0.009, 12, 180]} />
          <meshBasicMaterial
            color="#00e5a0"
            transparent
            opacity={0.75}
          />
        </mesh>

        <mesh rotation={[0.8, 0.5, 0]}>
          <torusGeometry args={[1.9, 0.004, 8, 180]} />
          <meshBasicMaterial
            color="#a2ffd9"
            transparent
            opacity={0.4}
          />
        </mesh>
      </Float>

      <Sparkles
        count={65}
        scale={5}
        size={2}
        speed={0.25}
        color="#78ffd0"
      />
    </group>
  );
}

export default function FashionScene() {
  return (
    <div className="fashion-scene">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 38 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.1} />
        <pointLight position={[3, 3, 4]} intensity={35} color="#00e5a0" />
        <pointLight position={[-3, -2, 2]} intensity={15} color="#a2ffd9" />

        <FashionOrb />
      </Canvas>
    </div>
  );
}
