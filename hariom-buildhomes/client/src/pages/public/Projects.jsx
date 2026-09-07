import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, MapPin, Search, Filter, HardHat, 
  ChevronRight, Sparkles, ShieldCheck, IndianRupee, Layers
} from 'lucide-react';
import { api } from '../../api/client';
import { useSite } from '../../context/SiteContext';
import StatusBadge from '../../components/common/StatusBadge';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedBhk, setSelectedBhk] = useState('all');
  const { openEnquiryModal } = useSite();

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await api.getProjects();
        setProjects(data || []);
      } catch (err) {
        console.error('Error fetching projects', err);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  const filtered = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.nameHi && p.nameHi.includes(searchTerm));
    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
    const matchesBhk = selectedBhk === 'all' || (p.configurations && p.configurations.some(c => c.includes(selectedBhk)));
    return matchesSearch && matchesStatus && matchesBhk;
  });

  return (
    <div className="space-y-12 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold uppercase tracking-wider">
            Premium Residential Portfolio
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight">
            Our Construction Projects (सभी प्रोजेक्ट्स)
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Ongoing, Ready to Move और Upcoming प्रोजेक्ट्स की पूरी सूची। लाइव प्रोग्रेस, फ्लोर प्लान और उपलब्ध मकानों की जानकारी देखें।
          </p>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-md border border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by project name or location (प्रोजेक्ट खोजें)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Status Filter */}
        <div className="md:col-span-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Statuses (सभी स्थितियां)</option>
            <option value="ongoing">🟢 Ongoing Construction (चालू निर्माण)</option>
            <option value="ready">🔵 Ready to Move (रेडी टू मूव)</option>
            <option value="upcoming">🟡 Upcoming Launch (आगामी प्रोजेक्ट)</option>
            <option value="sold_out">🔴 Sold Out (पूर्ण सोल्ड)</option>
          </select>
        </div>

        {/* BHK Filter */}
        <div className="md:col-span-3">
          <select
            value={selectedBhk}
            onChange={(e) => setSelectedBhk(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Configurations (सभी BHK)</option>
            <option value="2 BHK">2 BHK Apartments / Villas</option>
            <option value="3 BHK">3 BHK Luxury</option>
            <option value="4 BHK">4 BHK Grand / Penthouse</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-500">Loading projects...</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 p-8 space-y-3">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-700">No projects match your filter criteria</h3>
          <p className="text-xs text-slate-400">Try resetting filters to explore all developments.</p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedStatus('all'); setSelectedBhk('all'); }}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col justify-between group"
            >
              {/* Image & Badges */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                <img
                  src={project.heroImage}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <StatusBadge status={project.status} />
                </div>
                <div className="absolute bottom-3 right-3 bg-slate-950/85 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-xl">
                  Starts {project.startingPrice}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-xl font-bold text-slate-900 font-heading group-hover:text-amber-600 transition">
                      {project.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    {project.location}
                  </p>
                  {project.configurations && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {project.configurations.map((cfg, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold">
                          {cfg}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Specs Box */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center text-xs">
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">Total Units</span>
                    <span className="font-bold text-slate-800">{project.totalHomes}</span>
                  </div>
                  <div className="bg-emerald-50/70 p-2 rounded-xl">
                    <span className="text-[10px] text-emerald-600 block">Available</span>
                    <span className="font-bold text-emerald-700">{project.availableHomes} Units</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">Possession</span>
                    <span className="font-bold text-slate-800">{project.possessionDate?.split(' ')[0] || '2027'}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                {project.constructionProgress && (
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-600 flex items-center gap-1">
                        <HardHat className="w-3.5 h-3.5 text-amber-500" />
                        Construction Status
                      </span>
                      <span className="text-amber-600 font-bold">
                        {project.constructionProgress.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${project.constructionProgress.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="pt-2 flex items-center gap-2">
                  <Link
                    to={`/projects/${project.id}`}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs text-center transition flex items-center justify-center gap-1"
                  >
                    <span>View Project Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => openEnquiryModal(project)}
                    className="px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition cursor-pointer"
                    title="Quick Enquiry"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
