import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';
import {
  TEXTURE_WIDTH, TUNNEL_LENGTH, LINES_Y, LINES_Z, POINTS_PER_LINE,
} from '@/shared/constants/simulation';
import gpgpuPositionShader from '@/shaders/gpgpuPosition.glsl';

/**
 * GPGPU particle position compute hook.
 
 * Manages GPUComputationRenderer lifecycle, initializes particle grid, runs compute each frame.
 */
export function useGPGPUCompute(renderer: THREE.WebGLRenderer | null) {
  const gpuComputeRef = useRef<GPUComputationRenderer | null>(null);
  const positionVariableRef = useRef<any>(null);

  const initPosTex = useMemo(() => {
    const initPosArray = new Float32Array(TEXTURE_WIDTH * TEXTURE_WIDTH * 4);
    let pIdx = 0;
    for (let j = 0; j < LINES_Z; j++) {
      for (let i = 0; i < LINES_Y; i++) {
        const y = -4.0 + (i / (LINES_Y - 1)) * 8.0;
        const z = -4.0 + (j / (LINES_Z - 1)) * 8.0;
        for (let k = 0; k < POINTS_PER_LINE; k++) {
          initPosArray[pIdx] = -TUNNEL_LENGTH / 2.0;
          initPosArray[pIdx + 1] = y;
          initPosArray[pIdx + 2] = z;
          initPosArray[pIdx + 3] = 1.0;
          pIdx += 4;
        }
      }
    }
    const tex = new THREE.DataTexture(
      initPosArray, TEXTURE_WIDTH, TEXTURE_WIDTH, THREE.RGBAFormat, THREE.FloatType
    );
    tex.needsUpdate = true;
    return tex;
  }, []);

  /** Initialize GPGPU — call once renderer is available */
  function init(gl: THREE.WebGLRenderer) {
    if (gpuComputeRef.current) return;

    const gpuCompute = new GPUComputationRenderer(TEXTURE_WIDTH, TEXTURE_WIDTH, gl);
    const dtPosition = gpuCompute.createTexture();
    const posArray = dtPosition.image.data as unknown as Float32Array;

    let pIdx = 0;
    for (let j = 0; j < LINES_Z; j++) {
      for (let i = 0; i < LINES_Y; i++) {
        const y = -4.0 + (i / (LINES_Y - 1)) * 8.0;
        const z = -4.0 + (j / (LINES_Z - 1)) * 8.0;
        for (let k = 0; k < POINTS_PER_LINE; k++) {
          const x = -TUNNEL_LENGTH / 2.0 + (k / POINTS_PER_LINE) * TUNNEL_LENGTH;
          posArray[pIdx] = x;
          posArray[pIdx + 1] = y;
          posArray[pIdx + 2] = z;
          posArray[pIdx + 3] = 1.0;
          pIdx += 4;
        }
      }
    }

    const positionVariable = gpuCompute.addVariable('texturePosition', gpgpuPositionShader, dtPosition);
    gpuCompute.setVariableDependencies(positionVariable, [positionVariable]);

    positionVariable.material.uniforms = {
      time: { value: 0.0 },
      delta: { value: 0.016 },
      windSpeed: { value: 5.0 },
      objMatrix: { value: new THREE.Matrix4() },
      objInvMatrix: { value: new THREE.Matrix4() },
      textureInitPos: { value: initPosTex },
      tunnelLength: { value: TUNNEL_LENGTH },
      uObjectType: { value: 0 },
      uCustomSize: { value: new THREE.Vector3(1, 1, 1) },
    };

    gpuCompute.init();
    gpuComputeRef.current = gpuCompute;
    positionVariableRef.current = positionVariable;
  }

  /** Run compute pass and sync uniforms. Returns the current position texture. */
  function compute(
    time: number,
    dt: number,
    windSpeed: number,
    objMatrixWorld: THREE.Matrix4,
    objectType: string,
    customSize: { a: number; b: number; c: number },
  ): THREE.Texture | null {
    const gpuCompute = gpuComputeRef.current;
    const posVar = positionVariableRef.current;
    if (!gpuCompute || !posVar) return null;

    const u = posVar.material.uniforms;
    u.time.value = time;
    u.delta.value = dt;
    u.windSpeed.value = windSpeed;
    u.objMatrix.value.copy(objMatrixWorld);
    u.objInvMatrix.value.copy(objMatrixWorld).invert();
    u.uObjectType.value = objectType === 'f35' ? 0 : 1;
    u.uCustomSize.value.set(customSize.a, customSize.b, customSize.c);

    gpuCompute.compute();

    return gpuCompute.getCurrentRenderTarget(posVar).texture;
  }

  return { init, compute };
}
