import React, { useState, useEffect, useCallback } from 'react';
import { MousePointer2, Table, X } from 'lucide-react';

import WindTunnelHUD from './WindTunnelLab/WindTunnelHUD';
import WindTunnelHeader from './WindTunnelLab/WindTunnelHeader';
import WindTunnelControls from './WindTunnelLab/WindTunnelControls';
import TelemetryPanel from './WindTunnelLab/TelemetryPanel';
import DataMatrixTable from './WindTunnelLab/DataMatrixTable';
import Fallback2DViewer from './WindTunnelLab/Fallback2DViewer';
import { useWindTunnel3D } from './WindTunnelLab/useWindTunnel3D';

const WindTunnelLab = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [mach, setMach] = useState(0.5);
  const [aoa, setAoa] = useState(0);
  const [roll, setRoll] = useState(0);
  const [showMatrix, setShowMatrix] = useState(false);
  const [density, setDensity] = useState(1.0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const isStall = Math.abs(aoa) >= 25;
  const { mountRef, webglError } = useWindTunnel3D({ mach, aoa, roll, isStall, isReducedMotion, density });

  const handleToggleMatrix = useCallback(() => {
    setShowMatrix(prev => !prev);
  }, []);

  return (
    <main className="fixed inset-0 w-screen h-screen bg-[#020611] text-cyan-50 font-mono selection:bg-cyan-500/30 overflow-hidden">
      {/* --- 底層 3D / 2D Canvas --- */}
      <div className={`absolute inset-0 z-0 scanlines ${!webglError ? 'cursor-move' : '' }`}>
        {!webglError ? (
          <div ref={mountRef} className="absolute inset-0 z-0"></div>
        ) : (
          <Fallback2DViewer mach={mach} aoa={aoa} roll={roll} isStall={isStall} density={density} />
        )}
      </div>

      {/* --- MFD HUD 層 --- */}
      <div className="absolute inset-0 z-10 pointer-events-none p-6">
        <WindTunnelHUD mach={mach} aoa={aoa} roll={roll} isStall={isStall} />
        
        <WindTunnelHeader />
        
        <WindTunnelControls 
          mach={mach} 
          aoa={aoa} 
          roll={roll}
          density={density}
          setMach={setMach} 
          setAoa={setAoa} 
          setRoll={setRoll}
          setDensity={setDensity}
        />
        
        <TelemetryPanel 
          activeTab={activeTab} 
          setActiveTab={(tabIndex, presets) => {
            setActiveTab(tabIndex);
            if (presets) {
              setMach(presets.mach);
              setAoa(presets.aoa);
              setRoll(presets.roll);
              setDensity(presets.density);
            }
          }} 
        />

        {/* 底部按鈕區 */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-auto">
          {!webglError && (
            <div className="flex items-center gap-2 text-cyan-500/50 px-3 py-1 mb-1">
              <MousePointer2 size={10} aria-hidden="true" />
              <span className="text-[10px] tracking-[0.2em] uppercase">拖曳旋轉視角 / 滾輪縮放</span>
            </div>
          )}

          <button 
            onClick={handleToggleMatrix} 
            className={`sc-btn flex items-center gap-2 px-6 py-2 text-[12px] font-bold uppercase tracking-widest transition-all border outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${ showMatrix ? 'bg-amber-500/20 text-amber-400 border-amber-500/50' : 'bg-cyan-950/60 text-cyan-400 border-cyan-800/50 hover:bg-cyan-900/80 hover:text-cyan-50' }`}
            aria-expanded={showMatrix}
          >
            {showMatrix ? <X size={14} aria-hidden="true" /> : <Table size={14} aria-hidden="true" />}
            {showMatrix ? '關閉矩陣' : '數據矩陣'}
          </button>
        </div>

        <DataMatrixTable showMatrix={showMatrix} />
      </div>
    </main>
  );
};

export default WindTunnelLab;
