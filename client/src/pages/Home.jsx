import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/UserContext';
import { Play, Music2, User as UserIcon } from 'lucide-react';

const Home = ({ setSelectedPlaylist }) => {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const { user, setUser } = useUser();

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

  const handleClick = (playlist) => {
    setSelectedPlaylist(playlist);
    navigate('/playlists');
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="pt-8 px-6 sm:px-12 md:px-16 lg:px-24 w-full max-w-7xl mx-auto">
      {/* User Header Greeting */}
      {user?.display_name && (
        <div className="flex justify-between items-center mb-12 bg-zinc-900/40 border border-white/10 p-4 sm:p-6 rounded-2xl backdrop-blur-xl">
          <div>
            <p className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-1">Welcome back</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{user.display_name}</h1>
          </div>
          <div className="flex items-center gap-3 bg-zinc-800/60 border border-white/10 px-4 py-2 rounded-full">
            {user?.images?.[0]?.url ? (
              <img
                src={user?.images?.[0]?.url}
                alt="User"
                className="w-10 h-10 rounded-full object-cover border border-emerald-500/40"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                <UserIcon className="w-5 h-5" />
              </div>
            )}
            <span className="text-sm font-semibold text-zinc-200 hidden sm:inline">{user.display_name}</span>
          </div>
        </div>
      )}

      {/* Playlists Grid Title */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Music2 className="w-7 h-7 text-emerald-400" />
            Your Playlists
          </h2>
          <p className="text-zinc-400 text-sm mt-1">Select a playlist to reorder and manage tracks</p>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {playlists &&
          playlists.map((playlist, idx) => (
            <div
              key={playlist?.id || idx}
              className="group relative cursor-pointer bg-zinc-900/40 border border-white/5 hover:border-emerald-500/30 p-4 rounded-2xl shadow-xl hover:bg-zinc-800/50 transition-all duration-300 hover:-translate-y-1"
              onClick={() => handleClick(playlist)}
            >
              {/* Cover Art Wrapper */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden mb-4 bg-zinc-800 shadow-inner">
                <img
                  src={playlist?.images?.[0]?.url}
                  alt={playlist?.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-black shadow-lg shadow-emerald-500/30 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <Play className="w-6 h-6 fill-black ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Playlist Meta */}
              <p className="text-base font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors line-clamp-1">
                {playlist?.name}
              </p>
              <p className="text-xs text-zinc-400 mt-1">{playlist?.tracks?.total || 0} tracks</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Home;