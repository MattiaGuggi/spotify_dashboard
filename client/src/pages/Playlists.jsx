import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Track from '../components/Track'

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('');
  const [tracks, setTracks] = useState([]);
  const [message, setMessage] = useState('');

  const moveTracks = async (e) => {
    e.preventDefault();
    moveTracksAsync();
  };

  const moveTracksAsync = async () => {
    try {
        const origin = Number(e.target.origin.value);
        const destination = Number(e.target.destination.value);
        console.log(origin, destination);
        const response = await axios.post(`http://localhost:5000/playlists/${selectedPlaylistId}/moveTracks`, { origin, destination }, { withCredentials: true });
        setMessage(response.data);
    } catch(err) {
      console.error('Failed to move tracks', err);
    }
  };

  // Fetch playlists once on mount
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get('http://localhost:5000/playlists', { withCredentials: true });
        setPlaylists(response.data || []);
      } catch (error) {
        console.error('Failed to fetch playlists', error);
      }
    };
    fetchPlaylists();
  }, []);

  // Fetch tracks whenever selectedPlaylistId changes or tracks have been moved
  useEffect(() => {
    if (!selectedPlaylistId) return;

    const fetchTracks = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/playlists/${selectedPlaylistId}/tracks`, { withCredentials: true });
        setTracks(response.data || []);
        
      } catch (error) {
        console.error('Failed to fetch tracks', error);
        setTracks([]);
      }
    };
    fetchTracks();
  }, [selectedPlaylistId, message]);

  return (
    <div>
      <h2>Your Playlists</h2>
      <select
        onChange={(e) => setSelectedPlaylistId(e.target.value)}
        value={selectedPlaylistId || ''}
      >
        <option value="" disabled>Select a playlist</option>
        {playlists.map(playlist => (
          <option key={playlist.id} value={playlist.id}>
            {playlist.name}
          </option>
        ))}
      </select>
      {message ? (
        <div className='bg-green-200'>
          <p>{message}</p>
        </div>
      ) : (
        <></>
      )}

      {tracks.length > 0 ? (
        <ul>
          {tracks.map((trackItem, idx) => (
            <Track key={trackItem.track.id} index={idx} item={trackItem} />
          ))}
        </ul>
      ) : (
        <p>No tracks available</p>
      )}

      <form onSubmit={moveTracks}>
        <input
          type="number"
          name="origin"
          placeholder="Origin track index"
          min={0}
          max={tracks.length - 2}
          required
        />
        <input
          type="number"
          name="destination"
          placeholder="Destination track index"
          min={0}
          max={tracks.length - 1}
          required
        />
        <input type="submit" value="Confirm!" />
      </form>
    </div>
    
  );
};

export default Playlists;
