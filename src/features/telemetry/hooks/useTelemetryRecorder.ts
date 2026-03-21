import { useCallback } from 'react';
import { useSimulationStore, type TelemetryRecord } from '@/store/useSimulationStore';

/**
 * Telemetry recorder hook.
 
 * Handles recording state transitions and CSV export.
 */
export function useTelemetryRecorder() {
  const exportTelemetryData = useCallback(() => {
    const { telemetryData } = useSimulationStore.getState();
    if (telemetryData.length === 0) return;

    let csvContent = 'data:text/csv;charset=utf-8,Time(s),Mach,WindSpeed,AoA,Yaw,Roll\n';
    telemetryData.forEach((row: TelemetryRecord) => {
      csvContent += `${row.time},${row.mach},${row.windSpeed},${row.aoa},${row.yaw},${row.roll}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'telemetry_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return { exportTelemetryData };
}
