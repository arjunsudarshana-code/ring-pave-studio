import { useRef, useMemo } from 'react';
import * as THREE from 'three';

export interface GemstoneMeshProps {
  position: [number, number, number];
  normal: [number, number, number];
  size: number;
  metalColor: string;
}

export function GemstoneMesh({ position, normal, size, metalColor }: GemstoneMeshProps) {
  const groupRef = useRef<THREE.Group>(null);

  const quaternion = useMemo(() => {
    const q = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);
    const norm = new THREE.Vector3(...normal).normalize();
    q.setFromUnitVectors(up, norm);
    return q;
  }, [normal]);

  const scale = size / 2;

  return (
    <group ref={groupRef} position={position} quaternion={quaternion}>
      <mesh position={[0, scale * 0.15, 0]} scale={[scale, scale, scale]}>
        <coneGeometry args={[1, 1.2, 8]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={0.95}
          opacity={1}
          transparent
          roughness={0}
          ior={2.417}
          reflectivity={0.9}
          dispersion={0.05}
        />
      </mesh>

      {[-0.7, 0.7].map((x) =>
        [-0.7, 0.7].map((z) => (
          <mesh key={`${x}-${z}`} position={[x * scale * 0.9, scale * 0.25, z * scale * 0.9]}>
            <cylinderGeometry args={[scale * 0.12, scale * 0.12, scale * 0.7, 8]} />
            <meshStandardMaterial color={metalColor} metalness={0.9} roughness={0.15} />
          </mesh>
        ))
      )}
    </group>
  );
}