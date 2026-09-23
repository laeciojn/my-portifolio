// Contato: botão de copiar e entrada da seção.
import { gsap, reduce } from '../core/env.js';

const EMAIL = 'laeciojesusn@gmail.com';

export function initContact() {
  const note = document.getElementById('copyNote');
  document.getElementById('copyMail').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(EMAIL); note.textContent = 'E-mail copiado.'; }
    catch (e) { note.textContent = `Não deu para copiar automaticamente. O e-mail é ${EMAIL}.`; }
  });

  if (reduce) return;
  gsap.from('.contato .kicker, .contato__q, .contato__lede, .contato__row, .status', { y: 40, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.contato', start: 'top 70%' } });
}
