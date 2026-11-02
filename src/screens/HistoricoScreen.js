// src/screens/HistoricoScreen.js
import { useCallback, useState } from 'react';
import { View, FlatList, Text, Button, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { carregar, salvar, limpar } from '../storage/historico';
import { useTema } from '../theme/TemaContext';

export default function HistoricoScreen({ navigation }) {
  const { cores } = useTema();
  const [lista, setLista] = useState([]);

  // lê do AsyncStorage toda vez que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      carregar().then(setLista);
    }, [])
  );

  // Evolução 1: apaga todas as contas (tela + celular)
  function confirmarLimpar() {
    Alert.alert('Limpar histórico', 'Apagar todas as contas salvas?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Apagar',
        style: 'destructive',
        onPress: async () => {
          await limpar();
          setLista([]);
        },
      },
    ]);
  }

  // Evolução 2: remove só uma conta. filter cria uma lista NOVA (imutabilidade)
  async function excluir(id) {
    const nova = lista.filter((item) => item.id !== id);
    setLista(nova);
    await salvar(nova);
  }

  // Evolução 3: volta para a Home já existente levando o resultado.
  // O "ts" muda a cada toque para o useEffect da Home reagir mesmo com o mesmo valor.
  function reutilizar(item) {
    navigation.popTo('Home', { valor: item.resultado, ts: Date.now() });
  }

  return (
    <View style={[styles.container, { backgroundColor: cores.fundo }]}>
      <FlatList
        data={lista}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <TouchableOpacity style={styles.conta} onPress={() => reutilizar(item)}>
              <Text style={[styles.linha, { color: cores.texto }]}>
                {item.conta} = {item.resultado}
              </Text>
            </TouchableOpacity>
            <Button title="Excluir" color="#c0392b" onPress={() => excluir(item.id)} />
          </View>
        )}
        ListEmptyComponent={
          <Text style={[styles.vazio, { color: cores.textoSuave }]}>Nenhuma conta ainda</Text>
        }
      />
      {lista.length > 0 && (
        <View style={styles.botao}>
          <Button title="Limpar histórico" color="#c0392b" onPress={confirmarLimpar} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  item: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 },
  conta: { flex: 1 },
  linha: { fontSize: 22, padding: 8 },
  vazio: { fontSize: 18, padding: 16 },
  botao: { padding: 16 },
});
