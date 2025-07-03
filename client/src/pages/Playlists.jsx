import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Track from '../components/Track'
import Loader from '../components/Loader';

const Playlists = () => {
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
  }, []);

  // Fetch tracks whenever selectedPlaylistId changes or tracks have been moved
  useEffect(() => {
    if (!selectedPlaylistId) return;
    
    fetchTracks();
  }, [selectedPlaylistId]);

  return (
    <div className='flex flex-col items-center'>
      <h2 className='text-center font-bold text-4xl mt-20 mb-14'>Your Playlists</h2>
      <select
        onChange={(e) => setSelectedPlaylistId(e.target.value)}
        value={selectedPlaylistId || ''}
        className='px-6 py-3 rounded-xl shadow-custom'
      >
        <option value="" disabled>Select a playlist</option>
        {playlists.map(playlist => (
          <option key={playlist.id} value={playlist.id}>
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
            <Track key={trackItem.track.id} index={idx} item={trackItem.track} size={'150'} />
          ))}
        </ul>
      ) : (
        <p className='my-7'>No tracks available</p>
      )}

      <form onSubmit={moveTracks} className='fixed flex flex-col gap-8 top-1/2 right-52 bg-gradient-to-tl from-green-300 to-emerald-500 py-12 px-9 rounded-xl'>
        <div className="input-wrapper">
          <input
            type="number"
            name="origin"
            placeholder="Origin track index"
            min={0}
            max={tracks.length - 1}
            required
            className="bg-[#eee] border-none p-4 text-base w-52 rounded-xl text-lightcoral shadow-[0_0.4rem_#dfd9d9] cursor-pointer focus:outline-lightcoral"
          />
        </div>
        <div className="input-wrapper">
          <input
            type="number"
            name="destination"
            placeholder="Destination track index"
            min={0}
            max={tracks.length}
            required
            className="bg-[#eee] border-none p-4 text-base w-52 rounded-xl text-lightcoral shadow-[0_0.4rem_#dfd9d9] cursor-pointer focus:outline-lightcoral"
          />
        </div>
        <input type="submit" value="Confirm!" className="relative text-[17px] uppercase no-underline px-10 py-4 inline-block
          cursor-pointer rounded-full transition-all duration-200 border-none font-medium text-black bg-white hover:-translate-y-1
          hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] active:-translate-y-0.5 active:shadow-[0_5px_10px_rgba(0,0,0,0.2)] after:content-['']
          after:inline-block after:h-full after:w-full after:rounded-full after:absolute after:top-0 after:left-0 after:-z-10 after:bg-white
          after:transition-all after:duration-400 hover:after:scale-x-140 hover:after:scale-y-160 hover:after:opacity-0"
        />
      </form>
    </div>
    
  );
};

export default Playlists;
