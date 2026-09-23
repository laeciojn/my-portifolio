// Menu em tela cheia: abre em círculo a partir do botão e fecha com Esc.
import { gsap, hasGsap, reduce } from '../core/env.js';
import { goTo, pauseScroll } from '../core/scroll.js';

const menu = document.getElementById('menu');
const openBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('menuClose');
let tl = null;

export const isMenuOpen = () => menu.classList.contains('is-open');

function open() {
  menu.classList.add('is-open');
  openBtn.setAttribute('aria-expanded', 'true');
  pauseScroll(true);
  if (!reduce) {
    const r = openBtn.getBoundingClientRect();
    const at = `${r.left + r.width / 2}px ${r.top + r.height / 2}px`;
    tl = gsap.timeline()
      .fromTo(menu, { clipPath: `circle(0px at ${at})` }, { clipPath: `circle(150% at ${at})`, duration: 0.8, ease: 'expo.inOut' })
      .from('.menu__main a span', { yPercent: 110, duration: 0.7, ease: 'expo.out', stagger: 0.06 }, '-=.35')
      .from('.menu__small li, .menu__col h2', { opacity: 0, y: 14, duration: 0.4, stagger: 0.04 }, '-=.5');
  }
  closeBtn.focus();
}

export function closeMenu(after) {
  const done = () => {
    menu.classList.remove('is-open');
    openBtn.setAttribute('aria-expanded', 'false');
    pauseScroll(false);
    if (hasGsap) gsap.set(menu, { clearProps: 'clipPath' });
    openBtn.focus();
    after?.();
  };
  if (!reduce && tl) { tl.eventCallback('onReverseComplete', done); tl.timeScale(1.6).reverse(); }
  else done();
}

export function initMenu() {
  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', () => closeMenu());

  // Todos os links internos (menu, logo, botões) usam a rolagem suave.
  document.querySelectorAll('[data-scroll]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    const target = a.getAttribute('href');
    if (isMenuOpen()) closeMenu(() => goTo(target));
    else goTo(target);
  }));
  document.getElementById('toTop').addEventListener('click', () => goTo('#inicio'));
}
