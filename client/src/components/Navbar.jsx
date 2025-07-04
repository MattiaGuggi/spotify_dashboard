import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [activeOption, setActiveOption] = useState('');

  const redirectToPage = (page) => {
    setActiveOption(page);
    navigate(`/${page.toLowerCase()}`);
  };

  return (
    <nav className='fixed top-0 font-semibold text-lg left-0 w-full flex items-center justify-center gap-8 p-5 shadow-custom z-10 h-16
      bg-gradient-to-tr from-emerald-400 via-green-500 to bg-emerald-700'>
      <button onClick={() => redirectToPage("")} className={`px-5 py-2 hover:-translate-y-1.5 duration-400 transition-all
        hover:opacity-100 hover:scale-110 hover:underline hover:underline-offset-2
        ${activeOption == '' ? 'underline underline-offset-2 text-opacity-100' : 'opacity-50'}`}
      >Home</button> |{" "}
      <button onClick={() => redirectToPage("top-tracks")} className={`px-5 py-2 hover:-translate-y-1.5 duration-400 transition-all
        hover:opacity-100 hover:scale-110 hover:underline hover:underline-offset-2
        ${activeOption == 'top-tracks' ? 'underline underline-offset-2 text-opacity-100' : 'opacity-50'}`}
      >Top Tracks</button> |{" "}
      <button onClick={() => redirectToPage("recommendations")} className={`px-5 py-2 hover:-translate-y-1.5 duration-400 transition-all
        hover:opacity-100 hover:scale-110 hover:underline hover:underline-offset-2
        ${activeOption == 'recommendations' ? 'underline underline-offset-2 text-opacity-100' : 'opacity-50'}`}
      >Recommendations</button> |{" "}
      <button onClick={() => redirectToPage("playlists")} className={`px-5 py-2 hover:-translate-y-1.5 duration-400 transition-all
        hover:opacity-100 hover:scale-110 hover:underline hover:underline-offset-2
        ${activeOption == 'playlists' ? 'underline underline-offset-2 text-opacity-100' : 'opacity-50'}`}
      >Playlists</button>
    </nav>
  )
}

export default Navbar;
