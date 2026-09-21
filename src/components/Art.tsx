/* =====================================================================
 *  GAMBAR PER BARIS LIRIK
 *
 *  Aturannya: SATU BARIS = SATU GAMBAR. Tidak ada gambar yang dipakai
 *  dua kali. Urutan prioritas untuk tiap baris:
 *
 *    1. `image` yang ditulis langsung di baris itu (components/lirik.tsx)
 *    2. LINE_IMAGES[index] di bawah ini
 *    3. Lukisan canvas anime — scene + seed-nya dibikin unik per baris
 *
 *  Kalau file gambarnya tidak ketemu, card otomatis balik ke lukisan
 *  canvas, jadi aman walau daftarnya belum kamu isi semua.
 * ===================================================================== */

import type { SceneName } from "../types";

export const SCENES: SceneName[] = ["twilight", "night", "sakura", "rain"];

/**
 * Taruh file-nya di folder `public/anime/`, lalu tulis path-nya di sini.
 * Urutannya = urutan baris lirik (baris ke-1 pakai item pertama, dst).
 * Kosongkan saja (biarkan array kosong) kalau mau full lukisan canvas.
 *
 * Contoh isi:
 *   "/anime/01.jpg",
 *   "/anime/02.jpg",
 *   "/anime/03.jpg",
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

/**
 * Scene canvas untuk baris ke-`index`.
 * Cuma ada 4 scene, jadi untuk lirik panjang scene-nya pasti dipakai lagi —
 * tapi rotasinya digeser tiap putaran supaya urutannya tidak persis sama
 * dan tidak pernah ada dua baris berurutan dengan scene kembar.
 */
export function sceneForIndex(index: number): SceneName {
  const round = Math.floor(index / SCENES.length);
  return SCENES[(index + round) % SCENES.length];
}

/**
 * Seed unik per baris. Ini yang bikin dua baris ber-scene "night" pun
 * tetap beda: susunan gedung, bintang, kelopak, dan hujannya lain semua.
 */
export function seedForIndex(index: number): number {
  return index * 37 + 11;
}