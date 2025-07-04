import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Track from '../components/Track'

const Recommendations = ({ token }) => {
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
    console.log(token);
    
  }, []);

  return (
    <>
      <h2 className='text-center font-bold text-4xl mt-20 mb-14'>Recommended Tracks</h2>
      <ul className='px-60'>
        {recs.map((track, idx) => (
          <Track key={track.track.id} index={idx} item={track.track} size={'150'} />
        ))}
      </ul>
    </>
  );
}

export default Recommendations;
