/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
'use client'
import React, { createContext, useState, useContext } from 'react';
import { playlistType, userType } from '../lib/types';

interface UserContextType {
  user: userType | null;
  setUser: React.Dispatch<React.SetStateAction<userType | null>>;
  selectedPlaylist: playlistType | null;
  setSelectedPlaylist: React.Dispatch<React.SetStateAction<playlistType | null>>;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<userType | null>(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState<playlistType | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser, selectedPlaylist, setSelectedPlaylist }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};
