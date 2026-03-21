uniform sampler2D texturePosition;
uniform float smokeSize;
uniform float density;
uniform float time;
uniform int smokeMode;
uniform float tunnelLength;

varying vec3 vColor;
varying float vAlpha;

void main() {
  vec2 uv = position.xy;
  float lineId = floor(uv.y * 1024.0);
  float randomVal = fract(sin(lineId * 12.9898) * 43758.5453);
  if (randomVal > density * 2.0) {
    gl_Position = vec4(9999.0);
    return;
  }

  vec3 pos = texture2D(texturePosition, uv).xyz;
  float origY = -4.0 + mod(lineId, 32.0) * (8.0 / 31.0);
  float origZ = -4.0 + floor(lineId / 32.0) * (8.0 / 31.0);
  float deformation = length(pos.yz - vec2(origY, origZ));

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = max(1.0, smokeSize * 22.0 / -mvPosition.z);

  float deformHeat = clamp(deformation * 1.2, 0.0, 1.0);
  if (smokeMode == 1) {
    float pulse = sin(pos.x * 2.0 - time * 12.0) * 0.5 + 0.5;
    vColor = mix(vec3(0.0, 0.8, 1.0), vec3(1.0, 0.0, 0.6), clamp(deformHeat + pulse * 0.2, 0.0, 1.0));
  } else {
    vColor = mix(vec3(0.7, 0.85, 1.0), vec3(1.0, 1.0, 1.0), deformHeat);
  }

  float fadeIn = smoothstep(-tunnelLength / 2.0, -tunnelLength / 2.0 + 8.0, pos.x);
  float fadeOut = smoothstep(tunnelLength / 2.0, tunnelLength / 2.0 - 4.0, pos.x);
  vAlpha = fadeIn * fadeOut * (0.85 + 0.15 * sin(pos.x * 0.5 - time * 5.0)) * clamp(1.0 - deformHeat * 0.2, 0.3, 1.0);
}
