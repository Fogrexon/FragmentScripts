/* eslint-disable no-mixed-operators */
import { vertexShader as vertexShaderSource, fragmentShader as fragmentShaderSource } from './shader';
import MatIV from '../utils/minMatrix';
import {
  createShader, createProgram, createVBO, createIBO, setAttribute,
} from '../utils/createObjects';
import fogrexSource from '../textureMapping/fogrex_icon.jpg';

const rendering = () => {
  const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('cnv');

  const gl: WebGLRenderingContext = <WebGLRenderingContext>canvas.getContext('webgl');

  const vShader: WebGLShader = createShader(gl, vertexShaderSource, 'vertex');
  const fShader: WebGLShader = createShader(gl, fragmentShaderSource, 'fragment');

  const program: WebGLProgram = createProgram(gl, vShader, fShader);

  const attLocation: number[] = [
    gl.getAttribLocation(program, 'position'),
    gl.getAttribLocation(program, 'color'),
    gl.getAttribLocation(program, 'textureCoord'),
  ];

  const attStride = [
    3, 4, 2,
  ];

  const position = [
    -1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
    -1.0, -1.0, 0.0,
    1.0, -1.0, 0.0,
  ];

  const color = [
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
  ];

  const textureCoord = [
    0.0, 0.0,
    1.0, 0.0,
    0.0, 1.0,
    1.0, 1.0,
  ];

  const index = [
    0, 1, 2,
    3, 2, 1,
  ];

  const vPosition: WebGLBuffer = createVBO(gl, position);
  const vColor: WebGLBuffer = createVBO(gl, color);
  const vTextureCoord: WebGLBuffer = createVBO(gl, textureCoord);
  const VBOList: WebGLBuffer[] = [vPosition, vColor, vTextureCoord];
  const iIndex: WebGLBuffer = createIBO(gl, index);

  setAttribute(gl, VBOList, attLocation, attStride);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iIndex);

  const uniLocation: WebGLUniformLocation[] = [
    <WebGLUniformLocation>gl.getUniformLocation(program, 'mvpMatrix'),
    <WebGLUniformLocation>gl.getUniformLocation(program, 'texture'),
  ];

  const m: any = MatIV;

  const mMatrix: Float32Array = m.identity(m.create());
  const vMatrix: Float32Array = m.identity(m.create());
  const pMatrix: Float32Array = m.identity(m.create());
  const tmpMatrix: Float32Array = m.identity(m.create());
  const mvpMatrix: Float32Array = m.identity(m.create());

  m.lookAt([0.0, 2.0, 5.0], [0, 0, 0], [0, 1, 0], vMatrix);
  m.perspective(45, canvas.width / canvas.height, 0.1, 100, pMatrix);
  m.multiply(pMatrix, vMatrix, tmpMatrix);

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  gl.activeTexture(gl.TEXTURE0);

  let texture: WebGLTexture | null = null;

  const createTexture = (
    source: string,
  ): void => {
    const image: HTMLImageElement = new Image();

    image.onload = () => {
      const tex = gl.createTexture();

      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.bindTexture(gl.TEXTURE_2D, null);
      texture = tex;
    };

    image.src = source;
  };

  createTexture(fogrexSource);

  let count = 0;

  function tick() {
    // canvasを初期化
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT || gl.DEPTH_BUFFER_BIT);

    count += 1;
    const rad = (count % 360) * Math.PI / 180;

    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.uniform1i(uniLocation[1], 0);

    m.identity(mMatrix);
    m.rotate(mMatrix, rad, [0, 1, 0], mMatrix);
    m.multiply(tmpMatrix, mMatrix, mvpMatrix);

    gl.uniformMatrix4fv(uniLocation[0], false, mvpMatrix);
    gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);

    m.identity(mMatrix);
    m.rotate(mMatrix, rad * 1.5, [0, 1, 0], mMatrix);
    m.multiply(tmpMatrix, mMatrix, mvpMatrix);

    gl.uniformMatrix4fv(uniLocation[0], false, mvpMatrix);

    gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_SHORT, 0);

    gl.flush();
    setTimeout(tick, 1000 / 30);
  }

  tick();
};

export default rendering;
