import React, { useState, useEffect } from 'react';
import { 
  Home, Search, Filter, Sparkles, MapPin, 
  IndianRupee, BedDouble, Layers, Check, Download, Eye 
} from 'lucide-react';
import { api } from '../../api/client';
import { useSite } from '../../context/SiteContext';
import StatusBadge from '../../components/common/StatusBadge';
import FloorPlanModal from '../../components/common/FloorPlanModal';

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedBhk, setSelectedBhk] = useState('all');
  const [selectedFloorPlan, setSelectedFloorPlan] = useState(null);
  const { openEnquiryModal } = useSite();

  useEffect(() => {
    async function loadData() {
      try {
        const [propsData, projsData] = await Promise.all([
          api.getProperties(),
          api.getProjects()
        ]);
        setProperties(propsData || []);
        setProjects(projsData || []);
      } catch (err) {
        console.error('Error fetching inventory data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = properties.filter((p) => {
    const matchProj = selectedProject === 'all' || p.projectId === selectedProject;
    const matchStatus = selectedStatus === 'all' || p.status === selectedStatus;
    const matchBhk = selectedBhk === 'all' || p.bhk.includes(selectedBhk);
    return matchProj && matchStatus && matchBhk;
  });

  return (
    <div className="space-y-12 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
        <div className="max-w-2xl space-y-3">
          <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 text-xs font-bold uppercase tracking-wider">
            Ready to Move & Available Units
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight">
            Ready to Move Homes (उपलब्ध मकान)
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            हर यूनिट की वास्तविक स्थिति (🟢 Available, 🟡 On Hold, 🔴 Sold Out), फ्लोर प्लान और मूल्य की पूरी पारदर्शिता।
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-md border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Filter by Project</label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Projects (सभी प्रोजेक्ट्स)</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Filter by Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Statuses (सभी स्थितियां)</option>
            <option value="available">🟢 Available (उपलब्ध)</option>
            <option value="hold">🟡 On Hold (होल्ड / टोकन)</option>
            <option value="sold">🔴 Sold Out (बिका हुआ)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Filter by BHK</label>
          <select
            value={selectedBhk}
            onChange={(e) => setSelectedBhk(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All BHK Types</option>
            <option value="2 BHK">2 BHK</option>
            <option value="3 BHK">3 BHK</option>
            <option value="4 BHK">4 BHK / Villa</option>
          </select>
        </div>
      </div>

      {/* Grid of Houses */}
      {loading ? (
        <div className="py-20 text-center text-slate-500">Loading units inventory...</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-100 p-8 space-y-3">
          <Home className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-700">No properties found with selected filters</h3>
          <button
            onClick={() => { setSelectedProject('all'); setSelectedStatus('all'); setSelectedBhk('all'); }}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((prop) => {
            const isAvail = prop.status === 'available';
            return (
              <div
                key={prop.id}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 border border-slate-100 flex flex-col justify-between"
              >
                {/* Photo & Status */}
                <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                  <img src={prop.image} alt={prop.houseNo} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3">
                    <StatusBadge status={prop.status} />
                  </div>
                  <div className="absolute bottom-3 left-3 bg-slate-950/85 text-white text-xs font-bold px-3 py-1 rounded-xl backdrop-blur-sm">
                    {prop.bhk} • {prop.type}
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 font-heading">
                          House {prop.houseNo}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">{prop.projectName}</p>
                      </div>
                      <span className="text-base font-black text-emerald-700 font-heading">
                        {prop.price}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                      <div className="p-2.5 bg-slate-50 rounded-xl">
                        <span className="text-slate-400 block font-medium">Carpet Area</span>
                        <span className="font-bold text-slate-800">{prop.area}</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-xl">
                        <span className="text-slate-400 block font-medium">Floor & Facing</span>
                        <span className="font-bold text-slate-800 truncate block">{prop.floor}</span>
                      </div>
                    </div>

                    {prop.features && (
                      <div className="mt-3 space-y-1">
                        {prop.features.slice(0, 3).map((f, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedFloorPlan({
                        type: `${prop.houseNo} (${prop.bhk})`,
                        area: prop.area,
                        price: prop.price,
                        floorPlanImg: prop.floorPlan || prop.image,
                        features: prop.features
                      })}
                      className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Floor Plan</span>
                    </button>

                    {isAvail ? (
                      <button
                        onClick={() => openEnquiryModal({ name: `House ${prop.houseNo} - ${prop.projectName}`, startingPrice: prop.price })}
                        className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer"
                      >
                        Book Unit Now (बुक करें)
                      </button>
                    ) : (
                      <div className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-400 font-bold text-xs text-center">
                        {prop.statusLabel}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floor Plan Viewer Modal */}
      <FloorPlanModal
        plan={selectedFloorPlan}
        isOpen={!!selectedFloorPlan}
        onClose={() => setSelectedFloorPlan(null)}
      />
    </div>
  );
}
