/* =====================================================================
 *  KUAS DASAR
 *  Potongan gambar yang dipakai berulang oleh semua scene:
 *  gradasi langit, cahaya, punggung gunung, siluet kota, siluet orang.
 * ===================================================================== */

export type Painter = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number
) => void;

export function vgrad(
  ctx: CanvasRenderingContext2D,
  h: number,
  stops: [number, string][]
) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  stops.forEach(([o, c]) => g.addColorStop(o, c));
  return g;
}

export function glow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  rgb: string,
  a: number
) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(${rgb},${a})`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

export function ridge(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  baseY: number,
  amp: number,
  freq: number,
  phase: number,
  color: string
) {
  ctx.beginPath();
  ctx.moveTo(0, h);
  const f = (freq * 180) / w; // jumlah punggung gunung sama di card kecil maupun layar penuh
  for (let x = 0; x <= w; x += 4) {
    const y =
      baseY +
      Math.sin(x * f + phase) * amp +
      Math.sin(x * f * 2.3 + phase * 1.7) * amp * 0.4;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

export type Building = {
  x: number;
  bw: number;
  bh: number;
  wins: { u: number; v: number; ph: number; lit: boolean }[];
};

export function genCity(rand: () => number): Building[] {
  const out: Building[] = [];
  let x = -0.03;
  while (x < 1) {
    const bw = 0.07 + rand() * 0.09;
    const bh = 0.1 + rand() * 0.22;
    const wins = Array.from({ length: 10 }, () => ({
      u: rand(),
      v: rand(),
      ph: rand() * 6.28,
      lit: rand() > 0.4,
    }));
    out.push({ x, bw, bh, wins });
    x += bw * (0.9 + rand() * 0.2);
  }
  return out;
}

export function skyline(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  baseY: number,
  city: Building[],
  color: string,
  winColor: string,
  t: number
) {
  const s = Math.min(w, h) / 220;
  for (const b of city) {
    const bx = b.x * w;
    const bwid = b.bw * w;
    const bhgt = b.bh * h;
    ctx.fillStyle = color;
    ctx.fillRect(bx, baseY - bhgt, bwid + 1, bhgt + (h - baseY));
    for (const win of b.wins) {
      if (!win.lit) continue;
      ctx.globalAlpha = 0.55 + 0.45 * Math.sin(t * 0.9 + win.ph);
      ctx.fillStyle = winColor;
      ctx.fillRect(
        bx + 3 * s + win.u * Math.max(bwid - 8 * s, 1),
        baseY - bhgt + 4 * s + win.v * Math.max(bhgt - 10 * s, 1),
        2 * s,
        2.4 * s
      );
    }
    ctx.globalAlpha = 1;
  }
}

/** Siluet orang berambut panjang (opsional payung) */
export function figure(
  ctx: CanvasRenderingContext2D,
  x: number,
  groundY: number,
  hgt: number,
  color: string,
  t: number,
  umbrellaColor?: string
) {
  const r = hgt * 0.1; // jari-jari kepala
  const headY = groundY - hgt + r * 1.2;
  const shoulderY = headY + r * 1.9;
  const sway = Math.sin(t * 1.6) * hgt * 0.018;

  ctx.fillStyle = color;

  // ekor rambut yang melambai di belakang
  ctx.beginPath();
  ctx.moveTo(x - r * 0.7, headY);
  ctx.quadraticCurveTo(
    x - r * 2.1 - sway * 2,
    headY + r * 1.6,
    x - r * 1.2 - sway * 3,
    headY + r * 4.2
  );
  ctx.quadraticCurveTo(x - r * 0.9, headY + r * 2.2, x - r * 0.2, headY + r * 1);
  ctx.closePath();
  ctx.fill();

  // kepala + rambut atas
  ctx.beginPath();
  ctx.arc(x, headY, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x, headY - r * 0.12, r * 1.12, Math.PI * 1.05, Math.PI * 1.95);
  ctx.closePath();
  ctx.fill();

  // leher
  ctx.fillRect(x - r * 0.26, headY + r * 0.7, r * 0.52, r * 1.3);

  // badan: bahu -> pinggang -> rok/mantel melebar
  ctx.beginPath();
  ctx.moveTo(x - r * 0.9, shoulderY);
  ctx.quadraticCurveTo(x - r * 0.62, shoulderY + hgt * 0.16, x - r * 0.58, shoulderY + hgt * 0.26);
  ctx.lineTo(x - r * 1.45 + sway, groundY);
  ctx.lineTo(x + r * 1.45 + sway, groundY);
  ctx.lineTo(x + r * 0.58, shoulderY + hgt * 0.26);
  ctx.quadraticCurveTo(x + r * 0.62, shoulderY + hgt * 0.16, x + r * 0.9, shoulderY);
  ctx.closePath();
  ctx.fill();

  if (umbrellaColor) {
    const ux = x + r * 0.6;
    const uy = headY - r * 1.5;
    ctx.fillStyle = umbrellaColor;
    ctx.beginPath();
    ctx.arc(ux, uy, r * 3.2, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(1, r * 0.2);
    ctx.beginPath();
    ctx.moveTo(ux, uy);
    ctx.lineTo(ux, shoulderY + r);
    ctx.stroke();
  }
}

/* ---------------------------------------------------------------------
 *  Tambahan untuk variasi komposisi
 * ------------------------------------------------------------------- */

/** Ambil satu isi acak dari daftar */
export function pick<T>(rand: () => number, arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

/** Angka acak dalam rentang */
export function range(rand: () => number, a: number, b: number) {
  return a + rand() * (b - a);
}

/** Siluet pohon cemara */
export function pine(
  ctx: CanvasRenderingContext2D,
  x: number,
  groundY: number,
  hgt: number,
  color: string
) {
  const wdt = hgt * 0.42;
  ctx.fillStyle = color;
  ctx.fillRect(x - hgt * 0.025, groundY - hgt * 0.16, hgt * 0.05, hgt * 0.16);
  for (let i = 0; i < 3; i++) {
    const top = groundY - hgt + (hgt * 0.26 * i);
    const bot = top + hgt * 0.42;
    const half = (wdt / 2) * (0.55 + i * 0.28);
    ctx.beginPath();
    ctx.moveTo(x, top);
    ctx.lineTo(x + half, bot);
    ctx.lineTo(x - half, bot);
    ctx.closePath();
    ctx.fill();
  }
}

/** Awan gumpal sederhana */
export function puff(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  color: string
) {
  ctx.fillStyle = color;
  for (const [dx, dy, s] of [
    [-1.1, 0.15, 0.72],
    [0, -0.25, 1],
    [1.05, 0.1, 0.8],
    [0.4, 0.3, 0.6],
  ]) {
    ctx.beginPath();
    ctx.arc(x + dx * r, y + dy * r, r * s, 0, Math.PI * 2);
    ctx.fill();
  }
}
