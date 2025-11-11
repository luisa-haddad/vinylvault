import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../config/api';

export default function VinylDetailScreen({ navigation, route }) {
  const { vinylId } = route.params;
  
  const [vinyl, setVinyl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVinyl();
  }, []);

  async function loadVinyl() {
    try {
      const response = await api.get(`/vinyls/${vinylId}`);
      setVinyl(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar disco:', error);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes do disco');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    Alert.alert(
      'Remover disco',
      'Tem certeza que deseja remover este disco da sua coleção?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/vinyls/${vinylId}`);
              Alert.alert('Sucesso', 'Disco removido da coleção', [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ]);
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível remover o disco');
            }
          },
        },
      ]
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6b6b" />
      </View>
    );
  }

  if (!vinyl) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Disco não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Capa */}
      <View style={styles.header}>
        {vinyl.coverImage ? (
          <Image source={{ uri: vinyl.coverImage }} style={styles.cover} />
        ) : (
          <View style={[styles.cover, styles.placeholderCover]}>
            <Ionicons name="disc" size={80} color="#666" />
          </View>
        )}
      </View>

      {/* Informações principais */}
      <View style={styles.mainInfo}>
        <View style={styles.categoryBadge} style={{ backgroundColor: vinyl.category.color + '20' }}>
          <Text style={styles.categoryEmoji}>{vinyl.category.icon}</Text>
          <Text style={[styles.categoryText, { color: vinyl.category.color }]}>
            {vinyl.category.name}
          </Text>
        </View>

        <Text style={styles.title}>{vinyl.title}</Text>
        <Text style={styles.artist}>{vinyl.artist}</Text>

        {vinyl.year && (
          <Text style={styles.year}>{vinyl.year}</Text>
        )}
      </View>

      {/* Detalhes */}
      <View style={styles.detailsSection}>
        {vinyl.label && (
          <View style={styles.detailRow}>
            <Ionicons name="business-outline" size={20} color="#999" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Gravadora</Text>
              <Text style={styles.detailValue}>{vinyl.label}</Text>
            </View>
          </View>
        )}

        {vinyl.format && (
          <View style={styles.detailRow}>
            <Ionicons name="disc-outline" size={20} color="#999" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Formato</Text>
              <Text style={styles.detailValue}>{vinyl.format}</Text>
            </View>
          </View>
        )}

        {vinyl.country && (
          <View style={styles.detailRow}>
            <Ionicons name="flag-outline" size={20} color="#999" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>País</Text>
              <Text style={styles.detailValue}>{vinyl.country}</Text>
            </View>
          </View>
        )}

        {vinyl.barcode && (
          <View style={styles.detailRow}>
            <Ionicons name="barcode-outline" size={20} color="#999" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Código de barras</Text>
              <Text style={styles.detailValue}>{vinyl.barcode}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Faixas */}
      {vinyl.tracks && vinyl.tracks.length > 0 && (
        <View style={styles.tracksSection}>
          <Text style={styles.sectionTitle}>Faixas</Text>
          {vinyl.tracks.map((track, index) => (
            <View key={track.id || index} style={styles.trackRow}>
              <Text style={styles.trackPosition}>{track.position}</Text>
              <Text style={styles.trackTitle}>{track.title}</Text>
              {track.duration && (
                <Text style={styles.trackDuration}>{track.duration}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Notas */}
      {vinyl.notes && (
        <View style={styles.notesSection}>
          <Text style={styles.sectionTitle}>Notas</Text>
          <Text style={styles.notesText}>{vinyl.notes}</Text>
        </View>
      )}

      {/* Botões de ação */}
      <View style={styles.actionsSection}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color="#fff" />
          <Text style={styles.deleteButtonText}>Remover da Coleção</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  errorText: {
    color: '#999',
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#1a1a1a',
  },
  cover: {
    width: 250,
    height: 250,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  placeholderCover: {
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainInfo: {
    padding: 24,
    alignItems: 'center',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  artist: {
    fontSize: 20,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 8,
  },
  year: {
    fontSize: 16,
    color: '#999',
  },
  detailsSection: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  detailContent: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: '#fff',
  },
  tracksSection: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  trackPosition: {
    fontSize: 14,
    color: '#999',
    width: 40,
  },
  trackTitle: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
  },
  trackDuration: {
    fontSize: 14,
    color: '#999',
  },
  notesSection: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  notesText: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
  },
  actionsSection: {
    padding: 16,
    paddingBottom: 32,
  },
  deleteButton: {
    flexDirection: 'row',
    backgroundColor: '#dc3545',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

