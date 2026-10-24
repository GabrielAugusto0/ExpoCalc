// src/storage/tema.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE = 'tema_escuro';

export async function salvarTema(escuro) {
  await AsyncStorage.setItem(CHAVE, escuro ? '1' : '0');
}

export async function carregarTema() {
  try {
    return (await AsyncStorage.getItem(CHAVE)) === '1';
  } catch (e) {
    return false;
  }
}
