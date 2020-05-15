const hsva = (h: number, s: number, v: number, a: number):number[] => {
  if(s > 1 || v > 1 || a > 1){throw new Error("value error.");}
  const th: number = h % 360;
  const i: number = Math.floor(th / 60);
  const f: number = th / 60 - i;
  const m: number = v * (1 - s);
  const n: number = v * (1 - s * f);
  const k: number = v * (1 - s * (1 - f));
  const color: Array<number> = new Array();
  if(s === 0){
      color.push(v, v, v, a); 
  } else {
      var r = new Array(v, n, m, m, k, v);
      var g = new Array(k, v, v, n, m, m);
      var b = new Array(m, m, k, v, v, n);
      color.push(r[i], g[i], b[i], a);
  }
  return color;
}


export default (row: number, column: number, irad: number, orad: number): Array<number>[] => {
  const pos: Array<number> = new Array<number>(),
    nor: Array<number> = new Array<number>(),
    col: Array<number> = new Array<number>(),
    idx: Array<number> = new Array<number>();
  for(let i = 0; i <= row; i++){
      const r = Math.PI * 2 / row * i;
      const rr = Math.cos(r);
      const ry = Math.sin(r);
      for(let ii = 0; ii <= column; ii++){
          const tr = Math.PI * 2 / column * ii;
          const tx = (rr * irad + orad) * Math.cos(tr);
          const ty = ry * irad;
          const tz = (rr * irad + orad) * Math.sin(tr);
          const rx = rr * Math.cos(tr);
          const rz = rr * Math.sin(tr);
          pos.push(tx, ty, tz);
          nor.push(rx, ry, rz);
          var tc = hsva(360 / column * ii, 1, 1, 1);
          col.push(tc[0], tc[1], tc[2], tc[3]);
      }
  }
  for(let i = 0; i < row; i++){
      for(let ii = 0; ii < column; ii++){
          const r = (column + 1) * i + ii;
          idx.push(r, r + column + 1, r + 1);
          idx.push(r + column + 1, r + column + 2, r + 1);
      }
  }
  return [pos, nor, col, idx];
}