const createShader = (
  gl: WebGLRenderingContext,
  shaderString: string,
  type: string,
): WebGLShader => {
  let shader: WebGLShader;
  switch (type) {
    case 'vertex':
      shader = <WebGLShader>gl.createShader(gl.VERTEX_SHADER);
      break;
    case 'fragment':
      shader = <WebGLShader>gl.createShader(gl.FRAGMENT_SHADER);
      break;
    default:
      throw new Error('"type" is invalid.');
  }

  gl.shaderSource(shader, shaderString);
  gl.compileShader(shader);

  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    return shader;
  }
  throw new Error(<string>gl.getShaderInfoLog(shader));
};

const createProgram = (
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
): WebGLProgram => {
  const program: WebGLProgram = <WebGLProgram>gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);

  if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.useProgram(program);
    return program;
  }
  throw new Error('Cannot link shaders');
};

const createVBO = (
  gl: WebGLRenderingContext,
  data: number[],
): WebGLBuffer => {
  const vbo: WebGLBuffer = <WebGLBuffer>gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return vbo;
};

const createIBO = (
  gl: WebGLRenderingContext,
  data: number[],
): WebGLBuffer => {
  const ibo: WebGLBuffer = <WebGLBuffer>gl.createBuffer();

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return ibo;
};
const setAttribute = (
  gl: WebGLRenderingContext,
  vbo: WebGLBuffer[],
  attL: number[],
  attS: number[],
): void => {
  for (let i:number = 0; i < vbo.length; i += 1) {
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]);
    gl.enableVertexAttribArray(attL[i]);
    gl.vertexAttribPointer(attL[i], attS[i], gl.FLOAT, false, 0, 0);
  }
};
export {
  createShader, createProgram, createVBO, createIBO, setAttribute,
};
