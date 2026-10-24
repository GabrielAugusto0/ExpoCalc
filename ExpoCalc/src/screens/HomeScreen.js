// src/screens/HomeScreen.js
import { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Display from '../components/Display';
import Teclado from '../components/Teclado';
import { carregar, salvar } from '../storage/historico';
import { useTema } from '../theme/TemaContext';
import {
  calcular,
  formatar,
  limparFim,
  alternarSinal,
  substituirUltimoNumero,
  ultimoNumero,
} from '../utils/calculadora';

const OPERADORES = ['+', '-', 'X', '/'];

export default function HomeScreen({ navigation }) {
  const { escuro, cores, alternar } = useTema();

  const [expressao, setExpressao] = useState('');
  const [resultado, setResultado] = useState('');
  const [historico, setHistorico] = useState([]);
  const [memoria, setMemoria] = useState(0);
  const [ligada, setLigada] = useState(true);
  const teclaAnterior = useRef('');

  // carrega o histórico salvo uma vez, quando a tela abre
  useEffect(() => {
    carregar().then(setHistorico);
  }, []);

  // recarrega ao voltar da tela de histórico (ela pode ter limpado a lista)
  useEffect(() => {
    const cancelar = navigation.addListener('focus', () => {
      carregar().then(setHistorico);
    });
    return cancelar;
  }, [navigation]);

  // ---------- helpers ----------
  function limparTudo() {
    setExpressao('');
    setResultado('');
  }

  // valor numérico do que está na tela (resultado atual ou expressão digitada)
  function valorAtual() {
    if (resultado !== '') {
      if (resultado === 'Erro') throw new Error('Erro');
      return Number(resultado);
    }
    const conta = limparFim(expressao);
    return conta === '' ? 0 : calcular(conta);
  }

  // mostra o resultado e guarda a conta no histórico (e no AsyncStorage)
  async function finalizar(conta, valor) {
    setExpressao(conta);
    setResultado(valor);
    const item = { id: Date.now().toString(), conta, resultado: valor };
    const novo = [item, ...historico];
    setHistorico(novo);
    await salvar(novo);
  }

  // ---------- teclas ----------
  function inserirDigito(t) {
    if (resultado !== '') {
      setExpressao(t === '.' ? '0.' : t);
      setResultado('');
      return;
    }
    const atual = ultimoNumero(expressao);
    if (t === '.') {
      if (atual.includes('.')) return;
      setExpressao(expressao + (atual === '' ? '0.' : '.'));
      return;
    }
    if (atual === '0') {
      setExpressao(expressao.slice(0, -1) + t); // evita 007
      return;
    }
    setExpressao(expressao + t);
  }

  function inserirOperador(op) {
    let base = expressao;
    if (resultado !== '') {
      if (resultado === 'Erro') return;
      base = resultado; // continua a conta a partir do resultado
      setResultado('');
    }
    if (base === '') {
      if (op === '-') setExpressao('-');
      return;
    }
    if (/[+\-X/]$/.test(base)) {
      if (base.length === 1) return;
      base = base.replace(/[+\-X/]+$/, ''); // troca o operador anterior
    }
    setExpressao(base + op);
  }

  async function aoIgual() {
    if (resultado !== '' || expressao === '') return;
    const conta = limparFim(expressao);
    if (conta === '' || conta === '-') return;
    try {
      await finalizar(conta, formatar(calcular(conta)));
    } catch (e) {
      setResultado('Erro');
    }
  }

  async function aoRaiz() {
    try {
      const v = valorAtual();
      if (v < 0) throw new Error('Raiz negativa');
      await finalizar('√(' + formatar(v) + ')', formatar(Math.sqrt(v)));
    } catch (e) {
      setResultado('Erro');
    }
  }

  function aoPorcento() {
    if (resultado !== '' && resultado !== 'Erro') {
      setExpressao(formatar(Number(resultado) / 100));
      setResultado('');
      return;
    }
    const n = ultimoNumero(expressao);
    if (n === '') return;
    setExpressao(substituirUltimoNumero(expressao, formatar(parseFloat(n) / 100)));
  }

  function aoAlternarSinal() {
    if (resultado !== '') {
      if (resultado === 'Erro') return;
      setExpressao(formatar(-Number(resultado)));
      setResultado('');
      return;
    }
    setExpressao(alternarSinal(expressao));
  }

  function aoMemoria(tecla) {
    try {
      const v = valorAtual();
      const delta = tecla === 'M+' ? v : -v;
      setMemoria(Number(formatar(memoria + delta)));
      // mantém o valor na tela; o próximo dígito começa um número novo
      setExpressao(expressao === '' ? formatar(v) : expressao);
      setResultado(formatar(v));
    } catch (e) {
      setResultado('Erro');
    }
  }

  function aoMRC(anterior) {
    // 1º toque: recupera a memória. 2º toque seguido: apaga a memória.
    if (anterior === 'MRC') {
      setMemoria(0);
      return;
    }
    if (memoria === 0) return;
    const m = formatar(memoria);
    if (resultado !== '') {
      setExpressao(m);
      setResultado('');
    } else if (expressao === '' || /[+\-X/]$/.test(expressao)) {
      setExpressao(expressao + m);
    } else {
      setExpressao(substituirUltimoNumero(expressao, m));
    }
  }

  function aoDesligar() {
    limparTudo();
    setMemoria(0);
    setLigada(false);
  }

  function aoApagar() {
    if (resultado !== '') limparTudo();
    else setExpressao(expressao.slice(0, -1));
  }

  // ---------- entrada única de todos os botões ----------
  function aoTocar(tecla) {
    const anterior = teclaAnterior.current;
    teclaAnterior.current = tecla;
    if (!ligada) {
      setLigada(true); // qualquer tecla liga de novo
      return;
    }

    if (tecla === 'MRC') return aoMRC(anterior);
    if (tecla === 'Off') return aoDesligar();
    if (tecla === 'AC') return limparTudo();
    if (tecla === 'C') return aoApagar();
    if (tecla === '=') return aoIgual();
    if (tecla === 'RAIZ') return aoRaiz();
    if (tecla === '%') return aoPorcento();
    if (tecla === '+/-') return aoAlternarSinal();
    if (tecla === 'M+' || tecla === 'M-') return aoMemoria(tecla);
    if (OPERADORES.includes(tecla)) return inserirOperador(tecla);
    inserirDigito(tecla);
  }

  return (
    <View style={[styles.container, { backgroundColor: cores.fundo }]}>
      <StatusBar style={escuro ? 'light' : 'dark'} />

      <Text style={[styles.titulo, { backgroundColor: cores.titulo, color: cores.tituloTexto }]}>
        Calculadora do Gabriel Augusto
      </Text>

      <Display expressao={expressao} resultado={resultado} memoria={memoria} ligada={ligada} />

      <Teclado onPress={aoTocar} />

      <View style={styles.rodape}>
        <Button title="Ver histórico" onPress={() => navigation.navigate('Historico')} />
        <Button title={escuro ? 'Tema claro' : 'Tema escuro'} onPress={alternar} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eff6f6',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 40,
    padding: 0,
  },
  titulo: {
    textAlign: 'center',
    backgroundColor: 'gray',
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    height: 35,
    width: '100%',
  },
  rodape: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 30,
  },
});
