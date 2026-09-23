// Ponto de entrada. Cada import é uma funcionalidade isolada em js/features/.
// A ordem importa: plugins → rolagem → resto.
import { registerPlugins } from './core/env.js';
import { initSmoothScroll, refreshOnLoad } from './core/scroll.js';
import { initProgress } from './features/progress.js';
import { initMenu, isMenuOpen, closeMenu } from './features/menu.js';
import { initMagnetic } from './features/magnetic.js';
import { initHero } from './features/hero.js';
import { initReveals } from './features/reveals.js';
import { initMap } from './features/map.js';
import { initCards } from './features/cards.js';
import { initStack } from './features/stack.js';
import { initMarquee } from './features/marquee.js';
import { initExperience } from './features/experience.js';
import { initProjects, isProjectOpen, closeProject } from './features/projects.js';
import { initContact } from './features/contact.js';

registerPlugins();
initSmoothScroll();
initProgress();
initMenu();
initMagnetic();
initHero();
initReveals();
initMap();
initCards();
initStack();
initMarquee();
initExperience();
initProjects();
initContact();
refreshOnLoad();

// Esc fecha o que estiver aberto por cima da página.
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (isProjectOpen()) closeProject();
  else if (isMenuOpen()) closeMenu();
});
