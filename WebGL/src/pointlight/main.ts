import MatIV from '../utils/minMatrix';
import torus from '../utils/torus';
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
  data: number[]
): WebGLBuffer => {
  const ibo: WebGLBuffer = <WebGLBuffer>gl.createBuffer();

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return ibo;
}



window.onload = ():void => {
  const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('cnv');
  const gl: WebGLRenderingContext = <WebGLRenderingContext>canvas.getContext('webgl');

  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  const vertex: WebGLShader = createShader(gl, shaders.vertex, 'vertex');
  const fragment: WebGLShader = createShader(gl, shaders.fragment, 'fragment');

  const program: WebGLProgram = createProgram(gl, vertex, fragment);


  const attLocations: GLint[] = [];
  attLocations[0] = gl.getAttribLocation(program, 'position');
  attLocations[1] = gl.getAttribLocation(program, 'normal');
  attLocations[2] = gl.getAttribLocation(program, 'color');

  const torusObj: Array<number>[] = torus(64, 64, 1, 2);

  const attStrides: number[] = [3, 3, 4];
  const triangle: number[] = torusObj[0];
  const normals: number[] = torusObj[1];
  const colors: number[] = torusObj[2];
  const indexes: number[] = torusObj[3];

  const positionVBO: WebGLBuffer = createVBO(gl, triangle);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionVBO);
  gl.enableVertexAttribArray(attLocations[0]);
  gl.vertexAttribPointer(attLocations[0], attStrides[0], gl.FLOAT, false, 0, 0);

  const normalVBO: WebGLBuffer = createVBO(gl, normals);
  gl.bindBuffer(gl.ARRAY_BUFFER, normalVBO);
  gl.enableVertexAttribArray(attLocations[1]);
  gl.vertexAttribPointer(attLocations[1], attStrides[1], gl.FLOAT, false, 0, 0);

  const colorVBO: WebGLBuffer = createVBO(gl, colors);
  gl.bindBuffer(gl.ARRAY_BUFFER, colorVBO);
  gl.enableVertexAttribArray(attLocations[2]);
  gl.vertexAttribPointer(attLocations[2], attStrides[2], gl.FLOAT, false, 0, 0);

  const ibo: WebGLBuffer = createIBO(gl, indexes);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);

  const m: any = MatIV;

  const mMatrix: Float32Array = m.identity(m.create());
  const vMatrix: Float32Array = m.identity(m.create());
  const pMatrix: Float32Array = m.identity(m.create());
  const tmpMatrix: Float32Array = m.identity(m.create());
  const mvpMatrix: Float32Array = m.identity(m.create());
  const invMatrix: Float32Array = m.identity(m.create());

  m.lookAt([0.0, 1.0, 3.0], [0, 0, 0], [0, 1, 0], vMatrix);
  m.perspective(90, canvas.width / canvas.height, 0.1, 100, pMatrix);

  m.multiply(pMatrix, vMatrix, tmpMatrix);

  const lightDirection: number[] = [-0.5, 0.5, 0.5];
  const pointLightPosition: number[] = [0.0, 0.0, 0.0];
  const ambientColor: number[] = [0.1, 0.1, 0.1, 1.0];
  const eyeDirection: number[] = [0.0, 0.0, 20.0];

  const uniLocations: WebGLUniformLocation[] = 
    [
      <WebGLUniformLocation>gl.getUniformLocation(program, 'mvpMatrix'),
      <WebGLUniformLocation>gl.getUniformLocation(program, 'invMatrix'),
      <WebGLUniformLocation>gl.getUniformLocation(program, 'lightDirection'),
      <WebGLUniformLocation>gl.getUniformLocation(program, 'ambientColor'),
      <WebGLUniformLocation>gl.getUniformLocation(program, 'eyeDireciton'),
      <WebGLUniformLocation>gl.getUniformLocation(program, 'mMatrix'),
      <WebGLUniformLocation>gl.getUniformLocation(program, 'lightPosition'),
    ];


  let count: number = 0;

  const tick = (): void => {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);

    count += 1;

    const rad: number = (count % 360) * Math.PI / 180;

    m.identity(mMatrix);
    m.translate(mMatrix, [0.0, 0.0, -2.0], mMatrix);
    m.rotate(mMatrix, rad, [1, 1, 0], mMatrix);
    m.multiply(tmpMatrix, mMatrix, mvpMatrix);
    m.inverse(mMatrix, invMatrix);

    gl.uniformMatrix4fv(uniLocations[0], false, mvpMatrix);
    gl.uniformMatrix4fv(uniLocations[1], false, invMatrix);
    gl.uniform3fv(uniLocations[2], lightDirection);
    gl.uniform4fv(uniLocations[3], ambientColor);
    gl.uniform3fv(uniLocations[4], eyeDirection);
    gl.uniformMatrix4fv(uniLocations[5], false, mMatrix);
    gl.uniform3fv(uniLocations[6], pointLightPosition);
    gl.drawElements(gl.TRIANGLES, indexes.length, gl.UNSIGNED_SHORT, 0);

    gl.flush();

    requestAnimationFrame(tick);
  };

  tick();
}