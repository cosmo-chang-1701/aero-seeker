// Aero surface vertex shader injection chunk
// Replaces #include <begin_vertex> with tail flex + flutter
// and #include <worldpos_vertex> with world normal computation

// --- Vertex declarations (prepended to vertexShader) ---
// uniform float uTime;
// uniform float uAeroLoad;
// varying vec3 vWorldNormal;

// --- begin_vertex replacement ---
// #include <begin_vertex>
// float distZ = max(0.0, abs(position.z) - 0.5);
// float flex = distZ * distZ * uAeroLoad * 0.15;
// float flutter = sin(uTime * 45.0 + position.x * 5.0) * distZ * abs(uAeroLoad) * 0.02;
// transformed.y += flex + flutter;

// --- worldpos_vertex replacement ---
// #include <worldpos_vertex>
// vWorldNormal = normalize((modelMatrix * vec4(objectNormal, 0.0)).xyz);

// Note: This shader is injected via onBeforeCompile in useAeroMaterial.ts
// It is stored here as documentation / reference.
// The actual injection happens programmatically.
