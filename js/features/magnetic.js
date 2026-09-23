// Botões "magnéticos": seguem um pouco o mouse e voltam com efeito elástico.
// Só roda com mouse (pointer: fine) e sem pedido de menos movimento.
import { gsap, reduce, finePointer } from '../core/env.js';

export function initMagnetic() {
  if (!finePointer || reduce) return;
  document.querySelectorAll('.magnetic').forEach((btn) => {
    const bx = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'elastic.out(1,.4)' });
    const by = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'elastic.out(1,.4)' });
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      bx((e.clientX - r.left - r.width / 2) * 0.35);
      by((e.clientY - r.top - r.height / 2) * 0.45);
    });
    btn.addEventListener('pointerleave', () => { bx(0); by(0); });
  });
}
