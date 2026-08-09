import React from 'react';
import { Sliders, Sparkles, Grid3x3, MousePointer, Diamond, Trash2, DollarSign, CheckCircle2 } from 'lucide-react';
import type { ProfileShape, MetalType, PaveModeType, PlacedGem } from '../../types/cad';

export interface SidebarProps {
  activeTab: 'geometry' | 'pave';
  setActiveTab: (tab: 'geometry' | 'pave') => void;
  isAutoPaveMode: boolean;
  setIsAutoPaveMode: (val: boolean) => void;
  profileShape: ProfileShape;
  setProfileShape: (val: ProfileShape) => void;
  metalType: MetalType;
  setMetalType: (val: MetalType) => void;
  innerRadius: number;
  setInnerRadius: (val: number) => void;
  bandWidth: number;
  setBandWidth: (val: number) => void;
  thickness: number;
  setThickness: (val: number) => void;
  paveModeType: PaveModeType;
  setPaveModeType: (val: PaveModeType) => void;
  arrayCoverage: number;
  setArrayCoverage: (val: number) => void;
  arrayGemCount: number;
  setArrayGemCount: (val: number) => void;
  gemSize: number;
  setGemSize: (val: number) => void;
  gems: PlacedGem[];
  setGems: React.Dispatch<React.SetStateAction<PlacedGem[]>>;
  totalCaratWeight: string;
  estimatedWeightGrams: string;
  ringVolume: string;
  totalB2BCost: string;
}

export function Sidebar({
  activeTab, setActiveTab, isAutoPaveMode, setIsAutoPaveMode,
  profileShape, setProfileShape, metalType, setMetalType,
  innerRadius, setInnerRadius, bandWidth, setBandWidth,
  thickness, setThickness, paveModeType, setPaveModeType,
  arrayCoverage, setArrayCoverage, arrayGemCount, setArrayGemCount,
  gemSize, setGemSize, gems, setGems, totalCaratWeight,
  estimatedWeightGrams, ringVolume, totalB2BCost
}: SidebarProps) {
  return (
    <aside className="w-96 h-full bg-slate-900/95 backdrop-blur-2xl border-l border-slate-800/80 p-6 flex flex-col justify-between overflow-y-auto z-30">
      <div className="space-y-6">
        
        {/* Tab Switcher */}
        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => { setActiveTab('geometry'); setIsAutoPaveMode(false); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'geometry' && !isAutoPaveMode
                ? 'bg-slate-800 text-amber-400 border border-slate-700/80 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Geometry</span>
          </button>

          <button
            onClick={() => { setActiveTab('pave'); setIsAutoPaveMode(true); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${
              isAutoPaveMode
                ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-Pave</span>
          </button>
        </div>

        {!isAutoPaveMode ? (
          /* Geometry Controls */
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Ring Band Profile Shape</label>
              <div className="grid grid-cols-3 gap-2">
                {(['comfort', 'flat', 'knife'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setProfileShape(p)}
                    className={`py-2 text-[10px] font-bold rounded-xl border transition-all ${
                      profileShape === p ? 'border-amber-400 bg-amber-400/20 text-amber-300 shadow-md' : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {p.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Precious Metal Alloy</label>
              <div className="grid grid-cols-3 gap-2">
                {(['yellow', 'rose', 'platinum'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMetalType(m)}
                    className={`py-2 text-[10px] font-black rounded-xl border transition-all ${
                      metalType === m ? 'border-amber-400 bg-amber-400/20 text-amber-300 shadow-lg shadow-amber-500/10' : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {m.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-semibold">Inner Radius</span>
                  <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded-lg">
                    <input type="number" step="0.1" value={innerRadius} onChange={(e) => setInnerRadius(parseFloat(e.target.value) || 6)} className="w-10 bg-transparent font-mono text-amber-400 font-bold text-right outline-none" />
                    <span className="text-[10px] text-slate-500">mm</span>
                  </div>
                </div>
                <input type="range" min="6.0" max="12.0" step="0.1" value={innerRadius} onChange={(e) => setInnerRadius(parseFloat(e.target.value))} className="w-full accent-amber-400 bg-slate-800 rounded-lg h-1.5 cursor-pointer" />
              </div>

              <div className="space-y-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-semibold">Band Width</span>
                  <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded-lg">
                    <input type="number" step="0.1" value={bandWidth} onChange={(e) => setBandWidth(parseFloat(e.target.value) || 3)} className="w-10 bg-transparent font-mono text-amber-400 font-bold text-right outline-none" />
                    <span className="text-[10px] text-slate-500">mm</span>
                  </div>
                </div>
                <input type="range" min="3.0" max="12.0" step="0.1" value={bandWidth} onChange={(e) => setBandWidth(parseFloat(e.target.value))} className="w-full accent-amber-400 bg-slate-800 rounded-lg h-1.5 cursor-pointer" />
              </div>

              <div className="space-y-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-semibold">Wall Thickness</span>
                  <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded-lg">
                    <input type="number" step="0.1" value={thickness} onChange={(e) => setThickness(parseFloat(e.target.value) || 1)} className="w-10 bg-transparent font-mono text-amber-400 font-bold text-right outline-none" />
                    <span className="text-[10px] text-slate-500">mm</span>
                  </div>
                </div>
                <input type="range" min="1.0" max="3.5" step="0.1" value={thickness} onChange={(e) => setThickness(parseFloat(e.target.value))} className="w-full accent-amber-400 bg-slate-800 rounded-lg h-1.5 cursor-pointer" />
              </div>
            </div>
          </div>
        ) : (
          /* Auto-Pave Controls */
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Placement Engine Mode</label>
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setPaveModeType('array')}
                  className={`py-2 text-[10px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    paveModeType === 'array' ? 'bg-amber-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Grid3x3 className="w-3.5 h-3.5" />
                  <span>Parametric Array</span>
                </button>

                <button
                  onClick={() => { setPaveModeType('manual'); setGems([]); }}
                  className={`py-2 text-[10px] font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    paveModeType === 'manual' ? 'bg-amber-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <MousePointer className="w-3.5 h-3.5" />
                  <span>Manual Click</span>
                </button>
              </div>
            </div>

            {paveModeType === 'array' ? (
              <div className="space-y-3 bg-slate-950/80 p-3.5 rounded-2xl border border-amber-500/30">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">Coverage Pattern</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setArrayCoverage(180)} className={`py-1.5 text-[10px] font-bold rounded-lg border transition-all ${arrayCoverage === 180 ? 'border-amber-400 bg-amber-400/20 text-amber-300' : 'border-slate-800 text-slate-400'}`}>180° Half Eternity</button>
                    <button onClick={() => setArrayCoverage(360)} className={`py-1.5 text-[10px] font-bold rounded-lg border transition-all ${arrayCoverage === 360 ? 'border-amber-400 bg-amber-400/20 text-amber-300' : 'border-slate-800 text-slate-400'}`}>360° Full Eternity</button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-semibold">Total Gem Count</span>
                    <span className="font-mono text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">{arrayGemCount} Gems</span>
                  </div>
                  <input type="range" min="3" max="32" step="1" value={arrayGemCount} onChange={(e) => setArrayGemCount(parseInt(e.target.value))} className="w-full accent-amber-400 bg-slate-800 rounded-lg h-1.5 cursor-pointer" />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-semibold">Diamond Size</span>
                    <span className="font-mono text-amber-400 font-bold">{gemSize.toFixed(1)} mm</span>
                  </div>
                  <input type="range" min="1.0" max="2.5" step="0.1" value={gemSize} onChange={(e) => setGemSize(parseFloat(e.target.value))} className="w-full accent-amber-400 bg-slate-800 rounded-lg h-1.5 cursor-pointer" />
                </div>
              </div>
            ) : (
              <div className="space-y-2 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-semibold">Diamond Size</span>
                  <span className="font-mono text-amber-400 font-bold">{gemSize.toFixed(1)} mm</span>
                </div>
                <input type="range" min="1.0" max="2.5" step="0.1" value={gemSize} onChange={(e) => setGemSize(parseFloat(e.target.value))} className="w-full accent-amber-400 bg-slate-800 rounded-lg h-1.5 cursor-pointer" />
              </div>
            )}

            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800/80 pb-2">
                <Diamond className="w-4 h-4 text-amber-400" />
                <span>Gemstone Layout Metrics</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Total Gems</span>
                  <span className="text-base font-bold font-mono text-amber-400">{gems.length}</span>
                </div>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Total Carat (TCW)</span>
                  <span className="text-base font-bold font-mono text-cyan-400">{totalCaratWeight} ct</span>
                </div>
              </div>
            </div>

            {gems.length > 0 && (
              <button onClick={() => setGems([])} className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer">
                <Trash2 className="w-4 h-4" />
                Clear All Placed Gems
              </button>
            )}
          </div>
        )}

        {/* Live B2B Cost Engine Card */}
        <div className="bg-slate-950/90 border border-amber-500/30 rounded-2xl p-4 space-y-3 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <DollarSign className="w-4 h-4" />
              <span>Live B2B Cost Engine</span>
            </div>
            <span className="text-[9px] font-mono bg-amber-400/10 text-amber-300 border border-amber-400/20 px-1.5 py-0.5 rounded">EST. WHOLESALE</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[9px] text-slate-500 uppercase block font-semibold">Est. Gold Weight</span>
              <span className="text-xs font-bold font-mono text-slate-200">{estimatedWeightGrams} g</span>
            </div>
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[9px] text-slate-500 uppercase block font-semibold">Metal Volume</span>
              <span className="text-xs font-bold font-mono text-cyan-400">{ringVolume} cm³</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-800/60">
            <span className="text-xs text-slate-400 font-bold">Est. Total Wholesale Cost:</span>
            <span className="text-lg font-black font-mono text-emerald-400">${totalB2BCost}</span>
          </div>
        </div>
      </div>

      {!isAutoPaveMode ? (
        <button onClick={() => { setIsAutoPaveMode(true); setActiveTab('pave'); }} className="w-full py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black rounded-2xl shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer mt-2">
          <Sparkles className="w-4 h-4" />
          Launch Auto-Pave Mode
        </button>
      ) : (
        <button onClick={() => { setIsAutoPaveMode(false); setActiveTab('geometry'); }} className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider border border-slate-700 cursor-pointer mt-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Lock Layout & Return
        </button>
      )}
    </aside>
  );
}