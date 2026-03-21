import { useEffect } from 'react';
import { useSimulationStore } from '@/store/useSimulationStore';

/**
 * Keyboard input handler hook.
 * Manages keydown/keyup events for WASDQE keys and Z-key camera toggle.
 */
export function useKeyboardControl() {
  const setKey = useSimulationStore((s) => s.setKey);
  const isFreeCameraMode = useSimulationStore((s) => s.isFreeCameraMode);
  const setCameraState = useSimulationStore((s) => s.setCameraState);
  const resetKeys = useSimulationStore((s) => s.resetKeys);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const rawKey = e.key.toLowerCase();

      if (rawKey === 'z') {
        const nextMode = !useSimulationStore.getState().isFreeCameraMode;
        setCameraState({ isFreeCameraMode: nextMode });
        if (nextMode) resetKeys();
        return;
      }

      const validKeys = ['q', 'w', 'e', 'a', 's', 'd'] as const;
      if (!isFreeCameraMode && (validKeys as readonly string[]).includes(rawKey)) {
        setKey(rawKey as typeof validKeys[number], true);
      }
    }

    function handleKeyUp(e: KeyboardEvent) {
      const rawKey = e.key.toLowerCase();
      const validKeys = ['q', 'w', 'e', 'a', 's', 'd'] as const;
      if (!isFreeCameraMode && (validKeys as readonly string[]).includes(rawKey)) {
        setKey(rawKey as typeof validKeys[number], false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setKey, isFreeCameraMode, setCameraState, resetKeys]);
}
