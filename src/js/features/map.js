export function initMap({ gsap, ScrollTrigger, root, reducedMotion }) {
  const raiz = root;
  const reduzido = reducedMotion;
  // Bounds are measured on ScrollTrigger refresh, never in the scroll callback.
var mapa  = document.querySelector('.mapa');
  var rota  = mapa && mapa.querySelector('.mapa__rota');
  var trilha= mapa && mapa.querySelector('.mapa__trilha');

  if (mapa && rota) {
    var PARADAS = [
      { uf: 'RS', local: 'Porto Alegre' },
      { uf: 'SC', local: 'Florianópolis' },
      { uf: 'PR', local: 'Curitiba' },
      { uf: 'SP', local: 'São Paulo' },
      { uf: 'MG', local: 'Serra da Canastra' }
    ];

    var pinos    = Array.prototype.slice.call(mapa.querySelectorAll('.mapa__parada'));
    var elUf     = mapa.querySelector('.mapa__uf');
    var elLocal  = mapa.querySelector('.mapa__local');
    var compRota = rota.getTotalLength();


    var fracoes = pinos.map(function (g) {
      var c  = g.querySelector('circle');
      var px = parseFloat(c.getAttribute('cx'));
      var py = parseFloat(c.getAttribute('cy'));
      var melhor = 0, menorDist = Infinity;
      for (var i = 0; i <= 200; i++) {
        var pt = rota.getPointAtLength(compRota * i / 200);
        var d  = (pt.x - px) * (pt.x - px) + (pt.y - py) * (pt.y - py);
        if (d < menorDist) { menorDist = d; melhor = i / 200; }
      }
      return melhor;
    });

    rota.style.strokeDasharray  = compRota;
    rota.style.strokeDashoffset = compRota;

    var compTrilha = trilha ? trilha.getTotalLength() : 0;
    if (trilha) { trilha.style.opacity = 0; }

    var paradaAtual = -1;
    function lerParada(i) {
      if (i === paradaAtual || i < 0) return;
      paradaAtual = i;
      elUf.textContent    = PARADAS[i].uf;
      elLocal.textContent = PARADAS[i].local;
    }

    function avancar(p) {
      rota.style.strokeDashoffset = compRota * (1 - p);
      var ultima = -1;
      for (var i = 0; i < pinos.length; i++) {

        var chegou = p >= fracoes[i] - 0.004;

        if (chegou !== (pinos[i].dataset.cravado === '1')) {
          pinos[i].dataset.cravado = chegou ? '1' : '0';
        }
        if (chegou) ultima = i;
      }
      lerParada(ultima);

      if (trilha) trilha.style.opacity = ultima === pinos.length - 1 ? 1 : 0;
    }

    if (reduzido) {

      rota.style.strokeDashoffset = 0;
      if (trilha) trilha.style.opacity = 1;
      pinos.forEach(function (g) { g.dataset.cravado = '1'; });
      lerParada(PARADAS.length - 1);
      mapa.classList.add('mapa--visivel');
    } else {

      ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        endTrigger: '.preco__figura',
        end: 'top 75%',

        scrub: true,
        onUpdate: function (self) { avancar(self.progress); }
      });


      ScrollTrigger.create({
        trigger: '.heroi',
        start: 'bottom 78%',
        onEnter:     function () { mapa.classList.add('mapa--visivel'); },
        onLeaveBack: function () { mapa.classList.remove('mapa--visivel'); }
      });
    }



    var leituraDoMapa = mapa.querySelector('.mapa__leitura');
    var regioes = [];
    var centroDaLeitura = 0;

    function medirSuperficies() {
      var r = leituraDoMapa.getBoundingClientRect();
      centroDaLeitura = r.top + r.height / 2;
      regioes = gsap.utils.toArray('.papel, .tinta').map(function (el) {
        var caixa = el.getBoundingClientRect();
        var prof = 0, pai = el;
        while ((pai = pai.parentElement)) prof++;
        return {
          de:    caixa.top + window.scrollY,
          ate:   caixa.bottom + window.scrollY,
          papel: el.classList.contains('papel'),
          prof:  prof
        };
      }).sort(function (a, b) { return b.prof - a.prof; });
    }

    function superficieSobALeitura() {
      var y = centroDaLeitura + window.scrollY;
      for (var i = 0; i < regioes.length; i++) {
        if (y >= regioes[i].de && y <= regioes[i].ate) {
          return regioes[i].papel ? 'papel' : 'tinta';
        }
      }
      return 'tinta';
    }

    medirSuperficies();
    ScrollTrigger.addEventListener('refresh', medirSuperficies);

    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: function () {
        var s = superficieSobALeitura();
        if (mapa.dataset.superficie !== s) mapa.dataset.superficie = s;
      }
    });
  }
}
