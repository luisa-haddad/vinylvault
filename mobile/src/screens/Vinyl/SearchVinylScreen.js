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
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../config/api';

export default function SearchVinylScreen({ navigation, route }) {
  const { initialResults, barcode } = route.params || {};
  
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState(initialResults || []);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [adding, setAdding] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [pagination, setPagination] = useState(null);
  
  // Autocomplete
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce para autocomplete
  useEffect(() => {
    // Não busca sugestões se já estiver fazendo busca principal
    if (isSearching) {
      return;
    }
    
    if (!searchQuery.trim() || searchQuery.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      setLoadingSuggestions(false);
      return;
    }

    setLoadingSuggestions(true);
    
    const debounceTimer = setTimeout(async () => {
      // Verifica novamente antes de buscar
      if (isSearching) {
        setLoadingSuggestions(false);
        return;
      }
      
      try {
        const response = await api.get('/vinyls/search', {
          params: { 
            query: searchQuery,
            page: 1,
            per_page: 5  // Apenas 5 sugestões
          }
        });

        // Só atualiza se não começou busca principal
        if (!isSearching) {
          const results = response.data.data || [];
          setSuggestions(results);
          setShowSuggestions(results.length > 0);
        }
      } catch (error) {
        console.error('Erro ao buscar sugestões:', error);
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 500); // Aguarda 500ms após parar de digitar

    return () => {
      clearTimeout(debounceTimer);
      setLoadingSuggestions(false);
    };
  }, [searchQuery, isSearching]);

  function handleSelectSuggestion(item) {
    // Ao selecionar uma sugestão, adiciona direto
    setShowSuggestions(false);
    setSuggestions([]);
    handleAddVinyl(item);
  }

  async function handleSearch() {
    if (!searchQuery.trim()) return;

    // Marca que está fazendo busca principal (cancela autocomplete)
    setIsSearching(true);
    
    // Esconde sugestões imediatamente ao clicar em buscar
    setShowSuggestions(false);
    setSuggestions([]);
    setLoadingSuggestions(false);
    
    setLoading(true);
    setCurrentPage(1);
    setHasMore(true);
    
    try {
      const response = await api.get('/vinyls/search', {
        params: { 
          query: searchQuery,
          page: 1,
          per_page: 20
        }
      });

      // Recebe resultados e paginação
      const results = response.data.data || [];
      const paginationData = response.data.pagination;
      
      setResults(results);
      setPagination(paginationData);
      
      // Verifica se há mais páginas
      if (paginationData) {
        setHasMore(paginationData.page < paginationData.pages);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Erro ao buscar:', error);
      Alert.alert('Erro', 'Não foi possível buscar discos');
    } finally {
      setLoading(false);
      // Permite autocomplete novamente após busca terminar
      setTimeout(() => setIsSearching(false), 1000);
    }
  }

  async function loadMore() {
    if (loadingMore || !hasMore || !searchQuery.trim()) return;

    setLoadingMore(true);
    const nextPage = currentPage + 1;
    
    try {
      const response = await api.get('/vinyls/search', {
        params: { 
          query: searchQuery,
          page: nextPage,
          per_page: 20
        }
      });

      const newResults = response.data.data || [];
      const paginationData = response.data.pagination;
      
      // Remove duplicatas comparando por source + id
      setResults(prev => {
        const existingIds = new Set(prev.map(item => `${item.source}-${item.id}`));
        const uniqueNewResults = newResults.filter(
          item => !existingIds.has(`${item.source}-${item.id}`)
        );
        return [...prev, ...uniqueNewResults];
      });
      
      setPagination(paginationData);
      setCurrentPage(nextPage);
      
      // Verifica se há mais páginas
      if (paginationData) {
        setHasMore(paginationData.page < paginationData.pages);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Erro ao carregar mais:', error);
      Alert.alert('Erro', 'Não foi possível carregar mais resultados');
    } finally {
      setLoadingMore(false);
    }
  }

  async function handleAddVinyl(item) {
    setAdding(item.id);
    
    try {
      // Buscar detalhes completos se for do Discogs
      let vinylData = { ...item };
      
      if (item.source === 'discogs') {
        const detailsResponse = await api.get(`/vinyls/discogs/${item.id}`);
        vinylData = detailsResponse.data.data;
      }

      // Navegar para tela de confirmação/edição antes de salvar
      navigation.navigate('ManualAdd', {
        prefillData: vinylData,
        barcode: barcode
      });
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error);
      Alert.alert('Erro', 'Não foi possível obter detalhes do disco');
    } finally {
      setAdding(null);
    }
  }

  function renderResult({ item }) {
    const isAdding = adding === item.id;

    return (
      <TouchableOpacity
        style={styles.resultCard}
        onPress={() => handleAddVinyl(item)}
        disabled={isAdding}
      >
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
            {item.year && <Text style={styles.metaText}>{item.year}</Text>}
            {item.format && <Text style={styles.metaText}>• {item.format}</Text>}
          </View>

          <Text style={styles.source}>
            Fonte: {item.source === 'discogs' ? 'Discogs' : 'MusicBrainz'}
          </Text>
        </View>

        {isAdding ? (
          <ActivityIndicator color="#ff6b6b" />
        ) : (
          <Ionicons name="add-circle" size={32} color="#ff6b6b" />
        )}
      </TouchableOpacity>
    );
  }

  function renderFooter() {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator color="#ff6b6b" size="large" />
        <Text style={styles.footerText}>Carregando mais discos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Barra de busca */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Nome do disco ou artista..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            onBlur={() => {
              // Esconde sugestões quando perder o foco (com delay para permitir clique)
              setTimeout(() => {
                setShowSuggestions(false);
                setLoadingSuggestions(false);
              }, 200);
            }}
            onFocus={() => {
              // Só mostra sugestões de novo se não estiver fazendo busca principal
              if (suggestions.length > 0 && !isSearching && !loading) {
                setShowSuggestions(true);
              }
            }}
            returnKeyType="search"
          />
          {loadingSuggestions && (
            <ActivityIndicator color="#ff6b6b" size="small" style={styles.inputLoader} />
          )}
        </View>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Ionicons name="search" size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      {/* Sugestões de Autocomplete */}
      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((item) => (
            <TouchableOpacity
              key={`${item.source}-${item.id}`}
              style={styles.suggestionItem}
              onPress={() => handleSelectSuggestion(item)}
            >
              {item.coverImage ? (
                <Image source={{ uri: item.coverImage }} style={styles.suggestionCover} />
              ) : (
                <View style={[styles.suggestionCover, styles.placeholderCover]}>
                  <Ionicons name="disc" size={16} color="#666" />
                </View>
              )}
              <View style={styles.suggestionInfo}>
                <Text style={styles.suggestionTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.suggestionArtist} numberOfLines={1}>
                  {item.artist}
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={16} color="#666" />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Resultados */}
      {results.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={64} color="#666" />
          <Text style={styles.emptyText}>
            {initialResults ? 'Nenhum resultado encontrado' : 'Faça uma busca para encontrar discos'}
          </Text>
          {initialResults && (
            <TouchableOpacity
              style={styles.manualButton}
              onPress={() => navigation.replace('ManualAdd', { barcode })}
            >
              <Text style={styles.manualButtonText}>Cadastrar Manualmente</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => `${item.source}-${item.id}`}
          renderItem={renderResult}
          contentContainerStyle={styles.listContent}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
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
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 16,
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
  searchButton: {
    width: 48,
    height: 48,
    backgroundColor: '#ff6b6b',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  resultCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
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
    gap: 4,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#999',
  },
  source: {
    fontSize: 11,
    color: '#666',
    fontStyle: 'italic',
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
    textAlign: 'center',
    marginTop: 16,
  },
  manualButton: {
    marginTop: 24,
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  manualButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    marginTop: 8,
    color: '#999',
    fontSize: 14,
  },
  inputLoader: {
    marginLeft: 8,
  },
  suggestionsContainer: {
    marginHorizontal: 16,
    marginTop: -8,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  suggestionCover: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 12,
  },
  suggestionInfo: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  suggestionArtist: {
    fontSize: 12,
    color: '#999',
  },
});

