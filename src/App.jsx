import React, { useState } from 'react';
import { itunesService, formatTime } from './services/itunesService';

function App() {
  const [artistInput, setArtistInput] = useState('');
  const [albumInput, setAlbumInput] = useState('');
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [loadingSongs, setLoadingSongs] = useState(false);

  // Búsqueda por Artista
  const handleSearchArtist = async () => {
    if (!artistInput) return;
    const results = await itunesService.getAlbumsByArtist(artistInput);
    setAlbums(results);
    setSongs([]);
    setSelectedAlbum(null);
  };

  // Búsqueda por Álbum
  const handleSearchAlbum = async () => {
    if (!albumInput) return;
    const results = await itunesService.getAlbumsByTitle(albumInput);
    setAlbums(results);
    setSongs([]);
    setSelectedAlbum(null);
  };

  // ESTA ES LA FUNCIÓN CLAVE: Al hacer CLICK en el disco
  const handleAlbumClick = async (album) => {
    setLoadingSongs(true);
    setSelectedAlbum(album);
    
    // Llamamos a la API para traer los temas de este disco específico
    const tracks = await itunesService.getSongs(album.collectionId);
    setSongs(tracks);
    setLoadingSongs(false);

    // Scroll suave hacia los temas para mejor UX
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
      <header style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        marginBottom: '40px' 
      }}>
        <img 
          src="/tu-imagen.png" 
          style={{ width: '100%', maxWidth: '400px', height: 'auto' }} 
          alt="Mi Logo" 
        />
        <h1 style={{ color: '#333', marginTop: '20px' }}>iTunes Music Explorer</h1>
      </header>

      {/* SECCIÓN DE BUSCADORES */}
      <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', marginBottom: '40px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label>Buscar por Artista</label>
          <div style={{ display: 'flex', gap: '5px' }}>
            <input 
              placeholder="Ej: Green Day..." 
              value={artistInput}
              onChange={(e) => setArtistInput(e.target.value)}
              style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <button onClick={handleSearchArtist} style={{ padding: '8px 15px', cursor: 'pointer', background: '#e1e1e1', border: '1px solid #999', borderRadius: '5px' }}>Buscar</button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label>Buscar por Disco</label>
          <div style={{ display: 'flex', gap: '5px' }}>
            <input 
              type="text" 
              placeholder="Ej: American Idiot..." 
              value={albumInput}
              onChange={(e) => setAlbumInput(e.target.value)}
              style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <button onClick={handleSearchAlbum} style={{ padding: '8px 15px', cursor: 'pointer', background: '#e1e1e1', border: '1px solid #999', borderRadius: '5px' }}>Buscar</button>
          </div>
        </div>
      </div>

      {/* NIVEL 2: GRILLA DE ÁLBUMES */}
      {albums.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '20px', marginBottom: '50px' }}>
          {albums.map(album => (
            <div 
              key={album.collectionId} 
              onClick={() => handleAlbumClick(album)}
              style={{ 
                cursor: 'pointer', 
                textAlign: 'center', 
                padding: '10px', 
                borderRadius: '10px',
                transition: 'transform 0.2s',
                border: selectedAlbum?.collectionId === album.collectionId ? '2px solid #0070c9' : '1px solid transparent',
                backgroundColor: selectedAlbum?.collectionId === album.collectionId ? '#f0f8ff' : 'transparent'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <img src={album.artworkUrl100.replace('100x100', '200x200')} alt="cover" style={{ width: '100%', borderRadius: '5px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }} />
              <p style={{ fontSize: '13px', fontWeight: 'bold', margin: '10px 0 5px 0', height: '32px', overflow: 'hidden' }}>{album.collectionName}</p>
              <p style={{ fontSize: '12px', color: '#666' }}>{album.artistName}</p>
            </div>
          ))}
        </div>
      )}

      {/* NIVEL 3: LISTA DE TEMAS (Se activa al hacer click arriba) */}
      {loadingSongs && <p style={{ textAlign: 'center' }}>Cargando canciones...</p>}
      
      {!loadingSongs && songs.length > 0 && (
        <div style={{ background: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 -5px 20px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '25px', marginBottom: '30px' }}>
            <img src={selectedAlbum?.artworkUrl100.replace('100x100', '150x150')} alt="cover" style={{ borderRadius: '8px' }} />
            <div>
              <h2 style={{ margin: 0 }}>{selectedAlbum?.collectionName}</h2>
              <p style={{ color: '#0070c9', fontWeight: 'bold', fontSize: '18px' }}>{selectedAlbum?.artistName}</p>
              <p style={{ color: '#888' }}>{selectedAlbum?.primaryGenreName} • {selectedAlbum?.releaseDate.split('-')[0]}</p>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee', color: '#888', fontSize: '14px' }}>
                <th style={{ padding: '10px' }}>#</th>
                <th style={{ padding: '10px' }}>TÍTULO</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>DURACIÓN</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song, index) => (
                <tr key={song.trackId} style={{ borderBottom: '1px solid #f2f2f2' }}>
                  <td style={{ padding: '12px 10px', color: '#aaa' }}>{index + 1}</td>
                  <td style={{ padding: '12px 10px', fontWeight: '500' }}>{song.trackName}</td>
                  <td style={{ padding: '12px 10px', textAlign: 'right', color: '#666' }}>{formatTime(song.trackTimeMillis)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;