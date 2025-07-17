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
    <div className="pt-24 px-10">
      {user && (
        <div className="flex justify-end mb-10">
          <div className="text-right">
            <p className="text-white font-semibold mb-2">{user.display_name}</p>
            <img src={user?.images?.[0]?.url} alt="User" className="w-20 h-20 rounded-full shadow-lg" />
          </div>
        </div>
      )}
      <h2 className="text-3xl font-bold text-white mb-10">Your Playlists</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {playlists.map((playlist, idx) => (
          <div key={idx} className="group cursor-pointer transition-transform duration-300 transform hover:-translate-y-2">
            <img src={playlist.images[0].url} alt={playlist.name} className="rounded-lg w-full shadow-xl" />
            <p className="mt-3 text-white font-medium group-hover:text-emerald-300">{playlist.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
