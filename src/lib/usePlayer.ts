import { useEffect, useRef, useState } from "react";

/**
 * Jam pemutar = audio.currentTime, dibaca tiap frame.
 * Karena sumbernya audio itu sendiri, lirik tidak bisa melenceng.
 *
 * Kontrol keyboard: Spasi = putar/jeda · ← / → = geser lirik -/+ 0.25 detik
 */
export function usePlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const offsetRef = useRef(0);
  const [offset, setOffset] = useState(0);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (audioRef.current) setTime(audioRef.current.currentTime);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const a = audioRef.current;
      if (!a) return;
      if (e.code === "Space") {
        e.preventDefault();
        if (a.paused) void a.play();
        else a.pause();
      } else if (e.code === "ArrowRight" || e.code === "ArrowLeft") {
        const dir = e.code === "ArrowRight" ? 1 : -1;
        offsetRef.current = Number((offsetRef.current + dir * 0.25).toFixed(2));
        setOffset(offsetRef.current);
        console.log(`Geser tambahan: ${offsetRef.current} detik`);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) void a.play();
    else a.pause();
  };

  return { audioRef, time, offset, playing, setPlaying, toggle };
}
