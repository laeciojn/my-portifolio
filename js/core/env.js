// Ambiente: o GSAP carregou? O usuário pediu menos movimento? Tem mouse?
// Todos os módulos leem estas flags em vez de repetir as verificações.
export const gsap = window.gsap;
export const hasGsap = !!gsap;
export const reduce = !hasGsap || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = window.matchMedia('(pointer: fine)').matches;
export const NS = 'http://www.w3.org/2000/svg';

export function registerPlugins() {
  if (!hasGsap) return;
  gsap.registerPlugin(
    ScrollTrigger, ScrollSmoother, SplitText, ScrambleTextPlugin,
    DrawSVGPlugin, MotionPathPlugin, Flip, Draggable, InertiaPlugin
  );
}
