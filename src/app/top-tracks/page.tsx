'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import Track from '../../components/Track';
import Loader from '../../components/Loader';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Flame, AlertCircle } from 'lucide-react';
import { trackType } from '@/src/lib/types';

const Page = () => {
  const [tracks, setTracks] = useState<trackType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/top-tracks`, { withCredentials: true });
        const trackArray = Array.isArray(res.data) ? res.data : res.data?.items || [];
        setTracks(trackArray);
      } catch (error) {
        console.error('Failed to fetch top tracks', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopTracks();
  }, []);

  // Stagger entrance animation on data load without ScrollTrigger hiding the 1st track
  useGSAP(() => {
    if (tracks.length === 0) return;
    gsap.fromTo(
      'ul li',
      { opacity: 0, y: 25, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.4,
        stagger: 0.04,
        ease: 'power2.out',
      }
    );
  }, [tracks]);

  return (
    <div className="px-6 sm:px-12 md:px-16 lg:px-24 max-w-5xl mx-auto max-h-[calc(100vh-6rem)] overflow-y-auto [scrollbar-color:#3f3f46_transparent]">
      {/* Page Header */}
      <div className="text-center mb-10 pt-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Flame className="w-4 h-4" /> Most Played
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Your Top Tracks</h2>
        <p className="text-zinc-400 text-sm mt-2">Based on your recent listening history</p>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="my-16">
          <Loader />
        </div>
      ) : tracks.length > 0 ? (
        <ul className="flex flex-col gap-3 items-center pb-16 w-full">
          {tracks.map((track, idx) => (
            <Track key={track.id || idx} index={idx} item={track} size="64" />
          ))}
        </ul>
      ) : (
        <div className="my-16 text-center text-zinc-500 flex flex-col items-center gap-2">
          <AlertCircle className="w-8 h-8 opacity-40" />
          <p>No top tracks found in your listening history.</p>
        </div>
      )}
    </div>
  );
};

export default Page;