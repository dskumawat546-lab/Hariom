import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Building2, MapPin, 
  ExternalLink, Sparkles, X, Check, Search 
} from 'lucide-react';
import { api } from '../../api/client';
import { useSite } from '../../context/SiteContext';
import StatusBadge from '../../components/common/StatusBadge';

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const { showToast, refreshSiteData } = useSite();

  const [formData, setFormData] = useState({
    name: '',
    nameHi: '',
    tagline: '',
    status: 'ongoing',
    location: '',
    totalHomes: 24,
    availableHomes: 10,
    startingPrice: '₹45.0 Lakhs',
    startingPriceVal: 4500000,
    possessionDate: 'December 2027',
    reraNumber: 'Applied',
    totalArea: '3.5 Acres',
    heroImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    description: ''
  });

  const loadProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data || []);
    } catch (err) {
      console.error('Failed to load projects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      name: '',
      nameHi: '',
      tagline: '',
      status: 'ongoing',
      location: 'Jaipur, Rajasthan',
      totalHomes: 24,
      availableHomes: 10,
      startingPrice: '₹48.0 Lakhs',
      startingPriceVal: 4800000,
      possessionDate: 'December 2027',
      reraNumber: 'RAJ/P/2024/XXXX',
      totalArea: '3.5 Acres',
      heroImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      description: 'Modern residential project with prime connectivity and premium luxury amenities.'
    });
    setModalOpen(true);
  };

  const openEditModal = (proj) => {
    setEditingProject(proj);
    setFormData({
      name: proj.name || '',
      nameHi: proj.nameHi || '',
      tagline: proj.tagline || '',
      status: proj.status || 'ongoing',
      location: proj.location || '',
      totalHomes: proj.totalHomes || 24,
      availableHomes: proj.availableHomes || 10,
      startingPrice: proj.startingPrice || '',
      startingPriceVal: proj.startingPriceVal || 4500000,
      possessionDate: proj.possessionDate || '',
      reraNumber: proj.reraNumber || '',
      totalArea: proj.totalArea || '',
      heroImage: proj.heroImage || '',
      description: proj.description || ''
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      showToast('Project name is required', 'error');
      return;
    }

    try {
      if (editingProject) {
        await api.updateProject(editingProject.id, formData);
        showToast('Project updated successfully!');
      } else {
        await api.createProject(formData);
        showToast('New project created successfully!');
      }
      setModalOpen(false);
      await loadProjects();
      refreshSiteData();
    } catch (err) {
      showToast(err.message || 'Failed to save project', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete "${name}" and all associated inventory units?`)) {
      try {
        // Optimistically remove from state immediately
        setProjects(prev => prev.filter(p => p.id !== id));
        await api.deleteProject(id);
        showToast(`Project "${name}" and its units permanently deleted`);
        await loadProjects();
        refreshSiteData();
      } catch (err) {
        showToast('Failed to delete project', 'error');
        await loadProjects();
      }
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight">
            Project Management (प्रोजेक्ट प्रबंधन)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Add, edit, and organize residential developments across the platform
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Project (नया प्रोजेक्ट जोड़ें)</span>
        </button>
      </div>

      {/* Projects List Table */}
      <div className="bg-slate-800/70 rounded-3xl overflow-hidden border border-slate-700 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase font-bold border-b border-slate-700">
              <tr>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Units</th>
                <th className="px-6 py-4">Starting Price</th>
                <th className="px-6 py-4">Possession</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-300">
              {projects.map((proj) => (
                <tr key={proj.id} className="hover:bg-slate-800/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={proj.heroImage}
                        alt={proj.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                      />
                      <div>
                        <h4 className="font-bold text-white text-sm">{proj.name}</h4>
                        {proj.nameHi && <span className="text-[11px] text-slate-400">{proj.nameHi}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{proj.location}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={proj.status} size="sm" />
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    <span className="text-emerald-400 font-bold">{proj.availableHomes}</span>
                    <span className="text-slate-500"> / {proj.totalHomes} Total</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-amber-400">{proj.startingPrice}</td>
                  <td className="px-6 py-4 text-slate-400">{proj.possessionDate}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(proj)}
                        className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-amber-400 transition cursor-pointer"
                        title="Edit Project"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(proj.id, proj.name)}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Project Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-700 p-6 sm:p-8 space-y-6 text-white">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-xl font-bold font-heading text-white">
                {editingProject ? 'Edit Project Details' : 'Add New Construction Project'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Project Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Project Name (Hindi / नाम)
                  </label>
                  <input
                    type="text"
                    value={formData.nameHi}
                    onChange={(e) => setFormData({ ...formData, nameHi: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Status (स्थिति)
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="ongoing">🟢 Ongoing Construction</option>
                    <option value="ready">🔵 Ready to Move</option>
                    <option value="upcoming">🟡 Upcoming Launch</option>
                    <option value="sold_out">🔴 Sold Out</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Starting Price (मूल्य)
                  </label>
                  <input
                    type="text"
                    value={formData.startingPrice}
                    onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Possession Date (पजेशन)
                  </label>
                  <input
                    type="text"
                    value={formData.possessionDate}
                    onChange={(e) => setFormData({ ...formData, possessionDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Total Units
                  </label>
                  <input
                    type="number"
                    value={formData.totalHomes}
                    onChange={(e) => setFormData({ ...formData, totalHomes: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Available Units
                  </label>
                  <input
                    type="number"
                    value={formData.availableHomes}
                    onChange={(e) => setFormData({ ...formData, availableHomes: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    RERA Number
                  </label>
                  <input
                    type="text"
                    value={formData.reraNumber}
                    onChange={(e) => setFormData({ ...formData, reraNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Location Address
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Hero Image URL
                </label>
                <input
                  type="text"
                  value={formData.heroImage}
                  onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Project Description
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md cursor-pointer"
                >
                  {editingProject ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
