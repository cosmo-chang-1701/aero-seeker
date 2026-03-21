import { useSimulationStore } from '@/store/useSimulationStore';
import { classifyFlightStates } from '@/utils/flightStateClassifier';

/**
 * Aerodynamic parameter matrix table.
 */
export function DataMatrix() {
  const mach = useSimulationStore((s) => s.mach);
  const aoa = useSimulationStore((s) => s.aoa);
  const showMatrix = useSimulationStore((s) => s.showMatrix);

  if (!showMatrix) return null;

  const states = classifyFlightStates(mach, aoa);

  const stateLabels: Record<string, { name: string; condition: string; description: string; textColor: string }> = {
    subsonic: { name: '亞音速', condition: 'M < 0.8', description: '流場平穩，無明顯壓縮效應', textColor: 'text-cyan-300' },
    transonic: { name: '跨音速', condition: '0.8 ≤ M ≤ 1.2', description: '局部激波產生，阻力急劇發散', textColor: 'text-blue-400' },
    supersonic: { name: '超音速', condition: 'M > 1.2', description: '馬赫錐形成，強烈氣動加熱', textColor: 'text-purple-400' },
    stall: { name: '大攻角 / 失速', condition: '|AOA| ≥ 20°', description: '邊界層大面積分離，升力驟降', textColor: 'text-amber-500' },
  };

  return (
    <div className="absolute bottom-36 left-1/2 -translate-x-1/2 w-[calc(100vw-3rem)] max-w-2xl pointer-events-auto sc-panel bg-[#040f1c]/90 border border-cyan-800/50 z-[40]">
      <div className="bg-cyan-950/40 px-5 py-3 border-b border-cyan-900/50">
        <h3 className="font-bold text-sm text-cyan-400 tracking-widest uppercase">氣動力參數參照矩陣</h3>
      </div>
      <div className="overflow-x-auto p-3">
        <table className="w-full text-left text-[12px] text-cyan-100/70">
          <thead className="text-[11px] text-cyan-500/80 uppercase tracking-widest border-b border-cyan-900/50">
            <tr>
              <th className="px-4 py-3 font-normal">飛行狀態</th>
              <th className="px-4 py-3 font-normal">條件範圍</th>
              <th className="px-4 py-3 font-normal">氣動特徵</th>
              <th className="px-4 py-3 font-normal w-24">系統狀態</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-900/30">
            {states.map((s) => {
              const label = stateLabels[s.id];
              const rowClass = s.active
                ? `transition-all duration-300 border-l-2 ${s.rowActiveClasses.join(' ')}`
                : 'transition-all duration-300 border-l-2 border-transparent hover:bg-cyan-900/20';

              const statusClass = s.active
                ? `px-2 py-0.5 rounded text-[9px] tracking-widest font-bold ${s.statusActiveClasses.join(' ')}`
                : 'px-2 py-0.5 rounded text-[9px] tracking-widest font-bold opacity-0 transition-opacity';

              return (
                <tr key={s.id} className={rowClass}>
                  <td className={`px-4 py-3 font-bold ${label.textColor}`}>{label.name}</td>
                  <td className="px-4 py-3 text-cyan-400/70">{label.condition}</td>
                  <td className="px-4 py-3">{label.description}</td>
                  <td className="px-4 py-3">
                    <span className={statusClass}>{s.active ? s.statusText : '-'}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
