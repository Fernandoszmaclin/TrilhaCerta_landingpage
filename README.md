# Trilha Certa - Landing Expedição Canastra

Landing page estática, com fontes em `src/` e artefato otimizado em `dist/`.
As dependências são empacotadas localmente: não há dependência externa em tempo
de execução.

```bash
npm ci
npm run build
cd dist
python -m http.server 5173
```

---

## Status de publicação

A página já usa mídia local com fallbacks AVIF, WebP e JPEG, além de WebM e MP4
para vídeo. Instagram e Facebook estão configurados; não há links sociais de
placeholder na página ativa.

Antes de publicar, faltam dados comerciais que não devem ser inventados:

1. **Número oficial do WhatsApp** — substituir `5500000000000` nas **6 URLs**
   atuais: cinco CTAs e o canal social do rodapé.
2. **Domínio de produção** — substituir `SEU-DOMINIO-AQUI.com.br` nas **7
   referências** de canonical, Open Graph, Twitter e JSON-LD.
3. **Datas confirmadas** — exibir a saída e preencher `startDate`, `endDate` e
   `priceValidUntil` no JSON-LD somente após a confirmação da operação.

`src/assets/media/og.jpg` já tem 1200×630 e é a imagem de compartilhamento.

### Rastreamento

GA4 e Meta Pixel estão deliberadamente fora deste ciclo. Não adicione
rastreadores sem os IDs de propriedade e uma decisão de consentimento LGPD.

---

## Não publique a pasta `source-media/`

`source-media/` guarda os `.mov` de origem, os JPG de 3000x4000 e o render do ônibus.
Nada ali é usado pela página. Publique somente o conteúdo gerado em `dist/`.

Agora há um `.gitignore` com `source-media/` dentro. Antes não havia nenhum, e a
pasta entrava no commit seguinte por descuido.

**Chegaram sete arquivos novos e eles nasceram no lugar errado**, soltos dentro de
`src/assets/media/`, somando 9,4MB de JPG de celular e um PNG de 4,7MB. Tudo que está
em `src/assets/` é publicado no build, então eles foram convertidos e os originais voltaram
para `source-media/`. Três dessas fotos entraram na página e uma virou o og:image.
O render do ônibus também fica arquivado: não há slot ativo para ele. **Duas
fotos continuam sem uso**, e ficam registradas aqui para não se perderem:

| Arquivo em `source-media/` | O que é | Onde caberia |
|---|---|---|
| `IMG-20240722-WA0139.jpg` | grupo na cachoeira, de camisa da marca | prova de operação, se algum dia abrir slot |
| `IMG-20240724-WA0104.jpg` | grupo na lancha, coletes, cânion | alternativa para a referência 03 do roteiro |
| `IMG-20251012-WA0009.jpg` | vista de guidão sobre o vale | alternativa para a prova da dor |

Não foram colocadas porque **não sobra slot livre na página**: são onze slots de
foto, todos ocupados, e o único lugar sem imagem é a lista do escopo, que é texto
de propósito. Inventar slot para gastar foto seria o contrário do que a seção
decidiu.

---

## O mundo visual

A página é um **guia de campo**, e agora com a paleta do guia de campo. Quatro
coisas a constroem.

**Duas superfícies, alternando.** Tinta (`#161B13`, verde profundo) e papel
(`#DDE2E4`), no ritmo tinta, papel, tinta, papel, tinta. O mecanismo é uma
classe `.papel` que redefine os mesmos tokens que o resto do arquivo já consome,
e `.tinta` faz a volta para uma peça escura dentro do claro. Nenhum componente
sabe em que superfície está.

**Um acento cromático, e o laranja preso na ação.** O acento de display é o
verde-menta `#E2FFCC`: título de seção, traçado do mapa, marcadores. O laranja
da marca `#FF6A00` tem um papel só, o botão. É o que deixa a página falar a
língua do guia de campo sem apagar a marca no único lugar em que ela precisa
gritar.

A exceção é o ícone flutuante, que é verde `#25D366` e redondo. Ele não vende a
expedição, abre a conversa, e para isso vale mais o crachá que a pessoa
reconhece sem ler do que mais um botão da marca. É o único ponto da página que
empresta a identidade de outra empresa.

**Três chamadas para a mesma ação, e não seis.** Herói, painel de preço e ícone
flutuante. Saíram as da barra, do escopo e da dor: a da barra ficava na tela ao
mesmo tempo que o flutuante, com o mesmo rótulo e o mesmo destino, e as do meio
repetiam o pedido antes de a página ter dado o preço. A chamada de turma mista
continua, porque é outra intenção e não uma repetição.

**A logo é o botão de volta ao topo.** Ancorada no canto superior esquerdo, não
mais no centro: a barra tinha `max-width` de 72rem centralizada, e numa tela de
1920 isso punha a marca a 448px da borda. Cresceu de 34px para 44 no celular e
56 no desktop, com a barra indo a 76px no desktop para acomodá-la, porque é um
brasão denso e a 34px não era leitura, era mancha.

Continua sendo `<a href="#topo">` e não `<button>`: sem JavaScript ela ainda
leva ao topo, num salto seco. O script troca o salto pela rolagem animada, e a
animação sai do Lenis porque é ele quem controla a rolagem da página; com
`scroll-behavior: smooth` no CSS os dois brigariam e a âncora rolaria duas
vezes.

**O mapa do percurso.** Peça fixa que desenha a rota do Rio Grande do Sul até a
Serra da Canastra conforme a página é lida. Detalhes na seção própria abaixo.

**Mono em todo o chrome.** Texto lido em sequência é prosa e vai de Barlow;
texto lido de relance, rótulo, número, regra, é chrome e vai de Martian Mono. O
display é Archivo com o eixo de largura em **74%**, condensado: é o que mais
aproxima a página da face de display da referência, e não custou nenhum download
porque a fonte já era variável.

**O painel de preço são DOIS PLANOS, e não um preço mais uma tabela.**

Estava montado como um valor grande e um `<dl>` de dois pares. Os dois pares
pareciam irmãos e não eram: "Total a prazo" é a **soma do plano de cima**
(1.497,50 + 10 x 449,25 = 5.990,00), enquanto "À vista no Pix" é outro plano
inteiro. Lado a lado na mesma tabela, cabia ao leitor descobrir qual número
pertencia a qual forma de pagar, que é exatamente o trabalho que um painel de
preço existe para poupar.

Agora cada plano é um bloco fechado. O parcelado abre no sinal e fecha no
próprio total; o à vista tem bloco próprio, aberto por um fio mais presente.

**O painel cabe numa tela de celular.** Não é preferência: é o único bloco da
página em que o visitante compara números entre si, e comparar com metade do
bloco fora da tela vira rolar para cima e para baixo guardando cifra na memória.

Medido num aparelho de 375x667, o menor celular ainda comum: o painel tinha
662px contra 603 de tela útil depois da barra. Hoje tem 593, e sobra folga. Num
390x844 sobram 187px. O aperto vale só abaixo de 48rem; acima disso a altura
deixa de ser problema e o respiro volta ao normal.

De onde vieram os 69px: o vão entre os dois planos caiu de 73 para 41 (era
`padding-bottom` de 32 somado a uma margem de 16, e quem separa os planos é o
fio, não o vazio), o respiro do painel apertou, e a frase do desconto desceu
para 13px, o mesmo corpo da condição do boleto. Ela é qualificador e não
argumento: explica que os 10% já estão dentro do número de baixo. A 15px
ocupava quatro linhas e 93px de altura para dizer uma frase.

Num aparelho de 320px de largura o painel ainda não fecha numa tela: ali o
título quebra em três linhas e tudo mais em quatro. Fechar aquilo exigiria
encolher o display, o que pioraria a página inteira para servir a um aparelho
que saiu de linha em 2016.

No fecho, rótulo e valor ficam juntos, separados por um respiro de 12px. Era
`space-between`, que é o certo para uma tabela de várias linhas porque alinha a
coluna de valores; com uma linha só não há coluna para alinhar, e o que restava
era um vão de quase cem pixels no meio da frase, separando um rótulo do número
que ele nomeia. Em telas de 320px a linha quebra, e os dois caem na mesma
margem esquerda em vez de se dividirem entre as bordas. Os
dois começam com o mesmo tipo de rótulo, em mono maiúsculo, e é essa repetição
que os faz lerem como alternativas em vez de continuação um do outro. Nenhuma
palavra mudou: mudou a qual bloco cada frase pertence.

A escada de tamanhos:

| Degrau | Tamanho | O que é |
|---|---|---|
| Sinal | 45px no celular, 68 no desktop | o plano em destaque |
| Valor à vista | 17px | o plano alternativo |
| Parcelas | 15px | apoio do plano em destaque |
| Rótulos, boleto e total | 13px | referência |

As parcelas estavam em 19px, o **segundo maior elemento do painel**, em mono de
peso 700 e quebrando em duas linhas. Mono é largo, negrito é pesado e duas linhas
são um bloco: somados, "10 parcelas de R$ 449,25" disputava a atenção com
"R$ 1.497,50". A 15px a frase cabe em uma linha, e o contraste interno passa a
vir da cor: a frase em tinta média, o valor em tinta cheia.

As duas cifras são menta porque as duas são preço; quem diz qual manda é o corpo
da fonte, numa diferença de 2,6 vezes. O valor à vista ficou em 17px e não 19
por medida: a 19px ele pedia 256px de linha e tinha 246 num aparelho de 320,
quebrando em "R$ 5.690,50 por" mais "pessoa", uma órfã de uma palavra debaixo de
uma cifra.

### Quatro armadilhas de cor, todas medidas antes do CSS

1. **A menta só existe na banda escura.** `#E2FFCC` sobre `#DDE2E4` dá
   **1,21:1**. Na banda clara o acento é `#A03F00` (5,01:1). É a mesma regra que
   a referência escreve na documentação dela, agora com o número.
2. **O `terrain-grey` não serve de texto na banda clara.** `#84907F` sobre
   `#DDE2E4` dá **2,56:1**. Ele é texto secundário no escuro (5,23:1) e cor de
   superfície no claro.
3. **A superfície elevada some no verde.** Um `--fundo-2` elevado plausível
   entrega 1,08 de contraste contra `#161B13`: invisível. Por isso `--fundo-2`
   vale o mesmo que `--fundo`, e o que separa uma folha da outra é fio de 1px.
   A referência já dizia "sem sombra, sem elevação"; a medição concordou.
4. **O rótulo do botão não pode sair de `--fundo`.** Foi defeito real numa
   rodada anterior: dentro do papel o rótulo herdava o fundo claro e o botão
   virava creme sobre laranja, 2,26:1. Tem token próprio, `--sobre-marca`, que
   nenhuma superfície redeclara.

O amarelo saiu. Com laranja preso na ação, manter amarelo mais menta daria três
acentos cromáticos, e a regra da referência é um só. O preço usa o acento de
display. A marca não perde o amarelo: ele continua na logo.

---

## O portão de entrada

A placa que cobre a página no primeiro instante e sobe revelando o herói.

**Ela não é abertura de agência.** A página carrega Archivo com
`font-display: swap`, e o título do herói tem 100px: quando a fonte real chega,
ele muda de altura e a dobra inteira se reacomoda na cara de quem acabou de
chegar. O portão cobre exatamente essa janela. O ganho de marca vem em cima de
um ganho funcional, não no lugar dele.

Custa tempo até a primeira leitura, então é curto: **1,04s** do carregamento até
o herói limpo.

| Momento | O que acontece |
|---|---|
| 0 a 180ms | a marca aparece, de 0,96 para 1 |
| 180 a 480ms | segura |
| 480 a 620ms | a marca sai, subindo 8px |
| 520 a 1040ms | a placa sobe e leva a borda rasgada pela tela |
| 600 a 1180ms | título, apoio e botão entram escalonados a 60ms |

**É CSS, e não GSAP**, por duas razões práticas. Animação em CSS roda fora da
thread principal, e este é justamente o momento em que a thread está ocupada
parseando, baixando fonte e decodificando imagem: `requestAnimationFrame` aqui
perderia quadros onde eles mais aparecem. E ela precisa terminar mesmo que nada
mais funcione. Portão que depende de script é portão que tranca a página quando
o script falha.

**A borda rasgada é estática.** A placa é mais alta que a tela e tem a borda de
baixo recortada por `clip-path`; quem se move é um `translateY`, que é transform
puro e não repinta nada. O site de referência anima o próprio `clip-path` quadro
a quadro. O resultado é parecido e o custo não é. O tremido é o mesmo da divisa
do herói e do laço do mapa: traço de mão, não régua.

**`backwards`, e não `both`, no escalonamento do herói.** Com `both` a animação
continua aplicando o transform final depois de terminar, e valor de animação
vence declaração normal na cascata: o `.botao:active { transform: scale(0.98) }`
ficaria morto para sempre e o botão perderia o retorno de toque. Medido e
corrigido.

Sob movimento reduzido a placa continua, porque o reflow da fonte continua. O
que sai é o deslocamento: ela se esvai no lugar e o herói aparece sem subir.

---

## O herói

Duas peças de mídia sangram das bordas e **dissolvem** antes de chegar ao
centro: o vídeo em loop pela esquerda, a foto do grupo pela direita, e uma linha
ondulada fina dividindo as duas.

**A dissolução é horizontal, e só ela.** Na altura a mídia vai de ponta a ponta.
Houve uma versão em que ela também dissolvia no meio, para abrir uma faixa limpa
onde o texto mora, e o resultado foi mídia virando tira: com o degradê morrendo
em 48% da altura, sobrava uma faixa fina no alto. Na foto do grupo o preço era
alto, porque as motos estão na metade de baixo dela, e o que sobrava era morro e
céu.

**A lavagem.** A mídia é dessaturada por `filter` e recebe um véu da cor da
superfície. Intensidade média a pedido: ainda se vê moto, poeira e serra, que é
o que a página está vendendo. Abrir ou fechar é mexer em dois números.

**As máscaras vivem em elementos aninhados**, uma horizontal na peça e uma
vertical no filho, em vez de empilhadas com `mask-composite`. Não é preciosismo:
`mask-composite` tem sintaxe própria no WebKit, e é exatamente aí que esse
efeito quebra no Safari.

**O véu do texto é calculado, e ancorado em pixels.** Ele é quem garante a
leitura sobre a mídia, no lugar da dissolução. O pior fundo possível é o quadro
mais claro que o vídeo consegue produzir depois do tratamento: chega em 149, e
sobre 149 o apoio em mono daria 2,30:1.

As paradas do degradê estão em **pixels a partir do pé**, e não em porcentagem,
porque o bloco de texto tem altura quase fixa: medido, o topo do apoio cai a
263px do pé em telas de 600, 700, 800 e 900 de altura. Em porcentagem esse mesmo
ponto vira 27%, 37% ou 43%, e um degradê em porcentagem chega nele com força
diferente em cada tela. Foi o que aconteceu numa primeira tentativa: calibrado
em 900, o apoio reprovava em 3,74:1 numa tela de 600. Ancorado em pixels, uma
régua só serve celular e desktop.

Piores casos medidos, de 320 a 1920 de largura e de 600 a 1080 de altura:
**5,6:1 no apoio** contra os 4,5:1 pedidos, e **3,4:1 no título** contra os 3:1
de texto grande, sempre no quadro mais claro que o vídeo pode produzir.

**O título usa a largura toda, abaixo das peças.** No site de referência ele
cabe no vão entre as duas porque tem duas palavras; aqui é uma frase inteira, e
espremido no vão ele fechava em quatro linhas.

**A divisa para antes do título.** Ela corre em 42% da largura, e o título ocupa
a largura toda: descer até o pé faria um fio vertical cruzar o título por trás
das letras. Abaixo de 45rem de altura ela nem aparece, porque o que sobraria
seria um toco curto demais para ler como trilha.

**No celular existe uma peça só**, o vídeo, sangrado. Duas peças lado a lado em
390px dariam 190px cada, e nenhuma das duas leria. A foto do grupo continua
entrando por `background-image` dentro do media query de 64rem, então o celular
**não a baixa** (conferido em carga limpa).

**O loop toca na primeira pintura.** O vídeo do herói já nasce na tela, e um
gatilho de `top bottom` nunca dispara para quem não cruza a borda: ele abriria
no poster parado. O `play()` do herói acontece na inicialização, e o gatilho
segue existindo só para PAUSAR quando ele sai da tela.

---
## A planilha de regularidade

O roteiro deixou de ser uma tira de cartões e passou a ser o que a página já
sabia ser: **uma planilha de regularidade de enduro**, navegada por uma janela de
leitura.

Os glifos de tulipa já existiam, cada folha já declarava a sua em `data-tulipa`,
e a etapa já estava em `data-etapa`. A planilha não inventou vocabulário nenhum,
só passou a mostrar o que já estava no HTML.

### O que ela não tem, e por quê

**Não há quilometragem nem velocidade média**, e isso é decisão, não esquecimento.

Planilha de regularidade é, na essência, KM parcial, KM total e média. Aqui a
origem é a porta de cada cliente, então qualquer distância seria inventada, e
numa página que vende a expedição inventar distância e velocidade é afirmar o que
ninguém conferiu. A restrição já estava escrita em comentário no próprio HTML
antes desta rodada.

Então as colunas são só as que têm dado real:

| Coluna | De onde vem |
|---|---|
| `REF` | a posição na sequência, 01 a 04 |
| tulipa | o `data-tulipa` que já existia |
| `DIA` | o texto que já estava na folha |
| `ETAPA` | o `data-etapa` que já existia |
| `REFERÊNCIA` | o título e os parágrafos atuais |

A identidade de planilha vem do resto, e é de sobra: mono com algarismo tabular,
linhas regradas, numeração de referência, coluna de tulipa, a janela que não sai
do topo e o contador que avança. **A cópia não mudou**: os únicos textos novos
são rótulos de coluna.

### A janela gruda no desktop, e no celular a barra fica no papel

Num porta-planilha o papel corre atrás de uma janela e o piloto lê sempre na
mesma altura. A partir de 48rem é isso que a seção faz: a barra de três linhas
gruda **abaixo** da barra de navegação da página, e não no topo da tela. Medido
em 144 posições de rolagem, a barra fixa da página nunca cobre a régua de
colunas, e o desvio da barra grudada fica em 0,8px.

**No celular ela não gruda**, e isso é pedido do usuário. Numa tela de 390 ela
ficava por cima do texto o tempo todo, e o que entregava em troca era o contador
de referência, que é justamente a coluna que o celular já não tem. Uma faixa
permanente sobre a leitura é caro demais para isso. Ela agora fica no papel: rola
junto, aparece no começo da planilha e sai.

A versão bem anterior desta seção prendia cada folha em tela cheia e por isso era
desktop-only, com um motivo declarado: prender a rolagem briga com a barra de URL
retrátil, que muda a altura da viewport no meio da sequência. Isso continua
valendo, e é por isso que nunca voltou.

### A régua e as linhas leem a mesma medida

As colunas moram numa variável só, `--planilha-colunas`, que a régua de rótulos e
as linhas consomem. Cabeçalho de tabela desalinha quando alguém mexe numa medida
e esquece a outra; aqui não há a outra.

`display: contents` na caixa de leitura é o que permite isso: ele dissolve a
caixa e entrega os quatro filhos direto ao grid da linha. Abaixo de 48rem essa
caixa volta a ser uma caixa, porque ali a linha é ficha e não tabela.

**A régua não rotula mais as duas últimas colunas separadamente.** Elas trocam de
lugar de uma linha para a outra, então um rótulo fixo ali mentiria em metade das
linhas: o de referência cobre as duas. E ele estava errado antes disso, porque
dia e etapa dividem a coluna 3 e os rótulos saíam deslocados de um, com "Etapa"
em cima da descrição e "Referência" em cima da foto.

Medido a 1440 com a linha chapada, que é a única em que isso se cobra:

| Coluna | Régua | Linhas |
|---|---|---|
| Ref | 140 | **140** |
| Tulipa | 228 | **228** |
| Dia | 300 | **300** |
| Referência, cobrindo 4 e 5 | 460 | **460** |

E a prova tem a mesma largura nas quatro linhas, **407px**: as colunas 4 e 5 têm
medida igual de propósito, senão a foto mudaria de tamanho a cada troca de lado.

**A ref e a tulipa ficaram no plano do papel**, e isso é conserto de um defeito
meu. Elas chegaram a subir 14px em z junto com a prova. Sob perspectiva, o que
está mais perto do olho é desenhado maior e se afasta do centro da folha: medido,
a coluna REF saía **6px fora** do rótulo dela. Seis pixels de saliência não pagam
um cabeçalho de tabela torto. Na prova o custo é zero, porque o rótulo dela cobre
as duas colunas.

### A marcação é troca de estado, não interpolação

Ou a janela está numa referência ou está na outra: contador de referência não tem
meio-termo. Por isso não há tween nenhum na marcação, só um `ScrollTrigger` por
linha e uma classe que entra e sai. Quem suaviza a troca é a transição de cor do
CSS e a dobra, que é contínua.

**A linha de leitura fica em 58% da altura da tela**, e não colada na barra. A
primeira versão a punha logo abaixo do vidro, por fidelidade ao porta-planilha.
Só que uma folha aqui tem quase a altura da tela, e com a linha em 156px de uma
tela de 844 a referência só virava corrente depois que o topo dela já tinha
subido 688px: a essa altura ela ocupava 81% da tela e o contador ainda dizia a
anterior. Desceu para 42%, e ainda acendia com a folha em 58% da tela. Em 58% a
referência acende com a folha ocupando 43%, ou seja **antes** de ela tomar a
tela.

Onde a barra gruda, ela é o piso: a linha nunca sobe para dentro do vidro, senão
a referência marcada seria uma que ele está tampando.

| | Celular | Desktop |
|---|---|---|
| Linha de leitura, primeira versão | 156px | 168px |
| Linha de leitura, agora | **490px** | **522px** |
| Quanto da tela a referência ocupa quando acende | **43%** | **39%** |

Medido varrendo a seção inteira:

| | Celular | Desktop |
|---|---|---|
| Posições com exatamente uma referência ativa | **219 de 219** | **132 de 132** |
| A marcada é a que está sob a linha de leitura | **219/219** | **132/132** |
| Contador divergindo da marcação | **0** | **0** |

Numa varredura de um em um pixel em volta das três passagens, **quatro pixels**
sem referência nenhuma, no pixel exato da troca. Fechar a costura significaria
sobrepor as faixas, e aí existiriam pixels com DUAS acesas, que é pior: o
contador piscaria. Como ele só muda quando alguém ativa, na costura ele mantém o
último valor e ninguém vê nada.

### Dois defeitos que a medição pegou

**A linha de leitura vinha do lugar errado.** A primeira versão media
`topo.getBoundingClientRect().bottom` para saber onde a janela está. Mas a
ScrollTrigger avalia `start` e `end` no refresh, e no refresh a página está no
topo e a barra **ainda não grudou**: o que voltava era a posição dela no fluxo. O
resultado era a referência 02 marcada com a caixa dela em 1168 e a linha em 385,
ou seja, marcação sem relação nenhuma com o que estava sendo lido. **1 acerto em
47 posições.** A posição de grude é o offset do sticky mais a altura da barra, e
os dois são estáveis.

**O avanço do papel saiu, e a causa não é óbvia.** A ideia era deslizar a tira
dez pixels enquanto ela atravessa a janela, para o conjunto ler como papel
correndo atrás de um vidro. Só que a ScrollTrigger calcula `start` e `end` a
partir da posição de **layout** das linhas, e um transform move a linha sem mexer
no layout: com a tira deslocada, a faixa que a ScrollTrigger acha que é a
referência 02 já não é onde a 02 está desenhada. Medido com o deslize ligado,
duas posições sem referência nenhuma e três com a errada; sem ele, zero e zero.
Dez pixels de enfeite não pagam uma marcação que erra.

### No celular a linha é uma ficha, e não uma tabela

A primeira versão levava o grid de três colunas para o celular também. Medido a
390x844, o resultado era este:

| | valor | o que devia ser |
|---|---|---|
| Largura da coluna de texto | **192px** | a largura útil, 308 |
| Caracteres por linha | **22** | 35 a 60 |
| Largura da prova | **192px** | a largura útil |
| Altura de cada folha | **674 a 784px** | menos que a tela |

`ref` e `tulipa` comiam 108 dos 308px úteis, e sobrava menos da metade da tela
para o texto e para a foto. Numa coluna de 22 caracteres o parágrafo vira uma tira
comprida, e foi assim que os cartões ficaram alongados.

Então abaixo de 48rem a linha deixa de ser tabela e vira **ficha**: um cabeçalho
com `01`, tulipa e dia à esquerda e a etapa empurrada para a direita, e embaixo o
texto e a prova na largura inteira. `display: contents` na caixa de leitura, que é
o que dissolve a caixa e entrega os filhos ao grid, só volta a partir de 48rem.

A régua de colunas some no celular, e não por falta de espaço: **não há coluna
para ela rotular**. Rótulo de tabela sem tabela embaixo é cromo que mente. A barra
continua com o selo e o contador, que é o que ali informa.

Depois: **38 caracteres por linha**, corpo e prova com os 308px inteiros, e
folhas de 582 a 636px, dentro da tela.

### A profundidade é uma dobra, e ela come sozinha o problema do atraso

A planilha nasceu chapada. A rodada anterior deu a ela luz e sombra, e evitou
transform por um motivo registrado: a ScrollTrigger calcula as faixas de marcação
a partir do **layout**, e transform move o desenho sem mexer no layout. Aquele
conserto custou o 3D.

E custou também o começo. A marcação é binária e dispara na janela, então a folha
entrava na tela e ficava **688px de rolagem** sem que nada se mexesse. Não era a
marcação que estava atrasada: era o caminho até ela que estava parado.

Os dois pedidos, profundidade e começo, têm o mesmo conserto: uma dobra contínua,
presa à rolagem, que existe desde o pixel em que a folha aparece.

**O que quebrava era translação, e não transform.** Giro e recuo em torno de um
pivo não movem o pivo. E a grandeza que comanda a dobra é a distância COM SINAL
da linha de leitura até a CAIXA da folha, que vale zero enquanto a linha está
dentro dela. Isso é exatamente a condição de estar ativa, logo:

- a folha ativa está sempre chapada e no lugar do layout, e a borda desenhada dela
  coincide com a borda medida;
- na troca de referência, a que entra tem o topo na linha e também está chapada,
  então a fronteira que a ScrollTrigger usa continua honesta.

A marcação fica imune por construção, e não por sorte. Medido: em 172 posições no
celular e 143 no desktop, a folha ativa nunca teve giro, recuo nem deslocamento, e
a borda desenhada dela ficou a 0,19 e 0,39px da borda de layout.

Do que a dobra é feita:

| Peça | O que faz |
|---|---|
| Giro | até **11 graus** no eixo X, a folha deitando no tambor |
| Recuo | até **90px** em z, com perspectiva de 900 no celular e 1400 no desktop |
| Véu | tinta sobre o papel afastado, até **0,50** de opacidade |
| Planos | prova em `translateZ(28px)`, ref e tulipa em `14px`, dentro de `preserve-3d` |
| Sulco da corrente | régua de 3px no acento, crescendo de cima para baixo |
| Suavidade do sulco | duração pela ALTURA da folha, curva de pico baixo, opacidade junto com a escala, pontas arredondadas |
| Fundo da corrente | sobe para `--fundo-3`, a única elevação de tom da seção |
| Lábio da janela | sombra projetada da barra sobre o papel |
| Pé da planilha | sombra sob o conjunto, para ele pousar na página |

Os planos são o que faz a dobra revelar **paralaxe** em vez de parecer uma imagem
inclinada: quando a folha gira, a prova se desloca mais que o texto, porque está
mais perto do olho. Medido, 6,3% de diferença de escala no celular e 3,0% no
desktop. Se der zero, o `preserve-3d` foi achatado por algum filter sobrevivente.

**Filter e opacity achatam o 3D**, e foi por isso que o recuo por
`brightness(0.62)` da versão anterior teve de sair: um elemento com filter vira
plano, o `preserve-3d` dele deixa de valer e nada descola do papel. O recuo passou
a ser o véu, que é um `::after` com a opacidade em `--veu`, escrita pelo GSAP a
cada quadro. O padrão é **zero**: sem script, nenhuma linha aparece apagada.

A prova recua por filter mesmo, e aí não há conflito: o véu fica no plano do papel
e a foto flutua acima dele, então o véu passaria por baixo dela. Filter numa foto
não custa nada, porque foto não tem plano dentro.

### A dobra é medida em pixels, e não em graus

O número que manda é **o recuo da borda longe**: 88px no celular, 66 no desktop.
O ângulo sai dele: seno do ângulo é recuo dividido pela altura da folha, com teto
de 11 graus para folha curta não virar leque.

Isso é conserto de uma assimetria que ninguém pediu. Grau fixo com folha de
altura variável não dá dobra igual: uma folha de 600px inclinada 11 graus manda a
borda longe 114px para dentro da tela, contra 66px de uma de 345. Somando a isso
uma perspectiva mais curta no celular, 900 contra 1400, o mesmo par de constantes
produzia desenhos bem diferentes.

| | Celular 390x844 | Desktop 1440x900 |
|---|---|---|
| Altura das folhas | 582 a 636 | 351 a 392 |
| Ângulo, antes | 11 graus | 11 graus |
| **Encolhimento, antes** | **20,0%** | **11,7%** |
| Ângulo, agora | **8,7 graus** | **10,8 graus** |
| **Encolhimento, agora** | **12,3%** | **11,6%** |

O celular dobrava 1,7 vez mais forte que o desktop. Com o mesmo recuo nas duas
larguras os dois ficavam iguais, em 10,6% e 11,6%, e aí o celular ficou tímido:
ali cabe uma folha e meia na tela, então a dobra não tem companhia para se
comparar e lê mais fraca que a mesma dobra no desktop, onde três folhas aparecem
juntas em profundidades diferentes. Mesma geometria, leitura diferente. O recuo
do celular subiu para 88.

Isso **não reabre a armadilha das duas perspectivas**. Aquela era ruim porque
eram dois botões que se multiplicavam: mexer no ângulo consertava uma largura e
estragava a outra, sem nada avisar. Aqui é um botão só, e ele é exatamente a
quantidade de dobra que se quer em cada largura.

**E a perspectiva é uma só, 1400.** Ela era mais curta no celular por analogia
com a distância do olho à tela, o que soa razoável e some com o controle: com
duas perspectivas, mexer no ângulo conserta uma largura e estraga a outra.

### O sulco da referência corrente

A régua de 3px que marca a linha que está sendo lida. Ela cresce de cima para
baixo, que é o gesto de marcar com o dedo onde se está lendo, e carrega três
decisões que valem registro.

**A duração tem de olhar a ALTURA.** Ela era `--dur-estado`, 200ms, que é a medida
certa para uma cor de botão trocar. Só que este sulco tem a altura da folha
inteira, e no celular isso são uns 600px: crescer 600px em 200ms dá **3180
pixels por segundo**, e o que se vê não é uma régua sendo puxada, é um risco que
aparece. Com `--dur-revelar` ela sai a **1060 px/s** e acompanha a leitura. A mesma
duração em coisas de tamanhos muito diferentes não produz a mesma sensação.

**A CURVA importa mais que a duração aqui**, e foi o que faltou perceber na
primeira tentativa. `--ease-saida` é `cubic-bezier(0.23, 1, 0.32, 1)`: a tangente
inicial dela é 1 dividido por 0,23, ou seja **quatro vezes e meia a velocidade
média**. O que se vê numa régua que cresce não é a média, é o pico do arranque, e
alongar a duração não conserta arranque: só espalha o resto.

`--ease-revelar` é `cubic-bezier(0.25, 0.46, 0.45, 0.94)`, tangente inicial de
menos de dois. Mesma duração, pico duas vezes e meia menor.

| Versão | Média | Pico no arranque |
|---|---|---|
| 200ms, `--ease-saida` | 3180 px/s | **13 826 px/s** |
| 600ms, `--ease-saida` | 1060 px/s | **4609 px/s** |
| 600ms, `--ease-revelar` | 1060 px/s | **1950 px/s** |

**A DURAÇÃO É POR FAIXA DE TELA**, porque a folha muda de altura entre elas e o que
tem de ficar igual é a VELOCIDADE, não o tempo. Com 600ms para todo mundo, a régua
do desktop andava 583 px/s contra 1060 do celular: quase metade, e o que era calmo
num virava arrastado no outro.

O encurtamento mora em **64rem**, e não em 48. É em 64 que a prova sai de baixo do
texto e vai para a coluna ao lado, e é só aí que a folha encurta de verdade:

| Viewport | Altura da folha | Entrada | Velocidade |
|---|---|---|---|
| 390 | 582 a 636 | 600ms | **970 a 1060 px/s** |
| 800 | 729 a 784 | 600ms | **1215 a 1307 px/s** |
| 1024 | 412 a 521 | 330ms | **1248 a 1579 px/s** |
| 1440 | 352 | 330ms | **1067 px/s** |

Na faixa de 48 a 64rem a folha é MAIS alta que a do celular, porque a tabela
estreita a coluna de texto sem tirar a foto de baixo dele. Encurtar a duração ali
daria 2376 px/s, mais que o dobro do alvo.

**O SULCO ANDA NO SENTIDO DA ROLAGEM**, e a regra que faz isso é uma só: ele fica
ancorado na borda onde a LINHA DE LEITURA está naquele instante. As quatro
combinações caem sozinhas dessa frase.

| Rolagem | Estado | Onde a linha está | Âncora |
|---|---|---|---|
| descendo | acende | entrou pelo topo | **topo**, o traço desce |
| descendo | apaga | está saindo pelo fundo | **fundo**, o traço recolhe para baixo |
| subindo | acende | entrou pelo fundo | **fundo**, o traço sobe |
| subindo | apaga | está saindo pelo topo | **topo**, o traço recolhe para cima |

Acendendo, a âncora é a borda por onde a linha ENTROU; apagando, é a borda por
onde ela vai SAIR. Nos dois casos é onde ela está agora, e por isso o traço nunca
anda contra o dedo. Medido nas duas larguras, varrendo a seção para baixo e para
cima: **16 de 16 transições com a âncora certa**.

**Trocar `transform-origin` aí não dá salto, e isso não é sorte:** no instante em
que a classe muda, a escala está em 0, e o elemento é invisível, ou em 1, e a
matriz é a identidade, que não depende da origem. Fora desses dois instantes a
origem não é tocada. Trocar origem no meio de uma transição, isso sim daria salto.

**A saída é 60% da entrada.** Entrada é o que se olha; saída é o que precisa sair
da frente.

**A opacidade entra junto com a escala.** Só com escala, o primeiro pixel da régua
já chega com a cor cheia, e é esse degrau que se lê como corte.

**As pontas são REDONDAS, e não apagadas.** A primeira tentativa desbotava os
últimos seis por cento de cada ponta num gradiente, e seis por cento de 600px são
**36px**: não é ponta macia, é um quarto da régua lavado. O que se queria era ponta
sem quina, e isso é raio, não gradiente. A régua tem a cor cheia de ponta a ponta e
as extremidades arredondam na própria largura.

### A tira é emendada, e a conta que fecha a emenda

Girar cada folha em torno do próprio centro afasta a borda de baixo de uma da
borda de cima da seguinte. Medido: **63px de fresta**. Uma fresta desse tamanho lê
como buraco, e não como dobra.

Primeiro conserto: o pivo passou a ser a borda virada para a linha de leitura. Sob
perspectiva o ponto da `transform-origin` é **ponto fixo**, e nem o giro nem o
recuo em z o tiram do lugar, então a costura que encosta na folha ativa fica
colada. No celular resolveu, porque só cabem duas folhas na tela. No desktop cabem
três, e entre as duas de baixo, que são inativas, a fresta voltou com **47,8px**.

Conserto de verdade: cada folha é **posta onde a anterior terminou de ser
desenhada**. A âncora é a folha que contém a linha de leitura, que está chapada e
no lugar, e a corrente sai dela para os dois lados. A vizinha da âncora cai sempre
em deslocamento zero, porque a âncora não encolheu, e é por isso que a troca de
referência não dá tranco: a folha que vai virar ativa já chega em zero.

A conta é fechada, e por isso a emenda não sobra nem falta. Com a origem no pivo,
um ponto a `v` pixels dele vai parar, na tela, em

```
(v cos t + y) * p / (p + Z - v sen t)
```

e o próprio pivo em `y * p / (p + Z)`. O `y` necessário para pôr o pivo no lugar
certo sai de dividir pelo segundo, e a borda oposta sai do primeiro.

Isto **é** translação, que foi o que derrubou o avanço do papel. A diferença é que
agora as faixas de marcação saem de `offsetTop`, e não de rect, então deslocar o
desenho não mexe em nada que a ScrollTrigger tenha medido.

Depois: fresta de **0px** no celular e **1,0px** no desktop.

### O alcance da dobra, que quase deixou o efeito invisível

A primeira versão escalava a dobra pela altura da tela. Como a distância é medida
até a CAIXA da folha, e as folhas se encostam, a vizinha da ativa ficava com
**0,16 grau** e a seguinte com **0,55**. Só a quarta chegava a 3,6. Ou seja: o
efeito existia longe, e não onde o olho estava.

O que se vê da planilha é a faixa **abaixo** da linha de leitura, porque acima
dela está a barra. Quem tem de dobrar é a folha que sobe, e ela tem de chegar
chapada. Com o alcance em 320px de rolagem, a vizinha fica em 5,4 graus e a
seguinte nos 11 cheios, e a dobra se vê.

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

### O surgimento, e a alternância que quebra a repetição

A dobra resolveu a folha chegando de repente, mas os pedaços dela continuavam
aparecendo com o peso inteiro assim que cruzavam a borda de baixo. Cada grupo
passou a ter o seu próprio surgimento, preso à rolagem: opacidade mais 20px de
subida, num percurso de 200px, com 70px de atraso de um grupo para o seguinte.

**A folha inteira surge como uma coisa só.** Cabeçalho, texto e prova recebem o
mesmo valor, tirado das bordas desenhadas da própria folha. Medido varrendo a
seção: a diferença de opacidade entre os três grupos é **zero** nas duas larguras.

Isso foi apurado em três rodadas, e cada uma cobrou um pedaço:

1. Eram três grupos com tempos diferentes. No celular texto e prova ficam um
   embaixo do outro, com centros a centenas de pixels de distância, e o que se via
   não eram duas coisas entrando, era a mesma coisa entrando duas vezes.
2. Os dois viraram um bloco, medido pelas bordas. Sobrou o cabeçalho, ainda
   medido pelo próprio centro.
3. E o cabeçalho cobrou o resto. Medido em 1129px de rolagem: a folha 01 estava
   **ativa**, com o corpo em opacidade 1 e o topo dele à vista em y=105, e o
   cabeçalho dela em **zero**. O número da referência, a tulipa e a etapa sumiam
   enquanto a linha estava sendo lida.

A causa é ter duas réguas na mesma folha: o cabeçalho fica no alto dela, então o
centro dele cruza a faixa de saída muito antes do fundo do bloco. Duas medidas
diferentes na mesma coisa sempre acabam discordando; a correção é ter uma só.

Conferido depois: **nenhum texto da folha ativa fica abaixo de 1,00** enquanto está
inteiro dentro da área útil da tela.

**A ordem alterna de uma linha para a outra.** Nas pares a prova vem antes do
texto; nas ímpares é o contrário. A alternância é de POSIÇÃO, e não de tempo:
é ela que quebra a repetição entre as quatro linhas. No desktop isso é troca
de coluna, 4 e 5; no celular é troca de ordem na coluna única. O cabeçalho fica
sempre em cima, porque ele identifica a linha, e identificação não alterna. A
tulipa também alterna a direção do pouso: de cima nas ímpares, do lado nas pares.

É alternância de dois tempos, o ritmo de página dupla de revista, e não posição
sorteada.

**A janela do surgimento tem de caber acima da linha de leitura**, e esse é o
número que amarra as duas coisas. Se o surgimento ainda estiver correndo quando a
folha cruza a linha, a referência acende com o texto dela translúcido, que é a
mesma queixa de chegar atrasado por outro caminho. Medido com percurso de 260 e
atraso de 110, o último grupo só ficava cheio com o centro em **43% da tela**,
contra a linha em 58%. Com 200 e 70 o pior caso soma 340px contra os 354 que
sobram no celular e os 378 do desktop.

Opacidade mínima por faixa de dez por cento da tela, varrendo a seção:

| Faixa | Celular | Desktop |
|---|---|---|
| 0 a 20% | 0,00 | 0,00 |
| 20 a 30% | 0,41 | 0,00 |
| 30 a 40% | **0,99** | 0,54 |
| 40 a 60% | **1,00** | **1,00** |
| 60 a 70% | 0,71 | 0,79 |
| 70 a 100% | 0,16 a 0 | 0,24 a 0 |

Cheio entre 30% e 60% nas duas larguras, e a linha de leitura está em 58%. Tudo
termina de aparecer antes de virar referência corrente.

**O glifo se desenha.** A tulipa da referência corrente é traçada, e é a única
animação da página que conta o que a referência **é**: tulipa é instrução de
percurso, e vê-la ser traçada é ver a curva ser explicada. Estática ela é um
ícone; traçada ela é um gesto.

`stroke-dasharray` e `stroke-dashoffset` são propriedades **herdadas** em SVG,
então basta escrevê-las no `<svg>` da linha: elas atravessam o `<use>` e chegam às
formas do símbolo. O comprimento vem do símbolo na folha de glifos, com
`getTotalLength`, que funciona ali mesmo sem ele ser desenhado, porque comprimento
de traçado sai do dado do caminho e não do layout.

O número é o **maior pedaço** do glifo, e não a soma deles: um só dasharray vale
para todas as formas, então cada uma se desenha da própria partida e termina
quando o deslocamento chega em dasharray menos o comprimento dela. Com a soma,
tudo já estaria pronto na metade da animação. Medido: 15, 30, 18 e 21 unidades
para as quatro tulipas.

**A opacidade vai nos filhos, nunca na folha.** Opacidade menor que 1 achata o 3D
do elemento: com ela na folha, o `preserve-3d` morre e a prova volta a ficar
colada no papel, sem erro nenhum no console. E o transform vai direto no
elemento, e não por variável herdada do pai, porque variável no pai lida no
transform do filho força recálculo de estilo em todos os filhos a cada quadro.

### Medido depois da dobra

Com a página recarregada em cada largura, varrendo a seção inteira.

| | Celular 390x844 | Desktop 1440x900 |
|---|---|---|
| Uma, e só uma, referência ativa | **219/219** | **132/132** |
| A marcada é a que está sob a linha | **219/219** | **132/132** |
| Contador divergindo | **0** | **0** |
| Ativa com giro, recuo ou deslocamento | **0** | **0** |
| Fresta entre folhas | **0px** | **1,0px** |
| Encolhimento da folha dobrada | **12,3%** | **11,6%** |
| Ângulo máximo | **8,7 graus** | **10,8 graus** |
| Opacidade mínima entre 30% e 70% da tela | **1,00** | **1,00** |
| Tela restante quando o bloco começa a apagar | **174px** | - |
| Diferença de opacidade entre texto e prova | **0** | **0** |
| Transbordo lateral da janela | **0** | **0** |
| Caracteres por linha | **38** (era 22) | inalterado |

Console limpo e rolagem lateral zero nas duas larguras.

### O título tem teto de medida

O `h1` é **"A Melhor Expedição Off-Road para a Sua Turma."**, o do rascunho
original, e ele carrega duas regras de tipografia que valem registro.

**`max-width: 11em`, e em `em` e não em `px`.** `--txt-heroi` é
`clamp(2.5rem, 7vw, 6.25rem)`, ou seja a fonte para de crescer a 1429px de
viewport. A caixa não para: acima disso ela continua acompanhando a tela, e as 45
letras do título passam a caber numa linha só. Linha de display de mil e
quatrocentos pixels não se lê de uma olhada, e ao lado de um parágrafo de apoio de
479px o contraste de medida vira desalinho.

Onze é a largura que o título já tinha a 1440, onde ele quebrava em duas linhas
sozinho: o teto não inventa desenho novo, estende para as telas maiores o que a
página já fazia. Em `em`, ele encolhe junto com a fonte e no celular nunca chega a
valer, porque a caixa ali é menor que ele.

| Viewport | Linhas | Largura do título |
|---|---|---|
| 390 | 3 | 350, o teto não vale |
| 1440 | 2 | 1082 |
| 1920 | 2 | **1100**, era 1562 |
| 2560 | 2 | **1100**, era uma linha só |

`text-wrap: balance` reparte as duas linhas, mas sozinho não resolvia nada aqui:
ele reparte linhas que existem, e se o texto cabe numa linha só não há o que
repartir. Quem cria a segunda linha é o teto.

**E "Off-Road" não parte.** O hífen é ponto de quebra como qualquer outro, e a
1440 a linha caía exatamente ali: "A Melhor Expedição Off-" numa linha e "Road
para a Sua Turma." na outra. Em tipo de cem pixels isso lê como erro de revisão.
`.nao-quebra { white-space: nowrap }` cobre só esse treçho: aqui não se manda onde
quebrar, só se proíbe o único lugar onde não pode. **Não existe um `<br>` em toda
esta página**, porque quebra de mão vale numa largura e mente em todas as outras.
Conferido em nove larguras, de 1200 a 320: em nenhuma o hífen parte.

### A logo leva ao topo, e leva sem script

O `href` dela é **`#top`**, e não o id de nenhum elemento. Fragmento vazio ou
"top" é o topo do documento pela especificação de HTML, sem precisar de âncora
nenhuma.

Isso é conserto de um defeito silencioso: o destino era `#topo`, que é o id do
próprio `<header class="barra">`, e essa barra é `position: fixed`. Saltar para um
elemento fixo não rola nada, porque ele já está em vista. Medido, partindo de
3000px: com `#topo` a página fica em **3000**; com `#top` vai a **0**. O caminho
sem script, que o comentário do HTML prometia desde sempre, não existia.

O bloco que troca o salto pela viagem com inércia é a **seção 3** do
[main.js](src/js/main.js), logo depois da inicialização do GSAP e do Lenis. Ele era
a penúltima seção, e ali qualquer exceção no mapa, nas provas ao vento ou na
planilha abortava a função inteira antes de o ouvinte ser ligado: a navegação
morria por causa de um defeito numa animação. Agora só depende do que vem antes
dele, que são as duas coisas de que ele precisa.

### Sem JavaScript, e sob movimento reduzido

O bloco inteiro vive dentro de um `matchMedia` com
`prefers-reduced-motion: no-preference`, então sob movimento reduzido nenhum
gatilho é criado e nenhuma classe entra. A planilha aparece completa, com as
quatro referências legíveis do mesmo jeito, que é exatamente o que uma planilha
impressa é. Conferido: as quatro visíveis, nenhuma escondida.

A estrutura é toda CSS. Sticky é uma linha de folha de estilo que sobrevive ao
script falhar; o que o JavaScript acrescenta é a janela **saber** em que
referência ela está, que é o que separa uma tabela de uma navegação.


**A revelação das imagens saiu.** As nove placas entravam com um `clip-path` de
baixo para cima. A imagem só aparecia depois que o visitante já estava olhando
para o lugar dela, e numa página com nove fotos isso vira nove esperas para ver
o que já estava carregado. Foto é prova, e prova não se atrasa. A revelação da
lista de atrito continua: ali é texto avançando linha a linha, não uma imagem
sendo escondida de quem já chegou.

---

## Histórico: o ônibus como recorte de catálogo

Este registro descreve uma exploração visual anterior. O render não é usado pela
página ativa e está em `source-media/`, fora da publicação.

Ele já foi um recorte com alfa, flutuando na banda escura, e as duas queixas do
usuário foram "partes ficaram cortadas e muita rebarba" e "a integração não ficou
nem um pouco boa". As duas têm a mesma raiz, e a raiz não era de posicionamento.

**O `docs/design/DESIGN.md` deste projeto proíbe render de produto**, com todas as
letras: *"no illustrations, no product renders, no abstract graphics. The only
non-photographic visual is simple line-drawn icon badges"*. Um render solto lia
como colagem porque **é** corpo estranho ao sistema, em qualquer lugar onde
fosse posto.

A saída não é esconder que é render: é **assumir que é impresso**. Recorte de
catálogo pregado na página é vocabulário que a página já fala, porque o sistema
dela é de zine, com fotos inclinadas espalhadas sobre a banda escura. E isso
resolve os quatro defeitos de uma vez:

| Defeito | Some porque |
|---|---|
| Rebarba | **não há mais alfa**: o papel fica, então não há silhueta para recortar |
| Partes cortadas | idem: nenhuma erosão, nenhum limiar mordendo a carroceria |
| Traseira cortada | recorte é cortado. A tesoura passa pelo veículo, e é isso que recorte é |
| Colagem | ele deixa de ser render solto e vira objeto de papel sobre a página |

### O papel é o papel DA PÁGINA

O fundo do render foi **retonalizado para `#DDE2E4`**, que é o `--fundo` das
seções claras. O recorte passa a ser feito do mesmo material que o resto da
página, em vez de um retângulo de branco de estúdio furando a banda escura.

A conta é uma mistura contínua, e é por isso que não há borda para serrilhar:

```
t = rampa de min(rgb) entre 200 e 249
saída = mistura(original, papel, t)
```

A carroceria toda está abaixo de 197 e não é tocada; o fundo está acima de 249 e
vira papel inteiro; os pixels de antisserrilhado do contorno recebem mistura
parcial, que é exatamente o que antisserrilhado deve receber.

**Sem máscara, sem erosão, sem desfoque, sem transparência.** Medido contra a
silhueta do original, linha a linha: a diferença é de **até 2,3px** no corpo do
veículo, contra 3 a 48px que a versão com erosão comia. O que encolhe são até
42px da cauda fraca da sombra de chão, e isso é consequência da escolha, não
defeito: o papel é mais escuro que o branco do render, e sobra menos faixa para
segurar um degradê.

Sem alfa, o arquivo volta a ser o trio normal da página: **avif 53KB, webp 67KB,
jpg 145KB**, em vez do PNG de 287KB.

### O corte e a apresentação

Margem de papel em cima, embaixo e à esquerda; **à direita o corte é rente**, no
ponto em que o render acaba, para papel e veículo terminarem juntos.

Ele reusa a `.placa`, que é o componente de foto da própria página, com
`.placa--recorte`: inclinação de 3 graus, dentro da faixa que o sistema declara,
e sombra quase preta, porque sombra da paleta sobre banda escura não existe.

**A inclinação é pequena porque a caixa é larga.** Girar 1088px em 3 graus já joga
18px para cada lado, e é o respiro lateral da seção que absorve isso. Por isso a
entrada anima **só rotação e subida**, sem deslocamento lateral: somar
deslocamento por cima estouraria a conta e devolveria rolagem lateral. O ângulo de
repouso aparece nos dois valores do tween porque GSAP escreve a transform inteira,
e animar só o ângulo de entrada apagaria os 3 graus da folha de estilo.

**É render, e não fotografia.** A página é construída em cima de não afirmar o que
ninguém conferiu, então vale o registro: ele ilustra uma promessa que a cópia já
faz em texto, no escopo, e é o veículo da própria empresa. O `alt` descreve o
veículo sem chamá-lo de foto.

---

## As provas ao vento

**Sete** provas começam como um leque de baralho na mão. Conforme a seção passa,
a primeira puxa, e as outras vão atrás pela mesma pista, que endireita e some.

### A pista: arco, transição, reta

A pista é uma só, contínua, com três trechos, e as cinco provas são pontos sobre
ela separados por um passo de percurso. A primeira puxa.

```
       arco               clotoide             reta
  (raio constante R)     (transição)          (saída)
   curvatura 1/R    →    1/R até 0     →    curvatura 0
   [as 5 paradas]         [o voo]         [some da tela]
```

A curva que liga um arco de raio constante a uma reta **sem salto de curvatura**
é a clotoide, a espiral de Euler. É exatamente para isso que ela existe na
engenharia de estradas. Numa página sobre trilha de serra, a curva do desenho e
a curva da estrada são a mesma.

**A pista sai de integrar a curvatura**, e não de emendar fórmulas. Definido o
perfil de curvatura ao longo do comprimento de arco, saem a direção e a posição:

```
θ(s) = θ₀ - ∫ K(s) ds       x(s) = ∫ cos θ ds       y(s) = ∫ sen θ ds
```

Assim a junta entre o arco e a clotoide é contínua **por construção**: `K` é
contínua, logo `θ` é contínua e a posição é suave. Medido, o maior salto de
curvatura ao longo de toda a pista é **0,02 grau**. E o trecho de curvatura
caindo linearmente com o arco não é aproximação da clotoide: é a definição dela.

A tabela guarda **três** valores por ponto, e o terceiro é o ângulo da tangente.
É dele que sai a rotação de cada prova durante o voo, então as cinco viram juntas
com o caminho, sem nenhuma curva de rotação escrita à parte.

### O número que derrubou as versões anteriores

**As cinco fotos somam 46% da área da tela**, 172px cada numa tela de 390×844.
Cinco objetos desse tamanho não podem ficar **separados** perto do centro.

A roseta de raios, o anel de raio 1,25, o desvio constante sobre a espiral e o
álbum no miolo da espiral: todas tentaram separá-las e todas bateram nessa
parede.

### O repouso é um espalhado de mesa

Fotos jogadas numa mesa não formam progressão nenhuma: cada uma cai num lugar e
num ângulo que não têm relação com a vizinha. Três vetores constantes fazem isso,
deslocando cada prova em relação à pista e torcendo o ângulo dela.

**O desvio é constante, e é isso que o torna seguro.** Desvio constante faz cada
prova andar numa paralela da pista, e paralelas só se cruzam se o desvio passar
do raio de curvatura. Aqui o raio é 0,9 da largura da pilha e o maior desvio é
0,66. Foi esta conta que faltou quando a pista era a espiral de Euler: lá o miolo
tem raio pequeno, as paralelas se cruzavam mesmo, e o pico de sobreposição foi a
100%.

**Os números saem de busca, e a busca é construída, não sorteada solta.** Sortear
cinco deslocamentos livres quase nunca dá um monte bom: de trinta mil tentativas,
vinte e três mil estouravam a tela e sobravam três. O que funciona é sortear em
volta de uma FORMA, as cinco num anel achatado de raio variável com o ângulo de
cada uma jogado para os lados. Anel porque é assim que coisa jogada numa mesa se
acomoda, e irregular porque mesa não tem simetria.

Cada candidato é avaliado por cobertura real de polígono, com a ordem de pintura,
e a nota mistura a **pior** prova com o **desvio padrão** entre elas: adianta
pouco ter uma a 100% e outra a 20%.

**E há um filtro que quase passou batido: o espalhamento dos ângulos.** Uma
primeira busca otimizou só visibilidade e devolveu as cinco quase em pé, com 1,
-6, 0, -6 e -3 graus. Media ótimo e lia como pilha arrumada. Girar carta cobre
mais área, então a busca sozinha sempre prefere não girar; exigir 36 graus entre
a mais torta e a mais reta é o que devolve o desleixo.

| | Sorteio solto | Anel, sem filtro de ângulo | Anel com o filtro |
|---|---|---|---|
| Pior prova visível | 43% | 59% | **52%** |
| Espalhamento angular | 37° | 27° | **44°** |

Antes disto o repouso foi um **leque de baralho**: arco fechado, 12 graus entre
cartas, inclinações em progressão exata. Media bem, com 24% na pior prova, e lia
como mão de cartas, que não era o pedido.

### O monte nasce centrado

A pista começa em (0,0) e o arco corre todo para um lado, então o monte ficava
deslocado: medido, **119px à direita** do centro da célula numa tela de 1440.

A correção é o **retângulo envolvente das cartas já giradas**, e não o centroide
dos centros. Os dois só coincidem se todas tiverem a mesma inclinação, e a graça
do espalhado é que não têm: centrar pelo centroide ainda deixava 45px de sobra.
Com a caixa, o desvio é **0 nos dois eixos**.

Junto com isso saiu a `ALTURA`, uma subida constante de 0,20 da largura que
existia para a roseta do modelo antigo não encostar no painel de preço. O monte
de agora nasce centrado e é mais largo e mais baixo, então a subida só servia
para desalinhar.

### O atraso, e a rotação congelada

**As cinco não partem juntas.** A primeira sai, e cada uma das outras espera a
vez: 0,10 do percurso entre uma saída e a seguinte, então a última arranca aos
40% e ainda tem 60% de percurso pela frente. É o atraso que dá a leitura de "uma
puxa a outra" em vez de "o monte inteiro escorregou".

O progresso de cada prova **não tem limite em cima**, de propósito. Se fosse
travado em 1, as cinco terminariam à mesma distância do ponto de partida delas e
se reencontrariam amontoadas no fim da pista. Sem trava, quem saiu antes continua
andando: medido, as distâncias percorridas são 990, 867, 747, 633 e 531px, em
ordem.

**A prova não gira durante o voo.** Ela sai com a inclinação com que estava na
mesa e chega com a mesma, que é como papel levado de chapa se comporta: muda de
lugar, não de eixo. Antes a rotação era a tangente da pista, então as cinco
viravam junto com a curva, 89 graus ao longo do percurso, e ficava pião.

A tangente continua servindo para uma coisa só: **desenhar o repouso**, uma vez.
Depois disso o número fica parado. Medido, o giro máximo de qualquer prova ao
longo de todo o voo é **0 grau**.

Isto substituiu um passo que crescia durante o voo. O passo crescente resolvia a
sobreposição sem atraso nenhum, e o conjunto partia num bloco só.

### O tamanho tem teto, e o teto é a tela

A prova é desenhada a **0,80** do tamanho natural, e o número mora num lugar só,
porque aparecia solto no cálculo do centro e no desenho.

Cinco fotos de lado S numa tela de 390 não têm como aparecer inteiras: quanto
maior S, mais uma cobre a outra. Medido, com o melhor espalhado que a busca acha
para **cada** tamanho:

| Tamanho | Pior prova visível |
|---|---|
| 0,72 | 55% |
| 0,76 | 40% |
| **0,80** | **37%** |
| 0,84 | 33% |

0,80 é onde o aumento ainda se vê e a prova mais coberta ainda mostra mais de um
terço de si. Trocar de tamanho obriga a refazer a busca do espalhado: os desvios
achados para 0,72 deixavam o monte com 410px numa tela de 390.

### Medidas

| | Celular de 390 | Desktop de 1440 |
|---|---|---|
| Foto na tela | **223px** | **361px** |
| Desvio do centro da célula | **0, 0** | **0, 0** |
| Monte em repouso | **365 × 309px** | **591 × 501px** |
| Área visível de cada prova | **100, 46, 39, 37, 35%** | **100, 42, 35, 33, 39%** |
| Menor prova visível | **35%** | **33%** |
| Inclinações em repouso | **-18, 22, 20, -6, -8 graus** | as mesmas |
| Giro ao longo do voo | **0 grau** | **0 grau** |
| Saídas, em progresso | **0,01 / 0,11 / 0,21 / 0,31 / 0,41** | as mesmas |
| Giro do caminho | **-107 graus** | os mesmos |
| Fora da tela | **0** | **0** |
| Folga até o painel de preço | **74px** | **79px** |
| Invasão do painel | **nenhuma** | **nenhuma** |
| Mergulho abaixo da partida | **0** | **0** |
| Tela livre a partir de | **65% do percurso** | **60%** |
| Janela de rolagem | **953px** | **1346px** |
| Movimento por pixel rolado | **1,14** | **1,30** |
| Rolagem lateral | **0** | **0** |

A janela encurtou de 1897 para 952px no celular, e é isso que acelerou o voo:
com `scrub`, velocidade é movimento por pixel rolado e não duração. O movimento
saiu de 0,44 e chegou a 1,14, quase três vezes.

O avanço de cada prova precisou encolher junto com a entrada do atraso, e a conta
é direta: **quem sai primeiro anda AVANCO dividido por DURACAO, não AVANCO**. Com
o valor antigo a líder passou a percorrer 7 larguras e o voo saltou para 1,60 sem
ninguém pedir.

No desktop a janela precisou de 1346px em vez dos 986 que a mesma regra dava,
porque lá a pilha é maior e a mesma pista em frações da largura vira mais pixels.

### O gatilho, e por que o fim anda junto com o começo

`start: 'center X%'` dispara quando o CENTRO da pilha chega a X% da altura da
tela, e **quanto maior a porcentagem, mais cedo dispara**, porque o centro chega
antes a um ponto mais baixo. Hoje: **90% no desktop, 82% no celular**, os dois
10 acima do que eram.

O fim anda junto, e é isso que segura a velocidade: adiantar só o começo
esticaria a janela em 10% de tela e **desaceleraria** o voo de tabela, sem
ninguém ter pedido. Adiantando os dois, a janela fica onde estava (953 e 1346px)
e o movimento também (1,14 e 1,30).

O progresso do voo nos momentos que o visitante atravessa:

| Momento | Celular | Desktop |
|---|---|---|
| O monte entra pela borda de baixo | 0 | 0 |
| O monte inteiro cabe na tela | **0** | **0,119** |
| O monte fica centralizado | **0,284** | **0,267** |

No celular o álbum é visto inteiro e parado antes de qualquer coisa se mexer. No
desktop não: quando o monte inteiro cabe na tela o voo já está em 12%, com a
primeira prova 211px adiante. É consequência do tamanho, não do gatilho, porque o
monte tem 501px de altura numa tela de 900 e o gatilho olha o centro da pilha,
que é uma caixa menor que ele. Já era assim antes desta rodada, em 5%.

**O que o espalhado custou:** as provas deixaram de percorrer exatamente a mesma
trilha. As duas primeiras ficam a 17 e 15px da trilha da líder, mas a quarta
chega a 153px, ou 0,7 da largura da pilha. É o preço direto de espalhar o
repouso: os desvios que abrem o monte também afastam as trajetórias. Continua
lendo como fila, mas não é mais uma pista única no sentido estrito.

### Cinco versões enterradas antes desta

Ficam registradas porque tentativa abandonada sem registro é tentativa que se
repete.

| Versão | Por que morreu |
|---|---|
| **Baralho sendo dado**, carta de cima saindo com fade | Apagar provas numa página que precisa mostrar o que vende é caro. |
| **Órbita de raio fixo** | Media bem (percurso de 111px, curvatura 17,2%) e estava errada na origem: raio fixo nunca abre. Sem espalhar não há rajada, há carrossel. Métrica boa não salva modelo errado. |
| **Anel de raio 1,25** da largura da pilha | Garantiu que nenhuma prova encostasse na outra e destruiu o começo: as cinco já apareciam esparramadas antes de o visitante chegar. O pedido não era anel, era álbum, e álbum se cobre. |
| **Espiral de Euler com uma cópia da curva por prova** | O laço volta por cima do ponto de partida, então uma prova no fim do laço reencontrava outra ainda parada. 100% de sobreposição. Varridas as 120 ordens de saída vezes sete intervalos vezes seis elevações: o melhor caso era 66%, igual ao álbum parado. Não era ajuste, era modelo. |
| **Álbum no miolo da espiral**, mais desvio constante, mais degrau de tamanho | O raio do miolo cai com 1/(π u), então as provas de trás se apertavam sem limite e a mais funda aparecia 8%. Desvio constante faz paralelas de espiral se cruzarem (pico foi a 100%); degrau de tamanho faz a prova maior engolir a menor (repouso foi a 100%). |


### O corte é do main, não da seção

`body { overflow-x: clip }` existia e **não bastava**: o overflow do body é
propagado para a viewport quando o html está em `visible`, e nessa propagação o
body volta a se comportar como `visible`. Medido com as provas em voo num
aparelho de 390px: `scrollWidth` de **523** contra 390 de tela, e
`window.scrollTo(200, y)` parando em `scrollX = 117`. A página rolava de lado de
verdade.

O corte foi para o `main`, que tem exatamente a largura da tela e não contém
nenhum elemento fixo (a barra, o mapa, o botão e o portão são irmãos dele). Ali
o corte cai na borda da tela, onde ninguém vê corte nenhum.

**Não na seção**, que foi onde este corte morou por um tempo. `.oferta` tem 960px
no desktop e é placa clara centrada numa página escura, e as provas sobem até
999px acima do topo dela. Uma foto flutuando lá em cima, sobre o escuro, fatiada
por uma linha vertical invisível a 240px da borda da tela lê como defeito.

`clip` e não `hidden`, porque `hidden` criaria contêiner de rolagem, e contêiner
de rolagem no meio da página quebra âncora e `position: sticky` sem avisar. As
folhas do roteiro são sticky e ficam dentro do `main`. Verificado depois da
mudança: continuam grudando em `top: 0`.

### O painel de preço tem camada própria

`position: relative; z-index: 1`. As provas podem cobrir as outras camadas da
página, mas preço coberto por foto é o único lugar onde sobrepor não se discute,
e o começo do voo ainda passa perto dele. Sem essa camada a foto passaria por
cima, porque a pilha é contexto de empilhamento e o painel é bloco comum de
fluxo.

Sob movimento reduzido a classe nunca entra e a grade de três colunas permanece,
com as cinco provas caindo em 3 + 2. Ragged, e correto: é o estado sem animação
nenhuma.

---

## O mapa do percurso

Substituiu o trilho que existia antes. Os dois diziam em que ponto da expedição
o visitante está, e o mapa faz melhor: em vez de um rótulo de etapa, mostra o
caminho inteiro e o quanto dele já passou.

**A geometria é real.** As cinco paradas entram por coordenada de latitude e
longitude projetada, então a curva na tela é a curva verdadeira da viagem:

| Parada | Coordenada |
|---|---|
| Porto Alegre, RS | -30,03 / -51,23 |
| Florianópolis, SC | -27,60 / -48,55 |
| Curitiba, PR | -25,43 / -49,27 |
| São Paulo, SP | -23,55 / -46,63 |
| Serra da Canastra, MG | -20,24 / -46,36 |

O que prova que a geometria é real é o trecho de Florianópolis para Curitiba: a
linha **volta para oeste** enquanto sobe, porque Curitiba (-49,27) fica mesmo a
oeste de Florianópolis (-48,55). Esse recuo é o que faz o traçado ler como rota
e não como rabisco, e ele só existe porque os números não foram inventados.

**As cinco coordenadas são as âncoras; entre elas a estrada serpenteia.** Eram
quatro curvas longas e macias, que liam como cabo esticado. Agora são 18
segmentos com cotovelo, com o desvio perpendicular à perna crescendo até o meio
dela e voltando a zero em cada parada, e amplitude diferente em cada dobra. O
trecho de Curitiba a São Paulo, que é o mais longo, leva cinco dobras. O
comprimento do traçado subiu de 150 para **251 unidades**, e a linha passa a ter
**19 inversões de direção** acima de meio radiano, que é o que uma estrada de
serra faz de verdade.

As paradas continuam exatamente sobre o traçado: medida a distância de cada
círculo à linha, o pior caso é **0,11** de uma caixa de 120 por 160. E as frações
em que elas cravam continuam crescentes, 0, 0,285, 0,465, 0,787 e 1, que é o que
mantém a leitura trocando na ordem certa.

O `.mapa__fantasma`, que é a linha cinza do caminho ainda não percorrido, ganhou
`stroke-linejoin: round`. A rota já tinha; ele não, e com quatro curvas macias
isso não aparecia. Com 18 cotovelos, cada cotovelo virava uma farpa.

**A troca de cor da leitura vale só abaixo de 64rem.** A detecção de superfície é
só vertical, porque a leitura mora num elemento fixo e comparar uma faixa de
rolagem por quadro é barato. No celular isso basta, porque as faixas claras
ocupam a largura da tela. No desktop não: ali o mapa volta para a margem
esquerda, e a leitura ocupa de 64 a 214px de uma tela de 1440 enquanto as duas
faixas claras da página começam em **139** e **235**. Ou seja, a leitura fica
fora das faixas claras, sempre sobre o escuro, enquanto a detecção dizia "papel"
e pintava tinta escura sobre escuro. Desligar é mais honesto que remendar uma
detecção que não tem a informação de que precisaria. O assentamento de sombra,
esse, passou a ser incondicional no desktop, pelo mesmo motivo.

**A viagem acaba quando a cifra entra na tela.** O percurso ia até o fim do
documento, o que punha Minas Gerais depois do rodapé: a linha ainda estava em São
Paulo justamente na hora em que a página pede a decisão.

O primeiro conserto foi terminar no centro do bloco de preço no centro da tela, e
a diferença parecia acadêmica até ser medida: numa tela de 690px de altura, com o
valor inteiro visível e legível, o progresso era **0,985**. A linha estava 98,5%
desenhada, a trilha do destino já tinha aparecido, e Minas **não** tinha cravado.
A leitura ainda dizia São Paulo, e faltavam 101px de rolagem. O visitante chegava
ao preço antes de o mapa chegar ao destino.

Agora o gatilho é a própria cifra, e ela fecha a viagem quando cruza 75% da
altura da tela: o número acabou de entrar, ainda está no terço de baixo, e o mapa
já está inteiro. Daí em diante ele permanece completo enquanto o painel é lido.
Chegar cedo não custa nada; chegar tarde é o defeito.

Medido em 1900x690, 1440x900 e 390x844: com a cifra fora da tela o progresso fica
em 0,97; a 80% da altura, 0,99 e ainda em São Paulo; a 75%, progresso 1, cinco
paradas cravadas e MG na leitura.

**A trilha do destino pergunta pela última parada**, e não por um número solto.
Era `p > 0.985`, e isso abria uma janela entre 0,985 e 0,996 em que o laço
tracejado já estava desenhado e Minas ainda não tinha cravado: o mapa mostrava a
trilha do destino enquanto a leitura dizia São Paulo. Duas contas para o mesmo
instante sempre acabam discordando.

**Como anima.** `stroke-dasharray` com o comprimento total do caminho e
`stroke-dashoffset` indo desse comprimento até zero, amarrado à rolagem do
documento. É o mesmo mecanismo do site de referência. O comprimento é medido com
`getTotalLength` no navegador, porque depende da curva.

Cada parada crava quando a linha chega nela. A ponte entre "coordenada do pino"
e "comprimento percorrido" é feita amostrando o caminho em 200 pontos e achando,
para cada pino, a fração em que a linha passa mais perto dele.

**Sólido é estrada, tracejado é trilha.** A distinção não é textura: são as duas
coisas que a expedição faz, e o tracejado só aparece quando a estrada chega ao
destino.

**A cor não muda mais com a rolagem, e o fundo do mapa é transparente.** As
linhas eram tokens de superfície, e o mapa é fixo: a linha trocava de tom ao
passar por cima de uma faixa de papel, sem que nada tivesse mudado no percurso.

Enquanto o traçado desenhava cru, a cor precisava sobreviver a `#161B13` e a
`#DDE2E4` ao mesmo tempo, e nessa janela estreita só o vermelho do brasão
passava. A primeira tentativa foi uma placa opaca por baixo do mapa, e ela
resolvia a conta criando outro problema: sobre a banda escura chapada era
invisível, mas sobre a **foto do herói** virava um retângulo preto plantado no
meio da imagem. Superfície de página não é a mesma coisa que fundo de página.

A saída é a que a cartografia usa desde sempre: o traço carrega o próprio
contraste, por um halo escuro. A conta deixa de ser contra o fundo e passa a ser
contra o contorno.

| Elemento | Cor | Sobre o halo |
|---|---|---|
| Percurso feito, paradas, trilha | `#FEF200`, o amarelo do brasão | 15,11:1 |
| Percurso adiante | `#7D7D7D`, neutro | 4,30:1 |

O halo vale para o SVG e para a leitura em mono ao mesmo tempo, porque `filter`
desce por toda a subárvore, e o fundo do mapa volta a ser o que sempre deveria
ter sido: nada.

**A leitura em mono continua trocando de cor com a superfície**, e as linhas não.
Halo resolve traço e não resolve texto: tinta clara contornada sobre papel claro
vira letra vazada, e 11px de mono vazado não se lê. Texto pede 4,5:1, e nenhuma
cor do espectro alcança isso contra `#161B13` e `#DDE2E4` ao mesmo tempo.

**A troca pergunta por região, não por seção.** A primeira versão observava as
duas seções `.papel` e errava num caso real: dentro da oferta existe o
`.painel.tinta`, uma ilha escura dentro do papel, e é bem em cima dela que o
mapa passa no celular. A resposta "estou sobre papel" pintava tinta escura sobre
painel escuro: **2,67:1 e 2,35:1**, contra os 4,5:1 que texto pede. Agora as
regiões são todas as `.papel` e todas as `.tinta` ordenadas por profundidade no
DOM, e a mais interna vence, que é como a cor se comporta de verdade. No mesmo
ponto: 16,17:1 e 8,05:1.

Um gatilho só, e ele não mede nada por quadro: as faixas saem do `refresh`, e a
leitura mora num elemento fixo, então a posição dela na tela não muda com a
rolagem. O que roda a cada quadro é uma comparação de números. Conferido em 26
posições ao longo do documento, nas duas larguras: 26 de 26.

**No celular o mapa fica no canto superior direito.** Embaixo à esquerda ele
dividia a borda de baixo com o botão do WhatsApp, com o polegar passando por
cima dos dois. No desktop continua à esquerda, no meio da altura, onde o layout
do herói já reserva a coluna por padding.

**E no desktop essa coluna passou de 150px para 220px.** 150px de largura para
um viewBox de 120x160 davam um traçado de serra com 18 cotovelos espremidos em
pouco mais de um dedo de tela: a rota lia como um risco tremido e as cinco
paradas ficavam encostadas umas nas outras. No celular o mapa é canto de tela e
precisa ser discreto, mas no desktop ele tem uma coluna inteira reservada só
para ele, e estava usando metade dela. O SVG passou de 150x200 para 220x293, e o
conjunto com a leitura, de 150x232 para 220x340.

O número mora num lugar só, o token `--largura-mapa`, que o `.mapa` do desktop
agora consome em vez de repetir. O recuo do herói e o do rodapé saem dele por
`calc()`, então os dois seguiram sozinhos: 214px de reserva viraram 284px.
Medido a 1440x900 e a 1024x768, que é a largura mais apertada em que a regra de
desktop vale. Em 1024 o título da capa continua em duas linhas com 666px de
medida, o mapa cabe na altura com folga (226 a 566 de 768) e não há rolagem
lateral.

**A leitura ganha uma sombra só, curta e deslocada.** Eram duas, e a segunda
tinha 8px de raio sem deslocamento: isso não é sombra, é brilho em volta da
letra, e brilho em volta da letra é o efeito vazado que não combina com nenhuma
outra tipografia da página.

**A trilha do destino é um laço concêntrico.** Era um lacinho de raio menor que
o do pino, e ele sumia atrás dele: o que sobrava era um arco tracejado
escapando por um lado, que lia como desenho quebrado. Agora ela circunda a
chegada com 1,6 unidade de folga entre o traço e a borda do pino, e o raio
irregular mantém o traço de mão em vez de virar alvo de compasso.

**As paradas são animadas pelo CSS, e antes não eram.** Havia um `gsap.to` por
pino, e ele quebrava o desenho: o GSAP reescreve a origem de transformação de
elementos SVG e essa conta briga com o `transform-box: fill-box` do CSS. O que
saía era `matrix(1,0,0,1,-12,-148)` num pino que mora em (12,148): as cinco
paradas empurradas para o canto do SVG, empilhadas, longe da linha. Era o
"círculo solto no canto sem função". Em CSS puro o pino cresce do próprio
centro; medido em escala 0,1, 0,5 e 1, o desvio é zero nas três.

**Sem silhueta de estado**, como na referência. Mapa mal desenhado do Brasil
seria pior que mapa nenhum; a leitura em mono no canto diz de onde para onde.

---

## Como a página é feita

```
src/                    fonte legível da landing
  index.html            markup, copy e a folha de símbolos SVG
  styles/               CSS por responsabilidade
  js/                   inicialização e recursos de interação
  assets/               fontes e mídia
dist/                   artefato minificado a publicar (gerado)
docs/design/            direção visual e tokens
docs/history/           decisões e histórico de trabalho
scripts/                verificações locais
source-media/           originais — NÃO PUBLICAR
```

**Um relógio só.** Toda animação ligada à rolagem sai do ScrollTrigger. Sem
`animation-timeline`, sem `IntersectionObserver` paralelo, sem ouvinte de
`scroll`. Duas vias para o mesmo efeito é como o site institucional produziu um
bug real, e o `revelar.js` de lá registra isso por extenso.

**Lenis é fonte de rolagem, não segundo relógio.** Ele substitui a rolagem do
navegador e alimenta o mesmo ScrollTrigger, com `autoRaf: false` para o laço de
quadro continuar sendo um só, o do GSAP. `scroll-behavior: smooth` teve de sair
do CSS: com os dois ligados, um link de âncora rola duas vezes e dá solavanco no
meio. No toque o Lenis não suaviza (padrão dele), e sob movimento reduzido nem é
instanciado.

**O CSS entrega a página inteira sozinho.** O JavaScript só adiciona
`.movimento-ativo` no `<html>`, e é essa classe que liga o estado escondido das
revelações. Script que falha perde o efeito e nunca a página.

**Estrutura no CSS, efeito no JavaScript.** O empilhamento das folhas do roteiro
é `position: sticky`, não `pin`. `overflow-x: clip` no `body`, e não `hidden`,
exatamente por isso: `clip` não cria contêiner de rolagem e o sticky sobrevive.

**Vídeo não tem `autoplay`.** Ele pausa ao sair da tela, e sob movimento
reduzido não toca nunca: fica no poster, que é um quadro do próprio vídeo. Laço
decorativo que não pode ser parado é o que a preferência existe para desligar.
A exceção é o loop do herói, que começa a tocar na inicialização porque já nasce
visível; o detalhe está na seção do herói.

---

## Sobre os vídeos

Os dois `.mov` originais somavam 78 MB a 14,7 Mbps e **terminavam num card de
preço de R$ 1.475,00 mais 10x de R$ 449,00**, que contradiz a oferta desta
página. As janelas de loop foram escolhidas para parar bem antes dele:

| Loop | Janela | Conteúdo | MP4 | WebM |
|---|---|---|---|---|
| herói | 8s a 16s | pilotagem em pedra e crista, céu azul | 1,56 MB | 1,35 MB |
| escopo | 2s a 10s | afloramento, vale, crista, manobra | 0,73 MB | 0,80 MB |

Sem áudio, 30 fps, 8 segundos cada.

---

## O que já foi verificado

Medido no navegador, não estimado. Larguras 320, 768 e 1440.

| Verificação | Resultado |
|---|---|
| Contraste nas duas superfícies | 0 reprovações |
| Rolagem horizontal | 0 em todas as larguras |
| Herói na dobra | cabe em 320, 390, 768 e 1440 |
| Rótulo de botão quebrado | 0 |
| Alvo de toque abaixo de 44px | 0 |
| Imagens quebradas | 0, e as 38 referências de asset resolvem |
| Console | sem erros |
| Rede | 0 requisições externas |
| Sem JavaScript | 0 elementos escondidos |
| Mapa acompanha a superfície | tinta, papel, tinta, papel, conferido seção a seção |
| Traçado do mapa | vai de 0% a 100% ao longo da página; as 5 paradas cravam em ordem |
| Leitura do mapa | Porto Alegre, Curitiba, São Paulo, Serra da Canastra, na ordem |
| Mapa e WhatsApp no celular | cantos opostos, sem colisão, conferido em 320 e 375 |
| Lenis | instanciado, `html.lenis`, sem quebrar nenhum gatilho |
| Peso da página inteira, sem vídeo | 1184 KB (teto do plano: 1200; Lenis custou 16 KB) |
| Formato servido | AVIF nas nove fotos |
| Loop do herói | tocando na primeira pintura, sem precisar rolar |
| Foto do herói no celular | **não é baixada**: só o poster e o loop, conferido em carga limpa a 390px |
| Máscaras do herói | 11% de mídia atrás do título, contra 75% antes do ajuste |
| Título do herói | 2 linhas em 390, 768 e 1304; 3 linhas em 320 |

O celular **não baixa a foto do herói**: ela entra por `background-image` dentro
do media query de 64rem, e background em media query que não casa não é buscado.
Conferido na aba de rede.

O detector do `impeccable` reporta 11 avisos. Todos conferidos contra o render:

- `cramped-padding` em `.papel`, `.dor`, `.redes`, `.totais` e `.folha__leitura`:
  medido, o padding é de 96px, 96px, 80px, 24px e 24px contra bordas de 1px.
- `undersized-ui-text` em "R$" e ",50": o detector resolve `em` contra raiz de
  16px em vez do `clamp()` do preço. Na tela são 28,6px e 35,4px.
- `tight-leading`: são os títulos de display, em 0,88 e 0,92. Entrelinha fechada
  em display é a decisão, não o defeito; o piso de 1,3 do detector é regra de
  texto corrido. Os títulos de 36px, onde a cedilha da primeira linha chegava
  perto das maiúsculas da segunda, foram para 1,06.

---

## O que ainda não foi verificado

- **Aparência.** O painel do navegador desta sessão não compõe quadros, então a
  verificação foi toda por medição de valores computados. Geometria, contraste,
  tipografia, carregamento e comportamento estão conferidos; a impressão visual,
  não. Vale abrir e olhar, principalmente a virada de tinta para papel e o
  traçado do mapa se desenhando.
- **A sensação do Lenis.** Que os gatilhos não quebraram está medido; se a
  inércia está no ponto, ou pesada demais, só se sente rolando. O ajuste é o
  `duration: 1.05` em `src/js/main.js`, e desligar tudo é apagar uma linha.
- **O loop dando a volta.** Corte, taxa e formato estão conferidos; o salto na
  emenda do loop só se vê rodando.
- **Movimento reduzido no sistema operacional**, e a página num aparelho real.
