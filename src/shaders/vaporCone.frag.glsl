uniform float uTime;
uniform float uMach;
uniform float uAoa;
uniform mat4 uObjInvMatrix;
uniform vec3 uCameraPos;
varying vec3 vWorldPos;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(in vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(
      mix(hash(i + vec3(0, 0, 0)), hash(i + vec3(1, 0, 0)), f.x),
      mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x),
      f.y
    ),
    mix(
      mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x),
      mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x),
      f.y
    ),
    f.z
  );
}

float fbm(vec3 p) {
  float f = 0.0;
  f += 0.5000 * noise(p); p = p * 2.02;
  f += 0.2500 * noise(p); p = p * 2.03;
  f += 0.1250 * noise(p);
  return f;
}

vec2 hitBox(vec3 orig, vec3 dir, vec3 boxMin, vec3 boxMax) {
  vec3 invDir = 1.0 / dir;
  vec3 t0 = (boxMin - orig) * invDir;
  vec3 t1 = (boxMax - orig) * invDir;
  vec3 tmin = min(t0, t1);
  vec3 tmax = max(t0, t1);
  float maxTmin = max(max(tmin.x, tmin.y), tmin.z);
  float minTmax = min(min(tmax.x, tmax.y), tmax.z);
  return vec2(maxTmin, minTmax);
}

void main() {
  vec3 rayDir = normalize(vWorldPos - uCameraPos);
  vec3 localRayOrig = (uObjInvMatrix * vec4(uCameraPos, 1.0)).xyz;
  vec3 localRayDir = normalize((uObjInvMatrix * vec4(rayDir, 0.0)).xyz);

  vec3 boxMin = vec3(-12.0, -6.0, -6.0);
  vec3 boxMax = vec3(12.0, 6.0, 6.0);
  vec2 tBox = hitBox(localRayOrig, localRayDir, boxMin, boxMax);
  if (tBox.x > tBox.y || tBox.y < 0.0) discard;

  float t = max(tBox.x, 0.0);
  float tEnd = tBox.y;
  int MAX_STEPS = 45;
  float stepSize = (tEnd - t) / float(MAX_STEPS);

  float density = 0.0;
  float machFactor = smoothstep(0.85, 1.0, uMach) * smoothstep(1.15, 1.0, uMach);
  float aoaFactor = clamp((abs(uAoa) - 5.0) / 20.0, 0.0, 1.0);

  if (machFactor < 0.01 && aoaFactor < 0.01) discard;

  for (int i = 0; i < 45; i++) {
    if (t > tEnd) break;
    vec3 p = localRayOrig + localRayDir * t;
    float localDensity = 0.0;

    if (machFactor > 0.0) {
      float coneRadius = (p.x + 2.0) * 0.85;
      float coneDist = length(p.yz) - coneRadius;
      float shell = smoothstep(1.2, 0.0, abs(coneDist));
      float xFade = smoothstep(-2.0, 0.5, p.x) * smoothstep(5.0, 2.5, p.x);
      localDensity += shell * xFade * machFactor * 4.0;

      float disk = smoothstep(0.6, 0.0, abs(length(p.yz) - 2.8)) * smoothstep(0.3, 0.0, abs(p.x - 0.5));
      localDensity += disk * machFactor * 6.0;
    }

    if (aoaFactor > 0.0) {
      float wingDistL = length(p.yz - vec2(0.5, 3.0));
      float wingDistR = length(p.yz - vec2(0.5, -3.0));
      float inVortex = (smoothstep(0.8, 0.0, wingDistL) + smoothstep(0.8, 0.0, wingDistR)) * smoothstep(-1.0, 6.0, p.x);
      localDensity += inVortex * aoaFactor * 3.0;
    }

    if (localDensity > 0.01) {
      float n = fbm(p * 2.0 - vec3(uTime * 20.0, 0.0, 0.0));
      density += localDensity * n * stepSize;
    }
    t += stepSize;
  }

  if (density < 0.01) discard;
  vec3 cloudColor = mix(vec3(0.8, 0.95, 1.0), vec3(1.0, 1.0, 1.0), clamp(density * 1.5, 0.0, 1.0));
  gl_FragColor = vec4(cloudColor, clamp(density * 1.2, 0.0, 1.0));
}
