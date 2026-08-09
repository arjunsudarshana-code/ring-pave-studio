import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Grid, GizmoHelper, GizmoViewport, Html } from '@react-three/drei';
import * as THREE from 'three';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';
import { Diamond, Eye, Grid as GridIcon, Shapes, Scissors, Download, Activity, Layers, Cpu, AlertTriangle, ShieldCheck } from 'lucide-react';

import type { PlacedGem, ProfileShape, MetalType, PaveModeType } from './types/cad';
import { GemstoneMesh } from './components/3d/GemstoneMesh';
import { GemDistanceOverlay } from './components/3d/GemDistanceOverlay';
import { ParametricRing } from './components/3d/ParametricRing';
import { Sidebar } from './components/ui/Sidebar';

export default function App() {
  const ringMeshRef = useRef<THREE.Mesh>(null);
  const controlsRef = useRef<any>(null);

  // States
  const [innerRadius, setInnerRadius] = useState<number>(8.5);
  const [bandWidth, setBandWidth] = useState<number>(6.0);
  const [thickness, setThickness] = useState<number>(1.8);
  const [profileShape, setProfileShape] = useState<ProfileShape>('flat');
  const [metalType, setMetalType] = useState<MetalType>('platinum');

  const [wireframe, setWireframe] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'geometry' | 'pave'>('geometry');

  const [isAutoPaveMode, setIsAutoPaveMode] = useState<boolean>(false);
  const [paveModeType, setPaveModeType] = useState<PaveModeType>('array');
  const [arrayGemCount, setArrayGemCount] = useState<number>(14);
  const [arrayCoverage, setArrayCoverage] = useState<number>(180);
  const [gemSize, setGemSize] = useState<number>(1.8);
  const [gems, setGems] = useState<PlacedGem[]>([]);

  const metals = {
    yellow: { color: '#FFD700', pricePerGram: 68 },
    rose: { color: '#B76E79', pricePerGram: 66 },
    platinum: { color: '#E5E4E2', pricePerGram: 82 },
  };

  // Radial Array Effect
  useEffect(() => {
    if (!isAutoPaveMode || paveModeType !== 'array') return;
    const outerRadius = innerRadius + thickness;
    const generatedGems: PlacedGem[] = [];
    const totalAngle = (arrayCoverage * Math.PI) / 180;
    const isFullCircle = arrayCoverage === 360;
    const angleStep = isFullCircle ? totalAngle / arrayGemCount : totalAngle / Math.max(1, arrayGemCount - 1);
    const startAngle = isFullCircle ? 0 : -totalAngle / 2;

    for (let i = 0; i < arrayGemCount; i++) {
      const angle = startAngle + i * angleStep;
      const x = outerRadius * Math.cos(angle);
      const z = outerRadius * Math.sin(angle);
      const norm = new THREE.Vector3(x, 0, z).normalize();

      generatedGems.push({
        id: `array-${i}-${Math.random().toString(36).substring(2, 6)}`,
        position: [x, 0, z],
        normal: [norm.x, norm.y, norm.z],
        size: gemSize,
      });
    }
    setGems(generatedGems);
  }, [isAutoPaveMode, paveModeType, arrayGemCount, arrayCoverage, innerRadius, thickness, gemSize]);

  // Closest Pair Clearance
  const closestPairInfo = useMemo(() => {
    if (gems.length < 2) return null;
    let minClearance = Infinity;
    let pair: [PlacedGem, PlacedGem] | null = null;

    for (let i = 0; i < gems.length; i++) {
      for (let j = i + 1; j < gems.length; j++) {
        const g1 = gems[i]; const g2 = gems[j];
        const dist = new THREE.Vector3(...g1.position).distanceTo(new THREE.Vector3(...g2.position));
        const clearance = dist - (g1.size / 2 + g2.size / 2);
        if (clearance < minClearance) { minClearance = clearance; pair = [g1, g2]; }
      }
    }
    return pair ? { clearance: minClearance, pair } : null;
  }, [gems]);

  // Metrics
  const ringVolume = useMemo(() => {
    return ((Math.PI * ((innerRadius + thickness) ** 2 - innerRadius ** 2) * bandWidth) / 1000).toFixed(2);
  }, [innerRadius, bandWidth, thickness]);

  const estimatedWeightGrams = useMemo(() => {
    return (Math.PI * ((innerRadius + thickness) ** 2 - innerRadius ** 2) * bandWidth * 0.0155).toFixed(2);
  }, [innerRadius, bandWidth, thickness]);

  const totalCaratWeight = useMemo(() => {
    return gems.reduce((acc, gem) => acc + Math.pow(gem.size, 3) * 0.0037, 0).toFixed(2);
  }, [gems]);

  const totalB2BCost = useMemo(() => {
    return (parseFloat(estimatedWeightGrams) * metals[metalType].pricePerGram + parseFloat(totalCaratWeight) * 850 + 120).toFixed(2);
  }, [estimatedWeightGrams, totalCaratWeight, metalType]);

  const handleSurfaceClick = (point: THREE.Vector3, normal: THREE.Vector3) => {
    setGems((prev) => [...prev, {
      id: Math.random().toString(36).substring(2, 9),
      position: [point.x, point.y, point.z],
      normal: [normal.x, normal.y, normal.z],
      size: gemSize,
    }]);
  };

  const handleExportSTL = () => {
    if (!ringMeshRef.current) return;
    const exporter = new STLExporter();
    const result = exporter.parse(ringMeshRef.current, { binary: true });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([result], { type: 'application/octet-stream' }));
    link.download = `AURA_Jewelry_Ring_Size_${innerRadius.toFixed(1)}mm.stl`;
    link.click();
  };

  const setCameraView = (view: 'perspective' | 'top' | 'front' | 'side') => {
    if (!controlsRef.current) return;
    if (view === 'perspective') controlsRef.current.object.position.set(0, 18, 28);
    if (view === 'top') controlsRef.current.object.position.set(0, 35, 0.001);
    if (view === 'front') controlsRef.current.object.position.set(0, 0, 35);
    if (view === 'side') controlsRef.current.object.position.set(35, 0, 0);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none border-t border-slate-800">
      <div className="relative flex-1 h-full bg-gradient-to-b from-slate-950 via-slate-900 to-black overflow-hidden">
        
        {/* Header Badge */}
        <div className="absolute top-5 left-5 z-20 flex items-center gap-3 bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 px-4 py-2.5 rounded-2xl shadow-2xl">
          <div className="p-2 bg-gradient-to-tr from-amber-500 to-amber-300 rounded-xl text-slate-950"><Diamond className="w-5 h-5 font-bold" /></div>
          <div>
            <div className="flex items-center gap-2"><h1 className="text-xs font-black tracking-widest uppercase text-slate-100">AURA CAD STUDIO</h1><span className="px-1.5 py-0.5 bg-amber-400/10 border border-amber-400/30 text-amber-400 text-[9px] font-mono rounded">v5.0 CLEAN ARCH</span></div>
            <p className="text-[10px] text-slate-400 font-mono">MODULAR CLEAN ARCHITECTURE</p>
          </div>
        </div>

        {/* Viewport Control Bar */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 p-1.5 rounded-2xl shadow-2xl">
          <button onClick={() => setWireframe(!wireframe)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${wireframe ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:bg-slate-800'}`}><Eye className="w-3.5 h-3.5" /><span>Wireframe</span></button>
          <button onClick={() => setShowGrid(!showGrid)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${showGrid ? 'bg-slate-800 text-amber-400 border border-slate-700' : 'text-slate-400 hover:bg-slate-800'}`}><GridIcon className="w-3.5 h-3.5" /><span>Grid</span></button>
          <button onClick={() => setShowDimensions(!showDimensions)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${showDimensions ? 'bg-slate-800 text-cyan-400 border border-slate-700' : 'text-slate-400 hover:bg-slate-800'}`}><Shapes className="w-3.5 h-3.5" /><span>Dimensions</span></button>
          <div className="h-4 w-[1px] bg-slate-800 mx-1" />
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-400">
            <button onClick={() => setCameraView('perspective')} className="px-2 py-0.5 hover:text-amber-400">3D</button>
            <button onClick={() => setCameraView('top')} className="px-2 py-0.5 hover:text-amber-400">TOP</button>
            <button onClick={() => setCameraView('front')} className="px-2 py-0.5 hover:text-amber-400">FRONT</button>
            <button onClick={() => setCameraView('side')} className="px-2 py-0.5 hover:text-amber-400">SIDE</button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-5 right-5 z-20 flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-xl border border-emerald-500/30 px-3.5 py-2 rounded-2xl text-xs font-mono text-emerald-400 shadow-2xl"><Scissors className="w-4 h-4 text-emerald-400" /><span>WASM CSG: ACTIVE</span></div>
          <button onClick={handleExportSTL} className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-black px-4 py-2 rounded-2xl text-xs font-mono shadow-xl cursor-pointer"><Download className="w-4 h-4" /><span>EXPORT STL</span></button>
        </div>

        {/* Clearance Alert Banner */}
        {closestPairInfo && (
          <div className={`absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 px-4 py-2 rounded-2xl text-xs font-mono shadow-2xl backdrop-blur-xl border ${closestPairInfo.clearance < 0.2 ? 'bg-red-500/20 border-red-500/50 text-red-300 animate-pulse' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'}`}>
            {closestPairInfo.clearance < 0.2 ? <><AlertTriangle className="w-4 h-4 text-red-400" /><span>WARNING: GEM GAP TOO THIN ({closestPairInfo.clearance.toFixed(2)} mm)</span></> : <><ShieldCheck className="w-4 h-4 text-emerald-400" /><span>OPTIMAL SPACING ({closestPairInfo.clearance.toFixed(2)} mm)</span></>}
          </div>
        )}

        {/* Diagnostics HUD */}
        <div className="absolute bottom-5 left-5 z-20 flex items-center gap-4 bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 px-4 py-2.5 rounded-2xl text-[11px] font-mono text-slate-400 shadow-2xl">
          <div className="flex items-center gap-1.5 text-emerald-400"><Activity className="w-3.5 h-3.5" /><span>60 FPS</span></div>
          <div className="h-3 w-[1px] bg-slate-800" />
          <div className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-amber-400" /><span>{gems.length > 0 ? `${gems.length} SEATS CUT` : '24,576 TRIS'}</span></div>
          <div className="h-3 w-[1px] bg-slate-800" />
          <div className="flex items-center gap-1.5 text-cyan-400"><Cpu className="w-3.5 h-3.5" /><span>CLEAN MODULAR CORE</span></div>
        </div>

        {/* Canvas */}
        <Canvas shadows camera={{ position: [0, 18, 28], fov: 40 }}>
          <color attach="background" args={['#030712']} />
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 20, 15]} intensity={2.5} castShadow />
          {showGrid && <Grid position={[0, -0.01, 0]} args={[100, 100]} cellSize={1} cellThickness={1} cellColor="#1e293b" sectionSize={5} sectionThickness={1.5} sectionColor="#334155" fadeDistance={50} />}
          {showDimensions && <Html position={[0, 0, innerRadius + thickness + 1]} center><div className="bg-slate-900/90 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] px-2 py-0.5 rounded-md shadow-xl whitespace-nowrap">Ø {(innerRadius * 2).toFixed(1)} mm</div></Html>}

          <ParametricRing ringMeshRef={ringMeshRef} innerRadius={innerRadius} bandWidth={bandWidth} thickness={thickness} profileShape={profileShape} metalColor={metals[metalType].color} roughness={0.15} metalness={0.95} wireframe={wireframe} onSurfaceClick={handleSurfaceClick} isAutoPaveMode={isAutoPaveMode} paveModeType={paveModeType} gems={gems} />
          {gems.map((gem) => <GemstoneMesh key={gem.id} position={gem.position} normal={gem.normal} size={gem.size} metalColor={metals[metalType].color} />)}
          {closestPairInfo && <GemDistanceOverlay gemA={closestPairInfo.pair[0]} gemB={closestPairInfo.pair[1]} />}

          <ContactShadows position={[0, -5, 0]} opacity={0.6} scale={40} blur={2} far={10} />
          <Environment preset="city" />
          <OrbitControls ref={controlsRef} makeDefault minDistance={10} maxDistance={60} enablePan={false} />
          <GizmoHelper alignment="bottom-right" margin={[80, 80]}><GizmoViewport axisColors={['#ef4444', '#10b981', '#3b82f6']} labelColor="#ffffff" /></GizmoHelper>
        </Canvas>
      </div>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isAutoPaveMode={isAutoPaveMode} setIsAutoPaveMode={setIsAutoPaveMode} profileShape={profileShape} setProfileShape={setProfileShape} metalType={metalType} setMetalType={setMetalType} innerRadius={innerRadius} setInnerRadius={setInnerRadius} bandWidth={bandWidth} setBandWidth={setBandWidth} thickness={thickness} setThickness={setThickness} paveModeType={paveModeType} setPaveModeType={setPaveModeType} arrayCoverage={arrayCoverage} setArrayCoverage={setArrayCoverage} arrayGemCount={arrayGemCount} setArrayGemCount={setArrayGemCount} gemSize={gemSize} setGemSize={setGemSize} gems={gems} setGems={setGems} totalCaratWeight={totalCaratWeight} estimatedWeightGrams={estimatedWeightGrams} ringVolume={ringVolume} totalB2BCost={totalB2BCost} />
    </div>
  );
}