// Animação do pipeline Pipefy → Power BI, usada na página do projeto.
// DrawSVG desenha a linha e MotionPath leva a bolinha pelo mesmo caminho.
import { gsap, reduce, NS } from '../core/env.js';

const PATH_D = 'M60 190 C200 40 330 40 360 190 S540 340 600 190 S780 40 840 190 S1020 340 1140 190';
const STEPS = ['Pipefy', 'Make', 'Graph', 'SharePoint', 'Power BI'];
const DURATION = 3.2;

export function pipelineMarkup() {
  return `<div class="detail__viz">
    <svg viewBox="0 0 1200 380" aria-hidden="true" style="display:block;width:100%;height:auto;overflow:visible">
      <path id="pipePath" class="pipe-base" d="${PATH_D}"/>
      <path id="pipeLive" class="pipe-live" d="${PATH_D}"/>
      <g id="pipeNodes"></g>
      <circle id="token" class="token" r="13" cx="60" cy="190"/>
    </svg>
    <div class="viz__foot">
      <div class="viz__saved"><span id="savedNum">7,5</span> h<small>de trabalho manual a menos por mês</small></div>
      <button type="button" class="viz__replay" id="vizReplay">Rodar de novo</button>
    </div>
  </div>`;
}

// Monta os nós em cima do caminho e devolve uma timeline pausada (quem abre a página decide quando tocar).
export function buildPipeline() {
  const path = document.getElementById('pipePath');
  const length = path.getTotalLength();
  const group = document.getElementById('pipeNodes');
  const fractions = STEPS.map((_, i) => i / (STEPS.length - 1)); // 0, .25, .5, .75, 1

  const nodes = fractions.map((f, i) => {
    const p = path.getPointAtLength(f * length);
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'pnode');
    g.innerHTML = `<circle cx="${p.x}" cy="${p.y}" r="22"></circle><text x="${p.x}" y="${i % 2 === 0 ? p.y + 58 : p.y - 40}">${STEPS[i]}</text>`;
    group.appendChild(g);
    return g;
  });

  if (reduce) {
    nodes.forEach((n) => n.classList.add('is-on'));
    document.getElementById('token').style.opacity = 0;
    document.getElementById('vizReplay').remove();
    return null;
  }

  const tl = gsap.timeline({ paused: true, delay: 0.2 })
    .fromTo('#pipeLive', { drawSVG: '0%' }, { drawSVG: '100%', ease: 'none', duration: DURATION }, 0)
    .to('#token', { motionPath: { path: '#pipePath', align: '#pipePath', alignOrigin: [0.5, 0.5] }, ease: 'none', duration: DURATION }, 0)
    .to('#savedNum', { duration: 1, scrambleText: { text: '7,5', chars: '0123456789' } }, DURATION - 0.8);

  // Cada nó acende no momento em que a bolinha passa por ele.
  fractions.forEach((f, i) => tl.call(() => {
    nodes[i].classList.add('is-on');
    gsap.fromTo(nodes[i].querySelector('circle'), { attr: { r: 22 } }, { attr: { r: 30 }, duration: 0.2, yoyo: true, repeat: 1 });
  }, null, f * DURATION));

  document.getElementById('vizReplay').addEventListener('click', () => {
    nodes.forEach((n) => n.classList.remove('is-on'));
    tl.restart();
  });
  return tl;
}
