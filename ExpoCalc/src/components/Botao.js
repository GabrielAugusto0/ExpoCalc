// src/components/Botao.js
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTema } from '../theme/TemaContext';

// tipo: 'memoria' (botões pequenos do topo) ou 'numero' (teclado principal)
export default function Botao({ label, onPress, tipo = 'numero', textoStyle }) {
  const { cores } = useTema();
  const pequeno = tipo === 'memoria';

  return (
    <TouchableOpacity
      style={[
        pequeno ? styles.botao : styles.botaoNumeros,
        { backgroundColor: pequeno ? cores.botao : cores.botaoNumeros, borderColor: cores.borda },
      ]}
      onPress={() => onPress(label)}
    >
      <Text style={[!pequeno && styles.textNumeros, { color: cores.texto }, textoStyle]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    backgroundColor: '#f0f0f0',
    color: 'black',
    borderRadius: 10,
    borderWidth: 3,
    borderColor: 'gray',
    height: 50,
    padding: 10,
    marginTop: 20,
    width: '17%',
  },
  botaoNumeros: {
    backgroundColor: '#f0e9e9',
    color: 'black',
    borderRadius: 10,
    borderWidth: 3,
    borderColor: 'gray',
    height: 60,
    padding: 10,
    marginTop: 20,
    width: '22%',
  },
  textNumeros: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
