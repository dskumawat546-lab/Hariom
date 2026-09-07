import React, { useState, useEffect } from 'react';
import { 
  Home, Plus, Edit, Trash2, CheckCircle2, 
  Clock, AlertCircle, X, Search, Filter, Layers 
} from 'lucide-react';
import { api } from '../../api/client';
import { useSite } from '../../context/SiteContext';
import StatusBadge from '../../components/common/StatusBadge';

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProp, setEditingProp] = useState(null);
  const [selectedProjFilter, setSelectedProjFilter] = useState('all');
  const { showToast, refreshSiteData } = useSite();

  const [formData, setFormData] = useState({
    houseNo: '',
    projectId: '',
    bhk: '3 BHK',
    type: 'Luxury Apartment',
    area: '1,450 sq.ft.',
    price: '₹58.0 Lakhs',
    priceVal: 5800000,
    floor: '2nd Floor',
    facing: 'East Facing (Vastu)',
    status: 'available',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    floorPlan: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80'
  });

  const loadData = async () => {
    try {
      const [propsData, projsData] = await Promise.all([
        api.getProperties(),
        api.getProjects()
      ]);
      setProperties(propsData || []);
      setProjects(projsData || []);
    } catch (err) {
      console.error('Failed to load inventory data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingProp(null);
    setFormData({
      houseNo: 'A-' + Math.floor(Math.random() * 800 + 100),
      projectId: projects[0]?.id || 'proj-1',
      bhk: '3 BHK',
      type: 'Luxury Corner Flat',
      area: '1,450 sq.ft.',
      price: '₹58.0 Lakhs',
      priceVal: 5800000,
      floor: '2nd Floor',
      facing: 'East Facing',
      status: 'available',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      floorPlan: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80'
    });
    setModalOpen(true);
  };

  const openEditModal = (prop) => {
    setEditingProp(prop);
    setFormData({
      houseNo: prop.houseNo,
      projectId: prop.projectId,
      bhk: prop.bhk,
      type: prop.type,
      area: prop.area,
      price: prop.price,
      priceVal: prop.priceVal || 5000000,
      floor: prop.floor,
      facing: prop.facing,
      status: prop.status,
      image: prop.image || '',
      floorPlan: prop.floorPlan || ''
    });
    setModalOpen(true);
  };

  const handleStatusQuickChange = async (propId, newStatus) => {
    try {
      await api.updateProperty(propId, { status: newStatus });
      showToast(`House status changed to ${newStatus.toUpperCase()}`);
      await loadData();
      refreshSiteData();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.houseNo) {
      showToast('House No. is required', 'error');
      return;
    }

    try {
      const selectedP = projects.find(p => p.id === formData.projectId);
      const payload = {
        ...formData,
        projectName: selectedP ? selectedP.name : 'Aadya Project'
      };

      if (editingProp) {
        await api.updateProperty(editingProp.id, payload);
        showToast('House details updated!');
      } else {
        await api.createProperty(payload);
        showToast('New house unit added to inventory!');
      }
      setModalOpen(false);
      await loadData();
      refreshSiteData();
    } catch (err) {
      showToast(err.message || 'Failed to save property', 'error');
    }
  };

  const handleDelete = async (id, houseNo) => {
    if (window.confirm(`Delete house unit ${houseNo}?`)) {
      try {
        await api.deleteProperty(id);
        showToast(`Unit ${houseNo} deleted`);
        await loadData();
        refreshSiteData();
      } catch (err) {
        showToast('Failed to delete', 'error');
      }
    }
  };

  const filtered = properties.filter(p => {
    if (selectedProjFilter === 'all') return true;
    return p.projectId === selectedProjFilter;
  });

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight">
            House & Unit Inventory (मकान इन्वेंट्री)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage real-time availability: Available ➔ On Hold ➔ Sold Out
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Unit (नया मकान जोड़ें)</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 p-2 bg-slate-800/80 rounded-2xl border border-slate-700">
        <button
          onClick={() => setSelectedProjFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            selectedProjFilter === 'all' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
          }`}
        >
          All Projects ({properties.length})
        </button>
        {projects.map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedProjFilter(p.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              selectedProjFilter === p.id ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Properties Table */}
      <div className="bg-slate-800/70 rounded-3xl overflow-hidden border border-slate-700 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 uppercase font-bold border-b border-slate-700">
              <tr>
                <th className="px-6 py-4">House No.</th>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">BHK & Area</th>
                <th className="px-6 py-4">Floor & Facing</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Quick Status Toggle</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-300">
              {filtered.map((prop) => (
                <tr key={prop.id} className="hover:bg-slate-800/50 transition">
                  <td className="px-6 py-4 font-bold text-white text-sm">
                    {prop.houseNo}
                  </td>
                  <td className="px-6 py-4 text-slate-300">{prop.projectName}</td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-amber-400">{prop.bhk}</span>
                    <span className="text-slate-400 block">{prop.area}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {prop.floor} • <span className="text-slate-500">{prop.facing}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-emerald-400">{prop.price}</td>
                  
                  {/* Status Toggle Buttons */}
                  <td className="px-6 py-4">
                    <div className="inline-flex rounded-xl p-1 bg-slate-900 border border-slate-700">
                      <button
                        onClick={() => handleStatusQuickChange(prop.id, 'available')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                          prop.status === 'available' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-emerald-400'
                        }`}
                        title="Mark Available"
                      >
                        Available
                      </button>
                      <button
                        onClick={() => handleStatusQuickChange(prop.id, 'hold')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                          prop.status === 'hold' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-amber-400'
                        }`}
                        title="Mark On Hold"
                      >
                        Hold
                      </button>
                      <button
                        onClick={() => handleStatusQuickChange(prop.id, 'sold')}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                          prop.status === 'sold' ? 'bg-rose-500 text-white font-black' : 'text-slate-400 hover:text-rose-400'
                        }`}
                        title="Mark Sold"
                      >
                        Sold
                      </button>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(prop)}
                        className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-amber-400 transition cursor-pointer"
                        title="Edit Unit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(prop.id, prop.houseNo)}
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition cursor-pointer"
                        title="Delete Unit"
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

      {/* Add / Edit Unit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-700 p-6 sm:p-8 space-y-6 text-white">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-xl font-bold font-heading text-white">
                {editingProp ? 'Edit House Unit' : 'Add New House Unit'}
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
                    House No. (मकान संख्या) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. A-102"
                    value={formData.houseNo}
                    onChange={(e) => setFormData({ ...formData, houseNo: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Project (प्रोजेक्ट)
                  </label>
                  <select
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    BHK
                  </label>
                  <select
                    value={formData.bhk}
                    onChange={(e) => setFormData({ ...formData, bhk: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="2 BHK">2 BHK</option>
                    <option value="3 BHK">3 BHK</option>
                    <option value="4 BHK">4 BHK</option>
                    <option value="Duplex Villa">Duplex Villa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Carpet Area
                  </label>
                  <input
                    type="text"
                    placeholder="1,450 sq.ft."
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Price (कीमत)
                  </label>
                  <input
                    type="text"
                    placeholder="₹58.0 Lakhs"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Floor
                  </label>
                  <input
                    type="text"
                    placeholder="1st Floor"
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Facing
                  </label>
                  <input
                    type="text"
                    placeholder="East Facing (Vastu)"
                    value={formData.facing}
                    onChange={(e) => setFormData({ ...formData, facing: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Status (स्थिति)
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="available">🟢 Available</option>
                    <option value="hold">🟡 On Hold</option>
                    <option value="sold">🔴 Sold Out</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Photo / Interior Render URL
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
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
                  {editingProp ? 'Update Unit' : 'Save Unit to Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
