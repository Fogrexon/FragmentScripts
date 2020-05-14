import MatIV from './utils/minMatrix';
import shaders from './shader';

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
  throw new Error(`Cannot compile ${type} shader.`);
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

window.onload = ():void => {
  const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('cnv');
  console.log(canvas);
  const gl: WebGLRenderingContext = <WebGLRenderingContext>canvas.getContext('webgl');

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);

  const vertex: WebGLShader = createShader(gl, shaders.vertex, 'vertex');
  const fragment: WebGLShader = createShader(gl, shaders.fragment, 'fragment');

  const program: WebGLProgram = createProgram(gl, vertex, fragment);


  const attLocations: GLint[] = [];
  attLocations[0] = gl.getAttribLocation(program, 'position');
  attLocations[1] = gl.getAttribLocation(program, 'color');

  const attStrides: number[] = [3, 4];
  const triangle: number[] = [
    0.0, 1.0, 0.0,
    1.0, 0.0, 0.0,
    -1.0, 0.0, 0.0,
  ];
  const colors: number[] = [
    1.0, 0.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
  ];

  const positionVBO: WebGLBuffer = createVBO(gl, triangle);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionVBO);
  gl.enableVertexAttribArray(attLocations[0]);
  gl.vertexAttribPointer(attLocations[0], attStrides[0], gl.FLOAT, false, 0, 0);

  const colorVBO: WebGLBuffer = createVBO(gl, colors);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorVBO);
  gl.enableVertexAttribArray(attLocations[1]);
  gl.vertexAttribPointer(attLocations[1], attStrides[1], gl.FLOAT, false, 0, 0);

  const m: any = MatIV;

  const mMatrix: any = m.identity(m.create());
  const vMatrix: any = m.identity(m.create());
  const pMatrix: any = m.identity(m.create());
  const mvpMatrix: any = m.identity(m.create());

  m.lookAt([0.0, 1.0, 3.0], [0, 0, 0], [0, 1, 0], vMatrix);
  m.perspective(90, canvas.width / canvas.height, 0.1, 100, pMatrix);

  m.multiply(pMatrix, vMatrix, mvpMatrix);
  m.multiply(mvpMatrix, mMatrix, mvpMatrix);

  const uniLocation: WebGLUniformLocation = <WebGLUniformLocation>gl.getUniformLocation(program, 'mvpMatrix');
  gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);

  gl.drawArrays(gl.TRIANGLES, 0, 3);

  gl.flush();
};
