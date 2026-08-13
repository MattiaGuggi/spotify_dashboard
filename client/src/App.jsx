import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import TopTracks from './pages/TopTracks';
import Playlists from './pages/Playlists';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Settings from './pages/Settings';
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
        <div className="relative min-h-screen w-full bg-[#09090b] text-zinc-100 font-sans selection:bg-emerald-500 selection:text-black antialiased overflow-x-hidden">
          {/* Ambient Background Glows */}
          <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.12),rgba(255,255,255,0))] pointer-events-none z-0" />
          <div className="fixed -bottom-32 -left-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none z-0" />

          {/* Floating Glass Navbar */}
          <Navbar />

          {/* Main Content Area */}
          <main className="relative z-10 pt-24 pb-16">
            <Routes>
              <Route path="/" element={<Home setSelectedPlaylist={setSelectedPlaylist} />} />
              <Route path="/top-tracks" element={<TopTracks />} />
              <Route path="/playlists" element={<Playlists selectedPlaylist={selectedPlaylist} />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;