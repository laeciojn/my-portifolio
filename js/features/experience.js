// Experiência: cada linha abre e fecha (acordeão) e ganha um fundo azul que entra pelo lado do mouse.
import { gsap, hasGsap, reduce } from '../core/env.js';

function wipe(head, fill, show, e) {
  const fromTop = e ? e.offsetY < head.offsetHeight / 2 : false;
  gsap.set(fill, { transformOrigin: fromTop ? '50% 0%' : '50% 100%' });
  gsap.to(fill, { scaleY: show ? 1 : 0, duration: 0.4, ease: 'expo.out' });
}

export function initExperience() {
  document.querySelectorAll('.job').forEach((job) => {
    const head = job.querySelector('.job__head');
    const body = job.querySelector('.job__body');
    const fill = job.querySelector('.job__fill');

    head.addEventListener('click', () => {
      const open = !job.classList.contains('is-open');
      job.classList.toggle('is-open', open);
      head.setAttribute('aria-expanded', String(open));
      if (reduce) body.style.height = open ? 'auto' : '0px';
      else gsap.to(body, { height: open ? 'auto' : 0, duration: 0.55, ease: 'expo.out' });
    });

    if (!hasGsap) return;
    head.addEventListener('pointerenter', (e) => wipe(head, fill, true, e));
    head.addEventListener('pointerleave', (e) => wipe(head, fill, false, e));
    head.addEventListener('focus', () => wipe(head, fill, true));
    head.addEventListener('blur', () => wipe(head, fill, false));
  });
}
