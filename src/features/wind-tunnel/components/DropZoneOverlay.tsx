import { useSimulationStore } from '@/store/useSimulationStore';

/**
 * Drag & drop overlay.
 */
export function DropZoneOverlay() {
  // Show/hide is managed by CSS based on drag events in useModelLoader
  // For simplicity, we keep it always mounted but hidden, toggled by drag events
  return (
    <div
      id="drop-zone"
      className="fixed inset-0 z-[100] hidden bg-[#040f1c]/90 backdrop-blur-md flex-col items-center justify-center border-4 border-dashed border-cyan-500/80"
    >
      <h2 className="text-3xl font-bold text-cyan-50 tracking-widest uppercase shadow-cyan-500/50 drop-shadow-lg">
        部署自定義測試模組
      </h2>
      <p className="text-cyan-400/80 mt-2 tracking-wider">
        放開滑鼠以上傳 .GLTF 或 .GLB 檔案，系統將自動建構流場
      </p>
    </div>
  );
}
