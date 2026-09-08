import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Play, Eye, Filter, Sparkles, Building2 } from 'lucide-react';
import { api } from '../../api/client';
import MediaLightbox from '../../components/common/MediaLightbox';

export default function Gallery() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    async function loadGallery() {
      try {
        const data = await api.getGallery(activeCategory === 'all' ? null : activeCategory);
        setGallery(data || []);
      } catch (err) {
        console.error('Error fetching gallery', err);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, [activeCategory]);

  const categories = [
    { key: 'all', label: 'All Media (सभी)' },
    { key: 'exterior', label: '🏡 Elevation & Exterior' },
    { key: 'interior', label: '🛋️ Interior & Living' },
    { key: 'construction', label: '🏗️ Onsite Construction' },
    { key: 'completed', label: '✨ Completed Houses' },
    { key: 'drone', label: '🚁 Drone & Videos' },
  ];

  return (
    <div className="space-y-12 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
        <div className="max-w-2xl space-y-3">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold uppercase tracking-wider">
            Visual Portfolio
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight">
            Photo & Video Gallery (गैलरी)
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            हमारे प्रोजेक्ट्स के एक्सटीरियर, इंटीरियर, सैंपल फ्लैट, क्लबहाउस और ऑनसाइट ड्रोन वीडियो का संग्रह।
          </p>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-white rounded-2xl shadow-sm border border-slate-200">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeCategory === cat.key
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-500">Loading gallery media...</div>
      ) : gallery.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-100 p-8 space-y-2">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No media found in this category</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((item) => {
            const isVideo = item.type === 'video' || item.videoUrl;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedMedia(item)}
                className="group relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-900 shadow-md hover:shadow-2xl transition duration-300 cursor-pointer border border-slate-200"
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity"></div>

                {/* Video Play Icon */}
                {isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 ml-0.5 fill-slate-950" />
                    </div>
                  </div>
                )}

                {/* Bottom Caption */}
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400 bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur-sm">
                    {item.category} • {item.projectName || 'General'}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-white leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox */}
      <MediaLightbox
        item={selectedMedia}
        isOpen={!!selectedMedia}
        onClose={() => setSelectedMedia(null)}
      />
    </div>
  );
}
