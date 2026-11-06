/* ==========================================================================
   Meyer - Hub de Calculadoras para Jornalistas
   Lógica das 8 calculadoras (100% determinísticas), sanitização de entradas,
   menu sanfona, modal "Sobre", splash screen, tema Claro/Escuro e PWA.
   ========================================================================== */
'use strict';

/* ---------- 1. Utilitários ---------- */
const $ = (sel, root = document) => root.querySelector(sel);

/** Erro "esperado" do usuário (entrada inválida): vira mensagem na tela, nunca quebra o app. */
class UserError extends Error {}

/** Formata número no padrão pt-BR (até `d` casas decimais). */
const fmt = (n, d = 2) =>
  new Intl.NumberFormat('pt-BR', { maximumFractionDigits: d, minimumFractionDigits: 0 }).format(n);
const fmtFixed = (n, d = 2) =>
  new Intl.NumberFormat('pt-BR', { maximumFractionDigits: d, minimumFractionDigits: d }).format(n);
const brl = (n) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
const signed = (n, d = 2) => (n > 0 ? '+' : '') + fmt(n, d);

/**
 * Sanitiza um texto numérico.
 * - Remove "R$", "%" e espaços.
 * - Se houver vírgula: ela é o decimal e os pontos são separadores de milhar ("1.234,56" -> 1234.56).
 * - Sem vírgula: o ponto é decimal ("12.5" -> 12.5).
 * Retorna NaN para qualquer entrada vazia ou inválida (nunca lança erro).
 */
function parseNum(raw) {
  if (raw === null || raw === undefined) return NaN;
  let s = String(raw).trim().replace(/R\$|%|\s/g, '');
  if (!s) return NaN;
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
  if (!/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(s)) return NaN;
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}

/** Escapa texto para uso seguro em innerHTML. */
const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** Garante que um valor é um número válido; caso contrário, avisa o usuário. */
function need(v, nome) {
  if (!Number.isFinite(v)) throw new UserError(`Preencha "${nome}" com um número válido.`);
  return v;
}
const positive = (v, nome) => {
  if (need(v, nome) <= 0) throw new UserError(`"${nome}" deve ser maior que zero.`);
  return v;
};
const nonNegative = (v, nome) => {
  if (need(v, nome) < 0) throw new UserError(`"${nome}" não pode ser negativo.`);
  return v;
};

/* ---------- 2. Definição das 8 calculadoras ----------
   Cada calculadora: id, título, descrição, campos e função run(valores)
   que devolve { rows: [[rótulo, valor]], text: "minuta", notes: [] }. */
const CALCS = {
  /* 1 ------------------------------------------------------------------ */
  varpct: {
    title: 'Variação percentual e pontos percentuais',
    desc: 'Compara um valor inicial (A) com um valor final (B) e diferencia variação relativa (%) de diferença em pontos percentuais (pp).',
    fields: [
      { id: 'a', label: 'Valor inicial (A)', type: 'number', hint: 'Ex.: 12,5' },
      { id: 'b', label: 'Valor final (B)', type: 'number', hint: 'Ex.: 15' }
    ],
    run(v) {
      const A = need(v.a, 'Valor inicial (A)');
      const B = need(v.b, 'Valor final (B)');
      const pp = B - A;
      const notes = [
        'Use "pontos percentuais" quando A e B forem, eles mesmos, percentuais ou taxas (ex.: desemprego de 8% para 10% = +2 pp). Use "por cento" para a variação relativa entre dois valores.'
      ];
      let pctTxt;
      let rows;
      let text;
      const direcao = B > A ? 'aumento' : B < A ? 'queda' : 'estabilidade';

      if (A === 0) {
        // Divisão por zero tratada: percentual relativo é indefinido.
        pctTxt = 'indefinida (valor inicial igual a zero)';
        notes.unshift('Com valor inicial igual a zero, a variação percentual não pode ser calculada.');
        rows = [['Variação percentual', pctTxt], ['Diferença absoluta (B − A)', fmt(pp)], ['Diferença em pontos percentuais', `${signed(pp)} pp`]];
        text = `O valor passou de ${fmt(A)} para ${fmt(B)} (diferença de ${signed(pp)}). A variação percentual não pode ser calculada porque o valor inicial é zero. Se os dois números forem percentuais, a diferença é de ${fmt(Math.abs(pp))} ponto(s) percentual(is).`;
      } else {
        const pct = (pp / Math.abs(A)) * 100;
        pctTxt = `${signed(pct)}%`;
        rows = [['Variação percentual', pctTxt], ['Diferença absoluta (B − A)', signed(pp)], ['Diferença em pontos percentuais', `${signed(pp)} pp`], ['Tendência', direcao]];
        text = direcao === 'estabilidade'
          ? `O valor ficou estável em ${fmt(A)}, sem variação entre os dois períodos.`
          : `O valor passou de ${fmt(A)} para ${fmt(B)}, ${direcao === 'aumento' ? 'um aumento' : 'uma queda'} de ${fmt(Math.abs(pct))}%. Se os dois números forem percentuais ou taxas, a diferença é de ${fmt(Math.abs(pp))} ponto(s) percentual(is), e não de ${fmt(Math.abs(pct))}%.`;
      }
      return { rows, text, notes };
    }
  },

  /* 2 ------------------------------------------------------------------ */
  percapita: {
    title: 'Conversor de taxa per capita (normalização)',
    desc: 'Transforma números absolutos em taxa por N habitantes, permitindo comparar locais de tamanhos diferentes.',
    fields: [
      { id: 'occ', label: 'Total de ocorrências', type: 'number', hint: 'Ex.: 320' },
      { id: 'pop', label: 'População total', type: 'number', hint: 'Ex.: 850000' },
      { id: 'base', label: 'Base (por quantos habitantes)', type: 'number', def: '100000', hint: 'Padrão: 100.000 habitantes' }
    ],
    run(v) {
      const occ = nonNegative(v.occ, 'Total de ocorrências');
      const pop = positive(v.pop, 'População total');
      const base = positive(Number.isFinite(v.base) ? v.base : 100000, 'Base');
      const taxa = (occ / pop) * base;
      return {
        rows: [['Taxa por ' + fmt(base) + ' habitantes', fmtFixed(taxa)], ['Proporção bruta', `${fmt(occ / pop, 8)} por habitante`]],
        text: `Foram registradas ${fmt(occ)} ocorrências em uma população de ${fmt(pop)} habitantes, o que equivale a uma taxa de ${fmtFixed(taxa)} por ${fmt(base)} habitantes.`,
        notes: ['Para comparar cidades ou estados, use sempre a mesma base e o mesmo período.']
      };
    }
  },

  /* 3 ------------------------------------------------------------------ */
  orcamento: {
    title: 'Conversor de unidades orçamentárias',
    desc: 'Traduz um valor em reais para salários mínimos e cestas básicas, ajudando o leitor a dimensionar o número.',
    fields: [
      { id: 'orc', label: 'Orçamento (R$)', type: 'number', hint: 'Ex.: 2500000' },
      { id: 'sm', label: 'Salário mínimo (R$)', type: 'number', hint: 'Informe o valor vigente na data da matéria' },
      { id: 'cesta', label: 'Cesta básica (R$)', type: 'number', hint: 'Ex.: valor do Dieese para a capital' }
    ],
    run(v) {
      const orc = nonNegative(v.orc, 'Orçamento (R$)');
      const sm = positive(v.sm, 'Salário mínimo (R$)');
      const cesta = positive(v.cesta, 'Cesta básica (R$)');
      const nSm = orc / sm;
      const nCesta = orc / cesta;
      return {
        rows: [['Salários mínimos', fmt(nSm)], ['Cestas básicas', fmt(nCesta)]],
        text: `O valor de ${brl(orc)} equivale a cerca de ${fmt(nSm, 1)} salários mínimos (de ${brl(sm)}) ou a ${fmt(nCesta, 0)} cestas básicas (de ${brl(cesta)}).`,
        notes: ['Cite a fonte e a data dos valores de salário mínimo e cesta básica usados.']
      };
    }
  },

  /* 4 ------------------------------------------------------------------ */
  estat: {
    title: 'Estatística descritiva (média e mediana)',
    desc: 'Cole uma lista de números (um por linha, ou separados por espaço ou ponto e vírgula). A vírgula é tratada como separador decimal.',
    fields: [
      { id: 'dados', label: 'Números', type: 'textarea', hint: 'Ex.: 1200; 1350,50; 980; 2100' }
    ],
    run(v) {
      const tokens = String(v.dados || '').split(/[\s;]+/).filter(Boolean);
      const nums = tokens.map(parseNum).filter((n) => Number.isFinite(n));
      const ignorados = tokens.length - nums.length;
      if (nums.length === 0) throw new UserError('Cole ao menos um número válido.');
      nums.sort((x, y) => x - y);
      const n = nums.length;
      const soma = nums.reduce((s, x) => s + x, 0);
      const media = soma / n;
      const mid = Math.floor(n / 2);
      const mediana = n % 2 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
      const min = nums[0];
      const max = nums[n - 1];
      const notes = [];
      if (ignorados > 0) notes.push(`${ignorados} item(ns) não numérico(s) foram ignorados.`);
      if (n > 2 && Math.abs(media - mediana) > 0.1 * Math.abs(mediana || 1)) {
        notes.push('Média e mediana estão distantes: pode haver valores extremos. Considere citar a mediana.');
      }
      return {
        rows: [['N (quantidade)', fmt(n, 0)], ['Média', fmt(media)], ['Mediana', fmt(mediana)], ['Mínimo', fmt(min)], ['Máximo', fmt(max)], ['Amplitude (máx − mín)', fmt(max - min)]],
        text: `Nos ${fmt(n, 0)} valores analisados, a média é de ${fmt(media)} e a mediana, de ${fmt(mediana)}. O menor valor é ${fmt(min)} e o maior, ${fmt(max)}, uma amplitude de ${fmt(max - min)}.`,
        notes
      };
    }
  },

  /* 5 ------------------------------------------------------------------ */
  regra3: {
    title: 'Regra de três simples',
    desc: 'Se A está para B, então C está para X. Calcula X = (B × C) ÷ A.',
    fields: [
      { id: 'a', label: 'Valor A', type: 'number', hint: 'Ex.: 200' },
      { id: 'b', label: 'Valor B (correspondente a A)', type: 'number', hint: 'Ex.: 50' },
      { id: 'c', label: 'Valor C', type: 'number', hint: 'Ex.: 1000' }
    ],
    run(v) {
      const A = positive(v.a, 'Valor A');
      const B = need(v.b, 'Valor B');
      const C = need(v.c, 'Valor C');
      const X = (B * C) / A;
      const rel = (C / A) * 100;
      return {
        rows: [['Valor de X', fmt(X, 4)], ['C em relação a A', `${fmt(rel)}%`]],
        text: `Se ${fmt(A)} corresponde a ${fmt(B)}, então ${fmt(C)} corresponde a ${fmt(X, 2)}. O valor C equivale a ${fmt(rel)}% de A.`,
        notes: ['A regra de três simples supõe proporcionalidade direta entre as grandezas.']
      };
    }
  },

  /* 6 ------------------------------------------------------------------ */
  densidade: {
    title: 'Densidade demográfica',
    desc: 'Relaciona população e território: habitantes por km² e espaço médio por habitante.',
    fields: [
      { id: 'pop', label: 'População total', type: 'number', hint: 'Ex.: 12300000' },
      { id: 'area', label: 'Área (km²)', type: 'number', hint: 'Ex.: 1521' }
    ],
    run(v) {
      const pop = positive(v.pop, 'População total');
      const area = positive(v.area, 'Área (km²)');
      const dens = pop / area;
      const m2hab = (area * 1e6) / pop;
      return {
        rows: [['Densidade', `${fmt(dens)} hab/km²`], ['Espaço por habitante', `${fmt(m2hab)} m²/hab`]],
        text: `Com ${fmt(pop)} habitantes distribuídos em ${fmt(area)} km², a densidade demográfica é de ${fmt(dens)} habitantes por km², ou cerca de ${fmt(m2hab)} m² de território por pessoa.`,
        notes: ['Densidade é média: áreas centrais e periféricas podem ser muito diferentes.']
      };
    }
  },

  /* 7 ------------------------------------------------------------------ */
  hectares: {
    title: 'Equivalência por hectares e campos de futebol',
    desc: 'Converte uma área em hectares e em campos de futebol oficiais (padrão FIFA: 7.140 m²).',
    fields: [
      { id: 'area', label: 'Área', type: 'number', hint: 'Ex.: 250000' },
      { id: 'un', label: 'Unidade', type: 'select', options: [['m2', 'metros quadrados (m²)'], ['km2', 'quilômetros quadrados (km²)']] }
    ],
    run(v) {
      const area = positive(v.area, 'Área');
      const m2 = v.un === 'km2' ? area * 1e6 : area;
      const ha = m2 / 10000;
      const campos = m2 / 7140;
      const orig = v.un === 'km2' ? `${fmt(area)} km²` : `${fmt(area)} m²`;
      return {
        rows: [['Área em m²', fmt(m2)], ['Hectares (ha)', fmt(ha)], ['Campos de futebol FIFA (7.140 m²)', fmt(campos, 1)]],
        text: `A área de ${orig} corresponde a ${fmt(ha)} hectares, o equivalente a aproximadamente ${fmt(campos, 0)} campos de futebol oficiais (7.140 m² cada).`,
        notes: ['Um hectare equivale a 10.000 m².']
      };
    }
  },

  /* 8 ------------------------------------------------------------------ */
  publico: {
    title: 'Estimador de público por metro quadrado',
    desc: 'Estima o público de um evento a partir da área ocupada e da densidade de pessoas. É uma estimativa, não uma contagem.',
    fields: [
      { id: 'area', label: 'Área ocupada (m²)', type: 'number', hint: 'Ex.: 8000' },
      {
        id: 'dens', label: 'Densidade (pessoas por m²)', type: 'select',
        options: [
          ['1', '1 pessoa/m² – Muito espaçado'],
          ['2', '2 pessoas/m² – Folgado, dá para circular'],
          ['3', '3 pessoas/m² – Moderado, pessoas próximas'],
          ['4', '4 pessoas/m² – Cheio, circulação difícil'],
          ['5', '5 pessoas/m² – Muito cheio, ombro a ombro'],
          ['6', '6 pessoas/m² – Extremamente lotado, risco']
        ]
      }
    ],
    run(v) {
      const area = positive(v.area, 'Área ocupada (m²)');
      const d = parseNum(v.dens);
      if (!(d >= 1 && d <= 6)) throw new UserError('Escolha uma densidade entre 1 e 6 pessoas por m².');
      const total = Math.round(area * d);
      return {
        rows: [['Público total estimado', fmt(total, 0) + ' pessoas'], ['Cálculo', `${fmt(area)} m² × ${fmt(d, 0)} pessoas/m²`]],
        text: `Considerando uma área de ${fmt(area)} m² com densidade de ${fmt(d, 0)} pessoa(s) por m², a estimativa é de cerca de ${fmt(total, 0)} pessoas. O número é uma estimativa e depende da ocupação real do espaço.`,
        notes: ['Descontar áreas vazias (palcos, banheiros, barracas) aproxima a estimativa da realidade. Cite o método na matéria.']
      };
    }
  }
};

/* ---------- 3. Renderização do painel ---------- */
const painel = $('#painel');
let ativa = 'varpct';

function fieldHTML(calcId, f) {
  const id = `${calcId}-${f.id}`;
  const hintId = `${id}-hint`;
  const hint = f.hint ? `<span class="hint" id="${hintId}">${esc(f.hint)}</span>` : '';
  const desc = f.hint ? ` aria-describedby="${hintId}"` : '';
  let ctrl;
  if (f.type === 'select') {
    ctrl = `<select id="${id}" name="${f.id}"${desc}>${f.options.map(([val, lab]) => `<option value="${esc(val)}">${esc(lab)}</option>`).join('')}</select>`;
  } else if (f.type === 'textarea') {
    ctrl = `<textarea id="${id}" name="${f.id}" spellcheck="false"${desc}></textarea>`;
  } else {
    ctrl = `<input id="${id}" name="${f.id}" type="text" inputmode="decimal" autocomplete="off" value="${esc(f.def || '')}"${desc}>`;
  }
  return `<div class="field"><label for="${id}">${esc(f.label)}</label>${ctrl}${hint}</div>`;
}

function renderCalc(id, moveFocus) {
  const calc = CALCS[id];
  if (!calc) return;
  ativa = id;

  document.querySelectorAll('.nav-btn').forEach((b) => {
    if (b.dataset.calc === id) b.setAttribute('aria-current', 'page');
    else b.removeAttribute('aria-current');
  });

  painel.innerHTML = `
    <h2 id="calcTitle" tabindex="-1">${esc(calc.title)}</h2>
    <p class="panel__desc">${esc(calc.desc)}</p>
    <form id="calcForm" class="card" novalidate aria-labelledby="calcTitle">
      ${calc.fields.map((f) => fieldHTML(id, f)).join('')}
      <div class="btn-row">
        <button class="btn" type="submit">Calcular</button>
        <button class="btn btn--ghost" type="reset">Limpar</button>
      </div>
    </form>
    <div id="saida" aria-live="polite" aria-atomic="true"></div>`;

  const form = $('#calcForm');
  form.addEventListener('submit', (e) => { e.preventDefault(); calcular(); });
  form.addEventListener('reset', () => {
    // Após o reset nativo, restaura os padrões e limpa a saída.
    setTimeout(() => {
      calc.fields.forEach((f) => { if (f.def) $(`#${id}-${f.id}`).value = f.def; });
      $('#saida').innerHTML = '';
    }, 0);
  });

  if (moveFocus) $('#calcTitle').focus();
}

/** Lê os campos, sanitiza, executa a calculadora e mostra resultado + minuta. */
function calcular() {
  const calc = CALCS[ativa];
  const saida = $('#saida');
  const valores = {};
  calc.fields.forEach((f) => {
    const el = $(`#${ativa}-${f.id}`);
    valores[f.id] = f.type === 'number' ? parseNum(el.value) : el.value;
  });

  let r;
  try {
    r = calc.run(valores);
  } catch (err) {
    // Qualquer problema vira aviso amigável; o app nunca quebra.
    const msg = err instanceof UserError ? err.message : 'Não foi possível calcular com esses valores.';
    saida.innerHTML = `<p class="error" role="alert">${esc(msg)}</p>`;
    return;
  }

  saida.innerHTML = `
    <section class="card results" aria-labelledby="resTitle">
      <h3 id="resTitle">Resultado</h3>
      <dl>${r.rows.map(([k, val]) => `<div class="row"><dt>${esc(k)}</dt><dd>${esc(val)}</dd></div>`).join('')}</dl>
      ${r.notes && r.notes.length ? `<ul class="notes">${r.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>` : ''}
    </section>
    <section class="card minuta" aria-labelledby="minTitle">
      <h3 id="minTitle">Minuta da Matéria</h3>
      <label class="sr-only" for="minutaTxt" style="position:absolute;left:-9999px">Texto da minuta</label>
      <textarea id="minutaTxt" readonly rows="5">${esc(r.text)}</textarea>
      <div class="btn-row"><button id="copyBtn" class="btn" type="button">Copiar texto</button></div>
      <p id="copyStatus" class="copy-status" aria-live="polite"></p>
    </section>`;

  $('#copyBtn').addEventListener('click', () => copiar(r.text));
}

/** Copia o texto para a área de transferência (com alternativa para navegadores antigos). */
async function copiar(texto) {
  const status = $('#copyStatus');
  try {
    await navigator.clipboard.writeText(texto);
    status.textContent = 'Texto copiado!';
  } catch (e) {
    const ta = $('#minutaTxt');
    ta.focus();
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (_) { /* ignora */ }
    status.textContent = ok ? 'Texto copiado!' : 'Não foi possível copiar automaticamente. Selecione o texto e copie manualmente.';
  }
}

/* ---------- 4. Menu sanfona (gaveta) ---------- */
const drawer = $('#drawer');
const overlay = $('#overlay');
const menuBtn = $('#menuBtn');
const closeMenuBtn = $('#closeMenuBtn');

function abrirMenu() {
  overlay.hidden = false;
  drawer.classList.add('is-open');
  drawer.setAttribute('aria-hidden', 'false');
  menuBtn.setAttribute('aria-expanded', 'true');
  menuBtn.setAttribute('aria-label', 'Fechar menu de calculadoras');
  // Foca na calculadora ativa (ou no primeiro botão).
  const alvo = $('.nav-btn[aria-current="page"]') || $('.nav-btn');
  setTimeout(() => alvo && alvo.focus(), 50);
}

function fecharMenu(devolverFoco = true) {
  overlay.hidden = true;
  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.setAttribute('aria-label', 'Abrir menu de calculadoras');
  if (devolverFoco) menuBtn.focus();
}

const menuAberto = () => drawer.classList.contains('is-open');

menuBtn.addEventListener('click', () => (menuAberto() ? fecharMenu() : abrirMenu()));
closeMenuBtn.addEventListener('click', () => fecharMenu());
overlay.addEventListener('click', () => fecharMenu());

drawer.addEventListener('click', (e) => {
  const btn = e.target.closest('.nav-btn');
  if (!btn) return;
  renderCalc(btn.dataset.calc, false);
  fecharMenu(false);
  $('#calcTitle').focus();
});

// Teclado: Escape fecha o menu; Tab fica preso dentro da gaveta enquanto aberta.
document.addEventListener('keydown', (e) => {
  if (!menuAberto()) return;
  if (e.key === 'Escape') { e.preventDefault(); fecharMenu(); return; }
  if (e.key === 'Tab') {
    const focaveis = [...drawer.querySelectorAll('button')];
    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];
    if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
  }
});

/* ---------- 5. Modal "Sobre" (<dialog>: Escape e foco tratados pelo navegador) ---------- */
const aboutDialog = $('#aboutDialog');
const aboutBtn = $('#aboutBtn');

aboutBtn.addEventListener('click', () => {
  if (typeof aboutDialog.showModal === 'function') aboutDialog.showModal();
  else aboutDialog.setAttribute('open', '');
});
$('#aboutClose').addEventListener('click', () => aboutDialog.close());
// Clique fora da caixa fecha o modal.
aboutDialog.addEventListener('click', (e) => { if (e.target === aboutDialog) aboutDialog.close(); });
aboutDialog.addEventListener('close', () => aboutBtn.focus());

/* ---------- 6. Tema Claro/Escuro com persistência ---------- */
const themeBtn = $('#themeBtn');
const themeLabel = $('#themeLabel');

function aplicarTema(tema, salvar) {
  document.documentElement.setAttribute('data-theme', tema);
  const escuro = tema === 'dark';
  themeBtn.setAttribute('aria-pressed', String(escuro));
  themeBtn.setAttribute('aria-label', escuro ? 'Tema escuro ativo. Mudar para tema claro' : 'Tema claro ativo. Mudar para tema escuro');
  themeLabel.textContent = escuro ? 'Claro' : 'Escuro';
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', escuro ? '#10141D' : '#0040FF');
  if (salvar) { try { localStorage.setItem('meyer-theme', tema); } catch (_) { /* ignora */ } }
}

themeBtn.addEventListener('click', () => {
  const atual = document.documentElement.getAttribute('data-theme');
  aplicarTema(atual === 'dark' ? 'light' : 'dark', true);
});

/* ---------- 7. Inicialização, splash (3 s) e Service Worker ---------- */
(function iniciar() {
  let salvo = 'light'; // Light First
  try { if (localStorage.getItem('meyer-theme') === 'dark') salvo = 'dark'; } catch (_) { /* ignora */ }
  aplicarTema(salvo, false);

  renderCalc('varpct', false);

  const splash = $('#splash');
  const app = $('#app');

  // Exatos 3 segundos de splash antes de revelar o app.
  setTimeout(() => {
    splash.classList.add('is-hidden');
    app.removeAttribute('inert');
    setTimeout(() => splash.remove(), 650);
  }, 3000);

  // Service Worker para uso 100% offline.
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => { /* sem SW: o app segue online */ });
    });
  }
})();
