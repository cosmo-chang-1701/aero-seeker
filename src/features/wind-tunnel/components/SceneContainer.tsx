import { useRef, useCallback } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { XR } from '@react-three/xr';
import { useSimulationStore } from '@/store/useSimulationStore';
import { usePointerControl } from '@/features/controls/hooks/usePointerControl';
import { useSpatialAudio } from '@/features/controls/hooks/useSpatialAudio';
import { useXRSession } from '@/features/controls/hooks/useXRSession';
import { applyGamepadControls } from '@/features/controls/hooks/useGamepadController';
import { useModelLoader } from '../hooks/useModelLoader';
import { computeShakeIntensity, applyShakeOffset } from '@/utils/cameraShake';
import { GRID_CONFIG, INITIAL_CAMERA_POSITION } from '@/shared/constants/simulation';
import { JetModel } from './JetModel';
import { VaporCone } from './VaporCone';
import { GPGPUParticles } from './GPGPUParticles';

/**
 * Inner scene that runs inside the Canvas — contains the animate loop.
 */
function InnerScene() {
  const objectGroupRef = useRef<THREE.Group>(null);
  const f35GroupRef = useRef<THREE.Group>(null);
  const { camera, gl } = useThree();
  const { updateAudio } = useSpatialAudio();

  // Sync XR (VR/AR) session state into global store
  useXRSession();

  // Pointer control needs the canvas DOM element
  usePointerControl(gl.domElement);

  // Model loader
  useModelLoader(objectGroupRef.current, f35GroupRef.current);

  // Main animation loop — replaces the original animate()
  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.1);
    const store = useSimulationStore.getState();

    if (!store.isPaused) {
      const newTime = store.time + dt;
      let stateChanged = false;

      applyGamepadControls(dt);

      const turnRate = 80 * dt;
      const accelRate = 0.8 * dt;
      const isRotKeyboardActive = store.keys.q || store.keys.e || store.keys.a || store.keys.d;

      let mach = store.mach, aoa = store.aoa, roll = store.roll, yaw = store.yaw;
      let targetAoA = store.targetAoA, targetYaw = store.targetYaw, targetRoll = store.targetRoll;

      if (store.keys.w) { mach += accelRate; stateChanged = true; }
      if (store.keys.s) { mach -= accelRate; stateChanged = true; }
      if (store.keys.q) { roll += turnRate; targetRoll = roll; stateChanged = true; }
      if (store.keys.e) { roll -= turnRate; targetRoll = roll; stateChanged = true; }
      if (store.keys.a) { yaw -= turnRate; targetYaw = yaw; stateChanged = true; }
      if (store.keys.d) { yaw += turnRate; targetYaw = yaw; stateChanged = true; }

      if (!store.isFreeCameraMode) {
        if (!isRotKeyboardActive) {
          if (Math.abs(targetAoA - aoa) > 0.05) { aoa += (targetAoA - aoa) * 0.15; stateChanged = true; } else aoa = targetAoA;
          if (Math.abs(targetYaw - yaw) > 0.05) { yaw += (targetYaw - yaw) * 0.15; stateChanged = true; } else yaw = targetYaw;
          if (Math.abs(targetRoll - roll) > 0.05) { roll += (targetRoll - roll) * 0.15; stateChanged = true; } else roll = targetRoll;
        } else {
          targetAoA = aoa; targetYaw = yaw; targetRoll = roll;
        }
      }

      mach = Math.max(0.2, Math.min(2.5, mach));
      aoa = Math.max(-90, Math.min(90, aoa));
      roll = Math.max(-180, Math.min(180, roll));
      yaw = Math.max(-180, Math.min(180, yaw));

      store.setSimParam({ time: newTime, mach, windSpeed: mach * 5.0, aoa, roll, yaw });
      store.setInputState({ targetAoA, targetYaw, targetRoll });

      // Rotate object group
      if (objectGroupRef.current) {
        objectGroupRef.current.rotation.order = 'ZYX';
        objectGroupRef.current.rotation.z = THREE.MathUtils.degToRad(-aoa);
        objectGroupRef.current.rotation.x = THREE.MathUtils.degToRad(roll);
        objectGroupRef.current.rotation.y = THREE.MathUtils.degToRad(-yaw);
        objectGroupRef.current.updateMatrixWorld();
      }

      // Telemetry recording
      if (store.isRecording && (newTime - store.lastRecordTime > 0.1)) {
        store.pushTelemetry({
          time: newTime.toFixed(2),
          mach: mach.toFixed(3),
          windSpeed: (mach * 5.0).toFixed(1),
          aoa: aoa.toFixed(2),
          yaw: yaw.toFixed(2),
          roll: roll.toFixed(2),
        });
        useSimulationStore.setState({ lastRecordTime: newTime });
      }

      // Update spatial audio
      if (objectGroupRef.current) {
        updateAudio(camera, objectGroupRef.current);
      }
    }

    // Camera control — skip entirely when XR is presenting
    // (in VR mode the HMD controls the camera via WebXR tracking)
    const state = useSimulationStore.getState();
    if (!state.isXRPresenting) {
      if (state.isCameraTweening) {
        camera.position.lerp(state.targetCamPos, 0.04);
        const target = new THREE.Vector3(0, 0, 0).lerp(state.targetCamLook, 1);
        const s = new THREE.Spherical().setFromVector3(camera.position.clone().sub(target));
        store.setCameraState({ camTheta: s.theta, camPhi: s.phi, targetRadius: s.radius });
        if (camera.position.distanceTo(state.targetCamPos) < 0.1) {
          store.setCameraState({ isCameraTweening: false });
        }
        camera.lookAt(target);
      } else {
        const target = new THREE.Vector3(0, 0, 0);
        let currentRadius = camera.position.distanceTo(target);
        currentRadius += (state.targetRadius - currentRadius) * 0.15;
        const s = new THREE.Spherical(currentRadius, state.camPhi, state.camTheta);
        camera.position.copy(new THREE.Vector3().setFromSpherical(s).add(target));
        camera.lookAt(target);

        if (!state.isPaused) {
          const intensity = computeShakeIntensity(state.mach, state.aoa, state.windSpeed);
          if (intensity > 0.01) {
            const shaken = applyShakeOffset(camera.position.x, camera.position.y, camera.position.z, intensity);
            camera.position.set(shaken.x, shaken.y, shaken.z);
          }
        }
      }
    }
  });

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[-5, 10, 5]} intensity={1.5} />
      <pointLight color={0x4488ff} intensity={1} distance={20} position={[0, -5, 0]} />

      {/* Grid */}
      <gridHelper
        args={[GRID_CONFIG.size, GRID_CONFIG.divisions, GRID_CONFIG.centerColor, GRID_CONFIG.gridColor]}
        position={[0, GRID_CONFIG.yOffset, 0]}
      />

      {/* Object group — rotated by flight controls */}
      <group ref={objectGroupRef}>
        <group ref={f35GroupRef}>
          <JetModel />
        </group>
        <VaporCone />
      </group>

      {/* GPGPU Particles — in world space */}
      <GPGPUParticles objectGroup={objectGroupRef.current} />
    </>
  );
}

/**
 * Scene container — the R3F Canvas root.
 */
export function SceneContainer() {
  const bloomEnabled = useSimulationStore((s) => s.bloomEnabled);
  const isXRPresenting = useSimulationStore((s) => s.isXRPresenting);

  /**
   * Bloom post-processing (EffectComposer) is disabled during XR sessions.
   * WHY: EffectComposer renders to an off-screen framebuffer then blits to screen,
   * which breaks the WebXR stereo rendering pipeline.
   */
  const shouldRenderBloom = bloomEnabled && !isXRPresenting;

  return (
    <div id="canvas-container">
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 1000,
          position: [INITIAL_CAMERA_POSITION.x, INITIAL_CAMERA_POSITION.y, INITIAL_CAMERA_POSITION.z],
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        dpr={[1, 2]}
      >
        <XR>
          <InnerScene />
          {shouldRenderBloom && (
            <EffectComposer>
              <Bloom luminanceThreshold={0.9} luminanceSmoothing={0.5} intensity={0.8} />
            </EffectComposer>
          )}
        </XR>
      </Canvas>
    </div>
  );
}
