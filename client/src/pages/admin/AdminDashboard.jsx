import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, FolderKanban, Home, HardHat, MessageSquare, 
  Users, Plus, ArrowUpRight, CheckCircle2, Clock, RotateCcw, 
  Phone, Sparkles, AlertCircle 
} from 'lucide-react';
import { api } from '../../api/client';
import { useSite } from '../../context/SiteContext';
import StatusBadge from '../../components/common/StatusBadge';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast, refreshSiteData } = useSite();

  const loadDashboardData = async () => {
    try {
      const [statsData, enqData, projData] = await Promise.all([
        api.getStats(),
        api.getEnquiries(),
        api.getProjects()
      ]);
      setStats(statsData);
      setRecentEnquiries((enqData || []).slice(0, 5));
      setProjects(projData || []);
    } catch (err) {
      console.error('Failed to load admin stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleResetDB = async () => {
    if (window.confirm('Are you sure you want to reset all data back to the default seed dataset? Any newly created projects/leads will be restored to demo defaults.')) {
      try {
        await api.resetDatabase();
        showToast('Database successfully reset to seed defaults!');
        await loadDashboardData();
        refreshSiteData();
      } catch (err) {
        showToast('Failed to reset DB', 'error');
      }
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-10 max-w-7xl mx-auto">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight">
            Admin CMS Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time project inventory, live construction progression & lead CRM
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleResetDB}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
            title="Reset database to seed defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo DB</span>
          </button>

          <Link
            to="/admin/projects"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </Link>
        </div>
      </div>

      {/* Key Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Total Projects
          </span>
          <p className="text-2xl font-black text-white font-heading">{stats?.totalProjects || 0}</p>
          <span className="text-[10px] text-amber-400 font-semibold block">5 Master Sites</span>
        </div>

        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
            Ongoing Sites
          </span>
          <p className="text-2xl font-black text-emerald-400 font-heading">{stats?.ongoingProjects || 0}</p>
          <span className="text-[10px] text-slate-400 block">Active Construction</span>
        </div>

        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 block">
            Ready to Move
          </span>
          <p className="text-2xl font-black text-blue-400 font-heading">{stats?.readyProjects || 0}</p>
          <span className="text-[10px] text-slate-400 block">Immediate Handover</span>
        </div>

        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 block">
            Available Homes
          </span>
          <p className="text-2xl font-black text-emerald-300 font-heading">{stats?.availableHomes || 0}</p>
          <span className="text-[10px] text-slate-400 block">Ready for Sale</span>
        </div>

        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 block">
            Sold Homes
          </span>
          <p className="text-2xl font-black text-rose-400 font-heading">{stats?.soldHomes || 0}</p>
          <span className="text-[10px] text-slate-400 block">Booked / Occupied</span>
        </div>

        <div className="bg-slate-800/80 p-4 rounded-2xl border border-amber-500/40 space-y-1 bg-amber-500/10">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block">
            New Enquiries
          </span>
          <p className="text-2xl font-black text-amber-400 font-heading">{stats?.newEnquiries || 0}</p>
          <span className="text-[10px] text-amber-200 block">Action Required</span>
        </div>
      </div>

      {/* Summary Table: Projects Overview */}
      <div className="bg-slate-800/60 rounded-3xl p-6 sm:p-8 border border-slate-700/80 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <FolderKanban className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white font-heading">
              Projects & Construction Overview (प्रोजेक्ट स्थिति)
            </h2>
          </div>
          <Link to="/admin/projects" className="text-xs font-bold text-amber-400 hover:underline">
            Manage All Projects →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold text-white line-clamp-1">{proj.name}</h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{proj.location}</p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Available Units:</span>
                  <span className="font-bold text-emerald-400">{proj.availableHomes} of {proj.totalHomes}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Progress:</span>
                  <span className="font-bold text-amber-400">{proj.constructionProgress?.percentage || 0}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${proj.constructionProgress?.percentage || 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px]">
                <Link to="/admin/progress" className="text-amber-400 hover:underline font-semibold">
                  Update Progress
                </Link>
                <Link to={`/projects/${proj.id}`} target="_blank" className="text-slate-400 hover:text-white flex items-center gap-1">
                  <span>View</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Enquiries / CRM Spotlight */}
      <div className="bg-slate-800/60 rounded-3xl p-6 sm:p-8 border border-slate-700/80 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white font-heading">
              Recent Customer Enquiries (नई लीड्स)
            </h2>
          </div>
          <Link to="/admin/leads" className="text-xs font-bold text-amber-400 hover:underline">
            View All CRM Leads ({stats?.totalEnquiries || 0}) →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-bold border-b border-slate-700">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Phone & Email</th>
                <th className="px-4 py-3">Interested Project</th>
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60 text-slate-300">
              {recentEnquiries.map((enq) => (
                <tr key={enq.id} className="hover:bg-slate-800/50">
                  <td className="px-4 py-3.5 font-bold text-white">{enq.name}</td>
                  <td className="px-4 py-3.5">
                    <p className="font-semibold text-amber-300">{enq.phone}</p>
                    <p className="text-[11px] text-slate-400">{enq.email}</p>
                  </td>
                  <td className="px-4 py-3.5">{enq.projectName}</td>
                  <td className="px-4 py-3.5 font-medium">{enq.propertyType}</td>
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {enq.statusLabel || enq.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Link
                      to="/admin/leads"
                      className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold text-[11px] transition"
                    >
                      Manage Lead
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
