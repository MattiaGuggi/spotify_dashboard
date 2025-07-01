import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import TopTracks from './pages/TopTracks';
import Recommendations from './pages/Recommendations';
import Playlists from './pages/Playlists';
import Navbar from './components/Navbar'

function App() {
  const [isLogged, setisLogged] = useState();

  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/top-tracks" element={<TopTracks />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/playlists" element={<Playlists />} />
      </Routes>
    </Router>
  );
}

export default App;
