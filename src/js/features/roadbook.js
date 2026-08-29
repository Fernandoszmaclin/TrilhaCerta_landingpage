export function initRoadbook({ gsap, ScrollTrigger, root }) {
  const raiz = root;
  // Layout metrics are cached outside the scroll callback to avoid transform feedback.
var mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', function () {
    var planilha = document.querySelector('.roteiro__janela');
    if (!planilha) return;

    var folhas  = gsap.utils.toArray('.folha');
    var contador = planilha.querySelector('[data-ref-ativa]');
    if (!folhas.length || !contador) return;


    var topo = planilha.querySelector('.planilha__topo');
    var FRACAO_LEITURA = 0.58;

    function linhaDeLeitura() {
      var piso = 0;

      if (getComputedStyle(topo).position === 'sticky') {

        piso = (parseFloat(getComputedStyle(topo).top) || 0) + topo.offsetHeight + 8;
      }

      return Math.round(Math.max(piso, window.innerHeight * FRACAO_LEITURA));
    }





    var animacoesTulipa = new WeakMap();
    var estilosRaiz = getComputedStyle(raiz);
    var duracaoEntradaTulipa = parseFloat(estilosRaiz.getPropertyValue('--dur-estado')) || 200;
    var easeEntradaTulipa = estilosRaiz.getPropertyValue('--ease-revelar').trim();

    function chegou(folha) {
      var tulipa = folha.querySelector('.folha__tulipa');
      if (!tulipa || typeof tulipa.animate !== 'function') { return; }


      var anterior = animacoesTulipa.get(tulipa);
      if (anterior) anterior.cancel();


      var par = folhas.indexOf(folha) % 2 === 1;
      var de = par ? 'translate3d(-8px, 0, 0) scale(0.96)'
                   : 'translate3d(0, -6px, 0) scale(0.96)';
      var animacao = tulipa.animate(
        [
          { transform: de, opacity: 0.55 },
          { transform: 'translate3d(0, 0, 0) scale(1)', opacity: 1 }
        ],
        {
          duration: duracaoEntradaTulipa,
          easing: easeEntradaTulipa,
          fill: 'none'
        }
      );

      animacoesTulipa.set(tulipa, animacao);
      animacao.onfinish = function () {
        if (animacoesTulipa.get(tulipa) === animacao) {
          animacoesTulipa.delete(tulipa);
        }
      };
    }


    function rolarContador(valor) {
      if (contador.textContent === valor) { return; }


      contador.textContent = valor;

      gsap.fromTo(contador,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: 'power3.out',
          overwrite: true, clearProps: 'transform,opacity' });
    }


    function alturaNoDocumento(el) {
      var y = 0;
      while (el) { y += el.offsetTop; el = el.offsetParent; }
      return y;
    }


    folhas.forEach(function (folha, i) {
      ScrollTrigger.create({
        trigger: folha,
        start:   function () { return alturaNoDocumento(folha) - linhaDeLeitura(); },
        end:     function () { return alturaNoDocumento(folha) + folha.offsetHeight - linhaDeLeitura(); },
        onToggle: function (self) {

          var descendo = self.direction === 1;
          var noTopo   = self.isActive ? descendo : !descendo;
          folha.style.setProperty('--sulco-origem', noTopo ? '0%' : '100%');

          folha.classList.toggle('folha--ativa', self.isActive);
          if (self.isActive) {
            rolarContador(folha.dataset.ref);
            chegou(folha);
          }
        }
      });
    });



    var tira = planilha.querySelector('.roteiro__tira');



    var DOBRA_LONGE = 66;
    var ANGULO_MAX  = 11;
    var RECUO       = 90;
    var VEU         = 0.42;
    var PERSPECTIVA = 1400;
    var PROFUNDIDADE_PROVA = 28;


    var ALCANCE     = 320;






    var SURGIR = 120;
    var ALCA   = 20;

    var caixas = [];
    var topoUtil = 0;

    function medirCaixas() {
      var celular = window.innerWidth < 768;

      DOBRA_LONGE = celular ? 120 : 66;
      ANGULO_MAX  = celular ? 14  : 11;
      RECUO       = celular ? 150 : 90;
      VEU         = celular ? 0.50 : 0.42;
      PERSPECTIVA = celular ? 1000 : 1400;
      PROFUNDIDADE_PROVA = celular ? 42 : 28;


      var barraPagina = parseFloat(getComputedStyle(document.documentElement)
                          .getPropertyValue('--altura-barra')) || 0;
      topoUtil = getComputedStyle(topo).position === 'sticky'
        ? (parseFloat(getComputedStyle(topo).top) || 0) + topo.offsetHeight
        : barraPagina;

      caixas = folhas.map(function (folha) {
        var t = alturaNoDocumento(folha);
        var alto = folha.offsetHeight;

        var corpo = folha.querySelector('.folha__corpo');
        var prova = folha.querySelector('.placa');

        return {
          topo: t,
          fundo: t + alto,

          angulo: Math.min(ANGULO_MAX,
                    Math.asin(Math.min(1, DOBRA_LONGE / alto)) * 180 / Math.PI),
          cabeca: gsap.utils.toArray(folha.querySelectorAll(
            '.folha__ref, .folha__tulipa, .folha__dia, .folha__etapa')),
          corpo: corpo,
          prova: prova
        };
      });
    }


    function suavizar(v) {
      if (v <= 0) { return 0; }
      if (v >= 1) { return 1; }
      return v * v * (3 - 2 * v);
    }



    var grausEmRad = Math.PI / 180;

    function dobrar(posicao) {

      if (caixas.length !== folhas.length) { medirCaixas(); }
      if (!caixas.length) { return; }

      var linha = posicao + linhaDeLeitura();
      var n = folhas.length;
      var i, c, d, k;

      var angulo = [], recuo = [], forca = [], pivoNoTopo = [];

      for (i = 0; i < n; i++) {
        c = caixas[i];


        d = linha < c.topo  ? (c.topo  - linha) / ALCANCE
          : linha > c.fundo ? (c.fundo - linha) / ALCANCE
          : 0;

        k = gsap.utils.clamp(-1, 1, d);

        k = k * Math.abs(k);

        forca[i]  = Math.abs(k);

        angulo[i] = -c.angulo * k * grausEmRad;
        recuo[i]  = RECUO * forca[i];

        pivoNoTopo[i] = k >= 0;
      }

      var ancora = -1;
      for (i = 0; i < n; i++) {
        if (linha >= caixas[i].topo && linha <= caixas[i].fundo) { ancora = i; break; }
      }
      if (ancora < 0) { ancora = linha < caixas[0].topo ? 0 : n - 1; }

      var topoDesenhado = [], fundoDesenhado = [], desloca = [];

      function projetar(indice, y) {
        var caixa = caixas[indice];
        var alto  = caixa.fundo - caixa.topo;
        var v     = pivoNoTopo[indice] ?  alto : -alto;
        var pivo  = pivoNoTopo[indice] ? caixa.topo : caixa.fundo;
        var seno  = Math.sin(angulo[indice]);

        var noPivo  = pivo + y * PERSPECTIVA / (PERSPECTIVA + recuo[indice]);
        var naOutra = pivo + (v * Math.cos(angulo[indice]) + y) *
                             PERSPECTIVA / (PERSPECTIVA + recuo[indice] - v * seno);

        if (pivoNoTopo[indice]) { topoDesenhado[indice] = noPivo;  fundoDesenhado[indice] = naOutra; }
        else                    { fundoDesenhado[indice] = noPivo; topoDesenhado[indice]  = naOutra; }
        desloca[indice] = y;
      }

      function yParaOPivo(indice, alvo) {
        var pivo = pivoNoTopo[indice] ? caixas[indice].topo : caixas[indice].fundo;
        return (alvo - pivo) * (PERSPECTIVA + recuo[indice]) / PERSPECTIVA;
      }

      projetar(ancora, 0);
      for (i = ancora + 1; i < n; i++) { projetar(i, yParaOPivo(i, fundoDesenhado[i - 1])); }
      for (i = ancora - 1; i >= 0; i--) { projetar(i, yParaOPivo(i, topoDesenhado[i + 1])); }

      var telaTopo  = posicao + topoUtil;
      var telaFundo = posicao + window.innerHeight;

      for (i = 0; i < n; i++) {
        c = caixas[i];

        gsap.set(folhas[i], {
          transformPerspective: PERSPECTIVA,
          transformOrigin: pivoNoTopo[i] ? '50% 0%' : '50% 100%',
          rotationX: angulo[i] / grausEmRad,
          y: desloca[i],
          z: -recuo[i],
          '--veu': forca[i] * VEU
        });



        var vFolha = suavizar(Math.min(
          (telaFundo - topoDesenhado[i]) / SURGIR,
          (fundoDesenhado[i] - telaTopo) / SURGIR
        ));

        gsap.set(c.cabeca, { opacity: vFolha });
        gsap.set(c.corpo, { opacity: vFolha, y: (1 - vFolha) * ALCA });

        gsap.set(c.prova, {
          opacity: vFolha,
          y: (1 - vFolha) * ALCA,
          z: PROFUNDIDADE_PROVA
        });
      }
    }

    if (tira) {
      ScrollTrigger.create({
        trigger: tira,

        start: 'top bottom',
        end:   'bottom top',
        onRefresh: function (self) { medirCaixas(); dobrar(self.scroll()); },
        onUpdate:  function (self) { dobrar(self.scroll()); },
        onToggle:  function (self) {
          planilha.classList.toggle('roteiro__janela--voando', self.isActive);
        }
      });
    }


    return function () {
      planilha.classList.remove('roteiro__janela--voando');
      folhas.forEach(function (folha) {
        folha.classList.remove('folha--ativa');
        folha.style.removeProperty('--veu');
        folha.style.removeProperty('--sulco-origem');
      });
      gsap.set(folhas, { clearProps: 'transform' });
      gsap.set(gsap.utils.toArray(
        '.folha__ref, .folha__tulipa, .folha__dia, .folha__etapa, .folha__corpo, .folha .placa'),
        { clearProps: 'transform,opacity' });
    };
  });
}
