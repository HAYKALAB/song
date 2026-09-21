import { useEffect, useState } from "react";
import { AnimeCanvas } from "./AnimeCanvas";
import { BACKGROUND_IMAGE, BG_DIM } from "../config/theme";
import type { SceneName } from "../types";

type Slot = { scene: SceneName; seed: number; id: number };

/* ---------- Gambar latar penuh layar (foto sendiri atau canvas anime) ----------
 * Latarnya ikut baris yang sedang aktif: tiap baris punya scene + seed
 * sendiri, jadi pemandangan di belakang juga ganti terus, tidak mengulang.
 * Dua lapis dipakai bergantian supaya pergantiannya halus (crossfade).
 * -------------------------------------------------------------------------- */
export function BackgroundArt({
  scene,
  seed,
}: {
  scene: SceneName;
  seed: number;
}) {
  const [imgOk, setImgOk] = useState(true);
  const [slots, setSlots] = useState<Slot[]>([{ scene, seed, id: 0 }]);

  useEffect(() => {
    setSlots((prev) => {
      const last = prev[prev.length - 1];
      if (last.scene === scene && last.seed === seed) return prev;
      // simpan lapisan lama satu saja, lalu tumpuk yang baru di atasnya
      return [...prev.slice(-1), { scene, seed, id: last.id + 1 }];
    });
  }, [scene, seed]);

  const topId = slots[slots.length - 1].id;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {BACKGROUND_IMAGE && imgOk ? (
        <img
          src={BACKGROUND_IMAGE}
          alt=""
          onError={() => setImgOk(false)}
          className="bg-kb absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        slots.map((s) => (
          <div
            key={s.id}
            className="absolute inset-0"
            style={{
              opacity: s.id === topId ? 1 : 0,
              transition: "opacity 1.4s ease-in-out",
            }}
          >
            <AnimeCanvas
              scene={s.scene}
              seed={s.seed + 1000}
              active={s.id === topId}
              big
            />
          </div>
        ))
      )}

      {/* Digelapkan + vignette supaya lirik tetap terbaca */}
      <div
        className="absolute inset-0"
        style={{ background: `rgba(10,8,7,${BG_DIM})` }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,.55) 100%)",
        }}
      />
    </div>
  );
}
