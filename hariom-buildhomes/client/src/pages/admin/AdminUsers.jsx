import React, { useState, useEffect } from 'react';
import { Users, Plus, ShieldCheck, UserCheck, X, Trash2 } from 'lucide-react';
import { api } from '../../api/client';
import { useSite } from '../../context/SiteContext';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const { showToast } = useSite();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Manager'
  });

  const loadUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(data || []);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      showToast('All fields are required', 'error');
      return;
    }

    try {
      await api.createUser(formData);
      showToast('New team member added successfully!');
      setModalOpen(false);
      setFormData({ name: '', email: '', password: '', role: 'Manager' });
      await loadUsers();
    } catch (err) {
      showToast('Failed to add user', 'error');
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight">
            Team & User Role Access (प्रशासनिक यूज़र्स)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage permissions: Super Admin (Full Control), Manager (Projects & CRM), Editor (Media & Updates)
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team Member (नया यूज़र जोड़ें)</span>
        </button>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {users.map((u) => (
          <div
            key={u.id}
            className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700 shadow-xl space-y-4 flex flex-col justify-between"
          >
            <div className="flex items-center gap-4">
              <img
                src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                alt={u.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-500/40"
              />
              <div className="min-w-0">
                <h4 className="font-bold text-white text-sm truncate">{u.name}</h4>
                <p className="text-xs text-slate-400 truncate">{u.email}</p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold mt-1 uppercase ${
                  u.role === 'Super Admin' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  u.role === 'Manager' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {u.role}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-700 text-xs text-slate-400 space-y-1">
              <p>Role Scope: <b className="text-slate-200">
                {u.role === 'Super Admin' ? 'Full Website & System Control' :
                 u.role === 'Manager' ? 'Projects, Units & Leads' :
                 'Gallery & Progress Logs'}
              </b></p>
              <p>Joined: {u.createdAt || 'Active'}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-slate-700 p-6 sm:p-8 space-y-6 text-white">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-xl font-bold font-heading text-white">Add New Team Member</h3>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ankit Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="ankit@aadyahomes.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Temporary Password *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Assigned Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Manager">Manager (Projects, Inventory & Enquiries)</option>
                  <option value="Editor">Editor (Photos, Videos & Progress Logs)</option>
                  <option value="Super Admin">Super Admin (Full Access)</option>
                </select>
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
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
