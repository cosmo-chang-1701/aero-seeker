import { useSimulationStore } from '@/store/useSimulationStore';

/**
 * Cooldown dialog — slide-in warning panel.
 */
export function CooldownDialog() {
  const showCooldown = useSimulationStore((s) => s.showCooldown);

  const translateClass = showCooldown ? 'translate-x-0 opacity-100' : '-translate-x-[120%] opacity-0';

  return (
    <div
      className={`fixed top-36 left-6 z-[200] transition-all duration-300 pointer-events-none ${translateClass}`}
    >
      <div className="sc-panel bg-amber-950/90 border border-amber-500/50 border-l-4 border-l-amber-500 p-4 flex items-center gap-4">
        <h3 className="text-[13px] font-bold text-amber-400 tracking-widest uppercase">
          系統冷卻中
        </h3>
      </div>
    </div>
  );
}
