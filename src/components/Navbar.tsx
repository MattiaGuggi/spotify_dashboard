'use client'
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Flame, ListMusic, Settings, Disc3 } from 'lucide-react';

const navItems = [
  { label: 'Home', path: '', icon: Home },
  { label: 'Top Tracks', path: 'top-tracks', icon: Flame },
  { label: 'Playlists', path: 'playlists', icon: ListMusic },
  { label: 'Settings', path: 'settings', icon: Settings },
];

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeOption, setActiveOption] = useState<string>('');

  useEffect(() => {
    const current = pathname.split('/')[1] || '';
    setActiveOption(current);
  }, [pathname]);

  const redirectToPage = (page: string) => {
    router.push(`/${page}`);
  };

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl">
      <nav className="flex items-center justify-between px-6 py-3 rounded-full bg-zinc-900/60 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50">
        {/* Brand Badge */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => redirectToPage('')}>
          <div className="p-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Disc3 className="w-5 h-5 animate-spin-slow" />
          </div>
          <span className="font-bold text-sm tracking-wider uppercase bg-linear-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent hidden sm:inline-block">
            SoundPulse
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-1 sm:gap-2">
          {navItems.map(({ label, path, icon: Icon }) => {
            const isActive = activeOption === path;
            return (
              <button
                key={path}
                onClick={() => redirectToPage(path)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-zinc-400'}`} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;