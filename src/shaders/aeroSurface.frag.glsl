// Aero surface fragment shader injection chunk
// Replaces #include <emissivemap_fragment> with pressure heatmap coloring

// --- Fragment declarations (prepended to fragmentShader) ---
// uniform vec3 uWindVector;
// uniform float uDynPressure;
// varying vec3 vWorldNormal;

// --- emissivemap_fragment replacement ---
// #include <emissivemap_fragment>
// float facingWind = max(0.0, dot(normalize(vWorldNormal), normalize(uWindVector)));
// float localPressure = facingWind * uDynPressure;
// float pNorm = clamp(localPressure * 1.5, 0.0, 1.0);
//
// vec3 hmColor = mix(vec3(0.0), vec3(0.0, 0.3, 0.8), clamp(pNorm * 3.0, 0.0, 1.0));
// hmColor = mix(hmColor, vec3(0.0, 0.8, 1.0), clamp((pNorm - 0.33) * 3.0, 0.0, 1.0));
// hmColor = mix(hmColor, vec3(1.0, 0.1, 0.0), clamp((pNorm - 0.66) * 3.0, 0.0, 1.0));
//
// totalEmissiveRadiance += hmColor * pNorm * 2.5;

// Note: This shader is injected via onBeforeCompile in useAeroMaterial.ts
// It is stored here as documentation / reference.
