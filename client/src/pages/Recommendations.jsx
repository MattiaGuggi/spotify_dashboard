import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Recommendations = () => {
  const [recs, setRecs] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get('http://localhost:5000/recommendations', { withCredentials: true });
        setRecs(res.data);
      } catch (error) {
        console.error('Failed to fetch recommendations', error);
      }
    };
    fetchRecommendations();
  }, []);

  return (
    <>
      <h2 className='p-14'>Recommended Tracks</h2>
      <ul>
        {recs.map(track => (
          <li key={track.id}>
            {track.name} by {track.artists.map(a => a.name).join(', ')}
          </li>
        ))}
      </ul>
    </>
  );
}

export default Recommendations;
