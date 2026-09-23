// Cartões de "O que eu faço": entram girando, desenham o ícone e inclinam em 3D com o mouse.
import { gsap, reduce, finePointer } from '../core/env.js';

export function initCards() {
  if (reduce) return;
  gsap.utils.toArray('.card').forEach((card, i) => {
    const st = { trigger: '.cards', start: 'top 85%' };
    gsap.from(card, { y: 80, rotateX: -25, transformPerspective: 900, opacity: 0, duration: 1, delay: i * 0.08, ease: 'expo.out', scrollTrigger: st });
    gsap.from(card.querySelectorAll('.draw'), { drawSVG: 0, duration: 1.2, ease: 'power2.inOut', stagger: 0.1, delay: 0.3 + i * 0.08, scrollTrigger: st });

    if (!finePointer) return;
    gsap.set(card, { transformPerspective: 900 });
    const rx = gsap.quickTo(card, 'rotateX', { duration: 0.5, ease: 'power3' });
    const ry = gsap.quickTo(card, 'rotateY', { duration: 0.5, ease: 'power3' });
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height; // 0 a 1
      ry((px - 0.5) * 18); rx((0.5 - py) * 14);
      card.style.setProperty('--gx', `${px * 100}%`);
      card.style.setProperty('--gy', `${py * 100}%`);
    });
    card.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });
}
