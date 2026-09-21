/* =====================================================================
 *  TEMA & PENGATURAN — ubah di sini
 * ===================================================================== */

export const THEME = {
  bg: "#0a0807", // latar
  glow: "#1f1510", // cahaya lembut di tengah layar
  text: "#f2e9db", // warna lirik
  fresh: "#ffb385", // kata baru muncul + aksen card
  freshGlow: "rgba(255, 150, 100, 0.45)",
  font: '"Instrument Serif", Georgia, "Times New Roman", serif',
};

export const DEFAULT_FADE = 0.6; // lama animasi muncul per kata (detik)
export const PAST_OPACITY = 0.4; // seberapa redup card baris yang sudah lewat (0–1)
export const TILT_STRENGTH = 1; // efek miring ikut mouse (0 = mati, 2 = lebih miring)

// Foto latar penuh layar (taruh di public/anime/bg.jpg lalu isi "/anime/bg.jpg").
// Kosongkan "" untuk memakai lukisan canvas anime yang berganti otomatis
// mengikuti baris lirik yang sedang dinyanyikan.
export const BACKGROUND_IMAGE = "";
export const BG_DIM = 0.5; // gelapnya lapisan di atas gambar latar (0–1)

export const REDUCED_MOTION =
  typeof window !== "undefined" &&
  !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Pemendek durasi animasi kalau user minta gerakan dikurangi */
export const ms = (n: number) => (REDUCED_MOTION ? 1 : n);

// Grain film tipis supaya latar tidak terasa "datar"
export const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
