export default {
  vertex: `
attribute vec3 position;
attribute vec3 normal;
attribute vec4 color;
uniform mat4 mvpMatrix;
uniform mat4 mMatrix;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec4 vColor;

void main(void)
{
  vPosition = (mMatrix * vec4(position, 1.0)).xyz;
  vNormal = normal;
  vColor = color;
  gl_Position = mvpMatrix * vec4(position, 1.0);
}
`,
  fragment: `
precision mediump float;

uniform mat4 invMatrix;
uniform vec3 lightPosition;
uniform vec3 lightDirection;
uniform vec3 eyeDirection;
uniform vec4 ambientColor;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec4 vColor;

void main(void)
{
  vec3 lightVec = lightPosition - vPosition;
  vec3 invLight = normalize(invMatrix * vec4(lightVec, 1.0)).xyz;
  vec3 invEye = normalize(invMatrix * vec4(eyeDirection, 1.0)).xyz;
  vec3 halfLE = normalize(invLight + invEye);
  float diffuse = clamp(dot(vNormal, invLight), 0.0, 1.0);
  float specular = pow(clamp(dot(vNormal, halfLE), 0.0, 1.0), 50.0);
  vec4 destColor = vColor * vec4(vec3(diffuse), 1.0) + vec4(vec3(specular), 1.0) + ambientColor;
  gl_FragColor = destColor;
}
`,
};
