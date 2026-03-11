import React from 'react';
import { AlertTriangle } from 'lucide-react';

const WindTunnelHUD = ({ mach, aoa, roll = 0, isStall }) => {
  return (
    <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
      <div className="sc-panel px-6 py-2 bg-[#081525]/80 border-t-2 border-cyan-500/50 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.2)]">
        <span className="text-cyan-500/70 text-[11px] uppercase tracking-[0.2em] mr-2">空速 (SPD)</span>
        <span className="text-cyan-300 text-2xl font-bold tracking-tighter tabular-nums">M{mach.toFixed(2)}</span>
      </div>

      <div className={`sc-panel px-6 py-2 backdrop-blur-md transition-colors ${isStall ? 'bg-amber-950/80 border-t-2 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse' : 'bg-[#081525]/80 border-t-2 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]'}`}>
        <span className={`${isStall ? 'text-amber-500/70' : 'text-cyan-500/70' } text-[11px] uppercase tracking-[0.2em] mr-2`}>攻角 (AOA)</span>
        <span className={`${isStall ? 'text-amber-400' : 'text-cyan-300'} text-2xl font-bold tracking-tighter tabular-nums`}>{aoa}°</span>
      </div>

      <div className="sc-panel px-6 py-2 bg-[#081525]/80 border-t-2 border-purple-500/50 backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.2)]">
        <span className="text-purple-400/70 text-[11px] uppercase tracking-[0.2em] mr-2">側滾 (RLL)</span>
        <span className="text-purple-300 text-2xl font-bold tracking-tighter tabular-nums">{roll}°</span>
      </div>

      {isStall && (
        <div className="sc-panel flex items-center gap-2 text-amber-500 bg-amber-950/90 px-4 py-2 border-t-2 border-amber-500 backdrop-blur-md" role="alert" aria-live="polite">
          <AlertTriangle size={14} aria-hidden="true" />
          <span className="text-xs font-bold tracking-widest uppercase">失速警告</span>
        </div>
      )}
    </div>
  );
};

export default React.memo(WindTunnelHUD);
