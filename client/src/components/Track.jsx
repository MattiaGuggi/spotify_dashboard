import axios from "axios";
import { useEffect, useState } from "react";

const Track = ({ index, item, size, type = 'single', selectedTracks = [], toggleTrackSelection }) => {
  const pathname = window.location.pathname;
  const [open, setOpen] = useState(false);
  const [lyrics, setLyrics] = useState("");

  const showLyrics = () => {
    setOpen((v) => !v);
  };

  const fetchLyrics = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/lyrics",
        {
          params: {
            track: item.name,
            artist: item.album.artists[0].name
          },
          withCredentials: true
        }
      );

      if (res.status === 200) {
        setLyrics(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch lyrics", err);
    }
  };

  useEffect(() => {
    if(open) {
      fetchLyrics();
    }
  }, [open]);

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/80 z-20 flex items-center justify-center">
          <p className="text-white z-20 cursor-pointer float-right m-20 scale-110 duration-200 transition-transform hover:opacity-80 hover:scale-125" onClick={() => setOpen(false)}>x</p>
          <div className="w-[90vw] max-w-4xl h-[90vh] p-6 rounded-xl font-bold text-3xl text-center bg-gradient-to-br from-[#121212] via-[#1DB954]/20 to-[#191414] shadow-custom z-30">
            <div className="h-full overflow-y-auto text-left">
              <p className="whitespace-pre-line font-bold text-4xl">
                {lyrics}
              </p>
            </div>
          </div>
        </div>
      )}
      <li className="w-full max-w-3xl my-7 flex items-center justify-between p-4 bg-gradient-to-br from-emerald-700/40 to-black/30 rounded-2xl shadow-md backdrop-blur-sm hover:scale-105 transition-transform duration-200">
        <div className="flex items-center gap-6">
          {pathname === '/playlists' && (
            <input
              type="checkbox"
              checked={selectedTracks.includes(index)}
              onChange={() => toggleTrackSelection(index)}
              className={`w-5 h-5 cursor-pointer ${type == 'group' ? '' : 'hidden'}`}
            />
          )}
          <img src={item.album.images[0]?.url} alt={item.name} width={size} className="rounded-lg shadow" />
          <div>
            <p className="text-white font-semibold text-xl">{index}. {item.name}</p>
          </div>
        </div>
        <div>
          <p
            className="text-gray-300 font-semibold text-md m-10 cursor-pointer hover:text-gray-400 hover:scale-110 duration-200 transition-transform"
            onClick={showLyrics}
          >
            Show lyrics
          </p>
        </div>
      </li>
    </>
  );
};

export default Track;
