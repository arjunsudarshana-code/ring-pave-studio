import React, { useMemo } from 'react';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Ruler } from 'lucide-react';
import type { PlacedGem } from '../../types/cad';

export function GemDistanceOverlay({ gemA, gemB }: { gemA: PlacedGem; gemB: PlacedGem }) {
  const p1 = useMemo(() => new THREE.Vector3(...gemA.position), [gemA]);
  const p2 = useMemo(() => new THREE.Vector3(...gemB.position), [gemB]);

  const midPoint = useMemo(() => p1.clone().add(p2).multiplyScalar(0.5), [p1, p2]);
  const distance = useMemo(() => p1.distanceTo(p2), [p1, p2]);
  const clearance = useMemo(() => distance - (gemA.size / 2 + gemB.size / 2), [distance, gemA, gemB]);

  const isTooClose = clearance < 0.2;
  const lineColor = isTooClose ? '#ef4444' : '#10b981';

  return (
    <group>
      <Line points={[p1, p2]} color={lineColor} lineWidth={3} dashed dashScale={5} />

      <Html position={midPoint} center>
        <div className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold shadow-2xl flex items-center gap-1 backdrop-blur-xl border border-slate-800 ${
          isTooClose ? 'bg-red-950/90 text-red-400 border-red-500/50 animate-bounce' : 'bg-slate-900/90 text-emerald-400 border-emerald-500/40'
        }`}>
          <Ruler className="w-3 h-3" />
          <span>Gap: {clearance.toFixed(2)} mm</span>
          {isTooClose && <span className="text-[9px] bg-red-500 text-slate-950 px-1 rounded font-black">RISK</span>}
        </div>
      </Html>
    </group>
  );
}