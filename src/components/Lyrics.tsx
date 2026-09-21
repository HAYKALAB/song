/* =====================================================================
 *  PENGOLAH DATA LIRIK
 *  Data mentah dari components/lirik.tsx dirapikan di sini: baris kosong
 *  dibuang, waktu mulai dihitung, lalu tiap baris dapat gambar/scene/seed
 *  miliknya sendiri yang dijamin tidak kembar dengan baris lain.
 * ===================================================================== */

import { lyricsData } from "../components/lirik";
import { LINE_IMAGES, sceneForIndex, seedForIndex } from "../config/art";
import type { Line, RawLine } from "../types";

function buildLines(): Line[] {
  const used = new Set<string>();

  return (lyricsData as RawLine[])
    .filter((l) => l.words.length > 0)
    .map((l, index) => {
      // Gambar baris ini: tulisan manual menang, baru daftar LINE_IMAGES
      let image = l.image ?? LINE_IMAGES[index];

      // Jaga-jaga: kalau path yang sama kepakai dua kali, baris kedua
      // dibiarkan pakai lukisan canvas supaya tidak ada gambar kembar.
      if (image) {
        if (used.has(image)) {
          if (import.meta.env?.DEV) {
            console.warn(
              `[lirik] Gambar "${image}" dipakai lebih dari sekali. ` +
                `Baris ${index + 1} ("${l.text}") dialihkan ke lukisan canvas.`
            );
          }
          image = undefined;
        } else {
          used.add(image);
        }
      }

      return {
        text: l.text,
        words: l.words,
        start: l.words[0].start,
        image,
        scene: l.scene ?? sceneForIndex(index),
        seed: seedForIndex(index),
      };
    });
}

export const lyrics: Line[] = buildLines();

/** Baris keberapa yang sedang dinyanyikan pada detik `time` (-1 = belum mulai) */
export function getActiveIndex(time: number): number {
  let idx = -1;
  for (let i = 0; i < lyrics.length; i++) {
    if (time >= lyrics[i].start) idx = i;
  }
  return idx;
}