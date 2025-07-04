import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Home = () => {
  const [playlists, setPlaylists] = useState([]);
  const [user, setUser] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/playlists', { withCredentials: true });
      setPlaylists(response.data || []);
    } catch (error) {
      console.error('Failed to fetch playlists', error);
    }
    try {
      const response = await axios.get('http://localhost:5000/user', { withCredentials: true });
      setUser(response.data || {});
      console.log(response.data);
    } catch(err) {
      console.error('Failed to fetch user', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className='flex justify-end w-full mr-36'>
        <div className='flex flex-col items-center py-10'>
          <p className='font-semibold text-base'>{user?.display_name}</p>
          <img src={user?.images[0]?.url} alt={user?.display_name} className='w-24 rounded-full shadow-custom' />
        </div>
      </div>
      {playlists.length > 0 ? (
        <ul className='grid grid-cols-3 gap-36 my-16'>
          {playlists.map((playlist, idx) => (
            <div key={idx} className='flex items-center justify-start mt-12 flex-col text-start cursor-pointer duration-400 transition-all
              hover:-translate-y-3 hover:scale-110'>
              <p className='mb-2 font-semibold text-lg'>{playlist.name}</p>
              <img src={playlist.images[0].url} alt={playlist.name} className='rounded-xl w-60 h-60 shadow-custom' />
            </div>
          ))}
        </ul>
      ) : (
        <></>
      )}
    </>
  )
}

export default Home
