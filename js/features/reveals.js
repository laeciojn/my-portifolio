// Animações de entrada ligadas ao scroll: títulos, frase grande e textos do Sobre.
import { gsap, reduce } from '../core/env.js';

export function initReveals() {
  if (reduce) return;

  // Transição entre seções: o conteúdo sobe e aparece enquanto a seção entra na tela (preso ao scroll).
  document.querySelectorAll('main > section:not(.hero)').forEach((sec) => {
    gsap.fromTo(sec.querySelector('.wrap'), { y: 90, opacity: 0.35, scale: 0.97 }, {
      y: 0, opacity: 1, scale: 1, ease: 'power1.out',
      scrollTrigger: { trigger: sec, start: 'top bottom', end: 'top 50%', scrub: 0.6 },
    });
  });

  // Títulos: cada linha sobe de trás de uma máscara.
  document.querySelectorAll('.reveal').forEach((h) => SplitText.create(h, {
    type: 'lines', mask: 'lines', autoSplit: true,
    onSplit: (self) => gsap.from(self.lines, { yPercent: 105, duration: 1, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: h, start: 'top 85%' } }),
  }));

  // Frase grande: as palavras acendem conforme a rolagem (scrub = preso ao scroll).
  document.querySelectorAll('.scrub-words').forEach((p) => {
    const { words } = new SplitText(p, { type: 'words', wordsClass: 'word' });
    gsap.fromTo(words, { opacity: 0.12 }, { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: p, start: 'top 80%', end: 'bottom 45%', scrub: true } });
  });

  gsap.from('.sobre__text > p', { y: 30, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1, scrollTrigger: { trigger: '.sobre__text', start: 'top 80%' } });
  gsap.from('.stat-card', { y: 40, opacity: 0, duration: 0.8, ease: 'back.out(1.6)', stagger: 0.08, scrollTrigger: { trigger: '.stat-grid', start: 'top 85%' } });
  gsap.from('.edu, .award, .formacao__grid > div:last-child > *', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.06, scrollTrigger: { trigger: '.formacao__grid', start: 'top 80%' } });
  gsap.from('.repos__list li', { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.04, scrollTrigger: { trigger: '.repos__list', start: 'top 85%' } });
  gsap.from('.job', { x: -40, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.07, scrollTrigger: { trigger: '#expList', start: 'top 85%' } });
}
