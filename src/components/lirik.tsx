import type { RawLine, SceneName } from "../types";

export type { SceneName };
export type WordTiming = { text: string; start: number };
export type { RawLine };

// Tweak OFFSET ini jika audio mp3 kamu punya jeda diam di awal file:
// Contoh: -0.3 berarti lirik dipercepat 0.3 detik
// Contoh: +0.5 berarti lirik diundur/diperlambat 0.5 detik
const OFFSET = -0.3;

/* ---------------------------------------------------------------------
 *  Tiap baris boleh punya dua isian tambahan (dua-duanya opsional):
 *
 *    image: "/anime/01.jpg"   -> gambar khusus baris ini
 *                                (taruh file-nya di folder public/anime/)
 *    scene: "night"           -> paksa scene lukisan canvas
 *                                "twilight" | "night" | "sakura" | "rain"
 *
 *  Kalau `image` dikosongkan, baris itu ambil dari LINE_IMAGES di
 *  src/config/art.ts; kalau di sana juga kosong, dipakai lukisan canvas
 *  dengan scene + seed unik per baris. Satu path gambar hanya boleh
 *  dipakai sekali — kalau kembar, baris kedua otomatis balik ke canvas.
 * ------------------------------------------------------------------- */
const rawData: RawLine[] = [
  {
    text: "I'm lookin' back on things I've done",
    // image: "/anime/01.jpg",
    words: [
      { text: "I'm", start: 0.85 },
      { text: "lookin'", start: 1.58 },
      { text: "back", start: 2.5 },
      { text: "on", start: 3.5 },
      { text: "things", start: 4.1 },
      { text: "I've", start: 4.8 },
      { text: "done", start: 5.5 },
    ],
  },
  {
    text: "I never wanna play the same old part",
    // image: "/anime/02.jpg",
    words: [
      { text: "I", start: 6.1 },
      { text: "never", start: 6.9 },
      { text: "wanna", start: 7.75 },
      { text: "play", start: 8.4 },
      { text: "the", start: 8.9 },
      { text: "same", start: 9.1 },
      { text: "old", start: 9.92 },
      { text: "part", start: 10.28 },
    ],
  },
  {
    text: "I'll keep you in the dark",
    // image: "/anime/03.jpg",
    words: [
      { text: "I'll", start: 11.5 },
      { text: "keep", start: 11.55 },
      { text: "you", start: 12.3 },
      { text: "in", start: 13.0 },
      { text: "the", start: 13.5 },
      { text: "dark", start: 14.5 },
    ],
  },
  {
    text: "Now let me show you the shape of my heart",
    // image: "/anime/04.jpg",
    words: [
      { text: "Now", start: 15.9 },
      { text: "let", start: 16.5 },
      { text: "me", start: 17.32 },
      { text: "show", start: 17.74 },
      { text: "you", start: 18.5 },
      { text: "the", start: 18.92 },
      { text: "shape", start: 19.13 },
      { text: "of", start: 19.42 },
      { text: "my", start: 20.05 },
      { text: "heart", start: 20.69 },
    ],
  },
  {
    text: "things I've done",
    // image: "/anime/05.jpg",
    words: [
      { text: "things", start: 21.5 },
      { text: "I've", start: 22.0 },
      { text: "done", start: 22.5 },
    ],
  },
  {
    text: "I was tryin' to be someone",
    // image: "/anime/06.jpg",
    words: [
      { text: "I", start: 23.53 },
      { text: "was", start: 24.5 },
      { text: "tryin'", start: 25.9 },
      { text: "to", start: 26.5 },
      { text: "be", start: 27.1 },
      { text: "someone", start: 27.81 },
    ],
  },
  {
    text: "I played my part",
    // image: "/anime/07.jpg",
    words: [
      { text: "I", start: 29.37 },
      { text: "played", start: 29.5 },
      { text: "my", start: 29.9 },
      { text: "part", start: 30.96 },
    ],
  },
  {
    text: "Kept you in the dark",
    // image: "/anime/08.jpg",
    words: [
      { text: "Kept", start: 32.7 },
      { text: "you", start: 32.9 },
      { text: "in", start: 33.0 },
      { text: "the", start: 33.4 },
      { text: "dark", start: 33.72 },
    ],
  },
  {
    text: "Now let me show you the shape of my heart",
    // image: "/anime/09.jpg",
    words: [
      { text: "Now", start: 34.68 },
      { text: "let", start: 35.37 },
      { text: "me", start: 35.67 },
      { text: "show", start: 35.9 },
      { text: "you", start: 36.5 },
      { text: "the", start: 37.5 },
      { text: "shape", start: 38.1 },
      { text: "of", start: 39.2 },
      { text: "my", start: 40.6 },
      { text: "heart", start: 40.8 },
    ],
  },
];

export const lyricsData: RawLine[] = rawData.map((line) => ({
  ...line,
  words: line.words.map((w) => ({
    ...w,
    start: Math.max(0, w.start + OFFSET),
  })),
}));
