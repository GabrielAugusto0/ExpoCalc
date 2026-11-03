// src/theme/TemaContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { carregarTema, salvarTema } from '../storage/tema';

// "claro" usa exatamente as cores originais da calculadora
const CLARO = {
  fundo: '#eff6f6',
  titulo: 'gray',
  tituloTexto: 'white',
  painel: 'lightgray',
  botao: '#f0f0f0',
  botaoNumeros: '#f0e9e9',
  borda: 'gray',
  texto: 'black',
  textoSuave: '#555',
};

const ESCURO = {
  fundo: '#121212',
  titulo: '#2a2a2a',
  tituloTexto: 'white',
  painel: '#1f1f1f',
  botao: '#2b2f3a',
  botaoNumeros: '#353a47',
  borda: '#555',
  texto: '#f2f2f2',
  textoSuave: '#aaa',
};

const TemaContext = createContext({ escuro: false, cores: CLARO, alternar: () => {} });

export function TemaProvider({ children }) {
  const [escuro, setEscuro] = useState(false);

  useEffect(() => {
    carregarTema().then(setEscuro);
  }, []);

  function alternar() {
    const novo = !escuro;
    setEscuro(novo);
    salvarTema(novo);
  }

  return (
    <TemaContext.Provider value={{ escuro, cores: escuro ? ESCURO : CLARO, alternar }}>
      {children}
    </TemaContext.Provider>
  );
}

export function useTema() {
  return useContext(TemaContext);
}
