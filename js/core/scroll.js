// Rolagem suave (ScrollSmoother) e navegação por âncoras.
// O menu e a página de projeto precisam pausar a rolagem do fundo, por isso tudo passa por aqui.
import { hasGsap, reduce } from './env.js';

let smoother = null;

export function initSmoothScroll() {
  if (!hasGsap || reduce) return;
  smoother = ScrollSmoother.create({
    wrapper: '#smooth-wrapper',
    content: '#smooth-content',
    smooth: 0.8,
    ease: 'power3',
    effects: true,
    smoothTouch: 0,
  });
}

export function goTo(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  if (smoother) smoother.scrollTo(el, true, 'top top');
  else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
}

export function pauseScroll(paused) {
  if (smoother) smoother.paused(paused);
}

export function refreshOnLoad() {
  if (!hasGsap) return;
  window.addEventListener('load', () => ScrollTrigger.refresh());
  if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
}
