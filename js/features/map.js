// Mapa arrastável do topo da página: cada bloco é um nó SVG, e as linhas se redesenham ao arrastar.
import { gsap, hasGsap, reduce, NS } from '../core/env.js';
import { showDragLabelOn } from './cursor.js';

const NODES = [
  { id: 'me', center: true, label: 'Laécio', x: 310, y: 235 },
  { id: 'java', label: 'Java', x: 100, y: 110 },
  { id: 'ia', label: 'IA', x: 310, y: 50 },
  { id: 'auto', label: 'Automação', x: 515, y: 110 },
  { id: 'cloud', label: 'Cloud', x: 515, y: 360 },
  { id: 'devops', label: 'DevOps', x: 310, y: 425 },
  { id: 'spring', label: 'Spring', x: 100, y: 360 },
];
// Todo nó se liga ao centro.
const EDGES = NODES.slice(1).map((n) => ['me', n.id]);

const nodeEls = {};
const edgeEls = [];
const packetEls = [];

function el(tag, attrs) {
  const node = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function build() {
  const gNodes = document.getElementById('nodes');
  const gEdges = document.getElementById('edges');
  const gPackets = document.getElementById('packets');

  NODES.forEach((n) => {
    const g = el('g', { class: n.center ? 'node node--center' : 'node' });
    const w = Math.max(120, n.label.length * 9 + 40);
    const shape = n.center
      ? el('circle', { r: 50, class: 'shape' })
      : el('rect', { x: -w / 2, y: -28, width: w, height: 56, rx: 28, class: 'shape' });
    const text = el('text', { 'text-anchor': 'middle', y: n.center ? 6 : 5 });
    text.textContent = n.label;
    g.append(shape, text);
    gNodes.appendChild(g);
    nodeEls[n.id] = g;
    gsap.set(g, { x: n.x, y: n.y });
  });

  EDGES.forEach(() => {
    edgeEls.push(gEdges.appendChild(el('path', { class: 'edge' })));
    packetEls.push(gPackets.appendChild(el('circle', { class: 'packet', r: 5, opacity: 0 })));
  });
}

const pos = (id) => [gsap.getProperty(nodeEls[id], 'x'), gsap.getProperty(nodeEls[id], 'y')];

// Curva de Bézier entre dois nós: sai na horizontal e chega na horizontal.
function updateEdges() {
  EDGES.forEach(([a, b], i) => {
    const [x1, y1] = pos(a), [x2, y2] = pos(b), mx = (x1 + x2) / 2;
    edgeEls[i].setAttribute('d', `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`);
  });
}

// Pontinhos que correm pelas linhas. Lemos o caminho a cada quadro
// porque a linha muda de forma enquanto o bloco é arrastado.
function startPackets() {
  edgeEls.forEach((path, i) => {
    const o = { t: 0 }, dot = packetEls[i];
    gsap.to(o, {
      t: 1, duration: 1.6, ease: 'none', repeat: -1, delay: i * 0.27,
      onStart: () => gsap.set(dot, { opacity: 1 }),
      onUpdate() {
        const p = path.getPointAtLength(o.t * path.getTotalLength());
        dot.setAttribute('cx', p.x); dot.setAttribute('cy', p.y);
      },
    });
  });
  if (!reduce) gsap.to(nodeEls.me.querySelector('.shape'), { attr: { r: 56 }, duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
}

export function initMap() {
  if (!hasGsap) return;
  build();
  updateEdges();

  Draggable.create(Object.values(nodeEls), {
    type: 'x,y', inertia: true,
    bounds: { minX: 40, maxX: 560, minY: 30, maxY: 450 },
    onPress() { gsap.to(this.target, { scale: 1.08, duration: 0.2 }); },
    onRelease() { gsap.to(this.target, { scale: 1, duration: 0.5, ease: 'elastic.out(1,.5)' }); },
    onDrag: updateEdges,
    onThrowUpdate: updateEdges,
  });
  showDragLabelOn(Object.values(nodeEls));

  if (reduce) { startPackets(); return; }
  // Começa escondido; a entrada do topo chama revealMap() quando o loader sai.
  gsap.set(Object.values(nodeEls), { scale: 0, opacity: 0 });
  gsap.set(edgeEls, { drawSVG: 0 });
}

export function revealMap() {
  const [me, ...rest] = Object.values(nodeEls);
  if (!me) return gsap.timeline();
  return gsap.timeline()
    .to(me, { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(2)' })
    .to(rest, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2)', stagger: 0.07 }, '-=.3')
    .to(edgeEls, { drawSVG: '100%', duration: 0.6, ease: 'power2.inOut', stagger: 0.07 }, '-=.5')
    .add(startPackets);
}
