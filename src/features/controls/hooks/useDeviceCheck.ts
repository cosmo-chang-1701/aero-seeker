import { useEffect } from 'react';
import { useSimulationStore } from '@/store/useSimulationStore';

/**
 * Device compatibility check hook.
 * Detects narrow screens and sets isPaused to block mobile devices.
 */
export function useDeviceCheck() {
  const setSimParam = useSimulationStore((s) => s.setSimParam);

  useEffect(() => {
    function check() {
      const isNarrowScreen = window.innerWidth < 768;
      setSimParam({ isPaused: isNarrowScreen });
    }

    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [setSimParam]);
}
