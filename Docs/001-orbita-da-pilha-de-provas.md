# 001. Fazer as fotos da pilha orbitarem em arco, e não deslizarem em reta

- **Status**: DONE (executado em 2026-08-23)
- **Commit**: o projeto não é repositório git; escrito em 2026-08-23, contra o
  estado atual de `assets/js/roadbook.js` (seção 5, linhas 342 a 418) e
  `assets/css/estilo.css` (linhas 1525 a 1560)
- **Severity**: MEDIUM
- **Category**: Physicality & origin
- **Estimated scope**: 2 arquivos, cerca de 40 linhas alteradas

## Problem

A pilha de provas da seção de oferta deveria ter as fotos rodeando umas às
outras, como folhas no ar, que é o que o site de referência faz. Hoje cada foto
percorre uma **linha reta**.

Isso não é impressão: foi medido no navegador, amostrando o centro de cada foto
em 9 pontos do percurso do scrub e comparando com a reta que liga o primeiro
ponto ao último.

| Foto | Comprimento do percurso | Desvio máximo da reta |
|---|---|---|
| 1 | 67,0px | **0,05px** |
| 2 | 66,3px | **0,06px** |
| 3 | 66,0px | **0,03px** |

Um desvio de 0,06px em 66px de percurso é uma reta. Não há arco nenhum.

A causa está na estrutura do tween. `assets/js/roadbook.js:391-416`, atual:

```js
    var voos = [
      { de: { xPercent: -10, yPercent:   6, rotation:  -8 },
        ate:{ xPercent:  -3, yPercent: -10, rotation: -17 } },
      { de: { xPercent:   7, yPercent:  -7, rotation:   5 },
        ate:{ xPercent:  10, yPercent:  10, rotation:  16 } },
      { de: { xPercent:  -2, yPercent:  11, rotation:  12 },
        ate:{ xPercent: -12, yPercent:  -3, rotation:   1 } }
    ];

    var linha = gsap.timeline({
      scrollTrigger: {
        trigger: pilha,
        start: 'top 88%',
        end: 'bottom 12%',
        scrub: true
      }
    });

    provas.forEach(function (prova, i) {
      var voo = voos[i % voos.length];
      linha.fromTo(prova, voo.de, {
        xPercent: voo.ate.xPercent,
        yPercent: voo.ate.yPercent,
        rotation: voo.ate.rotation,
        ease: 'none'
      }, 0);
    });
```

`xPercent` e `yPercent` são interpolados de forma independente e linear, então o
centro do elemento percorre o segmento de reta entre os dois pontos. O canal de
`rotation` é separado, então a foto **gira no próprio eixo enquanto desliza em
linha reta**, que é a diferença exata entre "girar" e "rodear".

Piorando: o GSAP compõe as transformações de um elemento na ordem
`translate` depois `rotate` depois `scale`. Numa peça só, `x` mais `rotation`
sempre produz "desloca e depois gira no lugar". Órbita exige a ordem inversa,
`rotate` e depois `translate`, e essa ordem não é alcançável num elemento único
pelo GSAP.

## Target

Órbita de verdade, com **dois elementos aninhados**, que é a forma de obter
`rotate` antes de `translate` sem plugin nenhum:

- o `<li>` gira em torno do centro do conjunto. O `transform-origin` dele é o
  centro, que já é o padrão, e coincide com o centro da pilha porque as três
  fotos dividem a mesma célula de grade (`grid-area: 1 / 1`);
- o `<figure class="placa">` dentro dele fica **deslocado do centro** por um
  raio fixo em CSS. Como o pai gira, o filho descreve um círculo em torno do
  centro do conjunto;
- o `<figure>` também recebe um giro próprio, pequeno, para a inclinação da foto
  mudar enquanto ela orbita, em vez de parecer parafusada no braço de um
  relógio.

Valores exatos.

CSS, posição de repouso de cada foto dentro do próprio `li`, que é o raio da
órbita:

```css
/* alvo: assets/css/estilo.css, dentro da seção da pilha */
.oferta__grade--pilha li:nth-child(1) .placa { transform: translate(-11.3%, -4.1%); }
.oferta__grade--pilha li:nth-child(2) .placa { transform: translate(  8.4%, -7.1%); }
.oferta__grade--pilha li:nth-child(3) .placa { transform: translate(  2.3%, 12.8%); }
```

Esses três pares são raio e ângulo em coordenadas polares, convertidos para
deslocamento cartesiano: foto 1 em 12% de raio a 200 graus, foto 2 em 11% a 320
graus, foto 3 em 13% a 80 graus. Três posições espalhadas em volta do mesmo
centro.

JavaScript, o arco de cada uma:

```js
/* alvo: assets/js/roadbook.js, no lugar do array voos e do forEach */
    var orbitas = [
      { de: -26, ate:  26, giroDe: -7, giroAte:  4 },
      { de:  30, ate: -30, giroDe:  5, giroAte: -6 },
      { de: -18, ate:  38, giroDe: 11, giroAte:  2 }
    ];

    var linha = gsap.timeline({
      scrollTrigger: {
        trigger: pilha,
        start: 'top 88%',
        end: 'bottom 12%',
        scrub: true
      }
    });

    provas.forEach(function (prova, i) {
      var orb = orbitas[i % orbitas.length];
      var placa = prova.querySelector('.placa');

      linha.fromTo(prova, { rotation: orb.de },
                   { rotation: orb.ate, ease: 'none' }, 0);

      if (placa) {
        linha.fromTo(placa, { rotation: orb.giroDe },
                     { rotation: orb.giroAte, ease: 'none' }, 0);
      }
    });
```

Os arcos são de 52, 60 e 56 graus, e **em sentidos diferentes**: a foto 2 orbita
ao contrário das outras duas. É isso que faz o conjunto parecer se agitando em
vez de girar como um prato.

`ease: 'none'` nos dois tweens, porque quem faz a curva do tempo é o scrub, ou
seja, o dedo de quem rola.

## Repo conventions to follow

- **O relógio é um só.** Toda animação ligada à rolagem sai do GSAP com
  ScrollTrigger, nunca de `animation-timeline`, `IntersectionObserver` ou
  ouvinte de `scroll`. O porquê está no cabeçalho de
  `assets/js/roadbook.js:1-27`.
- **Nada de plugin novo.** Só `gsap` e `ScrollTrigger` estão vendorizados em
  `assets/js/`, e a página não carrega nada de CDN. O MotionPathPlugin
  resolveria órbita numa linha e **não é uma opção**: exigiria um arquivo novo.
- **As transformações da pilha são do JavaScript, e o CSS cuida da caixa.** Está
  escrito em `assets/css/estilo.css:1557-1565`. Este plano abre uma exceção
  única e declarada: o deslocamento de raio do `.placa` fica no CSS porque é
  posição de repouso e nunca é animado. Escreva o comentário explicando isso, no
  mesmo tom do arquivo.
- **Curvas e durações vêm dos tokens** em `assets/css/estilo.css:196-204`
  (`--ease-saida`, `--dur-estado`, `--dur-toque`). Aqui não se aplicam, porque o
  scrub não tem duração própria, mas não invente curva nova em lugar nenhum.
- **Exemplar a imitar**: `assets/js/roadbook.js:342-418`, a própria seção 5. Ela
  já tem a estrutura certa (matchMedia com movimento reduzido, classe adicionada
  pelo JS, timeline com scrub); o que muda é só o conteúdo dos tweens.

## Steps

1. `assets/css/estilo.css`: depois da regra
   `.oferta__grade--pilha li:nth-child(n)` (linha 1550), acrescentar as três
   regras de `.placa` do bloco **Target**, com um comentário curto explicando
   que aquele deslocamento é o raio da órbita e que ele fica no CSS por ser
   repouso e nunca ser animado.
2. `assets/js/roadbook.js`: substituir o array `voos` (linhas 391-398) pelo
   array `orbitas` do bloco **Target**.
3. `assets/js/roadbook.js`: substituir o corpo do `provas.forEach` (linhas
   409-416) pelo do bloco **Target**, com os dois `fromTo`.
4. `assets/js/roadbook.js`: atualizar o comentário das linhas 383-390, que hoje
   descreve trajetórias que se cruzam em reta. Ele precisa dizer que a órbita
   sai de dois elementos aninhados e por que um elemento só não dá conta,
   incluindo a ordem `translate`, `rotate`, `scale` do GSAP.
5. Reler o comentário de `assets/css/estilo.css:1557` ("AS POSIÇÕES DE REPOUSO
   NÃO ESTÃO AQUI") e ajustá-lo para registrar a exceção do passo 1, em vez de
   deixá-lo contradizendo o código.

## Boundaries

- NÃO tocar em nenhuma outra seção de `roadbook.js`: mapa, portão, revelações,
  vídeos, tira e volta ao topo estão fora do escopo.
- NÃO mexer no `index.html`. A estrutura `li > figure.placa > picture > img` já
  existe e é suficiente; este plano não precisa de wrapper novo.
- NÃO adicionar dependência, plugin do GSAP ou arquivo em `assets/js/`.
- NÃO alterar `start`, `end` nem `scrub` do ScrollTrigger.
- NÃO alterar a condição `matchMedia('(prefers-reduced-motion: no-preference)')`
  nem o fallback em grade.
- NÃO mexer em opacidade: as três fotos ficam visíveis o percurso inteiro, e
  isso é decisão firmada com o usuário.
- Se algum trecho não bater com o que está no arquivo, PARE e relate em vez de
  improvisar.

## Verification

- **Mecânica**: não há build nem typecheck neste projeto. Confira o equilíbrio
  sintático antes de abrir o navegador:

  ```bash
  python -c "import io;s=io.open('assets/js/roadbook.js',encoding='utf-8').read();print(s.count('{')==s.count('}'), s.count('(')==s.count(')'))"
  ```

  esperado `True True`. O mesmo para `assets/css/estilo.css`, comparando só as
  chaves.

- **Curvatura, que é o ponto deste plano**: com a página aberta em
  `http://localhost:5173`, rodar no console a sonda abaixo. Ela amostra o centro
  de cada foto ao longo do scrub e mede o desvio em relação à reta.

  ```js
  (() => { const g = document.querySelector('.oferta__grade');
    const li = [...g.children];
    const t = ScrollTrigger.getAll().filter(x => x.trigger === g)[0];
    const c = li.map(() => []);
    for (let p = 0; p <= 1.001; p += 0.125) {
      window.scrollTo(0, Math.round(t.start + (t.end - t.start) * p));
      ScrollTrigger.update();
      const b = g.getBoundingClientRect();
      li.forEach((e, i) => { const r = e.getBoundingClientRect();
        c[i].push([r.left + r.width/2 - b.left, r.top + r.height/2 - b.top]); });
    }
    return c.map(pts => { const [x0,y0] = pts[0], [x1,y1] = pts[pts.length-1];
      const dx = x1-x0, dy = y1-y0, L = Math.hypot(dx,dy) || 1;
      let m = 0; pts.forEach(([x,y]) => { m = Math.max(m, Math.abs((x-x0)*dy-(y-y0)*dx)/L); });
      return { comprimento: +L.toFixed(1), desvio: +m.toFixed(2),
               fracao: +(m/L*100).toFixed(1) + '%' }; });
  })()
  ```

  Hoje esse desvio é de 0,03 a 0,06px, ou seja, 0,1% do percurso. Com a órbita
  de 52 a 60 graus, a flecha do arco tem de ficar entre **8% e 20%** do
  comprimento medido. Abaixo de 5% a trajetória ainda é reta demais e o plano
  não foi cumprido.

- **Sem regressão de largura**: rodar em viewport de 390 por 844 e conferir que
  a página não ganhou rolagem lateral:

  ```js
  (() => { const y = scrollY; window.scrollTo(400, y); const x = scrollX; window.scrollTo(0, y); return x; })()
  ```

  esperado `0`. A órbita aumenta a extensão horizontal do conjunto; se passar
  disso, reduza o raio das três regras de CSS proporcionalmente, nunca o arco.

- **Sem regressão de visibilidade**: no meio do percurso, as três fotos com
  opacidade 1.

- **Feel check**, que é o que o código não decide: abrir em
  `http://localhost:5173`, rolar até a seção de oferta devagar e confirmar que
  as fotos **contornam** umas às outras, e não deslizam em paralelo. No painel
  Animations do DevTools, reduzir a velocidade para 10% e acompanhar o centro de
  uma foto: ele tem de desenhar uma curva visível. Repetir num aparelho real,
  porque o scrub responde ao dedo e não ao mouse.

- **Movimento reduzido**: ligar `prefers-reduced-motion` no painel Rendering,
  recarregar, e confirmar que a seção volta à grade de três colunas, sem órbita.

- **Done when**: a fração de desvio fica entre 8% e 20% nas três fotos, a
  rolagem lateral continua em 0 a 390px de largura, o fallback em grade continua
  intacto e o console está limpo.


## Execução

Feito em 2026-08-23. Uma alteração em relação ao especificado, e o motivo:

**O raio saiu na propriedade `translate`, e não em `transform: translate()`.**
O plano especificava `transform`, e isso teria criado o próprio problema que a
seção do CSS já documentava: o GSAP escreve rotação em `transform`, leria a
matriz deixada pelo CSS, converteria porcentagem em pixel e congelaria o raio em
número fixo no primeiro redimensionamento de tela. Em propriedades separadas os
dois convivem e o raio continua acompanhando o tamanho da foto. O resultado
visual é idêntico, porque a órbita vem da rotação do PAI, não da ordem de
composição do filho. `CSS.supports('translate', '10% 5%')` confirmado no
navegador.

### Verificação

| Critério | Alvo | Medido |
|---|---|---|
| Curvatura, foto 1 | 8% a 20% | **11,5%** |
| Curvatura, foto 2 | 8% a 20% | **13,4%** |
| Curvatura, foto 3 | 8% a 20% | **12,5%** |
| Rolagem lateral a 390px | 0 | **0** |
| Opacidade no meio do percurso | 1, 1, 1 | **1, 1, 1** |
| Fallback em grade | 3 colunas, z 1/3/2 | **111/125/111px, z 1/3/2** |
| Raio fora da pilha | nenhum | **translate: none nas três** |
| Console | limpo | **limpo** |

Antes da mudança a curvatura era de 0,1%, ou seja, reta.

### Observação para quem for ajustar depois

A sangria horizontal do conjunto cresceu: num aparelho de 390px as fotos agora
passam da borda por cerca de 55px de cada lado, contra 10 e 26 antes. É simétrico
e não gera rolagem lateral, mas se ficar demais, o dial é reduzir
proporcionalmente os três raios das regras de `.placa` no CSS, nunca o arco.


## Correção posterior, no mesmo dia

A primeira execução cumpriu o critério de curvatura do plano e ainda assim
**estava errada aos olhos**: as fotos liam como piões, não como órbita. O plano
tinha um furo, e ele era meu.

**O que faltava: a contra-rotação.** Girar o `<li>` carrega a orientação do
filho junto. A foto acompanhava o braço nos 52 graus do arco enquanto o centro
dela percorria só 45px. O giro dominava a percepção e o deslocamento sumia. É
gôndola de roda-gigante: a roda gira, e o assento precisa ficar de pé.

**E o raio era pequeno demais.** 12% do tamanho da foto dá um percurso curto
demais para competir com um giro de meia centena de graus.

Duas mudanças:

1. o raio dobrou, de 12% para 24% (as três regras de `translate` no CSS);
2. a `.placa` passou a contra-girar o braço. Os pares no `roadbook.js` deixaram
   de ser "giro da foto" e passaram a ser **inclinação desejada na tela**, e o
   código subtrai o braço dela: `rotation: orb.inclinaDe - orb.de`.

### Verificação da correção

| Critério | Antes da correção | Depois |
|---|---|---|
| Percurso do centro (celular, foto de 308px) | 45px | **74, 68 e 80px** |
| Percurso do centro (desktop, foto de 384px) | não medido | **92, 85 e 100px** |
| Curvatura | 11,5 a 13,4% | **13,4% nas três** |
| Variação da inclinação na tela | 52 a 63 graus | **4 a 5 graus** |
| Sangria a 390px | 55 e 53px | **50 e 39px** |
| Invasão do painel de preço | não medido | **0px** |
| Rolagem lateral | 0 | **0** |
| Console | limpo | **limpo** |

A inclinação variando 4 graus em vez de 52 é a diferença entre a foto rodar no
próprio eixo e a foto contornar um ponto.

### Nota de medição

Uma leitura de "1px de percurso" no desktop era artefato: eu tinha
redimensionado a janela sem recarregar, e o layout do celular ficou pendurado
no cache do GSAP. Em carga limpa, e também redimensionando de 1440 para 1100 sem
recarregar, o percurso se mantém em 92, 85 e 100px.

---

## Segunda rodada, ainda no mesmo dia

Pedido do cliente, depois de ver a órbita corrigida rodando: as imagens deveriam
**se alterar** enquanto giram, a animação deveria ser **mais rápida**, as fotos
estavam **grandes demais no celular** e as posições podiam ficar **mais
deslocadas**. Isto passa do escopo original do plano, que era só trocar deslize
por órbita, e por isso fica registrado aqui em vez de virar plano novo.

Quatro mudanças, mais duas correções que elas provocaram.

1. **Revezamento na frente.** `z-index` numerado, com troca a um terço e a dois
   terços do percurso, mais uma escala de 0,93 a 1 que faz cada prova estar no
   tamanho cheio no instante em que assume a frente. Sem a escala a troca de
   camada seria um pisca entre duas fotos do mesmo tamanho.
2. **Velocidade.** A janela de rolagem passou de `top 88% / bottom 12%` para
   `top 78% / bottom 40%`, o que no celular a leva de 950 para 577px, e o arco
   subiu de 60 para 76 graus. Multiplicado: 2,1 vezes mais giro por pixel.
3. **Foto menor no celular.** 88% para 70% da largura, ou seja, de 308 para
   245px. O desktop não muda, porque o teto de 24rem já cortava em 384.
4. **Raio maior.** De 24% para 34% do tamanho da foto.

### As duas correções que isso provocou

**A ordem de repouso.** Uma marcação de `z-index` na posição zero da linha do
tempo não renderiza quando o cabeçote está exatamente em zero. Medido: os três
`li` com `z-index: auto` em progresso 0, e 10 no primeiro já em 0,05. O que se
via era a terceira foto por cima por um instante no começo da seção. A ordem de
repouso saiu para um `gsap.set` fora da linha do tempo, e dentro dela ficaram só
os dois revezamentos.

**A caixa da pilha.** A grade mede uma foto; o que orbita transborda a célula em
33% da largura para cima e 43% para baixo. Com o raio maior, a prova mais baixa
entrava 40px dentro do painel de preço no meio da órbita e 20px já em repouso, e
no desktop a mais alta passava 30px acima da borda da seção, caindo no escuro
fora da placa clara. As folgas agora saem de `min(70%, 24rem)`, a mesma
expressão da largura.

Também entrou `isolation: isolate` na pilha. Sem ela um `li` com `z-index: 22`
disputa camada com a página inteira; hoje a conta dá certo por acaso (barra 40,
mapa 30, botão 50, portão 100) e é por isso que precisa ser fechada agora.

### Verificação

| Medida | Antes desta rodada | Depois |
|---|---|---|
| Largura da foto no celular | 308px | **245px** |
| Percurso do centro, celular | 74, 68 e 80px | **103, 94 e 111px** |
| Percurso do centro, desktop | 92, 85 e 100px | **161, 147 e 174px** |
| Curvatura | 13,4% | **17,2% nas três, celular e desktop** |
| Janela de rolagem, celular | 950px | **577px** |
| Janela de rolagem, desktop | 1068px | **784px** |
| Variação da inclinação na tela | 4 a 5 graus | **4 a 5 graus** |
| Quem está na frente | sempre a terceira | **0 a 1/3, 1 a 2/3, 2 até o fim** |
| Invasão do painel de preço | 0px | **0px, com 57px de folga** |
| Folga acima da borda da seção | não medida | **27px celular, 28px desktop** |
| Sangria lateral a 390px | 50 e 39px | **22 e 10px** |
| Rolagem lateral | 0 | **0** |
| Console | limpo | **limpo** |
| Grade sob movimento reduzido | intacta | **intacta, sem padding, margem ou isolation** |

Os 17,2% de curvatura são o valor exato da flecha sobre a corda de um arco de 76
graus. As três baterem no mesmo número, nas duas larguras de tela, é a prova de
que são arcos de círculo.

---

## Encerramento: o plano foi SUPERADO

A órbita saiu da página. O cliente comparou com o site de inspiração e o
veredito foi que estava completamente errado, e ele tinha razão pelo motivo de
fundo, não pelo acabamento.

**O defeito era de origem, e era meu.** Este plano especificou órbita de raio
FIXO. Raio fixo nunca abre: se a distância ao centro não muda, o conjunto não se
espalha, e sem espalhar não existe rajada, existe carrossel. As duas rodadas
anteriores afinaram um carrossel cada vez melhor medido. Percurso de 111px,
curvatura de 17,2% nas três, inclinação variando 4 graus: números bons de um
modelo errado.

**O que a referência faz de verdade**, lido no bundle dela e não estimado no
olho: cada foto tem um objeto com progresso e raio; ângulo = fase + progresso ×
π, posição = (cos ângulo × raio, sen ângulo × raio), e o RAIO É MULTIPLICADO por
um fator ao longo do mesmo tempo. Meia volta com raio crescente, escala de 0,7 a
0,9, atraso pequeno entre uma foto e a seguinte, `scrub` numérico. E nenhum giro
próprio: a inclinação de cada foto é fixa do começo ao fim.

Ou seja, este plano errou nos dois eixos do modelo: prescreveu raio constante
onde a referência faz raio crescente, e prescreveu giro com contra-rotação onde a
referência não gira nada.

A lição que vale registrar para o próximo plano: **quando existe uma referência
executável, ler o código dela vem ANTES de especificar o comportamento.** Este
plano foi escrito a partir de quadros de vídeo, e quadro de vídeo mostra o que
acontece sem mostrar o que governa.

O desenho que substituiu está documentado no README, na seção "As provas ao
vento", e no cabeçalho da seção 5 do `roadbook.js`. Nada deste plano continua no
código: os raios em `translate`, a contra-rotação, os pares de ângulos e a folga
proporcional da caixa foram todos removidos.

**Status: SUPERSEDED.**
