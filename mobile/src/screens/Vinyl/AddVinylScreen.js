import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AddVinylScreen({ navigation }) {
  const options = [
    {
      id: 'barcode',
      title: 'Escanear Código de Barras',
      description: 'Use a câmera para escanear o código de barras do disco',
      icon: 'barcode-outline',
      color: '#4CAF50',
      screen: 'ScanBarcode',
    },
    {
      id: 'search',
      title: 'Buscar por Nome',
      description: 'Pesquise o disco pelo título ou artista',
      icon: 'search-outline',
      color: '#2196F3',
      screen: 'SearchVinyl',
    },
    {
      id: 'manual',
      title: 'Cadastro Manual',
      description: 'Adicione todas as informações manualmente',
      icon: 'create-outline',
      color: '#FF9800',
      screen: 'ManualAdd',
    },
  ];

  function handleOptionPress(screen) {
    navigation.navigate(screen);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="disc" size={64} color="#ff6b6b" />
        <Text style={styles.title}>Adicionar Disco</Text>
        <Text style={styles.subtitle}>
          Escolha como você quer adicionar o disco à sua coleção
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.optionCard}
            onPress={() => handleOptionPress(option.screen)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: option.color + '20' }]}>
              <Ionicons name={option.icon} size={32} color={option.color} />
            </View>
            
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>{option.title}</Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </View>

            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 24,
  },
  optionsContainer: {
    padding: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
  },
});

