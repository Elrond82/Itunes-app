const BASE_URL = 'https://itunes.apple.com';

export const itunesService = {
  // Buscar álbumes de un artista específico
  getAlbumsByArtist: async (artistName) => {
    try {
      // Buscamos álbumes donde el término sea el artista
      const response = await fetch(`${BASE_URL}/search?term=${encodeURIComponent(artistName)}&entity=album&attribute=artistTerm`);
      const data = await response.json();
      return data.results;
    } catch (error) {
      return [];
    }
  },

  // Buscar álbumes por su propio nombre
  getAlbumsByTitle: async (albumTitle) => {
    try {
      const response = await fetch(`${BASE_URL}/search?term=${encodeURIComponent(albumTitle)}&entity=album&attribute=albumTerm`);
      const data = await response.json();
      return data.results;
    } catch (error) {
      return [];
    }
  },

  getSongs: async (collectionId) => {
    try {
      const response = await fetch(`${BASE_URL}/lookup?id=${collectionId}&entity=song`);
      const data = await response.json();
      return data.results.slice(1);
    } catch (error) {
      return [];
    }
  }
};

export const formatTime = (ms) => {
  const min = Math.floor(ms / 60000);
  const sec = ((ms % 60000) / 1000).toFixed(0);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};