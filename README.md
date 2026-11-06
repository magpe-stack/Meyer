# Meyer – Hub de Calculadoras para Jornalistas

> Manual completo de uso, publicação e manutenção.

O **Meyer** é um aplicativo web (PWA) com **8 calculadoras determinísticas** para o dia a dia da redação. Ele foi criado em homenagem a **Philip Meyer** (1930–2022), pioneiro do *jornalismo de precisão*, que defendia o uso de métodos das ciências sociais e da análise de dados na apuração.

![MeyerCover](./MeyerCover.png)


Cada calculadora mostra o resultado, deixa clara a conta e gera uma **Minuta da Matéria**: um parágrafo pronto para copiar e revisar. Tudo roda no seu aparelho. Nenhum dado digitado é enviado a servidor algum, e o app funciona **offline** depois do primeiro acesso.

| Recurso | Endereço |
|---|---|
| Aplicação (GitHub Pages) | https://magpe-stack.github.io/Meyer/ |
| Repositório | https://github.com/magpe-stack/Meyer |
| Este manual | https://github.com/magpe-stack/Meyer/blob/main/README.md |

---

## Sumário

1. [Primeiros passos](#1-primeiros-passos)
2. [Conhecendo a interface](#2-conhecendo-a-interface)
3. [Como digitar números](#3-como-digitar-números)
4. [As 8 calculadoras](#4-as-8-calculadoras)
5. [Minuta da Matéria e botão Copiar](#5-minuta-da-matéria-e-botão-copiar)
6. [Tema claro e escuro](#6-tema-claro-e-escuro)
7. [Instalar como aplicativo e usar offline](#7-instalar-como-aplicativo-e-usar-offline)
8. [Acessibilidade e teclado](#8-acessibilidade-e-teclado)
9. [Boas práticas jornalísticas](#9-boas-práticas-jornalísticas)
10. [Publicação no GitHub Pages](#10-publicação-no-github-pages)
11. [Estrutura do projeto](#11-estrutura-do-projeto)
12. [Guia para quem mantém o código](#12-guia-para-quem-mantém-o-código)
13. [Solução de problemas](#13-solução-de-problemas)
14. [Perguntas frequentes](#14-perguntas-frequentes)
15. [Créditos](#15-créditos)

---

## 1. Primeiros passos

1. Abra https://magpe-stack.github.io/Meyer/ no navegador (computador ou celular).
2. Aguarde a **abertura** (splash screen) de 3 segundos.
3. Toque no botão **☰ Menu**, no canto superior esquerdo.
4. Escolha uma das 8 calculadoras.
5. Preencha os campos e toque em **Calcular**.
6. Leia o resultado e, se quiser, copie a **Minuta da Matéria**.

---

## 2. Conhecendo a interface

### Cabeçalho

| Elemento | Função |
|---|---|
| **☰ Menu** | Abre a gaveta (menu sanfona) com as 8 calculadoras. É o **único** lugar onde se escolhe a ferramenta. |
| **Meyer** (logotipo) | Identidade do app. |
| **GitHub** | Abre o repositório em nova aba. |
| **Ajuda** | Abre este manual (README) em nova aba. |
| **Sobre** | Abre uma janela com informações sobre Philip Meyer e o propósito do app. |
| **Escuro / Claro** | Alterna o tema. A escolha fica salva no aparelho. |

Em telas pequenas, os botões do cabeçalho mostram só os ícones; em telas maiores, mostram também o texto.

### Menu sanfona

Ao abrir o menu, aparece uma gaveta lateral com as 8 calculadoras, cada uma com seu ícone. A calculadora ativa fica destacada. Ao escolher uma, o menu fecha e a ferramenta aparece no painel principal.

Para fechar o menu sem escolher nada: toque no **X**, toque fora da gaveta ou pressione **Esc**.

### Painel principal

Mostra o título da calculadora, uma breve descrição, o formulário e, depois de calcular, duas áreas:

- **Resultado**: os números calculados, mais observações de cuidado quando necessário.
- **Minuta da Matéria**: texto pronto, com botão **Copiar texto**.

O botão **Limpar** apaga os campos e o resultado (o campo "Base" da calculadora 2 volta ao padrão de 100.000).

---

## 3. Como digitar números

O Meyer entende números no formato brasileiro e também no formato com ponto decimal:

| Você digita | O app entende |
|---|---|
| `12,5` | 12,5 |
| `12.5` | 12,5 |
| `1.234,56` | 1234,56 (ponto é milhar quando há vírgula) |
| `R$ 2.500.000` | 2500000 (símbolo "R$" e espaços são ignorados) |
| `15%` | 15 (o símbolo "%" é ignorado) |
| `1.234` | **1,234** (sem vírgula, o ponto é sempre decimal) |

**Atenção:** `1.234` sem vírgula é lido como 1,234, e não como mil duzentos e trinta e quatro. Para números inteiros grandes, digite sem separador de milhar (`1234`) ou use a vírgula (`1.234,00`).

Se um campo estiver vazio ou com texto inválido, o app mostra um aviso em vermelho dizendo qual campo corrigir. Divisões por zero também geram avisos, e o app não trava.

---

## 4. As 8 calculadoras

### 4.1 Variação percentual e pontos percentuais

**Para que serve:** comparar um valor inicial (A) com um valor final (B) e não confundir *por cento* com *pontos percentuais*.

**Campos:** Valor inicial (A) e Valor final (B).

**Fórmulas:**

- Variação percentual = (B − A) ÷ |A| × 100
- Diferença em pontos percentuais (pp) = B − A

**Exemplo:** A = 12,5 e B = 15.

- Variação percentual: **+20%**
- Diferença: **+2,5 pp**
- Minuta: "O valor passou de 12,5 para 15, um aumento de 20%. Se os dois números forem percentuais ou taxas, a diferença é de 2,5 ponto(s) percentual(is), e não de 20%."

**Quando usar cada termo:**

- *Pontos percentuais* servem quando A e B são, eles mesmos, percentuais ou taxas. Exemplo: o desemprego foi de 8% para 10%, uma alta de **2 pp** (e de 25% em termos relativos).
- *Por cento* serve para a variação relativa entre dois valores quaisquer, como o número de casos de 200 para 250 (+25%).

**Casos especiais:** se A for zero, a variação percentual é *indefinida*, e o app avisa; a diferença absoluta continua sendo mostrada. Se A for igual a B, o texto indica estabilidade.

---

### 4.2 Conversor de taxa per capita (normalização)

**Para que serve:** comparar locais de tamanhos diferentes. Uma cidade com 320 ocorrências não é necessariamente mais violenta que outra com 150, e a taxa por habitante mostra a proporção.

**Campos:** Total de ocorrências, População total e Base (padrão: 100.000 habitantes).

**Fórmula:** Taxa = (ocorrências ÷ população) × base

**Exemplo:** 320 ocorrências, população de 850.000, base de 100.000.

- Taxa: **37,65 por 100.000 habitantes**
- Minuta: "Foram registradas 320 ocorrências em uma população de 850.000 habitantes, o que equivale a uma taxa de 37,65 por 100.000 habitantes."

**Dicas:** use sempre a mesma base e o mesmo período ao comparar locais; a base pode ser alterada (1.000, 10.000, 100.000 etc.).

---

### 4.3 Conversor de unidades orçamentárias

**Para que serve:** dar dimensão a valores em reais, traduzindo-os em salários mínimos e cestas básicas.

**Campos:** Orçamento (R$), Salário mínimo (R$) e Cesta básica (R$).

**Fórmulas:** Salários mínimos = orçamento ÷ salário mínimo; Cestas básicas = orçamento ÷ valor da cesta.

**Exemplo (valores hipotéticos):** orçamento de R$ 2.500.000, salário mínimo de R$ 1.500 e cesta básica de R$ 800.

- Salários mínimos: **1.666,67**
- Cestas básicas: **3.125**

**Importante:** o app **não traz** valores de salário mínimo ou cesta básica; você informa os vigentes na data da matéria. Cite a fonte (por exemplo, a norma do salário mínimo e a pesquisa do Dieese para a capital escolhida).

---

### 4.4 Estatística descritiva (média e mediana)

**Para que serve:** resumir uma lista de números: salários, preços, notas, tempos de espera.

**Campo:** uma caixa de texto onde você cola os números, **um por linha** ou separados por espaço ou ponto e vírgula. A vírgula é tratada como decimal.

**Resultados:** N (quantidade), média, mediana, mínimo, máximo e amplitude (máximo − mínimo).

**Exemplo:** `1200; 1350,50; 980; 2100`

| Medida | Valor |
|---|---|
| N | 4 |
| Média | 1.407,63 |
| Mediana | 1.275,25 |
| Mínimo | 980 |
| Máximo | 2.100 |
| Amplitude | 1.120 |

**Como interpretar:**

- A **média** é sensível a valores extremos; a **mediana** (valor central) não é.
- Quando média e mediana ficam muito distantes, o app sugere cuidado, e muitas vezes a mediana descreve melhor o "típico".
- Itens que não são números são ignorados, e o app informa quantos foram descartados.

---

### 4.5 Regra de três simples

**Para que serve:** proporções diretas: "se A corresponde a B, quanto corresponde C?".

**Campos:** A, B e C.

**Fórmulas:** X = (B × C) ÷ A; porcentagem relativa = C ÷ A × 100.

**Exemplo:** A = 200, B = 50, C = 1.000.

- X = **250**
- C equivale a **500%** de A.
- Minuta: "Se 200 corresponde a 50, então 1.000 corresponde a 250. O valor C equivale a 500% de A."

**Cuidado:** a regra de três simples supõe proporcionalidade direta. Ela não vale quando a relação é inversa ou não linear. O valor A não pode ser zero.

---

### 4.6 Densidade demográfica

**Para que serve:** relacionar população e território.

**Campos:** População total e Área (km²).

**Fórmulas:** hab/km² = população ÷ área; m²/hab = (área × 1.000.000) ÷ população.

**Exemplo:** 12.300.000 habitantes em 1.521 km².

- Densidade: **8.086,79 hab/km²**
- Espaço por habitante: **123,66 m²/hab**

**Cuidado:** densidade é uma média. Bairros centrais e periféricos podem ter valores muito diferentes dentro do mesmo município.

---

### 4.7 Equivalência por hectares e campos de futebol

**Para que serve:** dar escala a áreas (desmatamento, queimadas, terrenos, parques).

**Campos:** Área e Unidade (m² ou km²).

**Fórmulas:** 1 ha = 10.000 m²; 1 km² = 1.000.000 m²; campo de futebol FIFA = **7.140 m²** (padrão de 105 m × 68 m).

**Exemplo:** 250.000 m².

- Hectares: **25 ha**
- Campos de futebol: **35** (aproximadamente 35,0)

**Dica:** a medida de "campos de futebol" é uma analogia e não substitui a unidade oficial. Cite sempre o valor em hectares ou km².

---

### 4.8 Estimador de público por metro quadrado

**Para que serve:** estimar o público de atos, shows e manifestações a partir da área ocupada. É uma **estimativa**, não uma contagem.

**Campos:** Área ocupada (m²) e Densidade, escolhida em uma lista com rótulos:

| Densidade | Descrição |
|---|---|
| 1 pessoa/m² | Muito espaçado |
| 2 pessoas/m² | Folgado, dá para circular |
| 3 pessoas/m² | Moderado, pessoas próximas |
| 4 pessoas/m² | Cheio, circulação difícil |
| 5 pessoas/m² | Muito cheio, ombro a ombro |
| 6 pessoas/m² | Extremamente lotado, risco |

**Fórmula:** público = área × densidade (arredondado).

**Exemplo:** 8.000 m² com 4 pessoas/m² = **32.000 pessoas**.

**Boas práticas:**

- Meça apenas a área **realmente ocupada**: descontando palcos, banheiros, barracas e áreas vazias.
- Informe no texto o método e a densidade adotada.
- Registre fontes concorrentes (organizadores, polícia, institutos) e deixe claro quando a estimativa é sua.

---

## 5. Minuta da Matéria e botão Copiar

Depois de cada cálculo bem-sucedido, o app gera um parágrafo em português com os números já formatados no padrão brasileiro (milhar com ponto, decimal com vírgula).

- Toque em **Copiar texto** para levar o parágrafo à área de transferência. A mensagem "Texto copiado!" confirma a ação.
- Se o navegador bloquear a cópia automática, o texto está em uma caixa selecionável e você pode copiá-lo manualmente.
- A minuta é um **ponto de partida**: revise, ajuste o estilo da redação e confira as fontes antes de publicar.

---

## 6. Tema claro e escuro

O app abre no **tema claro** (padrão). O botão **Escuro/Claro** no cabeçalho alterna o tema, e a preferência fica guardada no `localStorage` do navegador, valendo nas próximas visitas.

| | Tema Claro | Tema Escuro ("Dark Newsroom") |
|---|---|---|
| Fundo | `#FFFFFF` | `#10141D` |
| Texto | `#10141D` | `#FFFFFF` |
| Destaques | `#0040FF`, `#4000FF` | `#B3F0FF`, `#E4C83F`, `#AEE43F` |

A paleta segue o Estudo de Cores Itten do Projeto Meyer, com contrastes pensados para os níveis AA/AAA da WCAG.

> Se você limpar os dados do site no navegador, o tema volta ao padrão claro.

---

## 7. Instalar como aplicativo e usar offline

O Meyer é um **PWA** (Progressive Web App):

- **No computador (Chrome/Edge):** clique no ícone de instalação na barra de endereço ou use o menu do navegador, em "Instalar Meyer".
- **No Android (Chrome):** menu ⋮ → "Instalar app" ou "Adicionar à tela inicial".
- **No iPhone/iPad (Safari):** botão Compartilhar → "Adicionar à Tela de Início".

**Offline:** na primeira visita com internet, o Service Worker guarda todos os arquivos no aparelho. Depois disso, o app abre e calcula **sem conexão**. Os links GitHub e Ajuda, que apontam para a web, só funcionam com internet.

**Atualizações:** quando uma nova versão é publicada, o navegador a baixa em segundo plano e passa a usá-la na visita seguinte. Se algo parecer desatualizado, feche e reabra o app (ou recarregue a página duas vezes).

---

## 8. Acessibilidade e teclado

O Meyer foi construído com atenção às diretrizes WCAG AA/AAA:

- Cores de alto contraste nos dois temas.
- Foco visível em todos os controles.
- Alvos de toque de pelo menos 44 px.
- Rótulos associados a todos os campos, com dicas lidas por leitores de tela (`aria-describedby`).
- Menu com `aria-expanded` e `aria-controls`; resultados e mensagens em regiões `aria-live="polite"`; avisos de erro com `role="alert"`.
- Link "Pular para o conteúdo" no início da página.
- Animações reduzidas quando o sistema operacional pede menos movimento.

### Atalhos de teclado

| Tecla | O que faz |
|---|---|
| `Tab` / `Shift+Tab` | Avança / volta entre os controles (dentro do menu aberto, o foco fica preso na gaveta). |
| `Enter` ou `Espaço` | Aciona o botão em foco (abrir menu, escolher calculadora, Calcular, Copiar). |
| `Enter` num campo | Envia o formulário e calcula. |
| `Esc` | Fecha o menu sanfona ou o modal "Sobre". |

---

## 9. Boas práticas jornalísticas

1. **A ferramenta calcula; a apuração é sua.** Confira os dados de origem antes de digitar.
2. **Cite fontes e datas** de todos os números usados, principalmente salário mínimo, cesta básica, população e área.
3. **Use a unidade certa:** "pontos percentuais" para diferença entre taxas; "por cento" para variação relativa.
4. **Normalize antes de comparar:** compare taxas por habitante, e não totais brutos, entre locais de tamanhos diferentes.
5. **Prefira a mediana** quando houver valores muito altos ou muito baixos distorcendo a média.
6. **Descreva o método** nas estimativas (público, densidade) e não as apresente como contagem exata.
7. **Arredonde com critério:** os números exibidos já estão arredondados; mantenha a mesma precisão em todo o texto.
8. **Revise a minuta:** ela é um rascunho pensado para ser adaptado ao estilo do veículo.

---

## 10. Publicação no GitHub Pages

Pré-requisitos: os 7 arquivos abaixo na **raiz** do repositório (`main`):

```
index.html   styles.css   app.js   sw.js   manifest.json   icon-192.png   icon-512.png
```

Passo a passo:

1. Envie os arquivos para o repositório `magpe-stack/Meyer` (pela interface web: **Add file → Upload files**, ou por `git`).
2. No GitHub, vá em **Settings → Pages**.
3. Em **Build and deployment**, escolha **Deploy from a branch**.
4. Selecione a branch **main** e a pasta **/ (root)**; clique em **Save**.
5. Aguarde alguns minutos e acesse https://magpe-stack.github.io/Meyer/.

Por linha de comando:

```bash
git clone https://github.com/magpe-stack/Meyer.git
cd Meyer
# copie os arquivos para esta pasta, depois:
git add .
git commit -m "Atualiza o Meyer"
git push origin main
```

**Teste após publicar:**

- [ ] A splash aparece por 3 segundos e o app abre.
- [ ] O menu ☰ lista as 8 calculadoras.
- [ ] Os botões GitHub e Ajuda abrem os endereços corretos.
- [ ] O tema escuro funciona e persiste ao recarregar.
- [ ] Em modo avião, depois da primeira visita, o app ainda abre (DevTools → Application → Service Workers confirma o registro).

---

## 11. Estrutura do projeto

```
Meyer/
├── index.html      Estrutura da página, cabeçalho, menu sanfona, modal Sobre
├── styles.css      Estilo responsivo, temas claro/escuro, animações da splash
├── app.js          As 8 calculadoras, sanitização, menu, modal, tema, splash, registro do SW
├── sw.js           Service Worker: cache e funcionamento offline
├── manifest.json   Manifesto do PWA (nome, cores, ícones)
├── icon-192.png    Logotipo / favicon / ícone do PWA (192 px)
├── icon-512.png    Logotipo / ícone do PWA (512 px)
└── README.md       Este manual
```

O projeto **não usa** frameworks, bibliotecas externas nem CDN. Tudo roda com HTML, CSS e JavaScript puros, sem etapa de compilação.

---

## 12. Guia para quem mantém o código

### Como o `app.js` está organizado

1. **Utilitários:** formatação pt-BR (`fmt`, `brl`), `parseNum` (sanitização) e validadores (`need`, `positive`, `nonNegative`).
2. **`CALCS`:** objeto com as 8 calculadoras. Cada uma declara `title`, `desc`, `fields` e uma função `run(valores)` que devolve `{ rows, text, notes }`.
3. **Renderização:** `renderCalc` monta o formulário; `calcular` lê os campos, executa `run` e mostra o resultado e a minuta.
4. **Menu, modal, tema:** manipuladores de interface.
5. **Inicialização:** tema salvo, calculadora inicial, splash de 3 s e registro do Service Worker.

### Adicionar uma nova calculadora

1. Em `app.js`, acrescente uma entrada em `CALCS`:

```js
minhacalc: {
  title: 'Título da calculadora',
  desc: 'Descrição curta.',
  fields: [
    { id: 'x', label: 'Valor X', type: 'number', hint: 'Ex.: 10' }
  ],
  run(v) {
    const x = positive(v.x, 'Valor X');
    return {
      rows: [['Dobro', fmt(x * 2)]],
      text: `O dobro de ${fmt(x)} é ${fmt(x * 2)}.`,
      notes: []
    };
  }
}
```

2. Em `index.html`, adicione um botão correspondente dentro de `<ul class="drawer__list">`, com `data-calc="minhacalc"` e um ícone SVG.

Tipos de campo disponíveis: `number`, `select` (com `options: [[valor, rótulo], ...]`) e `textarea`. Use `throw new UserError('mensagem')` (ou os validadores) para avisos amigáveis.

### Alterar cores

Edite as variáveis no início de `styles.css` (blocos `:root[data-theme="light"]` e `:root[data-theme="dark"]`). Ao mudar cores, confira os contrastes (mínimo 4,5:1 para texto comum, 7:1 para AAA).

### Publicar nova versão

1. Edite os arquivos e faça o *commit* na branch `main`.
2. **Incremente `CACHE_VERSION`** em `sw.js` (por exemplo, de `meyer-v1` para `meyer-v2`). Sem isso, quem já instalou o app pode continuar vendo a versão antiga em cache.
3. Se criar novos arquivos que o app precise offline, inclua-os na lista `APP_SHELL` do `sw.js`.

### Testar localmente

O Service Worker exige `http://localhost` ou HTTPS. Na pasta do projeto:

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

---

## 13. Solução de problemas

| Sintoma | Causa provável | O que fazer |
|---|---|---|
| Ícone/logotipo não aparece | `icon-192.png` ou `icon-512.png` ausentes na raiz | Envie as duas imagens para a raiz do repositório. |
| Página em branco ou 404 no GitHub Pages | Pages não ativado ou publicação em andamento | Confira Settings → Pages e aguarde alguns minutos. |
| Mudanças não aparecem | Cache do Service Worker | Incremente `CACHE_VERSION` e recarregue; em último caso, DevTools → Application → Clear storage. |
| Botão não instala o app | Falta HTTPS, manifesto ou ícones | Acesse pelo endereço `https://` e verifique o painel Application → Manifest. |
| "Preencha ... com um número válido" | Campo vazio ou com letras | Corrija o campo indicado (veja a seção 3). |
| Valor com ponto de milhar lido errado | `1.234` sem vírgula vira 1,234 | Digite `1234` ou `1.234,00`. |
| Botão Copiar não copia | Navegador bloqueou a área de transferência | Selecione o texto da minuta e copie manualmente. |
| Tema não persiste | Navegação privada ou dados do site limpos | Use janela normal; o tema volta ao claro quando o `localStorage` é apagado. |
| Splash parece longa em tela lenta | A abertura dura 3 s por especificação | Comportamento esperado. |

---

## 14. Perguntas frequentes

**Meus dados vão para algum servidor?**
Não. Todos os cálculos acontecem no seu navegador, e nada é enviado ou armazenado em servidor. O único dado guardado localmente é a preferência de tema.

**O app usa inteligência artificial?**
Não. As calculadoras são determinísticas: os mesmos números sempre produzem exatamente o mesmo resultado.

**Funciona sem internet?**
Sim, depois da primeira visita com conexão (veja a seção 7).

**Posso usar os textos da minuta direto na matéria?**
Podem servir de base, mas revise, contextualize e confirme as fontes, pois a responsabilidade editorial é do jornalista.

**Por que o campo "Densidade" do estimador de público vai só até 6?**
Em multidões muito densas, acima de cerca de 5 a 6 pessoas por m², há risco real de acidentes, e valores maiores raramente representam uma situação sustentável.

**Posso copiar o código ou criar uma versão minha?**
Consulte a licença do repositório. Se o arquivo `LICENSE` ainda não existir, o mantenedor deve defini-lo antes de incentivar reutilização.

---

## 15. Créditos

- **Homenageado:** Philip Meyer (1930–2022), autor de *Precision Journalism* (1973), referência do jornalismo de dados.
- **Projeto:** Meyer – Hub de Calculadoras para Jornalistas, mantido em https://github.com/magpe-stack/Meyer.
- **Paleta:** Estudo de Cores Itten do Projeto Meyer.
- **Identidade visual:** mão estilizada segurando uma calculadora, em vetor 2D minimalista (`icon-192.png` e `icon-512.png`).

Encontrou um erro ou tem uma sugestão? Abra uma *issue* em https://github.com/magpe-stack/Meyer/issues.
