import { Disc3 } from 'lucide-react';

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
      {/* Glassmorphic Container Card */}
      <div className="relative flex flex-col items-center justify-center p-8 rounded-3xl bg-zinc-900/70 border border-white/10 shadow-2xl shadow-emerald-500/10 backdrop-blur-xl">
        {/* Ambient Glow Effect */}
        <div className="absolute w-28 h-28 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Animated Spinner Structure */}
        <div className="relative flex items-center justify-center w-20 h-20 mb-4">
          {/* Outer Pulsing Ping */}
          <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-ping opacity-75" />

          {/* Rotating Spinner Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-400 border-r-emerald-500/40 animate-spin" />

          {/* Center Brand Icon */}
          <div className="p-3.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-inner">
            <Disc3 className="w-8 h-8 animate-spin" />
          </div>
        </div>

        {/* Loading Message */}
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-xs font-bold tracking-widest text-zinc-200 uppercase">
            Loading
          </p>
          <p className="text-xs text-zinc-500 font-medium">
            Fetching your audio data...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loader;