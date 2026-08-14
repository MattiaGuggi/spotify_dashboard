'use client';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Track from '../../components/Track';
import Loader from '../../components/Loader';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Layers,
  Move,
  ChevronDown,
  ListOrdered,
  CheckCircle2,
  AlertCircle,
  Check,
  Disc3,
} from 'lucide-react';
import { playlistType, trackType } from '../../lib/types';
import { useUser } from '@/src/context/UserContext';

gsap.registerPlugin(ScrollTrigger);

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface PlaylistsProps {
  selectedPlaylist?: {
    id?: string;
  };
}

interface PlaylistTrackItem {
  track: trackType;
}

type CheckboxType = 'single' | 'group';

const Page: React.FC<PlaylistsProps> = () => {
  const [playlists, setPlaylists] = useState<playlistType[]>([]);
  const [tracks, setTracks] = useState<PlaylistTrackItem[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>('');
  const [checkboxType, setCheckboxType] = useState<CheckboxType>('single');
  const [selectedTracks, setSelectedTracks] = useState<number[]>([]);
  const [message, setMessage] = useState<string>('');
  const [loadingTracks, setLoadingTracks] = useState<boolean>(false);
  const { selectedPlaylist } = useUser();

  // Custom Select Dropdown State & Ref typed as HTMLDivElement
  const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const fetchPlaylists = async (): Promise<void> => {
    try {
      const response = await axios.get<playlistType[]>(`${API_URL}/playlists`, {
        withCredentials: true,
      });
      setPlaylists(response.data || []);
    } catch (error) {
      console.error('Failed to fetch playlists', error);
    }
  };

  const fetchTracks = async (): Promise<void> => {
    try {
      setLoadingTracks(true);
      const response = await axios.get<PlaylistTrackItem[]>(
        `${API_URL}/playlists/${selectedPlaylistId}/tracks`,
        { withCredentials: true }
      );
      setTracks(response.data || []);
    } catch (error) {
      console.error('Failed to fetch tracks', error);
      setTracks([]);
    } finally {
      setLoadingTracks(false);
    }
  };

  const moveTracks = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const target = e.currentTarget as typeof e.currentTarget & {
      origin: HTMLInputElement;
      destination: HTMLInputElement;
    };

    try {
      const origin = Number(target.origin.value) - 1;
      const destination = Number(target.destination.value) - 1;

      const response = await axios.post<string>(
        `${API_URL}/playlists/${selectedPlaylistId}/moveTracks`,
        { origin, destination },
        { withCredentials: true }
      );

      setMessage(typeof response.data === 'string' ? response.data : 'Tracks moved successfully!');
      fetchTracks();
    } catch (err) {
      console.error('Failed to move tracks', err);
    }
  };

  const toggleTrackSelection = (index: number): void => {
    setSelectedTracks((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const moveGroupTracks = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (selectedTracks.length === 0) {
      setMessage('Please select at least one track.');
      return;
    }

    const target = e.currentTarget as typeof e.currentTarget & {
      first_new_position: HTMLInputElement;
    };

    try {
      const first_new_position = Number(target.first_new_position.value);
      const sortedSelected = [...selectedTracks].sort((a, b) => a - b);
      const first_old_position = sortedSelected[0];
      const group_tracks = sortedSelected
        .map((i) => tracks[i]?.track)
        .filter(Boolean);

      const response = await axios.post<string>(
        `${API_URL}/playlists/${selectedPlaylistId}/moveGroupTracks`,
        { first_new_position, first_old_position, group_tracks },
        { withCredentials: true }
      );

      setMessage(typeof response.data === 'string' ? response.data : 'Group moved successfully!');
      setSelectedTracks([]);
      fetchTracks();
      target.first_new_position.value = '';
    } catch (err) {
      console.error('Failed to move group of tracks', err);
    }
  };

  useEffect(() => {
    fetchPlaylists();
    setSelectedPlaylistId(selectedPlaylist?.id || '');
  }, [selectedPlaylist?.id]);

  useEffect(() => {
    if (!selectedPlaylistId) return;
    fetchTracks();
  }, [selectedPlaylistId]);

  // Handle clicking outside the custom dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSelectOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // GSAP animation safely scoped to containerRef
  useGSAP(
    () => {
      if (!containerRef.current) return;
      const trackElements = gsap.utils.toArray<HTMLElement>('ul li', containerRef.current);

      trackElements.forEach((track) => {
        gsap.fromTo(
          track,
          { opacity: 0, scale: 0.9, y: 40 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: track,
              start: 'top 95%',
              end: 'bottom 85%',
              scrub: 0.5,
            },
          }
        );
      });
    },
    { dependencies: [tracks], scope: containerRef }
  );

  const currentSelectedPlaylist = playlists.find((p) => p.id === selectedPlaylistId);

  return (
    <div ref={containerRef} className="px-6 sm:px-12 md:px-16 lg:px-24 max-w-7xl mx-auto flex flex-col items-center">
      <div className="w-full text-center max-w-2xl mb-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
          Playlist Manager
        </h2>
        <p className="text-zinc-400 text-sm">
          Select a playlist and customize track positions individually or in bulk
        </p>
      </div>

      {/* Custom Dropdown */}
      <div className="relative w-full max-w-md mb-8 z-30" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsSelectOpen((prev) => !prev)}
          className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl bg-zinc-900/90 text-zinc-100 border transition-all duration-200 shadow-xl text-sm font-medium backdrop-blur-md ${
            isSelectOpen
              ? 'border-emerald-500/60 ring-2 ring-emerald-500/20 shadow-emerald-500/10'
              : 'border-white/10 hover:border-emerald-500/30'
          }`}
        >
          <div className="flex items-center gap-3 truncate">
            <Disc3
              className={`w-4 h-4 shrink-0 ${
                currentSelectedPlaylist ? 'text-emerald-400' : 'text-zinc-500'
              }`}
            />
            <span className={currentSelectedPlaylist ? 'text-white font-semibold' : 'text-zinc-400'}>
              {currentSelectedPlaylist?.name || 'Select a playlist...'}
            </span>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-zinc-400 transition-transform duration-300 shrink-0 ${
              isSelectOpen ? 'rotate-180 text-emerald-400' : ''
            }`}
          />
        </button>

        {isSelectOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-zinc-900/95 border border-white/10 shadow-2xl backdrop-blur-2xl overflow-hidden z-50 max-h-64 overflow-y-auto [scrollbar-color:#3f3f46_transparent] animate-in fade-in zoom-in-95 duration-150">
            <div className="p-1.5 flex flex-col gap-1">
              {playlists.length === 0 ? (
                <div className="px-4 py-3 text-xs text-zinc-500 text-center">No playlists found</div>
              ) : (
                playlists.map((playlist) => {
                  const isSelected = playlist.id === selectedPlaylistId;
                  return (
                    <button
                      key={playlist.id}
                      type="button"
                      onClick={() => {
                        if (playlist.id) setSelectedPlaylistId(playlist.id);
                        setIsSelectOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm text-left transition-all duration-200 ${
                        isSelected
                          ? 'bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30'
                          : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span className="truncate pr-2">{playlist.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Status Alert Message */}
      {message && (
        <div className="mb-8 px-5 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium flex items-center gap-2 shadow-lg backdrop-blur-md">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Mode Control Switch */}
      <div className="flex items-center gap-2 p-1.5 bg-zinc-900/80 border border-white/10 rounded-xl mb-12 shadow-lg backdrop-blur-md">
        <button
          type="button"
          onClick={() => setCheckboxType('single')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
            checkboxType === 'single'
              ? 'bg-emerald-500 text-black font-semibold shadow-md shadow-emerald-500/20'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <ListOrdered className="w-4 h-4" />
          Single Reorder
        </button>
        <button
          type="button"
          onClick={() => setCheckboxType('group')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
            checkboxType === 'group'
              ? 'bg-emerald-500 text-black font-semibold shadow-md shadow-emerald-500/20'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          Group Reorder
        </button>
      </div>

      {/* Main Track List Container */}
      <div className="w-full flex justify-center">
        {loadingTracks ? (
          <div className="my-16">
            <Loader />
          </div>
        ) : tracks.length > 0 ? (
          <ul className="w-full max-w-3xl flex flex-col gap-4 mb-32">
            {tracks.map((trackItem, idx) => (
              <Track
                key={`${trackItem.track?.id || 'track'}-${idx}`}
                index={idx}
                item={trackItem.track}
                size={'64'}
                type={checkboxType}
                selectedTracks={selectedTracks}
                toggleTrackSelection={toggleTrackSelection}
              />
            ))}
          </ul>
        ) : (
          <div className="my-16 text-center text-zinc-500 flex flex-col items-center gap-2">
            <AlertCircle className="w-8 h-8 opacity-40" />
            <p>No tracks loaded. Choose a playlist above to view tracks.</p>
          </div>
        )}
      </div>

      {/* Floating Action Form Panel */}
      {tracks.length > 0 && (
        <aside className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 bg-zinc-900/90 border border-white/10 p-6 rounded-2xl shadow-2xl w-80 backdrop-blur-xl z-40">
          {checkboxType === 'single' ? (
            <form onSubmit={moveTracks}>
              <div className="flex items-center gap-2 mb-4">
                <Move className="w-5 h-5 text-emerald-400" />
                <h3 className="text-white text-base font-bold">Move Single Track</h3>
              </div>
              <div className="flex flex-col gap-3 mb-5">
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Origin Index</label>
                  <input
                    type="number"
                    name="origin"
                    placeholder="e.g. 0"
                    min={1}
                    max={tracks.length}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/80 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Destination Index</label>
                  <input
                    type="number"
                    name="destination"
                    placeholder="e.g. 5"
                    min={1}
                    max={tracks.length}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/80 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold py-2.5 px-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 text-sm"
              >
                Apply Reorder
              </button>
            </form>
          ) : (
            <form onSubmit={moveGroupTracks}>
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                <h3 className="text-white text-base font-bold">Move Selected Group</h3>
              </div>
              <p className="text-xs text-zinc-400 mb-4">
                Selected: <span className="text-emerald-400 font-bold">{selectedTracks.length}</span> tracks
              </p>

              <div className="flex flex-col gap-3 mb-5">
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">New Target Start Index</label>
                  <input
                    type="number"
                    name="first_new_position"
                    placeholder="Target index"
                    min={0}
                    max={tracks.length}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-800/80 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold py-2.5 px-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 text-sm"
              >
                Move Group
              </button>
            </form>
          )}
        </aside>
      )}
    </div>
  );
};

export default Page;