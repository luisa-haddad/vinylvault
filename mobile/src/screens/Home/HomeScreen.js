import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../config/api';

export default function HomeScreen({ navigation }) {
  const [vinyls, setVinyls] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Buscar dados ao entrar na tela
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  async function loadData() {
    try {
      const [vinylsResponse, categoriesResponse] = await Promise.all([
        api.get('/vinyls'),
        api.get('/categories'),
      ]);

      setVinyls(vinylsResponse.data.data);
      setCategories(categoriesResponse.data.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function onRefresh() {
    setRefreshing(true);
    loadData();
  }

  // Agrupar discos por categoria
  function getVinylsByCategory(categoryId) {
    return vinyls.filter(vinyl => vinyl.categoryId === categoryId);
  }

  // Renderizar uma categoria (estante)
  function renderCategory({ item: category }) {
    const categoryVinyls = getVinylsByCategory(category.id);

    if (categoryVinyls.length === 0) return null;

    return (
      <View style={styles.categorySection}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryEmoji}>{category.icon}</Text>
          <Text style={styles.categoryName}>{category.name}</Text>
          <Text style={styles.categoryCount}>{categoryVinyls.length}</Text>
        </View>

        <FlatList
          horizontal
          data={categoryVinyls}
          keyExtractor={(item) => item.id}
          renderItem={renderVinyl}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.vinylList}
        />
      </View>
    );
  }

  // Renderizar um disco
  function renderVinyl({ item }) {
    return (
      <TouchableOpacity
        style={styles.vinylCard}
        onPress={() => navigation.navigate('VinylDetail', { vinylId: item.id })}
      >
        {item.coverImage ? (
          <Image source={{ uri: item.coverImage }} style={styles.cover} />
        ) : (
          <View style={[styles.cover, styles.placeholderCover]}>
            <Ionicons name="disc" size={48} color="#666" />
          </View>
        )}
        <Text style={styles.vinylTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.vinylArtist} numberOfLines={1}>
          {item.artist}
        </Text>
      </TouchableOpacity>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6b6b" />
      </View>
    );
  }

  if (vinyls.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="disc-outline" size={80} color="#666" />
        <Text style={styles.emptyTitle}>Sua coleção está vazia</Text>
        <Text style={styles.emptyText}>
          Adicione seu primeiro disco usando o botão + abaixo
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={renderCategory}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ff6b6b"
          />
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  listContent: {
    padding: 16,
  },
  categorySection: {
    marginBottom: 32,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  categoryCount: {
    fontSize: 14,
    color: '#999',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  vinylList: {
    paddingRight: 16,
  },
  vinylCard: {
    width: 140,
    marginRight: 16,
  },
  cover: {
    width: 140,
    height: 140,
    borderRadius: 8,
    marginBottom: 8,
  },
  placeholderCover: {
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vinylTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  vinylArtist: {
    fontSize: 12,
    color: '#999',
  },
});

