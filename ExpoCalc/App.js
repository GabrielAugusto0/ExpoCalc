import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import HistoricoScreen from './src/screens/HistoricoScreen';
import { TemaProvider, useTema } from './src/theme/TemaContext';

const Stack = createNativeStackNavigator();

function Rotas() {
  const { escuro } = useTema();

  return (
    <NavigationContainer theme={escuro ? DarkTheme : DefaultTheme}>
      <Stack.Navigator initialRouteName="Home">
        {/* sem cabeçalho nativo: a Home mantém o visual original da calculadora */}
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Historico" component={HistoricoScreen} options={{ title: 'Histórico' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <TemaProvider>
      <Rotas />
    </TemaProvider>
  );
}
