import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import TopTracks from './pages/TopTracks';
import Playlists from './pages/Playlists';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import { UserProvider } from './components/UserContext';

function App() {
  const [token, setToken] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('spotify_access_token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  return (
    <UserProvider>
      <Router>
        <Navbar />
        <div className="relative w-full min-h-screen pt-16 text-white font-sans bg-gradient-to-br from-[#121212] via-[#1DB954]/20 to-[#191414]">
          <Routes>
            <Route path="/" element={<Home setSelectedPlaylist={setSelectedPlaylist} />} />
            <Route path="/top-tracks" element={<TopTracks />} />
            <Route path="/playlists" element={<Playlists selectedPlaylist={selectedPlaylist} />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
