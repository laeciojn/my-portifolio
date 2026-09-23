// Barra amarela no topo que mostra quanto da página já foi rolado.
import { gsap, hasGsap } from '../core/env.js';

export function initProgress() {
  if (!hasGsap) return;
  gsap.to('.progress', {
    scaleX: 1, ease: 'none',
    scrollTrigger: { trigger: document.body, start: 0, end: 'max', scrub: 0.3 },
  });
}
