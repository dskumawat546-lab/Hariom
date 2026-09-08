import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Trash2, Play, Sparkles, X, Filter } from 'lucide-react';
import { api } from '../../api/client';
import { useSite } from '../../context/SiteContext';

export default function AdminGallery() {
  const [gallery, setGallery] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { showToast } = useSite();

  const [formData, setFormData] = useState({
    title: '',
    titleHi: '',
    type: 'photo',
    category: 'construction',
    projectId: '',
    url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=1000&q=80',
    videoUrl: ''
  });

  const loadData = async () => {
    try {
      const [galData, projData] = await Promise.all([
        api.getGallery(),
        api.getProjects()
      ]);
      setGallery(galData || []);
      setProjects(projData || []);
      if (projData && projData.length > 0) {
        setFormData(prev => ({ ...prev, projectId: projData[0].id }));
      }
    } catch (err) {
      console.error('Failed to load gallery data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.url) {
      showToast('Title and Image URL are required', 'error');
      return;
    }

    try {
      const selectedP = projects.find(p => p.id === formData.projectId);
      await api.createGalleryItem({
        ...formData,
        projectName: selectedP ? selectedP.name : 'General Landmark'
      });
      showToast('New media item published to gallery!');
      setModalOpen(false);
      setFormData({
        title: '',
        titleHi: '',
        type: 'photo',
        category: 'construction',
        projectId: projects[0]?.id || '',
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=1000&q=80',
        videoUrl: ''
      });
      await loadData();
    } catch (err) {
      showToast('Failed to add gallery item', 'error');
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete "${title}" from gallery?`)) {
      try {
        await api.deleteGalleryItem(id);
        showToast('Media item deleted');
        await loadData();
      } catch (err) {
        showToast('Failed to delete', 'error');
      }
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight">
            Photo & Video Gallery Manager (मीडिया प्रबंधन)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Upload and organize exterior elevations, sample flat interiors, site construction photos and drone videos
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Media Item (फोटो/वीडियो जोड़ें)</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {gallery.map((item) => (
          <div
            key={item.id}
            className="bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-700 shadow-lg flex flex-col justify-between"
          >
            <div className="relative aspect-[4/3] bg-slate-950">
              <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-slate-900/80 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm uppercase">
                {item.category}
              </div>
              {(item.type === 'video' || item.videoUrl) && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Play className="w-8 h-8 text-amber-400 fill-amber-400" />
                </div>
              )}
            </div>

            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-white text-xs line-clamp-2">{item.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1">{item.projectName || 'General Site'}</p>
              </div>

              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">{item.date}</span>
                <button
                  onClick={() => handleDelete(item.id, item.title)}
                  className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition cursor-pointer"
                  title="Delete Media"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Media Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border border-slate-700 p-6 sm:p-8 space-y-6 text-white">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-xl font-bold font-heading text-white">Add New Media to Gallery</h3>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Title (English) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Bedroom Luxury Render"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Category (श्रेणी)</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="exterior">Elevation & Exterior</option>
                    <option value="interior">Interior & Sample Flat</option>
                    <option value="construction">Onsite Construction</option>
                    <option value="completed">Completed Houses</option>
                    <option value="drone">Drone & Walkthrough</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Associated Project</label>
                  <select
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Photo / Thumbnail Image URL *</label>
                <input
                  type="text"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Video Embed URL (Optional for YouTube/MP4)</label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/embed/..."
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold shadow-md"
                >
                  Publish to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
