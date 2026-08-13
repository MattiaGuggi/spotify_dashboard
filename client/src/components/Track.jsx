import axios from 'axios';
import { useEffect, useState } from 'react';
import { Mic2, X, Music, CheckSquare, Square } from 'lucide-react';

const Track = ({ index, item, size = '64', type = 'single', selectedTracks = [], toggleTrackSelection, }) => {
  const pathname = window.location.pathname;
  const [open, setOpen] = useState(false);
  const [lyrics, setLyrics] = useState('');
  const isSelected = selectedTracks.includes(index);

  const showLyrics = () => {
    setOpen((v) => !v);
  };

  const fetchLyrics = async () => {
    try {
      const res = await axios.get('http://localhost:5000/lyrics', {
        params: {
          track: item?.name,
          artist: item?.album?.artists?.[0]?.name,
        },
        withCredentials: true,
      });

      if (res.status === 200) {
        setLyrics(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch lyrics', err);
      setLyrics('Lyrics unavailable for this track.');
    }
  };

  useEffect(() => {
    if (open) {
      fetchLyrics();
    }
  }, [open]);

  return (
    <>
      {/* Lyrics Modal Backdrop */}
      {open && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl h-[80vh] flex flex-col p-6 sm:p-8 rounded-3xl bg-zinc-900 border border-white/10 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6 shrink-0">
              <div className="flex items-center gap-4">
                <img
                  src={item?.album?.images?.[0]?.url}
                  alt={item?.name}
                  className="w-12 h-12 rounded-lg object-cover shadow-md"
                />
                <div>
                  <h3 className="text-white font-bold text-lg line-clamp-1">{item?.name}</h3>
                  <p className="text-zinc-400 text-xs">{item?.album?.artists?.[0]?.name}</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lyrics Content Viewport */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <p className="whitespace-pre-line text-zinc-200 font-medium text-base sm:text-lg leading-relaxed">
                {lyrics || 'Loading lyrics...'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Track Row Item */}
      <li
        className={`w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all duration-300 ${
          isSelected
            ? 'bg-emerald-500/10 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
            : 'bg-zinc-900/40 border-white/5 hover:border-white/10 hover:bg-zinc-800/40'
        }`}
      >
        <div className="flex items-center gap-4 min-w-0">
          {/* Checkbox for Group Mode */}
          {pathname === '/playlists' && type === 'group' && toggleTrackSelection && (
            <button
              type="button"
              onClick={() => toggleTrackSelection(index)}
              className="text-emerald-400 hover:scale-110 transition-transform shrink-0"
            >
              {isSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-zinc-600" />}
            </button>
          )}

          {/* Album Cover Art */}
          <div className="relative shrink-0 rounded-xl overflow-hidden bg-zinc-800 w-12 h-12 sm:w-14 sm:h-14">
            {item?.album?.images?.[0]?.url ? (
              <img
                src={item?.album?.images?.[0]?.url}
                alt={item?.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-600">
                <Music className="w-6 h-6" />
              </div>
            )}
          </div>

          {/* Track Details */}
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm sm:text-base truncate">
              <span className="text-zinc-500 font-normal mr-2">#{index + 1}</span>
              {item?.name}
            </p>
            <p className="text-zinc-400 text-xs sm:text-sm truncate mt-0.5">
              {item?.album?.artists?.[0]?.name}
            </p>
          </div>
        </div>

        {/* Lyrics Button Action */}
        <button
          onClick={showLyrics}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/30 text-zinc-400 hover:text-emerald-400 transition text-xs font-medium shrink-0 ml-4"
        >
          <Mic2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Lyrics</span>
        </button>
      </li>
    </>
  );
};

export default Track;