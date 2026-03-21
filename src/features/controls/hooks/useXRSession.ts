import { useEffect } from 'react';
import { useXR } from '@react-three/xr';
import { useSimulationStore } from '@/store/useSimulationStore';

/**
 * Bridges `@react-three/xr` session state into the Zustand store.
 *
 * WHY: The `useXR` hook only works inside the R3F `<Canvas>` tree.
 * By syncing `isPresenting` into the global store, non-R3F UI components
 * (e.g. `ControlPanel`, `KeyboardHints`) can react to XR session changes
 * without needing to be Canvas children.
 */
export function useXRSession(): void {
  const isPresenting = useXR((state) => state.isPresenting);

  useEffect(() => {
    useSimulationStore.getState().setXRPresenting(isPresenting);
  }, [isPresenting]);
}
