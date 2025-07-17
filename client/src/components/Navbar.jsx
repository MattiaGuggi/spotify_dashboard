import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Home', path: '' },
  { label: 'Top Tracks', path: 'top-tracks' },
  { label: 'Playlists', path: 'playlists' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeOption, setActiveOption] = useState('');

  useEffect(() => {
    const current = location.pathname.split('/')[1];
    setActiveOption(current);
  }, [location]);

  const redirectToPage = (page) => {
    navigate(`/${page}`);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-20 h-16 px-10 flex items-center justify-center gap-12 backdrop-blur-md bg-gradient-to-tr from-black/70 via-emerald-700/60 to-black/80 shadow-md">
      {navItems.map(({ label, path }) => (
        <button
          key={path}
          onClick={() => redirectToPage(path)}
          className={`text-white uppercase font-medium tracking-wide transition-all duration-300 hover:text-emerald-400 hover:scale-105 ${
            activeOption === path ? 'text-emerald-300 underline underline-offset-4' : 'opacity-70'
          }`}
        >
          {label}
        </button>
      ))}
    </nav>
  );
};

export default Navbar;
