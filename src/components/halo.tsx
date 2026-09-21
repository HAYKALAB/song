import { useEffect, useRef } from "react";
import { animate } from "animejs"; // npm i animejs  (v4)
import { ms, THEME } from "../config/theme";

/* ---------- Satu kata: dianimasikan anime.js saat gilirannya tiba ---------- */
export function LyricWord({
  word,
  visible,
  fade,
}: {
  word: string;
  visible: boolean;
  fade: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (visible) {
      // Muncul: fade + blur hilang
      animate(el, {
        opacity: [0, 1],
        filter: ["blur(10px)", "blur(0px)"],
        duration: ms(fade * 1000),
        ease: "outQuad",
      });
      // Pop: naik + membesar dengan sedikit memantul
      animate(el, {
        translateY: [14, 0],
        scale: [0.85, 1],
        duration: ms(fade * 1000 + 300),
        ease: "outBack",
      });
      // "Menyala" lalu tenang ke warna lirik
      animate(el, {
        color: [THEME.fresh, THEME.text],
        textShadow: [
          `0 0 28px ${THEME.freshGlow}`,
          "0 0 0px rgba(255,150,100,0)",
        ],
        duration: ms(1400),
        ease: "outQuad",
      });
    } else {
      el.style.opacity = "0";
    }
  }, [visible, fade]);

  return (
    <span
      ref={ref}
      className="inline-block"
      style={{ opacity: 0, color: THEME.text }}
    >
      {word}
    </span>
  );
}