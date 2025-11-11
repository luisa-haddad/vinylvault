import React, { useState, useEffect } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import api from '../../config/api';

export default function PublicCollectionScreen({ route }) {
  const { token } = route.params;
  
  const [collection, setCollection] = useState(null);
  const [filteredVinyls, setFilteredVinyls] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCollection();
  }, []);

  useEffect(() => {
    if (!collection) return;

    if (searchQuery.trim() === '') {
      setFilteredVinyls(collection.vinyls);
    } else {
      const filtered = collection.vinyls.filter(
        (vinyl) =>
          vinyl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vinyl.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vinyl.category.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredVinyls(filtered);
    }
  }, [searchQuery, collection]);

  async function loadCollection() {
    try {
      const response = await api.get(`/public/collection/${token}`);
      setCollection(response.data.data);
      setFilteredVinyls(response.data.data.vinyls);
    } catch (error) {
      console.error('Erro ao carregar coleção:', error);
      setError(
        error.response?.status === 404
          ? 'Coleção não encontrada'
          : error.response?.status === 403
          ? 'Esta coleção é privada'
          : 'Erro ao carregar coleção'
      );
    } finally {
      setLoading(false);
    }
  }

  function renderVinyl({ item }) {
    return (
      <View style={styles.vinylCard}>
        {item.coverImage ? (
          <Image source={{ uri: item.coverImage }} style={styles.cover} />
        ) : (
          <View style={[styles.cover, styles.placeholderCover]}>
            <Ionicons name="disc" size={32} color="#666" />
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {item.artist}
          </Text>
          <View style={styles.meta}>
            {item.year && <Text style={styles.year}>{item.year}</Text>}
            <Text style={styles.category}>
              {item.category.icon} {item.category.name}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6b6b" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#666" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header com info do dono */}
      <View style={styles.header}>
        <View style={styles.ownerInfo}>
          {collection.owner.avatar ? (
            <Image source={{ uri: collection.owner.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={24} color="#666" />
            </View>
          )}
          <View>
            <Text style={styles.collectionTitle}>Coleção de</Text>
            <Text style={styles.ownerName}>{collection.owner.name}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{collection.stats.total}</Text>
            <Text style={styles.statLabel}>Discos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {Object.keys(collection.stats.byCategory).length}
            </Text>
            <Text style={styles.statLabel}>Categorias</Text>
          </View>
        </View>
      </View>

      {/* Busca */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por título, artista ou categoria..."
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
          <Text style={styles.emptyText}>Nenhum disco encontrado</Text>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 24,
  },
  errorText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  header: {
    backgroundColor: '#1a1a1a',
    padding: 16,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  collectionTitle: {
    fontSize: 12,
    color: '#999',
  },
  ownerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
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
  vinylCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  cover: {
    width: 80,
    height: 80,
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
    justifyContent: 'center',
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
    marginBottom: 8,
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

