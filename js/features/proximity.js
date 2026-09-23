// Letras que mudam de peso e sobem quando o mouse chega perto.
// Funciona porque a fonte é variável: o peso vai de 200 a 800 sem trocar de arquivo.
import { gsap, reduce, finePointer } from '../core/env.js';

export function splitChars(el) {
  return new SplitText(el, { type: 'chars', charsClass: 'char' }).chars;
}

export function enableProximity(area, chars, { base = 780, radius = 260, lift = -12 } = {}) {
  if (!finePointer || reduce || !area) return;
  const setters = chars.map((c) => ({
    c,
    weight: gsap.quickTo(c, 'fontWeight', { duration: 0.5, ease: 'power3' }),
    y: gsap.quickTo(c, 'y', { duration: 0.6, ease: 'power3' }),
  }));
  area.addEventListener('pointermove', (e) => {
    setters.forEach((s) => {
      const r = s.c.getBoundingClientRect();
      const dist = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
      const f = Math.max(0, 1 - dist / radius); // 1 = mouse em cima, 0 = longe
      s.weight(Math.max(200, base - 540 * f));
      s.y(lift * f);
    });
  });
  area.addEventListener('pointerleave', () => setters.forEach((s) => { s.weight(base); s.y(0); }));
}
