import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [activeOption, setActiveOption] = useState('Home');

  const redirectToPage = (page) => {
    setActiveOption(page);
    navigate(`/${page.toLowerCase()}`);
  };

  return (
    <nav className='fixed top-0 font-semibold text-lg left-0 w-full flex items-center justify-center gap-8 p-5 shadow-custom bg-gradient-to-tr from-emerald-400 via-green-500 to bg-emerald-700 z-10 h-16'>
      <button onClick={() => redirectToPage("")} className={`px-5 py-2 hover:-translate-y-1.5 duration-400 transition-all
        ${activeOption == '' ? 'underline underline-offset-2 text-opacity-100' : 'text-opacity-20'}`}
      >Home</button> |{" "}
      <button onClick={() => redirectToPage("top-tracks")} className={`px-5 py-2 hover:-translate-y-1.5 duration-400 transition-all
        ${activeOption == 'top-tracks' ? 'underline underline-offset-2 text-opacity-100' : 'text-opacity-20'}`}
      >Top Tracks</button> |{" "}
      <button onClick={() => redirectToPage("recommendations")} className={`px-5 py-2 hover:-translate-y-1.5 duration-400 transition-all
        ${activeOption == 'recommendations' ? 'underline underline-offset-2 text-opacity-100' : 'text-opacity-20'}`}
      >Recommendations</button> |{" "}
      <button onClick={() => redirectToPage("playlists")} className={`px-5 py-2 hover:-translate-y-1.5 duration-400 transition-all
        ${activeOption == 'playlists' ? 'underline underline-offset-2 text-opacity-100' : 'text-opacity-20'}`}
      >Playlists</button>
    </nav>
  )
}

export default Navbar;
