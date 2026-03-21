import { useSimulationStore } from '@/store/useSimulationStore';
import { testPoints } from '../data/testPoints';
import { useTelemetryRecorder } from '../hooks/useTelemetryRecorder';
import * as THREE from 'three';

/**
 * Right-side MFD / telemetry panel.
 */
export function MFDPanel() {
  const isRecording = useSimulationStore((s) => s.isRecording);
  const activeTab = useSimulationStore((s) => s.activeTab);
  const toggleRecording = useSimulationStore((s) => s.toggleRecording);
  const setActiveTab = useSimulationStore((s) => s.setActiveTab);
  const setSimParam = useSimulationStore((s) => s.setSimParam);
  const setInputState = useSimulationStore((s) => s.setInputState);
  const setCameraState = useSimulationStore((s) => s.setCameraState);
  const clearTelemetry = useSimulationStore((s) => s.clearTelemetry);
  const { exportTelemetryData } = useTelemetryRecorder();

  function handleRecordClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (isRecording) {
      toggleRecording();
      exportTelemetryData();
    } else {
      clearTelemetry();
      toggleRecording();
    }
  }

  function handleTestPointClick(index: number) {
    const point = testPoints[index];
    const p = point.presets;
    setActiveTab(index);
    setSimParam({ mach: p.mach, windSpeed: p.mach * 5.0, aoa: p.aoa, roll: p.roll, yaw: p.yaw });
    setInputState({ targetAoA: p.aoa, targetYaw: p.yaw, targetRoll: p.roll });

    if (p.camPos && p.camLook) {
      setCameraState({
        targetCamPos: new THREE.Vector3(p.camPos.x, p.camPos.y, p.camPos.z),
        targetCamLook: new THREE.Vector3(p.camLook.x, p.camLook.y, p.camLook.z),
        isCameraTweening: true,
      });
    }
  }

  const recordBtnClass = isRecording
    ? 'bg-red-900/80 text-red-400 border border-red-500'
    : 'bg-red-950/50 text-red-400 border border-red-500/50';

  return (
    <aside className="hidden md:flex flex-col absolute top-6 right-6 bottom-[4.5rem] w-80 pointer-events-auto sc-panel bg-[#040f1c]/80 border border-cyan-900/50 overflow-hidden z-10">
      {/* Header */}
      <div className="p-4 bg-cyan-950/30 border-b border-cyan-900/50 flex justify-between items-center">
        <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest">
          多功能顯示器 / 遙測系統
        </h2>
        <button
          onClick={handleRecordClick}
          className={`${recordBtnClass} px-2 py-0.5 rounded text-[9px] hover:bg-red-900/80 transition-colors flex items-center gap-1 font-bold tracking-widest shadow-[0_0_10px_rgba(239,68,68,0.2)]`}
        >
          {isRecording && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
          <span>{isRecording ? 'RECORDING' : 'REC'}</span>
        </button>
      </div>

      {/* Test points list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 sc-scrollbar">
        {testPoints.map((point, index) => {
          const isActive = activeTab === index;
          return (
            <button
              key={index}
              onClick={() => handleTestPointClick(index)}
              className={`w-full text-left p-3 sc-btn transition-colors duration-200 border outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${isActive
                ? 'bg-cyan-900/40 border-cyan-500/50 shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]'
                : 'bg-[#061222]/50 border-transparent hover:bg-cyan-900/20 hover:border-cyan-800/50'
                }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`text-cyan-500 ${isActive ? 'opacity-100' : 'opacity-50'}`}
                  dangerouslySetInnerHTML={{ __html: point.icon }}
                />
                <h3 className={`font-bold text-[11px] tracking-widest uppercase ${isActive ? 'text-cyan-50' : 'text-cyan-400/70'}`}>
                  {point.title}
                </h3>
              </div>
              {isActive && (
                <div className="mt-3 pl-7 text-[12px] transition-opacity duration-300 opacity-100">
                  <p className="text-cyan-300/80 mb-2 leading-relaxed font-sans">{point.desc}</p>
                  <ul className="space-y-1.5 font-sans">
                    {point.details.map((detail, dIdx) => (
                      <li key={dIdx} className="text-cyan-100/60 flex items-start gap-1.5">
                        <span className="text-amber-500 mt-[2px]" aria-hidden="true">▹</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
