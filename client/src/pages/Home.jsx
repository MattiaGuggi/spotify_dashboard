import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [playlists, setPlaylists] = useState([]);
  const [user, setUser] = useState(null);

  const fetchData = async () => {
    try {
      const [playlistsRes, userRes] = await Promise.all([
        axios.get('http://localhost:5000/playlists', { withCredentials: true }),
        axios.get('http://localhost:5000/user', { withCredentials: true }),
      ]);
      setPlaylists(playlistsRes.data || []);
      setUser(userRes.data || {});
    } catch (error) {
      console.error('Failed to fetch data', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="pt-24 px-6 sm:px-12 md:px-20 lg:px-32 w-full max-w-7xl mx-auto">
      {user && (
        <div className="flex justify-end mb-10">
          <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-lg backdrop-blur-md">
            <img
              src={user?.images?.[0]?.url}
              alt="User"
              className="w-14 h-14 rounded-full border border-white/20 shadow-md"
            />
            <p className="text-white font-semibold text-lg">{user.display_name}</p>
          </div>
        </div>
      )}

      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-10">Your Playlists</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {playlists.map((playlist, idx) => (
          <div
            key={idx}
            className="group cursor-pointer bg-white/5 p-4 rounded-xl shadow-lg hover:bg-emerald-600/20 transition-all duration-300"
          >
            <img
              src={playlist.images[0].url}
              alt={playlist.name}
              className="rounded-md w-full aspect-square object-cover shadow-md mb-4"
            />
            <p className="text-lg font-medium group-hover:text-emerald-400 transition">{playlist.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
