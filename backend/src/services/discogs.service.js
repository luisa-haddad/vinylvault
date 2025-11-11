const axios = require('axios');

class DiscogsService {
  constructor() {
    this.baseURL = 'https://api.discogs.com';
    this.token = process.env.DISCOGS_TOKEN;
    
    // Log de inicialização
    if (this.token) {
      console.log('✅ [Discogs] Token configurado! (primeiros 10 chars:', this.token.substring(0, 10) + '...)');
    } else {
      console.warn('⚠️ [Discogs] TOKEN NÃO CONFIGURADO! Configure DISCOGS_TOKEN no .env');
    }
  }

  // Headers comuns
  getHeaders() {
    return {
      'Authorization': `Discogs token=${this.token}`,
      'User-Agent': 'VinylVault/1.0.0'
    };
  }

  // Buscar por código de barras
  async searchByBarcode(barcode, page = 1, perPage = 20) {
    try {
      console.log('🔍 [Discogs] Buscando por barcode:', barcode, '| Página:', page);
      
      const response = await axios.get(`${this.baseURL}/database/search`, {
        params: {
          barcode,
          type: 'release',
          page,
          per_page: perPage
        },
        headers: this.getHeaders()
      });

      console.log('✅ [Discogs] Resposta recebida:', {
        total: response.data.results?.length || 0,
        pagination: response.data.pagination
      });

      const results = this.formatResults(response.data.results || []);
      console.log('🎵 [Discogs] Após filtrar apenas vinis:', results.length);
      
      return {
        results,
        pagination: response.data.pagination
      };
    } catch (error) {
      console.error('❌ [Discogs] Erro ao buscar por barcode:', error.message);
      if (error.response) {
        console.error('❌ [Discogs] Status:', error.response.status);
        console.error('❌ [Discogs] Data:', error.response.data);
      }
      return { results: [], pagination: null };
    }
  }

  // Buscar por query (nome do disco, artista)
  async search(query, type = 'release', page = 1, perPage = 20) {
    try {
      console.log('🔍 [Discogs] Buscando por query:', query, 'tipo:', type, '| Página:', page);
      
      const response = await axios.get(`${this.baseURL}/database/search`, {
        params: {
          q: query,
          type,
          page,
          per_page: perPage
        },
        headers: this.getHeaders()
      });

      console.log('✅ [Discogs] Resposta recebida:', {
        total: response.data.results?.length || 0,
        pagination: response.data.pagination
      });

      const results = this.formatResults(response.data.results || []);
      console.log('🎵 [Discogs] Após filtrar apenas vinis:', results.length);
      
      return {
        results,
        pagination: response.data.pagination
      };
    } catch (error) {
      console.error('❌ [Discogs] Erro ao buscar:', error.message);
      if (error.response) {
        console.error('❌ [Discogs] Status:', error.response.status);
        console.error('❌ [Discogs] Data:', error.response.data);
      }
      return { results: [], pagination: null };
    }
  }

  // Obter detalhes de um release
  async getRelease(releaseId) {
    try {
      console.log('🔍 [Discogs] Buscando detalhes do release:', releaseId);
      
      const response = await axios.get(`${this.baseURL}/releases/${releaseId}`, {
        headers: this.getHeaders()
      });

      console.log('✅ [Discogs] Detalhes recebidos:', response.data.title);
      
      return this.formatReleaseDetails(response.data);
    } catch (error) {
      console.error('❌ [Discogs] Erro ao buscar detalhes:', error.message);
      if (error.response) {
        console.error('❌ [Discogs] Status:', error.response.status);
        console.error('❌ [Discogs] Data:', error.response.data);
      }
      throw error;
    }
  }

  // Formatar resultados de busca
  formatResults(results) {
    console.log('🔄 [Discogs] Formatando resultados...');
    
    // Log dos formatos encontrados
    results.forEach((item, index) => {
      console.log(`  📀 Item ${index + 1}:`, item.title, '| Formatos:', item.format || 'N/A');
    });
    
    const filtered = results
      // Filtrar apenas vinis (Vinyl, LP, EP, 12", 7", etc.)
      .filter(item => {
        const formats = item.format || [];
        const formatString = formats.join(' ').toLowerCase();
        const isVinyl = formatString.includes('vinyl') || 
               formatString.includes('lp') || 
               formatString.includes('ep') ||
               formatString.includes('12"') ||
               formatString.includes('7"') ||
               formatString.includes('10"');
        
        if (!isVinyl) {
          console.log(`  ❌ Removido (não é vinil):`, item.title, '| Formato:', item.format);
        }
        
        return isVinyl;
      })
      .map(item => {
        // Pegar a melhor imagem disponível
        let coverImage = null;
        if (item.cover_image && !item.cover_image.includes('spacer.gif')) {
          coverImage = item.cover_image;
        } else if (item.thumb && !item.thumb.includes('spacer.gif')) {
          coverImage = item.thumb;
        }
        
      return {
        id: String(item.id), // Garante que é string
        source: 'discogs',
        title: item.title,
        artist: this.extractArtist(item),
        year: item.year || null,
        coverImage,
        format: item.format?.join(', ') || null,
        label: item.label?.join(', ') || null,
        country: item.country || null,
        barcode: item.barcode?.[0] || null,
        resourceUrl: item.resource_url,
        discogsUrl: item.uri
      };
      });
    
    console.log(`✅ [Discogs] Formatos aprovados: ${filtered.length} de ${results.length}`);
    
    return filtered;
  }

  // Formatar detalhes de um release
  formatReleaseDetails(data) {
    // Pegar a melhor imagem disponível (maior resolução)
    let coverImage = null;
    if (data.images && data.images.length > 0) {
      // Procurar por imagem do tipo 'primary' ou pegar a primeira
      const primaryImage = data.images.find(img => img.type === 'primary');
      coverImage = primaryImage ? primaryImage.uri : data.images[0].uri;
    }
    
    return {
      id: String(data.id), // Garante que é string
      source: 'discogs',
      title: data.title,
      artist: data.artists?.map(a => a.name).join(', ') || 'Unknown',
      year: data.year || null,
      coverImage,
      images: data.images?.map(img => img.uri) || [],
      format: data.formats?.map(f => f.name).join(', ') || null,
      label: data.labels?.map(l => l.name).join(', ') || null,
      country: data.country || null,
      barcode: data.identifiers?.find(i => i.type === 'Barcode')?.value || null,
      genres: data.genres || [],
      styles: data.styles || [],
      tracks: this.formatTracks(data.tracklist || []),
      notes: data.notes || null,
      discogsUrl: data.uri
    };
  }

  // Formatar tracklist
  formatTracks(tracklist) {
    return tracklist
      .filter(track => track.position && track.title) // Remove tracks inválidas
      .map(track => ({
        position: track.position,
        title: track.title,
        duration: track.duration || null
      }));
  }

  // Extrair nome do artista
  extractArtist(item) {
    if (item.title) {
      const parts = item.title.split(' - ');
      if (parts.length > 1) {
        return parts[0];
      }
    }
    return 'Unknown Artist';
  }
}

module.exports = new DiscogsService();

