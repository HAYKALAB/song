/* =====================================================================
 *  LUKISAN CANVAS BERGAYA ANIME — 8 scene
 *
 *  Yang bikin tiap baris kelihatan beda bukan cuma scene-nya, tapi juga
 *  KOMPOSISINYA. Dari seed baris, yang diacak: palet warna, posisi
 *  matahari/bulan, jumlah dan tinggi bukit, ada/tidaknya siluet orang,
 *  isi latar (kota atau gunung), sampai arah cermin gambar.
 *
 *  Gerak hanya saat card-nya aktif, lalu membeku di frame terakhir.
 * ===================================================================== */

import type { SceneName } from "../types";
import { mulberry32 } from "./rng";
import {
  figure,
  genCity,
  glow,
  pick,
  pine,
  puff,
  range,
  ridge,
  skyline,
  vgrad,
  type Painter,
} from "./primitives";

type Rand = () => number;
type Sky = [number, string][];

/* ===================== TWILIGHT — senja di atas bukit ===================== */

const TWILIGHT: { sky: Sky; hills: string[]; sun: string; halo: string }[] = [
  {
    sky: [[0, "#171749"], [0.42, "#6b3b93"], [0.72, "#ff7b8a"], [1, "#ffc98f"]],
    hills: ["#4a2c73", "#2a1748", "#150c28"],
    sun: "#fff2cf",
    halo: "255,170,120",
  },
  {
    sky: [[0, "#0e1d3f"], [0.45, "#3f5a97"], [0.76, "#f0896b"], [1, "#ffd9a0"]],
    hills: ["#2f3f6b", "#1d2747", "#121a2e"],
    sun: "#ffe9c0",
    halo: "255,190,140",
  },
  {
    sky: [[0, "#2a1236"], [0.4, "#7d2f63"], [0.72, "#ff6f61"], [1, "#ffd27f"]],
    hills: ["#5a2550", "#381534", "#1e0c1e"],
    sun: "#fff6d8",
    halo: "255,140,110",
  },
];

function twilight(rand: Rand, m: number): Painter {
  const p = pick(rand, TWILIGHT);
  const sunX = range(rand, 0.18, 0.82);
  const sunY = range(rand, 0.54, 0.72);
  const sunR = range(rand, 0.06, 0.1);
  const hills = 2 + Math.floor(rand() * 2);
  const bands = Array.from({ length: hills }, (_, i) => ({
    y: range(rand, 0.7, 0.78) + i * 0.09,
    amp: range(rand, 0.018, 0.045),
    freq: range(rand, 0.025, 0.06),
    phase: rand() * 6.28,
  }));
  const hasFigure = rand() < 0.7;
  const figX = range(rand, 0.18, 0.82);
  const stars = Array.from({ length: 22 * m }, () => ({
    x: rand(),
    y: rand() * 0.42,
    r: 0.5 + rand() * 0.9,
    ph: rand() * 6.28,
  }));
  const clouds = Array.from({ length: 2 + Math.floor(rand() * 4) }, () => ({
    y: range(rand, 0.25, 0.6),
    x: rand(),
    sp: 0.006 + rand() * 0.012,
    sc: 0.5 + rand() * 0.7,
  }));

  return (ctx, w, h, t) => {
    const k = Math.max(1, Math.min(w, h) / 180);
    ctx.fillStyle = vgrad(ctx, h, p.sky);
    ctx.fillRect(0, 0, w, h);
    for (const s of stars) {
      ctx.fillStyle = `rgba(255,255,255,${0.3 + 0.35 * Math.sin(t * 2 + s.ph)})`;
      ctx.beginPath();
      ctx.arc(s.x * w, s.y * h, s.r * Math.sqrt(k), 0, Math.PI * 2);
      ctx.fill();
    }
    glow(ctx, w * sunX, h * sunY, w * 0.55, p.halo, 0.55);
    ctx.fillStyle = p.sun;
    ctx.beginPath();
    ctx.arc(w * sunX, h * sunY, w * sunR, 0, Math.PI * 2);
    ctx.fill();
    for (const c of clouds) {
      const cx = (((c.x + t * c.sp) % 1.3) - 0.15) * w;
      ctx.fillStyle = "rgba(255,180,200,0.3)";
      ctx.beginPath();
      ctx.ellipse(cx, c.y * h, w * 0.26 * c.sc, h * 0.026 * c.sc, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    bands.forEach((b, i) =>
      ridge(ctx, w, h, h * b.y, h * b.amp, b.freq, b.phase, p.hills[Math.min(i, 2)])
    );
    if (hasFigure) {
      figure(ctx, w * figX, h * (bands[0].y + 0.12), h * 0.22, p.hills[2], t);
    }
  };
}

/* ===================== NIGHT — malam berbintang ===================== */

const NIGHT: { sky: Sky; ground: string; win: string; moon: string }[] = [
  {
    sky: [[0, "#04061a"], [0.55, "#121a52"], [1, "#33459e"]],
    ground: "#0b1030",
    win: "#ffd98a",
    moon: "#f6f3df",
  },
  {
    sky: [[0, "#060316"], [0.5, "#241a4e"], [1, "#6b3f7d"]],
    ground: "#130a26",
    win: "#ffc2e0",
    moon: "#fffaf0",
  },
  {
    sky: [[0, "#02100f"], [0.55, "#0b3040"], [1, "#1f6b6e"]],
    ground: "#03181c",
    win: "#a9ffe6",
    moon: "#e8fff7",
  },
];

function night(rand: Rand, m: number): Painter {
  const p = pick(rand, NIGHT);
  const moonX = range(rand, 0.15, 0.85);
  const moonY = range(rand, 0.16, 0.34);
  const moonR = range(rand, 0.07, 0.14);
  const crescent = rand() < 0.45;
  const city = rand() < 0.55;
  const cityData = genCity(rand);
  const hillY = range(rand, 0.72, 0.84);
  const hasFigure = rand() < 0.55;
  const figX = range(rand, 0.2, 0.8);
  const stars = Array.from({ length: 55 * m }, () => ({
    x: rand(),
    y: rand() * 0.66,
    r: 0.4 + rand() * 0.9,
    ph: rand() * 6.28,
  }));

  return (ctx, w, h, t) => {
    const k = Math.max(1, Math.min(w, h) / 180);
    ctx.fillStyle = vgrad(ctx, h, p.sky);
    ctx.fillRect(0, 0, w, h);
    for (const s of stars) {
      ctx.fillStyle = `rgba(255,255,255,${0.35 + 0.6 * Math.abs(Math.sin(t * 1.6 + s.ph))})`;
      ctx.beginPath();
      ctx.arc(s.x * w, s.y * h, s.r * Math.sqrt(k), 0, Math.PI * 2);
      ctx.fill();
    }
    glow(ctx, w * moonX, h * moonY, w * 0.5, "200,215,255", 0.35);
    ctx.fillStyle = p.moon;
    ctx.beginPath();
    ctx.arc(w * moonX, h * moonY, w * moonR, 0, Math.PI * 2);
    ctx.fill();
    if (crescent) {
      // potong sedikit supaya jadi bulan sabit
      ctx.fillStyle = `rgba(0,0,0,0)`;
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(w * (moonX - moonR * 0.5), h * moonY - w * moonR * 0.2, w * moonR * 0.92, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else {
      ctx.fillStyle = "rgba(200,195,170,0.45)";
      for (const [dx, dy, dr] of [
        [-0.03, -0.02, 0.022],
        [0.03, 0.03, 0.016],
      ]) {
        ctx.beginPath();
        ctx.arc(w * (moonX + dx), h * moonY + w * dy, w * dr, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // bintang jatuh
    const q = (t % 7) / 7;
    if (q < 0.1) {
      const u = q / 0.1;
      const x = w * (0.85 - u * 0.55);
      const y = h * (0.05 + u * 0.28);
      const g = ctx.createLinearGradient(x, y, x + w * 0.14, y - h * 0.06);
      g.addColorStop(0, "rgba(255,255,255,0.9)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + w * 0.14, y - h * 0.06);
      ctx.stroke();
    }
    if (city) {
      skyline(ctx, w, h, h * 0.86, cityData, p.ground, p.win, t);
    } else {
      ridge(ctx, w, h, h * hillY, h * 0.05, 0.03, 1.1, p.ground);
      ridge(ctx, w, h, h * (hillY + 0.11), h * 0.03, 0.05, 2.7, p.sky[0][1]);
    }
    if (hasFigure) figure(ctx, w * figX, h * 0.9, h * 0.22, p.sky[0][1], t);
  };
}

/* ===================== SAKURA — siang merah muda ===================== */

const SAKURA: { sky: Sky; hills: string[]; branch: string; petal: string }[] = [
  {
    sky: [[0, "#8fb7ff"], [0.5, "#ffcfe6"], [1, "#ffe6d4"]],
    hills: ["#c4b2ee", "#8f6cc0", "#5e3f88"],
    branch: "#4a2a44",
    petal: "255,190,215",
  },
  {
    sky: [[0, "#ffd9a8"], [0.5, "#ffc1c8"], [1, "#fff0e0"]],
    hills: ["#e3a9b8", "#b87290", "#7d4463"],
    branch: "#5b3030",
    petal: "255,225,235",
  },
  {
    sky: [[0, "#a8e3e0"], [0.52, "#ffd6ea"], [1, "#fff3d9"]],
    hills: ["#9fd0c4", "#6ea495", "#3f6b62"],
    branch: "#40312a",
    petal: "255,205,225",
  },
];

function sakura(rand: Rand, m: number): Painter {
  const p = pick(rand, SAKURA);
  const sunX = range(rand, 0.15, 0.5);
  const sunY = range(rand, 0.18, 0.4);
  const hillY = range(rand, 0.64, 0.76);
  const hasFigure = rand() < 0.75;
  const figX = range(rand, 0.25, 0.8);
  const bend = range(rand, 0.2, 0.42);
  const petals = Array.from({ length: 20 * m }, () => ({
    x: rand(),
    y: rand(),
    s: 0.6 + rand() * 0.9,
    sp: 0.03 + rand() * 0.05,
    ph: rand() * 6.28,
    sw: 0.02 + rand() * 0.04,
  }));
  const blossoms = Array.from({ length: 18 + Math.floor(rand() * 16) }, () => ({
    u: 0.12 + rand() * 0.88,
    ox: (rand() - 0.5) * 0.08,
    oy: (rand() - 0.5) * 0.05,
    r: 0.016 + rand() * 0.02,
  }));

  return (ctx, w, h, t) => {
    const k = Math.max(1, Math.min(w, h) / 180);
    ctx.fillStyle = vgrad(ctx, h, p.sky);
    ctx.fillRect(0, 0, w, h);
    glow(ctx, w * sunX, h * sunY, w * 0.5, "255,255,255", 0.5);
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.beginPath();
    ctx.arc(w * sunX, h * sunY, w * 0.085, 0, Math.PI * 2);
    ctx.fill();
    ridge(ctx, w, h, h * hillY, h * 0.04, 0.03, 0.8, p.hills[0]);
    ridge(ctx, w, h, h * (hillY + 0.12), h * 0.03, 0.045, 2.6, p.hills[1]);
    if (hasFigure) figure(ctx, w * figX, h * 0.88, h * 0.23, p.hills[2], t);
    ridge(ctx, w, h, h * 0.93, h * 0.015, 0.05, 1.4, p.hills[2]);

    // ranting sakura dari pojok kanan atas
    const P0 = [w * 1.05, h * 0.04];
    const P1 = [w * 0.78, h * bend];
    const P2 = [w * 0.34, h * (bend - 0.04)];
    ctx.strokeStyle = p.branch;
    ctx.lineCap = "round";
    ctx.lineWidth = w * 0.022;
    ctx.beginPath();
    ctx.moveTo(P0[0], P0[1]);
    ctx.quadraticCurveTo(P1[0], P1[1], P2[0], P2[1]);
    ctx.stroke();
    for (const b of blossoms) {
      const u = b.u;
      const bx = (1 - u) ** 2 * P0[0] + 2 * (1 - u) * u * P1[0] + u * u * P2[0] + b.ox * w;
      const by = (1 - u) ** 2 * P0[1] + 2 * (1 - u) * u * P1[1] + u * u * P2[1] + b.oy * h;
      ctx.fillStyle = `rgba(${p.petal},1)`;
      ctx.beginPath();
      ctx.arc(bx, by, b.r * w, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff0f6";
      ctx.beginPath();
      ctx.arc(bx, by, b.r * w * 0.45, 0, Math.PI * 2);
      ctx.fill();
    }
    for (const pt of petals) {
      const y = (((pt.y + t * pt.sp) % 1.1) - 0.05) * h;
      const x = (pt.x + Math.sin(t * 0.8 + pt.ph) * pt.sw) * w;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(t * 0.9 + pt.ph);
      ctx.fillStyle = `rgba(${p.petal},0.9)`;
      ctx.beginPath();
      ctx.ellipse(0, 0, pt.s * 3.2 * k, pt.s * 1.7 * k, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  };
}

/* ===================== RAIN — kota basah ===================== */

const RAIN: { sky: Sky; ground: string; win: string }[] = [
  {
    sky: [[0, "#050f1a"], [0.55, "#0c3145"], [1, "#1b5560"]],
    ground: "#04101a",
    win: "#ffe08a",
  },
  {
    sky: [[0, "#12051c"], [0.55, "#33124a"], [1, "#65246b"]],
    ground: "#0d0418",
    win: "#8ae8ff",
  },
  {
    sky: [[0, "#0b0b12"], [0.55, "#26262f"], [1, "#4a4450"]],
    ground: "#08080d",
    win: "#ffb36b",
  },
];

function rain(rand: Rand, m: number): Painter {
  const p = pick(rand, RAIN);
  const city = genCity(rand);
  const neon = ["255,60,140", "60,220,255", "255,220,110", "150,120,255", "120,255,180"];
  const umbrella = pick(rand, ["#d9345f", "#3b6fd4", "#f0c33c", "#2f9e7a", "#e4e4ea"]);
  const figX = range(rand, 0.25, 0.75);
  const tilt = range(rand, 0.18, 0.45);
  const bokeh = Array.from({ length: 6 + Math.floor(rand() * 7) }, () => ({
    x: rand(),
    y: 0.45 + rand() * 0.45,
    r: 0.03 + rand() * 0.05,
    c: pick(rand, neon),
    ph: rand() * 6.28,
  }));
  const drops = Array.from({ length: 40 * m }, () => ({
    x: rand(),
    y: rand(),
    l: 0.05 + rand() * 0.06,
    sp: 0.9 + rand() * 0.7,
  }));

  return (ctx, w, h, t) => {
    const k = Math.max(1, Math.min(w, h) / 180);
    ctx.fillStyle = vgrad(ctx, h, p.sky);
    ctx.fillRect(0, 0, w, h);
    skyline(ctx, w, h, h * 0.8, city, p.ground, p.win, t);
    for (const b of bokeh) {
      glow(ctx, b.x * w, b.y * h, b.r * w, b.c, 0.25 + 0.15 * Math.sin(t * 1.4 + b.ph));
    }
    ctx.fillStyle = vgrad(ctx, h, [[0, p.ground], [1, p.sky[2][1]]]);
    ctx.fillRect(0, h * 0.86, w, h * 0.14);
    figure(ctx, w * figX, h * 0.9, h * 0.26, "#02080f", t, umbrella);
    ctx.strokeStyle = "rgba(200,230,255,0.45)";
    ctx.lineWidth = Math.sqrt(k);
    for (const d of drops) {
      const x = ((((d.x - t * 0.02 * d.sp) % 1) + 1) % 1) * w;
      const y = ((d.y + t * d.sp * 0.9) % 1) * h;
      const len = d.l * h;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - len * tilt, y + len);
      ctx.stroke();
    }
  };
}

/* ===================== AURORA — cahaya utara ===================== */

const AURORA_SETS = [
  ["80,255,170", "60,190,255", "170,120,255"],
  ["255,120,200", "120,160,255", "90,255,220"],
  ["255,200,90", "120,255,160", "80,170,255"],
];

function aurora(rand: Rand, m: number): Painter {
  const colors = pick(rand, AURORA_SETS);
  const bandCount = 2 + Math.floor(rand() * 3);
  const bands = Array.from({ length: bandCount }, (_, i) => ({
    y: range(rand, 0.16, 0.42) + i * 0.04,
    amp: range(rand, 0.07, 0.16),
    freq: range(rand, 0.8, 1.8),
    sp: range(rand, 0.25, 0.7),
    thick: range(rand, 0.08, 0.18),
    c: colors[i % colors.length],
  }));
  const snowY = range(rand, 0.74, 0.86);
  const hasMoon = rand() < 0.5;
  const moonX = range(rand, 0.1, 0.9);
  const trees = Array.from({ length: 3 + Math.floor(rand() * 5) }, () => ({
    x: rand(),
    s: range(rand, 0.12, 0.26),
  }));
  const stars = Array.from({ length: 50 * m }, () => ({
    x: rand(),
    y: rand() * 0.7,
    r: 0.4 + rand() * 0.8,
    ph: rand() * 6.28,
  }));

  return (ctx, w, h, t) => {
    const k = Math.max(1, Math.min(w, h) / 180);
    ctx.fillStyle = vgrad(ctx, h, [[0, "#020617"], [0.6, "#0a1b3d"], [1, "#12305c"]]);
    ctx.fillRect(0, 0, w, h);
    for (const s of stars) {
      ctx.fillStyle = `rgba(255,255,255,${0.3 + 0.5 * Math.abs(Math.sin(t * 1.5 + s.ph))})`;
      ctx.beginPath();
      ctx.arc(s.x * w, s.y * h, s.r * Math.sqrt(k), 0, Math.PI * 2);
      ctx.fill();
    }
    if (hasMoon) {
      glow(ctx, w * moonX, h * 0.14, w * 0.35, "220,235,255", 0.3);
      ctx.fillStyle = "#eef6ff";
      ctx.beginPath();
      ctx.arc(w * moonX, h * 0.14, w * 0.05, 0, Math.PI * 2);
      ctx.fill();
    }
    // tirai cahaya
    for (const b of bands) {
      const g = ctx.createLinearGradient(0, h * (b.y - b.thick), 0, h * (b.y + b.thick));
      g.addColorStop(0, `rgba(${b.c},0)`);
      g.addColorStop(0.5, `rgba(${b.c},0.55)`);
      g.addColorStop(1, `rgba(${b.c},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(0, h * (b.y - b.thick));
      for (let x = 0; x <= w; x += 6) {
        const u = x / w;
        const y = b.y + Math.sin(u * b.freq * 6.28 + t * b.sp) * b.amp;
        ctx.lineTo(x, h * (y - b.thick));
      }
      for (let x = w; x >= 0; x -= 6) {
        const u = x / w;
        const y = b.y + Math.sin(u * b.freq * 6.28 + t * b.sp) * b.amp;
        ctx.lineTo(x, h * (y + b.thick));
      }
      ctx.closePath();
      ctx.fill();
    }
    ridge(ctx, w, h, h * snowY, h * 0.03, 0.04, 1.9, "#dfe9f7");
    ctx.fillStyle = "#c9d8ee";
    ctx.fillRect(0, h * (snowY + 0.1), w, h);
    for (const tr of trees) {
      pine(ctx, tr.x * w, h * (snowY + 0.1), h * tr.s, "#0d1b2e");
    }
  };
}

/* ===================== MEADOW — padang siang hari ===================== */

const MEADOW: { sky: Sky; hills: string[]; flower: string }[] = [
  {
    sky: [[0, "#4aa3e8"], [0.6, "#a7d8f5"], [1, "#e9f6d8"]],
    hills: ["#8fce6a", "#5fa84c", "#3c7a37"],
    flower: "#fff6a8",
  },
  {
    sky: [[0, "#3f7fd4"], [0.55, "#9ec9ee"], [1, "#fce8c0"]],
    hills: ["#c3d46a", "#8aa84a", "#5b7834"],
    flower: "#ff9ec2",
  },
  {
    sky: [[0, "#6ec6d8"], [0.55, "#bfe6e0"], [1, "#f6f0cf"]],
    hills: ["#7fc9a4", "#4f9e7c", "#2f6b56"],
    flower: "#ffffff",
  },
];

function meadow(rand: Rand, m: number): Painter {
  const p = pick(rand, MEADOW);
  const sunX = range(rand, 0.1, 0.9);
  const sunY = range(rand, 0.1, 0.28);
  const hillY = range(rand, 0.6, 0.72);
  const hasFigure = rand() < 0.6;
  const figX = range(rand, 0.2, 0.8);
  const clouds = Array.from({ length: 2 + Math.floor(rand() * 4) }, () => ({
    x: rand(),
    y: range(rand, 0.12, 0.42),
    r: range(rand, 0.04, 0.09),
    sp: 0.004 + rand() * 0.01,
  }));
  const flowers = Array.from({ length: 26 * m }, () => ({
    x: rand(),
    y: range(rand, 0.74, 1),
    r: range(rand, 0.004, 0.009),
    ph: rand() * 6.28,
  }));

  return (ctx, w, h, t) => {
    ctx.fillStyle = vgrad(ctx, h, p.sky);
    ctx.fillRect(0, 0, w, h);
    glow(ctx, w * sunX, h * sunY, w * 0.45, "255,245,200", 0.6);
    ctx.fillStyle = "#fffbe8";
    ctx.beginPath();
    ctx.arc(w * sunX, h * sunY, w * 0.07, 0, Math.PI * 2);
    ctx.fill();
    for (const c of clouds) {
      const cx = (((c.x + t * c.sp) % 1.35) - 0.18) * w;
      puff(ctx, cx, c.y * h, c.r * w, "rgba(255,255,255,0.9)");
    }
    ridge(ctx, w, h, h * hillY, h * 0.04, 0.028, 1.4, p.hills[0]);
    ridge(ctx, w, h, h * (hillY + 0.11), h * 0.035, 0.042, 3.1, p.hills[1]);
    if (hasFigure) figure(ctx, w * figX, h * 0.9, h * 0.24, p.hills[2], t);
    ridge(ctx, w, h, h * 0.94, h * 0.02, 0.055, 0.9, p.hills[2]);
    for (const f of flowers) {
      ctx.fillStyle = p.flower;
      ctx.globalAlpha = 0.55 + 0.45 * Math.sin(t * 1.2 + f.ph);
      ctx.beginPath();
      ctx.arc(f.x * w, f.y * h, f.r * w, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };
}

/* ===================== OCEAN — laut & pantulan cahaya ===================== */

const OCEAN: { sky: Sky; sea: Sky; sun: string; halo: string }[] = [
  {
    sky: [[0, "#1b2a63"], [0.5, "#e5735f"], [1, "#ffd28a"]],
    sea: [[0, "#f0a06c"], [0.4, "#4a5b96"], [1, "#101a3d"]],
    sun: "#fff0c4",
    halo: "255,170,110",
  },
  {
    sky: [[0, "#06183a"], [0.55, "#0f4a6b"], [1, "#55b6bd"]],
    sea: [[0, "#3fa0a6"], [0.45, "#155066"], [1, "#04121f"]],
    sun: "#e9ffff",
    halo: "150,230,255",
  },
  {
    sky: [[0, "#2b1140"], [0.5, "#7a2f6b"], [1, "#f3a07e"]],
    sea: [[0, "#c2707c"], [0.45, "#4a2350"], [1, "#150a20"]],
    sun: "#ffe6d0",
    halo: "255,140,150",
  },
];

function ocean(rand: Rand, m: number): Painter {
  const p = pick(rand, OCEAN);
  const horizon = range(rand, 0.52, 0.66);
  const sunX = range(rand, 0.2, 0.8);
  const sunR = range(rand, 0.06, 0.11);
  const hasIsland = rand() < 0.55;
  const islandX = range(rand, 0.1, 0.9);
  const birds = Array.from({ length: 2 + Math.floor(rand() * 4) }, () => ({
    x: rand(),
    y: range(rand, 0.12, 0.38),
    s: range(rand, 0.02, 0.04),
    sp: range(rand, 0.01, 0.03),
  }));
  const waves = Array.from({ length: 14 * m }, () => ({
    y: rand(),
    x: rand(),
    len: range(rand, 0.06, 0.22),
    sp: range(rand, 0.02, 0.07),
  }));

  return (ctx, w, h, t) => {
    ctx.fillStyle = vgrad(ctx, h, p.sky);
    ctx.fillRect(0, 0, w, h * horizon);
    glow(ctx, w * sunX, h * horizon, w * 0.55, p.halo, 0.6);
    ctx.fillStyle = p.sun;
    ctx.beginPath();
    ctx.arc(w * sunX, h * (horizon - sunR * 0.3), w * sunR, 0, Math.PI * 2);
    ctx.fill();
    for (const b of birds) {
      const bx = (((b.x + t * b.sp) % 1.2) - 0.1) * w;
      const flap = Math.sin(t * 4 + b.x * 10) * b.s * h * 0.35;
      ctx.strokeStyle = "rgba(20,20,30,0.55)";
      ctx.lineWidth = Math.max(1, w * 0.004);
      ctx.beginPath();
      ctx.moveTo(bx - b.s * w, b.y * h + flap);
      ctx.quadraticCurveTo(bx, b.y * h - b.s * h * 0.3, bx + b.s * w, b.y * h + flap);
      ctx.stroke();
    }
    if (hasIsland) {
      ridge(ctx, w, h * horizon, h * horizon * 0.94, h * 0.03, 0.09, islandX * 6, "#1a1330");
    }
    // laut
    const g = ctx.createLinearGradient(0, h * horizon, 0, h);
    p.sea.forEach(([o, c]) => g.addColorStop(o, c));
    ctx.fillStyle = g;
    ctx.fillRect(0, h * horizon, w, h * (1 - horizon));
    // jalur pantulan matahari: guratan cahaya bertepi lembut
    const rows = 34;
    for (let i = 0; i < rows; i++) {
      const u = i / rows;
      const y = h * (horizon + 0.015 + u * (1 - horizon) * 0.98);
      const hw = w * sunR * (0.5 + u * 2.1) * (0.75 + 0.25 * Math.sin(t * 2.2 + i * 1.7));
      const cx = w * sunX + Math.sin(t * 1.5 + i * 0.8) * w * 0.012 * (0.2 + u);
      const a = 0.42 * (1 - u * 0.85) * (0.55 + 0.45 * Math.sin(t * 3 + i * 2.1));
      const g2 = ctx.createLinearGradient(cx - hw, 0, cx + hw, 0);
      g2.addColorStop(0, "rgba(255,240,210,0)");
      g2.addColorStop(0.5, `rgba(255,243,218,${a})`);
      g2.addColorStop(1, "rgba(255,240,210,0)");
      ctx.fillStyle = g2;
      ctx.fillRect(cx - hw, y, hw * 2, Math.max(1, (h * (1 - horizon)) / rows) * 0.7);
    }
    // riak ombak
    for (const wv of waves) {
      const u = wv.y;
      const y = h * (horizon + 0.03 + u * (1 - horizon) * 0.94);
      const x = (((wv.x + t * wv.sp) % 1.2) - 0.1) * w;
      const len = wv.len * w * (0.5 + u);
      ctx.strokeStyle = `rgba(255,255,255,${0.08 + 0.16 * u})`;
      ctx.lineWidth = Math.max(1, h * 0.005 * (0.5 + u));
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + len * 0.5, y - h * 0.006, x + len, y);
      ctx.stroke();
    }
  };
}

/* ===================== SNOW — hutan bersalju ===================== */

const SNOW: { sky: Sky; tree: string; ground: string }[] = [
  {
    sky: [[0, "#1b2340"], [0.6, "#48557e"], [1, "#9aa6c4"]],
    tree: "#151c2e",
    ground: "#e8eefb",
  },
  {
    sky: [[0, "#2c1c3a"], [0.6, "#6b4a6b"], [1, "#d9a7a0"]],
    tree: "#241a2c",
    ground: "#f6e9ec",
  },
  {
    sky: [[0, "#06202c"], [0.6, "#2e5a64"], [1, "#9fc6c2"]],
    tree: "#0b1d22",
    ground: "#e4f1ee",
  },
];

function snow(rand: Rand, m: number): Painter {
  const p = pick(rand, SNOW);
  const groundY = range(rand, 0.68, 0.82);
  const moonX = range(rand, 0.12, 0.88);
  const moonY = range(rand, 0.12, 0.3);
  const hasFigure = rand() < 0.5;
  const figX = range(rand, 0.2, 0.8);
  const trees = Array.from({ length: 4 + Math.floor(rand() * 6) }, () => ({
    x: rand(),
    s: range(rand, 0.14, 0.34),
  })).sort((a, b) => a.s - b.s);
  const flakes = Array.from({ length: 45 * m }, () => ({
    x: rand(),
    y: rand(),
    r: range(rand, 0.004, 0.011),
    sp: range(rand, 0.02, 0.06),
    sw: range(rand, 0.01, 0.04),
    ph: rand() * 6.28,
  }));

  return (ctx, w, h, t) => {
    ctx.fillStyle = vgrad(ctx, h, p.sky);
    ctx.fillRect(0, 0, w, h);
    glow(ctx, w * moonX, h * moonY, w * 0.4, "235,240,255", 0.35);
    ctx.fillStyle = "#fbfdff";
    ctx.beginPath();
    ctx.arc(w * moonX, h * moonY, w * 0.06, 0, Math.PI * 2);
    ctx.fill();
    ridge(ctx, w, h, h * groundY, h * 0.025, 0.035, 2.2, p.ground);
    ctx.fillStyle = p.ground;
    ctx.fillRect(0, h * (groundY + 0.08), w, h);
    for (const tr of trees) {
      pine(ctx, tr.x * w, h * (groundY + 0.09), h * tr.s, p.tree);
    }
    if (hasFigure) figure(ctx, w * figX, h * (groundY + 0.16), h * 0.2, p.tree, t);
    for (const f of flakes) {
      const y = ((f.y + t * f.sp) % 1.1 - 0.05) * h;
      const x = (f.x + Math.sin(t * 0.7 + f.ph) * f.sw) * w;
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.beginPath();
      ctx.arc(x, y, f.r * w, 0, Math.PI * 2);
      ctx.fill();
    }
  };
}

/* ===================== Perakit ===================== */

export function makePainter(
  scene: SceneName,
  seed: number,
  big = false
): Painter {
  const rand = mulberry32(seed * 7919 + 13);
  const m = big ? 3 : 1; // lebih banyak bintang / kelopak / hujan di layar penuh
  const flip = rand() < 0.5; // dicerminkan atau tidak

  const builders: Record<SceneName, (r: Rand, m: number) => Painter> = {
    twilight,
    night,
    sakura,
    rain,
    aurora,
    meadow,
    ocean,
    snow,
  };
  const paint = builders[scene](rand, m);

  return (ctx, w, h, t) => {
    ctx.save();
    if (flip) {
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
    }
    paint(ctx, w, h, t);
    ctx.restore();

    // Vignette tipis supaya terasa seperti frame film
    const v = ctx.createRadialGradient(
      w / 2,
      h / 2,
      Math.min(w, h) * 0.3,
      w / 2,
      h / 2,
      Math.max(w, h) * 0.75
    );
    v.addColorStop(0, "rgba(0,0,0,0)");
    v.addColorStop(1, "rgba(0,0,0,0.4)");
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, w, h);
  };
}
