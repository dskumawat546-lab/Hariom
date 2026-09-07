import React from 'react';
import { X, Play, Image as ImageIcon } from 'lucide-react';

export default function MediaLightbox({ item, isOpen, onClose }) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition cursor-pointer z-10"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="max-w-5xl w-full max-h-[85vh] flex flex-col items-center justify-center">
        {item.type === 'video' || item.videoUrl ? (
          <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/10">
            <iframe
              src={item.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
              title={item.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <img
            src={item.url}
            alt={item.title}
            className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10"
          />
        )}

        <div className="mt-4 text-center text-white px-4">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
            {item.category || 'Site Photograph'} {item.projectName ? `• ${item.projectName}` : ''}
          </span>
          <h3 className="text-lg md:text-xl font-bold mt-1">{item.title}</h3>
          {item.titleHi && <p className="text-sm text-slate-300">{item.titleHi}</p>}
        </div>
      </div>
    </div>
  );
}
