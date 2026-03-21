uniform float time;
uniform float delta;
uniform float windSpeed;
uniform mat4 objMatrix;
uniform mat4 objInvMatrix;
uniform sampler2D textureInitPos;
uniform float tunnelLength;
uniform int uObjectType;
uniform vec3 uCustomSize;

float sdEllipsoid(vec3 p, vec3 r) {
  float k0 = length(p / r);
  float k1 = length(p / (r * r));
  return k0 * (k0 - 1.0) / k1;
}

float sdRoundBox(vec3 p, vec3 b, float r) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}

float map(vec3 p) {
  if (uObjectType == 0) {
    float d1 = sdEllipsoid(p - vec3(-0.2, 0.0, 0.0), vec3(3.6, 0.9, 0.9));
    float d2 = sdEllipsoid(p - vec3(1.0, 0.0, 0.0), vec3(1.8, 0.2, 3.0));
    float d3 = sdEllipsoid(p - vec3(-1.0, 0.4, 0.0), vec3(1.5, 0.6, 0.4));
    return min(d1, min(d2, d3));
  } else {
    return sdRoundBox(p, uCustomSize * 0.9, 0.2);
  }
}

vec3 calcNormal(vec3 p) {
  const vec2 e = vec2(0.02, 0.0);
  return normalize(vec3(
    map(p + e.xyy) - map(p - e.xyy),
    map(p + e.yxy) - map(p - e.yxy),
    map(p + e.yyx) - map(p - e.yyx)
  ));
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec3 pos = texture2D(texturePosition, uv).xyz;
  vec3 initPos = texture2D(textureInitPos, uv).xyz;

  vec3 localPos = (objInvMatrix * vec4(pos, 1.0)).xyz;
  vec3 localVel = vec3(0.0);

  float dist = map(localPos);
  vec3 normal = calcNormal(localPos);

  if (dist > 0.0 && dist < 6.0) {
    float pressure = (windSpeed * 0.5) / (dist * dist + 1.0);
    localVel += normal * pressure;
  }

  if (dist < 0.1) {
    localPos += normal * (0.1 - dist) * 1.1;
    pos = (objMatrix * vec4(localPos, 1.0)).xyz;
  }

  vec3 worldVelPerturb = (objMatrix * vec4(localVel, 0.0)).xyz;
  vec3 vel = vec3(windSpeed, 0.0, 0.0) + worldVelPerturb;

  if (localPos.x > 0.0) {
    float crossSection = (uObjectType == 0) ? 2.5 : max(uCustomSize.y, uCustomSize.z) * 1.5;
    float wakeDist = length(localPos.yz);
    float wakeRadius = crossSection + localPos.x * 0.25;

    if (wakeDist < wakeRadius && wakeRadius > 0.1) {
      float intensity = (1.0 - wakeDist / wakeRadius) * clamp(localPos.x / 10.0, 0.0, 1.0);
      float vortexFreq = 0.2 * windSpeed / max(1.0, crossSection);
      float phase = pos.x * 1.5 - time * vortexFreq * 10.0 + initPos.y * 5.0;
      float angle = atan(localPos.z, localPos.y);

      float vTangential = sin(phase) * windSpeed * 1.2 * intensity;
      vel.y += -sin(angle) * vTangential;
      vel.z += cos(angle) * vTangential;
      vel.x -= windSpeed * 0.4 * intensity;
    }
  }

  float bgPhase = initPos.y * 3.0 + initPos.z * 3.0;
  vel.y += sin(pos.x * 1.5 + time * 3.0 + bgPhase) * windSpeed * 0.02;
  vel.z += cos(pos.x * 1.2 - time * 2.5 + bgPhase) * windSpeed * 0.02;

  pos += vel * delta;
  if (pos.x > tunnelLength / 2.0) {
    pos.x -= tunnelLength;
    pos.y = initPos.y;
    pos.z = initPos.z;
  }

  gl_FragColor = vec4(pos, 1.0);
}
