// Loader (contador + nome embaralhado) e entrada do topo da página.
import { gsap, hasGsap, reduce } from '../core/env.js';
import { splitChars, enableProximity } from './proximity.js';
import { revealMap } from './map.js';

function intro(chars) {
  gsap.timeline()
    .from(chars, { yPercent: 110, rotate: 8, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.03 })
    .from('.hero__intro, .hero__cta .btn, .hero__loc', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1 }, '-=.6')
    .add(revealMap(), '-=.9');

  // Ao rolar, o topo sobe mais devagar e some: dá sensação de profundidade.
  gsap.to('.hero .wrap', { yPercent: 15, opacity: 0.3, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
}

// No topo azul o menu fica amarelo; depois volta ao modo que inverte a cor do fundo.
function barColor() {
  if (!hasGsap) return;
  ScrollTrigger.create({ trigger: '.hero', start: 'top top', end: 'bottom 60px', toggleClass: { targets: '.bar', className: 'on-hero' } });
}

export function initHero() {
  barColor();
  const loader = document.querySelector('.loader');
  if (reduce) { loader?.remove(); return; }

  const title = document.querySelector('.hero__title');
  const chars = [...title.querySelectorAll('[data-proximity]')].flatMap(splitChars);
  enableProximity(title, chars, { base: 780, radius: 260, lift: -12 });

  const counter = { v: 0 };
  const countEl = document.getElementById('loaderCount');
  gsap.timeline({ onComplete: () => loader.remove() })
    .to('#loaderName', { duration: 1.1, scrambleText: { text: 'Laécio Neves', chars: '01<>/{}', revealDelay: 0.3, speed: 0.6 } }, 0)
    .to(counter, { v: 100, duration: 1.3, ease: 'power2.inOut', onUpdate: () => { countEl.textContent = Math.round(counter.v); } }, 0)
    .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'expo.inOut' }, '+=.1')
    .add(() => intro(chars), '-=.45');
}
