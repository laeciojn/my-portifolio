// Stack: filtro por área (Flip anima a troca de posição) e ícones que giram.
import { gsap, hasGsap, reduce } from '../core/env.js';

export function initStack() {
  const groups = [...document.querySelectorAll('.group')];
  const buttons = document.querySelectorAll('.filters button');

  buttons.forEach((b) => b.addEventListener('click', () => {
    const filter = b.dataset.filter;
    buttons.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));

    // Flip: 1) guarda onde cada bloco está; 2) muda o layout; 3) anima do antigo para o novo.
    const state = hasGsap && !reduce ? Flip.getState(groups) : null;
    groups.forEach((g) => g.classList.toggle('is-hidden', !(filter === 'all' || g.dataset.cat === filter)));
    if (!state) return;
    Flip.from(state, {
      duration: 0.65, ease: 'power3.inOut', absolute: true, scale: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.8)' }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.8, duration: 0.35 }),
    });
  }));

  if (reduce) return;
  gsap.from(groups, { y: 60, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: '#groups', start: 'top 85%' } });
  gsap.from('.tech__logo', { rotateY: 180, transformPerspective: 600, opacity: 0, duration: 0.8, ease: 'back.out(1.6)', stagger: { each: 0.02, from: 'random' }, scrollTrigger: { trigger: '#groups', start: 'top 80%' } });
  document.querySelectorAll('.tech').forEach((t) => t.addEventListener('pointerenter', () => {
    gsap.fromTo(t.querySelector('.tech__logo'), { rotateY: 0 }, { rotateY: 360, transformPerspective: 600, duration: 0.7, ease: 'power3.out' });
  }));
}
