import React, { useMemo } from 'react';
import * as THREE from 'three';
import { SUBTRACTION, Brush, Evaluator } from 'three-bvh-csg';
import type { PlacedGem, ProfileShape } from '../../types/cad';

export interface RingProps {
  innerRadius: number;
  bandWidth: number;
  thickness: number;
  profileShape: ProfileShape;
  metalColor: string;
  roughness: number;
  metalness: number;
  wireframe: boolean;
  onSurfaceClick: (point: THREE.Vector3, normal: THREE.Vector3) => void;
  isAutoPaveMode: boolean;
  paveModeType: 'manual' | 'array';
  ringMeshRef: React.RefObject<THREE.Mesh | null> | any;
  gems: PlacedGem[];
}

export function ParametricRing({
  innerRadius, bandWidth, thickness, profileShape, metalColor,
  roughness, metalness, wireframe, onSurfaceClick, isAutoPaveMode,
  paveModeType, ringMeshRef, gems
}: RingProps) {

  const geometry = useMemo(() => {
    const outerRadius = innerRadius + thickness;
    const halfWidth = bandWidth / 2;
    let points: THREE.Vector2[] = [];

    if (profileShape === 'flat') {
      points = [
        new THREE.Vector2(innerRadius, -halfWidth),
        new THREE.Vector2(outerRadius, -halfWidth),
        new THREE.Vector2(outerRadius, halfWidth),
        new THREE.Vector2(innerRadius, halfWidth),
        new THREE.Vector2(innerRadius, -halfWidth),
      ];
    } else if (profileShape === 'knife') {
      points = [
        new THREE.Vector2(innerRadius, -halfWidth),
        new THREE.Vector2(outerRadius, 0),
        new THREE.Vector2(innerRadius, halfWidth),
        new THREE.Vector2(innerRadius, -halfWidth),
      ];
    } else {
      points = [
        new THREE.Vector2(innerRadius, -halfWidth),
        new THREE.Vector2(outerRadius - 0.2, -halfWidth),
        new THREE.Vector2(outerRadius, -halfWidth + 0.3),
        new THREE.Vector2(outerRadius, halfWidth - 0.3),
        new THREE.Vector2(outerRadius - 0.2, halfWidth),
        new THREE.Vector2(innerRadius, halfWidth),
        new THREE.Vector2(innerRadius, -halfWidth),
      ];
    }

    const latheGeom = new THREE.LatheGeometry(points, 128);
    latheGeom.computeVertexNormals();

    if (gems.length === 0) return latheGeom;

    try {
      const evaluator = new Evaluator();
      let baseBrush = new Brush(latheGeom);
      baseBrush.updateMatrixWorld();

      gems.forEach((gem) => {
        const seatRadius = gem.size / 2;
        const holeRadius = seatRadius * 0.6;
        const seatDepth = thickness * 1.5;

        const cutterProfile = [
          new THREE.Vector2(0, -seatDepth),
          new THREE.Vector2(holeRadius, -seatDepth),
          new THREE.Vector2(holeRadius, -seatDepth * 0.4),
          new THREE.Vector2(seatRadius * 1.05, 0.2),
          new THREE.Vector2(0, 0.2),
        ];

        const cutterGeom = new THREE.LatheGeometry(cutterProfile, 24);
        const cutterBrush = new Brush(cutterGeom);

        const pos = new THREE.Vector3(...gem.position);
        const norm = new THREE.Vector3(...gem.normal).normalize();
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), norm);

        cutterBrush.position.copy(pos);
        cutterBrush.quaternion.copy(q);
        cutterBrush.updateMatrixWorld();

        baseBrush = evaluator.evaluate(baseBrush, cutterBrush, SUBTRACTION);
      });

      return baseBrush.geometry;
    } catch (e) {
      console.warn("CSG Subtraction error, fallback to base", e);
      return latheGeom;
    }

  }, [innerRadius, bandWidth, thickness, profileShape, gems]);

  const handleClick = (e: any) => {
    if (!isAutoPaveMode || paveModeType !== 'manual') return;
    e.stopPropagation();
    if (e.point && e.face && ringMeshRef.current) {
      const worldNormal = e.face.normal.clone().transformDirection(ringMeshRef.current.matrixWorld);
      onSurfaceClick(e.point, worldNormal);
    }
  };

  return (
    <mesh
      ref={ringMeshRef}
      geometry={geometry}
      castShadow
      receiveShadow
      onClick={handleClick}
    >
      <meshStandardMaterial
        color={metalColor}
        metalness={metalness}
        roughness={roughness}
        wireframe={wireframe}
        envMapIntensity={2.5}
      />
    </mesh>
  );
}