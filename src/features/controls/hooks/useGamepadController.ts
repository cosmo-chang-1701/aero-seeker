import { useEffect, useRef } from 'react';
import { useSimulationStore } from '@/store/useSimulationStore';

/**
 * Gamepad controller hook.
 * Polls gamepad axes/buttons each frame to update simulation state.
 */
export function useGamepadController() {
  const setGamepadConnected = useSimulationStore((s) => s.setGamepadConnected);
  const animFrameRef = useRef<number>();

  useEffect(() => {
    function onConnected() { setGamepadConnected(true); }
    function onDisconnected() { setGamepadConnected(false); }

    window.addEventListener('gamepadconnected', onConnected);
    window.addEventListener('gamepaddisconnected', onDisconnected);

    return () => {
      window.removeEventListener('gamepadconnected', onConnected);
      window.removeEventListener('gamepaddisconnected', onDisconnected);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [setGamepadConnected]);
}

/**
 * Apply gamepad controls within the animation loop (called from useFrame).
 * This is a standalone function, not a hook, to be called in the render loop.
 */
export function applyGamepadControls(dt: number): void {
  const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
  const store = useSimulationStore.getState();

  for (let i = 0; i < gamepads.length; i++) {
    const gp = gamepads[i];
    if (gp) {
      store.setGamepadConnected(true);
      let { targetAoA, targetYaw, targetRoll } = store;

      if (Math.abs(gp.axes[0]) > 0.15) targetRoll -= gp.axes[0] * 120 * dt;
      if (Math.abs(gp.axes[1]) > 0.15) targetAoA += gp.axes[1] * 60 * dt;
      if (Math.abs(gp.axes[2]) > 0.15 || Math.abs(gp.axes[3]) > 0.15) {
        targetYaw += (Math.abs(gp.axes[2]) > 0.15 ? gp.axes[2] : gp.axes[3]) * 80 * dt;
      }

      store.setInputState({ targetAoA, targetYaw, targetRoll });

      let mach = store.mach;
      if (gp.buttons[7]?.pressed) mach += 1.0 * dt;
      if (gp.buttons[6]?.pressed) mach -= 1.0 * dt;
      if (mach !== store.mach) store.setSimParam({ mach });
    }
  }
}
