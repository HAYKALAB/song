/* =====================================================================
 *  LIRIK KATA-PER-KATA — komponen utama (tinggal rangkaian saja)
 *
 *  Tempat mengubah sesuatu:
 *    · warna, font, kecepatan animasi ....... src/config/theme.ts
 *    · gambar tiap baris ..................... src/config/art.ts
 *    · lirik & waktunya ...................... src/components/lirik.tsx
 *    · lukisan canvas anime .................. src/art/painters.ts
 *
 *  KEYBOARD: Spasi = putar/jeda · ← / → = geser lirik -/+ 0.25 detik
 * ===================================================================== */

import { useEffect, useRef } from "react";
import songUrl from "./assets/song.mp3"; // taruh mp3-nya di src/assets/song.mp3

import { BackgroundArt } from "./components/BackgroundArt";
import { LyricCard } from "./components/LyricCard";
import { getActiveIndex, lyrics } from "./lib/lyrics";
import { usePlayer } from "./lib/usePlayer";
import { GRAIN, THEME, TILT_STRENGTH } from "./config/theme";
import { STYLES } from "./styles/animations";

export default function WordByWordSyncedLyrics() {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { audioRef, time, offset, playing, setPlaying, toggle } = usePlayer();

  const lyricTime = time - offset;
  const activeIndex = getActiveIndex(lyricTime);

  // Latar mengikuti baris yang sedang dinyanyikan
  const bgLine = lyrics[activeIndex >= 0 ? activeIndex : 0];

  // Card baru muncul di bawah; kalau sudah penuh, daftar bergulir ke atas
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const id = requestAnimationFrame(() => {
      el.scrollTo({
        top: activeIndex <= 0 ? 0 : el.scrollHeight,
        behavior: "smooth",
      });
    });
    return () => cancelAnimationFrame(id);
  }, [activeIndex]);

  // Seluruh susunan card miring halus mengikuti mouse
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const root = rootRef.current;
    if (!root || e.pointerType !== "mouse") return;
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;
    root.style.setProperty("--ry", String(nx * 10 * TILT_STRENGTH));
    root.style.setProperty("--rx", String(-ny * 8 * TILT_STRENGTH));
  };
  const onPointerLeave = () => {
    rootRef.current?.style.setProperty("--ry", "0");
    rootRef.current?.style.setProperty("--rx", "0");
  };

  const fadeMask =
    "linear-gradient(to bottom, transparent 0, black 10%, black 88%, transparent 100%)";

  return (
    <div
      ref={rootRef}
      className="relative h-screen overflow-hidden"
      style={{ background: THEME.bg }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      // Ketuk layar = putar/jeda (browser menahan autoplay sampai ada interaksi)
      onClick={toggle}
    >
      <style>{STYLES}</style>

      <audio
        ref={audioRef}
        src={songUrl}
        loop
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {/* Gambar latar */}
      <BackgroundArt scene={bgLine.scene} seed={bgLine.seed} />

      {/* Cahaya besar yang bergerak pelan */}
      <div
        aria-hidden
        className="orb orb-a"
        style={{
          width: "60vmin",
          height: "60vmin",
          left: "8%",
          top: "10%",
          background:
            "radial-gradient(circle, rgba(255,140,90,.20), transparent 65%)",
        }}
      />
      <div
        aria-hidden
        className="orb orb-b"
        style={{
          width: "70vmin",
          height: "70vmin",
          right: "2%",
          bottom: "0%",
          background:
            "radial-gradient(circle, rgba(200,110,140,.16), transparent 65%)",
        }}
      />

      {/* Grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: GRAIN }}
      />

      {/* Daftar card, bergulir otomatis */}
      <div
        ref={scrollRef}
        className="absolute inset-0 overflow-hidden px-5 md:px-16"
        style={{ maskImage: fadeMask, WebkitMaskImage: fadeMask }}
      >
        <div
          className="mx-auto flex max-w-5xl flex-col gap-5 pb-[38vh] pt-[14vh]"
          style={{
            transform:
              "perspective(1400px) rotateX(calc(var(--rx, 0) * 1deg)) rotateY(calc(var(--ry, 0) * 1deg))",
            transformOrigin: "50% 0",
            transition: "transform .6s ease-out",
          }}
        >
          {lyrics.slice(0, activeIndex + 1).map((line, i) => (
            <LyricCard
              key={i}
              line={line}
              index={i}
              time={lyricTime}
              isCurrent={i === activeIndex}
            />
          ))}
        </div>
      </div>

      {/* Equalizer kecil saat lagu diputar / petunjuk saat jeda */}
      {playing ? (
        <div
          aria-hidden
          className="fixed bottom-6 left-1/2 flex h-5 -translate-x-1/2 items-end gap-1"
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="eq-bar"
              style={{
                background: THEME.fresh,
                animationDelay: `${i * 0.13}s`,
                animationDuration: `${0.7 + (i % 3) * 0.2}s`,
              }}
            />
          ))}
        </div>
      ) : (
        <p
          className="fixed bottom-6 left-0 right-0 text-center font-sans text-xs tracking-wide"
          style={{ color: THEME.text, opacity: 0.3 }}
        >
          Ketuk layar atau tekan Spasi untuk memutar
        </p>
      )}
    </div>
  );
}
