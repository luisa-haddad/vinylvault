import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import api from '../../config/api';

export default function ManualAddScreen({ navigation, route }) {
  const { prefillData, barcode } = route.params || {};

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Dados do formulário
  const [title, setTitle] = useState(prefillData?.title || '');
  const [artist, setArtist] = useState(prefillData?.artist || '');
  const [year, setYear] = useState(prefillData?.year?.toString() || '');
  const [categoryId, setCategoryId] = useState(prefillData?.categoryId || '');
  const [coverImage, setCoverImage] = useState(prefillData?.coverImage || null);
  const [label, setLabel] = useState(prefillData?.label || '');
  const [format, setFormat] = useState(prefillData?.format || '');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data);
      
      // Se não tem categoria selecionada, seleciona a primeira
      if (!categoryId && response.data.data.length > 0) {
        setCategoryId(response.data.data[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  }

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de permissão para acessar suas fotos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setCoverImage(result.assets[0].uri);
    }
  }

  async function handleSave() {
    if (!title || !artist || !categoryId) {
      Alert.alert('Erro', 'Preencha pelo menos título, artista e categoria');
      return;
    }

    setLoading(true);

    try {
      const data = {
        title,
        artist,
        categoryId,
        year: year ? parseInt(year) : null,
        coverImage: coverImage || null,
        barcode: barcode || prefillData?.barcode || null,
        label: label || null,
        format: format || null,
        notes: notes || null,
        discogsId: prefillData?.id ? String(prefillData.id) : null,
      };

      // Se tem tracks no prefillData, adiciona (apenas se forem válidas)
      if (prefillData?.tracks && Array.isArray(prefillData.tracks) && prefillData.tracks.length > 0) {
        // Filtra tracks válidas (que têm position e title)
        const validTracks = prefillData.tracks.filter(
          track => track.position && track.title
        );
        if (validTracks.length > 0) {
          data.tracks = validTracks;
        }
      }

      console.log('📤 Enviando para API:', JSON.stringify(data, null, 2));

      await api.post('/vinyls', data);

      Alert.alert(
        'Sucesso!',
        'Disco adicionado à sua coleção',
        [
          {
            text: 'OK',
            onPress: () => {
              // Voltar para a home
              navigation.navigate('MainTabs', { screen: 'Home' });
            },
          },
        ]
      );
    } catch (error) {
      console.error('❌ Erro ao salvar:', error);
      console.error('❌ Resposta do servidor:', error.response?.data);
      
      let errorMessage = 'Não foi possível adicionar o disco';
      
      if (error.response?.data?.errors) {
        // Mostra erros de validação detalhados
        const errorDetails = error.response.data.errors
          .map(e => `${e.field}: ${e.message}`)
          .join('\n');
        errorMessage = `Erros de validação:\n${errorDetails}`;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Imagem da capa */}
      <TouchableOpacity style={styles.coverContainer} onPress={pickImage}>
        {coverImage ? (
          <Image source={{ uri: coverImage }} style={styles.cover} />
        ) : (
          <View style={styles.placeholderCover}>
            <Ionicons name="image-outline" size={48} color="#666" />
            <Text style={styles.placeholderText}>Toque para adicionar capa</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Formulário */}
      <View style={styles.form}>
        <Text style={styles.label}>Título *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Nome do disco"
          placeholderTextColor="#666"
        />

        <Text style={styles.label}>Artista *</Text>
        <TextInput
          style={styles.input}
          value={artist}
          onChangeText={setArtist}
          placeholder="Nome do artista/banda"
          placeholderTextColor="#666"
        />

        <Text style={styles.label}>Categoria *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                categoryId === category.id && styles.categoryChipActive,
              ]}
              onPress={() => setCategoryId(category.id)}
            >
              <Text style={styles.categoryEmoji}>{category.icon}</Text>
              <Text
                style={[
                  styles.categoryName,
                  categoryId === category.id && styles.categoryNameActive,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>Ano</Text>
        <TextInput
          style={styles.input}
          value={year}
          onChangeText={setYear}
          placeholder="Ex: 1975"
          placeholderTextColor="#666"
          keyboardType="numeric"
          maxLength={4}
        />

        <Text style={styles.label}>Gravadora</Text>
        <TextInput
          style={styles.input}
          value={label}
          onChangeText={setLabel}
          placeholder="Nome da gravadora"
          placeholderTextColor="#666"
        />

        <Text style={styles.label}>Formato</Text>
        <TextInput
          style={styles.input}
          value={format}
          onChangeText={setFormat}
          placeholder="Ex: LP, EP, Single"
          placeholderTextColor="#666"
        />

        <Text style={styles.label}>Notas</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Adicione observações sobre o disco"
          placeholderTextColor="#666"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark" size={24} color="#fff" />
              <Text style={styles.saveButtonText}>Adicionar à Coleção</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    padding: 16,
  },
  coverContainer: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  cover: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  placeholderCover: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#333',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    marginTop: 8,
    fontSize: 14,
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ccc',
    marginBottom: -8,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  categoriesScroll: {
    marginBottom: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  categoryChipActive: {
    backgroundColor: '#ff6b6b',
    borderColor: '#ff6b6b',
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryName: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryNameActive: {
    color: '#fff',
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    gap: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

