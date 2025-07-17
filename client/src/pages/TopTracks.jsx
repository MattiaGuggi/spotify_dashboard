import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Track from '../components/Track';

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
    <div className="pt-24 px-10">
      <h2 className="text-white text-3xl font-bold mb-8 text-center">Your Top Tracks</h2>
      <ul className="flex flex-col gap-8 items-center">
        {tracks.map((track, idx) => (
          <Track key={track.id} index={idx + 1} item={track} size="100" />
        ))}
      </ul>
    </div>
  );
};

export default TopTracks;
