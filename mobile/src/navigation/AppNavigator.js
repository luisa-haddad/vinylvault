import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';

// Auth screens
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';

// App screens (após login)
import MainTabNavigator from './MainTabNavigator';
import AddVinylScreen from '../screens/Vinyl/AddVinylScreen';
import VinylDetailScreen from '../screens/Vinyl/VinylDetailScreen';
import ScanBarcodeScreen from '../screens/Vinyl/ScanBarcodeScreen';
import SearchVinylScreen from '../screens/Vinyl/SearchVinylScreen';
import ManualAddScreen from '../screens/Vinyl/ManualAddScreen';
import QRCodeScreen from '../screens/Profile/QRCodeScreen';
import PublicCollectionScreen from '../screens/Public/PublicCollectionScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { signed, loading } = useAuth();

  if (loading) {
    return null; // Ou um loading screen
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1a1a1a',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {!signed ? (
        // Stack de autenticação
        <>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen}
            options={{ title: 'Criar Conta' }}
          />
        </>
      ) : (
        // Stack principal (após login)
        <>
          <Stack.Screen 
            name="MainTabs" 
            component={MainTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="AddVinyl" 
            component={AddVinylScreen}
            options={{ title: 'Adicionar Disco' }}
          />
          <Stack.Screen 
            name="VinylDetail" 
            component={VinylDetailScreen}
            options={{ title: 'Detalhes do Disco' }}
          />
          <Stack.Screen 
            name="ScanBarcode" 
            component={ScanBarcodeScreen}
            options={{ title: 'Escanear Código de Barras' }}
          />
          <Stack.Screen 
            name="SearchVinyl" 
            component={SearchVinylScreen}
            options={{ title: 'Buscar Disco' }}
          />
          <Stack.Screen 
            name="ManualAdd" 
            component={ManualAddScreen}
            options={{ title: 'Cadastro Manual' }}
          />
          <Stack.Screen 
            name="QRCode" 
            component={QRCodeScreen}
            options={{ title: 'Meu QR Code' }}
          />
          <Stack.Screen 
            name="PublicCollection" 
            component={PublicCollectionScreen}
            options={{ title: 'Coleção Pública' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

