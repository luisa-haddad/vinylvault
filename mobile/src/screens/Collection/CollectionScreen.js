import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../config/api';

export default function CollectionScreen({ navigation }) {
  const [vinyls, setVinyls] = useState([]);
  const [filteredVinyls, setFilteredVinyls] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  async function loadData() {
    try {
      const [vinylsResponse, statsResponse] = await Promise.all([
        api.get('/vinyls'),
        api.get('/vinyls/stats'),
      ]);

      setVinyls(vinylsResponse.data.data);
      setFilteredVinyls(vinylsResponse.data.data);
      setStats(statsResponse.data.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  }

  // Filtrar discos pela busca
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredVinyls(vinyls);
    } else {
      const filtered = vinyls.filter(
        (vinyl) =>
          vinyl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vinyl.artist.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredVinyls(filtered);
    }
  }, [searchQuery, vinyls]);

  function renderVinyl({ item }) {
    return (
      <TouchableOpacity
        style={styles.vinylItem}
        onPress={() => navigation.navigate('VinylDetail', { vinylId: item.id })}
      >
        {item.coverImage ? (
          <Image source={{ uri: item.coverImage }} style={styles.cover} />
        ) : (
          <View style={[styles.cover, styles.placeholderCover]}>
            <Ionicons name="disc" size={32} color="#666" />
          </View>
        )}
        
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {item.artist}
          </Text>
          <View style={styles.meta}>
            {item.year && (
              <Text style={styles.year}>{item.year}</Text>
            )}
            <Text style={styles.category}>{item.category.icon} {item.category.name}</Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#666" />
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

  return (
    <View style={styles.container}>
      {/* Estatísticas */}
      {stats && (
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>Discos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.byCategory?.length || 0}</Text>
            <Text style={styles.statLabel}>Categorias</Text>
          </View>
          {stats.totalValue > 0 && (
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                R$ {stats.totalValue.toFixed(0)}
              </Text>
              <Text style={styles.statLabel}>Valor Total</Text>
            </View>
          )}
        </View>
      )}

      {/* Busca */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por título ou artista..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de discos */}
      {filteredVinyls.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={64} color="#666" />
          <Text style={styles.emptyText}>
            {searchQuery ? 'Nenhum disco encontrado' : 'Sua coleção está vazia'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredVinyls}
          keyExtractor={(item) => item.id}
          renderItem={renderVinyl}
          contentContainerStyle={styles.listContent}
        />
      )}
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
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6b6b',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    margin: 16,
    marginTop: 0,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 12,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  vinylItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  cover: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  placeholderCover: {
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  artist: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 4,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  year: {
    fontSize: 12,
    color: '#999',
  },
  category: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
});

