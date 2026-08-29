export function initReveal({ ScrollTrigger, reducedMotion }) {
  const reduzido = reducedMotion;
if (!reduzido) {
    var lista = document.querySelector('.dor__lista');
    if (lista) {
      ScrollTrigger.create({
        trigger: lista,
        start: 'top 88%',
        once: true,
        onEnter: function () { lista.setAttribute('data-revelado', ''); }
      });
    }
  }
}
