import { useSimulationStore } from '@/store/useSimulationStore';

/**
 * Mobile device blocker overlay.
 */
export function MobileBlocker() {
  const isPaused = useSimulationStore((s) => s.isPaused);

  if (!isPaused) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[#020611]/95 backdrop-blur-xl text-center px-6">
      <h2 className="text-2xl font-bold text-amber-400 tracking-widest uppercase mb-3">
        系統環境不相容
      </h2>
      <p className="text-cyan-100/80 text-sm tracking-wider leading-relaxed max-w-sm">
        請使用桌上型或筆記型電腦開啟此系統，以確保完整的操作體驗與效能。
      </p>
    </div>
  );
}
