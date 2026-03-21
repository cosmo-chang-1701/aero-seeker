import { useSimulationStore } from '@/store/useSimulationStore';
import { VRButton } from '@react-three/xr';

/**
 * VR status label text mapping.
 * WHY extracted: keeps JSX clean and allows easy i18n extension.
 */
const VR_STATUS_LABELS: Record<string, string> = {
  unsupported: '不支援 VR',
  exited: '進入 VR',
  entered: '退出 VR',
};

/**
 * Left-top control panel — header with title, gamepad status, upload hint, voice button, VR status.
 */
export function ControlPanel() {
  const isVoiceActive = useSimulationStore((s) => s.isVoiceActive);
  const toggleVoice = useSimulationStore((s) => s.toggleVoice);
  const gamepadConnected = useSimulationStore((s) => s.gamepadConnected);
  const objectType = useSimulationStore((s) => s.objectType);

  return (
    <header className="absolute top-6 left-6 w-80 pointer-events-auto sc-panel bg-[#040f1c]/80 border border-cyan-900/50 p-5 z-10 flex flex-col gap-3">
      {/* Top row */}
      <div className="flex justify-between items-center">
        <span className="text-amber-500 text-[11px] tracking-[0.3em] font-bold uppercase">
          Aero Simulation
        </span>
        {gamepadConnected && (
          <span className="text-emerald-400 flex items-center gap-1 text-[9px] tracking-widest font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="6" y1="12" x2="10" y2="12" />
              <line x1="8" y1="10" x2="8" y2="14" />
              <line x1="15" y1="13" x2="15.01" y2="13" />
              <line x1="18" y1="11" x2="18.01" y2="11" />
              <rect x="2" y="6" width="20" height="12" rx="2" />
            </svg>
            LINKED
          </span>
        )}
      </div>

      {/* Drag upload zone */}
      <div className="border border-dashed border-cyan-700/60 bg-cyan-950/20 rounded p-3 flex flex-col items-center justify-center gap-2 text-center transition-colors hover:bg-cyan-900/30 hover:border-cyan-400 cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400 animate-bounce">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" x2="12" y1="3" y2="15" />
        </svg>
        <h1 className="text-sm font-bold text-cyan-50 tracking-wider uppercase">
          {objectType === 'custom' ? '自訂模組分析' : '拖曳 3D 模型檔案至此'}
        </h1>
        <p className="text-[9px] text-cyan-500/70 tracking-widest uppercase">
          {objectType === 'custom' ? '已載入外部結構' : '支援 .GLTF / .GLB 格式'}
        </p>
      </div>

      {/* Voice + VR controls */}
      <div className="flex flex-col items-stretch gap-2 bg-[#020611]/60 px-3 py-2 rounded border border-cyan-900/40 w-full">
        <button
          onClick={toggleVoice}
          className={`w-full justify-center ${isVoiceActive
            ? 'text-red-400 border-red-500/50'
            : 'text-cyan-500 border-cyan-700/50'
            } bg-[#061222]/80 border hover:bg-cyan-900/50 hover:border-cyan-400 transition-all rounded px-3 py-1.5 flex items-center gap-1.5 text-[9px] tracking-widest font-bold shadow-[0_0_10px_rgba(6,182,212,0.15)] cursor-pointer`}
          title="點擊啟用語音控制"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isVoiceActive ? 'animate-pulse' : ''}>
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </svg>
          VOICE {isVoiceActive ? 'ON' : 'OFF'}
        </button>

        <div className="w-full h-px bg-cyan-800/60" />

        {/* VR status — integrates the @react-three/xr VRButton as an inline status label */}
        <VRButton id="VRButton" className="w-full">
          {(status) => (
            <div
              className={`w-full justify-center ${status === 'entered'
                ? 'text-red-400 border-red-500/50'
                : 'text-cyan-500 border-cyan-700/50'
                } bg-[#061222]/80 border hover:bg-cyan-900/50 hover:border-cyan-400 transition-all rounded px-3 py-1.5 flex items-center gap-1.5 text-[9px] tracking-widest font-bold shadow-[0_0_10px_rgba(6,182,212,0.15)] cursor-pointer`}
              title="虛擬實境狀態"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={status === 'entered' ? 'animate-pulse' : ''}>
                <rect x="2" y="6" width="20" height="12" rx="3" />
                <path d="M12 18v-4" />
                <circle cx="8" cy="12" r="2" />
                <circle cx="16" cy="12" r="2" />
              </svg>
              {VR_STATUS_LABELS[status] ?? status.toUpperCase()}
            </div>
          )}
        </VRButton>
      </div>
    </header>
  );
}
