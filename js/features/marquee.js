// Faixa de tecnologias: rola sem parar, acelera com a velocidade do scroll e inverte o sentido.
import { gsap, reduce } from '../core/env.js';

export function initMarquee() {
  if (reduce) return;
  const row = document.getElementById('marqueeRow');
  if (!row) return;
  // Repetimos os itens até o grupo ser mais largo que a tela, para não sobrar vão no fim.
  const group = row.querySelector('.marquee__group');
  const items = [...group.children];
  for (let i = 0; i < 6 && group.offsetWidth && group.offsetWidth < window.innerWidth; i++) {
    items.forEach((it) => {
      const extra = it.cloneNode(true);
      extra.setAttribute('aria-hidden', 'true');
      group.appendChild(extra);
    });
  }
  // Duplicamos o grupo: ao chegar em -50%, a segunda cópia está exatamente onde a primeira começou.
  const copy = group.cloneNode(true);
  copy.setAttribute('aria-hidden', 'true');
  row.appendChild(copy);

  const loop = gsap.to(row, { xPercent: -50, duration: 16, ease: 'none', repeat: -1 });
  row.closest('.marquee').classList.add('marquee--gsap');
  // Só reage enquanto a faixa está na tela; fora dela, fica pausada.
  // Uma única animação de velocidade por vez: acelera e depois volta ao normal.
  ScrollTrigger.create({
    trigger: row.closest('.marquee'), start: 'top bottom', end: 'bottom top',
    onToggle: (self) => (self.isActive ? loop.resume() : loop.pause()),
    onUpdate(self) {
      const speed = 1 + Math.min(Math.abs(self.getVelocity()) / 300, 6);
      gsap.to(loop, {
        timeScale: self.direction * speed, duration: 0.2, overwrite: true,
        onComplete: () => gsap.to(loop, { timeScale: self.direction, duration: 1.2, delay: 0.25, overwrite: true }),
      });
    },
  });
}
