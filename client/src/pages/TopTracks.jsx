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
    <>
      <h2 className='text-center font-bold text-4xl my-10'>Your Top Tracks</h2>
      <ul className='px-60'>
        {tracks.map((track, idx) => (
          <Track key={track.id} index={idx + 1} item={track} size={'150'} />
        ))}
      </ul>
    </>
  );
}

export default TopTracks;
