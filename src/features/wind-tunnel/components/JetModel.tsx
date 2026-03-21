import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useAeroMaterial } from '../hooks/useAeroMaterial';
import { useSimulationStore } from '@/store/useSimulationStore';
import { computeJetGlowParams, computeCustomModelEmissive } from '@/utils/engineGlowHelper';
import {
  DARK_METAL_PARAMS,
  GLASS_MAT_PARAMS,
  GLOW_MAT_PARAMS,
  INNER_GLOW_MAT_PARAMS,
} from '@/shared/constants/materials';

/**
 * F-35 Lightning II jet model — built from Three.js primitives.
 */
export function JetModel() {
  const { armorMat, updateUniforms } = useAeroMaterial();
  const f35GroupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const innerGlowRef = useRef<THREE.Mesh>(null);

  const darkMetal = useMemo(() => new THREE.MeshStandardMaterial(DARK_METAL_PARAMS), []);
  const glassMat = useMemo(() => new THREE.MeshStandardMaterial(GLASS_MAT_PARAMS), []);
  const glowMat = useMemo(() => new THREE.MeshBasicMaterial(GLOW_MAT_PARAMS), []);
  const innerGlowMat = useMemo(() => new THREE.MeshBasicMaterial(INNER_GLOW_MAT_PARAMS), []);

  // Pre-build extrude settings
  const exSet = useMemo(() => ({
    depth: 0.05, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.02, bevelThickness: 0.02,
  }), []);

  // Wing shape
  const wingGeo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0); s.lineTo(1.5, 3.2); s.lineTo(2.3, 3.2); s.lineTo(3.4, 0); s.lineTo(0, 0);
    const geo = new THREE.ExtrudeGeometry(s, exSet); geo.center();
    return geo;
  }, [exSet]);

  // Vertical tail shape
  const vTailGeo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0); s.lineTo(1.2, 1.6); s.lineTo(2.0, 1.6); s.lineTo(1.8, 0); s.lineTo(0, 0);
    const geo = new THREE.ExtrudeGeometry(s, exSet); geo.center();
    return geo;
  }, [exSet]);

  // Horizontal tail shape
  const hTailGeo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0); s.lineTo(1.2, 1.6); s.lineTo(1.8, 1.6); s.lineTo(2.0, 0); s.lineTo(0, 0);
    const geo = new THREE.ExtrudeGeometry(s, exSet); geo.center();
    return geo;
  }, [exSet]);

  // Engine glow cone geometry
  const glowGeo = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.5, 1.0, 32);
    geo.rotateZ(-Math.PI / 2);
    geo.translate(0.5, 0, 0);
    return geo;
  }, []);

  const innerGlowGeo = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.25, 1.0, 32);
    geo.rotateZ(-Math.PI / 2);
    geo.translate(0.5, 0, 0);
    return geo;
  }, []);

  // Fuselage + nose geometries
  const fuselageGeo = useMemo(() => new THREE.CylinderGeometry(0.7, 0.7, 5.2, 32).rotateZ(Math.PI / 2), []);
  const noseGeo = useMemo(() => new THREE.ConeGeometry(0.65, 2.2, 32).rotateZ(Math.PI / 2), []);
  const cockpitGeo = useMemo(() => new THREE.SphereGeometry(0.35, 32, 16), []);

  const objectType = useSimulationStore((s) => s.objectType);

  useFrame(() => {
    const state = useSimulationStore.getState();
    updateUniforms(state.time, state.mach, state.aoa, state.density);

    // Engine glow animation
    if (state.objectType === 'f35' && glowRef.current && innerGlowRef.current) {
      const params = computeJetGlowParams(state.mach);
      glowRef.current.scale.copy(params.outerScale);
      (glowRef.current.material as THREE.MeshBasicMaterial).color.copy(params.outerColor);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = params.outerOpacity;
      innerGlowRef.current.scale.copy(params.innerScale);
      (innerGlowRef.current.material as THREE.MeshBasicMaterial).opacity = params.innerOpacity;
      (innerGlowRef.current.material as THREE.MeshBasicMaterial).color.copy(params.innerColor);
    }

    // Custom model emissive
    if (state.objectType === 'custom' && state.customModelMaterials.length > 0) {
      const { emissiveColor, emissiveIntensity } = computeCustomModelEmissive(state.mach);
      for (const mat of state.customModelMaterials) {
        if ('emissive' in mat) {
          (mat as THREE.MeshStandardMaterial).emissive.copy(emissiveColor);
          (mat as THREE.MeshStandardMaterial).emissiveIntensity = emissiveIntensity;
        }
      }
    }
  });

  return (
    <group ref={f35GroupRef} visible={objectType === 'f35'}>
      {/* Fuselage */}
      <mesh geometry={fuselageGeo} material={armorMat} scale={[1, 0.65, 1.25]} position={[-0.2, 0, 0]} />
      {/* Nose */}
      <mesh geometry={noseGeo} material={armorMat} position={[-3.9, 0, 0]} scale={[1, 0.6, 1.25]} />
      {/* Cockpit */}
      <mesh geometry={cockpitGeo} material={glassMat} position={[-1.6, 0.45, 0]} scale={[4.2, 1.2, 0.9]} />
      {/* Engine */}
      <mesh position={[2.8, 0, 0]} material={darkMetal}>
        <cylinderGeometry args={[0.55, 0.65, 1.0, 32]} />
      </mesh>
      {/* Glow + inner glow */}
      <mesh ref={glowRef} geometry={glowGeo} material={glowMat} position={[3.3, 0, 0]}>
        <mesh ref={innerGlowRef} geometry={innerGlowGeo} material={innerGlowMat} />
      </mesh>
      {/* Wings */}
      <mesh geometry={wingGeo} material={armorMat} rotation={[Math.PI / 2, 0, 0]} position={[0.2, 0, 1.6]} />
      <mesh geometry={wingGeo} material={armorMat} rotation={[-Math.PI / 2, 0, 0]} position={[0.2, 0, -1.6]} />
      {/* Vertical tails */}
      <mesh geometry={vTailGeo} material={armorMat} position={[2.0, 0.7, 0.5]} rotation={[-0.43, 0, 0]} />
      <mesh geometry={vTailGeo} material={armorMat} position={[2.0, 0.7, -0.5]} rotation={[0.43, 0, 0]} />
      {/* Horizontal tails */}
      <mesh geometry={hTailGeo} material={armorMat} rotation={[Math.PI / 2, 0, 0]} position={[2.4, 0.1, 1.0]} />
      <mesh geometry={hTailGeo} material={armorMat} rotation={[-Math.PI / 2, 0, 0]} position={[2.4, 0.1, -1.0]} />
      {/* Intakes */}
      <mesh material={darkMetal} position={[-0.8, -0.1, 1.1]} rotation={[0, -0.15, 0]}>
        <boxGeometry args={[1.8, 0.6, 0.8]} />
      </mesh>
      <mesh material={darkMetal} position={[-0.8, -0.1, -1.1]} rotation={[0, 0.15, 0]}>
        <boxGeometry args={[1.8, 0.6, 0.8]} />
      </mesh>
      {/* DSI bumps */}
      <mesh material={armorMat} position={[-1.5, 0.05, 0.85]} scale={[1.5, 1.0, 0.6]}>
        <sphereGeometry args={[0.35, 16, 16]} />
      </mesh>
      <mesh material={armorMat} position={[-1.5, 0.05, -0.85]} scale={[1.5, 1.0, 0.6]}>
        <sphereGeometry args={[0.35, 16, 16]} />
      </mesh>
    </group>
  );
}
