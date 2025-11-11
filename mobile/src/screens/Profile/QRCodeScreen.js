import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Share,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import api from '../../config/api';

export default function QRCodeScreen() {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQRCode();
  }, []);

  async function loadQRCode() {
    try {
      const response = await api.get('/users/qrcode');
      setQrData(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar QR Code:', error);
      Alert.alert('Erro', 'Não foi possível carregar o QR Code');
    } finally {
      setLoading(false);
    }
  }

  async function handleShare() {
    try {
      await Share.share({
        message: `Confira minha coleção de discos no VinylVault!\n\n${qrData.publicUrl}`,
        url: qrData.publicUrl,
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  }

  async function handleRegenerate() {
    Alert.alert(
      'Regenerar QR Code',
      'Isso irá invalidar o QR Code anterior. Links compartilhados anteriormente não funcionarão mais.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Regenerar',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await api.post('/users/qrcode/regenerate');
              await loadQRCode();
              Alert.alert('Sucesso', 'QR Code regenerado com sucesso');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível regenerar o QR Code');
            } finally {
              setLoading(false);
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

  if (!qrData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Erro ao carregar QR Code</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Título */}
        <View style={styles.header}>
          <Ionicons name="qr-code" size={48} color="#ff6b6b" />
          <Text style={styles.title}>Compartilhe sua Coleção</Text>
          <Text style={styles.subtitle}>
            Qualquer pessoa que escanear este QR Code poderá ver sua coleção de discos
          </Text>
        </View>

        {/* QR Code */}
        <View style={styles.qrContainer}>
          <QRCode
            value={qrData.publicUrl}
            size={250}
            backgroundColor="white"
            color="black"
          />
        </View>

        {/* URL */}
        <View style={styles.urlContainer}>
          <Text style={styles.urlLabel}>Link público:</Text>
          <Text style={styles.urlText} numberOfLines={1}>
            {qrData.publicUrl}
          </Text>
        </View>

        {/* Botões de ação */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={20} color="#fff" />
            <Text style={styles.shareButtonText}>Compartilhar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.regenerateButton} onPress={handleRegenerate}>
            <Ionicons name="refresh-outline" size={20} color="#999" />
            <Text style={styles.regenerateButtonText}>Regenerar QR Code</Text>
          </TouchableOpacity>
        </View>

        {/* Dica */}
        <View style={styles.tipContainer}>
          <Ionicons name="information-circle-outline" size={20} color="#999" />
          <Text style={styles.tipText}>
            Ao regenerar o QR Code, o anterior será invalidado
          </Text>
        </View>
      </View>
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
  errorText: {
    color: '#999',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  qrContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignSelf: 'center',
    marginBottom: 24,
  },
  urlContainer: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  urlLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  urlText: {
    fontSize: 14,
    color: '#fff',
  },
  actions: {
    gap: 12,
    marginBottom: 24,
  },
  shareButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  regenerateButton: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  regenerateButtonText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '600',
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    color: '#999',
    lineHeight: 18,
  },
});

