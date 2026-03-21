import { useSimulationStore } from '@/store/useSimulationStore';

/**
 * Top HUD bar — flight instruments.
 */
export function HUDBar() {
  const mach = useSimulationStore((s) => s.mach);
  const aoa = useSimulationStore((s) => s.aoa);
  const yaw = useSimulationStore((s) => s.yaw);
  const roll = useSimulationStore((s) => s.roll);

  const isStall = Math.abs(aoa) >= 20;

  const aoaPanelClass = isStall
    ? 'sc-panel px-6 py-2 backdrop-blur-md transition-colors bg-amber-950/80 border-t-2 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse'
    : 'sc-panel px-6 py-2 backdrop-blur-md transition-colors bg-[#081525]/80 border-t-2 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]';

  const aoaLabelClass = isStall
    ? 'text-amber-500/70 text-[11px] uppercase tracking-[0.2em] mr-2'
    : 'text-cyan-500/70 text-[11px] uppercase tracking-[0.2em] mr-2';

  const aoaValueClass = isStall
    ? 'text-amber-400 text-2xl font-bold tracking-tighter tabular-nums'
    : 'text-cyan-300 text-2xl font-bold tracking-tighter tabular-nums';

  return (
    <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10 pointer-events-none">
      {/* Mach */}
      <div className="sc-panel px-6 py-2 bg-[#081525]/80 border-t-2 border-cyan-500/50">
        <span className="text-cyan-500/70 text-[11px] uppercase tracking-[0.2em] mr-2">空速 (SPD)</span>
        <span className="text-cyan-300 text-2xl font-bold tracking-tighter tabular-nums">
          M{mach.toFixed(2)}
        </span>
      </div>

      {/* AoA */}
      <div className={aoaPanelClass}>
        <span className={aoaLabelClass}>攻角 (AOA)</span>
        <span className={aoaValueClass}>{aoa.toFixed(2)}°</span>
      </div>

      {/* Yaw */}
      <div className="sc-panel px-6 py-2 bg-[#081525]/80 border-t-2 border-emerald-500/50">
        <span className="text-emerald-400/70 text-[11px] uppercase tracking-[0.2em] mr-2">偏航 (YAW)</span>
        <span className="text-emerald-300 text-2xl font-bold tracking-tighter tabular-nums">
          {yaw.toFixed(2)}°
        </span>
      </div>

      {/* Roll */}
      <div className="sc-panel px-6 py-2 bg-[#081525]/80 border-t-2 border-purple-500/50">
        <span className="text-purple-400/70 text-[11px] uppercase tracking-[0.2em] mr-2">側滾 (RLL)</span>
        <span className="text-purple-300 text-2xl font-bold tracking-tighter tabular-nums">
          {roll.toFixed(2)}°
        </span>
      </div>

      {/* Stall warning */}
      {isStall && (
        <div className="sc-panel flex items-center gap-2 text-amber-500 bg-amber-950/90 px-4 py-2 border-t-2 border-amber-500">
          <span className="text-xs font-bold tracking-widest uppercase">失速警告</span>
        </div>
      )}
    </div>
  );
}
