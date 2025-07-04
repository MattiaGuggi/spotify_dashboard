import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import TopTracks from './pages/TopTracks';
import Recommendations from './pages/Recommendations';
import Playlists from './pages/Playlists';
import Navbar from './components/Navbar';
import { UserProvider } from './components/UserContext';

function App() {
  const [token, setToken] = useState(null);

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
        <div className='relative w-full min-h-screen pt-16 text-center flex justify-center items-center flex-col
          overflow-hidden bg-gradient-to-br from-emerald-300 via-green-400 to bg-emerald-800'>
          <Routes>
            <Route path="/" element={<Login setToken={setToken} />} />
            <Route path="/top-tracks" element={<TopTracks />} />
            <Route path="/recommendations" element={<Recommendations token={token} />} />
            <Route path="/playlists" element={<Playlists />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
