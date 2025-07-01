import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TopTracks = () => {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/top-tracks', { withCredentials: true });
        setTracks(res.data.items);
      } catch (error) {
        console.error('Failed to fetch top tracks', error);
      }
    };
    fetchTopTracks();
  }, []);

  return (
    <div>
      <h2>Your Top Tracks</h2>
      <ul>
        {tracks.map(track => (
          <li key={track.id}>
            <img src={track.album.images[0]?.url} alt={track.name} width="150" />
            {track.name} by {track.artists.map(a => a.name).join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TopTracks;
