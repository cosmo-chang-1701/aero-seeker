import { useEffect, useRef, useCallback } from 'react';
import { useSimulationStore } from '@/store/useSimulationStore';

/**
 * Pointer lock, mouse movement, and scroll wheel control hook.
 * Manages Pointer Lock API, mouse delta → object rotation / camera orbit, scroll → zoom.
 */
export function usePointerControl(canvasElement: HTMLCanvasElement | null) {
  const pointerLockTimeout = useRef(0);
  const cooldownTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const store = useSimulationStore;

  const requestLock = useCallback(() => {
    if (!canvasElement) return;
    const now = Date.now();
    if (document.pointerLockElement !== canvasElement) {
      if (now - pointerLockTimeout.current > 1500) {
        const promise = canvasElement.requestPointerLock();
        if (promise) {
          (promise as unknown as Promise<void>).catch(() => {
            showCooldown();
          });
        }
        pointerLockTimeout.current = now;
      } else {
        showCooldown();
      }
    }
  }, [canvasElement]);

  const showCooldown = useCallback(() => {
    store.getState().setShowCooldown(true);
    clearTimeout(cooldownTimerRef.current);
    cooldownTimerRef.current = setTimeout(() => {
      store.getState().setShowCooldown(false);
    }, 1500);
  }, []);

  useEffect(() => {
    if (!canvasElement) return;

    function handleClick() {
      requestLock();
    }

    function handlePointerLockChange() {
      const locked = document.pointerLockElement === canvasElement;
      store.getState().setInputState({ isPointerLocked: locked });
      if (!locked && store.getState().isFreeCameraMode) {
        store.getState().setCameraState({ isFreeCameraMode: false });
      }
    }

    function handleMouseMove(e: MouseEvent) {
      const state = store.getState();
      // Skip desktop input when XR (VR) is presenting — the HMD controls the view
      if (!state.isPointerLocked || state.isPaused || state.isXRPresenting) return;

      store.getState().setCameraState({ isCameraTweening: false });

      if (state.isFreeCameraMode) {
        const newTheta = state.camTheta - (e.movementX || 0) * 0.005;
        let newPhi = state.camPhi - (e.movementY || 0) * 0.005;
        newPhi = Math.max(0.01, Math.min(Math.PI - 0.01, newPhi));
        store.getState().setCameraState({ camTheta: newTheta, camPhi: newPhi });
      } else {
        const isRotKeyboardActive = state.keys.q || state.keys.e || state.keys.a || state.keys.d;
        if (!isRotKeyboardActive) {
          let newTargetAoA = state.targetAoA + (e.movementY || 0) * 0.15;
          let newTargetYaw = state.targetYaw + (e.movementX || 0) * 0.15;
          newTargetAoA = Math.max(-90, Math.min(90, newTargetAoA));
          newTargetYaw = Math.max(-180, Math.min(180, newTargetYaw));
          store.getState().setInputState({
            targetAoA: newTargetAoA,
            targetYaw: newTargetYaw,
          });
        }
      }
    }

    function handleWheel(e: WheelEvent) {
      const state = store.getState();
      // Skip desktop zoom when XR (VR) is presenting
      if (state.isPaused || state.isXRPresenting) return;
      store.getState().setCameraState({ isCameraTweening: false });
      let newRadius = state.targetRadius + e.deltaY * 0.05;
      newRadius = Math.max(3.0, Math.min(100.0, newRadius));
      store.getState().setCameraState({ targetRadius: newRadius });
    }

    function handlePointerDown(e: PointerEvent) {
      if (store.getState().isPointerLocked) e.stopPropagation();
    }

    canvasElement.addEventListener('pointerdown', handlePointerDown, { capture: true });
    canvasElement.parentElement?.addEventListener('click', handleClick);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      canvasElement.removeEventListener('pointerdown', handlePointerDown, { capture: true });
      canvasElement.parentElement?.removeEventListener('click', handleClick);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('wheel', handleWheel);
      clearTimeout(cooldownTimerRef.current);
    };
  }, [canvasElement, requestLock, showCooldown]);
}
