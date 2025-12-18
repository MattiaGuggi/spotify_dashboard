import React from 'react'
import { useUser } from '../components/UserContext';

const Settings = () => {
    const { user, setUser } = useUser();

    return (
        <div>
            <h1 className='text-2xl font-bold'>Settings</h1>
            {user && (
                <div className="mt-6 flex items-center gap-4 bg-white/5 px-4 py-2 rounded-lg backdrop-blur-md w-max">
                    <img
                        src={user?.images?.[0]?.url}
                        alt="User"
                        className="w-14 h-14 rounded-full border border-white/20 shadow-md"
                    />
                    <p className="text-white font-semibold text-lg">{user.display_name}</p>
                </div>
            )}
        </div>
    )
}

export default Settings
