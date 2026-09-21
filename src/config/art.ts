/* =====================================================================
 *  GAMBAR PER BARIS LIRIK
 *
 *  Aturannya: SATU BARIS = SATU GAMBAR. Urutan prioritas tiap baris:
 *
 *    1. `image` yang ditulis langsung di baris itu (components/lirik.tsx)
 *    2. LINE_IMAGES[index] di bawah ini
 *    3. Lukisan canvas anime — scene, palet warna, dan komposisinya
 *       diacak per baris
 *
 *  Kalau file gambarnya tidak ketemu, card otomatis balik ke lukisan
 *  canvas, jadi aman walau daftarnya belum kamu isi semua.
 * ===================================================================== */

import { mulberry32 } from "../art/rng";
import type { SceneName } from "../types";

export const SCENES: SceneName[] = [
  "twilight",
  "night",
  "sakura",
  "rain",
  "aurora",
  "meadow",
  "ocean",
  "snow",
];

/**
 * Taruh file-nya di folder `public/anime/`, lalu tulis path-nya di sini.
 * Urutannya = urutan baris lirik (baris ke-1 pakai item pertama, dst).
 * Kosongkan saja (biarkan array kosong) kalau mau full lukisan canvas.
 */
export const LINE_IMAGES: string[] = [
  // "/anime/01.jpg",
  // "/anime/02.jpg",
  // "/anime/03.jpg",
  // "/anime/04.jpg",
  // "/anime/05.jpg",
  // "/anime/06.jpg",
  // "/anime/07.jpg",
  // "/anime/08.jpg",
  // "/anime/09.jpg",
];

/* ---------------------------------------------------------------------
 *  Scene dibagikan seperti kocokan kartu: satu putaran memakai kedelapan
 *  scene masing-masing sekali, baru dikocok ulang untuk putaran
 *  berikutnya. Kartu pertama putaran baru ditukar kalau kebetulan sama
 *  dengan kartu terakhir putaran sebelumnya — jadi tidak pernah ada dua
 *  baris berurutan dengan scene kembar.
 * ------------------------------------------------------------------- */
const sequence: SceneName[] = [];

function shuffled(round: number): SceneName[] {
  const rand = mulberry32(round * 7919 + 5);
  const deck = [...SCENES];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function ensure(index: number) {
  let round = Math.floor(sequence.length / SCENES.length);
  while (sequence.length <= index) {
    const deck = shuffled(round++);
    const last = sequence[sequence.length - 1];
    if (last && deck[0] === last) [deck[0], deck[1]] = [deck[1], deck[0]];
    sequence.push(...deck);
  }
}

/** Scene untuk baris ke-`index` */
export function sceneForIndex(index: number): SceneName {
  ensure(index);
  return sequence[index];
}

/**
 * Seed unik per baris. Ini yang menentukan palet warna, posisi matahari/
 * bulan, jumlah bukit, arah cermin, dan isi pemandangan — jadi dua baris
 * dengan scene sama pun tetap kelihatan lain.
 */
export function seedForIndex(index: number): number {
  return index * 1013 + 37;
}
