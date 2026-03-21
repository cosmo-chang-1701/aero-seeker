import { useSimulationStore } from '@/store/useSimulationStore';

/**
 * Bottom keyboard hints + flight controls.
 */
export function KeyboardHints() {
  const keys = useSimulationStore((s) => s.keys);
  const isFreeCameraMode = useSimulationStore((s) => s.isFreeCameraMode);

  const keyClass = (k: 'q' | 'w' | 'e' | 'a' | 's' | 'd') =>
    keys[k]
      ? 'w-8 h-8 flex items-center justify-center border border-cyan-800 bg-cyan-500 text-[#020611] font-bold rounded shadow-[0_0_15px_rgba(6,182,212,0.8)] scale-95'
      : 'w-8 h-8 flex items-center justify-center border border-cyan-800 bg-[#040f1c]/80 text-cyan-500 font-bold rounded';

  const zKeyClass = isFreeCameraMode
    ? 'w-9 h-9 flex items-center justify-center bg-amber-500 text-[#020611] font-bold text-lg rounded relative border border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.6)]'
    : 'w-10 h-10 flex items-center justify-center border border-cyan-800 bg-[#040f1c]/80 text-cyan-500 font-bold text-lg rounded relative shadow-[0_0_10px_rgba(6,182,212,0.1)]';

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10 pointer-events-auto">
      <div className="flex items-end gap-6 opacity-90 pointer-events-none">
        {/* Left controls group */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1.5 bg-cyan-950/90 text-cyan-400 text-[10px] px-3 py-1.5 rounded border border-cyan-500/50 font-bold tracking-widest">
            <span>{isFreeCameraMode ? '移動滑鼠轉動視角' : '移動滑鼠轉動物體'}</span>
          </div>

          <div className="flex gap-6">
            {/* Scroll wheel */}
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[9px] text-cyan-500/60 uppercase tracking-widest font-bold">縮放視角</span>
              <div className="w-10 h-10 flex items-center justify-center border border-cyan-800 bg-[#040f1c]/80 rounded shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-600">
                  <rect x="5" y="2" width="14" height="20" rx="7" />
                  <path d="M12 6v4" strokeWidth="3" className="text-cyan-300 animate-pulse" />
                </svg>
              </div>
            </div>

            {/* Z key */}
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[9px] text-cyan-500/60 uppercase tracking-widest font-bold">
                {isFreeCameraMode ? '自由視角' : '固定視角'}
              </span>
              <div className={zKeyClass}>
                Z
                {isFreeCameraMode && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-900 shadow-[0_0_8px_rgba(0,0,0,0.8)]" />
                )}
              </div>
            </div>

            {/* ESC */}
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[9px] text-cyan-500/60 uppercase tracking-widest font-bold">解鎖游標</span>
              <div className="w-10 h-10 flex items-center justify-center border border-cyan-800 bg-[#040f1c]/80 text-cyan-500 font-bold text-xs rounded">ESC</div>
            </div>
          </div>
        </div>

        {/* Flight controls (WASDQE) */}
        <div className="relative flex flex-col items-center gap-1">
          {isFreeCameraMode && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#020611]/70 backdrop-blur-[1.5px] rounded border border-red-500/30">
              <span className="text-[8px] text-red-400/80 tracking-[0.2em] font-bold">視角鎖定中</span>
            </div>
          )}
          <span className="text-[9px] text-cyan-500/60 uppercase tracking-widest font-bold mb-0.5">
            推力(W/S) · 側滾(Q/E) · 偏航(A/D)
          </span>
          <div className="flex gap-1">
            <div className={keyClass('q')}>Q</div>
            <div className={keyClass('w')}>W</div>
            <div className={keyClass('e')}>E</div>
          </div>
          <div className="flex gap-1">
            <div className={keyClass('a')}>A</div>
            <div className={keyClass('s')}>S</div>
            <div className={keyClass('d')}>D</div>
          </div>
        </div>
      </div>

      {/* Matrix toggle button */}
      <button
        onClick={() => useSimulationStore.getState().toggleMatrix()}
        className="w-48 bg-[#061222]/80 hover:bg-cyan-900/50 border border-cyan-900/50 py-2 sc-btn text-[11px] font-bold text-cyan-500 uppercase tracking-wider"
      >
        參數矩陣
      </button>
    </div>
  );
}
