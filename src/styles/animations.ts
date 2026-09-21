/* =====================================================================
 *  Animasi CSS ringan
 *  (cahaya latar, denyut card, kilau, equalizer, zoom foto)
 * ===================================================================== */

export const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');

@keyframes orbDrift {
  from { transform: translate3d(-9vw, 5vh, 0) scale(1); }
  to   { transform: translate3d(9vw, -7vh, 0) scale(1.18); }
}
@keyframes cardPulse {
  from { box-shadow: 0 30px 60px -20px rgba(0,0,0,.7), 0 0 30px rgba(255,150,100,.10); }
  to   { box-shadow: 0 30px 60px -20px rgba(0,0,0,.7), 0 0 64px rgba(255,150,100,.30); }
}
@keyframes shine {
  from { transform: translateX(-120%); }
  to   { transform: translateX(120%); }
}
@keyframes eq {
  from { transform: scaleY(.25); }
  to   { transform: scaleY(1); }
}
@keyframes kenburns {
  from { transform: scale(1.04) translate(0, 0); }
  to   { transform: scale(1.16) translate(-2%, -2%); }
}

.orb { position: absolute; border-radius: 9999px; filter: blur(48px); pointer-events: none; }
.shine {
  position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,.14) 50%, transparent 65%);
  transform: translateX(-120%);
}
.eq-bar { width: 3px; height: 100%; border-radius: 2px; transform-origin: bottom; opacity: .55; transform: scaleY(.4); }
.kb { transform: scale(1.04); }
.bg-kb { transform: scale(1.04); }

@media (prefers-reduced-motion: no-preference) {
  .orb-a    { animation: orbDrift 19s ease-in-out infinite alternate; }
  .orb-b    { animation: orbDrift 27s ease-in-out infinite alternate-reverse; }
  .card-now { animation: cardPulse 3.2s ease-in-out infinite alternate; }
  .shine    { animation: shine 1.2s .35s ease-out forwards; }
  .eq-bar   { animation: eq .9s ease-in-out infinite alternate; }
  .card-now .kb { animation: kenburns 9s ease-in-out infinite alternate; }
  .bg-kb { animation: kenburns 24s ease-in-out infinite alternate; }
}
`;
