import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useSimulationStore } from '@/store/useSimulationStore';
import vaporVertShader from '@/shaders/vaporCone.vert.glsl';
import vaporFragShader from '@/shaders/vaporCone.frag.glsl';

/**
 * Volumetric vapor cone / cloud mesh rendered via ray marching.
 */
export function VaporCone() {
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMach: { value: 0.85 },
    uAoa: { value: 0.0 },
    uObjInvMatrix: { value: new THREE.Matrix4() },
    uCameraPos: { value: new THREE.Vector3() },
  }), []);

  const shaderMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader: vaporVertShader,
        fragmentShader: vaporFragShader,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.NormalBlending,
        side: THREE.BackSide,
      }),
    [uniforms],
  );

  useFrame(({ camera }) => {
    const state = useSimulationStore.getState();
    uniforms.uTime.value = state.time;
    uniforms.uMach.value = state.mach;
    uniforms.uAoa.value = state.aoa;
    uniforms.uCameraPos.value.copy(camera.position);

    // Get parent (objectGroup) inverse matrix
    if (meshRef.current?.parent) {
      uniforms.uObjInvMatrix.value.copy(meshRef.current.parent.matrixWorld).invert();
    }
  });

  return (
    <mesh ref={meshRef} material={shaderMat} frustumCulled={false}>
      <boxGeometry args={[24, 12, 12]} />
    </mesh>
  );
}
