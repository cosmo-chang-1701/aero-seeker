import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useSimulationStore } from '@/store/useSimulationStore';
import { useGPGPUCompute } from '../hooks/useGPGPUCompute';
import { createSmokeTexture } from '../utils/createSmokeTexture';
import { TEXTURE_WIDTH, TUNNEL_LENGTH } from '@/shared/constants/simulation';
import smokeVertShader from '@/shaders/smokeParticle.vert.glsl';
import smokeFragShader from '@/shaders/smokeParticle.frag.glsl';

/**
 * GPGPU-driven particle system rendered as points.
 */
export function GPGPUParticles({ objectGroup }: { objectGroup: THREE.Group | null }) {
  const { gl } = useThree();
  const pointsRef = useRef<THREE.Points>(null);
  const { init, compute } = useGPGPUCompute(gl);
  const isInitialized = useRef(false);

  const smokeTex = useMemo(() => createSmokeTexture(), []);

  const uniforms = useMemo(() => ({
    texturePosition: { value: null as THREE.Texture | null },
    smokeTex: { value: smokeTex },
    smokeSize: { value: 0.75 },
    density: { value: 0.25 },
    time: { value: 0 },
    smokeMode: { value: 0 },
    tunnelLength: { value: TUNNEL_LENGTH },
  }), [smokeTex]);

  const shaderMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader: smokeVertShader,
        fragmentShader: smokeFragShader,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [uniforms],
  );

  // Build UV-based geometry
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const uvs = new Float32Array(TEXTURE_WIDTH * TEXTURE_WIDTH * 3);
    let pUv = 0;
    for (let j = 0; j < TEXTURE_WIDTH; j++) {
      for (let i = 0; i < TEXTURE_WIDTH; i++) {
        uvs[pUv++] = i / (TEXTURE_WIDTH - 1);
        uvs[pUv++] = j / (TEXTURE_WIDTH - 1);
        uvs[pUv++] = 0.0;
      }
    }
    geo.setAttribute('position', new THREE.BufferAttribute(uvs, 3));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 100);
    geo.boundingBox = new THREE.Box3(new THREE.Vector3(-100, -100, -100), new THREE.Vector3(100, 100, 100));
    return geo;
  }, []);

  useEffect(() => {
    if (!isInitialized.current) {
      init(gl);
      isInitialized.current = true;
    }
  }, [gl, init]);

  useFrame(() => {
    const state = useSimulationStore.getState();
    if (state.isPaused || !objectGroup) return;

    uniforms.smokeSize.value = state.smokeSize;
    uniforms.density.value = state.density;
    uniforms.time.value = state.time;
    uniforms.smokeMode.value = state.smokeMode;

    const posTex = compute(
      state.time,
      Math.min(0.1, 0.016), // capped dt
      state.windSpeed,
      objectGroup.matrixWorld,
      state.objectType,
      state.customSize,
    );

    if (posTex) {
      uniforms.texturePosition.value = posTex;
    }
  });

  return <points ref={pointsRef} geometry={geometry} material={shaderMat} frustumCulled={false} />;
}
