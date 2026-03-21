import { useEffect } from 'react';
import { useSimulationStore } from '@/store/useSimulationStore';

/**
 * Voice control hook using Web Speech API.
 
 * Recognizes Chinese voice commands to control simulation parameters.
 */
export function useVoiceControl() {
  const isVoiceActive = useSimulationStore((s) => s.isVoiceActive);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition || !isVoiceActive) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-TW';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const command: string = event.results[last][0].transcript.trim();
      const store = useSimulationStore.getState();

      // Speed / Mach control
      if (command.includes('馬赫') || command.includes('速度')) {
        const match = command.match(/\d+(\.\d+)?/);
        if (match) store.setSimParam({ mach: parseFloat(match[0]) });
      }

      // Matrix toggle
      if (command.includes('矩陣')) {
        if (command.includes('展開') || command.includes('開啟')) {
          if (!store.showMatrix) store.toggleMatrix();
        } else if (command.includes('關閉') || command.includes('隱藏')) {
          if (store.showMatrix) store.toggleMatrix();
        }
      }

      // Recording
      if (command.includes('錄影') || command.includes('遙測')) {
        if (command.includes('啟動') || command.includes('開始')) {
          if (!store.isRecording) store.toggleRecording();
        } else if (command.includes('停止') || command.includes('結束')) {
          if (store.isRecording) store.toggleRecording();
        }
      }
    };

    recognition.onerror = (e: any) => console.warn('Speech recognition error:', e);
    recognition.onend = () => {
      if (useSimulationStore.getState().isVoiceActive) recognition.start();
    };

    recognition.start();

    return () => {
      recognition.onend = null;
      recognition.stop();
    };
  }, [isVoiceActive]);
}
