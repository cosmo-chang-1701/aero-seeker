import { create } from 'zustand';
import * as THREE from 'three';
import { INITIAL_CAMERA_POSITION } from '@/shared/constants/simulation';

/**
 * Zustand store — single source of truth for all simulation state.
 */

export interface TelemetryRecord {
  time: string;
  mach: string;
  windSpeed: string;
  aoa: string;
  yaw: string;
  roll: string;
}

interface SimulationState {
  // --- Simulation Parameters ---
  isPaused: boolean;
  mach: number;
  windSpeed: number;
  aoa: number;
  roll: number;
  yaw: number;
  density: number;
  smokeSize: number;
  objectType: 'f35' | 'custom';
  smokeMode: number;
  bloomEnabled: boolean;
  time: number;
  customSize: { a: number; b: number; c: number };

  // --- Model References ---
  customModelGroup: THREE.Group | null;
  customModelMaterials: THREE.Material[];

  // --- Camera State ---
  camTheta: number;
  camPhi: number;
  targetRadius: number;
  isCameraTweening: boolean;
  targetCamPos: THREE.Vector3;
  targetCamLook: THREE.Vector3;
  isFreeCameraMode: boolean;

  // --- Input State ---
  keys: Record<'q' | 'w' | 'e' | 'a' | 's' | 'd', boolean>;
  isPointerLocked: boolean;
  targetAoA: number;
  targetYaw: number;
  targetRoll: number;

  // --- Telemetry / Recording ---
  isRecording: boolean;
  telemetryData: TelemetryRecord[];
  lastRecordTime: number;
  activeTab: number;
  showMatrix: boolean;

  // --- Voice ---
  isVoiceActive: boolean;

  // --- Cooldown ---
  showCooldown: boolean;

  // --- Gamepad ---
  gamepadConnected: boolean;

  // --- XR (VR/AR) ---
  isXRPresenting: boolean;

  // --- Actions ---
  setSimParam: (updates: Partial<Pick<SimulationState,
    'isPaused' | 'mach' | 'windSpeed' | 'aoa' | 'roll' | 'yaw' |
    'density' | 'smokeSize' | 'objectType' | 'smokeMode' | 'bloomEnabled' |
    'time' | 'customSize'
  >>) => void;
  setCustomModel: (group: THREE.Group | null, materials: THREE.Material[]) => void;
  setCameraState: (updates: Partial<Pick<SimulationState,
    'camTheta' | 'camPhi' | 'targetRadius' | 'isCameraTweening' |
    'targetCamPos' | 'targetCamLook' | 'isFreeCameraMode'
  >>) => void;
  setInputState: (updates: Partial<Pick<SimulationState,
    'isPointerLocked' | 'targetAoA' | 'targetYaw' | 'targetRoll'
  >>) => void;
  setKey: (key: 'q' | 'w' | 'e' | 'a' | 's' | 'd', pressed: boolean) => void;
  resetKeys: () => void;
  toggleRecording: () => void;
  pushTelemetry: (record: TelemetryRecord) => void;
  clearTelemetry: () => void;
  setActiveTab: (tab: number) => void;
  toggleMatrix: () => void;
  toggleVoice: () => void;
  setShowCooldown: (show: boolean) => void;
  setGamepadConnected: (connected: boolean) => void;
  setXRPresenting: (presenting: boolean) => void;
}

const initSpherical = new THREE.Spherical().setFromVector3(
  new THREE.Vector3(INITIAL_CAMERA_POSITION.x, INITIAL_CAMERA_POSITION.y, INITIAL_CAMERA_POSITION.z)
);

export const useSimulationStore = create<SimulationState>((set) => ({
  // Simulation
  isPaused: false,
  mach: 0.85,
  windSpeed: 5.0,
  aoa: 0,
  roll: 0,
  yaw: 0,
  density: 0.30,
  smokeSize: 0.75,
  objectType: 'f35',
  smokeMode: 1,
  bloomEnabled: true,
  time: 0,
  customSize: { a: 1.0, b: 1.0, c: 1.0 },

  // Model
  customModelGroup: null,
  customModelMaterials: [],

  // Camera
  camTheta: initSpherical.theta,
  camPhi: initSpherical.phi,
  targetRadius: initSpherical.radius,
  isCameraTweening: false,
  targetCamPos: new THREE.Vector3(INITIAL_CAMERA_POSITION.x, INITIAL_CAMERA_POSITION.y, INITIAL_CAMERA_POSITION.z),
  targetCamLook: new THREE.Vector3(0, 0, 0),
  isFreeCameraMode: false,

  // Input
  keys: { q: false, w: false, e: false, a: false, s: false, d: false },
  isPointerLocked: false,
  targetAoA: 0,
  targetYaw: 0,
  targetRoll: 0,

  // Telemetry
  isRecording: false,
  telemetryData: [],
  lastRecordTime: 0,
  activeTab: 0,
  showMatrix: false,

  // Voice
  isVoiceActive: false,

  // Cooldown
  showCooldown: false,

  // Gamepad
  gamepadConnected: false,

  // XR
  isXRPresenting: false,

  // Actions
  setSimParam: (updates) => set((state) => ({ ...state, ...updates })),
  setCustomModel: (group, materials) => set({ customModelGroup: group, customModelMaterials: materials }),
  setCameraState: (updates) => set((state) => ({ ...state, ...updates })),
  setInputState: (updates) => set((state) => ({ ...state, ...updates })),
  setKey: (key, pressed) => set((state) => ({ keys: { ...state.keys, [key]: pressed } })),
  resetKeys: () => set({ keys: { q: false, w: false, e: false, a: false, s: false, d: false } }),
  toggleRecording: () => set((state) => ({ isRecording: !state.isRecording })),
  pushTelemetry: (record) => set((state) => ({ telemetryData: [...state.telemetryData, record] })),
  clearTelemetry: () => set({ telemetryData: [], lastRecordTime: 0 }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleMatrix: () => set((state) => ({ showMatrix: !state.showMatrix })),
  toggleVoice: () => set((state) => ({ isVoiceActive: !state.isVoiceActive })),
  setShowCooldown: (show) => set({ showCooldown: show }),
  setGamepadConnected: (connected) => set({ gamepadConnected: connected }),
  setXRPresenting: (presenting) => set({ isXRPresenting: presenting }),
}));
