export function initGallery({ gsap, ScrollTrigger }) {
var mmPilha = gsap.matchMedia();
  mmPilha.add({
    celular: '(prefers-reduced-motion: no-preference) and (max-width: 47.999rem)',
    amplo:   '(prefers-reduced-motion: no-preference) and (min-width: 48rem)'
  }, function (contexto) {
    var pilha = document.querySelector('.album__grade');
    if (!pilha) return;
    var celular = contexto.conditions.celular;
    var todasProvas = Array.prototype.slice.call(pilha.children);

    var provas = celular ? todasProvas.slice(0, 6) : todasProvas;
    if (provas.length < 2) return;

    pilha.classList.add('album__grade--pilha');


    var largura = 0, telaW = 0;
    function medirPilha() {
      largura = pilha.getBoundingClientRect().width;
      telaW   = window.innerWidth;
    }
    medirPilha();
    ScrollTrigger.addEventListener('refreshInit', medirPilha);


    var VEL_MIN = 1.0;
    var VEL_MAX = celular ? 2.4 : 2.2;




    var TORTO     = [    -4,      7,     -6,      5,     -8,      9,     -5];





    var RAIO = celular ? 0.95 : 1.35;


    var ALTURA_ORBITA = celular ? 0.6 : 1;


    var DESLOCAMENTO_VERTICAL = celular ? 0.2 : 0;


    var APICE = celular ? 0.15 : 0.64;


    var ESCALA_MIN = 0.95;
    var ESCALA_MAX = 1.15;




    var linha = gsap.timeline({
      scrollTrigger: {
        trigger: pilha,
        start: celular ? 'center 135%' : 'center 127%',
        end:   celular ? 'bottom -85%'  : 'bottom -125%',
        scrub: 0.1
      }
    });


    var FOLGA_FORA = 0.15;


    var corrente = { p: 0 };


    provas.forEach(function (prova, i) {
      gsap.set(prova, { zIndex: provas.length - i });
    });



    function posicionar() {
      var u = corrente.p;


      var K = telaW / 2 / largura + ESCALA_MAX / 2 + FOLGA_FORA;
      var raio = Math.max(RAIO, (K - APICE) / 2);

      for (var i = 0; i < provas.length; i++) {

        var t = u * (VEL_MIN + (VEL_MAX - VEL_MIN) * i / (provas.length - 1));
        if (t < 0) { t = 0; } else if (t > 1) { t = 1; }


        var ang = 2 * Math.PI * t;
        var cosAng = Math.cos(ang);


        var perto = (1 - cosAng) / 2;

        gsap.set(provas[i], {
          x: (APICE + (1 + cosAng) * raio) * largura,
          y: (Math.sin(ang) * raio * ALTURA_ORBITA + DESLOCAMENTO_VERTICAL) * largura,
          rotation: TORTO[i % TORTO.length],
          scale: ESCALA_MIN + (ESCALA_MAX - ESCALA_MIN) * perto
        });
      }
    }
    posicionar();

    linha.to(corrente, {
      p: 1,
      duration: 1,
      ease: 'none',
      onUpdate: posicionar
    }, 0);


    return function () {
      ScrollTrigger.removeEventListener('refreshInit', medirPilha);
    };
  });
}
