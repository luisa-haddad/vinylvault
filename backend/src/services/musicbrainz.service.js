const axios = require('axios');

class MusicBrainzService {
  constructor() {
    this.baseURL = 'https://musicbrainz.org/ws/2';
    this.userAgent = process.env.MUSICBRAINZ_USER_AGENT || 'VinylVault/1.0.0';
    // MusicBrainz requer rate limiting de 1 req/sec
    this.lastRequestTime = 0;
  }

  // Rate limiting
  async waitForRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const minDelay = 1000; // 1 segundo

    if (timeSinceLastRequest < minDelay) {
      await new Promise(resolve => setTimeout(resolve, minDelay - timeSinceLastRequest));
    }

    this.lastRequestTime = Date.now();
  }

  // Buscar releases
  async search(query, type = 'release') {
    try {
      await this.waitForRateLimit();

      const response = await axios.get(`${this.baseURL}/${type}`, {
        params: {
          query,
          fmt: 'json',
          limit: 20
        },
        headers: {
          'User-Agent': this.userAgent
        }
      });

      const results = response.data[`${type}s`] || [];
      return await this.formatResults(results, type);
    } catch (error) {
      console.error('Erro ao buscar no MusicBrainz:', error.message);
      return [];
    }
  }

  // Buscar por barcode
  async searchByBarcode(barcode) {
    try {
      await this.waitForRateLimit();

      const response = await axios.get(`${this.baseURL}/release`, {
        params: {
          query: `barcode:${barcode}`,
          fmt: 'json',
          limit: 20
        },
        headers: {
          'User-Agent': this.userAgent
        }
      });

      return await this.formatResults(response.data.releases || [], 'release');
    } catch (error) {
      console.error('Erro ao buscar no MusicBrainz por barcode:', error.message);
      return [];
    }
  }

  // Obter detalhes de um release
  async getRelease(releaseId) {
    try {
      await this.waitForRateLimit();

      const response = await axios.get(`${this.baseURL}/release/${releaseId}`, {
        params: {
          inc: 'artists+labels+recordings+release-groups',
          fmt: 'json'
        },
        headers: {
          'User-Agent': this.userAgent
        }
      });

      return await this.formatReleaseDetails(response.data);
    } catch (error) {
      console.error('Erro ao buscar detalhes no MusicBrainz:', error.message);
      throw error;
    }
  }

  // Obter cover art do Cover Art Archive
  async getCoverArt(releaseId) {
    try {
      const response = await axios.get(`https://coverartarchive.org/release/${releaseId}`, {
        headers: {
          'User-Agent': this.userAgent
        },
        timeout: 5000 // 5 segundos timeout
      });

      // Pegar a imagem principal (front) ou a primeira disponível
      const images = response.data.images || [];
      const frontImage = images.find(img => img.front === true);
      
      return frontImage ? frontImage.image : (images[0]?.image || null);
    } catch (error) {
      // Se não encontrar, retorna null silenciosamente
      return null;
    }
  }

  // Formatar resultados (busca capas em paralelo)
  async formatResults(results, type) {
    const formatted = await Promise.all(
      results.map(async (item) => {
        // Buscar cover art do Cover Art Archive
        const coverImage = await this.getCoverArt(item.id);
        
        return {
          id: item.id,
          source: 'musicbrainz',
          title: item.title,
          artist: this.extractArtist(item),
          year: this.extractYear(item),
          coverImage,
          format: item.media?.[0]?.format || null,
          label: item['label-info']?.[0]?.label?.name || null,
          country: item.country || null,
          barcode: item.barcode || null,
          musicbrainzId: item.id
        };
      })
    );
    
    return formatted;
  }

  // Formatar detalhes (com cover art)
  async formatReleaseDetails(data) {
    const coverImage = await this.getCoverArt(data.id);
    
    return {
      id: data.id,
      source: 'musicbrainz',
      title: data.title,
      artist: data['artist-credit']?.map(a => a.name).join(', ') || 'Unknown',
      year: this.extractYear(data),
      coverImage,
      format: data.media?.[0]?.format || null,
      label: data['label-info']?.[0]?.label?.name || null,
      country: data.country || null,
      barcode: data.barcode || null,
      tracks: this.formatTracks(data.media || []),
      musicbrainzId: data.id
    };
  }

  // Formatar tracks
  formatTracks(media) {
    const tracks = [];
    
    media.forEach((medium, mediumIndex) => {
      medium.tracks?.forEach((track, trackIndex) => {
        tracks.push({
          position: `${mediumIndex + 1}.${trackIndex + 1}`,
          title: track.title,
          duration: this.formatDuration(track.length)
        });
      });
    });

    return tracks;
  }

  // Formatar duração (ms para MM:SS)
  formatDuration(milliseconds) {
    if (!milliseconds) return null;
    
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Extrair artista
  extractArtist(item) {
    if (item['artist-credit']) {
      return item['artist-credit'].map(a => a.name).join(', ');
    }
    return 'Unknown Artist';
  }

  // Extrair ano
  extractYear(item) {
    if (item.date) {
      return parseInt(item.date.split('-')[0]);
    }
    if (item['release-group']?.['first-release-date']) {
      return parseInt(item['release-group']['first-release-date'].split('-')[0]);
    }
    return null;
  }
}

module.exports = new MusicBrainzService();

