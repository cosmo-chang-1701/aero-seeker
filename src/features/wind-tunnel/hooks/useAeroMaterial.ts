import { useRef, useMemo } from 'react';
import * as THREE from 'three';

/**
 * Aero surface material hook with onBeforeCompile shader injection.
 
 * Returns a MeshStandardMaterial with dynamic heatmap + tail flex shaders.
 */
export function useAeroMaterial() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shaderRef = useRef<any>(null);

  const armorMat = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: 0x485058,
      roughness: 0.6,
      metalness: 0.5,
    });

    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      shader.uniforms.uAeroLoad = { value: 0 };
      shader.uniforms.uWindVector = { value: new THREE.Vector3(-1, 0, 0) };
      shader.uniforms.uDynPressure = { value: 0 };

      // Vertex: prepend uniforms + varying
      shader.vertexShader = `
        uniform float uTime;
        uniform float uAeroLoad;
        varying vec3 vWorldNormal;
        ${shader.vertexShader}
      `;

      // Vertex: tail flex + flutter
      shader.vertexShader = shader.vertexShader.replace(
        `#include <begin_vertex>`,
        `#include <begin_vertex>
        float distZ = max(0.0, abs(position.z) - 0.5);
        float flex = distZ * distZ * uAeroLoad * 0.15;
        float flutter = sin(uTime * 45.0 + position.x * 5.0) * distZ * abs(uAeroLoad) * 0.02;
        transformed.y += flex + flutter;`,
      );

      // Vertex: world normal calculation
      shader.vertexShader = shader.vertexShader.replace(
        `#include <worldpos_vertex>`,
        `#include <worldpos_vertex>
        vWorldNormal = normalize((modelMatrix * vec4(objectNormal, 0.0)).xyz);`,
      );

      // Fragment: prepend uniforms + varying
      shader.fragmentShader = `
        uniform vec3 uWindVector;
        uniform float uDynPressure;
        varying vec3 vWorldNormal;
        ${shader.fragmentShader}
      `;

      // Fragment: pressure heatmap coloring
      shader.fragmentShader = shader.fragmentShader.replace(
        `#include <emissivemap_fragment>`,
        `#include <emissivemap_fragment>
        float facingWind = max(0.0, dot(normalize(vWorldNormal), normalize(uWindVector)));
        float localPressure = facingWind * uDynPressure;
        float pNorm = clamp(localPressure * 1.5, 0.0, 1.0);

        vec3 hmColor = mix(vec3(0.0), vec3(0.0, 0.3, 0.8), clamp(pNorm * 3.0, 0.0, 1.0));
        hmColor = mix(hmColor, vec3(0.0, 0.8, 1.0), clamp((pNorm - 0.33) * 3.0, 0.0, 1.0));
        hmColor = mix(hmColor, vec3(1.0, 0.1, 0.0), clamp((pNorm - 0.66) * 3.0, 0.0, 1.0));

        totalEmissiveRadiance += hmColor * pNorm * 2.5;`,
      );

      shaderRef.current = shader;
    };

    return mat;
  }, []);

  /** Call from useFrame to sync uniforms each tick */
  function updateUniforms(time: number, mach: number, aoa: number, density: number) {
    const shader = shaderRef.current;
    if (!shader) return;

    const aeroLoad = (mach * mach) * (aoa / 90.0) * 0.8;
    shader.uniforms.uTime.value = time;
    shader.uniforms.uAeroLoad.value = aeroLoad;
    shader.uniforms.uWindVector.value.set(-1, 0, 0);
    shader.uniforms.uDynPressure.value = 0.5 * density * (mach * mach);
  }

  return { armorMat, updateUniforms };
}
