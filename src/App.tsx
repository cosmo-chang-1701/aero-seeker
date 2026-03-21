import { SimulationLayout } from '@/layouts/SimulationLayout';
import { useDeviceCheck } from '@/features/controls/hooks/useDeviceCheck';
import { useKeyboardControl } from '@/features/controls/hooks/useKeyboardControl';
import { useGamepadController } from '@/features/controls/hooks/useGamepadController';
import { useVoiceControl } from '@/features/controls/hooks/useVoiceControl';

/**
 * Root application component.
 * Activates global hooks that run outside of the R3F Canvas.
 */
export default function App() {
  // Activate global hooks
  useDeviceCheck();
  useKeyboardControl();
  useGamepadController();
  useVoiceControl();

  return <SimulationLayout />;
}
