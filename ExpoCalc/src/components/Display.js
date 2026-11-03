// src/components/Display.js
import { View, Text, StyleSheet } from 'react-native';
import { useTema } from '../theme/TemaContext';

export default function Display({ expressao, resultado, memoria = 0, ligada = true }) {
  const { cores } = useTema();

  // mostra o resultado quando existe; senão a expressão sendo digitada
  const principal = !ligada ? '' : resultado !== '' ? resultado : expressao || '0';
  const secundaria = !ligada ? 'Desligada - toque em qualquer tecla' : resultado !== '' ? expressao : '';
  const mostrarLinha = !ligada || memoria !== 0 || secundaria !== '';

  return (
    <View style={[styles.painel, { backgroundColor: cores.painel }]}>
      {mostrarLinha && (
        <View style={styles.linha}>
          <Text style={[styles.pequeno, { color: cores.textoSuave }]}>
            {ligada && memoria !== 0 ? 'M' : ''}
          </Text>
          <Text style={[styles.pequeno, styles.secundaria, { color: cores.textoSuave }]} numberOfLines={1}>
            {secundaria}
          </Text>
        </View>
      )}
      <Text style={[styles.principal, { color: cores.texto }]} numberOfLines={1} adjustsFontSizeToFit>
        {principal}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  painel: {
    width: '100%',
    backgroundColor: 'lightgray',
    padding: 10,
    marginBottom: 20,
  },
  principal: {
    textAlign: 'right',
    fontSize: 36,
    fontWeight: 'bold',
  },
  linha: { flexDirection: 'row', justifyContent: 'space-between' },
  pequeno: { fontSize: 14, fontWeight: 'bold' },
  secundaria: { flex: 1, textAlign: 'right', fontWeight: 'normal' },
});
