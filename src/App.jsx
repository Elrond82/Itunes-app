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

  // Acción al hacer CLICK en un disco
  const handleAlbumClick = async (album) => {
    setLoadingSongs(true);
    setSelectedAlbum(album);
    const tracks = await itunesService.getSongs(album.collectionId);
    setSongs(tracks);
    setLoadingSongs(false);
    
    // Scroll suave hacia abajo para ver las canciones
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div style={{ 
      padding: '10px', 
      maxWidth: '1000px', 
      margin: '0 auto', 
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      backgroundColor: '#fdfdfd'
    }}>
      
      {/* HEADER RESPONSIVO */}
      <header style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        marginBottom: '30px',
        paddingTop: '20px'
      }}>
        <img 
          src="/tu-imagen.png" 
          style={{ width: '85%', maxWidth: '350px', height: 'auto' }} 
          alt="iTunes Logo" 
        />
        <h1 style={{ 
          color: '#333', 
          marginTop: '15px', 
          textAlign: 'center', 
          fontSize: '1.8rem',
          fontWeight: '700' 
        }}>
          iTunes Music Explorer
        </h1>
      </header>

      {/* SECCIÓN DE BUSCADORES (Solución para el desorden en celu) */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        justifyContent: 'center', 
        marginBottom: '40px', 
        flexWrap: 'wrap' // Crucial para que no se amontonen en el celular
      }}>
        
        {/* Buscador de Artista */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '400px', padding: '0 10px' }}>
          <label style={{ fontWeight: '600', color: '#555' }}>Buscar por Artista</label>
          <div style={{ display: 'flex', gap: '5px' }}>
            <input 
              placeholder="Ej: Green Day..." 
              value={artistInput}
              onChange={(e) => setArtistInput(e.target.value)}
              style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' }}
            />
            <button 
              onClick={handleSearchArtist} 
              style={{ padding: '0 20px', cursor: 'pointer', background: '#0070c9', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600' }}
            >
              Buscar
            </button>
          </div>
        </div>

        {/* Buscador de Disco */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '400px', padding: '0 10px' }}>
          <label style={{ fontWeight: '600', color: '#555' }}>Buscar por Disco</label>
          <div style={{ display: 'flex', gap: '5px' }}>
            <input 
              type="text" 
              placeholder="Ej: American Idiot..." 
              value={albumInput}
              onChange={(e) => setAlbumInput(e.target.value)}
              style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' }}
            />
            <button 
              onClick={handleSearchAlbum} 
              style={{ padding: '0 20px', cursor: 'pointer', background: '#0070c9', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600' }}
            >
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* NIVEL 2: GRILLA DE ÁLBUMES */}
      {albums.length > 0 && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
          gap: '15px', 
          marginBottom: '50px',
          padding: '0 10px'
        }}>
          {albums.map(album => (
            <div 
              key={album.collectionId} 
              onClick={() => handleAlbumClick(album)}
              style={{ 
                cursor: 'pointer', 
                textAlign: 'center', 
                padding: '10px', 
                borderRadius: '12px',
                border: selectedAlbum?.collectionId === album.collectionId ? '2px solid #0070c9' : '1px solid #eee',
                backgroundColor: selectedAlbum?.collectionId === album.collectionId ? '#f0f8ff' : '#fff',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
              }}
            >
              <img 
                src={album.artworkUrl100.replace('100x100', '200x200')} 
                alt="cover" 
                style={{ width: '100%', borderRadius: '8px' }} 
              />
              <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '10px 0 5px 0', color: '#333' }}>
                {album.collectionName}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* NIVEL 3: LISTA DE CANCIONES */}
      {loadingSongs && <p style={{ textAlign: 'center', color: '#0070c9' }}>Cargando canciones...</p>}
      
      {!loadingSongs && songs.length > 0 && (
        <div style={{ 
          background: '#fff', 
          padding: '20px', 
          borderRadius: '20px', 
          border: '1px solid #eee', 
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          overflowX: 'auto', // Permite scroll lateral si la tabla es muy ancha para el celu
          margin: '0 10px 40px 10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px' }}>
            <img 
              src={selectedAlbum?.artworkUrl100.replace('100x100', '120x120')} 
              alt="cover" 
              style={{ borderRadius: '10px', width: '80px', height: '80px' }} 
            />
            <div>
              <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{selectedAlbum?.collectionName}</h2>
              <p style={{ color: '#0070c9', margin: 0, fontWeight: '600' }}>{selectedAlbum?.artistName}</p>
            </div>
          </div>

          <table style={{ width: '100%', minWidth: '350px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #f0f0f0', color: '#999', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 5px' }}>#</th>
                <th style={{ padding: '10px 5px' }}>Título</th>
                <th style={{ padding: '10px 5px', textAlign: 'right' }}>Duración</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song, index) => (
                <tr key={song.trackId} style={{ borderBottom: '1px solid #fafafa' }}>
                  <td style={{ padding: '12px 5px', color: '#ccc', fontSize: '13px' }}>{index + 1}</td>
                  <td style={{ padding: '12px 5px', fontSize: '14px', fontWeight: '500', color: '#333' }}>{song.trackName}</td>
                  <td style={{ padding: '12px 5px', textAlign: 'right', fontSize: '13px', color: '#777' }}>
                    {formatTime(song.trackTimeMillis)}
                  </td>
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