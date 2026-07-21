/**
 * Deterministic interlocking jigsaw path generator.
 *
 * Every interior edge gets a mushroom-shaped knob drawn as a single major
 * elliptical arc (chord 20% of the edge, radius ~12-14%), jittered by a
 * seeded PRNG so the layout is organic but identical on server and client.
 * Adjacent pieces traverse the exact same edge geometry in opposite
 * directions (sweep flag flipped), so pieces interlock perfectly.
 */

export type JigsawOptions = {
  cols: number;
  rows: number;
  width?: number;
  height?: number;
  seed?: number;
};

type EdgeParams = { m: number; r: number; sweep: 0 | 1 };

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function jigsawPieces({
  cols,
  rows,
  width = 1,
  height = 1,
  seed = 7,
}: JigsawOptions): string[] {
  const rnd = mulberry32(seed);
  const cw = width / cols;
  const ch = height / rows;

  const edge = (): EdgeParams => ({
    m: 0.5 + (rnd() - 0.5) * 0.14,
    r: 0.115 + rnd() * 0.025,
    sweep: rnd() < 0.5 ? 0 : 1,
  });

  // hE[r][c]: edge between piece rows r-1 and r  |  vE[c][r]: edge between piece cols c-1 and c
  const hE: EdgeParams[][] = [];
  const vE: EdgeParams[][] = [];
  for (let r = 1; r < rows; r++) {
    hE[r] = [];
    for (let c = 0; c < cols; c++) hE[r][c] = edge();
  }
  for (let c = 1; c < cols; c++) {
    vE[c] = [];
    for (let r = 0; r < rows; r++) vE[c][r] = edge();
  }

  const f = (n: number) => +n.toFixed(4);

  // Horizontal edge along y, spanning xa..xb. rev traverses right-to-left.
  const hSeg = (e: EdgeParams, xa: number, xb: number, y: number, rev: boolean) => {
    const span = xb - xa;
    const half = 0.1 * span;
    const k = f(e.r * span);
    const xm = xa + e.m * span;
    return rev
      ? `L ${f(xm + half)} ${f(y)} A ${k} ${k} 0 1 ${1 - e.sweep} ${f(xm - half)} ${f(y)} L ${f(xa)} ${f(y)} `
      : `L ${f(xm - half)} ${f(y)} A ${k} ${k} 0 1 ${e.sweep} ${f(xm + half)} ${f(y)} L ${f(xb)} ${f(y)} `;
  };

  // Vertical edge along x, spanning ya..yb. rev traverses bottom-to-top.
  const vSeg = (e: EdgeParams, ya: number, yb: number, x: number, rev: boolean) => {
    const span = yb - ya;
    const half = 0.1 * span;
    const k = f(e.r * span);
    const ym = ya + e.m * span;
    return rev
      ? `L ${f(x)} ${f(ym + half)} A ${k} ${k} 0 1 ${1 - e.sweep} ${f(x)} ${f(ym - half)} L ${f(x)} ${f(ya)} `
      : `L ${f(x)} ${f(ym - half)} A ${k} ${k} 0 1 ${e.sweep} ${f(x)} ${f(ym + half)} L ${f(x)} ${f(yb)} `;
  };

  const pieces: string[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x0 = c * cw;
      const x1 = (c + 1) * cw;
      const y0 = r * ch;
      const y1 = (r + 1) * ch;
      let d = `M ${f(x0)} ${f(y0)} `;
      d += r === 0 ? `L ${f(x1)} ${f(y0)} ` : hSeg(hE[r][c], x0, x1, y0, false);
      d += c === cols - 1 ? `L ${f(x1)} ${f(y1)} ` : vSeg(vE[c + 1][r], y0, y1, x1, false);
      d += r === rows - 1 ? `L ${f(x0)} ${f(y1)} ` : hSeg(hE[r + 1][c], x0, x1, y1, true);
      d += c === 0 ? "" : vSeg(vE[c][r], y0, y1, x0, true);
      pieces.push(d + "Z");
    }
  }
  return pieces;
}
