// Projetos: gera a lista a partir de data/projects.js e abre cada um numa "página" própria,
// que se expande a partir da linha clicada. O endereço muda para #projeto/slug.
import { gsap, hasGsap, reduce } from '../core/env.js';
import { pauseScroll } from '../core/scroll.js';
import { PROJECTS } from '../data/projects.js';
import { pipelineMarkup, buildPipeline } from './pipeline-viz.js';

const list = document.getElementById('plist');
const detail = document.getElementById('detail');
const inner = document.getElementById('detailInner');
const backBtn = document.getElementById('detailBack');

let current = -1;
let vizTl = null;

const num = (i) => `_${String(i + 1).padStart(2, '0')}.`;
const rows = () => list.querySelectorAll('.prow');
export const isProjectOpen = () => detail.classList.contains('is-open');

function renderList() {
  list.innerHTML = PROJECTS.map((p, i) => `
    <button type="button" class="prow" data-index="${i}" aria-label="Abrir projeto ${p.name}">
      <span class="prow__fill" aria-hidden="true"></span>
      <span class="prow__num">${num(i)}</span>
      <span class="prow__name">${p.name}</span>
      <ul class="tags">${p.tags.map((t) => `<li>${t}</li>`).join('')}</ul>
      <span class="prow__go" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M7 17 17 7M9 7h8v8"/></svg></span>
    </button>`).join('');
}

function renderDetail(i) {
  const p = PROJECTS[i];
  vizTl?.kill();
  vizTl = null;
  inner.innerHTML = `
    <div class="detail__num">${num(i)}</div>
    <h2 class="detail__title" id="detailTitle">${p.name}</h2>
    <span class="detail__status">${p.status}</span>
    <p class="detail__summary">${p.summary}</p>
    ${p.viz ? pipelineMarkup() : ''}
    ${p.cols.length ? `<div class="detail__cols">${p.cols.map(([h, items]) => `<div><h3>${h}</h3><ul>${items.map((t) => `<li>${t}</li>`).join('')}</ul></div>`).join('')}</div>` : ''}
    ${p.stack.length ? `<ul class="tags" style="margin-top:40px">${p.stack.map((t) => `<li>${t}</li>`).join('')}</ul>` : ''}
    <div class="detail__links">
      ${p.link ? `<a class="btn btn--solid" href="${p.link}" target="_blank" rel="noopener">Ver repositório</a>` : ''}
      <a class="btn btn--ghost" href="https://github.com/laeciojn" target="_blank" rel="noopener">Meu GitHub</a>
    </div>`;
  detail.scrollTop = 0;
  if (p.viz) vizTl = buildPipeline();
}

// clip-path "inset" recorta a tela no tamanho da linha; animar até 0 faz a página crescer a partir dela.
const insetOf = (row) => {
  const r = row.getBoundingClientRect();
  return `inset(${Math.max(0, r.top)}px 0px ${Math.max(0, window.innerHeight - r.bottom)}px 0px)`;
};

function openProject(i) {
  const wasOpen = isProjectOpen();
  current = i;
  renderDetail(i);
  detail.classList.add('is-open');
  pauseScroll(true);
  try { history.replaceState(null, '', `#projeto/${PROJECTS[i].slug}`); } catch (e) { /* sem histórico no iframe */ }
  backBtn.focus();
  if (reduce) return;

  if (!wasOpen) {
    gsap.fromTo(detail, { clipPath: insetOf(rows()[i]) }, { clipPath: 'inset(0px 0px 0px 0px)', duration: 0.85, ease: 'expo.inOut', onComplete: () => vizTl?.play(0) });
  } else {
    vizTl?.play(0);
  }
  const delay = wasOpen ? 0 : 0.45;
  const { chars } = new SplitText(inner.querySelector('.detail__title'), { type: 'chars', mask: 'chars' });
  gsap.from(chars, { yPercent: 110, duration: 0.9, ease: 'expo.out', stagger: 0.02, delay });
  gsap.from(inner.querySelectorAll('.detail__status, .detail__summary, .detail__viz, .detail__cols > div, .detail__links'), { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.07, delay: delay + 0.15 });
}

export function closeProject() {
  const done = () => {
    detail.classList.remove('is-open');
    if (hasGsap) gsap.set(detail, { clearProps: 'clipPath' });
    pauseScroll(false);
    vizTl?.kill();
    vizTl = null;
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* idem */ }
    rows()[current]?.focus();
  };
  if (reduce) return done();
  gsap.to(detail, { clipPath: insetOf(rows()[current]), duration: 0.6, ease: 'expo.inOut', onComplete: done });
}

function hoverFill(row) {
  const fill = row.querySelector('.prow__fill');
  const set = (e, v) => {
    const fromTop = e ? e.offsetY < row.offsetHeight / 2 : false;
    gsap.set(fill, { transformOrigin: fromTop ? '50% 0%' : '50% 100%' });
    gsap.to(fill, { scaleY: v, duration: 0.45, ease: 'expo.out' });
  };
  row.addEventListener('pointerenter', (e) => set(e, 1));
  row.addEventListener('pointerleave', (e) => set(e, 0));
  row.addEventListener('focus', () => set(null, 1));
  row.addEventListener('blur', () => set(null, 0));
}

export function initProjects() {
  renderList();

  list.addEventListener('click', (e) => {
    const row = e.target.closest('.prow');
    if (row) openProject(+row.dataset.index);
  });
  backBtn.addEventListener('click', closeProject);
  document.getElementById('detailPrev').addEventListener('click', () => openProject((current - 1 + PROJECTS.length) % PROJECTS.length));
  document.getElementById('detailNext').addEventListener('click', () => openProject((current + 1) % PROJECTS.length));

  if (hasGsap) {
    rows().forEach((row) => {
      hoverFill(row);
      if (!reduce) gsap.from(row.querySelectorAll('.prow__num, .prow__name, .tags'), { y: 40, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: row, start: 'top 92%' } });
    });
  }

  // Link direto para um projeto (ex.: .../#projeto/taskflow-api) abre a página dele.
  const match = location.hash.match(/^#projeto\/(.+)$/);
  const idx = match ? PROJECTS.findIndex((p) => p.slug === match[1]) : -1;
  if (idx >= 0) setTimeout(() => openProject(idx), reduce ? 0 : 2200);
}
