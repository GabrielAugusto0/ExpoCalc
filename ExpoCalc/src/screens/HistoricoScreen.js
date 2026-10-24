// src/screens/HistoricoScreen.js
import { useCallback, useState } from 'react';
import { View, FlatList, Text, Button, Alert, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { carregar, limpar } from '../storage/historico';
import { useTema } from '../theme/TemaContext';

export default function HistoricoScreen() {
  const { cores } = useTema();
  const [historico, setHistorico] = useState([]);

  // lê do AsyncStorage toda vez que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      carregar().then(setHistorico);
    }, [])
  );

  function confirmarLimpar() {
    Alert.alert('Limpar histórico', 'Apagar todas as contas salvas?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Apagar',
        style: 'destructive',
        onPress: async () => {
          await limpar();
          setHistorico([]);
        },
      },
    ]);
  }

  return (
    <View style={[styles.container, { backgroundColor: cores.fundo }]}>
      <FlatList
        data={historico}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={[styles.linha, { color: cores.texto }]}>
            {item.conta} = {item.resultado}
          </Text>
        )}
        ListEmptyComponent={
          <Text style={[styles.vazio, { color: cores.textoSuave }]}>Nenhuma conta ainda</Text>
        }
      />
      {historico.length > 0 && (
        <View style={styles.botao}>
          <Button title="Limpar histórico" color="#c0392b" onPress={confirmarLimpar} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  linha: { fontSize: 24, padding: 8 },
  vazio: { fontSize: 18, padding: 16 },
  botao: { padding: 16 },
});
