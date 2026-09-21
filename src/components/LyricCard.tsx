import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { animate } from "animejs";
import { AnimeCanvas } from "./AnimeCanvas";
import { LyricWord } from "./LyricWord";
import { DEFAULT_FADE, ms, PAST_OPACITY, THEME } from "../config/theme";
import type { Line } from "../types";

/* ---------- Card 3D satu baris: gambar anime + lirik ---------- */
export function LyricCard({
  line,
  index,
  time,
  isCurrent,
}: {
  line: Line;
  index: number;
  time: number;
  isCurrent: boolean;
}) {
  const fromLeft = index % 2 === 0;
  const dir = fromLeft ? -1 : 1;
  const cardRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);
  const [imgOk, setImgOk] = useState(true);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    if (!mounted.current) {
      // Pertama muncul: melayang dari jauh (atas + samping), miring, lalu mendarat
      mounted.current = true;
      const end = isCurrent
        ? { z: 0, ry: -dir * 6, o: 1 }
        : { z: -90, ry: -dir * 14, o: PAST_OPACITY };
      animate(el, {
        opacity: [0, end.o],
        translateX: [dir * 90, 0],
        translateY: [-70, 0],
        translateZ: [-160, end.z],
        rotateX: [-12, 0],
        rotateY: [dir * 40, end.ry],
        filter: ["blur(6px)", "blur(0px)"],
        duration: ms(1300),
        ease: "outExpo",
      });
      // Gambar anime "pop" menyusul sedikit kemudian
      if (artRef.current) {
        animate(artRef.current, {
          opacity: [0, 1],
          scale: [0.5, 1],
          rotate: [dir * -10, 0],
          duration: ms(1100),
          delay: ms(300),
          ease: "outBack",
        });
      }
      return;
    }

    if (!isCurrent) {
      // Sudah lewat: mundur ke belakang, lebih miring, meredup
      animate(el, {
        translateZ: [0, -90],
        rotateY: [-dir * 6, -dir * 14],
        opacity: [1, PAST_OPACITY],
        duration: ms(900),
        ease: "outCubic",
      });
    }
  }, [isCurrent, dir]);

  const accent: CSSProperties = fromLeft
    ? { borderLeft: `3px solid ${THEME.fresh}` }
    : { borderRight: `3px solid ${THEME.fresh}` };

  return (
    <div
      className={`max-w-[92%] md:max-w-[72%] ${
        fromLeft ? "self-start" : "self-end"
      }`}
      style={{ perspective: "1100px" }}
    >
      <div
        ref={cardRef}
        className={`relative overflow-hidden rounded-2xl px-4 py-4 md:px-6 md:py-5 ${
          isCurrent ? "card-now" : ""
        }`}
        style={{
          opacity: 0,
          background: "rgba(242, 233, 219, 0.045)",
          border: "1px solid rgba(242, 233, 219, 0.1)",
          boxShadow: "0 20px 40px -20px rgba(0,0,0,.6)",
          ...accent,
        }}
      >
        <span className="shine" aria-hidden />
        <div
          className={`relative flex gap-4 md:gap-6 ${
            fromLeft ? "flex-row" : "flex-row-reverse"
          }`}
        >
          {/* Gambar khusus baris ini — kalau kosong/gagal dimuat, pakai lukisan canvas */}
          <div
            ref={artRef}
            className="relative w-24 shrink-0 self-stretch overflow-hidden rounded-xl md:w-44"
            style={{
              minHeight: 130,
              opacity: 0,
              boxShadow:
                "0 12px 30px -10px rgba(0,0,0,.7), inset 0 0 0 1px rgba(255,255,255,.14)",
            }}
          >
            {line.image && imgOk ? (
              <>
                <img
                  src={line.image}
                  alt=""
                  onError={() => setImgOk(false)}
                  className="kb absolute inset-0 h-full w-full object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.4) 100%)",
                  }}
                />
              </>
            ) : (
              <AnimeCanvas
                scene={line.scene}
                seed={line.seed}
                active={isCurrent}
              />
            )}
          </div>

          <p
            className={`flex flex-1 flex-wrap content-center gap-x-[0.25em] text-2xl leading-[1.15] tracking-[-0.01em] md:text-4xl ${
              fromLeft ? "justify-start text-left" : "justify-end text-right"
            }`}
            style={{ fontFamily: THEME.font }}
            aria-label={line.text}
          >
            {line.words.map((w, i) => (
              <LyricWord
                key={i}
                word={w.text}
                fade={w.fade ?? DEFAULT_FADE}
                visible={time >= w.start}
              />
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}
