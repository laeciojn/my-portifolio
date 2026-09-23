// Cursor amarelo que segue o mouse e botões "magnéticos".
// Só roda com mouse (pointer: fine) e sem pedido de menos movimento.
import { gsap, reduce, finePointer } from '../core/env.js';

const enabled = finePointer && !reduce;
let cur, label;

export function initCursor() {
  if (!enabled) return;
  cur = document.querySelector('.cursor');
  label = cur.querySelector('span');
  const xTo = gsap.quickTo(cur, 'x', { duration: 0.35, ease: 'power3' });
  const yTo = gsap.quickTo(cur, 'y', { duration: 0.35, ease: 'power3' });
  window.addEventListener('pointermove', (e) => { xTo(e.clientX); yTo(e.clientY); });

  // Delegação: funciona também para links e botões criados depois (lista de projetos).
  document.addEventListener('pointerover', (e) => { if (e.target.closest('a, button')) gsap.to(cur, { scale: 3, opacity: 0.6, duration: 0.3 }); });
  document.addEventListener('pointerout', (e) => { if (e.target.closest('a, button')) gsap.to(cur, { scale: 1, opacity: 1, duration: 0.3 }); });

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

// Mostra o texto "arraste" no cursor quando ele passa sobre estes elementos.
export function showDragLabelOn(elements) {
  if (!enabled) return;
  elements.forEach((el) => {
    el.addEventListener('pointerenter', () => {
      gsap.to(cur, { width: 78, height: 30, marginLeft: -39, marginTop: -15, borderRadius: 15, duration: 0.3 });
      gsap.to(label, { opacity: 1, duration: 0.2, delay: 0.1 });
    });
    el.addEventListener('pointerleave', () => {
      gsap.to(label, { opacity: 0, duration: 0.1 });
      gsap.to(cur, { width: 14, height: 14, marginLeft: -7, marginTop: -7, borderRadius: 7, duration: 0.3 });
    });
  });
}
