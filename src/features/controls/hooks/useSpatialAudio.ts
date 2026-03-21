import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { useSimulationStore } from '@/store/useSimulationStore';

/**
 * 3D spatial audio engine hook.
 * Manages AudioContext, pink noise wind, engine oscillators, stall alarm, sonic boom.
 */
export function useSpatialAudio() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{
    masterGain: GainNode;
    panner: PannerNode;
    windGain: GainNode;
    windFilter: BiquadFilterNode;
    engineOsc1: OscillatorNode;
    engineOsc2: OscillatorNode;
    engineOsc3: OscillatorNode;
    engineGain: GainNode;
    stallOsc1: OscillatorNode;
    stallOsc2: OscillatorNode;
    stallGain: GainNode;
  } | null>(null);
  const isSonicBoomPlayed = useRef(false);

  const initAudio = useCallback(() => {
    if (audioCtxRef.current) return;
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioCtxRef.current = audioCtx;

    const masterGain = audioCtx.createGain();
    masterGain.connect(audioCtx.destination);
    masterGain.gain.value = 0.5;

    // 3D spatial panner
    const panner = audioCtx.createPanner();
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'inverse';
    panner.refDistance = 10;
    panner.maxDistance = 10000;
    panner.rolloffFactor = 1.5;
    panner.connect(masterGain);

    // Pink noise wind
    const bufferSize = audioCtx.sampleRate * 2;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    const windSource = audioCtx.createBufferSource();
    windSource.buffer = noiseBuffer;
    windSource.loop = true;
    const windFilter = audioCtx.createBiquadFilter();
    windFilter.type = 'lowpass';
    windFilter.frequency.value = 400;
    const windGain = audioCtx.createGain();
    windGain.gain.value = 0;
    windSource.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(panner);
    windSource.start();

    // Engine oscillators (beating effect)
    const engineOsc1 = audioCtx.createOscillator(); engineOsc1.type = 'sawtooth';
    const engineOsc2 = audioCtx.createOscillator(); engineOsc2.type = 'sawtooth';
    const engineOsc3 = audioCtx.createOscillator(); engineOsc3.type = 'square';
    const engineGain = audioCtx.createGain(); engineGain.gain.value = 0;
    engineOsc1.connect(engineGain);
    engineOsc2.connect(engineGain);
    engineOsc3.connect(engineGain);
    engineGain.connect(panner);
    engineOsc1.start(); engineOsc2.start(); engineOsc3.start();

    // Stall warning dual-tone
    const stallOsc1 = audioCtx.createOscillator(); stallOsc1.type = 'square'; stallOsc1.frequency.value = 800;
    const stallOsc2 = audioCtx.createOscillator(); stallOsc2.type = 'square'; stallOsc2.frequency.value = 840;
    const stallGain = audioCtx.createGain(); stallGain.gain.value = 0;
    stallOsc1.connect(stallGain);
    stallOsc2.connect(stallGain);
    stallGain.connect(masterGain);
    stallOsc1.start(); stallOsc2.start();

    nodesRef.current = {
      masterGain, panner, windGain, windFilter,
      engineOsc1, engineOsc2, engineOsc3, engineGain,
      stallOsc1, stallOsc2, stallGain,
    };
  }, []);

  // Init audio on first user click
  useEffect(() => {
    document.body.addEventListener('click', initAudio, { once: true });
    return () => document.body.removeEventListener('click', initAudio);
  }, [initAudio]);

  /** Call from useFrame to update audio each tick */
  const updateAudio = useCallback((camera: THREE.Camera, objectGroup: THREE.Object3D) => {
    const audioCtx = audioCtxRef.current;
    const nodes = nodesRef.current;
    if (!audioCtx || !nodes) return;

    const state = useSimulationStore.getState();
    const t = audioCtx.currentTime;

    // Update 3D listener position (camera)
    const listener = audioCtx.listener;
    if (listener.positionX) {
      listener.positionX.value = camera.position.x;
      listener.positionY.value = camera.position.y;
      listener.positionZ.value = camera.position.z;
      const dir = new THREE.Vector3();
      camera.getWorldDirection(dir);
      listener.forwardX.value = dir.x;
      listener.forwardY.value = dir.y;
      listener.forwardZ.value = dir.z;
    }

    // Update sound source position (jet)
    const jetPos = new THREE.Vector3();
    objectGroup.getWorldPosition(jetPos);
    if (nodes.panner.positionX) {
      nodes.panner.positionX.value = jetPos.x;
      nodes.panner.positionY.value = jetPos.y;
      nodes.panner.positionZ.value = jetPos.z;
    }

    // Dynamic wind
    nodes.windGain.gain.setTargetAtTime(Math.min(1.5, state.mach * 0.8), t, 0.1);
    nodes.windFilter.frequency.setTargetAtTime(400 + state.mach * 3000, t, 0.1);

    // Dynamic engine beat
    nodes.engineGain.gain.setTargetAtTime(0.15 + state.mach * 0.15, t, 0.1);
    nodes.engineOsc1.frequency.setTargetAtTime(60 + state.mach * 20, t, 0.1);
    nodes.engineOsc2.frequency.setTargetAtTime(62 + state.mach * 22, t, 0.1);
    nodes.engineOsc3.frequency.setTargetAtTime(119 + state.mach * 40, t, 0.1);

    // Sonic boom
    if (state.mach >= 1.0 && !isSonicBoomPlayed.current) {
      isSonicBoomPlayed.current = true;
      const boomOsc = audioCtx.createOscillator(); boomOsc.type = 'sawtooth';
      const boomFilter = audioCtx.createBiquadFilter(); boomFilter.type = 'lowpass';
      boomFilter.frequency.setValueAtTime(800, t); boomFilter.frequency.exponentialRampToValueAtTime(50, t + 0.5);
      const boomGain = audioCtx.createGain();
      boomOsc.frequency.setValueAtTime(150, t); boomOsc.frequency.exponentialRampToValueAtTime(20, t + 0.5);
      boomGain.gain.setValueAtTime(4.0, t); boomGain.gain.exponentialRampToValueAtTime(0.01, t + 0.8);
      boomOsc.connect(boomFilter); boomFilter.connect(boomGain); boomGain.connect(nodes.masterGain);
      boomOsc.start(); boomOsc.stop(t + 1);
    } else if (state.mach < 0.95) {
      isSonicBoomPlayed.current = false;
    }

    // Stall warning rhythm
    if (Math.abs(state.aoa) >= 20) {
      nodes.stallGain.gain.value = (Math.floor(state.time * 8) % 2 === 0) ? 0.15 : 0;
    } else {
      nodes.stallGain.gain.value = 0;
    }
  }, []);

  return { updateAudio };
}
