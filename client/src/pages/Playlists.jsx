import { useEffect, useState } from 'react';
import axios from 'axios';
import Track from '../components/Track'
import Loader from '../components/Loader';
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger);

const Playlists = (selectedPlaylist) => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');
  const [tracks, setTracks] = useState([]);
  const [message, setMessage] = useState('');
  const [loadingTracks, setLoadingTracks] = useState(false);

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get('http://localhost:5000/playlists', { withCredentials: true });
      setPlaylists(response.data || []);
    } catch (error) {
      console.error('Failed to fetch playlists', error);
    }
  };

  const fetchTracks = async () => {
    try {
      setLoadingTracks(true);
      const response = await axios.get(`http://localhost:5000/playlists/${selectedPlaylistId}/tracks`, { withCredentials: true });
      setTracks(response.data || []);
    } catch (error) {
      console.error('Failed to fetch tracks', error);
      setTracks([]);
    } finally {
      setLoadingTracks(false);
    }
  };

  const moveTracks = async (e) => {
    e.preventDefault();
    try {
        const origin = Number(e.target.origin.value);
        const destination = Number(e.target.destination.value);
        const response = await axios.post(`http://localhost:5000/playlists/${selectedPlaylistId}/moveTracks`, { origin, destination }, { withCredentials: true });
        setMessage(response.data);
        fetchTracks();
    } catch(err) {
      console.error('Failed to move tracks', err);
    }
  };

  // Fetch playlists once on mount
  useEffect(() => {
    fetchPlaylists();
    setSelectedPlaylistId(selectedPlaylist?.selectedPlaylist?.id);
  }, []);

  // Fetch tracks whenever selectedPlaylistId changes or tracks have been moved
  useEffect(() => {
    if (!selectedPlaylistId) return;
    
    fetchTracks();
  }, [selectedPlaylistId]);

  useGSAP(() => {
    const tracks = gsap.utils.toArray("ul li");

    tracks.forEach((track) => {
      gsap.fromTo(track,
        {
          opacity: 0,
          scale: 0.8,
          y: 80,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: track,
            start: "top 95%",
            end: "bottom 80%",
            scrub: 0.5,
          },
        }
      );
    });
  }, []);

  return (
    <div className='flex flex-col items-center'>
      <h2 className='text-center text-white font-bold text-4xl mt-20 mb-14'>Your Playlists</h2>
      <select
        onChange={(e) => setSelectedPlaylistId(e.target.value)}
        value={selectedPlaylistId || ''}
        className='
          px-6 py-3 
          rounded-xl 
          shadow-lg 
          bg-[#121212] 
          text-white 
          border border-gray-700 
          focus:outline-none 
          focus:ring-2 
          focus:ring-emerald-500 
          focus:border-transparent
          appearance-none
          cursor-pointer
        '
      >
        <option value="" disabled className='bg-[#121212] text-white'>
          Select a playlist
        </option>
        {playlists.map(playlist => (
          <option 
            key={playlist.id} 
            value={playlist.id} 
            className='bg-[#121212] text-white'
          >
            {playlist.name}
          </option>
        ))}
      </select>
      {message ? (
        <div className='p-5 font-semibold text-lg'>
          <p>{message}</p>
        </div>
      ) : (
        <></>
      )}

      {loadingTracks ? (
        <Loader />
      ) : tracks.length > 0 ? (
        <ul className='px-60'>
          {tracks.map((trackItem, idx) => (
            <Track key={`${trackItem.track.id}-${idx}`} index={idx} item={trackItem.track} size={'150'} />
          ))}
        </ul>
      ) : (
        <p className='my-7'>No tracks available</p>
      )}
      <form
        onSubmit={moveTracks}
        className="fixed right-12 top-1/2 -translate-y-1/2 bg-emerald-800/20 p-8 rounded-2xl shadow-md w-80 backdrop-blur-md z-10"
      >
        <h3 className="text-white text-xl font-bold mb-6">Reorder Tracks</h3>
        <div className="flex flex-col gap-4 mb-6">
          <input
            type="number"
            name="origin"
            placeholder="Origin index"
            min={0}
            max={tracks.length - 1}
            required
            className="p-3 rounded-lg bg-gray-800 text-white focus:outline-emerald-400"
          />
          <input
            type="number"
            name="destination"
            placeholder="Destination index"
            min={0}
            max={tracks.length}
            required
            className="p-3 rounded-lg bg-gray-800 text-white focus:outline-emerald-400"
          />
        </div>
        <input
          type="submit"
          value="Confirm!"
          className="bg-emerald-500 text-white px-6 py-3 rounded-full hover:bg-emerald-600 duration-400 transition-all cursor-pointer"
        />
      </form>
    </div>
    
  );
};

export default Playlists;
