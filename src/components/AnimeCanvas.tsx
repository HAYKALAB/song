import { useEffect, useRef } from "react";
import { makePainter } from "../art/painters";
import { REDUCED_MOTION } from "../config/theme";
import type { SceneName } from "../types";

/* ---------- Kanvas lukisan anime (dipakai card & latar penuh layar) ---------- */
export function AnimeCanvas({
  scene,
  seed,
  active,
  big = false,
}: {
  scene: SceneName;
  seed: number;
  active: boolean;
  big?: boolean;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!box || !canvas || !ctx) return;

    const paint = makePainter(scene, seed, big);
    const start = performance.now();
    let w = 0;
    let h = 0;

    const render = (now: number) => {
      if (w < 2 || h < 2) return;
      paint(ctx, w, h, (now - start) / 1000);
    };

    const resize = () => {
      const dpr = big ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      w = box.clientWidth;
      h = box.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      render(performance.now());
    };
    const ro = new ResizeObserver(resize);
    ro.observe(box);

    let raf = 0;
    const loop = (now: number) => {
      if (activeRef.current && !REDUCED_MOTION) render(now);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [scene, seed, big]);

  return (
    <div ref={boxRef} className="absolute inset-0">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
