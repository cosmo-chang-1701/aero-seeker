import { SceneContainer } from '@/features/wind-tunnel/components/SceneContainer';
import { DropZoneOverlay } from '@/features/wind-tunnel/components/DropZoneOverlay';
import { MobileBlocker } from './MobileBlocker';
import { CooldownDialog } from '@/shared/ui/CooldownDialog';
import { HUDBar } from '@/features/telemetry/components/HUDBar';
import { ControlPanel } from '@/features/controls/components/ControlPanel';
import { EnvironmentPanel } from '@/features/controls/components/EnvironmentPanel';
import { MFDPanel } from '@/features/telemetry/components/MFDPanel';
import { DataMatrix } from '@/features/telemetry/components/DataMatrix';
import { KeyboardHints } from '@/features/controls/components/KeyboardHints';

/**
 * Main simulation layout — arranges all panels on top of the 3D canvas.
 */
export function SimulationLayout() {
  return (
    <div className="scanlines relative w-full h-full">
      {/* Mobile blocker */}
      <MobileBlocker />

      {/* 3D Canvas */}
      <SceneContainer />

      {/* Drop zone overlay */}
      <DropZoneOverlay />

      {/* Cooldown dialog */}
      <CooldownDialog />

      {/* HUD instruments */}
      <HUDBar />

      {/* Left-top control panel */}
      <ControlPanel />

      {/* Left-bottom environment panel */}
      <EnvironmentPanel />

      {/* Right telemetry panel */}
      <MFDPanel />

      {/* Data matrix (conditionally shown) */}
      <DataMatrix />

      {/* Bottom keyboard hints */}
      <KeyboardHints />
    </div>
  );
}
