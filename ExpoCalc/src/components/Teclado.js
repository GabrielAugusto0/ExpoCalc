// src/components/Teclado.js
import { View, StyleSheet } from 'react-native';
import Botao from './Botao';

const MEMORIA = ['MRC', 'M-', 'M+', 'RAIZ', 'Off'];

const LINHAS = [
  ['AC', 'C', '+/-', '%'],
  ['7', '8', '9', '/'],
  ['4', '5', '6', 'X'],
  ['1', '2', '3', '-'],
  ['0', '.', '=', '+'],
];

// ajuste visual que já existia no botão "+"
const ESTILO_TECLA = { '+': { textAlign: 'center', fontSize: 30 } };

export default function Teclado({ onPress }) {
  return (
    <>
      <View style={styles.colunas}>
        {MEMORIA.map((tecla) => (
          <Botao key={tecla} label={tecla} onPress={onPress} tipo="memoria" />
        ))}
      </View>

      {LINHAS.map((linha, i) => (
        <View key={i} style={styles.colunas}>
          {linha.map((tecla) => (
            <Botao
              key={tecla}
              label={tecla}
              onPress={onPress}
              tipo="numero"
              textoStyle={ESTILO_TECLA[tecla]}
            />
          ))}
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  colunas: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    gap: 10,
  },
});
