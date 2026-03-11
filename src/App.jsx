import React, { useState } from 'react';
import { itunesService, formatTime } from './services/itunesService';

// Definimos los estilos responsivos fuera del componente
const styleSheet = `
  @media (max-width: 600px) {
    .responsive-container {
      flex-direction: column !important;
      align-items: center !important;
    }
    
    .responsive-item {
      width: 100% !important;
      max-width: 100% !important;
    }

    .header-logo {
      /* En mobile reseteamos cualquier margen y centramos */
      margin-left: auto !important;
      margin-right: auto !important;
      display: block !important;
      width: 350px !important; /* Tamaño más adecuado para celular */
    }
    
    h1 {
      font-size: 1.5rem !important;
    }
  }
`;

function App() {
  const [artistInput, setArtistInput] = useState('');
  const [albumInput, setAlbumInput] = useState('');
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [loadingSongs, setLoadingSongs] = useState(false);

  const handleSearchArtist = async () => {
    if (!artistInput) return;
    const results = await itunesService.getAlbumsByArtist(artistInput);
    setAlbums(results);
    setSongs([]);
    setSelectedAlbum(null);
  };

  const handleSearchAlbum = async () => {
    if (!albumInput) return;
    const results = await itunesService.getAlbumsByTitle(albumInput);
    setAlbums(results);
    setSongs([]);
    setSelectedAlbum(null);
  };

  const handleAlbumClick = async (album) => {
    setLoadingSongs(true);
    setSelectedAlbum(album);
    const tracks = await itunesService.getSongs(album.collectionId);
    setSongs(tracks);
    setLoadingSongs(false);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div style={{ padding: '10px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <style>{styleSheet}</style>
      
      <header style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' }}>
        <img 
          src="/tu-imagen.png" 
          className="header-logo"
          style={{ 
            width: '400px', 
            maxWidth: '100%', 
            height: 'auto',
            display: 'block'
          }} 
          alt="Logo" 
        />
        <h1 style={{ textAlign: 'center', fontSize: '1.8rem' }}>iTunes Music Explorer</h1>
      </header>

      {/* CONTENEDOR DE BUSCADORES */}
      <div className="responsive-container" style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '40px' }}>
        
        <div className="responsive-item" style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '45%' }}>
          <label style={{ fontWeight: 'bold' }}>Buscar por Artista</label>
          <div style={{ display: 'flex', gap: '5px' }}>
            <input 
              placeholder="Ej: Green Day..." 
              value={artistInput}
              onChange={(e) => setArtistInput(e.target.value)}
              style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px' }}
            />
            <button onClick={handleSearchArtist} style={{ padding: '0 15px', cursor: 'pointer', background: '#0070c9', color: '#fff', border: 'none', borderRadius: '8px' }}>Buscar</button>
          </div>
        </div>

        <div className="responsive-item" style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '45%' }}>
          <label style={{ fontWeight: 'bold' }}>Buscar por Disco</label>
          <div style={{ display: 'flex', gap: '5px' }}>
            <input 
              placeholder="Ej: American Idiot..." 
              value={albumInput}
              onChange={(e) => setAlbumInput(e.target.value)}
              style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px' }}
            />
            <button onClick={handleSearchAlbum} style={{ padding: '0 15px', cursor: 'pointer', background: '#0070c9', color: '#fff', border: 'none', borderRadius: '8px' }}>Buscar</button>
          </div>
        </div>
      </div>

      {/* RESULTADOS (GRILLA) */}
      {albums.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px' }}>
          {albums.map(album => (
            <div key={album.collectionId} onClick={() => handleAlbumClick(album)} style={{ cursor: 'pointer', textAlign: 'center', border: '1px solid #eee', padding: '10px', borderRadius: '10px' }}>
              <img src={album.artworkUrl100.replace('100x100', '200x200')} style={{ width: '100%', borderRadius: '8px' }} alt="cover" />
              <p style={{ fontSize: '12px', fontWeight: 'bold', marginTop: '10px' }}>{album.collectionName}</p>
            </div>
          ))}
        </div>
      )}

      {/* TABLA DE CANCIONES */}
      {loadingSongs && <p style={{ textAlign: 'center', marginTop: '20px' }}>Cargando canciones...</p>}
      {!loadingSongs && songs.length > 0 && (
        <div style={{ marginTop: '30px', overflowX: 'auto', background: '#fff', padding: '15px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', minWidth: '300px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                <th style={{ padding: '10px' }}>#</th>
                <th style={{ padding: '10px' }}>Track</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>Min</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song, index) => (
                <tr key={song.trackId} style={{ borderBottom: '1px solid #f9f9f9' }}>
                  <td style={{ padding: '10px' }}>{index + 1}</td>
                  <td style={{ padding: '10px' }}>{song.trackName}</td>
                  <td style={{ padding: '10px', textAlign: 'right' }}>{formatTime(song.trackTimeMillis)}</td>
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