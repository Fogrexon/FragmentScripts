export default {
  vertex: `
attribute vec3 position;
uniform mat4 mvpMatrix;

void main(void)
{
  gl_Position = mvpMatrix * vec4(position, 1.0);
}
`,
  fragment: `
void main(void)
{
  gl_FragColor = vec4(1.0);
}
`
}
