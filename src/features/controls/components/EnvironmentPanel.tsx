import { useSimulationStore } from '@/store/useSimulationStore';
import { CyberButton } from '@/shared/ui/CyberButton';

/**
 * Environment parameter control panel (bottom-left).
 */
export function EnvironmentPanel() {
  const density = useSimulationStore((s) => s.density);
  const smokeSize = useSimulationStore((s) => s.smokeSize);
  const smokeMode = useSimulationStore((s) => s.smokeMode);
  const bloomEnabled = useSimulationStore((s) => s.bloomEnabled);
  const setSimParam = useSimulationStore((s) => s.setSimParam);

  return (
    <div className="absolute bottom-6 left-6 w-80 pointer-events-auto sc-panel bg-[#040f1c]/80 border border-cyan-900/50 p-6 z-10">
      <h3 className="text-sm font-bold mb-5 text-cyan-500 uppercase tracking-widest">環境參數控制</h3>
      <div className="space-y-6">
        {/* Density slider */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-[11px] text-cyan-300/70 uppercase tracking-wider font-semibold">
              氣流密度 (渲染精度)
            </label>
            <span className="text-[11px] text-cyan-400 font-mono tracking-wider">{density.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="0.5"
            step="0.01"
            value={density}
            onChange={(e) => setSimParam({ density: parseFloat(e.target.value) })}
            className="w-full h-1 bg-cyan-950 accent-cyan-400 cursor-pointer"
          />
        </div>

        {/* Smoke size slider */}
        <div className="pt-2 border-t border-cyan-900/50">
          <div className="flex justify-between mb-2">
            <label className="text-[11px] text-cyan-300/70 uppercase tracking-wider font-semibold">
              單顆煙霧尺寸
            </label>
            <span className="text-[11px] text-cyan-400 font-mono tracking-wider">{smokeSize.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="1.0"
            step="0.01"
            value={smokeSize}
            onChange={(e) => setSimParam({ smokeSize: parseFloat(e.target.value) })}
            className="w-full h-1 bg-cyan-950 accent-cyan-400 cursor-pointer"
          />
        </div>

        {/* Smoke mode */}
        <div className="pt-2 border-t border-cyan-900/50">
          <label className="block text-[11px] text-cyan-300/70 uppercase tracking-wider font-semibold mb-3">
            煙流視覺化模式
          </label>
          <div className="flex space-x-2">
            <CyberButton active={smokeMode === 1} className="flex-1 py-1.5 cursor-pointer" onClick={() => setSimParam({ smokeMode: 1 })}>
              動態煙流
            </CyberButton>
            <CyberButton active={smokeMode === 0} className="flex-1 py-1.5 cursor-pointer" onClick={() => setSimParam({ smokeMode: 0 })}>
              原始白煙
            </CyberButton>
          </div>
        </div>

        {/* Bloom toggle */}
        <div className="pt-2 border-t border-cyan-900/50">
          <label className="block text-[11px] text-cyan-300/70 uppercase tracking-wider font-semibold mb-3">
            泛光特效 (Bloom)
          </label>
          <div className="flex space-x-2">
            <CyberButton active={bloomEnabled} className="flex-1 py-1.5 cursor-pointer" onClick={() => setSimParam({ bloomEnabled: true })}>
              開啟
            </CyberButton>
            <CyberButton active={!bloomEnabled} className="flex-1 py-1.5 cursor-pointer" onClick={() => setSimParam({ bloomEnabled: false })}>
              關閉
            </CyberButton>
          </div>
        </div>
      </div>
    </div>
  );
}
