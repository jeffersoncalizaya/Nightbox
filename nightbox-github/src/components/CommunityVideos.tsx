'use client';

import React, { useState } from 'react';
import { Play, ArrowRight, X } from 'lucide-react';
import { COMMUNITY_VIDEOS } from '@/lib/data';
import { CommunityVideo } from '@/lib/types';

export default function CommunityVideos() {
  const [activeVideo, setActiveVideo] = useState<CommunityVideo | null>(null);

  return (
    <div className="my-10">
      {/* Section Header */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Vídeos da Comunidade
        </h2>

        <button className="text-xs font-bold text-zinc-400 hover:text-white flex items-center gap-1 transition cursor-pointer">
          <span>Ver mais vídeos</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Videos List / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {COMMUNITY_VIDEOS.map((video) => (
          <div
            key={video.id}
            onClick={() => setActiveVideo(video)}
            className="flex flex-col group cursor-pointer"
          >
            {/* Thumbnail with Play Icon & Duration */}
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 group-hover:border-zinc-700 transition">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />

              {/* Dark subtle overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition" />

              {/* Play Button Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-red-600 transition duration-300">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </div>
              </div>

              {/* Timestamp badge */}
              <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono font-bold text-white">
                {video.duration}
              </div>
            </div>

            {/* Title */}
            <p className="mt-2 text-xs font-semibold text-zinc-300 group-hover:text-white line-clamp-2 leading-snug">
              {video.title}
            </p>
          </div>
        ))}
      </div>

      {/* Video Modal Preview */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg bg-[#141419] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 flex items-center justify-between border-b border-zinc-800">
              <span className="font-bold text-sm text-white">{activeVideo.title}</span>
              <button 
                onClick={() => setActiveVideo(null)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <img
                src={activeVideo.thumbnailUrl}
                alt={activeVideo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center mb-3 text-white shadow-xl">
                  <Play className="w-7 h-7 fill-white ml-1" />
                </div>
                <span className="text-sm font-bold text-white">Review em Vídeo da Comunidade</span>
                <span className="text-xs text-zinc-300 mt-1">Duração: {activeVideo.duration}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
