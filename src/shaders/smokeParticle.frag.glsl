uniform sampler2D smokeTex;
varying vec3 vColor;
varying float vAlpha;

void main() {
  vec4 texColor = texture2D(smokeTex, gl_PointCoord);
  gl_FragColor = vec4(vColor * texColor.rgb, texColor.a * vAlpha);
}
