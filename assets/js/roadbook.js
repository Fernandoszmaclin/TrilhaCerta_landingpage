/* ═══════════════════════════════════════════════════════════════════════════
   O ROADBOOK

   Um relógio só. Toda animação ligada à rolagem desta página sai daqui, do
   GSAP com ScrollTrigger, e de mais lugar nenhum.

   Não existe animation-timeline em CSS, não existe IntersectionObserver
   paralelo e não existe ouvinte de 'scroll'. O motivo está escrito no
   revelar.js do site institucional, e foi pago com defeito real: existiam duas
   vias para o mesmo efeito, uma por CSS onde houvesse suporte e outra por JS
   onde não houvesse, e o Chrome passou a receber uma animação diferente da do
   Firefox. Manter dois relógios para o mesmo efeito é o defeito, não a
   redundância que parece ser.

   O Lenis entra como FONTE de rolagem, não como segundo relógio: ele substitui
   a rolagem do navegador e alimenta o mesmo ScrollTrigger. Continua sendo um.

   ORDEM DE LEITURA
     1. Portões        quando este arquivo desiste, e por quê
     2. Lenis          a rolagem com inércia
     3. A volta        a logo da barra levando de volta ao começo
     4. O mapa         o percurso do RS até a Canastra se desenhando
     5. As revelações  a placa saindo do rolo
     6. O vento        o leque de baralho que vira estrada e vai embora
     7. Os vídeos      tocam só quando estão à vista
     8. A planilha     a navegação pela planilha de regularidade do roteiro
     9. O recorte      o ônibus de papel assenta no ângulo de repouso

   O CSS entrega a página inteira, completa e legível, sem uma linha deste
   arquivo. O que está aqui acrescenta; nada aqui é estrutura.
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. PORTÕES ────────────────────────────────────────────────────────
     Sem GSAP não há animação, e não há problema: o CSS já pintou tudo. Sair
     aqui é a diferença entre uma página sem efeito e uma página em branco. */

  if (typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  var raiz     = document.documentElement;
  var reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* .movimento-ativo é a trava: é ela que liga, no CSS, o estado ESCONDIDO das
     placas. Ou os dois rodam, o esconder e o revelar, ou nenhum roda. Adicionar
     a classe aqui, depois de confirmar que o GSAP existe e que ninguém pediu
     movimento reduzido, é o que impede o pior caso possível: o esconder chegar,
     o revelar falhar, e metade da página ficar invisível. */
  if (!reduzido) raiz.classList.add('movimento-ativo');


  /* ── 2. LENIS ──────────────────────────────────────────────────────────
     A rolagem deixa de ser a do navegador e passa a ter inércia e
     amortecimento. É a base da sensação do site de referência, e a única
     biblioteca nova desta rodada.

     Três cuidados, e os três valem defeito se esquecidos:

     autoRaf: false. O Lenis tem um laço de quadro próprio. Deixar os dois
     laços rodando, o dele e o do GSAP, é ter dois relógios de novo: eles
     divergem alguns milissegundos e a rolagem trepida. Aqui o ticker do GSAP
     alimenta o Lenis, e existe um só.

     lagSmoothing(0). Sem isso o GSAP "conserta" travadas pulando tempo, o que
     numa rolagem amarrada ao scroll produz um salto visível.

     No TOQUE ele fica desligado, que é o padrão do Lenis e é o certo: rolagem
     inercial sintética briga com o gesto nativo do dedo, e esta página é
     celular primeiro. E sob movimento reduzido ele não é instanciado: inércia
     é justamente o tipo de movimento que a preferência existe para desligar. */

  var lenis = null;
  if (!reduzido && typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({ autoRaf: false, duration: 1.05 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }


  /* ── 3. A VOLTA AO TOPO ───────────────────────────────────────────────
     A logo da barra leva de volta ao começo, e volta ROLANDO.

     ISTO MORA AQUI EM CIMA DE PROPÓSITO, e é conserto de uma fragilidade real.
     O bloco era o penúltimo do arquivo, depois do mapa, das provas ao vento e
     da planilha. Qualquer exceção em qualquer um deles abortava a função
     inteira e este addEventListener nunca chegava a acontecer: a logo parava de
     funcionar por causa de um defeito numa seção que não tem nada com ela.

     Agora ele só depende dos portões e do Lenis, que são as duas coisas acima.
     Um erro numa animação continua sendo um erro, e some com a animação; não
     some mais com a navegação.

     Ela já é um <a href="#topo">, ou seja, já funciona sem uma linha de script:
     o navegador vai para o topo do documento. Este bloco não cria a função, ele
     troca o salto pela viagem. Se o script falhar, o salto continua lá.

     Por que não resolver isso no CSS com scroll-behavior: smooth: porque o
     Lenis é quem manda na rolagem desta página, e os dois brigam. Com os dois
     ligados, o clique numa âncora rola duas vezes, uma por cada dono. O
     scroll-behavior foi removido da folha justamente por isso, e a animação
     precisa sair de quem tem o controle.

     Sob movimento reduzido o Lenis nem é instanciado, e aí a volta é seca, sem
     interpolação: quem pediu menos movimento não quer a página inteira
     desfilando por 1,1 segundo. */

  var marca = document.querySelector('.barra__marca');
  if (marca) {
    marca.addEventListener('click', function (ev) {
      ev.preventDefault();
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.1 });
      } else {
        window.scrollTo({ top: 0, behavior: reduzido ? 'auto' : 'smooth' });
      }
    });
  }


  /* ── 4. O MAPA ────────────────────────────────────────────────────────
     O percurso do Rio Grande do Sul até a Serra da Canastra, desenhando-se
     conforme a página é lida.

     A ideia: ler a página É fazer a viagem. O traçado avança com a rolagem do
     documento inteiro, e cada parada crava quando a linha chega nela. Não é
     barra de progresso disfarçada de mapa: a geometria é real, então a forma
     que aparece na tela é a forma verdadeira do caminho.

     COMO A LINHA SE DESENHA. stroke-dasharray com o comprimento total e
     stroke-dashoffset indo desse comprimento até zero. O comprimento sai de
     getTotalLength, medido no navegador, porque ele depende da curva e escrever
     à mão é errar.

     COMO AS PARADAS SABEM A HORA. Cada pino tem uma posição no desenho, mas o
     que o traçado conhece é comprimento percorrido, não coordenada. A ponte é
     amostrar o caminho e descobrir, para cada pino, em que fração do
     comprimento a linha passa mais perto dele. Aí a parada crava quando o
     avanço ultrapassa a fração dela. */

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

    /* A fração do comprimento em que a linha passa mais perto de cada pino.
       200 amostras dão precisão de meio por cento do caminho, muito além do que
       o olho distingue num traçado de 150px. */
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
        /* A folga de 0,004 existe para a ÚLTIMA parada. Ela mora no fim do
           traçado, então a fração dela é exatamente 1, e sem folga o destino só
           cravaria com o progresso em 1,0 cravado. Basta um arredondamento de
           meio pixel na conta da rolagem para Minas Gerais não chegar na hora
           em que o preço aparece, que é justamente a hora que importa. Quatro
           milésimos do caminho são meio pixel de desenho: invisível, e é o que
           separa "chega" de "quase chega". */
        var chegou = p >= fracoes[i] - 0.004;
        /* Estado, não tween, e agora de verdade. O scrub roda dezenas de
           vezes por segundo, e disparar uma animação a cada quadro empilharia
           tweens sobre o mesmo alvo. Aqui só troca um data-atributo; quem dá a
           maciez é a transição declarada no CSS.

           Havia um gsap.to neste lugar, contra o que este próprio comentário
           dizia, e ele quebrava o desenho: o GSAP reescreve a origem de
           transformação de elementos SVG e essa conta briga com o
           transform-box: fill-box do CSS. O resultado media
           matrix(1,0,0,1,-12,-148) num pino que mora em (12,148): as cinco
           paradas empilhadas no canto do SVG, longe da linha. */
        if (chegou !== (pinos[i].dataset.cravado === '1')) {
          pinos[i].dataset.cravado = chegou ? '1' : '0';
        }
        if (chegou) ultima = i;
      }
      lerParada(ultima);
      /* A trilha tracejada só existe depois que a estrada chegou ao destino: é
         o que a expedição faz DEPOIS de desembarcar.

         Ela pergunta pela ÚLTIMA PARADA, e não por um 0,985 escrito à mão. Com
         o número solto havia uma janela entre 0,985 e 0,996 em que o laço já
         estava desenhado e Minas ainda não tinha cravado: o mapa mostrava a
         trilha do destino enquanto a leitura ainda dizia São Paulo. Duas contas
         para o mesmo instante sempre acabam discordando; agora é uma só. */
      if (trilha) trilha.style.opacity = ultima === pinos.length - 1 ? 1 : 0;
    }

    if (reduzido) {
      /* Movimento reduzido: o mapa aparece pronto, com o caminho inteiro e
         todas as paradas. Perde-se o desenho, não a informação. */
      rota.style.strokeDashoffset = 0;
      if (trilha) trilha.style.opacity = 1;
      pinos.forEach(function (g) { g.dataset.cravado = '1'; });
      lerParada(PARADAS.length - 1);
      mapa.classList.add('mapa--visivel');
    } else {
      /* ONDE A VIAGEM ACABA. O percurso ia até o fim do documento, o que punha
         Minas Gerais depois do rodapé: a linha ainda estava em São Paulo
         justamente na hora em que a página pede a decisão.

         Agora ela fecha no PREÇO. A leitura vira uma coisa só: quando o valor
         entra na tela, a expedição chegou ao destino, e é o argumento inteiro
         em uma imagem. Depois disso o mapa fica completo, porque não há mais
         percurso a contar.

         O FIM É A CIFRA ENTRANDO NA TELA, e não o bloco de preço centralizado.

         Já foi o centro do bloco no centro da tela, e a diferença parecia
         acadêmica até ser medida: numa tela de 690px de altura, com o valor
         inteiro visível e legível, o progresso era 0,985. A linha estava 98,5%
         desenhada, a trilha do destino já tinha aparecido, e Minas Gerais NÃO
         tinha cravado: a leitura ainda dizia São Paulo, e faltavam 101px de
         rolagem para a viagem terminar. Ou seja, o visitante chegava ao preço
         antes de o mapa chegar ao destino, que é exatamente o contrário do que
         esta regra existe para fazer.

         Agora o gatilho é a própria cifra, e ela fecha a viagem quando cruza
         75% da altura da tela: o número acabou de entrar, ainda está no terço
         de baixo, e o mapa já está inteiro. Daí em diante ele permanece
         completo enquanto o painel é lido. Chegar cedo demais não custa nada;
         chegar tarde é o defeito. */
      ScrollTrigger.create({
        trigger: document.body,
        start: 'top top',
        endTrigger: '.preco__figura',
        end: 'top 75%',
        /* scrub: true, sem suavização. O mapa é indicador de posição, e um
           atraso de recuperação faria dele uma mentira de meio segundo. */
        scrub: true,
        onUpdate: function (self) { avancar(self.progress); }
      });

      /* Entra depois do herói: antes disso não há percurso nenhum a mostrar, e
         ele cobriria a primeira dobra sem dizer nada. */
      ScrollTrigger.create({
        trigger: '.heroi',
        start: 'bottom 78%',
        onEnter:     function () { mapa.classList.add('mapa--visivel'); },
        onLeaveBack: function () { mapa.classList.remove('mapa--visivel'); }
      });
    }

    /* A LEITURA DE SUPERFÍCIE, e só para o TEXTO da leitura em mono.

       As linhas não dependem disto: o halo do CSS resolve o traço contra
       qualquer fundo. O texto não tem essa saída, porque tinta clara contornada
       sobre papel claro vira letra vazada, e 11px de mono vazado não se lê.

       ISTO NÃO PERGUNTA POR SEÇÃO, PERGUNTA POR REGIÃO. A versão anterior
       observava as duas seções .papel e errava feio num caso real: dentro da
       seção de oferta existe o .painel.tinta, uma ilha ESCURA dentro do papel,
       e é bem em cima dela que o mapa passa no celular. A resposta "estou sobre
       papel" fazia a leitura pintar tinta escura sobre painel escuro. Legível na
       teoria da seção, ilegível na tela.

       Aqui as regiões são todas as .papel e todas as .tinta, ordenadas por
       PROFUNDIDADE no DOM: a mais interna que contém a leitura vence, que é
       exatamente como a cor se comporta de verdade.

       Um gatilho só, e ele não mede nada por quadro. As faixas são medidas no
       refresh, e a leitura mora num elemento fixo, então a posição dela na tela
       não muda com a rolagem: dá para guardar e somar o scroll. O que roda a
       cada quadro é uma comparação de números. */

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


  /* ── 5. A REVELAÇÃO DA LISTA ──────────────────────────────────────────
     clip-path de baixo para cima na lista de atrito: o bloco avança linha a
     linha. Um fade com deslocamento diria apenas "algo apareceu"; a revelação
     por corte diz "papel avançando", que é o assunto da página.

     As NOVE PLACAS tinham o mesmo tratamento e não têm mais. A imagem só
     aparecia depois que o visitante já estava olhando para o lugar dela, e numa
     página com nove fotos isso vira nove esperas para ver o que já estava
     carregado. Foto é prova, e prova não se atrasa.

     Uma vez só. Reanimar a cada passagem é uma interface brigando com o leitor
     que voltou para reler.

     O JavaScript não anima nada aqui: ele só põe o data-atributo, e a transição
     mora no CSS. Isso mantém o efeito rodando fora da thread principal e faz
     dele uma linha de CSS auditável em vez de um tween escondido. */

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


  /* ── 6. AS PROVAS AO VENTO ────────────────────────────────────────────
     SETE provas começam juntas, como um álbum largado na mesa: amontoadas em
     volta do mesmo centro, cada uma um pouco deslocada da anterior, todas
     visíveis. Conforme a seção passa, o monte ORBITA: cada foto gira em torno
     do centro comum enquanto a distância dela até esse centro CRESCE, e o
     álbum se abre para fora da tela.

     RODA-GIGANTE, E NÃO PIÃO. É a distinção que governa esta seção inteira: a
     cadeirinha percorre o círculo e continua em pé o tempo todo. A prova muda
     de LUGAR, não de EIXO — a inclinação com que ela estava na mesa é a mesma
     com que ela sai da tela. São duas grandezas separadas, e misturá-las foi
     exatamente o defeito da versão anterior.

     A ESPIRAL DE EULER SAIU DAQUI, e vale registrar o que ela era para não
     voltar por engano. A pista era um arco de raio constante emendado a uma
     clotoide e a uma reta, construída integrando curvatura, e a inclinação de
     cada prova saía da TANGENTE dessa pista. Desenhava um leque de baralho, e
     era caro: duzentas linhas de geometria, uma tabela de 720 pontos montada
     por faixa de tela, e um movimento que lia como varredura de espiral. Foi
     recusado a pedido.

     O RAIO DE PARTIDA É PEQUENO, E É ELE QUE FAZ O ÁLBUM. Uma versão
     intermediária largou as provas num anel de raio 1,25 vez a largura da
     pilha, para garantir que nenhuma encostasse na outra. Garantiu, e destruiu
     o começo: as provas já apareciam esparramadas pela tela antes de o
     visitante chegar na seção, e o que devia ser um monte era um mostrador de
     relógio. O raio de partida é fração pequena da largura, de 0,23 a 0,39, e é
     o escalonamento que garante que todas apareçam: elas se cobrem, como fotos
     de álbum se cobrem, mas nenhuma some atrás de outra.

     O painel de preço tem camada própria mesmo assim. As provas podem cobrir as
     outras camadas da página, mas preço coberto por foto é o único lugar onde
     sobrepor não se discute, e o começo do voo ainda passa perto dele. */

  var mmPilha = gsap.matchMedia();
  mmPilha.add({
    celular: '(prefers-reduced-motion: no-preference) and (max-width: 47.999rem)',
    amplo:   '(prefers-reduced-motion: no-preference) and (min-width: 48rem)'
  }, function (contexto) {
    var pilha = document.querySelector('.album__grade');
    if (!pilha) return;
    var celular = contexto.conditions.celular;
    var todasProvas = Array.prototype.slice.call(pilha.children);
    /* O álbum conserva as sete fotos no desktop. No celular, seis fotos deixam
       espaço suficiente entre as passagens para que cada uma seja reconhecida;
       a sétima fica oculta também no CSS, inclusive sem JavaScript. */
    var provas = celular ? todasProvas.slice(0, 6) : todasProvas;
    if (provas.length < 2) return;

    pilha.classList.add('album__grade--pilha');

    /* O RAIO É FRAÇÃO DA LARGURA DA PILHA, nunca pixel fixo, senão o voo encolhe
       no desktop e estoura no celular. Medir uma vez por refresh do
       ScrollTrigger é o mesmo contrato que o mapa usa mais acima.

       A LARGURA DA TELA ENTRA JUNTO porque as pontas do caminho precisam dela:
       onde a prova está fora depende de onde a borda está, e borda é tela, não
       pilha. Só a largura — a altura chegou a entrar quando as provas saíam em
       diagonal e podiam cruzar a borda de cima primeiro, e saiu com o modelo do
       leque: no arco a saída é sempre pelos lados. Medidas no mesmo lugar para
       nunca saírem de instantes diferentes. */
    var largura = 0, telaW = 0;
    function medirPilha() {
      largura = pilha.getBoundingClientRect().width;
      telaW   = window.innerWidth;
    }
    medirPilha();
    ScrollTrigger.addEventListener('refreshInit', medirPilha);

    /* A FILA SAI DA VELOCIDADE, E NÃO DO ATRASO.

       Antes as sete partiam em instantes diferentes: a de baixo primeiro, e
       cada uma das outras esperava 0,0625 do percurso para arrancar. A fila era
       feita de ESPERA.

       Agora as sete partem JUNTAS, no mesmo instante, e o que as separa é a
       velocidade: a primeira é a mais lenta e a última a mais rápida. A fila
       passa a ser feita de RITMO, e a diferença se vê — com atraso, quem ainda
       não partiu está parada, e parado ao lado de coisa em movimento lê como
       travado. Com velocidade, todas se movem o tempo todo e o leque abre
       porque umas ganham das outras.

       O ÍNDICE 0 É O MAIS LENTO, e ele é a prova de cima, a que pinta por cima
       de todas. Ela fica para trás enquanto as de baixo escapam, e é isso que
       dá o rastro de fila: o grupo se estica no sentido do movimento em vez de
       se desfazer.

       No celular, 1 A 2,4 aumenta em cerca de 17% o vão entre as seis fotos;
       no desktop, 1 A 2,2 preserva o ritmo existente. Abaixo de uns 1,6 no teto
       a fila não se lê, porque as fotos andam quase juntas; acima de uns 3 a
       última some antes de a primeira sair do lugar, e aí volta a ser uma série
       de animações soltas em vez de uma fila. */
    var VEL_MIN = 1.0;
    var VEL_MAX = celular ? 2.4 : 2.2;

    /* O ESPALHADO DE MESA SAIU, e com ele o TAMANHO fixo. Ficam registrados
       porque custaram caro e porque a razão de sairem não foi defeito deles.

       Eram dois vetores irregulares, ESPALHA_X e ESPALHA_Y, achados por busca
       construída: trinta mil sorteios em volta de um anel achatado, avaliados
       por cobertura real de polígono com a ordem de pintura, otimizando a PIOR
       prova junto com o desvio padrão entre elas. O vencedor punha as sete em
       100, 47, 46, 39, 38, 44 e 28 por cento de área à vista, e a regra que ele
       cumpria era "nenhuma some". Junto vinha TAMANHO de 0,80, escolhido na
       mesma medição: a 0,84 a mais coberta caía para 33%.

       O QUE OS DERRUBOU FOI O PEDIDO, e não a medida. Espalhado irregular
       espalha, e o pedido é o contrário: manter as provas AGRUPADAS, como no
       site de referência. Medido, aquele monte dava 422px de largura numa tela
       de 390 — transbordava parado. Um anel regular de passo pequeno agrupa; um
       espalhado buscado para maximizar visibilidade, por construção, abre.

       Se um dia o pedido voltar a ser "mesa jogada", os números estão aqui:
         ESPALHA_X = [-0.290, 0.141, 0.387, 0.084, -0.158, -0.329, -0.347]
         ESPALHA_Y = [-0.184, -0.245, -0.003, 0.217, 0.172, -0.190, 0.155]
       e eles só valem SOMADOS a um arco de raio 0,62 com passo de 8 graus,
       nunca sozinhos — essa confusão já custou uma rodada. */

    /* A TORÇÃO ENCOLHEU A PEDIDO: era [-2, 30, 20, -14, -24, -24, 30].

       A busca antiga exigia 36 graus entre a mais torta e a mais reta, porque
       sem isso o monte lia como PILHA ARRUMADA e não como mesa. A exigência cai
       por decisão de quem pede: o pedido é curvatura PEQUENA, só o bastante
       para uma prova se distinguir da vizinha.

       Aqui ela também passou a ser o ÚNICO sinal que diferencia uma prova da
       outra no repouso, já que o anel é regular. A referência nem isso tem: as
       cinco camadas dela têm a mesma inclinação de 3 graus. 17 graus de
       espalhamento é o que sobrou; se ficar certinho demais, dá para abrir até
       uns ±12 e ainda ler como pequeno. */
    var TORTO     = [    -4,      7,     -6,      5,     -8,      9,     -5];

    /* O ANEL DE REPOUSO, LIDO DA REFERÊNCIA.

       ESPALHA e o arco saíram, e o motivo é o pedido: as provas se espalhavam
       demais e o álbum deixava de ser um GRUPO. Medido, o monte em repouso dava
       422px de largura numa tela de 390 — transbordava antes mesmo de o voo
       começar. Na referência (sanrita.ca/en/about) o álbum inteiro vive numa
       caixa de 280x350 no celular, e as fotos partem EMPILHADAS: as cinco
       camadas têm exatamente a mesma classe, a mesma inclinação e a mesma
       célula de grid. Todo o leque é do script.

       AS FRAÇÕES SÃO AS DELA. No celular ela usa 30px de base e 20 de passo
       numa caixa de 280, ou seja 0,107 e 0,071; no desktop, 40 e 30 numa caixa
       de 411, ou seja 0,097 e 0,073. Praticamente as mesmas frações nas duas
       telas, então uma dupla só serve para as duas — e é por isso que aqui elas
       são fração da largura da pilha, e não pixel.

       AS FASES NÃO SÃO AS DELA, E ESTE FOI UM DEFEITO CORRIGIDO. O passo de
       0,8 radiano da referência espalha as sete fases de 0 a 4,8 rad, ou seja a
       VOLTA INTEIRA. Com cinco corpos e raios pequenos ela se safa; com sete o
       repouso virava exatamente o que foi reclamado, "distribuídas em forma de
       arco, meia lua", em vez de um grupo centrado.

       AGORA AS FASES SÃO UM LEQUE ESTREITO EM TORNO DE π, ou seja em torno da
       ESQUERDA. Duas razões, e a segunda é a que manda:

         1. Leque estreito mantém o grupo junto. O passo de 0,20 rad abre 1,2
            radiano no total, 69 graus, contra os 275 de antes.
         2. Quem começa à esquerda e varre meia volta TERMINA À DIREITA. É daí
            que sai a saída pela direita, sem nenhuma translação por cima: o
            movimento que tira as provas da tela é o PRÓPRIO giro. */
    /* O PASSO DO RAIO É O ESPAÇAMENTO DA CORRENTE, e é o único número que muda
       o quanto uma prova fica longe da vizinha.

       A série de tentativas vale registrar porque o intervalo útil é estreito:

         0,049  corrente de 63px com elos de 206: borrão centrado, não corrente.
         0,10   corrente de 130px. Já lia como arco, e foi a versão aprovada.
         0,16   corrente de 208px, primeiro "aumente um pouco a distância".
         0,21   corrente de 273px, segundo pedido do mesmo tipo.

       UMA TENTATIVA ENTERRADA, e ela custou uma rodada inteira. Para atender
       "as primeiras imagens devem começar fora da tela", a corrente passou a
       ser medida em TELAS e não em larguras de pilha, o índice 0 virou a ponta
       distante, a âncora saiu do centro para a ponta, e o escalonamento voltou
       a ser direto. Funcionava no celular — o prato ia de 0% a 68% de área à
       vista — e derrubava o desktop, onde a razão tela/pilha é 4,09 em vez de
       1,80: a mesma corrente espalhava as provas ao ponto de nada aparecer
       depois da metade do percurso. A lição: o arranjo já estava certo e o que
       faltava era ESPAÇO, então bastava este número.

       QUAL PONTA FICA JUNTO DA BORDA DIREITA sai do sinal desta conta, e vale
       deixar explícito porque não é óbvio. As fases apontam para π, ou seja
       para a ESQUERDA, então raio MAIOR é mais à esquerda e raio MENOR é mais à
       direita. Como a âncora põe a borda direita do grupo passando da borda da
       tela, quem sangra é sempre a ponta de raio CURTO.

       Com o raio crescendo junto com o índice, a ponta curta é o índice 0, e
       são as PRIMEIRAS provas que nascem cortadas pela direita — que é o
       pedido. A conta invertida, (n-1-i), põe as últimas ali; foi tentada e
       desfeita no mesmo minuto, porque a inversão era engano de quem pediu. */
    /* A CURVATURA FECHA NO RABO DA CORRENTE, e só nele.

       O passo angular era constante, então a corrente era um arco de curvatura
       uniforme: cada prova virava o mesmo tanto em relação à anterior. O pedido
       é que as ÚLTIMAS fechem mais, e curvatura maior é passo angular maior.

       O acréscimo é QUADRÁTICO e vale só da metade para trás. Quadrático porque
       linear mexeria em todas de uma vez e mudaria o arco inteiro, quando o
       pedido nomeia só o fim dele; e só da metade para trás porque as primeiras
       são as que sangram pela direita e já estão onde precisam estar.

       Medido em radianos de desvio a partir de π, com 0,25:

         índice   0      1      2      3      4      5      6
         antes   -0,60  -0,40  -0,20   0     +0,20  +0,40  +0,60
         agora   -0,60  -0,40  -0,20   0     +0,23  +0,51  +0,85

       A última cresce 42% de desvio, a penúltima um quarto disso, e as quatro
       primeiras não se mexem.

       0,45 FOI TENTADO E ERA DEMAIS, e o modo de falha é contraintuitivo:
       passado um certo ponto, curvar mais traz a última prova de VOLTA para a
       direita. O deslocamento horizontal é o cosseno do desvio vezes o raio, e
       o cosseno despenca quando o ângulo cresce — com 0,45 a última tinha 46%
       do corpo fora da tela pela direita, mais que a penúltima, quando devia
       ser a que fecha o arco à esquerda. Curvatura é para deitar a ponta, não
       para desandá-la.

       O ESPAÇAMENTO É POR FAIXA DE TELA, e a diferença é grande de propósito.

       Ancorar a primeira prova inteiramente fora empurra a corrente toda para a
       direita. O que fazer com o rabo depois disso é uma decisão de desenho, e
       ela é diferente nas duas telas:

         celular  0,20  o álbum inteiro se encosta na borda direita. A primeira
                        sai de vez, as últimas ficam parcialmente cortadas pela
                        MESMA borda. Corrente curta é o que produz isso, e é
                        também o "raio da curva menor" pedido: raio de repouso
                        menor é arco menor, mais contido na tela estreita.
         desktop  0,32  há largura de sobra, então a corrente pode se abrir e
                        mostrar o álbum inteiro depois da primeira.

       UMA LEITURA ERRADA MINHA, registrada porque quase virou correção: medi
       0,21 no celular, vi "as sete entre 22% e 105% fora" e li como defeito,
       quando é exatamente o arranjo pedido. Percentual fora da tela não é
       medida de qualidade aqui; encostar o álbum na borda é o desenho. */
    /* O RAIO DA ÓRBITA, em larguras de pilha.

       O ARCO VIROU UMA VOLTA INTEIRA A PEDIDO. Antes o caminho era um trecho de
       220 graus e a prova parava nas duas pontas; agora ela retorna ao mesmo
       ponto pela direita. O que era "ápice" continua existindo, mas passa a ser
       o ponto de maior aproximação da órbita — o extremo esquerdo do percurso.

       O RAIO DEIXOU DE SER DERIVADO. Na versão de arco ele saía da abertura por
       (K − ÁPICE) / (1 − cos), e por isso mudar a curvatura mexia no tamanho.
       Agora ele é escrito à mão, que é o pedido: "raio um pouco menor". Medido,
       a versão de arco dava 1,10 largura no celular e 1,59 no desktop; estes
       são cerca de 14% menores.

       DE ONDE SAI CADA UM. O celular tem 217px de pilha numa tela de 390 e o
       desktop 352 numa de 1440. O raio precisa ser grande o bastante para o
       ponto mais à direita da órbita cair fora da tela — é lá que a prova entra
       e sai — e pequeno o bastante para a volta não virar viagem: a excursão
       vertical de uma órbita é o raio inteiro, para cima e para baixo.

         celular  0,95  206px de raio de base; 124px na altura comprimida.
         desktop  1,35  475px numa tela de 900. Parece muito, mas nesse trecho
                        a prova já está fora da tela pela direita.

       HÁ UM PISO, e ele está em `posicionar`, não aqui: o ponto mais à direita
       da órbita é ÁPICE + 2 × raio, e ele tem de passar de K. Se um número
       escrito aqui for pequeno demais para a tela em que a página abrir, a
       prova nunca sairia de vista e ficaria rodando meio cortada para sempre.
       O piso corrige isso sozinho em vez de deixar o defeito aparecer só em
       largura de tela que ninguém testou. */
    var RAIO = celular ? 0.95 : 1.35;

    /* No celular a órbita achata na vertical. A volta continua ocupando o mesmo
       percurso horizontal, portanto as fotos ainda entram e saem pela direita,
       mas a subida máxima cai de cerca de 206px para 124px. Essa folga mantém
       o álbum fora da área do CTA do herói. */
    var ALTURA_ORBITA = celular ? 0.6 : 1;

    /* Desce somente a linha de base mobile em um quinto da própria largura. Em
       uma pilha de 217px isso representa cerca de 43px: aproxima as fotos do
       título do roteiro sem devolver a subida que invadia a área do CTA. */
    var DESLOCAMENTO_VERTICAL = celular ? 0.2 : 0;

    /* O PONTO DE MAIOR APROXIMAÇÃO, em larguras de pilha à direita do centro da
       célula. É o extremo ESQUERDO da órbita.

       É este número que segura o pedido de "somente no lado direito": ele é o
       ponto MAIS À ESQUERDA que qualquer prova alcança na volta inteira. Zero
       poria a órbita encostando no centro da tela; positivo mantém o percurso
       todo na metade direita.

       POR FAIXA DE TELA, e a aritmética obriga. A prova mede 1,15 largura de
       pilha na escala maior, e ela só aparece inteira enquanto o centro dela
       estiver a menos de (meia tela − meia prova) do centro da célula:

         celular   217px de pilha numa tela de 390: meia tela vale 0,90 largura
                   e meia prova 0,575, então sobram 0,32 de folga total. 0,15
                   gasta metade dela e ainda deixa a prova inteira à vista na
                   maior aproximação. Empurrar mais faria a órbita ficar mais à
                   direita ao preço de a prova nunca aparecer inteira — e a
                   queixa que abriu esta sequência foi excesso de sangramento.
         desktop   352px numa tela de 1440: meia tela vale 2,05 larguras e sobra
                   1,47 de folga. 0,64 põe a borda ESQUERDA da prova a 724 numa
                   tela de 1440, ou seja a órbita inteira cabe na metade direita
                   sem que nada seja cortado. Medido a 0,60 dava 710, dez pixels
                   para dentro da metade esquerda — daí o ajuste. */
    var APICE = celular ? 0.15 : 0.64;

    /* AS PROVAS CRESCERAM A PEDIDO: era 0,7 a 0,9, e a referência usa esses.

       Passa de 1 no fim, e isso é deliberado: a prova fica MAIOR que a célula
       da pilha. Não desloca nada, porque escala é transform e transform não
       mexe em layout, e a seção já tem licença explícita para as provas
       atravessarem o que estiver em volta. */
    var ESCALA_MIN = 0.95;
    var ESCALA_MAX = 1.15;

    /* UM CAMINHO SÓ, E AS SETE DESFILANDO POR ELE.

       Esta é a mudança de objetivo que desfez o modelo anterior, e vale dizer
       exatamente qual era o erro. Antes as sete formavam um LEQUE ESTÁTICO —
       cada uma num raio e num ângulo próprios — e o voo empurrava o leque
       inteiro. Como o leque tinha de caber ao lado da borda, quase todas
       nasciam cortadas por ela, e a queixa foi essa: "quase todas as imagens
       estão sangrando".

       O objetivo é outro: as provas APARECEM de fora da tela, fazem a barriga
       de um arco dentro dela e SOMEM pelo MESMO lado, o direito. Isso não é um
       leque que se move; é uma FILA num caminho. Todas percorrem o MESMO arco, e o que as separa é o ponto do
       caminho em que cada uma está num dado instante.

       A consequência prática é que nenhuma prova precisa nascer cortada: quem
       está no meio do caminho aparece inteira, e só sangra quem está passando
       por uma das pontas — que é o que "entrar" e "sair" querem dizer.

       O ESPALHAMENTO VEM DA VELOCIDADE, e não de posições fixas. Todas partem
       do mesmo ponto do caminho e a diferença de ritmo abre a fila sozinha, que
       é exatamente o efeito pedido quando o atraso deu lugar à aceleração
       crescente. É por isso que RAIO0, FASE, CENTRO_X e a âncora de borda
       saíram todos juntos: eram a maquinaria do leque, e o leque acabou.

       A ORDEM DA FILA É A DO DOM, que é a ordem em que as fotos foram postas no
       HTML, e ela decide duas coisas: quem vai na frente e quem pinta por cima.

       AS INCLINAÇÕES CONTINUAM ESCRITAS À MÃO. Na versão da pista elas saíam da
       tangente, o que amarrava inclinação a posição: mover a prova virava a
       prova, e o conjunto lia como pião. TORTO mantém as duas coisas separadas
       — o lugar é o caminho, o eixo é um número por prova que não muda nunca. */

    /* A JANELA COMEÇA COM O ÁLBUM JÁ ENQUADRADO, e não no instante em que a
       primeira quina dele aparece por baixo.

       'center X%' dispara quando o CENTRO da pilha chega a X% da altura da tela.
       Antes disso o monte fica intacto e parado; o voo acontece enquanto o
       visitante continua descendo em direção ao preço.

       O valor saiu de três correções em sentidos opostos, e vale registrar as
       três porque o intervalo útil é estreito:

         'top bottom'   dispara quando a primeira quina cruza a borda de baixo.
                        Cedo demais: a pilha tem 217px numa tela de 844 e chega
                        ao meio dela em pouco mais de 300px de rolagem, então o
                        voo já estava em 50% quando o álbum ficava centralizado.
                        Ninguém via o álbum; via o meio da rajada.
         'center 60%'   zerou isso e ficou tarde. O monte esperava parado mais
                        tempo que a paciência de quem rola.
         'center 80%'   equilibrou no desktop e, no celular, voltou a ler cedo.

       Por isso o começo é POR FAIXA DE TELA: 127% no desktop, 135% no celular.
       Quanto MAIOR a porcentagem, mais cedo dispara, porque o centro da pilha
       chega antes a um ponto mais baixo da tela. Os números já subiram quatro
       vezes a pedido — 10, mais 10, mais 15, e um salto de 107/115 para 150/160
       quando o pedido virou *"a animação deve começar muito antes"*.

       E DEPOIS DESCERAM, porque o ÁLBUM MUDOU DE LUGAR. Ele saiu da oferta, lá
       embaixo, e virou a segunda coisa da página, entre o herói e o roteiro. Com
       150/160 no lugar novo a ScrollTrigger devolvia `start` NEGATIVO — −249 no
       celular e −300 no desktop —, o que significa janela que começa antes da
       rolagem zero: 13% do voo ficariam inalcançáveis, consumidos antes de o
       visitante poder rolar. O voo não se via pela metade, porque o começo da
       órbita desce e fica abaixo da dobra, mas era progresso perdido de graça.

       O TETO AGORA É A PRÓPRIA PÁGINA, e não mais a dobra. O centro do álbum
       está a 1017px do topo no celular e a 1140 no desktop, então a maior
       porcentagem com `start` ainda positivo é 120% e 127%. No celular, o
       gatilho sobe de propósito para 135%: cerca de 5% iniciais do percurso
       acontecem antes da primeira rolagem, quando as fotos ainda estão fora da
       tela à direita. Assim o movimento entra em cena mais cedo; o desktop usa
       127%, seu limite seguro para antecipar o voo sem perder o início.

       O QUE A MUDANÇA DE LUGAR CUSTOU E DEU, medido: a ação começa 315px antes
       do enquadramento no celular e 250 no desktop, contra 424 e 435 na posição
       antiga — menos antecedência, porque não há página suficiente acima. Em
       troca o pico de área visível SOBE de 5,1 para 6,0 provas no celular e de
       5,0 para 5,6 no desktop, porque nenhum progresso é gasto com o álbum
       abaixo da dobra. Na posição nova o voo cabe melhor do que cabia.

       O FIM É QUEM DITA A VELOCIDADE, e agora ele foi ESTICADO a pedido.
       Janela mais longa é voo mais lento, porque com scrub velocidade é
       movimento por pixel rolado e não duração — não há duração nenhuma, só
       rolagem. Nada de ease ou de duration resolveria isto: a única alavanca de
       velocidade num scrub é o comprimento da janela.

       O FIM DESCEU E O COMEÇO FICOU. 'bottom Y%' dispara em rolagem = fundo da
       pilha menos Y% da tela, então Y MENOR é mais tarde. Descer o fim sem
       mexer no começo estica a janela pelo lado de baixo, que é o que
       desacelera. E deixa intacto o instante de entrada, que já custou três
       correções em sentidos opostos para ficar onde está.

       Isso ainda tem um efeito de graça: com a janela mais longa, o mesmo ponto
       de rolagem corresponde a um progresso MENOR, então o visitante encontra o
       álbum menos adiantado e vê mais do voo dentro da tela.

       O rabo do voo acontece fora da tela, e tudo bem: nessa altura as provas já
       subiram para fora dela. Os finais em -85% no celular e -125% no desktop
       estendem a janela em cerca de 23%, desacelerando a volta sem atrasar o
       primeiro aparecimento.

       scrub com número, e não true: 0,1 segundo de atraso entre a rolagem e a
       posição. É o que a referência usa, e é o que separa "arrastar figurinha
       com o dedo" de "coisa leve reagindo à rolagem". */
    var linha = gsap.timeline({
      scrollTrigger: {
        trigger: pilha,
        start: celular ? 'center 135%' : 'center 127%',
        end:   celular ? 'bottom -85%'  : 'bottom -125%',
        scrub: 0.1
      }
    });

    /* A FOLGA ALÉM DA BORDA, em larguras de pilha.

       Entra na conta do raio do arco: garante que a ponta do caminho não fique
       ENCOSTADA na borda, onde um arredondamento de subpixel traria a prova de
       volta por um fio no exato instante em que ela deveria ter sumido. */
    var FOLGA_FORA = 0.15;

    /* UMA animação, e não uma por prova. O GSAP interpola UM número, o progresso
       da rolagem, e as sete provas são sete leituras dele, cada uma num ponto
       diferente do mesmo caminho. */
    var corrente = { p: 0 };

    /* QUEM VAI NA FRENTE VAI POR CIMA, e isto é camada, não posição.

       A ordem de pintura padrão é a do HTML: o último irmão cobre o primeiro. A
       líder é o PRIMEIRO elemento, então sem esta linha ela ficava embaixo de
       todas as outras, e medido dava 0% dela visível no álbum parado. Uma prova
       que não aparece não é prova.

       Fora da linha do tempo, de propósito: camada posta dentro de um tween não
       chega a valer no progresso exatamente zero, que foi um defeito medido numa
       versão anterior deste mesmo trecho. Aqui ela é estado fixo, e a ordem da
       corrente não muda durante o voo. */
    provas.forEach(function (prova, i) {
      gsap.set(prova, { zIndex: provas.length - i });
    });

    /* TRÊS TENTATIVAS ENTERRADAS, e ficam registradas para não voltarem.

       1. Desvio CONSTANTE de cada prova em relação à pista, um leque pequeno,
          para abrir o álbum. Desvio constante faz cada prova andar numa
          PARALELA da pista, e paralelas de uma espiral se cruzam: o pico de
          sobreposição no voo foi de 79% para 100%, com invasão do painel.
       2. Desenhar MAIOR quem estava mais fundo, para sobrar borda. A prova maior
          ENGOLE a menor por inteiro: repouso de 80% para 100%.
       3. O álbum no miolo da espiral. O raio do miolo cai com 1/(π u), então as
          provas de trás se apertavam sem limite e a mais funda aparecia 8%.

       As três tinham a mesma causa: tentavam separar cinco fotos que somam 46%
       da tela. O leque não separa, empacota. */

    function posicionar() {
      var u = corrente.p;

      /* A ÓRBITA, montada uma vez por quadro porque depende só da tela.

         K é o quanto a prova precisa estar afastada do centro da célula, na
         horizontal, para estar inteira fora pela DIREITA: meia tela, mais meia
         prova já na escala maior, mais a folga.

         O PISO DO RAIO SAI DAÍ. O ponto mais à direita da órbita é ÁPICE mais
         dois raios, e ele tem de passar de K — senão a prova nunca sai de vista
         e fica rodando meio cortada para sempre, defeito que só apareceria na
         largura de tela que ninguém testou. O piso resolve na hora, em qualquer
         tela, e o número escrito em RAIO continua mandando sempre que couber. */
      var K = telaW / 2 / largura + ESCALA_MAX / 2 + FOLGA_FORA;
      var raio = Math.max(RAIO, (K - APICE) / 2);

      for (var i = 0; i < provas.length; i++) {
        /* ONDE ESTA PROVA ESTÁ NA VOLTA, de 0 na partida a 1 na volta completa.

           Todas partem do mesmo ponto e a diferença é só de RITMO: a de índice
           0 no ritmo 1, a última no ritmo VEL_MAX. É a velocidade que abre a
           fila — quem corre mais adianta a volta, e o espalhamento aparece
           sozinho, sem nenhuma posição fixa por prova.

           TRAVADO NAS DUAS PONTAS, e agora as duas pontas são o MESMO ponto da
           órbita: o extremo direito, fora da tela. Quem termina a volta antes
           fica estacionada lá, invisível, esperando as outras — que é o que
           deixa o voo começar e acabar com as sete fora de vista. E é a trava
           que preserva o VAIVÉM: com o scrub, rolar para trás desfaz a volta
           exatamente. */
        var t = u * (VEL_MIN + (VEL_MAX - VEL_MIN) * i / (provas.length - 1));
        if (t < 0) { t = 0; } else if (t > 1) { t = 1; }

        /* UMA VOLTA INTEIRA, e é isto que substituiu o arco de 220 graus.

           O ângulo é medido a partir do extremo DIREITO da órbita, que é onde a
           prova nasce e para onde ela volta. Meia volta depois ela está no
           extremo esquerdo, o ponto de maior aproximação, e é lá que aparece
           inteira. Entre um e outro ela desce, cruza e sobe.

           (1 + cos) NA HORIZONTAL é o que mantém tudo do lado direito: vale 2 no
           extremo direito e 0 no esquerdo, nunca negativo, então a prova jamais
           passa do ponto de aproximação para a esquerda. O seno manda na
           vertical e troca de sinal na metade da volta, que é a prova deixando
           de descer e passando a subir.

           A ROTAÇÃO NÃO ENTRA AQUI, e é isso que faz a prova deslizar pela
           órbita sem tombar: o lugar vem do percurso, o eixo é TORTO e não muda
           nunca. Prova que gira junto com a órbita lê como pião, e isso já foi
           medido e desfeito uma vez. */
        var ang = 2 * Math.PI * t;
        var cosAng = Math.cos(ang);

        /* A ESCALA TEM PICO NA MAIOR APROXIMAÇÃO, e não no fim da volta. Crescer
           até o fim deixaria a prova maior justamente quando ela sai, o que lê
           como se ela viesse para cima do visitante ao ir embora. Maior no ponto
           mais perto é o que lê como passar perto. */
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

    /* matchMedia desfaz sozinho tween e ScrollTrigger criados aqui dentro, mas
       não ouvinte pendurado à mão. Sem esta linha, trocar de faixa de tela
       empilha uma medição por troca, para sempre. */
    return function () {
      ScrollTrigger.removeEventListener('refreshInit', medirPilha);
    };
  });


  /* ── 7. OS VÍDEOS ─────────────────────────────────────────────────────
     Nenhum vídeo tem o atributo autoplay, e é de propósito. autoplay no markup
     começa a tocar assim que o navegador consegue, esteja o vídeo na tela ou a
     seis mil pixels dela, e continua tocando o tempo todo. Num celular isso é
     bateria e dados gastos em algo que ninguém está vendo.

     Aqui o vídeo toca quando entra na tela e pausa quando sai. E sob movimento
     reduzido não toca nunca: fica no poster, que é um quadro do próprio vídeo,
     então a composição continua inteira e só o movimento sai. */

  gsap.utils.toArray('video').forEach(function (video) {
    if (reduzido) return;

    /* O vídeo do herói é o único que já NASCE na tela, e por isso ele começa a
       tocar aqui, na inicialização, sem esperar gatilho.

       Um ScrollTrigger de 'top bottom' dispara quando o elemento CRUZA a borda
       de baixo da viewport. Quem já está visível no carregamento nunca cruza
       nada, então o onEnter podia não vir e o herói abria com o poster parado.
       O pedido era o vídeo rodando ao fundo em loop, e rodando desde o começo.

       O gatilho continua existindo para os dois: é ele que PAUSA quando o vídeo
       sai da tela, que é o que poupa bateria e dados no celular. */
    if (video.classList.contains('heroi__loop')) {
      video.play().catch(function () {});
    }

    ScrollTrigger.create({
      trigger: video,
      start: 'top bottom',
      end: 'bottom top',
      onEnter:     function () { video.play().catch(function () {}); },
      onEnterBack: function () { video.play().catch(function () {}); },
      onLeave:     function () { video.pause(); },
      onLeaveBack: function () { video.pause(); }
    });
  });


  /* ── 8. A PLANILHA ────────────────────────────────────────────────────
     A navegação pela planilha de regularidade do roteiro.

     Quem constrói a planilha é o CSS: a janela que gruda no topo, as colunas
     alinhadas com a régua, as linhas regradas. Este bloco só faz a janela SABER
     em que referência ela está, que é o que separa uma tabela de uma navegação.

     Por que sticky no CSS e não pin do GSAP: pin injeta um espaçador no DOM,
     recalcula alturas e some se o script falhar. Sticky é uma linha de CSS que
     funciona com o JavaScript desligado. A estrutura fica com quem nunca falha,
     e o efeito com quem pode falhar. Sem este bloco a seção continua sendo uma
     planilha inteira e legível, com as quatro referências à vista; o que se
     perde é só a marcação da linha corrente.

     VALE NAS DUAS LARGURAS, e é diferente do que esta seção fazia antes. A
     versão anterior prendia cada folha em tela cheia e por isso era desktop-only:
     prender a rolagem briga com a barra de URL retrátil do celular, que muda a
     altura da viewport no meio da sequência. A janela de agora tem três linhas de
     altura e não depende de 100svh para nada, então o motivo do recorte deixou
     de existir.

     A MARCAÇÃO É TROCA DE ESTADO, NÃO INTERPOLAÇÃO. Ou a janela está numa
     referência ou está na outra; contador de referência não tem meio-termo. Por
     isso aqui não há tween nenhum: há um ScrollTrigger por linha, e a classe
     entra e sai. Quem suaviza a troca é a transição de cor no CSS, que dura
     var(--dur-estado) e é curta de propósito. */

  var mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', function () {
    var planilha = document.querySelector('.roteiro__janela');
    if (!planilha) return;

    var folhas  = gsap.utils.toArray('.folha');
    var contador = planilha.querySelector('[data-ref-ativa]');
    if (!folhas.length || !contador) return;

    /* A LINHA DE LEITURA É ONDE O OLHO ESTÁ, e não onde a barra está.

       A primeira versão punha a linha logo abaixo da barra grudada, por fidelidade
       ao porta-planilha: o piloto lê na altura da janela. O problema é que uma
       folha aqui tem quase a altura da tela, e com a linha em 156px de uma tela de
       844 a referência só virava corrente quando o topo dela já tinha subido 688px.
       Nesse ponto ela ocupava a tela inteira havia tempo, e o contador ainda dizia
       a anterior. Marcação atrasada.

       Passou primeiro para 42% da altura da tela, e ainda chegava tarde: nesse
       ponto a folha nova já ocupava 58% da tela no celular. Agora está em 58%,
       e a referência acende com a folha ocupando 42%, ou seja ANTES de ela tomar
       a tela. É quando ela passa a ser a coisa que se está lendo.

       O PISO É A BARRA, ONDE ELA GRUDA. Acima de 48rem a barra da planilha gruda,
       e a linha nunca pode ficar por baixo dela, senão a referência marcada seria
       uma que o vidro está tampando. Em tela curta os 42% podem cair ali, e o
       Math.max resolve. No celular a barra não gruda, então não há piso nenhum.

       Ler a posição de grude do CSS, e não getBoundingClientRect, é o que
       derrubou a primeira versão desta função: a ScrollTrigger avalia start e end
       no refresh, e no refresh a página está no topo e a barra ainda não grudou.
       O rect devolvia a posição dela no FLUXO, e dava 1 acerto em 47 posições. */
    var topo = planilha.querySelector('.planilha__topo');
    var FRACAO_LEITURA = 0.58;

    function linhaDeLeitura() {
      var piso = 0;

      if (getComputedStyle(topo).position === 'sticky') {
        /* Os 8px de folga fazem a primeira coisa que aparece por baixo da janela
           já contar como a referência que está sendo lida. */
        piso = (parseFloat(getComputedStyle(topo).top) || 0) + topo.offsetHeight + 8;
      }

      return Math.round(Math.max(piso, window.innerHeight * FRACAO_LEITURA));
    }

    /* A CHEGADA NA REFERÊNCIA, e é aqui que o GSAP entra de verdade.

       A marcação em si continua sendo troca de estado, e o CSS resolve cor,
       recuo e sombra por transição. O que o GSAP acrescenta são as duas coisas
       que transição de CSS não faz bem: um gesto com origem e um número que
       rola.

       AS DUAS SÓ MEXEM EM ELEMENTOS PEQUENOS, e isso é deliberado. A tulipa e o
       dígito do contador não têm papel no layout da linha, então transform neles
       não desloca nada que a ScrollTrigger tenha medido. Foi transform em cima
       da LINHA que derrubou o avanço do papel na rodada passada, e a regra que
       sobrou dali é: profundidade por luz, movimento só no que não carrega
       layout. */

    /* O GLIFO NÃO SE DESENHA MAIS. Havia um segundo tween aqui, por cima do
       pouso, traçando a tulipa via stroke-dasharray/dashoffset herdado através
       do <use> — 550ms extra tentando "explicar" um ícone de 24px que se repete
       só 4 vezes na página. Repetido, o gesto lia como enfeite, não como
       informação: o pouso abaixo já è o estado sendo indicado ("esta é a
       referência ativa agora"); o traçado disputava o mesmo papel com uma
       segunda animação, mais lenta e presa a uma técnica frágil (a herança de
       dasharray por um <symbol> referenciado não é algo que dê pra depurar
       olhando o próprio elemento). Cortado, não ajustado: uma indicação de
       estado pede UM gesto, não dois competindo pela atenção. */

    var animacoesTulipa = new WeakMap();
    var estilosRaiz = getComputedStyle(raiz);
    var duracaoEntradaTulipa = parseFloat(estilosRaiz.getPropertyValue('--dur-estado')) || 200;
    var easeEntradaTulipa = estilosRaiz.getPropertyValue('--ease-revelar').trim();

    function chegou(folha) {
      var tulipa = folha.querySelector('.folha__tulipa');
      if (!tulipa || typeof tulipa.animate !== 'function') { return; }

      /* A tulipa aterrissa pela Web Animations API, em vez de disputar quadros
         com o GSAP enquanto a rolagem atualiza a planilha. A API anima apenas
         transform e opacity na camada de composição, mantendo o surgimento leve
         mesmo durante uma rolagem mais rápida. */
      var anterior = animacoesTulipa.get(tulipa);
      if (anterior) anterior.cancel();

      /* A direção do pouso alterna com a linha, pelo mesmo motivo da alternância
         de colunas: quatro pousos idênticos leem como um só, repetido. Nas
         ímpares vem de cima, que é de onde o papel veio; nas pares vem do lado da
         coluna que a linha ganhou. */
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

    /* O CONTADOR ROLA, como odômetro rola.

       Trocar textContent seco é o que um contador de tabela faz; um odômetro
       gira. O dígito antigo sai para cima e o novo entra por baixo, e a troca do
       texto acontece no meio, com a caixa já fora de vista.

       Sem interpolação de número: 01 e 02 são referências, não quantidades, e
       ver 1,4 no caminho seria mentira sobre o que está sendo lido. */
    function rolarContador(valor) {
      if (contador.textContent === valor) { return; }

      /* O NÚMERO TROCA ANTES DA ANIMAÇÃO, e isto é a correção de um defeito meu.

         A primeira versão trocava o texto NO MEIO da linha do tempo, para o
         dígito velho sair antes de o novo entrar. É mais bonito e põe a verdade
         do contador dentro de um tween: se a animação não roda, ou roda pela
         metade, o número fica velho. Medido em 135 posições de rolagem, o
         contador discordava da referência marcada em 98 delas.

         Contador é informação, não enfeite. O texto entra primeiro, sempre, e o
         deslize decora o que já está certo. Perde-se a saída do dígito velho e
         ganha-se um contador que nunca mente. */
      contador.textContent = valor;

      gsap.fromTo(contador,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: 'power3.out',
          overwrite: true, clearProps: 'transform,opacity' });
    }

    /* A POSIÇÃO DA FOLHA NO DOCUMENTO, POR LAYOUT E NÃO POR RECT.

       offsetTop e offsetHeight ignoram transform; getBoundingClientRect não. E as
       folhas passaram a ter transform, então medir por rect faria a planilha
       morder a própria cauda: no refresh a página está no topo, as quatro folhas
       estão lá embaixo e portanto inclinadas e recuadas, e as faixas de marcação
       sairiam da caixa encolhida.

       Foi medido antes de virar comentário: com as faixas saindo de rect, 29 de
       161 posições de rolagem ficavam sem referência nenhuma marcada. */
    function alturaNoDocumento(el) {
      var y = 0;
      while (el) { y += el.offsetTop; el = el.offsetParent; }
      return y;
    }

    /* Uma referência está ativa quando a linha de leitura cai DENTRO dela.

       start e end devolvem NÚMERO, que a ScrollTrigger lê como posição de rolagem
       crua, e usam a mesma medida. É por isso que as faixas se encostam sem
       sobrar nem faltar: onde uma acaba, a próxima começa. Sem isso existiriam
       posições de rolagem com duas linhas acesas, ou nenhuma. */
    folhas.forEach(function (folha, i) {
      ScrollTrigger.create({
        trigger: folha,
        start:   function () { return alturaNoDocumento(folha) - linhaDeLeitura(); },
        end:     function () { return alturaNoDocumento(folha) + folha.offsetHeight - linhaDeLeitura(); },
        onToggle: function (self) {
          /* O SULCO ANDA NO SENTIDO DA ROLAGEM, e a regra que faz isso é uma só:
             ele fica ancorado na borda onde a LINHA DE LEITURA está neste
             instante. As quatro combinações caem sozinhas dessa frase.

               descendo, acendendo: a linha acabou de entrar pelo topo da folha,
                                    então o traço nasce ali e desce;
               descendo, apagando:  a linha está saindo pelo fundo, e o traço
                                    recolhe para lá;
               subindo,  acendendo: a linha entrou pelo fundo, o traço nasce
                                    embaixo e sobe;
               subindo,  apagando:  a linha sai pelo topo, e o traço recolhe
                                    para o topo.

             Ou seja: acendendo, a âncora é a borda por onde a linha ENTROU;
             apagando, é a borda por onde ela vai SAIR. Nos dois casos é onde ela
             está agora, e é por isso que o traço nunca anda contra o dedo.

             TROCAR transform-origin AQUI NÃO DÁ SALTO, e isso não é sorte: no
             instante em que a classe muda, a escala está em 0 (acendendo, o
             elemento é invisível) ou em 1 (apagando, a matriz é a identidade e a
             origem não altera desenho nenhum). Fora desses dois instantes a
             origem não é tocada. Trocar origem no meio de uma transição, isso
             sim daria salto. */
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

    /* ── O PAPEL TEM PROFUNDIDADE ────────────────────────────────────────
       A dobra da tira no tambor do porta-planilha, e é a parte contínua desta
       seção: começa no instante em que a folha aparece na tela, e não quando ela
       chega na janela.

       POR QUE ISTO NÃO REPETE O ERRO DO AVANÇO DO PAPEL. A tentativa anterior
       deslizava a tira alguns pixels enquanto ela atravessava a janela. A
       ScrollTrigger calcula start e end a partir da posição de LAYOUT das linhas,
       e transform move o desenho sem mexer no layout: com a tira deslocada, a
       faixa que a ScrollTrigger acha que é a referência 02 já não é onde a 02
       está desenhada. Deu duas posições sem marcação e três com a errada.

       O que quebrava era TRANSLAÇÃO. Aqui não há nenhuma: giro em torno do
       centro e recuo em z, que deixam o centro no lugar. E, principalmente, a
       grandeza que comanda o efeito é a distância COM SINAL da linha de leitura
       até a CAIXA da folha, que vale ZERO enquanto a linha está dentro dela. Isso
       é exatamente a condição de estar ativa, então:

         a folha ativa está sempre chapada, com giro e recuo zerados, e a borda
         desenhada dela coincide com a borda de layout;

         na passagem de uma para a outra, a que entra tem o topo na linha e
         também está chapada, então a fronteira que a ScrollTrigger usa continua
         honesta.

       A marcação fica imune ao efeito por construção, e não por sorte. */

    var tira = planilha.querySelector('.roteiro__tira');

    /* A DOBRA É MEDIDA EM PIXELS DE RECUO, E NÃO EM GRAUS, e isto é conserto de
       uma assimetria que ninguém pediu.

       Grau fixo com folha de altura variável não dá dobra igual: a borda longe
       recua altura vezes seno do ângulo, então uma folha de 600px inclinada 11
       graus manda a borda 114px para dentro da tela, contra 66px de uma de 345.
       Somando a isso uma perspectiva mais curta no celular, 900 contra 1400, a
       mesma constante produzia encolhimentos bem diferentes: 20% do tamanho no
       celular contra 11,7% no desktop. O celular dobrava 1,7 vez mais forte.

       Agora o número que manda é o RECUO DA BORDA LONGE, igual em toda largura,
       e o ângulo sai dele: seno do ângulo é recuo dividido pela altura da folha.
       Folha alta dobra menos grau e entrega o mesmo desenho. O teto de 11 graus
       continua, para folha curta não virar leque.

       E a perspectiva é uma só. Ela era mais curta no celular por analogia com a
       distância do olho à tela, o que soa razoável e some com o controle: com
       duas perspectivas, mexer no ângulo conserta uma largura e estraga a
       outra. */
    /* O CELULAR DOBRA MAIS, e agora isso e escolha e nao acidente.

       O primeiro numero, 66, igualava o encolhimento nas duas larguras, e no
       celular ficou timido: ali cabe uma folha e meia na tela, entao a dobra nao
       tem companhia nenhuma para se comparar e le mais fraca do que a mesma
       dobra no desktop, onde tres folhas aparecem juntas em profundidades
       diferentes. Mesma geometria, leitura diferente.

       Isto NAO reabre a armadilha das duas perspectivas. Aquela era ruim porque
       eram dois botoes que se multiplicavam: mexer no angulo consertava uma
       largura e estragava a outra, sem nada avisar. Aqui e um botao so, e ele e
       exatamente a quantidade de dobra que se quer em cada largura. */
    var DOBRA_LONGE = 66;    /* pixels que a borda longe recua; o valor por largura sai abaixo */
    var ANGULO_MAX  = 11;    /* teto em graus, para folha curta não virar leque   */
    var RECUO       = 90;    /* pixels de afastamento em z */
    var VEU         = 0.42;  /* opacidade da tinta sobre o papel afastado */
    var PERSPECTIVA = 1400;

    /* O ALCANCE é em quantos pixels de rolagem a dobra vai de chapada a cheia, e
       é a medida que decide se o efeito se vê ou não.

       A primeira versão usava a altura da tela, e com isso a folha vizinha, que é
       justamente a que está à vista, ficava praticamente chapada: medido, 0,16 e
       0,55 grau nas duas de cima. Só a quarta chegava a 3,6. Efeito nenhum onde o
       olho está.

       O que se vê da planilha é a faixa ABAIXO da linha de leitura, porque acima
       dela está a barra. Então quem tem de dobrar é a folha que sobe, e ela tem de
       chegar chapada. Trezentos e vinte pixels é o que faz a dobra cheia durar até
       ela encostar na janela. */
    var ALCANCE     = 320;

    /* As caixas saem da mesma medida de layout que as faixas de marcação usam.
       Medir por rect aqui criaria realimentação direta: a folha inclinada mediria
       uma caixa menor, o que mudaria o ângulo, que mudaria a caixa. */
    /* ── O SURGIMENTO ────────────────────────────────────────────────────
       A folha não estava mais chegando de repente, mas os pedaços dela sim:
       texto e prova apareciam com o peso inteiro assim que cruzavam a borda de
       baixo da tela. Isto é a ponte que faltava.

       A FOLHA INTEIRA SURGE COMO UMA COISA SÓ. Cabeçalho, texto e prova
       recebem o mesmo valor, tirado das bordas desenhadas da própria folha.

       Isso foi apurado em três rodadas, e cada uma cobrou um pedaço. Primeiro
       eram três grupos com tempos diferentes; no celular texto e prova ficam um
       embaixo do outro, com centros a centenas de pixels de distância, e o que se
       via não eram duas coisas entrando, era a mesma coisa entrando duas vezes.
       Os dois viraram um bloco. Sobrou o cabeçalho medido pelo próprio centro, e
       ele cobrou o resto: medido em 1129px de rolagem, a folha 01 estava ATIVA,
       com o corpo em opacidade 1 e o topo dele à vista em y=105, e o cabeçalho
       dela em ZERO. O número da referência, a tulipa e a etapa sumiam enquanto a
       linha estava sendo lida.

       A causa é ter duas réguas na mesma folha: o cabeçalho fica no alto dela,
       então o centro dele cruza a faixa de saída muito antes do fundo do bloco.
       Duas medidas diferentes na mesma coisa sempre acabam discordando; a
       correção é ter uma só.

       A alternância de ordem continua, e é ela que quebra a repetição entre as
       quatro linhas: nas pares a prova vem antes do texto, na página. O que
       alterna é POSIÇÃO, nunca tempo.

       OPACIDADE VAI NOS FILHOS, NUNCA NA FOLHA. Opacidade menor que 1 achata o
       3D do elemento: com ela na folha, o preserve-3d morre e a prova volta a
       ficar colada no papel. Nos filhos não custa nada, porque nenhum deles tem
       plano dentro.

       E O TRANSFORM VAI DIRETO NO ELEMENTO, e não por variável herdada do pai:
       variável no pai lida no transform do filho força recálculo de estilo em
       todos os filhos a cada quadro. */

    /* A JANELA DO SURGIMENTO TEM DE CABER ACIMA DA LINHA DE LEITURA, e este é o
       número que amarra as duas coisas. A folha entra pela borda de baixo e vira
       corrente quando o topo dela cruza a linha; se o surgimento ainda estiver
       correndo nesse ponto, a referência acende com o texto dela translúcido, que
       é a mesma queixa de chegar atrasado, agora por outro caminho.

       Medido com 260 e 110: o último grupo só ficava cheio com o centro em 43% da
       tela, contra a linha em 58%. Com 200 e 70 o pior caso soma 340px de percurso
       contra os 354 que sobram no celular, e os 378 do desktop. Cabe nos dois. */
    /* O PERCURSO ENCURTOU DE 200 PARA 120, e isso conserta duas queixas com um
       número só, porque as duas são o mesmo número visto de dois lados.

       O bloco é medido pelas bordas, então o percurso decide TAMBÉM a que
       distância da borda da tela a coisa começa a apagar: com 200, o bloco entrava
       em desbotamento assim que o fundo dele chegava a 200px da barra, ou seja com
       264px de tela ainda mostrando texto legível. Sumia cedo. Com 120, ele só
       começa a apagar com 184px de tela restando, e some em 120px de rolagem em
       vez de 200: mais tarde e mais rápido, que é exatamente o pedido.

       O teto continua sendo a linha de leitura: percurso mais atraso tem de caber
       nos 354px entre a borda de baixo e ela. Com 120 mais 40 são 160, contra os
       340 de antes. Sobra folga de sobra. */
    var SURGIR = 120;   /* em quantos pixels de rolagem o grupo aparece  */
    var ALCA   = 20;    /* de quanto abaixo o grupo sobe ao aparecer     */

    var caixas = [];
    var topoUtil = 0;

    function medirCaixas() {
      DOBRA_LONGE = window.innerWidth < 768 ? 88 : 66;

      /* A borda de cima ÚTIL não é o topo da tela: é onde o conteúdo deixa de
         ser visto, embaixo da barra da página e, onde ela gruda, embaixo da
         barra da planilha. É ali que o surgimento tem de terminar de sumir. */
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
          /* O ângulo desta folha sai da altura dela, para a borda longe recuar
             sempre os mesmos pixels. */
          angulo: Math.min(ANGULO_MAX,
                    Math.asin(Math.min(1, DOBRA_LONGE / alto)) * 180 / Math.PI),
          cabeca: gsap.utils.toArray(folha.querySelectorAll(
            '.folha__ref, .folha__tulipa, .folha__dia, .folha__etapa')),
          corpo: corpo,
          prova: prova
        };
      });
    }

    /* Suave nas duas pontas: sem isto o grupo começa a aparecer com a derivada
       cheia e o olho pega o instante em que a opacidade saiu do zero. */
    function suavizar(v) {
      if (v <= 0) { return 0; }
      if (v >= 1) { return 1; }
      return v * v * (3 - 2 * v);
    }

    /* A TIRA É EMENDADA, e não quatro cartões soltos.

       Girando cada folha em torno de um pivo fixo, a borda de baixo de uma se
       afasta da borda de cima da seguinte. Prender o pivo na costura vizinha à
       ativa resolveu as duas costuras que encostam nela, e só: no desktop cabem
       três folhas na tela, e entre as duas de baixo, que são inativas, a fresta
       media 47,8px.

       Então cada folha é POSTA onde a anterior terminou de ser DESENHADA. A
       âncora é a folha que contém a linha de leitura, que está chapada e no lugar
       do layout, e a corrente sai dela para os dois lados. A vizinha da âncora
       sempre cai com deslocamento zero, porque a âncora não encolheu, e é por isso
       que a troca de referência nunca dá tranco: a folha que vai virar ativa já
       chega em zero.

       ISTO É TRANSLAÇÃO, que foi o que derrubou o avanço do papel. A diferença é
       que agora as faixas de marcação saem de offsetTop, e não de rect, então
       deslocar o desenho não mexe em nada que a ScrollTrigger tenha medido. E a
       folha ativa, que é a única cuja borda desenhada precisa bater com a linha,
       tem deslocamento zero por construção.

       A CONTA. Com transform-origin no pivo, um ponto a v pixels dele vai parar,
       na tela, em (v cos t + y) * p / (p + Z - v sen t), e o próprio pivo em
       y * p / (p + Z). Os dois são exatos, e é por isso que a emenda fecha:
       o y necessário para pôr o pivo no lugar certo sai de dividir pelo segundo,
       e a borda oposta sai do primeiro. */

    var grausEmRad = Math.PI / 180;

    function dobrar(posicao) {
      /* A MEDIDA VEM ANTES DO DESENHO, SEMPRE.

         caixas nasce vazio e só é preenchido no refresh, mas onUpdate pode chegar
         primeiro: basta a ScrollTrigger emitir uma atualização de rolagem antes de
         rodar o onRefresh deste gatilho, ou o contexto do matchMedia ser refeito
         numa troca de faixa de tela. Aí caixas[i] é undefined e a linha seguinte
         estoura dentro do laço da ScrollTrigger.

         Isso apareceu como "Cannot read properties of undefined (reading 'topo')"
         no console, com a pilha dentro do gsap.min.js, e é exatamente a classe de
         defeito que já derrubou o botão da logo: exceção dentro de callback aborta
         o resto do quadro sem avisar ninguém.

         Não é só uma guarda: se falta medida, ela é tirada aqui e o desenho segue
         certo, em vez de o quadro sair errado em silêncio. */
      if (caixas.length !== folhas.length) { medirCaixas(); }
      if (!caixas.length) { return; }

      var linha = posicao + linhaDeLeitura();
      var n = folhas.length;
      var i, c, d, k;

      var angulo = [], recuo = [], forca = [], pivoNoTopo = [];

      for (i = 0; i < n; i++) {
        c = caixas[i];

        /* Positivo: a folha ainda está abaixo da linha, subindo. Negativo: já
           passou por cima. Zero: a linha está dentro dela, que é estar ativa. */
        d = linha < c.topo  ? (c.topo  - linha) / ALCANCE
          : linha > c.fundo ? (c.fundo - linha) / ALCANCE
          : 0;

        k = gsap.utils.clamp(-1, 1, d);
        /* Quadrática com sinal: a derivada é zero no encontro, então a folha sai
           do plano sem tranco quando a linha acaba de deixar a caixa dela. */
        k = k * Math.abs(k);

        forca[i]  = Math.abs(k);
        /* k positivo afunda a base, que é a folha ainda deitada no tambor de
           baixo; k negativo afunda o topo, que é ela enrolando por cima. */
        angulo[i] = -c.angulo * k * grausEmRad;
        recuo[i]  = RECUO * forca[i];
        /* O pivo é sempre a borda virada para a linha de leitura. */
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

        /* O centro desenhado de cada grupo sai de interpolar a fração de layout
           dentro da caixa desenhada da folha. A folha inteira está deslocada pela
           emenda da tira, às vezes em centenas de pixels, então usar a posição de
           layout aqui faria o texto sumir com a folha ainda à vista. */
        /* A folha acende quando o topo DESENHADO dela entra pela borda de baixo e
           só apaga quando o fundo DESENHADO sai pela de cima. Desenhado, e não de
           layout: a emenda da tira desloca a folha em até centenas de pixels, e
           medir pelo layout faria o texto sumir com a folha ainda à vista. */
        var vFolha = suavizar(Math.min(
          (telaFundo - topoDesenhado[i]) / SURGIR,
          (fundoDesenhado[i] - telaTopo) / SURGIR
        ));

        gsap.set(c.cabeca, { opacity: vFolha });
        gsap.set(c.corpo, { opacity: vFolha, y: (1 - vFolha) * ALCA });
        /* z: 28 repetido de propósito. A prova mora num plano acima do papel, e
           escrever transform aqui apaga o translateZ que vem da folha de estilo. */
        gsap.set(c.prova, { opacity: vFolha, y: (1 - vFolha) * ALCA, z: 28 });
      }
    }

    if (tira) {
      ScrollTrigger.create({
        trigger: tira,
        /* Começa quando a tira encosta na borda de baixo da tela, e é esse o
           conserto do "começa atrasado": antes a primeira coisa a acontecer era a
           marcação na janela, 688px de rolagem depois da folha aparecer. */
        start: 'top bottom',
        end:   'bottom top',
        onRefresh: function (self) { medirCaixas(); dobrar(self.scroll()); },
        onUpdate:  function (self) { dobrar(self.scroll()); },
        onToggle:  function (self) {
          planilha.classList.toggle('roteiro__janela--voando', self.isActive);
        }
      });
    }

    /* A janela mede a si mesma no refresh, e não a cada quadro: a barra só muda
       de altura quando a faixa de tela muda, e aí a ScrollTrigger já refresca
       sozinha. Sem isto, uma troca de largura deixaria a linha de leitura no
       lugar antigo. */
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

  /* ── FECHAMENTO ────────────────────────────────────────────────────────
     A fonte de display troca depois da primeira pintura (font-display: swap), e
     a troca muda a altura de todo título da página. Sem este refresh, cada
     gatilho continuaria apontando para a posição que o texto tinha ANTES da
     fonte chegar, e a revelação dispararia no lugar errado.

     É o mesmo motivo pelo qual o portão existe em index.html: a janela entre a
     primeira pintura e a chegada da fonte real é onde o layout se reacomoda.

     ── RECONSTRUÍDO EM 2026-08-28, E A NOTA FICA ─────────────────────────

     Este bloco foi apagado por engano junto com a animação do ônibus: o corte
     procurou o fechamento errado e levou o FECHAMENTO junto, deixando uma chave
     órfã que só apareceu no `node --check`. O projeto não tem um único commit,
     então não havia de onde restaurar o texto original.

     O QUE ESTÁ AQUI É RECONSTRUÇÃO, não o original. O comportamento veio de
     duas fontes que sobreviveram: o comentário do portão em index.html, que diz
     por extenso "é o mesmo motivo pelo qual roadbook.js dá um
     ScrollTrigger.refresh() no document.fonts.ready", e o fragmento do
     comentário que ficou visível antes do corte. Se a versão original tinha
     alguma guarda ou passo a mais, ele se perdeu e ninguém tem como saber.

     A lição, que já apareceu duas vezes nesta sessão por outros caminhos: em
     repositório sem commit, todo corte automatizado é irreversível. Conferir
     balanço de chaves ANTES de gravar, não depois. */
  document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
})();
