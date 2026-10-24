// src/utils/calculadora.js
// Funções puras da calculadora (sem eval, sem estado).

const OPERADORES_FINAIS = /[+\-X*/.]+$/;
const ULTIMO_NUMERO = /(\d+\.?\d*|\.\d+)$/;

// Avalia uma expressão como "2+3X4-1/2" respeitando a precedência (X e / antes de + e -)
export function calcular(expressao) {
  const s = String(expressao).replace(/\s/g, '').replace(/[X*]/g, '*');
  let pos = 0;

  function numero() {
    const m = s.slice(pos).match(/^(\d+\.?\d*|\.\d+)/);
    if (!m) throw new Error('Expressão inválida');
    pos += m[0].length;
    return parseFloat(m[0]);
  }

  function fator() {
    if (s[pos] === '-') { pos++; return -fator(); }
    if (s[pos] === '+') { pos++; return fator(); }
    return numero();
  }

  function termo() {
    let v = fator();
    while (s[pos] === '*' || s[pos] === '/') {
      const op = s[pos++];
      const d = fator();
      if (op === '/' && d === 0) throw new Error('Divisão por zero');
      v = op === '*' ? v * d : v / d;
    }
    return v;
  }

  function soma() {
    let v = termo();
    while (s[pos] === '+' || s[pos] === '-') {
      const op = s[pos++];
      const d = termo();
      v = op === '+' ? v + d : v - d;
    }
    return v;
  }

  const resultado = soma();
  if (pos !== s.length) throw new Error('Expressão inválida');
  return resultado;
}

// Arredonda erros de ponto flutuante (0.1+0.2) e devolve texto
export function formatar(n) {
  if (!Number.isFinite(n) || Math.abs(n) >= 1e15) throw new Error('Fora do limite');
  let t = Number(n.toPrecision(12)).toFixed(10);
  if (t.includes('.')) t = t.replace(/\.?0+$/, '');
  return t === '-0' ? '0' : t;
}

// Remove operadores/ponto soltos no fim: "5+3+" -> "5+3"
export function limparFim(expressao) {
  return expressao.replace(OPERADORES_FINAIS, '');
}

// Troca o sinal do último número digitado
export function alternarSinal(expressao) {
  const m = expressao.match(ULTIMO_NUMERO);
  if (!m) return expressao;
  const ini = expressao.length - m[0].length;
  const antes = expressao.slice(0, ini);
  const anterior = antes[antes.length - 1];

  if (anterior === '-') {
    const antesDoSinal = antes[antes.length - 2];
    // "-5" ou "3X-5": o '-' é sinal do número, então remove
    if (antesDoSinal === undefined || /[+\-X/]/.test(antesDoSinal)) {
      return antes.slice(0, -1) + m[0];
    }
    // "5-3": '-' é operador, vira '+'
    return antes.slice(0, -1) + '+' + m[0];
  }
  if (anterior === '+') return antes.slice(0, -1) + '-' + m[0];
  return antes + '-' + m[0];
}

// Troca o último número por outro texto (usado em % e MRC)
export function substituirUltimoNumero(expressao, novo) {
  const m = expressao.match(ULTIMO_NUMERO);
  if (!m) return expressao + novo;
  return expressao.slice(0, expressao.length - m[0].length) + novo;
}

export function ultimoNumero(expressao) {
  const m = expressao.match(ULTIMO_NUMERO);
  return m ? m[0] : '';
}
