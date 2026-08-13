import { useEffect, useState } from 'react';
import axios from 'axios';
import Track from '../components/Track';
import { Flame } from 'lucide-react';

const TopTracks = () => {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/top-tracks', { withCredentials: true });
        setTracks(res.data.items || []);
      } catch (error) {
        console.error('Failed to fetch top tracks', error);
      }
    };
    fetchTopTracks();
  }, []);

  return (
    <div className="px-6 sm:px-12 md:px-16 lg:px-24 max-w-5xl mx-auto max-h-[calc(100vh-8rem)] overflow-y-auto [scrollbar-color:#3f3f46_transparent]">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Flame className="w-4 h-4" /> Most Played
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Your Top Tracks</h2>
        <p className="text-zinc-400 text-sm mt-2">Based on your recent listening history</p>
      </div>

      {/* Tracks List */}
      <ul className="flex flex-col gap-4 items-center pb-12">
        {tracks.map((track, idx) => (
          <Track key={track.id} index={idx + 1} item={track} size="64" />
        ))}
      </ul>
    </div>
  );
};

export default TopTracks;