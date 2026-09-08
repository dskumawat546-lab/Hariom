import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Compass, Building2, Train, Plane, School, Hospital, ShoppingBag, PhoneCall, Sparkles } from 'lucide-react';
import { api } from '../../api/client';
import { useSite } from '../../context/SiteContext';

export default function Location() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const { openEnquiryModal, settings } = useSite();

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getProjects();
        setProjects(data || []);
        if (data && data.length > 0) {
          setSelectedProjectId(data[0].id);
        }
      } catch (err) {
        console.error('Error fetching location data', err);
      }
    }
    loadData();
  }, []);

  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  return (
    <div className="space-y-12 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
        <div className="max-w-2xl space-y-3">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold uppercase tracking-wider">
            Prime Connectivity & Map
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight">
            Strategic Project Locations (प्रोजेक्ट लोकेशन)
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            मुख्य हाईवे, रेलवे स्टेशन, एयरपोर्ट, स्कूल और अस्पतालों के सबसे नजदीक प्राइम लोकेशन्स।
          </p>
        </div>
      </div>

      {/* Project Selector Pills */}
      <div className="flex flex-wrap gap-2 p-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
        {projects.map((proj) => (
          <button
            key={proj.id}
            onClick={() => setSelectedProjectId(proj.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              selectedProjectId === proj.id
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{proj.name}</span>
          </button>
        ))}
      </div>

      {/* Location Details Showcase */}
      {currentProject && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Distances List */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Selected Landmark</span>
                <h2 className="text-2xl font-black font-heading text-slate-900">{currentProject.name}</h2>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  {currentProject.locationDetails?.address || currentProject.location}
                </p>
              </div>

              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-2">
                Distances to Key City Landmarks (प्रमुख दूरियां)
              </h3>

              <div className="space-y-3">
                {currentProject.locationDetails?.distances && currentProject.locationDetails.distances.map((dist, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between hover:bg-amber-50/50 hover:border-amber-300 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{dist.place}</h4>
                        {dist.placeHi && <span className="text-xs text-slate-400">{dist.placeHi}</span>}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-amber-600">{dist.distance}</span>
                      <span className="text-[11px] text-slate-400 block font-medium">~{dist.time || 'few mins'}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <button
                  onClick={() => openEnquiryModal(currentProject)}
                  className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer"
                >
                  Book Free Site Visit (विजिट बुक करें)
                </button>
              </div>
            </div>
          </div>

          {/* Map Viewer */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-4 shadow-xl border border-slate-100">
            <div className="rounded-2xl overflow-hidden h-[460px] bg-slate-100">
              <iframe
                title="Map"
                src={currentProject.locationDetails?.mapEmbedUrl || 'https://maps.google.com/maps?q=Jaipur&t=&z=13&ie=UTF8&iwloc=&output=embed'}
                className="w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
