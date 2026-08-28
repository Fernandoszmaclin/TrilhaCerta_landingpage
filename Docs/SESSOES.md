# Registro de sessões

Um arquivo corrido. **Cada sessão acrescenta uma entrada no topo**, nunca
reescreve as anteriores: o que deu errado é tão útil quanto o que deu certo, e
uma tentativa enterrada sem registro é uma tentativa que alguém vai repetir.

Formato de cada entrada: o que foi pedido, o que mudou, o que foi medido, o que
falhou, e o que ficou em aberto.

---

## 2026-08-28 — o arco vira órbita, começa mais cedo, e o álbum muda de lugar

### O que foi pedido

*"Quero fazer uma animação no meu landingpage de 'arco', onde as imagens
aparecem no lado direito (sangrados do lado de fora da tela) e desaparecem
(também sangrando para fora da tela)."* Com a mesma referência de sempre
(sanrita.ca/en/about) e **duas imagens anexadas**.

**As imagens não chegaram.** A mensagem entrou só com texto. Registrado aqui
porque muda o grau de confiança do que foi feito: a geometria abaixo saiu da
descrição escrita, não do desenho, e um desenho pode mostrar um arco de outra
forma — deitado, invertido na vertical, ou com as pontas em alturas diferentes.

### O que mudou

Uma linha, e nada mais. O modelo de arco-caminho da rodada anterior já fazia
tudo o que foi pedido — aparecer de fora da tela, cruzar em arco, sumir de fora
da tela — **menos o lado por onde entra**. Ele entrava pela esquerda.

```js
var ang = -ARCO_ABERTURA + 2 * ARCO_ABERTURA * t;   // antes: esquerda → direita
var ang =  ARCO_ABERTURA - 2 * ARCO_ABERTURA * t;   // agora: direita → esquerda
```

**Por que só isso basta.** No caminho, x sai do seno do ângulo e y do cosseno.
Trocar o sinal de partida espelha o seno e **não mexe no cosseno, que é par** —
então a queda das pontas, o pico de escala no ápice e o vaivém do scrub
continuam idênticos. Raio, abertura, velocidades, `TORTO` e a janela do
ScrollTrigger não foram tocados: são a afinação de doze rodadas, e inverter o
sentido não é motivo para reabrir nenhuma delas.

O comentário do bloco foi reescrito junto, porque o antigo dizia *"negativo é o
lado de entrada, à esquerda"* e passaria a mentir.

### O que foi medido

Centro horizontal da fila ao longo do voo — o teste direto do sentido:

| progresso | 0 | 0,17 | 0,33 | 0,50 | 0,67 | 1 |
|---|---|---|---|---|---|---|
| celular 390px — 1ª prova | 547 | 442 | 326 | 195 | 64 | −157 |
| celular — inteiras/cortadas/fora | 0/0/7 | 0/7/0 | 2/5/0 | 1/4/2 | 0/2/5 | 0/0/7 |
| desktop 1440px — 1ª prova | 1690 | 1398 | 1079 | 715 | 351 | −260 |
| desktop — inteiras/cortadas/fora | 0/0/7 | 4/3/0 | **7/0/0** | 3/2/2 | 1/2/4 | 0/0/7 |

Nas duas telas o voo **começa com as sete inteiramente fora da borda direita**
(547 numa tela de 390; 1690 numa de 1440) e **termina com as sete fora da
esquerda**. Área visível no pico: 5,9 provas no celular e 7,0 no desktop —
iguais às da rodada anterior, como tinha de ser, já que espelhar não muda área.

Invariantes: rotação constante e igual a `TORTO` (`rotMudou` vazio), zero provas
pintando sobre o painel de preço, vaivém exato (ida a 0,7 e volta a 0,4 dá a
mesma posição que ir direto a 0,4), console limpo.

### O que falhou

**Captura de tela, de novo** — timeout de 5s, como o registro já previa. A
inversão foi conferida por número: as posições provam o sentido e o sangramento,
mas ninguém olhou o resultado. Quem julga se o arco *lê* como arco é você.

### O que ficou em aberto

- **As duas imagens anexadas.** Se o desenho mostrar outra curvatura, os dois
  botões são `ARCO_ABERTURA` (45°, quanto o caminho lê como curva e não como
  translação) e `VEL_MAX` (2,2, quanto a fila se estica).
- Continua valendo o de sempre: `TORTO` de 17° sem conferência visual, e o monte
  sem borda pode virar mancha onde três provas se cobrem.

### Segunda rodada: o arco não atravessa, ele fica do lado direito

**O retorno:** *"Você esqueceu que isso ocorre somente no lado direito da tela.
Você anteriormente já estava quase conseguindo fazer 100%."*

**Inverter o sentido foi resposta a metade do pedido.** Eu tinha lido "aparecem
no lado direito" como *o lado por onde entram* e mantido um arco de TRAVESSIA:
ponta esquerda fora da tela, ápice no meio, ponta direita fora. A prova cruzava
a tela inteira, e é isso que "somente no lado direito" nega. O sentido estava
certo; a EXTENSÃO é que não.

**A forma virou um parêntese, "(", em vez de um morro.** O centro do círculo
saiu de baixo da tela e foi para a DIREITA, fora dela. Com isso o ápice do arco
deixa de ser o ponto mais alto e passa a ser o mais à ESQUERDA — o único
instante em que a prova aparece inteira. As duas pontas ficam do MESMO lado:
a prova sobe vindo de baixo-direita, faz a barriga da curva dentro da tela e
sai por cima-direita.

**Na conta, é uma troca de papéis entre seno e cosseno:**

```js
x: (Math.sin(ang) * raio),            // antes: seno na horizontal → TRAVESSIA
y: ((1 - cosAng) * raio)

x: (APICE + (1 - cosAng) * raio),     // agora: (1−cos) na horizontal, e ele
y: (Math.sin(ang) * raio)             //        é ZERO no ápice e positivo dos
                                      //        dois lados → nunca vai à esquerda
```

`(1 − cos)` é par e não-negativo: a prova só consegue se afastar para a direita.
Era exatamente o contrário quando o seno mandava na horizontal, porque seno
troca de sinal — e trocar de sinal É atravessar.

**Duas constantes:**

- `ARCO_ABERTURA` de 45° para **110°**. Aqui abertura MAIOR encurta a viagem
  vertical, que vale (K − ápice) × cotangente da metade da abertura: 1,73 a 60°,
  1,00 a 90°, 0,70 a 110°, 0,58 a 120°. Abaixo de 90 a prova sobe tanto que o
  percurso lê como subida, não como curva; acima de 130 o caminho enrola atrás
  do próprio centro e vira laço.
- `APICE` novo, por faixa de tela: **0,15 no celular e 0,64 no desktop**, em
  larguras de pilha à direita do centro da célula. É ele que segura o pedido —
  é o ponto mais à esquerda que o voo alcança.

**Por que o celular não recebe o mesmo valor.** A prova mede 1,15 largura de
pilha, ou 250px, numa tela de 390. Meia tela são 195px e meia prova 125px:
sobram 70px de folga total. 0,15 gasta metade dela e ainda deixa a prova
aparecer INTEIRA no ápice. Empurrar até o corpo não tocar a metade esquerda
exigiria ápice de 0,58, e aí a prova passaria o voo inteiro cortada pela borda
direita — que é literalmente a queixa que abriu esta sequência.

### O que foi medido (segunda rodada)

Área visível, em provas equivalentes, ao longo do voo:

| progresso | 0 | 0,125 | 0,25 | 0,375 | 0,50 | 0,625 | 0,75 | 0,875 | 1 |
|---|---|---|---|---|---|---|---|---|---|
| celular 390px | 0 | 4,0 | 6,6 | 6,1 | 3,7 | 2,0 | 1,0 | 0,3 | 0 |
| desktop 1440px | 0 | 5,9 | **7,0** | 6,8 | 4,3 | 2,5 | 1,4 | 0,5 | 0 |

**Pico de 6,8 provas no celular e 7,0 no desktop** — contra 5,9 e 7,0 do arco de
travessia, e contra **1,5** no arranjo de leque que abriu a sequência. No
desktop as sete chegam a aparecer inteiras ao mesmo tempo.

**O voo cabe na metade direita.** Amostrando 41 posições, o centro de prova mais
à esquerda que existe no percurso inteiro:

| | meio da tela | centro mais à esquerda | corpo mais à esquerda |
|---|---|---|---|
| celular | 195 | **228** | 85 |
| desktop | 720 | **940** | 709 |

Os CENTROS nunca cruzam para a metade esquerda nas duas telas. O corpo cruza:
110px no celular e 11px no desktop. No desktop são 0,8% da tela, ruído. No
celular é geometria, não escolha — uma prova de 250px centrada a 228 numa tela
de 390 ocupa de 85 a 353 por definição.

Excursão vertical das pontas: ±224px no celular e ±535px no desktop, ambas com a
prova já fora da tela pela direita nesse ponto.

Rotação constante e igual a `TORTO` (`rotMudou` vazio), zero provas pintando
sobre o painel de preço em 4 posições, vaivém exato (ida a 0,9, volta a 0,4,
diferença 0), console limpo.

### Uma armadilha que voltou a morder

**O `python -m http.server` serviu o JS do cache.** Mudei `APICE` de 0,60 para
0,64, recarreguei com `?v=` no documento e medi **exatamente o mesmo número**.
`?v=` no HTML não invalida o script. Já está registrado para CSS na memória do
projeto; vale igual para JS, e a saída é a mesma: **subir o servidor numa porta
nova**. Sem isso eu teria concluído que a constante não faz efeito.

### Terceira rodada: o arco fecha e vira órbita, com raio menor

**O pedido:** *"Vamos alterar de movimento de arco para circular com raio um
pouco menor."*

**O trecho virou volta completa.** O caminho era um arco de 220 graus com a
prova parando nas duas pontas; agora ela percorre os 360 e volta ao ponto de
partida. O que era "ápice" continua existindo e passa a ser o ponto de MAIOR
APROXIMAÇÃO — o extremo esquerdo do círculo. Pontas somem, porque círculo não
tem ponta: as duas travas do progresso, 0 e 1, caem no MESMO lugar da órbita, o
extremo direito, que está fora da tela. É isso que mantém o voo começando e
terminando com as sete invisíveis.

```js
var ang = 2 * Math.PI * t;                       // volta inteira
x: (APICE + (1 + cosAng) * raio) * largura,      // (1+cos): 2 à direita, 0 à esquerda
y: (Math.sin(ang) * raio) * largura
```

`(1 + cos)` faz o mesmo serviço que `(1 − cos)` fazia no arco — nunca é
negativo, então a prova jamais passa do ponto de aproximação para a esquerda —
mas agora vale 2 no extremo direito em vez de 0, que é onde a volta começa.

**O RAIO DEIXOU DE SER DERIVADO.** No arco ele saía da abertura por
`(K − ÁPICE) / (1 − cos)`, então mexer na curvatura mexia no tamanho e vice-versa.
Agora é constante escrita à mão, `RAIO`, que é o que o pedido exige: **0,95 no
celular e 1,35 no desktop**, em larguras de pilha, contra 1,10 e 1,59 derivados
do arco — cerca de **14% menores**.

**Um piso ficou no lugar da derivação**, em `posicionar`: o extremo direito da
órbita é `ÁPICE + 2 × raio` e tem de passar de K. Sem ele, um número pequeno
demais para alguma largura de tela deixaria a prova rodando meio cortada para
sempre, e o defeito só apareceria na tela que ninguém testou.

### O que foi medido (terceira rodada)

| | celular 390 | desktop 1440 |
|---|---|---|
| partida e chegada (transform x, y) | 445, 0 | 1176, 0 |
| excursão vertical | **±206px** (era ±224) | **±475px** (era ±535) |
| centro mais à esquerda / meio da tela | 228 / 195 | 940 / 720 |
| pico de área visível | 6,1 provas | **7,0 provas** |

Partida e chegada no MESMO ponto, fora da tela pela direita nas duas telas.
Raio menor confirmado pelas duas excursões verticais. Os centros continuam sem
cruzar para a metade esquerda. Rotação constante e igual a `TORTO`, zero provas
sobre o painel de preço, vaivém exato, console limpo.

**O perfil de área ao longo do voo, e aqui está o custo do círculo:**

| progresso | 0 | 0,13 | 0,25 | 0,38 | 0,50 | 0,63 | 0,75 | 0,88 | 1 |
|---|---|---|---|---|---|---|---|---|---|
| celular — arco | 0 | 4,0 | 6,6 | 6,1 | 3,7 | 2,0 | 1,0 | 0,3 | 0 |
| celular — círculo | 0 | 1,0 | 5,7 | 4,9 | 2,6 | 1,2 | 0,3 | 0 | 0 |
| desktop — círculo | 0 | 1,9 | 6,5 | 5,6 | 3,1 | 1,6 | 0,6 | 0 | 0 |

**A volta tem trecho cego, e ele é inerente.** Num arco as duas pontas eram as
bordas da tela e quase todo o percurso ficava à vista; numa órbita o pedaço da
direita fica fora por construção — medido, a prova está inteiramente fora em
109 dos 180 graus de cada metade. O efeito é uma partida mais lenta (1,0 prova
de área aos 13% contra 4,0 do arco) e um rabo vazio a partir de uns 85%.

**Isso não é defeito a corrigir sem pedido**: é o que "circular" significa. Se
incomodar, o botão é `VEL_MAX` — comprimir a fila concentra a atividade e encurta
as duas pontas mortas — ou encurtar o `end` do ScrollTrigger, que corta o rabo
ao preço de acelerar tudo, e velocidade já foi afinada a pedido.

### Quarta rodada: o começo salta para 150%/160%, e o teto é geométrico

**O pedido:** *"A animação deve começar muito antes."*

**`start` de `'center 107%'/'center 115%'` para `'center 150%'/'center 160%'`.**
Uma linha. Mas antes de mexer valia medir até onde adiantar ajuda, porque
'top bottom' já falhou exatamente por adiantar demais, e a falha não aparece no
código: aparece como "ninguém vê o álbum, vê o meio da rajada".

**Como o teto foi achado sem editar o arquivo.** O transform de cada prova
depende SÓ do progresso, e a posição da célula depende SÓ da rolagem. Então dá
para amostrar os 61 estados do caminho uma vez, guardar os retângulos relativos
ao topo da pilha, e depois simular qualquer par (start, end) em aritmética pura
— sem recarregar, sem editar, sem cair na armadilha do cache. Seis valores por
tela, medindo área REALMENTE visível nos dois eixos contra rolagem.

**O teto não é gosto, é geometria.** A prova só pode ser vista quando a PILHA
está perto da tela, porque a posição dela é sempre relativa à célula. A órbita
sobe no máximo um raio acima do centro da célula — 206px no celular, 475 no
desktop. Antes de o centro da pilha chegar a essa distância da borda de baixo,
rolar não mostra nada: só gasta progresso com o álbum abaixo da dobra.

| celular | 107% | 135% | 140% | **150%** | 160% |
|---|---|---|---|---|---|
| ação começa antes do enquadre | 256px | 377 | 385 | **424** | 468 |
| pilha abaixo da dobra nesse instante | −166px | −45 | −37 | **−10** | +46 |
| pico de área visível | 6,1 | 5,6 | 5,5 | **5,1** | 4,7 |
| área total vista | 2238 | 2247 | 2227 | **2175** | 2104 |

A coluna que decide é a segunda: em 150% o centro da pilha alcança a dobra no
exato instante em que a primeira prova aparece. Passar disso é rolagem gasta com
o álbum fora de vista, e o pico despenca em troca de pouca antecedência.

No desktop a mesma fronteira cai entre 160 e 170, e ali a área TOTAL vista ainda
SOBE — 2058 em 115% contra 2323 em 160% —, porque a tela é mais alta e comporta
mais do desfile. Por isso o desktop pôde ir a 160 sem o custo que o celular tem.

### O que foi medido (quarta rodada)

| | celular 390 | desktop 1440 |
|---|---|---|
| start efetivo | 150% | 160% |
| janela | 1755px (era 1392) | 2291px (era 1886) |
| ação começa antes do enquadre | **424px** (era 256) | **435px** (era 220) |
| pico antes do enquadre | 249px | 170px |
| pico de área visível | 5,1 (era 6,1) | 5,0 (era 5,6) |

Rotação constante e igual a `TORTO`, vaivém exato em dois pontos (0,15 e 0,40),
zero provas sobre o painel de preço, console limpo.

**O custo, dito claro:** o pico cai 16% no celular e 11% no desktop, porque
parte do progresso passa a correr com a pilha ainda baixa. Foi o preço aceito
pelo pedido. Se pesar, o contrapeso é esticar o `end` — devolve o pico ao
instante do enquadre sem tocar no começo, ao preço de deixar o voo mais lento.

### Um erro de medição meu, não do código

O primeiro teste no celular acusou **`vaivem: false`** e por um instante pareceu
regressão. Era o script: eu li a posição em 0,4, e entre a leitura e a comparação
rodei o laço de invasão do painel, que mexe no progresso. A comparação final leu
0,6 contra 0,4. Refeito isolado, o vaivém é exato nos dois pontos. **Teste que
compara estado tem de ser o último a rodar, ou guardar o estado antes.**

### Quinta rodada: o álbum sai da oferta e vai abrir a página

**O pedido:** *"Vamos alterar a posição onde essas imagens e a animação vão
ficar. Acho uma boa ideia adicionar antes do roteiro (planilha)."*

**O que se moveu.** As sete provas saíram de dentro de `.oferta`, lá embaixo, e
viraram um bloco próprio entre o herói e o roteiro — segundo elemento do `main`.

**O nome mudou junto**, `oferta__grade` → `album__grade`, 16 ocorrências em três
arquivos. Classe com prefixo de uma seção usada em outra é comentário falso
escrito em CSS.

**A caixa foi repetida de propósito.** `.album` declara os mesmos 60rem de
largura máxima, centrada, com o mesmo respiro lateral que `.oferta` dava. Não é
preguiça: a pilha vale 62% dessa caixa e TODA a geometria da órbita é fração da
largura da pilha. Caixa diferente seria órbita de outro tamanho, com doze
rodadas de constantes afinadas contra 352px de desktop e 217 de celular.
Confirmado depois da mudança: 352 e 217, iguais.

### Dois defeitos que a mudança criou, e os dois foram medidos

**1. `start` NEGATIVO.** Com `'center 150%'/'160%'` — os valores afinados para a
posição antiga — a ScrollTrigger devolveu `start` de **−249 no celular e −300 no
desktop**. Janela que começa antes da rolagem zero: 13% do voo ficariam
inalcançáveis, gastos antes de o visitante poder rolar.

O teto deixou de ser a dobra e passou a ser A PRÓPRIA PÁGINA: o centro do álbum
está a 1017px do topo no celular e 1140 no desktop, então a maior porcentagem
com `start` positivo é 120% e 127%. Ficaram **118% e 124%**, logo abaixo, com
umas duas dezenas de pixels de margem para o dia em que o herói mudar de altura.

| | posição antiga | posição nova |
|---|---|---|
| celular — ação antes do enquadre | 424px | 310px |
| celular — pico de área visível | 5,1 | **6,1** |
| desktop — ação antes do enquadre | 435px | 255px |
| desktop — pico de área visível | 5,0 | **5,5** |

Menos antecedência, porque não há página suficiente acima. Em troca o pico SOBE
nas duas telas, porque nenhum progresso é gasto com o álbum abaixo da dobra.

**2. AS PROVAS COBRIAM O TÍTULO DO HERÓI.** Medido com rolagem real e
`elementFromPoint`: **4 coberturas em 18 sobreposições testáveis**, por volta de
550–600px de rolagem, bem no pico do voo, com o herói ainda na tela.

É o MESMO defeito que o painel de preço teve, e a mesma causa: `.heroi` é
`position: relative` com `z-index: auto`, ou seja não abre contexto de
empilhamento, e `.heroi__texto` tinha `z-index: 1` — cada prova, com z-index 1 a
7 inline, disputava direto com o título e ganhava. `.heroi__texto` foi para 10,
o mesmo número e a mesma razão de `.painel`. Refeito o teste: **0 em 18** no
desktop e **0 em 17** no celular, com o teste comprovadamente não-vazio.

### Um risco latente que fica registrado

As provas descem até **1826px** na página e o topo da barra fixa da planilha
está em **1774** — folga de **−52px**. Não há colisão hoje, e o teste dá 0 em 0
sobreposições testáveis, mas a proteção é ACIDENTAL: no instante em que a prova
está no ponto mais baixo da órbita ela está fora da tela pela direita, e é só
isso que separa as duas. Se o raio crescer, se `APICE` diminuir, ou se o roteiro
subir na página, `.planilha__topo` (z-index 2) vira o próximo `.heroi__texto`.
A correção, se o dia chegar, é a mesma das outras duas: camada própria acima de 7.

### O que foi medido (quinta rodada)

Ordem do `main` conferida: herói, **álbum**, roteiro, escopo, dor, oferta, redes.
Pilha com 352/217px de largura, sete provas, classe `--pilha` aplicada pelo JS.
`start` positivo nas duas telas (21 e 24). Rotação constante e igual a `TORTO`,
vaivém exato, zero cobertura do título do herói, do painel de preço, do título
do roteiro e da barra da planilha, nenhuma imagem quebrada, sem rolagem lateral,
console limpo.

### O comentário de `.painel` foi reescrito, e não apagado

Ele descrevia uma vizinhança que deixou de existir. Virou registro do que o
defeito ensinou — *a pilha não isola nada, cada prova disputa sozinha com o resto
da página* — que é exatamente a lição que reapareceu no herói nesta mesma rodada.

---

## 2026-08-28 — o ônibus sai, e um corte automatizado quebrou o arquivo

### O que foi pedido

*"Vamos desistir da ideia de adicionar a imagem do ônibus. Ficou uma bosta."*

Veredito de quem viu. Eu não vi: este painel não compõe quadros, então captura
de tela dá timeout e a peça foi construída inteira por medição numérica. Medição
prova geometria, peso e contraste; não prova que a composição funciona. Foi o
limite da ferramenta que apareceu aqui, e não vale insistir contra o olho de
quem olhou.

### O que saiu

Removidos por completo, com verificação de que sobrou zero referência nos três
arquivos:

- `index.html`: o `<figure class="placa placa--recorte">` e o comentário longo.
- `estilo.css`: o bloco `.placa--recorte` com seu comentário, o
  `.placa--recorte img`, o `::after` da sombra de contato, o comentário do `.dor`
  que explicava o recorte fechando a seção, e as duas regras
  `.dor .placa--recorte` (margin-top e grid-column).
- `roadbook.js`: o bloco 9 inteiro.
- `assets/media/`: `onibus.avif` e `onibus.webp`, que eu tinha gerado.
- `scripts/recorte-onibus.py` e o diretório `scripts/`.

O `onibus.png` foi restaurado para o arquivo ORIGINAL do usuário, 898x2000, do
backup em scratchpad. Eu o tinha sobrescrito com a versão aparada em 898x573, e
devolver o original é o estado que ele entregou.

### O QUE FALHOU: o corte levou o FECHAMENTO junto

O script que removeu o bloco 9 procurou o `});` de fechamento a partir de um
deslocamento fixo e casou com um fechamento ERRADO, mais adiante no arquivo. O
resultado foi apagar também o bloco FECHAMENTO inteiro e deixar uma chave órfã.

`node --check` pegou: `SyntaxError: Unexpected token '}'`. Uma varredura de
balanço de chaves, ciente de string e comentário, mostrou profundidade final -1 e
apontou a linha exata.

**E não havia de onde restaurar.** O projeto não tem um único commit. Procurei
cópia de `roadbook.js` em todo o perfil do usuário e nos checkpoints do
token-optimizer: nada, os checkpoints guardam metadado de sessão, não conteúdo
de arquivo.

O FECHAMENTO foi **reconstruído**, e está marcado como reconstrução dentro do
próprio comentário. O comportamento veio de duas fontes que sobreviveram: o
comentário do portão em `index.html`, que diz por extenso "é o mesmo motivo pelo
qual roadbook.js dá um ScrollTrigger.refresh() no document.fonts.ready", e o
fragmento do comentário que ficou visível antes do corte. Se a versão original
tinha alguma guarda a mais, ela se perdeu e ninguém tem como saber.

**A lição:** em repositório sem commit, todo corte automatizado é irreversível.
Conferir balanço de chaves ANTES de gravar, não depois. E `str.index('});')` a
partir de um offset é busca de fechamento por adivinhação, não por estrutura.

### O que a remoção deixou intacto

A `.dor` volta a ter dois filhos e o grid de duas colunas do desktop
(542,8px e 401,2px) absorve isso sem regra nova, porque o recorte era o único
elemento com `grid-column: 1 / -1`.

| | 375 | 1440 |
|---|---|---|
| Estouro horizontal | 0 | 0 (só barra) |
| Imagens quebradas | 0 | 0 |
| ScrollTriggers ativos | 12 | 12 |
| Altura do documento | 9.441px | 7.882px |

Console sem erro, JSON-LD válido, e o resto da sessão preservado: mapa 120px com
legenda oculta no celular e 220px com legenda no desktop, três redes sem link
morto, botão do remate em 58px.

---

## 2026-08-28 — o ônibus: de recorte de papel a recorte sangrando

### O que foi pedido

*"A imagem do ônibus não está bem inserida no site. Pense de uma forma de
inseri-lo de forma que fique agradável e chamativo. A imagem está em .png."*

### O diagnóstico: não era composição, era ausência

O ônibus **não estava aparecendo na página**, e nenhum erro dizia isso.

O `<picture>` apontava para `onibus.avif` e `onibus.webp`, e os dois tinham sido
apagados. O navegador suporta AVIF (verificado no console), então ele escolhia o
primeiro `<source>` compatível, recebia **404**, e parava ali. Pela especificação
a escolha de `<source>` é FINAL: um 404 nela **não** cai para o `<img>`. Medido:
`currentSrc` vazio, `naturalWidth` zero, e nenhum evento de erro.

Esse é o modo de falha mais traiçoeiro do `<picture>`: a imagem some em silêncio.
Fica registrado para quem editar `<source>` aqui conferir que o arquivo existe.

Havia um segundo bug esperando atrás desse. O markup declarava
`width="1400" height="1024"` e o CSS forçava `aspect-ratio: 1400/1024`, uma
proporção paisagem que o arquivo não tem. Mesmo com o 404 resolvido, o
`object-fit: cover` herdado de `.placa` teria comido as laterais do veículo.

### O arquivo

Durante a investigação apareceu um `onibus.png` novo na pasta, com **alfa de
verdade**: RGBA 898x2000, 78,6% totalmente transparente, 21% opaco, 7.310 pixels
semi-transparentes, que são bordas anti-aliased de um recorte bem feito.

O conteúdo ocupava só `y 684 a 1257`. Dois terços do arquivo eram vazio puro que
o navegador baixaria, decodificaria e guardaria na memória para não desenhar
nada.

A versão anterior desse asset era um **JPEG de 1,7MB com o xadrez de
transparência rasterizado nos pixels**. É o que acontece quando um PNG com alfa é
achatado em JPEG sem ninguém conferir: JPEG não tem canal alfa, então a
transparência vira conteúdo.

### O que mudou

**Pipeline versionado** em `scripts/recorte-onibus.py`, e versionado de
propósito: o ônibus já foi reprocessado três vezes neste projeto e todo script
morreu junto com a sessão. Ele recorta para a bbox, exporta o trio com alfa e
**reabre cada arquivo gravado para conferir que o alfa sobreviveu ao encoder**,
que é exatamente a checagem que faltava quando o projeto chegou no JPEG com
xadrez.

| | antes | depois |
|---|---|---|
| AVIF | ausente (404) | **33,0 KB** |
| WebP | ausente (404) | 45,8 KB |
| Fallback | JPG 1,7MB com xadrez | PNG 589 KB com alfa |
| Dimensões | 1376x3064 retrato | 898x573 |
| Pixels descartados | — | 72% |

**O tratamento.** O `.placa--recorte` perdeu tudo que desenhava caixa: fundo,
borda, raio, `overflow: hidden`, `aspect-ratio` e o `box-shadow`. Esse último era
o principal culpado pelo ar de colagem, porque sombra de caixa em imagem que não
é caixa desenha um retângulo escuro em volta do nada.

No lugar entrou uma **sombra de contato**: elipse em `radial-gradient` sob as
rodas, que diz que o veículo está pousado sem inventar um retângulo.

**O sangramento** usa `calc(50% - 50vw - var(--e-5))`, que é a distância entre a
borda de conteúdo da coluna e a borda da janela escrita sem saber quanto ela
vale, e por isso serve qualquer largura sem media query.

### O que a medição corrigiu no caminho

**O respiro era 8px e virou 20px.** `50vw` conta a largura da janela COM a barra
de rolagem, enquanto o layout dispõe de menos. No desktop essa diferença comeu o
respiro e deixou o transbordo real em **3px**: a traseira cortada ficava a três
pixels de aparecer, e qualquer mudança de largura de barra devolveria a fresta.

**`isolation: isolate` não é enfeite.** A sombra usa `z-index: -1`, e filho de
z-index negativo pinta dentro do contexto de empilhamento mais próximo. Enquanto
o GSAP mantém uma transform ali, a própria transform cria esse contexto. Mas sob
movimento reduzido ou sem script transform nenhuma é escrita, o contexto some, e
a sombra vai para trás do fundo da seção, onde não aparece. Testado forçando
`clearProps: 'transform'`: com `isolation` a geometria se mantém.

### A traseira cortada deixou de ser defeito

O arquivo entrega o veículo **cortado rente na borda direita**: 155 pixels
opacos na última coluna. Era esse defeito que a metáfora de "recorte de catálogo
impresso" existia para explicar ("recorte é cortado, e a tesoura passa pelo
veículo"). Com a borda da imagem além da borda da tela, o corte deixa de ser
corte e vira continuação: o ônibus sai de cena. O defeito do arquivo e a
composição se cancelam.

### A tensão com o DESIGN.md, declarada

`Design/DESIGN.md` diz sobre imagens "no illustrations, **NO PRODUCT RENDERS**".
A metáfora de papel existia para contornar isso: chamando o render de impresso,
ele deixava de ser render.

Um recorte sangrando **assume o render como render**. Decisão do dono do
projeto, tomada com o custo na mesa. Está escrita no comentário do CSS em vez de
disfarçada, porque a regra existe, esta peça é a exceção dela, e exceção tem de
ter dono.

### O gesto mudou de assunto

O tween era rotação: o recorte chegava mais torto e assentava, porque o que
estava ali era papel sendo pregado. Agora é `x: 48 -> 0`: o ônibus **chega**.

Rotação foi a zero e está nos DOIS valores do tween. Não é esquecimento:
elemento que sangra precisa estar alinhado ao eixo na borda em que sangra, senão
abre uma cunha triangular de fundo entre a imagem e a borda da tela. Inclinação e
sangramento são mutuamente exclusivos.

Deslocamento lateral era proibido pela nota antiga porque girar uma caixa de
1088px já jogava 35px para cada lado. Sem rotação essa conta zera.

### O que foi medido depois

| | 375 | 768 | 1440 |
|---|---|---|---|
| Transbordo no repouso | 20px | 15px | 15px |
| Transbordo na chegada | 68px | 63px | 63px |
| Estouro horizontal | 0 | 0 (só barra) | 0 (só barra) |
| Largura do recorte | 100% da tela | 97% | 1240px |
| Formato servido | AVIF | AVIF | AVIF |

Proporção renderizada 1,567 igual à do arquivo 1,567, ou seja sem distorção.
Caixa morta confirmada: fundo transparente, borda 0, raio 0, `box-shadow: none`.
Console sem erro. JSON-LD segue válido. Nenhum placeholder vazando.

### Armadilha nova do painel, para o registro

**Imagem com `loading="lazy"` nunca carrega neste painel.** O lazy depende de
IntersectionObserver, que depende de a página estar realmente sendo composta, e
este painel não compõe quadros. `scrollIntoView` não resolve: o `<img>` fica com
`complete: false` para sempre, sem disparar `load` nem `error`, o que é fácil
confundir com bug de markup.

Para medir, remover o atributo e reatribuir o `src`. Foi assim que ficou provado
que o markup estava certo e o que faltava era o painel.

---

## 2026-08-27 — a espiral de Euler saiu, e entrou órbita

### O que foi pedido

Duas rodadas. Primeiro, sobre a animação dos ícones de tulipa da planilha:
*"Faça que a animação dos ícones da planilha apareça do ponto de início até a
ponta da seta do ícone"*, e em seguida *"não gostei desse estilo de animação.
Utilize skills de animação / design e verifique o que ficaria melhor."*

Depois, sobre o álbum de fotos da oferta, com uma referência anotada à mão
(sanrita.ca): *"Faça a distribuição das imagens dessa forma. Não vamos mais
fazer a animação no estilo Euler... Retire a borda das imagens. As imagens não
devem rotacionar juntas (rotacionar sobre o próprio eixo). Cada imagem deve ter
uma pequena curvatura para diferenciar uma da outra."*

Duas ambiguidades resolvidas por pergunta: o círculo vermelho desenhado sobre a
referência é **órbita em torno de um centro comum**, e as fotos **continuam
saindo da tela** no fim da rolagem.

### O que mudou

**Tulipas (`roadbook.js`, seção 8).** Primeiro uni traçado e seta num só `<path>`
por glifo, para o `stroke-dashoffset` percorrer os dois em sequência em vez de
desenhar a seta antes de a linha chegar nela. Funcionou, e foi **descartado na
rodada seguinte**: o traçado inteiro saiu. A skill `animate` deixa claro que
indicação de estado pede UM gesto, e o pouso (`scale`+`x`/`y`+`opacity`, 0,42s,
`power3.out`) já cumpria esse papel — o traçado era 550ms de segunda animação
competindo pela mesma atenção. Os `<path>` voltaram a ser separados, já que sem
o traçado a união não tinha função.

**Álbum da oferta (`roadbook.js`, seção 6).** Trocada a pista clotoide inteira
por órbita polar. Saíram ~230 linhas: `RAIO_LEQUE`/`PASSO`/`S_LEQUE`, `SAIDA`,
`AVANCO`, `K_LEQUE`/`TETA0`/`S_CLOT`/`S_FIM`, a tabela `trilhoX/Y/A` de 720
pontos, `tabelarPista`, `lerPista`, `SAIDA_X/Y` e `congelarAngulos`. Entraram
`FASE`/`RAIO0` (polares em torno do centro do álbum), `VARREDURA` (-100°) e
`FATOR` (8× no raio). `TORTO` encolheu de `[-2,30,20,-14,-24,-24,30]` para
`[-4,7,-6,5,-8,9,-5]`.

**Bordas (`estilo.css`).** `.oferta__grade .placa` passou de `border: 3px solid
var(--fundo)` para `border: 0`, o que também vence o `1px` que `.placa` veste
por padrão.

### O que foi medido

Painel de navegador com viewport forçada (390x844 e 1440x900), recarregando após
cada resize, `st.scroll()` mais `ScrollTrigger.update()` para varrer a janela em
9 pontos.

- **Rotação constante:** nas 9 amostras, nos dois breakpoints, a rotação de cada
  prova ficou exatamente em `TORTO` e **nunca mudou** (tolerância 0,15°). É o
  teste direto do pedido "não rotacionar sobre o próprio eixo".
- **Varredura:** a última prova varre -100°, exatamente `VARREDURA`; a líder
  varre -167°, que é `VARREDURA × 1/DURACAO`. Raios crescem monotonicamente.
- **Bordas:** `borderWidth` 0px nas sete; `1px` preservado numa `.placa` de
  outra seção.
- **Saída:** fotos na tela ao longo do voo — celular 5→7→7→6→3→2→2→2→2,
  desktop 4→7→7→6→5→5→4→3→1.

### O QUE FALHOU

**1. Tomei `ESPALHA_X/Y` por posição, e é desvio.** O plano assumiu que o
espalhado já era o anel de repouso. O comentário do próprio arquivo avisa o
contrário com todas as letras: *"a posição de repouso de cada foto é ponto da
pista MAIS desvio, e o ponto da pista anda 0,087 em x de um índice para o
seguinte"*. Com o arco removido, as sete colapsaram para perto do centro e a
**pior visibilidade do álbum caiu de 28% para 8%** — três provas praticamente
sumiam. Medido por varredura de 200×200 pontos com ordem de pintura, em espaço
de layout (o repouso nunca está inteiro na tela, então hit-test não serve).
Corrigido reintroduzindo o arco em **fórmula fechada** (`RAIO_ARCO`,
`PASSO_ANG`, `TETA0` — três linhas no lugar da tabela de 720 pontos), e o
`REPOUSO_X/Y` voltou a ser arco + desvio. Pior visibilidade de volta a **26%**.

Lição: o arco é do **arranjo**, não do movimento. Trocar o movimento não
autorizava jogá-lo fora.

**2. Ordem errada entre centro e polares.** Na primeira versão `FASE`/`RAIO0`
saíam de `ESPALHA` cru e o polo da órbita era a origem da pista, com `CENTRO`
descontado só no desenho. Só não quebrou porque `ESPALHA` estava por acaso
centrado em zero. Com o arco de volta, as posições passaram a ter centro em
x≈0,24 e a órbita giraria em torno do ponto errado. Reordenado:
`assentarAlbum` → `centrarMonte` → `polarizar`, com as polares já relativas ao
centro, e o desconto saiu do laço de desenho.

**3. `z-index: 1` no painel de preço nunca bastou.** O comentário do CSS
justificava o valor dizendo que *"a pilha é contexto de empilhamento"*. Ela não
é: `.oferta__grade--pilha` não declara `z-index` nem `position`, e os `<li>`
recebem `z-index` 7 a 1 inline do `roadbook.js`. Cada prova disputava sozinha
com o painel, e as de índice baixo ganhavam. Com a clotoide isso não aparecia
porque a trajetória não passava por cima do painel; a órbita passa, e aos 75%
do voo a prova 4 pintava **sobre o preço**. Painel subiu para `z-index: 10`.
Bug latente, exposto — não criado — pela troca de movimento.

**4. Medi com viewport de largura zero e quase acreditei.** O painel do
navegador não estava sendo exibido, então `innerWidth` era 0, a pilha media
0×0, o documento tinha o dobro da altura e a ScrollTrigger devolvia `start`
negativo. Nada disso era do código. `resize_window` com largura explícita
resolveu. Confere com a armadilha já registrada abaixo, e agora com um sintoma
novo: **quando os números vierem absurdos, conferir `innerWidth` antes de
depurar o código.**

### Segunda rodada: o grupo se desfazia, e a referência foi lida no código

**A queixa:** *"quando a animação começa, todas as imagens se espalham (NÃO É O
QUE EU QUERO). Eu quero que as imagens fiquem agrupadas como está na imagem do
site de inspiração. A animação deve ter o efeito de vai e volta."*

**Como a referência foi apurada.** O painel não compõe quadros, então observar a
animação de `sanrita.ca/en/about` rodando era impossível: os transforms saem
todos identidade e o `scrollTo` é interceptado. O que funcionou foi ler o
DOM parado e depois **baixar o bundle e procurar a classe dentro dele**
(`fetch` em cada `<script src>`, regex por `picture-stack`). O código apareceu
inteiro em `9c33e027a723933f.js`:

```js
let t = isMobile ? 2 : 6;     // multiplicador do raio
let l = isMobile ? 20 : 30;   // passo do raio por camada
let a = isMobile ? 30 : 40;   // raio base, em px
stacks.forEach((s, i) => {
  let c = i*l + a, n = 0.8*i;                    // raio inicial e fase
  gsap.set(s, { x: cos(n)*c, y: sin(n)*c, scale: .7 });
  tl.to(m, { p:1, r: c*t, duration:.5, ease:"none", onUpdate: () => {
    let e = m.p*Math.PI + n;                     // varredura = meia volta
    gsap.set(s, { x: cos(e)*m.r, y: sin(e)*m.r, scale: .7 + .2*m.p });
  }}, (stacks.length-1-i) * .05);                // stagger REVERSO
});
```

Dois fatos que só o DOM parado revela: as cinco camadas da referência têm
**exatamente a mesma classe, a mesma inclinação de 3° e a mesma célula de
grid** — em repouso elas estão perfeitamente empilhadas, e todo o leque é do
script; e o álbum inteiro vive numa **caixa fixa** de 411×513 (280×350 no
celular).

**O que mudou aqui.** O espalhado de mesa e o arco saíram, substituídos pelo
anel regular da referência (`RAIO_BASE` 0,100 + `RAIO_PASSO` 0,049 por camada,
fase de 0,8 rad). `VARREDURA` foi de -100° para **π**, `FATOR` de **8 para 2 no
celular e 6 no desktop**, escala passou a subir 0,7→0,9, e o stagger virou
**reverso** (a de baixo parte primeiro) com os tempos dela (0,05 / 0,5).

**A correção que resolve a queixa:** o progresso de cada prova agora **trava em
1**. Antes ele corria solto acima de 1 — deliberado, para quem partia primeiro
não parar — e o efeito colateral era que nenhuma prova parava nunca: o grupo se
desfazia pela tela. Com a trava, cada uma para no raio final dela.

**Medido depois:**

| | repouso | fim |
|---|---|---|
| celular (390px) | 257×294 | 392×469 |
| desktop (1440px) | 417×477 | 1199×1593 |

A caixa de repouso no desktop, 417×477, bate quase exatamente com a da
referência (411×513) — sinal de que adotar as frações dela funcionou.

**Vaivém conferido de verdade:** ida até 100%, volta a 50% e a 0%, comparando
`x`, `y` e escala das sete. Diferença **0** nos dois pontos — o caminho desfaz
exatamente.

Rotação seguiu constante e igual a `TORTO` nas 9 amostras dos dois breakpoints,
e nenhuma prova venceu o painel de preço.

### Terceira rodada: saída pela esquerda e provas maiores

**O pedido:** *"As imagens devem sumir na borda da tela do canto esquerdo,
conforme rotaciona. Aumente o tamanho das imagens."*

**A decisão de desenho: translação, e não torcer a órbita.** A saída pela
esquerda podia sair de dois jeitos. O primeiro era fazer cada prova terminar
apontando para a esquerda, ou seja, varrer até 180°. Descartado por medição:
com as fases atuais, isso exigiria varreduras de **42° a 357°** conforme a
prova — uma mal se mexeria e outra daria quase a volta completa, e o giro
deixaria de ler como um grupo girando junto.

O que ficou são dois movimentos SOMADOS e mantidos separados, que é o que faz
os dois se lerem: a órbita continua girando o grupo em torno do próprio centro,
e por cima dela o grupo inteiro **deriva para a esquerda** até passar da borda.

**A deriva é medida, não escolhida:** meia tela, mais o raio da prova mais
externa no fim, mais meia prova na escala máxima, mais 0,15 de folga — tudo em
larguras de pilha. Por isso `telaW` passou a ser medido junto com `largura` no
`refreshInit`: a conta depende de onde a borda está, e isso é tela, não pilha.

**`FATOR` caiu para 1,8 nas duas telas** (era 2 no celular e 6 no desktop).
Enquanto o afastamento radial era o único jeito de sair, ele precisava ser
grande — e grande no raio é o mesmo que desfazer o grupo, porque cada prova vai
para um lado. Com a saída resolvida por translação, o raio volta a ter uma
função só: abrir o álbum o suficiente para as sete se distinguirem.

**Escala subiu de 0,7–0,9 para 0,95–1,15.** Passa de 1 no fim de propósito: a
prova fica maior que a célula da pilha, o que não desloca nada porque escala é
transform.

**Medido:**

| | repouso (largura do grupo) | borda esquerda ao longo do voo |
|---|---|---|
| celular (390px) | 318px | +36 → −6 → −113 → −247 → −438 → −469 |
| desktop (1440px) | 516px | +457 → +322 → +80 → −324 → −716 → −766 |

Provas na tela, celular: 5 → 7 → 7 → 7 → 3 → 0 → 0. Desktop: 4 → 7 → 7 → 7 → 5
→ 1 → 0.

**Nenhuma prova saiu pela direita** em nenhuma das 9 amostras dos dois
breakpoints — foi conferido explicitamente, porque era o modo de falha óbvio de
somar deriva a uma órbita. Vaivém continua exato (diferença 0 na ida e volta),
rotação constante e igual a `TORTO`, painel de preço nunca coberto.

### Quarta rodada: três defeitos de uma vez, e um explicava o outro

**O relato:** *"Você está errando na posição inicial das imagens (elas não ficam
centralizadas, ficam distribuídas em forma de arco (meia lua) no canto direito).
A animação das imagens não estão rotacionando (estilo meia lua). Eu confundi a
direção, é para direita, não esquerda."*

Três queixas, e as duas primeiras tinham causa única e medível.

**1. O repouso em arco era `FASE_PASSO = 0.8`**, herdado direto da referência.
Com cinco corpos ela se safa; com sete, 0,8 rad por camada espalha as fases de
0 a 4,8 rad — a **volta inteira**. O repouso era literalmente um anel aberto, e
o olho lê anel aberto como meia lua.

**2. O giro não aparecia porque a DERIVA o abafava.** Medido: no celular a
deriva valia **506px** enquanto o raio orbital ia no máximo a **153px**. O
deslize horizontal era de três a doze vezes maior que o círculo, então o que se
via era escorregar para o lado, não girar. A solução da rodada anterior estava
tecnicamente correta e visualmente errada.

**A correção junta as três queixas numa mudança só.** As fases passaram a ser um
leque estreito em torno de **π**, ou seja em torno da esquerda (`FASE_PASSO` de
0,8 para 0,20 — abertura total de 69° contra 275°). Isso resolve tudo de uma
vez:

- leque estreito mantém o grupo junto e centrado;
- quem começa à esquerda e varre meia volta **termina à direita**, então a saída
  pela direita sai do próprio giro, sem translação nenhuma por cima;
- sem deriva competindo, o giro volta a ser o único movimento e se vê.

Varrendo +π a partir de π, o caminho passa por 270° — que com y para baixo é o
**topo** — e termina em 0°. Arco por cima, da esquerda para a direita: a meia lua.

**O raio passou a crescer para um DESTINO COMUM, e não por multiplicação.**
Multiplicar preserva a proporção entre os raios, então a prova que começa mais
perto do centro termina perto também e **não sai da tela** — defeito que 1,8 e 8
tinham igual, só que em escalas diferentes. Com `raioFim` comum, todas terminam
à mesma distância e todas saem; só a diferença de ângulo sobrevive, que é o que
abre o leque. O destino é medido: meia tela, mais meia prova na escala máxima,
mais 0,12 de folga, dividido pelo cosseno da abertura — porque a prova mais
aberta sai na diagonal e precisa de mais raio para cruzar a mesma borda.

**Medido:**

| | repouso (largura / margens) | borda esquerda do grupo ao longo do voo |
|---|---|---|
| celular (390px) | 279px / 56 e 56 | 56 → 41 → 22 → −7 → −13 → 157 → **453** |
| desktop (1440px) | 453px / 489 e 499 | 489 → 404 → 315 → 217 → 561 → **1537** |

Margens iguais dos dois lados nas duas telas: **centrado**. E a borda ESQUERDA
do grupo terminando além da largura da tela (453 > 390; 1537 > 1440) quer dizer
que o grupo inteiro saiu pela **direita**.

Ângulo orbital da prova do meio, celular: 111° → −126° → −78° → −35° → 2°.
Varre no sentido horário passando pelo topo e para na direita.

Nenhuma prova saiu pela esquerda, rotação constante e igual a `TORTO`, painel de
preço nunca coberto, vaivém exato (diferença 0), console limpo.

### Quinta rodada: o repouso deixou de ser centrado, de propósito

**O pedido:** *"A animação ainda está começando no meio (centralizado). Quando o
usuário chegar, as imagens já devem estar em formação de arco no lado direito
(parte das imagens fora da tela do usuário)."*

Isto derruba uma premissa que estava escrita no código desde o começo. O
comentário do `centrarMonte` dizia com todas as letras que centrar "põe o grupo
no meio da célula, que é onde o visitante o encontra" — e era essa premissa que
estava errada, não a conta.

**Duas mudanças, e a primeira é a que faz ler como ARCO.** O passo do raio abriu
de 0,049 para 0,10. Com 0,049 os sete raios iam de 0,10 a 0,394 da largura, ou
seja de 22 a 85px no celular, enquanto cada prova mede 206px: uma corrente de
63px feita de elos de 206 não é corrente, é um borrão centrado. Com 0,10 a
corrente mede 130px e as provas se escalonam visivelmente ao longo da curva.

É o meio-termo entre os dois defeitos já cometidos aqui: 0,8 rad de fase
espalhava as sete pela volta inteira e virava anel; raio curto demais colapsava
tudo no centro. **Arco é corrente longa com passo angular curto.**

**A segunda é o empurrão para a direita.** `centrarMonte` passou a guardar
também `MEIA_LARG`, a meia-largura do grupo em repouso, e daí sai um
deslocamento constante que leva a borda direita do grupo até uma tela mais
`FORA` vezes a largura dele. `FORA` é 0,22, tirado da referência, onde a foto de
cima é cortada pela borda direita do aparelho — não é o monte encostando na
borda, é ele atravessando um pouco.

**Medido no repouso, que é o estado de chegada:**

| | caixa do grupo | tela | fora pela direita | provas cortadas |
|---|---|---|---|---|
| celular | 133 → 463 (330px) | 390 | **22%** | 4 de 7 |
| desktop | 1018 → 1553 (535px) | 1440 | **21%** | 4 de 7 |

O grupo começa à direita do centro nas duas telas e sangra pela borda, com
quatro provas cortadas — que é a formação pedida.

Ao longo do voo continua saindo pela direita (borda esquerda termina em 581 no
celular e 2149 no desktop, ambas além da largura da tela). Rotação constante e
igual a `TORTO`, nenhuma prova sai pela esquerda, painel de preço nunca coberto,
vaivém exato (diferença 0), console limpo.

### Décima segunda rodada: o leque saiu, entrou um CAMINHO

**O retorno:** *"Quase todas as imagens estão sangrando agora. Não era esse o
objetivo. O objetivo é gerar um efeito de imagens aparecendo de fora da tela do
usuário e saindo para fora da tela também (em animação de arco)."*

**O objetivo era outro desde o começo, e nenhum ajuste de parâmetro chegaria
lá.** O modelo era um LEQUE ESTÁTICO: cada prova num raio e num ângulo próprios,
e o voo empurrava o leque inteiro. Como o leque tinha de caber ao lado da borda,
quase todas nasciam cortadas por ela — e cada rodada de ajuste só escolhia
QUAIS ficariam cortadas.

O que se quer é uma FILA num caminho: todas percorrem o MESMO arco, e o que as
separa é o ponto do caminho em que cada uma está. Aí nenhuma precisa nascer
cortada — quem está no meio aparece inteira, e só sangra quem está passando
por uma das pontas, que é o que "entrar" e "sair" querem dizer.

**A geometria nova cabe em três linhas.** Um arco de circunferência com o ÁPICE
no centro da célula e o centro do círculo abaixo. As duas pontas caem fora da
tela, uma de cada lado. O raio não é escolhido: sai da abertura e da largura da
tela, porque a condição é que a ponta esteja fora.

```
K     = meia tela + meia prova + folga
raio  = K / sen(abertura)
queda = K * tan(abertura / 2)      // o quanto a ponta desce sob o ápice
```

45 graus é o meio-termo medido: abertura pequena dá raio enorme e arco quase
reto — o movimento vira translação e some a leitura de arco; abertura grande
afunda as pontas (a 60 graus a queda é 0,58 de K, a 45 é 0,41, a 30 é 0,27).

**O espalhamento passou a vir só da VELOCIDADE.** Todas partem do mesmo ponto do
caminho e a diferença de ritmo abre a fila sozinha — que é exatamente o que se
pediu quando o atraso deu lugar à aceleração crescente. Por isso `RAIO0`,
`FASE`, `CENTRO_X`, `CENTRO_Y`, `BORDA_P0`, `ALTURA`, `VARREDURA`,
`RAIO_PASSO`, `FASE_PASSO`, `FASE_CURVA` e a âncora de borda saíram TODOS
juntos: eram a maquinaria do leque, e o leque acabou. A seção ficou mais curta.

**A escala passou a ter pico no ÁPICE**, e não no fim. Crescer até o fim
deixaria a prova maior justamente quando ela sai, o que lê como se ela viesse
para cima do visitante ao ir embora.

**Medido — quantas provas inteiras / cortadas / fora, ao longo do percurso:**

| progresso | 0 | 0,17 | 0,33 | 0,50 | 0,67 | 0,83 | 1 |
|---|---|---|---|---|---|---|---|
| desktop | 0/0/7 | 0/7/0 | **7/0/0** | 0/5/2 | 0/3/4 | 0/0/7 | 0/0/7 |
| celular | 0/0/7 | 0/7/0 | **3/4/0** | 1/4/2 | 0/3/4 | 0/0/7 | 0/0/7 |

Área visível no pico saltou de **1,5 para 5,9 provas** no celular e para **7,0**
no desktop, onde as sete aparecem inteiras ao mesmo tempo. Nas duas telas o voo
começa e termina com as sete inteiramente fora, que é o efeito pedido.

Rotação constante e igual a `TORTO`, nenhuma prova pinta sobre o preço, vaivém
exato, console limpo.

### A lição desta sequência

Onze rodadas ajustando números num modelo que não servia ao objetivo. Os sinais
estavam lá desde cedo — "as primeiras devem começar fora", "as últimas também",
"totalmente sangradas" — e cada um era uma tentativa de descrever uma FILA
usando o vocabulário de um LEQUE. Quando um pedido de ajuste se repete mudando
de alvo a cada rodada, a hipótese a testar é que o modelo está errado, não o
parâmetro.

### Décima primeira rodada: o álbum encostado na borda direita, no celular

**O pedido:** *"Diminua mais o raio da curva da animação para o uso mobile. As
últimas imagens devem estar parcialmente sangradas também pela direita."*

**Duas mudanças, ambas só no celular.**

`RAIO_PASSO` passou a ser por faixa de tela: **0,20 no celular** contra 0,32 no
desktop. Corrente curta encosta o álbum inteiro na borda direita — a primeira
sai de vez, as últimas ficam cortadas pela MESMA borda — e é também o "raio da
curva menor" pedido, porque raio de repouso menor é arco menor.

O critério de "saiu" também virou por faixa. No desktop a prova só para quando o
CORPO INTEIRO passou da borda; no celular basta o CENTRO cruzar. Custa meia
prova de percurso, 125px numa tela de 390, e é isso que deixa a prova mais tempo
à vista sem mexer em nada do arranjo.

**Medido no repouso, quanto de cada prova fica fora pela direita:**

| | 1ª | 2ª | 3ª | 4ª | 5ª | 6ª | 7ª |
|---|---|---|---|---|---|---|---|
| celular | **105%** | 84% | 64% | 44% | 28% | **21%** | **29%** |
| desktop | **104%** | 73% | 40% | 8% | 0 | 0 | 0 |

No celular a primeira sai inteira e todas as outras ficam parcialmente cortadas,
que é o pedido. Rotação constante e igual a `TORTO`, nenhuma prova sai pela
esquerda, nenhuma pinta sobre o preço, console limpo.

### UMA LEITURA ERRADA MINHA, e ela quase virou correção

Na rodada anterior eu medi 0,21 no celular, vi "as sete entre 22% e 105% fora" e
li como defeito — subi o espaçamento para 0,32 para "salvar" o álbum. Era
exatamente o arranjo que viria a ser pedido. **Percentual fora da tela não é
medida de qualidade nesta seção**; encostar o álbum na borda é o desenho.

### Problemas em aberto

- **O desktop não recebeu o sangramento das últimas.** Fazer as últimas
  encostarem na borda direita ali exige uma corrente de menos de uma prova de
  comprimento, o que espremeria as sete em 400px de uma tela de 1440 e deixaria
  mil pixels vazios à esquerda. O pedido nomeia o celular; o desktop ficou como
  estava. Se a intenção era valer para os dois, é trocar um número — mas vale
  olhar antes.
- **Área visível no celular caiu**, e é consequência direta do pedido: no melhor
  instante o conjunto soma 1,5 prova de área à vista, contra 2,3 no arranjo
  anterior e 2,7 no desktop de hoje. Álbum encostado na borda mostra menos, por
  construção.

### Décima rodada: sangramento total e curvatura no rabo

**O pedido:** *"As primeiras imagens devem [estar] totalmente sangradas pela
direita. A curvatura (gravidade) das últimas imagens deve ser mais fechado."*

**A âncora trocou de referência.** Ela saía da MEIA-LARGURA do grupo e punha a
borda direita dele a uma tela mais uma fatia — o que deixava a primeira prova
cortada pela metade, não fora. "Fora" não é fração do grupo: é condição sobre
uma prova específica. Agora a âncora é `BORDA_P0`, a borda ESQUERDA da primeira
prova, alinhada com a borda direita da tela. A prova inteira fica de fora por
construção, em qualquer tela e com qualquer espaçamento.

**A curvatura fecha só no rabo**, com acréscimo QUADRÁTICO da metade para trás —
quadrático porque linear mudaria o arco inteiro, e só da metade para trás porque
as primeiras já estão onde precisam.

#### Dois defeitos que a medição pegou

**1. Curvar demais DESANDA a ponta.** Com `FASE_CURVA` em 0,45 a última prova
ficou com 46% do corpo fora pela direita — mais que a penúltima, quando devia
ser a que fecha o arco à esquerda. O deslocamento horizontal é o cosseno do
desvio vezes o raio, e o cosseno despenca quando o ângulo cresce: passado certo
ponto, curvar mais traz a ponta de VOLTA. Baixado para 0,25.

**2. Ancorar a primeira fora empurra a corrente toda.** Com o espaçamento que
estava (0,21), medi as sete entre 22% e 105% fora da tela — álbum nenhum. A
corrente precisa crescer na mesma medida em que a âncora empurra, então
`RAIO_PASSO` subiu para 0,320. **Não foi pedido nesta rodada**, e registro como
consequência forçada da âncora, não como iniciativa.

**3. O destino do voo virou POR PROVA.** Era um só, dividido pelo cosseno da
maior abertura, então todas iam à distância de que só a mais deitada precisava.
Com o rabo fechando, essa abertura foi de 0,60 para 0,85 rad e o destino comum
inflaria — desfazendo de lado o pedido de DIMINUIR a velocidade da rodada
anterior. Agora cada prova vai ao ponto em que ELA cruza qualquer borda, a da
direita ou a de cima, o que fez a altura da tela entrar na medição.

**Medido no repouso:** a primeira prova com a borda esquerda em 401 numa tela de
390 (celular) e em 1453 numa de 1440 (desktop) — **inteiramente fora nas duas**.

**Área visível de cada prova, no ponto em que o álbum fica enquadrado:**

| | 1ª | 2ª | 3ª | 4ª | 5ª | 6ª | 7ª |
|---|---|---|---|---|---|---|---|
| desktop (25%) | 69% | 85% | 75% | 42% | 0 | 0 | 0 |
| celular (17%) | 16% | 39% | 66% | 65% | 44% | 0 | 0 |

Rotação constante e igual a `TORTO`, nenhuma prova sai pela esquerda, nenhuma
prova pinta sobre o preço (varredura de 3×3 pontos na área comum, 9 posições),
console limpo.

**Falso positivo que quase virou correção:** o teste de camada acusou a prova 0
sobre o painel aos 25%. Era o botão flutuante do WhatsApp (`z-index: 50`)
ocupando o ponto amostrado, numa faixa de sobreposição de 10px de altura. O
teste certo pergunta se o topo É a prova, não se DEIXA de ser o painel.

### Problemas em aberto

- **No celular o álbum fica magro.** Sete provas de 220px, com a primeira
  inteiramente fora, não cabem numa tela de 390: no melhor instante somam pouco
  mais de duas provas de área visível. No desktop o mesmo arranjo rende quatro
  provas bem à vista. Se incomodar, os caminhos são reduzir o número de provas
  no celular ou afrouxar o "totalmente fora" para "quase fora".

### Nona rodada: mais espaço, e uma inversão feita e desfeita

**O pedido, em duas versões.** Primeiro *"as ÚLTIMAS imagens devem começar fora
da tela do lado direito. Aumente um pouco a distância"*, e logo depois a
correção: *"Eu errei. As PRIMEIRAS imagens devem começar fora da tela do lado
direito."*

Cheguei a aplicar e medir a inversão antes da correção chegar. Fica registrado
o que ela faz, porque a pergunta "qual ponta sangra?" vai voltar: **as fases
apontam para π, ou seja para a esquerda, então raio MAIOR é mais à esquerda e
raio MENOR é mais à direita.** Como a âncora põe a borda direita do grupo
passando da borda da tela, quem sangra é sempre a ponta de raio CURTO. Com
`RAIO0 = BASE + PASSO × i` a ponta curta é o índice 0 e sangram as PRIMEIRAS;
com `PASSO × (n-1-i)` sangram as últimas. Medido nas duas: 44-45% da primeira
fora numa, 44% da última fora na outra — simétrico, como esperado.

**O que ficou:** `RAIO_PASSO` de 0,160 para **0,210**, e a conta do raio de
volta ao `× i`.

**Medido no repouso, quanto de cada prova fica fora pela direita:**

| | 1ª | 2ª | 3ª | 4ª a 7ª | grupo |
|---|---|---|---|---|---|
| celular (390px) | **45%** | 26% | 4% | 0% | 447px (era 394) |
| desktop (1440px) | **43%** | 24% | 3% | 0% | 726px (era 638) |

As duas telas caem quase no mesmo perfil, que é o efeito de a âncora e o
espaçamento serem ambos proporcionais à pilha. Rotação constante e igual a
`TORTO`, nenhuma prova sai pela esquerda, painel de preço nunca coberto, vaivém
exato, console limpo.

### Oitava rodada: a fila deixou de ser espera e virou ritmo

**O pedido:** *"Diminua a velocidade da animação. Vamos mudar um detalhe da
animação. Ao invés das imagens seguirem uma ordem (como uma fila), as imagens
terão uma aceleração crescente, sendo o primeiro o mais lento e o último o mais
rápido, criando assim um efeito de fila."*

**A velocidade só tem uma alavanca aqui, e é a janela.** Com `scrub` não existe
`duration` nem `ease` que valha: velocidade é movimento por pixel rolado. Então
o fim desceu — `bottom 7%` → `bottom -45%` no celular e `bottom -15%` →
`bottom -75%` no desktop — e o começo ficou onde estava, que já custou três
correções em sentidos opostos.

| | janela antes | janela agora | fator |
|---|---|---|---|
| celular | 953px | 1392px | **1,46× mais lento** |
| desktop | 1346px | 1886px | **1,40× mais lento** |

Efeito de graça: janela mais longa significa que o mesmo ponto de rolagem
corresponde a um progresso menor, então o visitante encontra o álbum menos
adiantado e vê mais do voo dentro da tela.

**A fila trocou de mecanismo.** `ATRASO` e `DURACAO` saíram inteiros. Antes as
sete partiam em instantes diferentes e a fila era feita de ESPERA; agora partem
juntas e o que as separa é `VEL_MIN`/`VEL_MAX`, de 1,0 a 2,2 — a de índice 0
gasta o percurso inteiro, a última chega com 45% dele.

A diferença se vê: com atraso, quem ainda não partiu está PARADA, e parado ao
lado de coisa em movimento lê como travado. Com velocidade, todas se movem o
tempo todo e o leque abre porque umas ganham das outras.

**A trava em 1 passou a fazer dois trabalhos.** O primeiro é o de sempre: sem
ela nada para de se afastar. O segundo é novo e é o que torna a velocidade
viável — quem é mais rápido chega ao fim e ESPERA lá em vez de continuar
somando. Sem isso, dobrar a velocidade dobraria o percurso e a última prova
acabaria a duas telas enquanto a primeira ainda cruzava a borda.

**Medido, distância de cada prova ao centro da célula aos 25% do percurso:**

| | 1ª | 2ª | 3ª | 4ª | 5ª | 6ª | 7ª |
|---|---|---|---|---|---|---|---|
| celular | 77 | 58 | 125 | 212 | 301 | 386 | **460** |
| desktop | 399 | 379 | 505 | 712 | 943 | 1167 | **1366** |

O gradiente é limpo: a primeira arrasta, a última dispara, e aos 100% todas
convergem para a mesma faixa (566–615 no celular). Rotação constante e igual a
`TORTO`, nenhuma prova sai pela esquerda, painel de preço nunca coberto, vaivém
exato, console limpo.

### Armadilha de método, confirmada com sintoma novo

Abri o painel e SÓ DEPOIS defini a viewport. Como `centrarMonte` é IIFE e roda
uma vez na inicialização, ele calculou com `largura` valendo 0 e `MEIA_LARG`
saiu infinito: as provas foram parar em x = 1,2 × 10¹¹ px. Não é defeito do
código de produção — uma página real nunca inicializa com a pilha em largura
zero —, mas é a terceira vez que a viewport zerada do painel produz números
absurdos que parecem bug. **Recarregar SEMPRE depois de definir a viewport**,
nunca só redimensionar.

### Sétima rodada: a sexta foi revertida inteira

**O retorno:** *"Não ficou correto. Anteriormente estava quase 100%, era só
fazer ajuste de espaço."*

Correto, e a lição é minha. O pedido da rodada anterior tinha duas partes —
"aumente um pouco a distância" e "as primeiras devem começar fora da tela" — e
eu tratei a segunda como um problema de arquitetura quando ela era consequência
da primeira. Reescrevi quatro coisas que já funcionavam para perseguir um
sintoma.

**Revertido:** a corrente voltou a medir-se em larguras de pilha, o índice 0
voltou a ser a ponta próxima, a âncora voltou ao centro da caixa envolvente
(`CENTRO_X` e `MEIA_LARG` de volta, `SANGRA` fora), o escalonamento voltou a ser
reverso, e o piso do `raioFim` saiu junto — ele só existia para consertar um
defeito que a própria reestruturação tinha criado.

**Mantido:** uma linha. `RAIO_PASSO` de 0,100 para **0,160**.

Por que basta: a âncora usa a LARGURA DO GRUPO na conta
(`desloca = meia tela + 2·MEIA_LARG·FORA − MEIA_LARG`). Esticar a corrente
empurra as duas pontas ao mesmo tempo, então mais espaço entre as provas já
significa mais prova fora da tela — sem tocar em mais nenhum número. Era isso
que o pedido precisava, e era exatamente essa propriedade que a rodada anterior
destruiu ao trocar a âncora para uma ponta.

**Medido, contra a versão aprovada (0,100):**

| | grupo em repouso | fora pela direita | provas cortadas |
|---|---|---|---|
| celular, antes | 330px | 22% | 4 |
| celular, agora | **394px** | 22% | 3 |
| desktop, antes | 535px | 21% | 4 |
| desktop, agora | **638px** | 21% | 3 |

Dezenove por cento mais largo nas duas telas, com o mesmo sangramento
proporcional. Rotação constante e igual a `TORTO`, nenhuma prova sai pela
esquerda, painel de preço nunca coberto, vaivém exato, console limpo.

### O QUE FALHOU, e vale mais que o resultado

Perseguir "começar fora da tela" como requisito estrutural me levou a medir a
corrente em telas — e isso quebrou o desktop, onde a razão tela/pilha é 4,09
contra 1,80 do celular. A mesma corrente que agrupava no celular espalhava no
desktop a ponto de nada aparecer depois da metade do percurso. Cheguei a propor
ao usuário escolher entre celular e desktop, quando a resposta certa era não ter
mexido ali.

**Regra que fica:** quando um pedido tem uma parte quantitativa ("um pouco
mais") e uma qualitativa ("que comece fora"), testar primeiro se a quantitativa
sozinha entrega a qualitativa. Aqui entregava.

### Sexta rodada: corrente mais longa e a primeira prova nascendo fora (REVERTIDA)

**O pedido:** *"Agora aumente um pouco a distância entre cada imagem. As
primeiras imagens (a do prato, por exemplo) devem começar fora da tela do
usuário para que fique um efeito de surgimento."*

**A corrente passou a medir-se em TELAS**, e é a única grandeza do voo que fugiu
da unidade das outras. A razão é o pedido: "fora da tela" é uma distância medida
em telas, e a razão entre tela e pilha não é a mesma nas duas faixas — 390/217 =
1,80 no celular contra 1440/352 = 4,09 no desktop. Uma corrente em larguras de
pilha que transborda no celular fica com menos da metade do necessário no
desktop.

**A ordem se inverteu: o índice 0 virou a ponta LONGE da corrente.** O pedido
nomeia a prova do prato (`grade-comida.jpg`, o primeiro `<li>`, conferido no
navegador) como a que deve nascer fora, e quem nasce fora é a ponta distante,
porque as fases apontam para π e raio maior é mais à esquerda.

**A âncora deixou de ser o centro e virou a ponta curta.** `CENTRO_X` e
`MEIA_LARG` saíram. Ancorar pelo meio da caixa envolvente tinha um defeito
estrutural: esticar a corrente empurrava as duas pontas ao mesmo tempo e a borda
direita nunca chegava onde devia. Agora a prova mais próxima do polo é posta com
a borda direita já passando da tela, e a corrente se estende para a esquerda a
partir dali — o sangramento não muda quando o comprimento muda.

#### DOIS DEFEITOS QUE A MEDIÇÃO PEGOU, e nenhum era óbvio

**1. A prova mais longe ENCOLHIA em vez de sair.** Com a corrente comprida, o
raio de repouso do prato passou a 2,17 larguras enquanto `raioFim` dava 1,93 —
e "crescer" até 1,93 é encolher. Ela se recolhia para o centro, o oposto do
pedido. Corrigido com um piso: `raioFim` nunca menor que 1,25 vez a maior
distância de repouso.

**2. O escalonamento reverso deixava o prato duplamente atrasado.** A ordem
reversa veio da referência e fazia sentido enquanto o índice 0 era a prova mais
PRÓXIMA. Com ele virando a mais distante, passou a ter o percurso mais longo E a
última partida. Medido: o prato passava a viagem inteira colado na borda
esquerda e saía por cima sem nunca atravessar — pico de 39% de área visível.
Voltou para ordem direta: quem tem mais caminho parte primeiro.

**3. E a corrente de 1,15 tela era comprida demais.** Com ela o prato chegava a
39% de pico. Encurtada para 0,95, o arco fica mais perto e ele atravessa de
verdade.

**Medido no celular (390x844), área do prato à vista ao longo do voo:**

| progresso | 0 | 0,12 | 0,25 | 0,37 | 0,50 |
|---|---|---|---|---|---|
| prato visível | **0%** | 38% | **68%** | 59% | 0% |

Nasce fora, surge, atravessa e sai. O grupo em repouso mede 527px numa tela de
390 (era 330), com a borda esquerda em −49 e a direita em 478: sangra pelos dois
lados, que é a formação pedida.

Rotação constante e igual a `TORTO`, painel de preço nunca coberto, vaivém exato
nas duas telas, console limpo.

### Problemas em aberto

- **O desktop ficou visivelmente mais fraco que o celular**, e é consequência
  direta da corrente em telas. Lá a razão tela/pilha é 4,09, então a mesma 0,95
  tela espalha as provas muito mais em relação ao tamanho delas: o prato chega a
  só **35%** de pico contra 68% no celular, e **nada aparece a partir de 50%** do
  percurso. O caminho, se incomodar, é dar um `CORRENTE` menor ao desktop
  (`celular ? 0.95 : 0.62`), aceitando que ali a primeira prova não nasça fora
  da tela — não dá para ter as duas coisas com uma pilha de 352px numa tela de
  1440.
- **Metade final do voo vazia**, nas duas telas, mas pior no desktop. Já vinha
  de rodadas anteriores; a causa é o arco passar por cima enquanto a seção
  sobe.

### Armadilha de método nova

**O painel do navegador trava com scripts de medição longos.** Três chamadas
seguidas estouraram os 30s — a que juntava vaivém, rotação e teste de camada em
9 posições, e depois versões menores dela. `document.elementFromPoint` com o
painel oculto é especialmente lento. O que funciona é **quebrar em blocos de no
máximo 6 posições**, separar o que usa `elementFromPoint` do resto, e recarregar
a página quando o painel já travou uma vez.
- **No repouso as provas se cobrem muito** (visibilidade 100, 18, 25, 26, 28,
  34, 31 por cento). Isso agora é o desenho pretendido, não defeito: a
  referência empilha as cinco no mesmo ponto e só a de cima aparece parada. Mas
  derruba de vez a regra antiga de "nenhuma some", e vale confirmar com o olho
  se as sete ainda valem a pena ou se sobram fotos que ninguém vê.
- **`TORTO` com 17° de espalhamento continua sem conferência visual**, e agora
  pesa mais: com o anel regular, a torção é o ÚNICO sinal que diferencia uma
  prova da outra no repouso.
- **Sem borda, conferir se o monte vira mancha** onde as provas se cobrem. Se
  virar, a saída é sombra suave, e não a borda de volta.
- **O comentário do CSS ainda diz que o álbum mede 302px no celular.** Medido
  agora: 257×294 no repouso.

---

## 2026-08-27 — varredura de design, e cinco achados retirados

### O que foi pedido

*"Faça uma varredura do site e aponte por falhas e possíveis melhorias de design
da landingpage."*

Escopo aprovado depois da varredura: executar tudo que não dependesse de dado
externo. O número do WhatsApp e as URLs sociais existem e viriam depois; datas
de saída e depoimentos não existem.

### Como foi medido

Captura de tela não funciona neste painel, então nada aqui vem de impressão
visual. Tudo saiu de `getBoundingClientRect`, estilo computado e contraste
calculado COM composição de alfa, em 375x812, 768x1024, 1366x768 e 1440x900,
recarregando já na largura desejada.

### O QUE FALHOU: cinco achados meus que não sobreviveram ao código

Este é o registro mais útil da sessão. A varredura levantou 17 itens. Cinco
deles eram regra genérica de skill aplicada a decisões que esta página já tinha
tomado, medido e documentado no próprio CSS. Retirados, com a evidência:

| Achado | Por que caiu |
|---|---|
| "`.placa` tem dois raios, é inconsistência" | É sistema declarado: 2px na placa em fluxo para a foto não terminar em pixel cortado, 0px no leque com moldura de 3px, que é polaroid. Está em `.oferta__grade .placa`, linha 2098. |
| "Duas seções abrem com `.secao__cabeca` e três não" | As seis seções TÊM título. O que muda é o wrapper, e ele muda porque o layout muda: na `.dor` o h2 vive na coluna de texto porque a seção é split. Não é deriva. |
| "O acento troca de cor com a superfície, são quatro identidades" | Medido: `#FF6A00`, `#E85D00` e `#A03F00` têm matiz 24,9°, 24,1° e 23,6°, todos a 100% de saturação. É UM acento em três luminâncias, uma por superfície. Spread de 1,3°. |
| "As fotos do leque são cortadas no celular" | O CSS licencia explicitamente: "quem corta é o main, na borda da tela". É o efeito de álbum, e as posições atuais são resultado de uma otimização recente. |
| "O h1 quebra em 3 linhas no celular" | O token traz `/* fica: já são 3 linhas */`. Não há estouro e o CTA está na dobra, então o motivo da regra já está satisfeito. Reduzir a fonte trocaria hierarquia por conformidade. |

Também levantei duas falhas de contraste que **não existiam**: `<mark>` e
`.botao--secundario`. As duas apareceram porque a primeira sonda tratou
`rgba(255,106,0,0.22)` como laranja opaco. Compondo o alfa corretamente: 9,69:1
e 5,01:1, ambos passam. Sonda de contraste que não compõe alfa mente para cima
e para baixo.

**A lição:** numa base assim, a ordem certa é ler o comentário do CSS ANTES de
abrir achado. Cinco dos dezessete já estavam respondidos a poucas linhas do
código que eu estava medindo.

### O que mudou

**Cabeça do documento.** `theme-color` de `#0E0E0F` para `#161B13`, que é o
fundo real. `og:image` virou absoluto, mais `og:url`, `canonical`,
`og:image:width/height` (1200x630, conferido lendo o SOF do JPEG, não confiando
no nome), `og:image:alt`, `og:site_name` e os três `twitter:`. Tudo com
`SEU-DOMINIO-AQUI` marcado, porque o domínio de produção não existe em nenhum
arquivo do projeto.

**JSON-LD.** `TouristTrip` + `Offer` com preço, moeda, capacidade, itinerário de
4 etapas e provider. **Sem nenhum campo de data**, e a ausência está comentada
no próprio bloco: `startDate` inventado é dado estruturado falso entregue direto
ao Google, que é pior que dado nenhum.

**Um CTA contextual no fim do roteiro** (`.remate-acao`). Os botões estavam a
7%, 82% e 85% da rolagem: 7.281px de celular sem chamada em linha. Agora 7%,
37%, 82%, 85%, e a maior lacuna caiu de 75% para 45% da altura do documento.

Não entrou um segundo remate no fim da `.dor`, e essa foi a correção do meu
próprio plano. O CSS de lá diz "quando o CTA repetido saiu", e as posições
explicam quem tirou: a `.dor` termina a ~1000px do botão do painel. Dois botões
iguais a mil pixels um do outro são ruído, não insistência.

**O mapa some abaixo de 64rem.** Varrendo a rolagem de 200 em 200px no celular,
ele cobria **69 elementos de texto**: o h1, o título e a linha de cada seção, os
parágrafos do roteiro. 92px sobre 375 é 25% da largura. `pointer-events: none` e
`aria-hidden` protegiam o toque e o leitor de tela, e nenhum dos dois fazia nada
por quem lê com os olhos. A função não fica órfã: no celular quem diz onde o
visitante está é o contador 01/04 da planilha.

**Seção de depoimentos**, CSS pronto e HTML comentado. E **três slots de
objeção** em `.regras` (seguro da moto, nível e motos aceitas, cancelamento),
também comentados.

**`.folha__etapa`** passou de `0.6875rem` literal para `var(--txt-micro)`. Mesmo
valor, zero mudança na tela. É deriva de token do tipo que o próprio bloco de
tokens avisa que produziu 32 tamanhos soltos no site antigo.

### O que foi decidido NÃO fazer

**`autoplay` nos vídeos.** O diagnóstico estava certo, o vídeo é a única peça da
página que degrada sem JS enquanto todo o resto é aprimoramento progressivo. A
correção seria pior: `autoplay` sobrepõe `preload="none"`, então dispararia
1,3MB no parse para 100% dos visitantes, para beneficiar só quem está sem JS,
que já recebe um poster bom.

**Rótulos de 11px para 12px.** Os rótulos da régua da planilha têm largura ZERO
no celular, ou seja não são problema de celular. Sobra `.folha__etapa`, e 11px
é o papel exato do token `--txt-micro`. Brigar com o sistema por 1px num rótulo
de chrome com 5,23:1 de contraste não se paga.

### O que foi medido depois

| Item | 375 | 768 | 1440 |
|---|---|---|---|
| Estouro horizontal | 0 | 0 (só barra) | 0 (só barra) |
| Mapa | oculto | oculto | visível, anima |
| CTA do herói na dobra | sim | sim | sim |
| Rótulo do remate | 1 linha | 1 linha | 1 linha |
| Maior lacuna entre CTAs | 45% | — | 53% |

Contraste da linha nova: 8,05:1. JSON-LD parseia. Console sem erro. Nenhum dos
textos de placeholder vaza para o `innerText` renderizado (conferido contra 8
strings). Mapa no desktop: `mapa--visivel` entra, `strokeDashoffset` desenha,
volta ao repouso no topo, com `ScrollTrigger.update()` forçado à mão, porque o
painel não compõe quadros.

O grid de 3 colunas dos depoimentos foi testado injetando uma sonda com três
itens de texto realista em 768: 205px cada, mesma linha, sem estouro.

### Segundo pedido da sessão: retirar o YouTube

*"Não temos canal no Youtube. Retire e alinhe os demais."*

O "alinhe" era um sintoma real, e a causa estava a uma linha do item removido:
`.redes__lista` tinha `grid-template-columns: repeat(4, 1fr)`, contagem na mão.
Tirar o YouTube deixaria três marcas numa grade de quatro colunas, encolhidas a
3/4 da linha, com a régua de fios parando no vazio.

Trocado por `grid-auto-flow: column` mais `grid-auto-columns: 1fr`, que não sabe
quantos itens existem: os filhos que houver dividem a linha em partes iguais.
Voltar com o YouTube um dia é acrescentar o `<li>` e mais nada. O `<symbol
id="marca-youtube">` também saiu, porque sprite guarda peso de ícone que ninguém
mais referencia.

**O efeito colateral que a remoção do mapa tinha deixado.** Medindo o rodapé
depois disso, apareceram 198px de padding embaixo no celular. A origem era
`--altura-mapa: 150px`, descrito no token como "o que o mapa ocupa no rodapé do
celular". Duas coisas erradas no mesmo nome: o mapa não morava no rodapé fazia
tempo, e depois da mudança desta sessão ele não existe no celular. Reserva para
elemento ausente.

Não dava para simplesmente cortar. Quem ocupa o pé da tela é o botão flutuante,
56px a --e-4 da borda, 72px contados de baixo, e a linha de copyright quebra em
DUAS linhas no celular chegando a 355px de uma tela de 375, ou seja dentro da
coluna do botão. Medido com o corte seco para 48px: o flutuante sentava em cima
dela.

Token renomeado para `--reserva-flutuante: 96px`, que é o nome do que ele
realmente reserva: 72 do botão mais 24 de folga. Rodapé no celular caiu de 198
para 96px, e a folga medida entre o copyright e o botão ficou em exatos 24px.

**URLs sociais recebidas e aplicadas** no mesmo passo, junto com `sameAs` no
provider do JSON-LD, que agora carrega dado verdadeiro.

| Medido depois | 375 | 768 | 1440 |
|---|---|---|---|
| Redes na mesma linha | empilhadas (correto) | sim | sim |
| Larguras iguais | — | 226/226/226 | 341/341/341 |
| Preenchem a linha inteira | — | sim | sim |
| Links mortos | 0 | 0 | 0 |
| Rodapé embaixo | 96px | 96px | 48px |
| Flutuante sobre o copyright | não | não | não |

Altura do documento no celular caiu de 9.880 para 9.721px.

### O QUE FALHOU, parte 2: o botão do remate nasceu sem escala

*"O botão (tanto para mobile quanto desktop) está pequeno. Corrija."*

Bug meu, e da categoria que só aparece olhando. Escrevi o CTA do remate como
`class="botao botao--primario"` e parei aí. Acontece que `.botao` não traz
`min-height`, `padding` nem `font-size`: a escala inteira mora nos
modificadores. Sem um deles o botão fica com a altura da linha de texto e mais
nada.

Resultado: o menor CTA primário da página, plantado no ponto de maior desejo
dela. Ele era mais baixo até que o `.botao--secundario` da nota de quórum, que
é o botão de MENOR peso do sistema.

A escala que já existia e eu não usei:

| Modificador | min-height | font-size | Papel |
|---|---|---|---|
| `--secundario` | 48px | 13px | ação subordinada |
| `--grande` | 56px | 15px | ação solta rematando seção |
| `--bloco` | 60px | fluida até 19px | fecha a coluna do painel |

Corrigido com `--grande`, e não `--bloco`: o papel do remate é o MESMO do CTA do
herói, ação solta que fecha uma seção. `--bloco` traz `width: 100%` embutido e
existe para a caixa do preço.

Medido depois, o remate ficou idêntico ao herói nas três dimensões, em 375 e em
1440: mesma altura, mesma largura, mesma fonte. Hierarquia final: quórum 48,
herói 58, remate 58, painel 64. O painel segue sendo o maior, que é onde está o
preço.

**A lição:** num sistema em que o elemento base é só comportamento e o tamanho
mora todo no modificador, esquecer o modificador não gera erro nem aviso. Gera
um elemento silenciosamente fora de escala. Ao reusar um componente desta
página, conferir qual modificador de tamanho os irmãos dele usam.

### O mapa volta ao celular, e a tentativa de "melhorar" no caminho falhou

*"Adicione de volta o mapa no uso mobile."*

Decisão do usuário, e ela reverte a remoção feita mais cedo nesta mesma sessão.
Mas o caminho até a versão final tem uma tentativa desfeita que vale registrar,
porque ela parecia obviamente certa e a medição disse não.

**A tentativa.** Meu próprio comentário, escrito na hora de remover, dizia: "se
um dia ele precisar voltar, o caminho não é reduzir os 92px, é SAIR DA COLUNA DE
LEITURA, o que significa outra âncora". Segui esse conselho e reancorei embaixo à
esquerda, longe da faixa onde caem os títulos, do lado oposto ao botão
flutuante. Parecia resolver.

**A medição derrubou.** 65 sobreposições contra 69. Quatro a menos, ou seja
nada, MAIS uma colisão nova e permanente com o logo e o copyright do rodapé.

Refiz o teste com as cinco variantes, e a primeira rodada saiu inválida por erro
meu: fixei `top` inline sem zerar o `bottom` da folha, e o mapa esticou para
716px de altura em todas as variantes de topo. Os números só passaram a valer
depois de isolar as âncoras.

| Variante | Sobreposições | Títulos | Rodapé |
|---|---|---|---|
| alto-direita 92 (o original) | 66 | 15 | livre |
| **alto-direita 76** | **64** | **14** | **livre** |
| baixo-esquerda 76 | 65 | 15 | colide |
| baixo-esquerda 64 | 61 | 13 | colide |
| baixo-direita 64 | 67 | 16 | colide |

**Por que a posição não importa.** Tudo entre 61 e 67. O motivo é geométrico e
eu devia ter previsto: numa tela de 375 a coluna de leitura ocupa a largura toda
menos 20px de cada lado, então qualquer peça fixa cai sobre texto em qualquer
altura da rolagem. Não existe canto vazio para achar. A premissa do meu próprio
comentário ("sair da coluna de leitura") era impossível de satisfazer no celular.

E toda âncora inferior colide com o rodapé, porque o rodapé alinha conteúdo à
esquerda e o flutuante mora à direita. Trocar cinco sobreposições transitórias
por uma colisão permanente com o logo é troca ruim.

**O que ficou.** A âncora original, alto à direita, com o único ajuste que se
paga: 76px em vez de 92. Entrega 2 sobreposições e 1 título a menos, de graça, e
cai de 25% para 20% da largura da tela. Abaixo de 76 não vale: o traço mais fino
do desenho tem 1,4 de 120 unidades, o que já dá 0,9px nesse tamanho.

O rodapé NÃO voltou a reservar espaço para o mapa. Com âncora no alto, quem
ocupa o pé da tela é só o botão flutuante, e é isso que `--reserva-flutuante`
mede. Os 96px continuam certos.

Verificado depois em 375: mapa visível, anima, leitura mostrando "SC
Florianópolis" no meio da rolagem, volta ao repouso no topo, e sem colisão com
logo, copyright ou flutuante na rolagem máxima. Em 1440 nada mudou: calha
esquerda em x=64, centrado na vertical, rodapé com 284px de padding-left.

**A lição:** conselho deixado num comentário é hipótese, não conclusão. Escrevi
"a saída é outra âncora" sem ter medido outra âncora. Quem leu o comentário
depois, inclusive eu, tratou como fato.

### Legenda fora do celular, e o mapa cresce para 120px

*"Retire os textos do mapa para o usuário mobile e aumente o tamanho do mapa."*

As duas coisas se pagam uma à outra, e por isso saíram juntas. A legenda é o
bloco mais ALTO da peça: duas linhas de mono somam 57 dos 158px do mapa em 76px
de largura. Escondê-la libera altura, e a altura liberada vira largura.

Medido varrendo a rolagem de 200 em 200px em 375x812:

| Configuração | Sobrepõe texto | Títulos | % da tela |
|---|---|---|---|
| 76 com legenda (o que era) | 64 | 14 | 20% |
| 76 sem legenda | 50 | 8 | 20% |
| 100 sem legenda | 58 | 11 | 27% |
| **120 sem legenda** | **64** | **14** | **32%** |
| 140 sem legenda | 67 | 15 | 37% |
| 160 sem legenda | 69 | 15 | 43% |

Tirar só a legenda derruba de 64 para 50 sobreposições. **120px é o ponto de
equilíbrio**: custa exatamente o que a versão anterior já custava, 64 e 14, e
entrega um desenho 58% maior. Acima disso a conta piora e 160 come 43% da tela.

Ganho de brinde: em 120px o SVG fica 1:1 com o viewBox de 120x160, então o traço
da rota renderiza nos 2,6px nominais e o do fantasma em 1,4px. É a melhor
legibilidade que o mapa já teve no celular.

E o que a legenda dizia, o desenho já mostra: o pino aceso é a parada atual. O
nome da cidade era legenda de coisa visível, e legenda custa altura.

No desktop ela fica: lá a peça tem calha própria de 220px e o texto não disputa
com nada.

### O QUE FALHOU, parte 3: um comentário com aritmética vencida

Ao esconder a legenda, fui conferir de quem mais o `data-superficie` dependia, e
achei um defeito PRÉ-EXISTENTE que não é meu, mas que a nota do bloco garantia
não existir.

A troca de cor por superfície vive dentro de `@media (max-width: 63.999rem)`, ou
seja só no celular. A nota justificava assim: "no desktop a leitura ocupa de 64
a 214px de uma tela de 1440, e as faixas claras começam em 139 e 235, logo a
leitura fica FORA das faixas claras, sempre sobre o escuro".

Essa conta valia quando `--largura-mapa` era 150px. Hoje o token vale **220px**.
Medido a 1440:

    .mapa__uf     "RS"             tinta de 64 a  83   termina 56px ANTES de 139
    .mapa__local  "Porto Alegre"   tinta de 64 a 177   INVADE 139 em 38px

A cauda do nome da cidade cai sobre a faixa clara do `.escopo`. Sobre papel,
`--tinta-media` entrega 1,66:1. A faixa da `.oferta` começa em 235 e continua
livre.

**Não corrigi**, e a nota agora explica por quê: toda saída custa uma decisão de
desenho que não é minha para tomar. Ligar a troca no desktop apagaria os 64-139
que estão sobre escuro (tinta escura sobre escuro). Estreitar a leitura quebra
"Florianópolis" em duas linhas. Voltar `--largura-mapa` para 150 encolhe o mapa
do desktop, que ninguém pediu. Fica anotado no CSS para escolha.

**A lição, que é a mesma da parte 2 por outro caminho:** comentário que guarda
NÚMERO envelhece junto com o token que ele mede, e não avisa. A nota afirmava
uma conclusão geométrica derivada de um valor que mudou embaixo dela, e seguia
lá, com ar de fato verificado. Número em comentário precisa dizer de qual token
ele saiu.

### O que foi medido depois

375: mapa 120x160 no canto, 16px da borda, legenda com altura 0, traços em 2,6 e
1,4px, sem colisão com logo, copyright ou flutuante na rolagem máxima, anima e
volta ao repouso, sem estouro horizontal.

1440: mapa 220px, legenda visível a 13px mostrando "RS Porto Alegre", anima
normal, sem estouro.

### O que ficou em aberto

Tudo que depende de dado que a página não tem:

1. **Número do WhatsApp**, ainda `5500000000000` nos 5 pontos. Todo caminho de
   conversão termina em erro. O usuário disse ter o número.
2. ~~Links sociais~~ **RESOLVIDO.** YouTube removido (não existe canal),
   Instagram e Facebook com URL real, `sameAs` no JSON-LD.
3. **Domínio de produção**, para trocar `SEU-DOMINIO-AQUI` em 6 lugares.
4. **Datas de saída.** A página descreve seis dias hora a hora, o preço, o
   quórum e as formas de pagamento, e nunca diz quando a expedição sai.
5. **Depoimentos.** Seção pronta, esperando frase de gente real.
6. **As três objeções** de `.regras`.

---

## 2026-08-25 — cores da oferta

### O que foi pedido

*"Tente deixar as cores da oferta mais indutivas ao consumidor comprar."*

### O diagnóstico

O painel de preço não tinha cor quente nenhuma até o botão, lá embaixo. Título,
as três cifras e a borda de topo em menta; todo o resto em tinta média. O
laranja da marca — a cor que nesta página significa *ação* — aparecia uma vez
só, no fim, sem nada antes que levasse o olho até ele.

E o pior: **os dois descontos estavam pintados de letra miúda.** "com os 10% de
desconto já aplicados" e "5% de desconto" corriam em `--tinta-media`, a mesma
tinta do aviso de vencimento do boleto. O melhor argumento de venda do painel
tinha exatamente a cor do rodapé jurídico.

### O que mudou

**Um elemento `<mark>`, estilizado como traço de caneta marca-texto na cor da
marca** (`assets/css/estilo.css`, seção de superfícies do navegador, junto de
`::selection` e do anel de foco):

```
mark { background: rgb(255 106 0 / 0.22); color: var(--tinta); font-weight: 700;
       padding-inline: 0.28em; box-decoration-break: clone; }
```

Aplicado em duas frases de `index.html`, e só nelas: "10% de desconto" e "5% de
desconto".

Três decisões dentro dessa regra:

- **Laranja com alfa, não chapado.** Chapado com rótulo escuro ele viraria um
  segundo botão dentro do parágrafo, e a página tem UM lugar onde o laranja é
  sólido, que é a ação. Com alfa ele compõe contra a superfície de baixo, papel
  ou tinta, sem precisar de par por superfície — a mesma lógica de
  `--linha-sutil`, por outro caminho.
- **`color` explícito.** O padrão do navegador é preto; e a frase marcada precisa
  SUBIR de tinta média para tinta cheia. Quem marca, marca para ler.
- **`<mark>` pelo significado, não pela cor.** O elemento existe para sinalizar
  relevância dentro de texto corrido, que é o papel exato dessas duas frases.

### O que foi medido

| Par | Contraste |
|---|---|
| `#DDE2E4` sobre o marcador em tinta (`#492C0F` composto) | **9,74:1** |
| `#2D3329` sobre o marcador em papel (`#E4C8B2` composto) | 8,16:1 |
| `--tinta-media` sobre tinta (o texto ao redor) | 8,05:1 |

O texto marcado é o de **maior contraste do parágrafo** — sobe em relação ao que
está em volta, que é o efeito pretendido.

Sem quebra de linha em nenhum dos dois marcadores (`getClientRects().length === 1`
em 390px e em 780px), sem `overflow-x`, e a altura do painel ficou em 628,4px,
idêntica à de antes da mudança: o marcador não custou pixel nenhum de altura.

### O que foi tentado e DESFEITO — halo laranja no botão

Cheguei a pôr `box-shadow: 0 8px 24px rgb(255 106 0 / 0.30)` no
`.botao--primario`, com hover mais aberto e `:active` recolhendo, para o botão
ler como peça acesa dentro da placa apagada. **Foi revertido**, por dois motivos,
e a nota ficou no CSS para ninguém repetir:

1. **Este mundo não brilha.** A página é folha impressa e placa esmaltada. Halo
   colorido é o verniz de interface genérica; nada num roadbook impresso emite
   luz. O hook de design da `impeccable` sinalizou como `dark-glow` e estava
   certo.
2. **A aritmética já estava escrita na própria base.** A nota das superfícies diz
   que sobre `#161B13` uma elevação plausível entrega **1,08 de contraste** — foi
   por isso que a placa se separa por fio de 1px e não por sombra. Sombra preta
   não se veria; sombra colorida só se vê porque é *cor*, e aí não é elevação, é
   enfeite. O precedente da casa é `.botao--flutuante`, com sombra neutra.

E o botão não precisava: já é a barra de maior croma da página, chapada, 60px,
sobre quase preto. **O que faltava não era brilho nele — era o laranja aparecer
em algum lugar ANTES dele.** É o que os dois marcadores passaram a fazer, e o
painel ganhou um caminho quente de cima para baixo: marca → cifras → marca →
botão.

### Hook de design: a triagem completa

Os dois `dark-glow` sumiram sozinhos com a reversão do halo. O `Stop` trouxe
mais seis, **nenhum deles do que foi mexido nesta sessão**. Todos medidos no
navegador antes de qualquer decisão:

| Achado | O detector diz | Medido |
|---|---|---|
| `undersized-ui-text` "R$" | 6,72px | **18,99px** em 390 / 25,22px em 780 |
| `undersized-ui-text` ",50" | 8,32px | **23,51px** em 390 / 31,22px em 780 |
| `cramped-padding` `section.papel` | encostado na borda | **96px** em cima, 40px nas laterais |
| `cramped-padding` `section.dor` | encostado na borda | **96px** / 40px |
| `cramped-padding` `section.redes` | encostado na borda | **80px** / 40px |
| `tight-leading` 1.25 | prosa apertada | dois sítios, os dois de **display** |
| `gray-on-color` no marcador | cinza lavado sobre cor | **9,74:1**, acima dos 8,05:1 em volta |

Três causas-raiz, todas do detector e nenhuma da página:

1. **Não resolve `em` contra pai não-raiz.** `.preco__moeda` é `0.42em` e
   `.preco__centavos` é `0.52em`; ele multiplicou por 16px de raiz em vez do pai
   real, de 45 a 68px.
2. **Não resolve os tokens `var(--e-N)`** de espaçamento desta base, então lê
   como zero todo `padding` de seção.
3. **Não distingue display de prosa.** Os dois `1.25` são `.dor__remate`
   (manchete Archivo 800, e o 1.25 já foi escolhido POR CIMA de 1.15 para dar
   folga às descidas) e os totais do painel (cifra de uma linha só, verificada em
   quatro larguras). A prosa desta página corre em 1.45-1.5.

### O detalhe que fez os primeiros ignores não valerem nada

Registrei primeiro `ignore-value` com o valor impresso na linha do achado, do
jeito que a instrução do hook sugere. **Não funcionou**, e a leitura de
`hook-lib.mjs:856` explica por quê: `extractFindingIgnoreValue` só devolve valor
para seis regras — `overused-font`, `bounce-easing` e as quatro
`design-system-*`. Para qualquer outra ela devolve string vazia, e um ignore por
valor nunca casa. **Para essas regras a única forma que funciona é `"*"` com
`--file`.**

Sinal de que o ignore está inerte: rodar
`node .claude/skills/impeccable/scripts/detect.mjs <arquivo>` e o achado
continuar lá. Cuidado com um detalhe: o `detect.mjs` cru honra o escopo de
arquivo mas **não** deduplica contra o cache da sessão, então ele é o teste
honesto — o hook pode silenciar um achado só por já tê-lo reportado antes.

Estado final, em `.impeccable/config.json`, todos com escopo de `index.html`:
`gray-on-color`, `undersized-ui-text`, `tight-leading` e `cramped-padding` em
curinga. As quatro entradas por valor que não funcionavam foram removidas para o
arquivo não carregar regra morta. `detect.mjs` sai limpo nos dois arquivos.

**O custo, declarado:** curinga por arquivo silencia a regra inteira em
`index.html`, que é a página toda. Um `9px` absoluto de verdade passaria batido
daqui em diante. Não havia forma mais estreita disponível na ferramenta.

### O que NÃO foi feito, de propósito

- **As cifras continuam em menta.** Pintá-las de laranja quebraria a regra de que
  laranja é ação, e preço em cor de botão lê como clicável.
- **Nenhuma cor nova entrou na paleta.** A tentação era um âmbar de "economia";
  seria um quarto tom quente ao lado de `--laranja`, `--alerta` e do amarelo do
  percurso, e paleta com quatro quentes não tem hierarquia, tem ruído.
- **Só DOIS marcadores.** O marcador significa "isto é o que você economiza". Um
  terceiro em cima de escassez ("15 vagas") mudaria o significado para "qualquer
  coisa importante", e marcador que marca tudo não marca nada.
- **Nenhum dos dois planos foi eleito o recomendado.** Ver abaixo.

### O que ficou em aberto — decisão do usuário

1. **Marcar o Pix como plano recomendado.** É a alavanca de conversão mais forte
   que sobrou: uma lavagem laranja de ~6% de alfa atrás do bloco `.plano--avista`,
   na mesma linguagem de marca-texto, em escala de bloco. É honesta (o Pix é de
   fato mais barato para o comprador) e é padrão em painel de dois planos. **Não
   fiz porque escolher qual plano a página empurra é decisão comercial, não de
   design:** hoje o painel abre com o sinal a 45px, que é o enquadramento de
   entrada acessível. Marcar o Pix desloca a ênfase. É mudança de uma regra.
2. **Dizer a economia em reais.** O painel diz "5% de desconto" mas nunca diz
   *R$ 299,50* — que é a subtração exata dos dois totais que já estão na página
   (5.990,00 − 5.690,50), não um número inventado. Desconto em porcentagem é
   abstrato; em reais é concreto. Isso é mudança de texto, não de cor, por isso
   ficou de fora.
3. **A cor de alerta está gasta numa proibição.** `--alerta` coral marca hoje
   "não é permitido entrar na pousada com bebida comprada fora" — a única coisa
   colorida do bloco de regras é uma repreensão, enquanto a escassez real (15
   vagas, quórum de 10) corre em neutro. Vale decidir se é ali que a única cor
   das regras deve estar.

### Armadilhas de método desta parte

- **O servidor da outra conversa morreu no meio da sessão** (`ERR_CONNECTION_REFUSED`),
  e `navigate` falhava sem dizer por quê. `preview_start` com `name: landing`
  subiu o próprio e resolveu. Quando `navigate` recusar duas vezes seguidas,
  conferir se a porta ainda responde antes de investigar o resto.
- **`screenshot` deu timeout de novo.** A verificação de cor foi feita compondo
  o alfa à mão em JS e rodando a fórmula de luminância relativa da WCAG sobre o
  resultado — dá o número exato sem depender de o painel compor quadro.

---

## 2026-08-25 — hierarquia tipográfica do painel de preço

### O que foi pedido

*"A hierarquia de tamanho de fontes no uso mobile não parece estar correta na
parte de preço e pagamento do site."*

### O que estava errado (medido em 390×844, antes)

| Elemento | Corpo | Cor |
|---|---|---|
| `.preco__figura` — R$ 1.497,50 (sinal) | 45,2px | menta |
| `.preco__parcelas` — "mais 10 parcelas de R$ 449,25" | 15px | tinta média |
| `.preco__condicao` — aviso do boleto | 13px | tinta média |
| `.plano__fecho dd` — **R$ 5.990,00 total a prazo** | **13px** | branco |
| `.plano--avista .plano__valor` — **R$ 5.690,50 à vista** | **17px** | menta |

Três defeitos concretos:

1. **Os dois totais estavam em degraus diferentes.** São as duas cifras que o
   visitante precisa comparar — o mesmo preço em duas formas de pagar — e a
   escala dizia que uma era letra miúda (13px, branco, o corpo do aviso do
   boleto) e a outra era texto (17px, menta).
2. **Inversão dentro do plano parcelado**: a parcela derivada (15px) vinha dois
   pixels ACIMA do total que ela decompõe (13px).
3. **Quatro papéis distintos empilhados em 13px** — condição do painel, aviso do
   boleto, "Total a prazo" e o rótulo do à vista. Tudo abaixo da cifra grande
   virava uma textura só.

### O que mudou

`assets/css/estilo.css`:

- Token novo `--txt-total: clamp(1.0625rem, -0.08rem + 5.71vw, 1.3125rem)`.
- `.plano__fecho dd` e `.plano--avista .plano__valor` viraram **uma regra só**:
  mesmo corpo, peso 700, mono a 78%, cor `--acento`.
- `.plano__linha` perdeu o `display:flex` e o `gap`; o fecho agora empilha
  rótulo sobre valor, igual ao bloco à vista. Os dois planos passaram a ter a
  mesma anatomia, que é o que os faz lerem como alternativas.
- Removida a regra `.plano--avista .plano__linha { display:block }`, que existia
  só para desfazer o flex, e a cor `--tinta` de `.plano__linha dd`.

Escala resultante no celular: **45 / 21 / 15 / 13**.

### Por que o corpo dos totais é fluido, e não fixo

Medido no navegador com um span oculto, em mono `font-stretch:78%`, peso 700,
para a string "R$ 5.990,00 por pessoa":

| Corpo | Largura pedida | Cabe em 390 (col. 309px) | Cabe em 320 (col. 239px) |
|---|---|---|---|
| 17px | 228,9px | sim | sim |
| 19px | 255,8px | sim | **não** |
| 21px | 282,8px | sim | não |
| 23px | 309,7px | **não** | não |

Fixo em 21 quebra em 320 e deixa "pessoa" órfã debaixo da cifra; fixo em 17, que
é o que cabia em 320, devolve o problema original — o total a dois pixels do
texto de apoio. A inclinação leva 17px em 320 a 21px em 390, e o teto segura
daí para cima.

### O que foi verificado

| Largura | Sinal | Totais | Linhas por total | overflow-x |
|---|---|---|---|---|
| 320 | 44px | 17px | 1 | não |
| 390 | 45,2px | 20,99px | 1 | não |
| 1280 | 68px | 21px | 1 | não |

Os dois totais batem no mesmo corpo em toda largura, e nenhum quebra em duas
linhas.

### O que falhou

- **`screenshot` deu timeout de novo**, como em toda sessão: o painel do
  navegador não compõe quadros. A verificação inteira foi numérica, via
  `getComputedStyle` mais `getBoundingClientRect`.
- **A troca de folha com `rAF` dentro de `Promise` travou o `javascript_tool`
  por 30s.** Com o painel congelado, `requestAnimationFrame` nunca dispara e a
  promessa nunca resolve. Trocar `link.href` de forma síncrona e medir na
  chamada seguinte funciona; esperar quadro, não.
- **A porta 5173 já estava ocupada** por um servidor de outra conversa.
  `preview_start` com `name` recusa; abrir com `url` na mesma porta funciona,
  porque o `python -m http.server` serve a mesma pasta do disco.

### O que ficou em aberto

- Em **320px a escala volta a 44 / 17 / 15 / 13**, com o total a dois pixels do
  apoio. É o piso do clamp e é degradação consciente, não bug — mas se 320
  passar a importar, o caminho é ganhar largura de coluna (o painel gasta ~37px
  de padding de cada lado), não subir o corpo.
- `.preco__parcelas` **quebra em duas linhas em 320px**. Já era assim antes desta
  sessão; não foi mexido.
- `.preco__centavos` está em `0,52em` (23,5px em 390), ou seja, o fragmento
  ",50" é maior que um total inteiro. Deixado como está de propósito: lê-se como
  um número só, não como três corpos. Se voltar a incomodar, o degrau é `0,46em`.
- Bloqueios antigos seguem: número real do WhatsApp, URLs das redes, data da
  expedição, `assets/media/og.jpg`, pixel de rastreio.

---

## 2026-08-25

### O que foi pedido

*"A animação não está ficando como eu sugiro. Vamos começar a animação do zero e
planejar antes de implementar."*

Planejei, perguntei, e as três respostas fecharam o desenho:

1. **Movimento**: fila. Uma puxa a outra pelo mesmo caminho.
2. **Tamanho**: não diminuir. *"Aloque as imagens mais juntas (estilo baralho na
   mão), assim todas irão caber."*
3. **Repouso**: monte compacto, fotos se cobrindo.

### A ideia que destravou

**Leque de baralho já é um pedaço de pista.** Numa mão de cartas todas giram em
torno de um pivô abaixo delas, então os centros ficam sobre um arco de raio
constante e a inclinação de cada carta é a posição angular dela nesse arco. Não é
um arranjo à parte: é uma curva com a rotação amarrada à tangente.

E a curva que liga um arco de raio constante a uma reta sem salto de curvatura é
a clotoide, que é para isso que existe em engenharia de estradas. A pista virou
**arco do leque, clotoide, reta**, contínua, com as cinco provas como pontos
sobre ela.

O que tornou tudo simples: **construir a pista integrando o perfil de
curvatura** em vez de emendar fórmulas. Definido `K(s)`, saem `θ(s)`, `x(s)` e
`y(s)`, e a junta fica contínua por construção. O risco que o plano levantava
("a emenda pode dar um tranco") virou não-problema: maior salto de curvatura
medido, **0,02 grau**.

### O número que explica todos os fracassos anteriores

**As cinco fotos somam 46% da área da tela.** Cinco objetos desse tamanho não
podem ficar separados perto do centro. A roseta, o anel de 1,25, o desvio
constante, o degrau de tamanho e o álbum no miolo da espiral tentaram todos
**separar**. Baralho **empacota**, e mesmo assim todas aparecem porque cada carta
mostra uma fatia.

### Resultado medido

| | Antes | Agora |
|---|---|---|
| Menor prova visível em repouso | 8% | **24%** |
| Área visível das cinco | 83, 86, 21, 8, 17 | **100, 25, 25, 25, 24** |
| Forma do álbum | 250 × 346 (monte alto) | **353 × 207** (leque) |
| Folga até o painel | 65px | **137px** |
| Velocidade | 1,04 a 1,35 | **0,46 a 0,48**, quase constante |
| Mergulho abaixo da partida | 0 | **0** |

Estruturais: inclinações de -24, -12, 0, 12 e 24 graus (passo de 12 exatos),
centros a 38px exatos, espaçamento abrindo de 38 para 188px no voo, giro da líder
de -24 a -78 graus. A fila foi verificada e não suposta: **88 a 95% do caminho de
cada prova cai a menos de 2px do caminho da anterior**, com ângulos dentro de
0,6 grau.

Desktop de 1440 conferido, mesmos ângulos, mínimo de 24% visível, folga de 182px.
Console limpo, rolagem lateral zero, movimento reduzido intacto (a seção inteira
é fechada por `prefers-reduced-motion: no-preference`, então a classe da pilha
nunca entra e a grade de 3 colunas fica).

### O que deu errado no caminho

- **O JS também vem em cache**, não só o CSS. Medi um resultado inteiro com o
  código antigo rodando e só percebi porque os ângulos vieram `[-7, 5, 11, -4, 8]`,
  que eram os valores da versão anterior. `?v=` no documento não invalida o
  `<script src>`. O jeito que funcionou:
  `fetch('assets/js/roadbook.js', {cache:'reload'})` na MESMA url, sem query, e só
  depois recarregar.
- **Medir visibilidade pela caixa da carta girada mente.** Uma carta de 172px
  girada 24 graus tem caixa de 227px, e os cantos vazios contam como área
  escondida. Deu 16% onde o valor real era 24%. Amostrar dentro do quadrilátero
  real, usando a matriz de transform.
- **Verificar "estão todas na mesma pista" comparando com o caminho de UMA prova
  dá falso negativo.** Nenhuma prova sozinha percorre a pista inteira: a líder
  nunca anda no arco do leque, e a última nunca chega ao fim da reta. Deu 117px e
  depois 525px de erro, os dois artefatos. O teste certo é comparar pares
  vizinhos no trecho em que os caminhos se sobrepõem.
- **Uma prova aparecendo 0% no meio do voo não era defeito**: era ela passando
  atrás da barra fixa do topo ao sair da tela. Conferido com `elementFromPoint`,
  que devolveu `DIV.barra__interior`.

### Problemas em aberto

1. **A leitura do mapa no desktop cai sobre papel claro.** Continua igual: vai
   até x=177 e a faixa `.papel.escopo` começa em x=139, então ~38px do nome da
   cidade ficam com tinta clara sobre fundo claro. A detecção de superfície em
   `assets/js/roadbook.js` só compara o eixo Y.
2. **O leque tem 353px numa tela de 390.** Cabe, mas com pouca margem. Se a foto
   crescer ou a tela encolher, o pivô e o passo precisam cair juntos, e abaixo de
   ~15% de fatia a carta some.
3. **`largura` fica velha depois de redimensionar** até a ScrollTrigger
   refrescar. Só incomodou na medição até agora.

### Segunda rodada do mesmo dia: centralizar e trocar o leque pela mesa

*"As imagens não estão bem centralizados (corrija isso). A ideia das imagens
estarem distribuídas como cartas na mão não ficou muito bom (distribua as
imagens como estivessem espalhados numa mesa)."*

**A centralização.** O monte estava 119px à direita do centro da célula numa tela
de 1440. Causa: a pista começa em (0,0) e o arco corre todo para um lado, então a
origem da pista era o começo do arco e não o meio do monte.

A primeira correção, pelo centroide dos centros, ainda deixou 45px. O centroide
só coincide com o meio visual se todas as provas tiverem a mesma inclinação, e no
espalhado não têm. Corrigido pelo **retângulo envolvente das cartas já giradas**:
desvio final de **0 nos dois eixos**.

Junto saiu a `ALTURA`, subida constante de 0,20 da largura herdada da roseta
antiga. Com o monte nascendo centrado, ela só servia para desalinhar 70px.

**A mesa.** O arco abriu (raio de 0,83 para 1,6) e o passo caiu (12 para 8 graus),
para o monte perder a cara de leque. Quem espalha agora são três vetores
constantes: deslocamento em x, em y e torção do ângulo, todos irregulares.

Desvio constante é a técnica que já tinha falhado uma vez, quando a pista era a
espiral de Euler: lá o miolo tem raio pequeno, as paralelas se cruzavam e o pico
foi a 100%. Aqui o raio é 1,6 da largura e o maior desvio é 0,39, quatro vezes
menor, então não se cruzam. Mesma técnica, pista diferente, resultado oposto, e a
conta que decide é a mesma: desvio contra raio de curvatura.

**Os números saíram de busca.** Vinte mil conjuntos sorteados, avaliados por
cobertura real de polígono com ordem de pintura, filtrando os que estouram a tela
do celular, os que viram pilha e os que se cobrem de menos.

| | Leque | Escolhido a olho | Busca |
|---|---|---|---|
| Menor prova visível | 24% | 10% | **43%** |

| | Antes | Agora |
|---|---|---|
| Desvio do centro | 119px à direita | **0, 0** |
| Monte no celular | 353 x 207 | **357 x 279** |
| Inclinações | -24,-12,0,12,24 (progressão) | **-9,-18,-8,28,3** (sem ordem) |
| Folga até o painel | 137px | **59px**, sem invasão |

**O que o espalhado custou, e vale registrar:** as provas deixaram de percorrer
exatamente a mesma trilha. As duas primeiras ficam a 17 e 15px da trilha da
líder, mas a quarta chega a 153px, ou 0,7 da largura da pilha. É consequência
direta de espalhar o repouso: os desvios que abrem o monte também afastam as
trajetórias. Continua lendo como fila, mas não é mais pista única no sentido
estrito.


### Terceira rodada: velocidade, curva e distribuição

*"Aumente a velocidade da animação. O raio da curva da animação deve ser mais
acentuado (como no desenho da imagem com a seta em vermelho). A distribuição das
imagens não ficou muito harmonioso e lógico (algumas imagens estão quase
totalmente cobertas)."*

**A curva.** O raio caiu de 1,6 para 0,9 da largura da pilha e a saída passou de
-78 para -105 graus. Com 1,6 a curva era tão aberta que o voo lia como reta
inclinada. Agora a pista sai do monte para a direita, curva forte, sobe e termina
inclinada para trás, que é o desenho da seta vermelha. Giro total da líder:
89 graus, contra 54 de antes.

Vale notar que o raio governa duas coisas: a curvatura do trecho de repouso e a
do começo do voo. Como o espalhado de mesa é quem desenha o repouso, o raio ficou
livre para servir ao voo, que é onde ele se vê.

**A velocidade.** A janela encurtou de 1897 para 952px no celular. Com `scrub`,
velocidade é movimento por pixel rolado, então encurtar a janela acelera. Passou
de 0,44-0,48 para **0,83-1,09**.

No desktop a mesma regra dava 986px e um voo a **1,71**, quase o dobro do
celular, porque lá a pilha é maior e a mesma pista em frações da largura vira
mais pixels. A janela do desktop foi para 1346px e o voo para 0,95-1,25.

**A distribuição.** Duas correções, e a segunda quase passou batido.

A primeira: sortear cinco deslocamentos livres quase nunca dá um monte bom. De
trinta mil tentativas, vinte e três mil estouravam a tela e sobravam três. O que
funciona é sortear em volta de uma FORMA: as cinco num anel achatado de raio
variável, com o ângulo de cada uma jogado para os lados.

A segunda: a busca otimizada só por visibilidade devolveu as cinco quase em pé,
com 1, -6, 0, -6 e -3 graus. Media ótimo e lia como pilha arrumada, não como
mesa. **Girar carta cobre mais área, então a busca sozinha sempre prefere não
girar.** Exigir 36 graus entre a mais torta e a mais reta é o que devolve o
desleixo.

| | Sorteio solto | Anel sem filtro de ângulo | Anel com o filtro |
|---|---|---|---|
| Pior prova visível | 43% | 59% | **52%** |
| Espalhamento angular | 37° | 27° | **44°** |

Medido depois de aplicar: visibilidade de 100, 70, 55, 66 e 56% no celular,
ângulos de -20, 1, -6, -7 e 24 graus.

**Efeito colateral corrigido:** o monte novo é mais alto (306 contra 279px) e a
folga até o painel de preço caiu de 59 para 30px. O fator da margem de baixo da
pilha, em `estilo.css`, subiu de 0,12 para 0,26 da largura e devolveu 60px.

### Quarta rodada: congelar a rotação e escalonar as saídas

*"As imagens não devem rotacionar junto com a animação. As imagens não devem sair
todas juntas (deve haver um atraso para as imagens seguintes)."*

**A rotação congelou.** A tangente da pista continua desenhando o repouso, uma
vez, e depois o número fica parado. Cada prova sai com a inclinação que tinha na
mesa e chega com ela. Giro máximo medido ao longo do voo: **0 grau**, contra 89
de antes.

**O atraso entrou e o passo crescente saiu.** Antes as cinco andavam juntas e o
que as separava era um espaçamento que crescia durante o voo; funcionava contra a
sobreposição, mas o conjunto partia em bloco. Agora cada prova tem o próprio
progresso, deslocado de 0,10, e as saídas ficaram em 0,01, 0,11, 0,21, 0,31 e
0,41.

Uma decisão que vale registrar: **o progresso de cada prova não tem limite em
cima**. Se fosse travado em 1, as cinco terminariam à mesma distância do ponto de
partida delas e se reencontrariam amontoadas no fim da pista. Sem trava, quem
saiu antes continua andando, e as distâncias percorridas ficam em 990, 867, 747,
633 e 531px.

**Efeito colateral que quase passou:** a velocidade saltou de 1,09 para **1,60**
sem ninguém pedir. A causa é aritmética e não óbvia: com atraso, quem sai
primeiro percorre `AVANCO / DURACAO`, não `AVANCO`. Com duração de 0,60, a líder
passou a andar 7 larguras em vez de 4,2. O avanço caiu para 3,0 e devolveu 1,14.

| | Antes | Agora |
|---|---|---|
| Giro ao longo do voo | 89° | **0°** |
| Saídas | todas em 0 | **0,01 / 0,11 / 0,21 / 0,31 / 0,41** |
| Velocidade no celular | 1,09 | **1,14** |
| Velocidade no desktop | 1,25 | **1,30** |
| Folga até o painel | 60px | **69px** |

**Armadilha de medição desta rodada:** medir "quando cada prova parte" com
`getBoundingClientRect` enquanto se rola a página dá falso positivo em todas ao
mesmo tempo, porque a caixa é relativa à JANELA e a janela está se movendo. A
primeira medição disse que as cinco partiam juntas em 0,02, quando na verdade o
atraso já estava funcionando. Medir deslocamento exige coordenada de documento:
somar `scrollX`/`scrollY`, ou não rolar durante a medição.

### Quinta rodada: fechar mais a curva e aumentar as fotos

*"Deixe mais acentuado a curva da animação. Aumente um pouco o tamanho das
imagens (tanto mobile quanto desktop)."*

**A curva.** Raio de 0,9 para **0,62** da largura da pilha, e a saída de -105 para
**-125 graus**. O giro do caminho subiu de -89 para **-107 graus**. O raio diz o
quanto a curva fecha; a saída diz por quanto tempo ela continua fechando, e o
comprimento da clotoide sai dos dois.

O limite prático para fechar mais é o desvio de mesa: desvio maior que o raio faz
as paralelas se cruzarem. Com raio 0,62 e maior desvio 0,39, ainda há margem.

**O tamanho.** De 0,72 para **0,80**. O número aparecia solto em dois lugares, o
cálculo do centro e o desenho, e virou constante única.

**E aqui está o custo, medido:** cinco fotos de lado S numa tela de 390 não têm
como aparecer inteiras. Rodei a busca do espalhado para cada tamanho:

| Tamanho | Pior prova visível |
|---|---|
| 0,72 | 55% |
| 0,76 | 40% |
| **0,80** | **37%** |
| 0,84 | 33% |

Escolhi 0,80: o aumento se vê e a prova mais coberta ainda mostra mais de um
terço. A 0,84 o monte também não cabia mais, chegando a 410px numa tela de 390.

Trocar de tamanho **obriga a refazer a busca do espalhado**, porque os desvios
achados para um tamanho estouram a tela no seguinte.

| | Antes | Agora |
|---|---|---|
| Foto no celular | 200px | **223px** |
| Foto no desktop | 328px | **361px** |
| Giro do caminho | -89° | **-107°** |
| Pior prova visível | 55% | **35%** |
| Folga até o painel | 69px | **74px** |

**Duas armadilhas de medição desta rodada:**

1. A busca devolve o ângulo **absoluto** de repouso, mas o código guarda a
   **torção** sobre a tangente da pista. Aplicar o número da busca direto no
   `TORTO` põe a foto no ângulo errado. A conversão é subtrair a tangente daquele
   ponto, e a tangente muda quando o raio muda.
2. Medir visibilidade no desktop com o monte pela metade fora da dobra deu 22%
   onde o valor real era 33%. Cinco dos vinte e cinco pontos de amostra caíam
   abaixo da tela e contavam como escondidos. Enquadrar o monte antes de medir.

### Sexta rodada: começar um pouco antes

*"A animação das fotos pode começar um pouco antes"*

`start: 'center X%'` dispara quando o centro da pilha chega a X% da altura da
tela, e **quanto maior a porcentagem, mais cedo dispara**. Os dois subiram 10:
82% no celular, 90% no desktop.

**O fim andou junto, e essa é a parte que não é óbvia.** Adiantar só o começo
esticaria a janela em 10% de tela e DESACELERARIA o voo de tabela, porque com
`scrub` velocidade é movimento por pixel rolado. Adiantando os dois, a janela fica
onde estava (953 e 1346px) e o movimento também (1,14 e 1,30).

| Momento | Celular | Desktop |
|---|---|---|
| Monte entra pela borda de baixo | 0 | 0 |
| Monte inteiro cabe na tela | **0** | **0,119** |
| Monte centralizado | **0,284** (era 0,209) | **0,267** |

**Um número que vale acompanhar:** no desktop, quando o monte inteiro cabe na
tela o voo já está em 12%, com a primeira prova 211px adiante. Ou seja, ali o
álbum nunca é visto parado e inteiro. Isso não é efeito desta rodada, já era 5%
antes: vem de o monte ter 501px de altura numa tela de 900 enquanto o gatilho
olha o centro da PILHA, que é uma caixa menor que o monte. Se incomodar, o
conserto é medir o gatilho pelo monte e não pela pilha.

### Sétima rodada: o roteiro vira planilha de regularidade

*"Quero que a animação em 'O roteiro, dia a dia' seja como uma navegação por uma
planilha de referência de enduro de regularidade de moto. Utilize de skills
necessárias e o GSAP."*

**O conflito que apareceu antes de qualquer código.** Planilha de regularidade é
feita de KM parcial, KM total e velocidade média. E o próprio HTML da seção já
registrava, em comentário, por que não há quilometragem: a origem é a porta de
cada cliente, então qualquer número seria inventado. Levei isso ao usuário em vez
de decidir sozinho, e a escolha foi **a forma sem número fabricado**: REF,
tulipa, dia, etapa e descrição, que são os dados que existem de verdade.

Também ficou decidido que a seção INTEIRA vira a planilha, e que ela vale no
celular, não só no desktop.

**O que já estava pronto e ninguém tinha usado.** Os glifos de tulipa existiam
desde sempre, cada folha já declarava a sua em `data-tulipa`, e a etapa já estava
em `data-etapa`. A planilha não inventou vocabulário: só passou a mostrar o que o
HTML já carregava.

**A decisão que destravou o celular.** A janela de leitura é uma barra de três
linhas que gruda, e não um pino de tela cheia. A versão anterior era desktop-only
por um motivo declarado no código: prender a rolagem briga com a barra de URL
retrátil, que muda a altura da viewport no meio da sequência. Barra curta não
depende de `100svh` para nada, então o motivo do recorte deixou de existir.

**Régua e linhas leem a mesma variável de colunas.** Cabeçalho de tabela
desalinha quando alguém mexe numa medida e esquece a outra; aqui não há a outra.
`display: contents` na caixa de leitura é o que permite: dissolve a caixa e
entrega os quatro filhos direto ao grid da linha.

### Medido

| | Celular | Desktop |
|---|---|---|
| Uma, e só uma, referência ativa | **135/135** | **130/130** |
| A marcada é a que está sob a linha | **135/135** | **130/130** |
| Contador divergindo | **0** | **0** |
| Desvio da barra grudada | **0px** | **0 a 7px** |
| Barra da página cobrindo a régua | - | **0 posições** |
| Colunas batendo com a régua | ao pixel | ao pixel |

Varredura de um em um pixel: **três costuras de 1px** em 1514px de rolagem, no
pixel exato da passagem entre referências. Fechar significaria sobrepor as
faixas, e aí haveria pixels com duas acesas, o que é pior porque o contador
piscaria. Como ele só muda quando alguém ativa, na costura ele mantém o último
valor.

### Dois defeitos que a medição pegou, e os dois são sobre a MESMA armadilha

Os dois vêm de a ScrollTrigger avaliar `start` e `end` a partir do **layout**, e
não do que está desenhado na tela.

1. **A linha de leitura vinha da barra ainda não grudada.** Eu media
   `topo.getBoundingClientRect().bottom`, mas no refresh a página está no topo e
   a barra ainda está no fluxo. Resultado: referência 02 marcada com a caixa dela
   em 1168 e a linha em 385. **1 acerto em 47.** A posição de grude é o offset do
   sticky mais a altura da barra, e os dois são estáveis.
2. **O avanço do papel desalinhava a marcação.** Dez pixels de deslize na tira,
   decorativos, para o conjunto ler como papel correndo atrás de um vidro. Só que
   transform move a linha sem mexer no layout: com a tira deslocada, a faixa que a
   ScrollTrigger acha que é a 02 já não é onde a 02 está desenhada. Com o deslize:
   duas posições sem marcação e três com a errada. Sem ele: zero e zero. **Dez
   pixels de enfeite não pagam uma marcação que erra.**

### Um transitório que não é desta seção

Mudando a altura da viewport SEM recarregar, que é o caso da barra de URL do
celular sumindo, a precisão cai para 69/90. Depois de `ScrollTrigger.refresh()`
volta a **97/97**. A causa não é a planilha: uma viewport mais curta muda a
altura de outros blocos da página e move a seção no documento, então TODOS os
gatilhos ficam com coordenada velha até o refresh. A ScrollTrigger refresca
sozinha no resize; o que medi foi o intervalo antes disso.

### Skills usadas

`modern-css` para as técnicas da janela e da tabela, e `animate` para a decisão
de o que anima: a marcação de referência é troca de estado discreta, e não tween,
porque contador de referência não tem meio-termo.


### Oitava rodada: profundidade e transição na planilha

*"Achei meio sem graça. Falta efeitos de profundidade e smooth transition."*

### A profundidade

A planilha nasceu chapada: tabela correta e sem relevo. O que ela ganhou foi luz,
sombra e um gesto de chegada.

**A profundidade vem de luz, e nunca de posição.** Nenhuma regra de relevo move
uma linha, e isso é deliberado: a ScrollTrigger calcula as faixas de marcação a
partir do **layout**, então deslocar a linha desenhada faz o desenho discordar da
marcação. Foi exatamente assim que o avanço do papel morreu, com dez pixels de
transform gerando duas posições sem marcação e três com a errada. Sobrou a regra:
relevo por cor e sombra, movimento só no que não carrega layout.

O que entrou:

| Peça | O que faz |
|---|---|
| Recuo das inativas | `brightness(0.62)` e opacidade 0,72: a janela ilumina a referência corrente e o resto do papel fica na sombra do vidro |
| Prova das inativas | `saturate(0.55)`, um passo a mais, porque foto acesa puxa o olho antes de qualquer texto |
| Sulco da corrente | régua de 3px no acento, crescendo de cima para baixo por `scaleY`, que é o gesto de marcar com o dedo onde se está lendo |
| Fundo da corrente | sobe para `--fundo-3`, a única elevação de tom da seção |
| Lábio da janela | sombra projetada da barra sobre o papel |
| Véu | gradiente logo abaixo da barra: as linhas escurecem ao entrar embaixo dela, em vez de sumirem num corte seco |
| Pé da planilha | sombra sob o conjunto, para ele pousar na página em vez de flutuar |

`brightness` e não `opacity` no recuo, e a razão é a mesma que já derrubou a tira
antiga: opacidade parcial deixa ver o fundo da seção **através** da linha, e aí a
régua e a borda aparecem por dentro do texto.

**O recuo mora em `.movimento-ativo`, não na linha.** Sem script nenhuma linha
fica ativa, e se o recuo morasse na `.folha` a planilha inteira apareceria
apagada. Conferido: sem a classe, as quatro linhas ficam em `filter: none` e
opacidade 1.

### A chegada, e as duas armadilhas dela

O GSAP acrescenta as duas coisas que transição de CSS não faz bem: um gesto com
origem e um número que rola. As duas só mexem em elementos pequenos, a tulipa e o
dígito do contador, que não têm papel no layout da linha.

**A tulipa aterrissa** de um pouco menor e um pouco acima, que é a direção de
onde a linha veio. `clearProps` no fim devolve o controle ao CSS: sem ele o GSAP
deixa `transform` e `opacity` inline para sempre, e a tulipa fica presa no estado
do último quadro que rodou.

**O contador troca o número ANTES de animar**, e isto é a correção de um defeito
meu. A primeira versão trocava o texto no meio da linha do tempo, para o dígito
velho sair antes de o novo entrar. É mais bonito e põe a verdade do contador
dentro de um tween: se a animação não roda, ou roda pela metade, o número fica
velho. **Medido em 135 posições de rolagem, o contador discordava da referência
marcada em 98 delas.** Contador é informação, não enfeite; perdeu-se a saída do
dígito velho e ganhou-se um contador que nunca mente.

### Um defeito que só apareceu no celular

A barra da página é fixa no topo com 64px **também no celular**, e por um tempo a
janela só descontava a altura dela acima de 48rem. Medido: a barra cobria 64 dos
84px da janela em **135 de 135** posições de rolagem, ou seja a régua de colunas
ficava escondida justamente enquanto se lia. O `top` da janela passou a descontar
a barra em toda largura.

### Medido depois da profundidade

| | Celular | Desktop |
|---|---|---|
| Uma, e só uma, referência ativa | **135/135** | **130/130** |
| A marcada é a que está sob a linha | **135/135** | **130/130** |
| Contador divergindo | **0** | **0** |
| Barra da página cobrindo a régua | **0** | **0** |
| Desvio da barra grudada | **0px** | **0 a 7px** |
| Sem script, linhas em brilho cheio | **4 de 4** | **4 de 4** |



### Nona rodada: ficha no celular, dobra em 3D e movimento que começa na hora

*"A animação está começando muito atrasado. Ainda não há nenhuma animação de
profundidade (estilo 3D) que eu pedi. No uso mobile, os cards ficaram alongados e
com a formatação errada."*

**Medi antes de planejar, e os números mudaram o plano.** A 390x844: coluna de
texto com 192px, 22 caracteres por linha, prova com os mesmos 192, folhas de 674 a
784px numa tela de 844. `ref` e `tulipa` comiam 108 dos 308px úteis. E sobre o
atraso: a folha entra na tela em y=844 e a primeira coisa a acontecer é a marcação,
quando o topo dela chega em 156, ou seja **688px de rolagem sem movimento nenhum**.
Não era a marcação que estava tarde, ela está no lugar certo; era o caminho até ela
que estava parado.

Isso uniu dois dos três pedidos: profundidade e começo têm o mesmo conserto, que é
uma dobra contínua presa à rolagem.

**A regra que destravou o 3D.** A rodada anterior tinha proibido transform nas
linhas, e com razão: a ScrollTrigger calcula as faixas a partir do layout. Mas o
que quebrava era **translação**. A grandeza que comanda a dobra é a distância com
sinal da linha de leitura até a CAIXA da folha, e ela vale zero enquanto a linha
está dentro dela, que é exatamente a condição de estar ativa. Então a folha ativa
está sempre chapada e no lugar do layout, e a marcação fica imune por construção.
Conferido: em 172 posições no celular e 143 no desktop, a ativa nunca teve giro,
recuo nem deslocamento.

**No celular a linha virou ficha.** Cabeçalho com ref, tulipa e dia à esquerda e
etapa à direita; texto e prova na largura toda. A régua de colunas some, porque
não sobrou coluna para ela rotular. Só CSS, nenhuma mudança no HTML, cópia
congelada.

### Quatro defeitos que a medição pegou

1. **29 de 161 posições sem marcação nenhuma.** As faixas saíam de
   `getBoundingClientRect`, que já inclui o transform, e no refresh a página está
   no topo com as quatro folhas inclinadas e encolhidas. É a mesma armadilha de
   layout contra desenho, agora um nível acima: não no que é desenhado, e sim no
   que é medido. `start` e `end` passaram a devolver número, calculado por
   `offsetTop` somado pela cadeia de `offsetParent`.
2. **Fresta de 63px entre folhas.** Girar em torno do centro afasta a borda de
   baixo de uma da borda de cima da seguinte. O pivô passou a ser a borda virada
   para a linha de leitura: sob perspectiva, o ponto da `transform-origin` é ponto
   fixo, e nem o giro nem o recuo em z o tiram do lugar.
3. **A fresta voltou com 47,8px, e só no desktop.** Prender o pivô resolve as duas
   costuras que encostam na ativa. No celular cabem duas folhas na tela e acabou;
   no desktop cabem três, e a costura entre as duas inativas de baixo ficava solta.
   A tira passou a ser emendada: cada folha é posta onde a anterior terminou de ser
   **desenhada**, com a âncora na folha ativa. A vizinha da âncora cai sempre em
   deslocamento zero, então a troca de referência não dá tranco.
4. **O alcance quase deixou o efeito invisível.** Escalando a dobra pela altura da
   tela, a vizinha da ativa ficava com 0,16 grau e a seguinte com 0,55. Só a quarta
   chegava a 3,6, e ela está longe do olho. O que se vê da planilha é a faixa
   abaixo da linha, porque acima está a barra: quem tem de dobrar é a folha que
   sobe. Com 320px de alcance, a vizinha fica em 5,4 graus e a seguinte nos 11.

### O que não deu para fazer

**Não consegui olhar.** O painel do navegador não estava em exibição, então
`screenshot` recusou: sem pane, a página não compõe quadros. Tudo aqui é medido,
e nada é visto. Se 11 graus e véu 0,50 ficaram bonitos, quem julga é o usuário.

### Medido

| | Celular 390x844 | Desktop 1440x900 |
|---|---|---|
| Uma, e só uma, referência ativa | **172/172** | **143/143** |
| A marcada é a que está sob a linha | **172/172** | **143/143** |
| Contador divergindo | **0** | **0** |
| Ativa com giro, recuo ou deslocamento | **0** | **0** |
| Borda desenhada da ativa contra a de layout | **0,19px** | **0,39px** |
| Fresta entre folhas | **0px** | **1,0px** |
| Paralaxe da prova contra o corpo | **6,3%** | **3,0%** |
| Barra da página cobrindo a régua | **0** | **0** |
| Desvio da barra grudada | **3,9px** | **0,7px** |
| Transbordo lateral da janela | **0** | **0** |
| Caracteres por linha | **38** (era 22) | inalterado |
| Altura das folhas | **582 a 636** (era 674 a 784) | inalterado |

Sem os estilos do script: `transform: none`, `filter: none`, `opacity: 1` e véu em
alfa zero nas quatro folhas. Console limpo e rolagem lateral zero.

### Uma armadilha de CSS que vale guardar

**Filter e opacity achatam o 3D.** Um elemento com `filter`, ou com opacidade
menor que 1, é renderizado como plano: o `transform-style: preserve-3d` dele deixa
de valer e os filhos perdem o z. O recuo por `brightness(0.62)` da rodada anterior
teria matado o efeito inteiro **sem dar erro nenhum**, e a foto simplesmente não
descolaria do papel. Por isso o recuo virou véu, que é um `::after` com a opacidade
numa variável. Na foto o filter ficou, porque foto não tem plano dentro.

### Décima rodada: a linha de leitura desce, e a barra solta no celular

*"A animação ainda está chegando atrasado (tanto para mobile, quanto para
desktop). Faça que barra 'Planilha' não siga o roll do usuário mobile."*

**A dobra tinha consertado o começo, mas não a chegada.** A rodada anterior pôs
movimento no caminho inteiro, e isso resolvia o "nada acontece durante 688px".
Mas a marcação, que é o que acende a referência e roda o contador, continuava
disparando na janela, e a janela fica no alto da tela. Uma folha aqui tem quase a
altura da tela: com a linha de leitura em 156px de uma tela de 844, a referência
só virava corrente quando o topo dela já tinha subido 688px, e nesse ponto ela já
ocupava 81% da tela. O contador ainda dizia a anterior.

**A linha de leitura passou para 42% da altura da tela.** É perto de onde a folha
que sobe passa a ocupar mais tela que a que sai, e é esse o instante em que se
está lendo a nova. Onde a barra gruda, ela vira piso: a linha nunca desce para
baixo do vidro, senão a referência marcada seria uma que ele está tampando.

| | Celular | Desktop |
|---|---|---|
| Linha de leitura, antes | 156px | 168px |
| Linha de leitura, agora | **354px** | **378px** |
| Quanto da tela a referência ocupa quando acende | **58%** | **38%** |

**A barra deixou de grudar no celular.** Numa tela de 390 ela ficava por cima do
texto o tempo todo, e entregava em troca o contador de referência, que é
justamente a coluna que o celular já não tem desde a rodada passada. Faixa
permanente sobre a leitura é caro demais para isso. Acima de 48rem ela continua
grudando, e continua descontando a altura da barra da página, que é uma medida
que já custou 135 posições erradas uma vez.

O véu logo abaixo da barra foi junto para dentro da consulta de 48rem: ele é
`::after` posicionado contra a barra, e com a barra em `position: static` iria se
ancorar em qualquer ancestral posicionado que aparecesse pela frente.

O `linhaDeLeitura()` passou a perguntar ao CSS se a barra está grudada, em vez de
supor. Assim a mesma função serve as duas larguras e não há um número repetido em
dois lugares para divergir depois.

### Medido

| | Celular 390x844 | Desktop 1440x900 |
|---|---|---|
| Uma, e só uma, referência ativa | **201/201** | **143/143** |
| A marcada é a que está sob a linha | **201/201** | **143/143** |
| Contador divergindo | **0** | **0** |
| Ativa com giro, recuo ou deslocamento | **0** | **0** |
| Fresta entre folhas | **0px** | **1,0px** |
| Paralaxe da prova contra o corpo | **6,3%** | **3,0%** |
| Barra da página cobrindo a régua | não gruda | **0** |
| Desvio da barra grudada | não gruda | **0,8px** |
| Transbordo lateral da janela | **0** | **0** |

Sem os estilos do script: `transform: none`, `filter: none`, `opacity: 1` e véu em
alfa zero nas quatro folhas. Console limpo e rolagem lateral zero.

### O que continua sem conferir

**Ainda não consegui olhar.** O painel do navegador abre mas não compõe quadros,
então `screenshot` recusa nas duas tentativas desta sessão. Tudo aqui é medido, e
nada é visto.

### Uma armadilha de medição desta rodada

Medindo o desvio da barra grudada ao longo da nova faixa de rolagem, deu 210,7px,
e não é defeito: com a linha de leitura mais baixa, a faixa em que uma referência
está marcada começa 210px antes, e nesse trecho a barra ainda não chegou ao ponto
de grude. Medir "está no lugar de grude" antes de ela grudar é medir a coisa
errada. Restringindo às posições em que a janela já passou do ponto, o desvio é
**0,8px**.

### Décima primeira rodada: a linha desce de novo, e os cards passam a surgir

*"Ainda está atrasado, desça mais a linha de leitura. Além disso, faça o efeito de
aparecer e desaparecer dos cards. A ordem entre imagem, texto e ícones entre os
cards pode ser diferente para que não fique repetitivo."*

**A linha foi para 58% da altura da tela**, de 42%. A referência agora acende com
a folha ocupando 43% da tela no celular e 39% no desktop, ou seja antes de ela
tomar a tela, e não depois.

**Cada grupo da folha ganhou surgimento próprio**: opacidade mais 20px de subida,
percurso de 200px de rolagem, 70px de atraso de um grupo para o seguinte. E a
ordem alterna: nas pares a prova vem antes do texto, na página e no tempo. No
desktop é troca de coluna, no celular é troca de ordem na coluna única. A tulipa
alterna a direção do pouso junto.

### Quatro coisas que a medição pegou

1. **O surgimento estava fora de fase com a marcação.** Com percurso de 260 e
   atraso de 110, o último grupo só ficava cheio com o centro em 43% da tela,
   contra a linha em 58%: a referência acendia com o texto dela em 13% de
   opacidade. É a mesma queixa de chegar atrasado, por outro caminho. Com 200 e 70
   o pior caso soma 340px, contra os 354 que sobram no celular. O perfil de
   opacidade por faixa de tela agora dá cheio de 30% a 60% nas duas larguras.
2. **A ref e a tulipa desalinhavam a régua em 6px.** Elas subiam 14px em z junto
   com a prova, e sob perspectiva o que está mais perto do olho é desenhado maior,
   afastando-se do centro da folha. Com a folha chapada, a coluna REF saía 6px
   fora do rótulo. Voltaram para o plano do papel; a prova continua flutuando,
   porque o rótulo dela cobre as duas colunas que ela ocupa alternadamente.
3. **A régua rotulava a coluna errada, e isso é anterior a esta rodada.** Dia e
   etapa dividem a coluna 3, então os cinco rótulos saíam deslocados de um, com
   "Etapa" em cima da descrição e "Referência" em cima da foto. Com a alternância
   isso ficaria pior ainda, porque a coluna 4 é o texto numa linha e a prova na
   outra. O rótulo de etapa saiu e o de referência passou a cobrir as duas.
4. **As colunas 4 e 5 tinham larguras diferentes**, 1,05fr e 1fr. Com a
   alternância, a prova mudaria de tamanho a cada linha. Igualadas, ela tem os
   mesmos 407px nas quatro.

### Uma armadilha de cache que custou uma medição

Removi um rótulo do `index.html`, recarreguei com `fetch('/index.html', {cache:
'reload'})` e o rótulo continuou aparecendo. A página é servida em `/`, e
`/index.html` é outra chave de cache: revalidei um endereço que a página não usa.
Com `fetch('/', {cache: 'reload'})` veio certo.

### Uma armadilha do painel, para não repetir

Medindo o `x` da tulipa com a folha chapada, deu 231 em vez de 228. Não é
desalinhamento: o painel não compõe quadros, o `requestAnimationFrame` não corre
e o tween de pouso fica **congelado no meio**, com a tulipa ainda em escala 0,88.
Forçando cada tween com `progress(1)`, o repouso volta a 228 e o `style` sai
limpo, que é o `clearProps` fazendo o trabalho dele.

### Medido

| | Celular 390x844 | Desktop 1440x900 |
|---|---|---|
| Linha de leitura | **490px** (58%) | **522px** (58%) |
| Ocupação da tela quando a referência acende | **43%** | **39%** |
| Uma, e só uma, referência ativa | **219/219** | **132/132** |
| A marcada é a que está sob a linha | **219/219** | **132/132** |
| Contador divergindo | **0** | **0** |
| Ativa com giro, recuo ou deslocamento | **0** | **0** |
| Fresta entre folhas | **0px** | **1,0px** |
| Paralaxe da prova contra o corpo | **6,4%** | **3,3%** |
| Opacidade mínima entre 40 e 60% da tela | **1,00** | **1,00** |
| Transbordo lateral | **0** | **0** |

Varredura de um em um pixel nas três passagens: **quatro pixels** sem referência
marcada, mesma classe de costura de sempre.

Sem os estilos do script: opacidade 1 em todos os filhos, `transform: none` nas
folhas, véu em alfa zero. Console limpo e rolagem lateral zero.

### O que continua sem conferir

**Ainda não consegui olhar.** O painel abre mas não compõe quadros, então
`screenshot` recusa. Tudo aqui é medido, e nada é visto.

### Décima segunda rodada: a logo da barra

*"O botão da logo no uso desktop parou de funcionar."*

**Não consegui reproduzir a falha, e digo isso antes dos consertos.** Varri as
coisas que poderiam explicá-la e todas passaram: o ouvinte está ligado depois de
uma carga limpa, o clique chega nele e ele cancela o padrão; a logo não fica
coberta em nenhuma das 160 posições de rolagem varridas a 1440x900; e, com o
relógio dirigido à mão, o Lenis leva a página ao topo partindo de dez posições
diferentes. Console limpo.

Achei, isso sim, **um defeito real e vizinho**, e é o mais provável candidato.

### O caminho sem script não existia

O `href` da logo apontava para `#topo`, que é o id do próprio `<header
class="barra">`. E essa barra é `position: fixed`. Saltar para um elemento fixo
não rola nada: ele já está em vista, sempre, então o navegador não tem para onde
ir.

Medido, partindo de 3000px de rolagem:

| Destino | Onde a página fica |
|---|---|
| `#topo`, o antigo | **3000** |
| `#top`, o novo | **0** |

O comentário no HTML dizia, desde sempre, que a logo continuava sendo `<a>` e não
`<button>` justamente para funcionar sem uma linha de script. O comentário estava
certo na intenção e errado no fato: o chão prometido não existia, e o botão
dependia inteiro do JavaScript.

`#top` é âncora da própria especificação de HTML: fragmento vazio ou "top"
significa o topo do documento, sem precisar de elemento nenhum com esse id.

### A volta ao topo subiu no arquivo

Ela era a penúltima seção, depois do mapa, das provas ao vento e da planilha.
Qualquer exceção em qualquer uma delas abortava a função inteira, e o
`addEventListener` da logo nunca chegava a acontecer: a navegação morria por
causa de um defeito numa animação que não tem nada com ela. E as animações são
justamente a parte que mudou muito nas últimas rodadas.

Agora ela é a seção 3, logo depois dos portões e do Lenis, que são as duas únicas
coisas de que ela precisa. Erro numa animação continua sumindo com a animação; não
some mais com a navegação. As seções foram renumeradas e o índice de leitura no
alto do arquivo acompanha.

**As duas mudanças juntas fecham o sintoma pelos dois lados**: se o script
falhar, o navegador leva ao topo sozinho; e o script agora é muito mais difícil
de derrubar por outra seção.

### Duas armadilhas de medição, e as duas eram minhas

1. **O harness dessincronizou o Lenis.** Passei a sessão movendo a página com
   `window.scrollTo`, que passa por baixo do Lenis. Quando fui investigar, o
   `animatedScroll` dele estava em 5 e a página em 6794: o `scrollTo(0)` andava
   cinco pixels e parava, e isso parecia exatamente o defeito relatado. Não era.
   Para testar de verdade é preciso mover a página **pelo próprio Lenis**, e dá
   para pegar a instância trocando `Lenis.prototype.scrollTo` por um embrulho que
   guarda o `this`.
2. **Relógio fabricado andando para trás.** Testei dez posições de partida num
   laço, cada uma com `t0 = performance.now()` e quadros em `t0 + i*16.7`. Da
   segunda em diante, esse `t0` é quase dois segundos ANTES do último tempo que o
   Lenis viu, e delta negativo trava a animação. Deu nove falhas em dez, todas
   inventadas por mim. Com um relógio só, sempre para frente, dá dez em dez.

E vale registrar de novo, porque foi o que tornou tudo isto tão caro: **o painel
não compõe quadros**, então `requestAnimationFrame` dispara uma vez e para,
`gsap.ticker.frame` fica em zero e nenhuma animação por tempo anda sozinha. Toda
verificação de movimento tem de dirigir o relógio à mão.

### Regressão da planilha depois de mover o código

| | Celular 390x844 | Desktop 1440x900 |
|---|---|---|
| Uma, e só uma, referência ativa | **219/219** | **132/132** |
| A marcada é a que está sob a linha | **219/219** | **132/132** |
| Contador divergindo | **0** | **0** |
| Ativa com giro, recuo ou deslocamento | **0** | **0** |
| Fresta entre folhas | **0px** | **1,0px** |

Console limpo e rolagem lateral zero.

### O que fica em aberto

Se a logo continuar sem funcionar para o usuário depois desta rodada, o próximo
passo é ele abrir o console e dizer o que aparece: um erro de script antes da
seção 3 é a única explicação que sobra, e o nome do arquivo e a linha resolvem em
um minuto.

### Décima terceira rodada: a dobra do celular, o glifo e o voo mais cedo

*"A animação no uso mobile não ficou correto 100%. Adicione uma animação nos
ícones da planilha. A animação das imagens onde estão as informações de preço
deve começar mais cedo."*

### O celular dobrava 1,7 vez mais forte, e a culpa era de duas constantes minhas

Perguntei ao usuário o que estava errado, porque procurei e não achei: a marcação
dava 219/219, a continuidade tinha no máximo 0,7px de salto por pixel rolado, o
vazio da tira nunca chegava à tela e o perfil de opacidade fechava cheio. Ele
apontou dois lugares, a dobra e o surgimento, e aí o número apareceu sozinho.

**Grau fixo não dá dobra igual em folhas de alturas diferentes.** A borda longe
recua altura vezes seno do ângulo: 600px a 11 graus manda a borda 114px para
dentro, contra 66px de uma folha de 345. E a perspectiva era mais curta no
celular, 900 contra 1400, o que aprofunda tudo de novo.

| | Celular | Desktop |
|---|---|---|
| Encolhimento da folha dobrada, antes | **20,0%** | 11,7% |
| Encolhimento agora | **10,6%** | 11,6% |
| Ângulo agora | 6,5 graus | 10,8 graus |

O conserto foi trocar a grandeza: o que se declara agora é **o recuo da borda
longe em pixels**, 66, e o ângulo sai dele por arco seno. Folha alta dobra menos
grau e entrega o mesmo desenho. A perspectiva virou uma só.

**Duas perspectivas eram uma armadilha silenciosa**: com elas, ajustar o ângulo
conserta uma largura e estraga a outra, e nada no código avisa.

### O surgimento ficou mais cedo sem ficar mais brusco

O percurso continua em 200px; o que encurtou foi o **atraso entre grupos**, de 70
para 40. A conta que amarra: o surgimento inteiro tem de caber nos 354px entre a
borda de baixo e a linha de leitura. Com 200 mais dois atrasos de 70, o último
grupo fechava a **14px da linha**, tecnicamente dentro e tarde de sentir. Com 40,
fecha 74px antes.

Medido, opacidade mínima na faixa de 60% da tela, que é onde a linha está: subiu
de **0,71 para 0,96** no celular e de 0,79 para **1,00** no desktop.

### O glifo se desenha

A tulipa da referência corrente é traçada. `stroke-dasharray` e
`stroke-dashoffset` são herdadas em SVG, então escrever no `<svg>` da linha
atravessa o `<use>` e chega às formas do símbolo; conferido no navegador antes de
escrever o código. O comprimento sai de `getTotalLength` no símbolo da folha de
glifos, que funciona mesmo sem ele ser desenhado.

**O número é o maior pedaço do glifo, e não a soma.** Um dasharray só vale para
todas as formas, e com a soma tudo já estaria pronto na metade do tween. Medido:
15, 30, 18 e 21 unidades.

Os dois tweens da tulipa, o pouso e o traçado, têm durações diferentes e dividem
o alvo. A limpeza é explícita com `killTweensOf` em vez de `overwrite`, senão um
mata o outro pela metade e o glifo fica preso num traço incompleto.

### O voo das provas começa 10% de tela antes

Terceira vez que este pedido aparece, e a regra continua a mesma: porcentagem
maior é mais cedo, no começo e no fim.

| | Celular | Desktop |
|---|---|---|
| Começo | `center 82%` para **`center 92%`** | `center 90%` para **`center 100%`** |
| Fim | `bottom -18%` para **`bottom -8%`** | `bottom -40%` para **`bottom -30%`** |
| Adiantou | **84px** | **90px** |
| Janela de rolagem | 953 para **952** | 1346 para **1346** |

A janela é a mesma, então o voo anda na mesma velocidade, dez por cento de tela
antes. **O desktop chegou no teto**: `center 100%` é o centro da pilha encostando
na borda de baixo. Passar disso dispara com a pilha inteira fora da tela, que é o
defeito que `top bottom` já tinha causado nas primeiras rodadas.

### Medido

| | Celular 390x844 | Desktop 1440x900 |
|---|---|---|
| Uma, e só uma, referência ativa | **219/219** | **132/132** |
| A marcada é a que está sob a linha | **219/219** | **132/132** |
| Contador divergindo | **0** | **0** |
| Ativa com giro, recuo ou deslocamento | **0** | **0** |
| Fresta entre folhas | **0px** | **1,0px** |
| Encolhimento da folha dobrada | **10,6%** | **11,6%** |
| Opacidade mínima na faixa de 60% | **0,96** | **1,00** |
| Transbordo lateral | **0** | **0** |

Varrendo a página inteira, 8636px, com ouvinte de `error` e de
`unhandledrejection` armado: **zero erros**.

### Uma armadilha de ambiente

O servidor caiu entre dois turnos e o `fetch` de recarga passou a bater numa
página `chrome-error://`, o que encheu o console de erros que não eram da página.
`preview_list` mostra só a aba do navegador quando não há processo de servidor;
subir de novo pelo nome do `.claude/launch.json` resolve. Erro no console nem
sempre é do código.

### Décima quarta rodada: mais ângulo no celular

*"Aumente um pouco o ângulo da dobra no celular"*

A rodada anterior igualou o encolhimento nas duas larguras, 10,6% e 11,6%, e do
ponto de vista da geometria estava certo. **Do ponto de vista do olho, não**: no
celular cabe uma folha e meia na tela, então a dobra não tem companhia para se
comparar e lê mais fraca que a mesma dobra no desktop, onde três folhas aparecem
juntas em profundidades diferentes. Mesma geometria, leitura diferente.

O recuo da borda longe subiu de 66 para **88px no celular**. O desktop não mudou.

| | Celular | Desktop |
|---|---|---|
| Ângulo, antes | 6,5 graus | 10,8 graus |
| Ângulo, agora | **8,7 graus** | 10,8 graus |
| Encolhimento, antes | 10,6% | 11,6% |
| Encolhimento, agora | **12,3%** | 11,6% |

**Isso não reabre a armadilha das duas perspectivas.** Aquela era ruim porque eram
dois botões que se multiplicavam: mexer no ângulo consertava uma largura e
estragava a outra, e nada no código avisava. Aqui é um botão só, e ele é
exatamente a quantidade de dobra que se quer em cada largura. Constante por
largura não é defeito; duas constantes que se multiplicam é que são.

### Medido

| | Celular 390x844 | Desktop 1440x900 |
|---|---|---|
| Uma, e só uma, referência ativa | **219/219** | **144/145** |
| A marcada é a que está sob a linha | **219/219** | **144/144** |
| Contador divergindo | **0** | **0** |
| Ativa com giro, recuo ou deslocamento | **0** | **0** |
| Fresta entre folhas | **0px** | **1,0px** |
| Transbordo lateral | **0** | **0** |
| Erros de script | **0** | **0** |

A posição solta do desktop é a costura de 1px de sempre, no pixel exato da
passagem entre referências: a varredura de um em um pixel já tinha achado quatro
pixels assim em 243, e fechá-los significaria ter pixels com duas referências
acesas, que faz o contador piscar.

### Décima quinta rodada: texto e prova viram um bloco só

*"No uso mobile, no Roteiro, o texto e a imagem estão com a animação separada
(individual). Quero que a imagem e o texto apareça e desapareça igualmente."*

O surgimento tinha três grupos com tempos diferentes: cabeçalho, texto e prova. No
desktop os dois últimos ficam lado a lado, mesma extensão vertical, e a diferença
mal aparecia. **No celular eles ficam um embaixo do outro**, com centros a
centenas de pixels de distância, e aí o que se via não eram duas coisas entrando:
era a mesma coisa entrando duas vezes.

Agora são dois grupos: o cabeçalho, que identifica a linha, e o bloco de
conteúdo, que é texto e prova juntos com o mesmo valor. Medido em 2320 amostras
no celular e na varredura do desktop: diferença de opacidade **zero**.

**A alternância de ordem fica**, e é ela que quebra a repetição entre as quatro
linhas: nas pares a prova continua vindo antes do texto, na página. O que saiu foi
a diferença de TEMPO entre os dois. Confirmado no desktop: prova nas colunas 5, 4,
5, 4.

### O bloco é medido pelas bordas, e isso consertou outra coisa de tabela

Centro serve para grupo pequeno. Um bloco de 500px medido pelo centro fica meio
apagado durante boa parte do tempo em que é a referência corrente, porque o centro
atravessa as faixas de entrada e de saída enquanto o bloco inteiro está à vista.
Pelas bordas ele acende quando o topo entra e só apaga quando o fundo sai.

O efeito colateral é bom: a faixa em que tudo está cheio ficou muito mais larga, e
os quatro handovers passaram a acontecer com cabeçalho, texto e prova todos em
1,00. Antes o bloco chegava à linha ainda subindo.

| Opacidade mínima por faixa da tela | Antes (celular) | Agora (celular) |
|---|---|---|
| 30 a 40% | 0,99 | **1,00** |
| 40 a 60% | 1,00 | **1,00** |
| 60 a 70% | 0,96 | **1,00** |
| 70 a 80% | 0,50 | **0,94** |

### Medido

| | Celular 390x844 | Desktop 1440x900 |
|---|---|---|
| Diferença de opacidade entre texto e prova | **0** | **0** |
| Uma, e só uma, referência ativa | **219/219** | **144/145** |
| A marcada é a que está sob a linha | **219/219** | **144/144** |
| Contador divergindo | **0** | **0** |
| Ativa com giro, recuo ou deslocamento | **0** | **0** |
| Fresta entre folhas | **0px** | **1,0px** |
| Transbordo lateral | **0** | **0** |
| Erros de script | **0** | **0** |

A posição solta do desktop é a costura de 1px de sempre, no pixel da passagem.

### Décima sexta rodada: o título original e a velocidade do surgimento

*"O título '6 dias na Canastra. Você só pilota.' não ficou legal. Utilize a versão
original do arquivo .html"* e, no meio da rodada, *"No uso mobile, na Planilha, os
cards estão desaparecendo muito cedo. Aumente a velocidade de aparição e
desaparecimento"*.

### O título voltou ao do rascunho

De `landing_page_trilha_certa (6).html`: **"A Melhor Expedição Off-Road para a Sua
Turma."**

O original separava "para a Sua Turma." num `<br class="hidden md:block">` e numa
cor de destaque. Nenhuma das duas coisas veio junto, e por motivo:

- **Não existe um `<br>` em toda esta página.** Quebra de mão vale numa largura e
  mente em todas as outras.
- **O `.heroi__titulo` inteiro já é da cor de acento.** O rascunho era Tailwind com
  título preto e um treçho laranja; aqui o sistema pinta o título todo.

**A quebra caiu dentro de "Off-Road".** A 1440 o navegador quebrava no hífen: "A
Melhor Expedição Off-" numa linha e "Road para a Sua Turma." na outra. Em tipo de
cem pixels isso lê como erro de revisão. Entrou `.nao-quebra { white-space:
nowrap }` só nesse treçho: não se manda onde quebrar, só se proíbe o único lugar
onde não pode. Conferido em nove larguras de caixa, de 1200 a 320: **em nenhuma o
hífen parte**.

Depois: 2 linhas a 1440 ("A Melhor Expedição" / "Off-Road para a Sua Turma.") e 3 a
390, sem transbordo em nenhuma das duas.

*A capitalização veio como estava no original, em Title Case. Os outros títulos da
página são em sentença ("O roteiro, dia a dia", "O que está incluso"), então o h1
destoa. Fica registrado; mudar isso seria editar cópia que o usuário pediu de
volta, e isso é decisão dele.*

### O surgimento: 200 para 120

O percurso decide duas coisas de uma vez, porque são o mesmo número visto de dois
lados: quanto dura a aparição e **a que distância da borda da tela ela começa**.
Como o bloco é medido pelas bordas, um percurso de 200 punha o desbotamento em
marcha assim que o fundo do bloco chegava a 200px da barra.

| | Antes (200) | Agora (120) |
|---|---|---|
| Tela ainda mostrando o bloco quando ele começa a apagar | 264px | **174px** |
| Rolagem para sumir | 200px | **120px** |
| Faixa da tela em opacidade cheia | 30 a 70% | **20 a 70%** |

### Um erro real que a medição pegou, e a armadilha de console que veio junto

`Cannot read properties of undefined (reading 'topo')`, com a pilha dentro do
`gsap.min.js`. Era `dobrar()` lendo `caixas[i]` sem garantir que a medição já
tinha acontecido: `caixas` nasce vazio e só é preenchido no refresh, mas
`onUpdate` pode chegar primeiro. **É a mesma classe de defeito que derrubou o
botão da logo**: exceção dentro de callback aborta o quadro sem avisar ninguém. A
guarda velha tinha saído quando reescrevi `dobrar` para a emenda da tira.

O conserto não é só guardar: se falta medida, ela é tirada ali mesmo e o desenho
sai certo, em vez de o quadro sair errado em silêncio.

**A armadilha:** depois do conserto o erro continuava aparecendo em
`read_console_messages`. O buffer do console **não limpa na navegação**. Deu para
provar plantando um `console.log` de marca antes de navegar: a marca aparece
DEPOIS do erro na lista, ou seja o erro é mais velho que ela. Quatro navegações
depois, continua havendo uma cópia só.

### Medido

| | Celular 390x844 | Desktop 1440x900 |
|---|---|---|
| Uma, e só uma, referência ativa | **219/219** | **144/145** |
| A marcada é a que está sob a linha | **219/219** | **144/144** |
| Contador divergindo | **0** | **0** |
| Diferença de opacidade entre texto e prova | **0** | **0** |
| Opacidade cheia entre 30% e 70% da tela | **1,00** | **1,00** |
| Fresta entre folhas | **0px** | **1,0px** |
| Transbordo lateral | **0** | **0** |
| Erros de script na varredura | **0** | **0** |

### Décima sétima rodada: o título numa linha só, e o cabeçalho sumindo cedo

Dois pedidos, e o segundo chegou no meio da rodada.

### O título ocupava a tela inteira no monitor largo

*"No uso desktop, o texto ficou muito longo. Corrija isso."*

`--txt-heroi` é `clamp(2.5rem, 7vw, 6.25rem)`: **a fonte para de crescer a 1429px
de viewport**. A caixa não para, e aí as 45 letras passam a caber numa linha só.
Na captura, a linha ia de ponta a ponta ao lado de um parágrafo de apoio de 479px.

Entrou `max-width: 11em` no `.heroi__titulo`. Em `em` porque assim o teto acompanha
a fonte: no celular ela cai para 40px, o teto vira 440 e nunca chega a valer,
porque a caixa ali tem 350.

| Viewport | Linhas | Largura do título |
|---|---|---|
| 390 | 3 | 350, o teto não vale |
| 1440 | 2 | 1082 |
| 1920 | 2 | **1100**, era 1562 |
| 2560 | 2 | **1100**, era uma linha só |

`text-wrap: balance` já estava valendo e sozinho não resolvia: ele reparte linhas
que existem, e se o texto cabe numa linha não há o que repartir. Quem cria a
segunda linha é o teto.

### O cabeçalho da folha sumia com a linha ainda sendo lida

*"A animação da planilha ainda está cortando antecipadamente parte do texto."*

Medido, e o número é duro: em 1129px de rolagem, a folha 01 estava **ativa**, com o
corpo em opacidade **1** e o topo dele à vista em y=105, e o cabeçalho dela em
**0**. O número da referência, a tulipa e a etapa desapareciam enquanto a linha
era a corrente.

A causa é **duas réguas na mesma folha**. Na rodada passada texto e prova viraram
um bloco medido pelas BORDAS, mas o cabeçalho continuou medido pelo próprio
CENTRO. Como ele fica no alto da folha, o centro dele cruza a faixa de saída muito
antes de o fundo do bloco chegar lá.

Agora a folha inteira é uma unidade: cabeçalho, texto e prova recebem o mesmo
valor, tirado das bordas desenhadas da própria folha. Saíram o escalonamento entre
grupos e a função que media pelo centro.

**Duas medidas diferentes na mesma coisa sempre acabam discordando.** É a terceira
rodada seguida em que a queixa vinha de um grupo estar num relógio e o outro em
outro. A correção não era ajustar número: era ter uma régua só.

| Opacidade mínima por faixa da tela, celular | Antes | Agora |
|---|---|---|
| 10 a 20% | 0,08 | **1,00** |
| 20 a 30% | 0,96 | **1,00** |
| 30 a 70% | 1,00 | **1,00** |
| 70 a 80% | 1,00 | **1,00** |
| 80 a 90% | 0,81 | **1,00** |

### Medido

| | Celular 390x844 | Desktop 1440x900 |
|---|---|---|
| Diferença entre cabeçalho, texto e prova | **0** | **0** |
| Texto da folha ativa, inteiro na tela | **1,00** | **1,00** |
| Uma, e só uma, referência ativa | **219/219** | **144/145** |
| A marcada é a que está sob a linha | **219/219** | **144/144** |
| Contador divergindo | **0** | **0** |
| Ativa com giro, recuo ou deslocamento | **0** | **0** |
| Fresta entre folhas | **0px** | **1,0px** |
| Transbordo lateral | **0** | **0** |
| Erros de script | **0** | **0** |

### Décima oitava rodada: o sulco da referência corrente

*"Deixe a transição dessa linha mais suave na animação."*, apontando a régua de
acento na borda esquerda da folha ativa.

**A duração não olhava a altura.** A régua usava `--dur-estado`, 200ms, que é a
medida certa para uma cor de botão trocar. Só que ela tem a altura da folha
inteira: no celular são uns 600px, e 600px em 200ms dão **3180 pixels por
segundo**. Não se vê uma régua sendo puxada, se vê um risco que aparece.

| | Antes | Agora |
|---|---|---|
| Entrada | 200ms, `--ease-saida` | **600ms**, `--ease-saida` |
| Saída | 200ms, `--ease-saida` | **360ms**, `--ease-revelar` |
| Velocidade de crescimento no celular | 3180 px/s | **1060 px/s** |
| Propriedades | só `transform` | **`transform` e `opacity`** |
| Pontas do desenho | quina viva | **gradiente nos 6% de cada ponta** |

Três coisas, e cada uma resolve um jeito diferente de a transição parecer dura:

1. **A mesma duração em coisas de tamanhos muito diferentes não produz a mesma
   sensação.** Duração de estado serve para elemento pequeno; para uma régua da
   altura da tela, o que importa é a velocidade.
2. **Saída mais curta e com curva mais mansa.** `--ease-saida` termina quase
   parada, e numa régua que está sumindo esse fim arrastado vira um fio que
   insiste.
3. **Opacidade junto com a escala.** Só com escala, o primeiro pixel já chega com
   a cor cheia: é esse degrau que se lê como corte.

Conferido com as transições desligadas, porque o painel não compõe quadros e a
transição fica parada no valor inicial: alvo em repouso é `scaleY(0)` com opacidade
0, alvo ativo é `scaleY(1)` com opacidade 1.

### Medido depois

| | Celular 390x844 |
|---|---|
| Uma, e só uma, referência ativa | **219/219** |
| A marcada é a que está sob a linha | **219/219** |
| Contador divergindo | **0** |
| Diferença entre cabeçalho, texto e prova | **0** |
| Texto da folha ativa, inteiro na tela | **1,00** |
| Fresta entre folhas | **0px** |
| Erros de script | **0** |

### O que fica para o olho

O gradiente das pontas usa a palavra `transparent`, e a interpolação dela é
premultiplicada pela especificação, então não deveria haver franja cinza. Não dá
para conferir daqui, porque o painel não compõe quadros e não há como amostrar
pixel desenhado. Se aparecer uma franja escura nas duas pontas da régua, a troca é
declarar o acento com canal alfa em vez de usar a palavra.

### Décima nona rodada: o sulco, segunda tentativa

*"Deixe mais suave. As pontas estão meio apagadas. Corrija isso."*

Duas queixas, e a segunda explica a primeira: eu tinha errado o instrumento nas
duas pontas do problema.

### O que eu errei em "mais suave": mexi na duração, e o problema era a curva

`--ease-saida` é `cubic-bezier(0.23, 1, 0.32, 1)`. A tangente inicial dela é 1
sobre 0,23, ou seja **quatro vezes e meia a velocidade média**. Numa régua que
cresce, o que se vê não é a média: é o pico do arranque. Alongar a duração de 200
para 600ms baixou a média de 3180 para 1060 px/s e o pico continuou em 4609.

| Versão | Média | Pico no arranque |
|---|---|---|
| 200ms, `--ease-saida` | 3180 px/s | **13 826 px/s** |
| 600ms, `--ease-saida` | 1060 px/s | **4609 px/s** |
| 600ms, `--ease-revelar` | 1060 px/s | **1950 px/s** |

`--ease-revelar` tem tangente inicial de menos de dois. Mesma duração, pico duas
vezes e meia menor. **Duração espalha o meio; quem manda no arranque é a curva.**

### O que eu errei nas pontas: usei porcentagem onde precisava de raio

O gradiente apagava os últimos **6% de cada ponta**. Seis por cento de uma folha de
600px são 36px: não é ponta macia, é um quarto da régua lavado, e foi exatamente
isso que o usuário viu. Pior: como é porcentagem, quanto mais alta a folha mais
lavada fica a ponta.

Ponta sem quina é **raio**, e não gradiente. A régua voltou a ter a cor cheia de
ponta a ponta, com `border-radius` arredondando nas próprias 3 unidades de largura.
Conferido: `background-image: none`, `background-color: rgb(226, 255, 204)`.

**Porcentagem em cima de um elemento de altura variável foi o mesmo erro da
rodada da dobra**, onde grau fixo dava recuos diferentes conforme a altura da
folha. A unidade tem de ser a que descreve a intenção: ali era pixel de recuo,
aqui é raio de ponta.

### Medido

| | Celular 390x844 |
|---|---|
| Alvo em repouso | `scaleY(0)`, opacidade 0 |
| Alvo ativo | `scaleY(1)`, opacidade 1 |
| Uma, e só uma, referência ativa | **219/219** |
| A marcada é a que está sob a linha | **219/219** |
| Contador divergindo | **0** |
| Diferença entre cabeçalho, texto e prova | **0** |
| Texto da folha ativa, inteiro na tela | **1,00** |
| Erros de script | **0** |

Os alvos foram lidos com as transições desligadas, porque o painel não compõe
quadros e a transição fica parada no valor inicial.

### Vigésima rodada: o sulco mais rápido no desktop

*"Ficou bom agora. Mas para uso desktop deixar mais rápido."*

E o número dá razão ao olho: com a mesma duração de 600ms para todas as larguras, a
régua do desktop andava **583 px/s** contra 1060 do celular, porque a folha lá tem
pouco mais da metade da altura. Tempo igual em elementos de tamanhos diferentes
não dá sensação igual: **o que tem de ficar constante é a velocidade**.

Entrou `--dur-sulco` na `.folha`, com 55% de `--dur-revelar` na faixa larga.

### Onde eu quase pus o encurtamento errado

Meu primeiro instinto foi 48rem, que é onde a linha deixa de ser ficha e vira
tabela. Medi antes de fechar, e era **o lugar errado**:

| Viewport | Altura da folha | Velocidade se encurtasse ali |
|---|---|---|
| 800 | **729 a 784** | 2376 px/s, o dobro do alvo |

Na faixa de 48 a 64rem a folha é mais alta **que a do celular**, porque a tabela
estreita a coluna de texto sem tirar a foto de baixo dele. Quem encurta a folha é
o bloco de 64rem, onde a prova vai para a coluna ao lado. O sulco tem de encurtar
junto com a FOLHA, e não junto com a mudança de colunas.

### Medido depois

| Viewport | Altura da folha | Entrada | Saída | Velocidade |
|---|---|---|---|---|
| 390 | 582 a 636 | 600ms | 360ms | **970 a 1060 px/s** |
| 800 | 729 a 784 | 600ms | 360ms | **1215 a 1307 px/s** |
| 1024 | 412 a 521 | 330ms | 198ms | **1248 a 1579 px/s** |
| 1440 | 352 | 330ms | 198ms | **1067 px/s** |

A faixa inteira ficou entre 970 e 1579 px/s, contra 583 a 1060 de antes, e a
passagem de 800 para 1024 não dá salto: 1215 a 1307 de um lado, 1248 a 1579 do
outro.

Regressão no celular: **219/219** de marcação, contador com **0** divergências,
diferença entre cabeçalho, texto e prova em **0**, texto da folha ativa em **1,00**
e **0** erros de script.

### O padrão que se repete nesta seção

É a terceira vez que a mesma armadilha aparece com outra roupa: **constante fixa
sobre elemento de tamanho variável**. Grau fixo dava recuos diferentes conforme a
altura da folha; porcentagem dava pontas lavadas de tamanhos diferentes; tempo
fixo dá velocidades diferentes. A unidade tem de ser a que descreve a intenção, e
a intenção aqui nunca foi "dure tanto": foi "ande assim".

### Vigésima primeira rodada: o sulco segue o sentido da rolagem

*"Faça que o sentido da linha apareça conforme o sentido do scroll do usuário."*

A regra que resolve as quatro combinações é uma frase: **o sulco fica ancorado na
borda onde a linha de leitura está naquele instante.**

| Rolagem | Estado | Onde a linha está | Âncora | Medido |
|---|---|---|---|---|
| descendo | acende | entrou pelo topo | topo, desce | **4/4** |
| descendo | apaga | saindo pelo fundo | fundo, recolhe para baixo | **4/4** |
| subindo | acende | entrou pelo fundo | fundo, sobe | **4/4** |
| subindo | apaga | saindo pelo topo | topo, recolhe para cima | **4/4** |

Acendendo, a âncora é a borda por onde a linha ENTROU; apagando, é a borda por
onde ela vai SAIR. Nos dois casos é onde ela está agora. Não precisou de quatro
condições no código: `noTopo = ativa ? descendo : !descendo`.

`self.direction` da ScrollTrigger dá o sentido, e `--sulco-origem` na folha leva
para o `transform-origin` do pseudo-elemento.

### Por que trocar transform-origin aqui não dá salto

Trocar origem no meio de uma transição dá salto, e por isso vale registrar por que
aqui não dá: **no instante em que a classe muda, a escala está em 0 ou em 1**.
Acendendo, o elemento está invisível; apagando, a matriz é a identidade, que não
depende da origem. Fora desses dois instantes a origem não é tocada.

### Uma varredura que eu nunca tinha feito

Testando isto, percebi que **todas as varreduras desta seção sempre correram para
baixo**. A marcação subindo nunca tinha sido medida, e ela envolve a mesma faixa de
ScrollTrigger sendo cruzada no sentido contrário. Conferido agora:

| | Descendo | Subindo |
|---|---|---|
| Celular, uma e só uma ativa | **219/219** | **219/219** |
| Celular, a marcada é a certa | **219/219** | **219/219** |
| Desktop, uma e só uma ativa | **144/145** | **144/145** |
| Contador divergindo | **0** | **0** |
| Erros de script | **0** | **0** |

A posição solta do desktop é a costura de 1px de sempre, e ela aparece igual nos
dois sentidos, o que é o esperado: é o pixel exato da passagem, não um defeito de
direção.

**No log de eventos subindo, duas folhas chegam a trocar de estado no mesmo passo
de varredura** (a 04 acende antes de a 03 apagar, por exemplo). Não é defeito: é a
ordem em que a ScrollTrigger dispara os callbacks dentro de UMA atualização. Ao
fim da atualização a contagem de ativas é sempre 1, e é isso que a tabela acima
mede.

### Vigésima segunda rodada: as fotos novas e o ônibus recortado

*"Quero adicionar outras imagens para o site. Adicione algumas delas na animação
das fotos. Uma das imagens tem a imagem do novo ônibus da empresa. Recorte a
imagem e a utilize para chamar a atenção do consumidor."*

Sete arquivos novos apareceram soltos em `assets/media/`: seis fotos de celular e
um render do ônibus. Duas descobertas decidiram o plano antes de escrever código.

**A pilha do voo tinha duas fotos repetidas do roteiro**, e o HTML dizia por quê,
em comentário: o leque de cinco precisa de cinco corpos e não havia material novo
para gastar em decoração de seção. Era dívida declarada. O material chegou, e
trocar as duas quita a dívida **sem tocar na geometria**: `provas.length` continua
5, então `RAIO_LEQUE`, `ATRASO`, `DURACAO`, `ESPALHA_X/Y` e `TORTO` ficam como
estavam. Aumentar o leque teria obrigado a recalcular o atraso e a inventar
desvios de mesa novos, que foi o que consumiu cinco rodadas quando ele foi
desenhado.

**Não sobra slot livre na página.** Onze slots de foto, todos ocupados, e o único
lugar sem imagem é a lista do escopo, que é texto de propósito: o CSS registra que
*"quatro caixas do mesmo tamanho fazem o visitante gastar atenção igual em coisas
de valor desigual"*. Por isso três fotos ficam sem uso, registradas no README, em
vez de virarem slot inventado.

### O que entrou

| Foto | Destino |
|---|---|
| duas motos na rocha | voo, slot 11, no lugar de `dia-3` repetida |
| a turma de braços erguidos | voo, slot 12, no lugar de `dia-5-6` repetida |
| onze pilotos na crista, Furnas ao fundo | roteiro, slot 5: a anterior não tinha gente |
| a mesma turma, outro corte | **`og.jpg`**, que o README listava como asset faltando |
| render do ônibus | bloco novo no fim da seção da dor |

`dia-5-6` ficou sem nenhuma referência e foi para `originais/` junto com os crus.

### O recorte do ônibus

**Preenchimento a partir das bordas, e não limiar global.** Os faróis, o cromado e
o logo da Starlink também são claros, mas estão cercados por carroceria escura: o
preenchimento por borda nunca chega neles, e limiar global teria comido os três.
Conferido depois: os três em alfa 254.

**Dois pixels de erosão antes de suavizar, e não um.** O anel da silhueta é
mistura de branco com ônibus, e semitransparente com cor de fundo vira halo claro
sobre página escura.

| | 1px de erosão | 2px |
|---|---|---|
| Pixels de alfa parcial com cor de FUNDO | 8,4% | **2,0%** |
| min(rgb) médio nos parciais | 173 | **158** |

**PNG de 1,9MB.** JPEG não carrega alfa, então o último recurso tinha de ser PNG,
e sem paleta ele saía maior que a página inteira. Octree com alfa: **287KB**, ao
lado de 105 do webp e 77 do avif.

**A traseira do render já vem cortada na borda do quadro.** Medido a 1440, a seção
da dor tem 72rem centradas e o ônibus para 149px antes da beira da tela: o corte
fica boiando. Sangrar até a beira exigiria `100vw`, que conta a barra de rolagem e
devolve rolagem lateral. A saída foi máscara de 12%, que é o idioma que as duas
peças do herói já usam.

### Medido

| | Celular 390x844 | Desktop 1440x900 |
|---|---|---|
| Corpos no voo | **5**, inalterado | **5** |
| Janela de rolagem do voo | **952**, inalterada | 1346 |
| Rolagem lateral | **0** | **0** |
| Fontes de imagem respondendo 200 | 35 de 35 | 35 de 35 |
| Deslocamento da entrada do ônibus | 22,2px | 65,3px |
| Marcação da planilha | **219/219** | inalterada |
| Erros de script | **0** | **0** |

Tamanhos, na mesma ordem dos vizinhos de cada slot: `serra-motos` e `turma` em
34 a 37KB avif, 47 a 49 webp, 66 jpg, contra 43/56/80 do `grade-comida`;
`crista` em 74/97/132, contra 82/112/135 do antigo `dia-5-6`.

Sem os estilos do script, o ônibus aparece parado, opaco e inteiro.

### Duas coisas de higiene que estavam abertas

**Os crus estavam dentro de `assets/`**, ou seja seriam publicados: 9,4MB de JPG de
celular e um PNG de 4,7MB. Voltaram para `originais/`.

**Não havia `.gitignore` no projeto.** A regra de não publicar `originais/` existia
só no README, e o git não sabia dela. Agora sabe.

### O EXIF já estava limpo

Conferido nas seis fotos antes de qualquer coisa: zero tags, sem GPS e sem
orientação. O WhatsApp removeu. Não havia coordenada de trilha para vazar nem
rotação para tratar, o que é sorte e não processo: foto vinda de outro caminho
pode trazer as duas coisas.

### Vigésima terceira rodada: o recorte refeito e o leque de sete

*"Quero que adicione mais imagens na animação. O recorte da imagem do ônibus não
ficou boa (partes ficaram cortadas e muita rebarba). A integração da imagem
também não ficou nem um pouco boa."*

### O erro de método do recorte

Medi antes de refazer, e o número é constrangedor: a carroceria tem `min(rgb)` no
máximo **197** e o fundo no mínimo **249**. Havia **52 níveis de folga** entre os
dois, e mesmo assim eu usei máscara binária mais **erosão de dois pixels**.

**Tratei um problema de matte como problema de morfologia.** A erosão que eu
descrevi como conserto de halo foi o que comeu o contorno: 3 a 5px no corpo todo e
até 48px na traseira baixa. Com essa folga de tons, uma rampa contínua resolvia
sem tocar em nada.

### E a integração tinha raiz mais funda

O `Design/DESIGN.md` do próprio projeto diz: *"no illustrations, **no product
renders**, no abstract graphics"*. O render é material que o sistema visual
proíbe. Ele lia como colagem porque **era** corpo estranho, e nenhum
posicionamento ia consertar isso.

A saída foi assumir que é impresso: **recorte de catálogo pregado na página**, que
é vocabulário que o sistema de zine da página já fala. E isso mata os quatro
defeitos de uma vez, porque **o papel fica**: sem alfa não há silhueta para
recortar, sem silhueta não há rebarba, e a traseira cortada vira tesoura.

O fundo foi retonalizado para o `--fundo` das seções claras, então o recorte é
feito do mesmo material que o resto da página.

| | Antes | Agora |
|---|---|---|
| Diferença de silhueta contra o original | 3 a 48px comidos | **até 2,3px** |
| Pixels de alfa parcial com cor de fundo | 2,0% | **não existe alfa** |
| Formatos | avif, webp e **PNG de 287KB** | **avif 53, webp 67, jpg 145KB** |
| Fundo | transparente | papel `#DDE2E4` da página |

O que encolhe são até 42px da cauda fraca da sombra de chão, e isso é
consequência da escolha: o papel é mais escuro que o branco do render e sobra
menos faixa para segurar um degradê.

### O leque de cinco para sete

Entraram o grupo na cachoeira, de camisa da marca, e a vista de guidão sobre o
vale. Três coisas precisaram mudar:

1. **`ATRASO` virou `0.4 / (provas.length - 1)`.** A regra que o próprio
   comentário declara é que a última prova parte aos 40% do percurso. Com sete
   corpos e o 0,10 antigo ela partiria aos 60% e `DURACAO` cairia de 0,60 para
   0,40, encurtando o voo em um terço sem ninguém ter pedido.
2. **Os arrays de desvio ganharam duas posições.** Eles são indexados por resto,
   então com cinco valores as fotos 6 e 7 caiam EXATAMENTE em cima da 1 e da 2.
3. Os dois desvios novos saíram de **varredura**, e não de olho.

### O erro que a medição pegou no meio da varredura

A primeira busca modelou a posição de repouso como sendo só o desvio, e devolveu
números que o navegador desmentiu na hora: previu mínimo de 12,1% e a medida deu
11,3%, com o perfil inteiro diferente. **A posição de repouso é ponto da pista
MAIS desvio**, e o ponto da pista anda 0,087 em x de um índice para o seguinte.
Com a pista dentro do modelo, previsão e medição passaram a bater na terceira
casa.

**O raio ficou preso ao anel das cinco**, teto de 0,387. Sem essa trava a busca
queria 0,57, o que dá mais visibilidade e destrói o assunto: raio grande é o
defeito já registrado de o monte virar mostrador de relógio.

### Medido

| Prova | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|
| Área à vista no monte | 100% | 47% | 46% | 39% | 38% | 44% | **28%** |

**O que o sétimo corpo custa: a pior visibilidade cai de 37,8% com cinco para
28,3% com sete.** Nenhuma some, que era a regra; a mais coberta é a última, e é
ela que paga por entrar por último na ordem de empilhamento. Se 28% ficar pouco, o
botão é o raio do anel, e o preço é o monte começar a virar mostrador.

| | Celular 390x844 | Desktop 1440x900 |
|---|---|---|
| Provas na pilha | **7** | **7** |
| Posições distintas no repouso | **7** | **7** |
| Previsão contra medição | bate na 3ª casa | idem |
| Rotação do recorte | -6 a -3 graus | idem |
| Rolagem lateral | **0** | **0** |
| Fontes de imagem respondendo 200 | 41 de 41 | 41 de 41 |
| Erros de script | **0** | **0** |

Sem os estilos do script, o recorte aparece parado, inteiro e no ângulo de
repouso.

### Uma divergência entre comentário e código, que não é minha

O comentário da seção 6 do `roadbook.js` descreve hoje um modelo **radial**, com
fase, raio multiplicado e escala subindo de 0,7 a 0,9. **O código embaixo dele
continua sendo o da clotoide**, com `RAIO_LEQUE`, `PASSO_ANG`, tabela de pista e
`ESPALHA`. Alguma outra sessão trocou a prosa sem trocar a implementação, ou
parou no meio. Não reescrevi texto de outra sessão, mas fica o aviso: quem ler
aquele comentário para entender o voo vai entender errado.

### Bloqueios antigos, ainda esperando o usuário

Número real do WhatsApp (placeholder `5500000000000` em 5 links), URLs de
Instagram/Facebook/YouTube, data da expedição, `assets/media/og.jpg` faltando,
pixel de rastreio.

## 2026-08-24

### O que foi pedido

Três coisas, em sequência, com correções por cima de cada uma:

1. Aumentar o mapa no desktop.
2. Corrigir os ícones do dia 3 e do dia 4.
3. Refazer a animação das fotos para "forma de Euler", com desenho em cima de
   um print. Depois, ao bater num impasse, o modelo foi redefinido pelo usuário:
   *"As imagens não devem ter uma animação própria para cada um. Deve seguir uma
   ordem, onde a primeira imagem puxa o restante das imagens."*

### O mapa cresceu no desktop

`--largura-mapa` foi de 150px para **220px**, e o `.mapa` do desktop passou a
consumir o token em vez de repetir o número. Eram dois `150px` soltos, um no
token e um na regra, e mudar o mapa pedia lembrar dos dois.

O herói e o rodapé recuam por `calc()` sobre esse token, então seguiram sozinhos:
reserva de 214px virou **284px**.

| | Antes | Agora |
|---|---|---|
| SVG | 150 × 200 | **220 × 293** |
| Conjunto com a leitura | 150 × 232 | **220 × 340** |

Medido a 1440×900, a 1024×768 (a largura mais apertada em que a regra de desktop
vale: título ainda em duas linhas com 666px, mapa de 226 a 566 numa tela de 768,
overflow zero) e a 390×844 (celular intacto, 92px, token continua 150 lá).

### Os dois ícones estavam errados, e não pelo motivo aparente

Medido com `getBBox()` no navegador mais geometria analítica, comparando cada
glifo contra os quatro irmãos da família.

**Dia 3, `tulipa-curvas`.** A farpa da seta era `M9 6.2 12 4l1.7 3.2`:

| | Dia 3 | Família |
|---|---|---|
| Abertura entre os braços | 81,7° | **90,0°** |
| Bissetriz (para onde aponta) | 102,9°, baixo e direita | **90,0°, para cima** |
| Caixa | 4,70 × 3,20 | **7,00 × 3,50** |
| Centro em x | 11,35 | **12,00** |

E encostava no desenho: o braço esquerdo passava a **0,40 unidade** da perna do
ziguezague. Com traço de 2, isso é sobreposição, e as duas viravam um borrão.

Não dava para consertar só a farpa: a farpa padrão da família também fundia ali
(1,46). O traçado teve de abrir espaço. Ficou
`M12 19 6.5 16.5 17.5 12 12 9.3V4`, com saída **reta** na vertical, que é o que
uma farpa de 7 unidades de largura exige. Os dois grampos saíram de busca sobre
os pontos de virada.

| | Antes | Agora |
|---|---|---|
| Farpa contra o traçado | 0,40 | **3,16** |
| Folga entre pernas vizinhas | 1,49 | **2,04** |

**Dia 4, `tulipa-agua`.** As duas ondas iam de x=3 a x=18, centro em **10,5**,
enquanto pino, mastro e seta do mesmo glifo estão todos em **12**. A água ficava
1,5 unidade à esquerda da estrada que atravessa. Mesma onda, transladada 1,5.

As três setas que apontam para cima (dias 1-2, 3 e 4) agora são byte a byte a
mesma: `M8.5 7.5 12 4l3.5 3.5`.

### A animação das provas foi refeita duas vezes

**Primeiro:** a meia elipse virou a **espiral de Euler** (clotoide), construída
das integrais de Fresnel e percorrida de trás para a frente, de curvatura máxima
a curvatura zero. `U = 2,2` dá 1,21 volta. Bateu com o desenho: um laço e a saída
reta para cima e à direita. Medido em carga limpa a 390×844 e 1440×900, o
deslocamento bateu com o projeto na terceira casa.

**E aí o laço quebrou o "não podem se sobrepor".** A espiral volta por cima do
ponto de partida, então uma prova no fim do laço reencontrava outra ainda parada
no álbum: **100% de sobreposição**. Varri **as 120 ordens de saída vezes sete
intervalos vezes seis elevações**; o melhor caso era 66%, que é a mesma
sobreposição que o álbum parado já tem. Não era ajuste, era modelo.

**Segundo:** com o modelo redefinido pelo usuário, a pista virou **uma só** e as
provas viraram uma **fila** sobre ela, atrasadas de um passo fixo de percurso
(`ESPACO`) e não de tempo. O passo de arco garante a separação por construção.

A peça que fez funcionar: **a tabela da pista começa antes da origem**, em
progresso negativo. Progresso negativo é `u` maior que `U`, ou seja mais fundo no
miolo enrolado da espiral. As cinco provas em repouso são cinco pontos
consecutivos desse miolo, e o álbum deixou de ser um arranjo à parte.

| | Modelo antigo | Fila numa pista |
|---|---|---|
| Sobreposição em repouso | 68% | **80%** |
| Pico no voo | **100%** | **79%** (nunca pior que o repouso) |
| Série ao longo do voo | subia e voltava | 80 > 74 > 77 > 67 > 61 > 18 > 17 > 16 > 15 > 13 |
| Erro da fila | - | **0px** |
| Folga até o painel de preço | 63px | **65px**, sem invasão |
| Volta da pista | - | **427°** |

A janela de rolagem foi de 885 para **1897px**. Com `scrub`, velocidade é
movimento por pixel rolado e não duração, e a pista nova é mais que o dobro da
antiga: sem alongar, o voo passava a 2,23–2,89 por pixel rolado. Ficou 1,04–1,35.

### O que falhou, e fica registrado para não repetir

| Tentativa | Por que morreu |
|---|---|
| **Desvio constante** de cada prova em relação à pista, um leque pequeno, para abrir o álbum | Desvio constante faz cada prova andar numa **paralela** da pista, e paralelas de uma espiral se cruzam. Pico foi de 79% para **100%**, com invasão do painel. |
| **Degrau de tamanho**: desenhar maior quem está mais fundo | A prova maior **engole** a menor por inteiro. Repouso foi de 80% para **100%**, também com invasão do painel. |
| Espiral mais curta (0,5 a 0,8 volta) para o caminho não voltar sobre o álbum | Pior: com menos volta o álbum demora mais para se desfazer. 89 a 94%. |
| Elevação alta (1,1 a 2,8) para o laço subir acima do álbum | Chão em 66%, e a essa altura o laço vira hélice esticada. |
| `posto`/`ATRASO` calculados antes de `LEQUE`/`RAIO_BASE`/`RAIO_PASSO` (sessão anterior) | `var` içado lê `undefined` → NaN → `sort` não faz nada. Falha silenciosa. |

### Problemas em aberto

1. **A prova mais funda do álbum aparece só 8%.** O raio do miolo da espiral cai
   com `1/(π u)`, então as de trás se apertam. As duas saídas tentadas pioraram
   tudo (tabela acima). O caminho que sobra é **diminuir a foto**: hoje ela mede
   0,80 da largura da pilha, e cinco fotos desse tamanho não cabem separadas num
   álbum compacto. É decisão de layout, não de animação, e por isso não foi
   tomada.
2. **A leitura do mapa no desktop cai sobre papel claro.** Ela vai até x=177 e a
   faixa `.papel.escopo` começa em x=139, então ~38px do nome da cidade ficam com
   tinta clara sobre fundo claro (`rgb(226,255,204)` sobre `rgb(221,226,228)`).
   A detecção de superfície em `assets/js/roadbook.js` só compara o eixo **Y**;
   ensiná-la a olhar o **X** resolveria. Já era assim antes do mapa crescer.
3. **`largura` fica velha depois de redimensionar** até a ScrollTrigger
   refrescar. Em uso real ela refresca sozinha no resize, com atraso; só virou
   problema na medição. Vale confirmar se incomoda ao girar o celular.

### Bloqueios antigos, ainda esperando o usuário

Número real do WhatsApp (placeholder `5500000000000` em 5 links), URLs de
Instagram/Facebook/YouTube, data da expedição, `assets/media/og.jpg` faltando,
pixel de rastreio.

### Armadilhas de método desta sessão

- **`python -m http.server` serve o CSS com cache.** `?v=` no documento não
  invalida a folha. Sempre URL nova ou Ctrl+F5. Duas medições foram perdidas
  assim.
- **Nunca medir logo depois de redimensionar.** Antes do refresh da ScrollTrigger
  os números saem **1,62× errados**. Recarregar na largura desejada.
- **O painel do navegador não compõe quadros**: `rAF` e animação CSS congelados,
  screenshot dá timeout. Toda verificação é dirigir `st.animation.progress(p)`
  mais `render()` à mão e medir com `getBoundingClientRect`.
- **Medir cotovelo não é medir colisão.** Ao conferir se dois traços se fundem,
  excluir a vizinhança do vértice que eles compartilham, senão todo canto vira
  falso positivo. Cheguei a concluir que o ziguezague inteiro estava quebrado
  antes de perceber isso.
- **O proxy `rtk` corrompe saída de `grep` e `ls`** neste ambiente (some com
  nomes de arquivo, embaralha linhas). Quando a saída parecer estranha, refazer
  com PowerShell ou `find`.
