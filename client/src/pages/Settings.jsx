import { useUser } from '../components/UserContext';
import { User, Settings as SettingsIcon, ShieldCheck, Music } from 'lucide-react';

const Settings = () => {
  const { user } = useUser();

  return (
    <div className="px-6 sm:px-12 md:px-16 lg:px-24 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-zinc-900 border border-white/10 text-emerald-400">
          <SettingsIcon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Account Settings</h1>
          <p className="text-zinc-400 text-sm">Manage your profile and connected integrations</p>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="bg-zinc-900/40 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
        <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-emerald-400" /> Connected Spotify Account
        </h2>

        {user ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-5 rounded-xl bg-zinc-800/40 border border-white/5">
            <div className="flex items-center gap-4">
              {user?.images?.[0]?.url ? (
                <img
                  src={user?.images?.[0]?.url}
                  alt="User"
                  className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500/40 shadow-md"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                  <User className="w-8 h-8" />
                </div>
              )}
              <div>
                <p className="text-white font-bold text-lg">{user.display_name}</p>
                <p className="text-zinc-400 text-xs mt-0.5">{user.email || 'Connected via Spotify OAuth'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" /> Active Session
            </div>
          </div>
        ) : (
          <p className="text-zinc-400 text-sm">No user session detected. Please log in again.</p>
        )}
      </div>
    </div>
  );
};

export default Settings;