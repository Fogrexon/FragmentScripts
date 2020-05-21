const vertexShader = `
attribute vec3 position;
attribute vec4 color;
attribute vec2 textureCoord;

uniform mat4 mvpMatrix;

varying vec4 vColor;
varying vec2 vTextureCoord;

void main(void) {
  vColor = color;
  vTextureCoord = textureCoord;
  gl_Position = mvpMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision mediump float;

uniform sampler2D texture;
varying vec4 vColor;
varying vec2 vTextureCoord;

void main(void) {
  vec4 smpColor = texture2D(texture, vTextureCoord);
  gl_FragColor = vColor * smpColor;
}
`;