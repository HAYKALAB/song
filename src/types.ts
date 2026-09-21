/* =====================================================================
 *  TIPE DATA BERSAMA
 * ===================================================================== */

export type SceneName =
  | "twilight"
  | "night"
  | "sakura"
  | "rain"
  | "aurora"
  | "meadow"
  | "ocean"
  | "snow";

export type Word = { text: string; start: number; fade?: number };

/** Bentuk baris mentah di components/lirik.tsx */
export type RawLine = {
  text: string;
  words: Word[];
  /** Opsional: gambar khusus untuk baris ini, contoh "/anime/03.jpg" */
  image?: string;
  /** Opsional: paksa scene canvas untuk baris ini */
  scene?: SceneName;
};

/** Baris yang sudah diolah: gambar, scene, dan seed-nya sudah pasti */
export type Line = {
  text: string;
  start: number;
  words: Word[];
  image?: string;
  scene: SceneName;
  /** Angka unik per baris -> lukisan canvas-nya beda walau scene-nya sama */
  seed: number;
};
