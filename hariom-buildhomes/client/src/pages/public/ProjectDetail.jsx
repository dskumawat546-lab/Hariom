import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, MapPin, ShieldCheck, HardHat, Calendar, 
  IndianRupee, BedDouble, Bath, Maximize2, Check, 
  Download, PhoneCall, Sparkles, Navigation, Clock, 
  ArrowLeft, Eye, Play, Share2, CheckCircle2, ChevronRight
} from 'lucide-react';
import { api } from '../../api/client';
import { useSite } from '../../context/SiteContext';
import StatusBadge from '../../components/common/StatusBadge';

import FloorPlanModal from '../../components/common/FloorPlanModal';
import MediaLightbox from '../../components/common/MediaLightbox';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModelTab, setActiveModelTab] = useState(0);
  const [selectedFloorPlan, setSelectedFloorPlan] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const { openEnquiryModal, showToast } = useSite();

  useEffect(() => {
    async function loadProject() {
      try {
        const data = await api.getProjectById(id);
        setProject(data);
      } catch (err) {
        console.error('Failed to load project details', err);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [id]);

  if (loading) {
    return <div className="py-24 text-center text-slate-500">Loading project details...</div>;
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Project Not Found</h2>
        <p className="text-sm text-slate-500">The requested project could not be located.</p>
        <Link to="/projects" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Projects</span>
        </Link>
      </div>
    );
  }

  const houseModels = project.houseModels || [];
  const activeModel = houseModels[activeModelTab] || houseModels[0];
  const construction = project.constructionProgress;
  const locationDetails = project.locationDetails;
  const projectProperties = project.properties || [];

  return (
    <div className="space-y-16 pb-20">
      {/* Breadcrumb & Navigation */}
      <div className="bg-slate-900 text-slate-300 py-3 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <Link to="/projects" className="hover:text-white">Projects</Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-amber-400 font-semibold">{project.name}</span>
          </div>

          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                showToast('Project link copied to clipboard!');
              }
            }}
            className="flex items-center gap-1 hover:text-white transition cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Project Hero Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Visuals & Gallery */}
          <div className="lg:col-span-7 space-y-3">
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl bg-slate-900 group">
              <img
                src={project.heroImage}
                alt={project.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <StatusBadge status={project.status} size="lg" />
              </div>
              <div className="absolute bottom-4 right-4 bg-slate-950/85 backdrop-blur-md text-white text-sm font-bold px-4 py-2 rounded-2xl border border-white/10">
                Starts {project.startingPrice}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {project.galleryImages && project.galleryImages.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {project.galleryImages.slice(0, 4).map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedMedia({ url: img, title: `${project.name} - Gallery Photo ${idx + 1}` })}
                    className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:opacity-90 transition border border-slate-200"
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-950/20 hover:bg-transparent transition"></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Project Highlights & CTA Box */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                {project.totalArea || '5.5 Acres Township'}
              </span>
              <h1 className="text-3xl sm:text-4xl font-black font-heading text-slate-900 mt-2">
                {project.name}
              </h1>
              {project.nameHi && (
                <p className="text-base text-slate-500 font-medium">{project.nameHi}</p>
              )}
              <p className="text-sm text-slate-600 flex items-center gap-1.5 mt-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{project.location}</span>
              </p>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              {project.description}
            </p>

            {/* Micro Highlight Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-slate-400 block font-medium">RERA Registration</span>
                <span className="text-slate-900 font-bold">{project.reraNumber || 'Approved'}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-slate-400 block font-medium">Expected Possession</span>
                <span className="text-slate-900 font-bold">{project.possessionDate}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-slate-400 block font-medium">Total Homes</span>
                <span className="text-slate-900 font-bold">{project.totalHomes} Units</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80">
                <span className="text-emerald-700 block font-medium">Available Inventory</span>
                <span className="text-emerald-800 font-bold">{project.availableHomes} Units Left</span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => openEnquiryModal(project)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-base shadow-xl shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-5 h-5" />
                <span>Book Site Visit & Download Brochure</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${project.phone || '+919983188677'}`}
                  className="py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <PhoneCall className="w-4 h-4 text-amber-400" />
                  <span>Call Project Manager</span>
                </a>

                <a
                  href={`https://wa.me/919983188677?text=${encodeURIComponent(`Hello Hariom Buildhomes, I need brochure & price list for ${project.name}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <span>WhatsApp Brochure</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* House Details & Interactive Floor Plans */}
      {houseModels.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Floor Plans & Architectural Layouts
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                House Configurations (उपलब्ध मकान और लेआउट)
              </h2>
            </div>

            {/* Model Tabs */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl">
              {houseModels.map((model, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveModelTab(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeModelTab === idx
                      ? 'bg-white text-slate-950 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {model.type}
                </button>
              ))}
            </div>
          </div>

          {/* Active Model Showcase Card */}
          {activeModel && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Floor Plan Diagram */}
              <div
                onClick={() => setSelectedFloorPlan(activeModel)}
                className="lg:col-span-6 relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 cursor-pointer group shadow-inner border border-slate-200 flex items-center justify-center"
              >
                <img
                  src={activeModel.floorPlanImg || 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80'}
                  alt={activeModel.type}
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-3 right-3 bg-slate-950/80 text-white text-xs px-3 py-1.5 rounded-xl backdrop-blur-sm flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                  Click to Expand & Zoom
                </div>
              </div>

              {/* Model Specifications */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-md">
                      {activeModel.type}
                    </span>
                    <span className="text-xl font-black text-emerald-700 font-heading">
                      {activeModel.price}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 font-heading mt-1">
                    {activeModel.type} Luxury Specification
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 block font-medium">Carpet Area</span>
                    <span className="text-slate-900 font-bold text-sm">{activeModel.carpetArea}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 block font-medium">Super Built-up</span>
                    <span className="text-slate-900 font-bold text-sm">{activeModel.superArea}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl">
                    <span className="text-slate-400 block font-medium">Bedrooms / Baths</span>
                    <span className="text-slate-900 font-bold text-sm">{activeModel.bedrooms || 3}B / {activeModel.bathrooms || 3}T</span>
                  </div>
                </div>

                {activeModel.features && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Key Amenities</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {activeModel.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedFloorPlan(activeModel)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-2 transition cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Download Floor Plan
                  </button>

                  <button
                    onClick={() => openEnquiryModal({ name: `${project.name} - ${activeModel.type}`, startingPrice: activeModel.price })}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    Enquire for this House
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Live Construction Progress Tracker Section */}
      {construction && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl border border-slate-800 space-y-8">
            {/* Header with % Circle */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <HardHat className="w-4 h-4" />
                  <span>Real-Time Site Engineering Log</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black font-heading text-white">
                  Live Construction Progress (निर्माण प्रगति)
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Last Updated on <b className="text-white">{construction.lastUpdated}</b> • Current Stage: <span className="text-amber-400">{construction.currentStageTitle}</span>
                </p>
              </div>

              {/* Progress Percentage Display */}
              <div className="flex items-center gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Overall Completion</span>
                  <span className="text-3xl font-black text-amber-400 font-heading">
                    {construction.percentage}%
                  </span>
                </div>
                <div className="w-16 h-16 rounded-full bg-slate-900 border-4 border-amber-500 flex items-center justify-center font-bold text-sm text-white">
                  {construction.percentage}%
                </div>
              </div>
            </div>

            {/* Stages Progression Timeline */}
            {construction.stages && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Milestone Stages (निर्माण के चरण)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {construction.stages.map((stage) => {
                    const isCompleted = stage.status === 'completed';
                    const isRunning = stage.status === 'running';
                    return (
                      <div
                        key={stage.id}
                        className={`p-4 rounded-2xl border transition ${
                          isCompleted
                            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                            : isRunning
                            ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                            : 'bg-slate-800/40 border-slate-700 text-slate-400'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            isCompleted ? 'bg-emerald-500/20 text-emerald-400' :
                            isRunning ? 'bg-amber-500/20 text-amber-400 animate-pulse' :
                            'bg-slate-700 text-slate-400'
                          }`}>
                            {isCompleted ? '✅ Completed' : isRunning ? '🔄 Running' : '⏳ Pending'}
                          </span>
                          <span className="text-[10px] text-slate-400">{stage.date}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1">{stage.name}</h4>
                        {stage.nameHi && <p className="text-xs text-slate-400 mt-0.5">{stage.nameHi}</p>}
                        <div className="w-full bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isCompleted ? 'bg-emerald-400' : isRunning ? 'bg-amber-400' : 'bg-transparent'
                            }`}
                            style={{ width: `${stage.progress || (isCompleted ? 100 : 0)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Monthly Construction Photo / Video Updates */}
            {construction.monthlyUpdates && construction.monthlyUpdates.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Monthly Site Photo & Video Logs (मासिक साइट अपडेट्स)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {construction.monthlyUpdates.map((update) => (
                    <div
                      key={update.id}
                      className="bg-slate-800/60 rounded-2xl overflow-hidden border border-slate-700/80 flex flex-col justify-between"
                    >
                      <div className="relative aspect-[16/9] bg-slate-950">
                        <img src={update.photo} alt={update.monthTitle} className="w-full h-full object-cover" />
                        {update.videoUrl && (
                          <div
                            onClick={() => setSelectedMedia({ videoUrl: update.videoUrl, title: update.monthTitle })}
                            className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/20 transition"
                          >
                            <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg">
                              <Play className="w-6 h-6 ml-0.5 fill-slate-950" />
                            </div>
                          </div>
                        )}
                        <div className="absolute top-3 left-3 bg-slate-950/80 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm">
                          {update.date}
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <h4 className="text-base font-bold text-white">{update.monthTitle}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">{update.description}</p>
                        {update.descriptionHi && (
                          <p className="text-xs text-amber-300/90 font-medium">{update.descriptionHi}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Location, Distance Matrix & Connectivity */}
      {locationDetails && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Prime Connectivity & Neighborhood
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Project Location & Distances (स्थान व प्रमुख दूरियां)
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Distances List */}
            <div className="lg:col-span-6 space-y-3">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 mb-4">
                <p className="text-xs font-semibold text-amber-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{locationDetails.address}</span>
                </p>
              </div>

              <div className="space-y-2.5">
                {locationDetails.distances && locationDetails.distances.map((dist, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between hover:border-amber-400 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{dist.place}</h4>
                        {dist.placeHi && <span className="text-xs text-slate-400">{dist.placeHi}</span>}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-amber-600 block">{dist.distance}</span>
                      <span className="text-[11px] text-slate-400 font-medium">~{dist.time || 'few mins'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Embedded Map */}
            <div className="lg:col-span-6 rounded-3xl overflow-hidden shadow-lg border border-slate-200 h-[380px] bg-slate-100">
              <iframe
                title="Project Location Map"
                src={locationDetails.mapEmbedUrl || 'https://maps.google.com/maps?q=Jaipur&t=&z=13&ie=UTF8&iwloc=&output=embed'}
                className="w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </section>
      )}

      {/* Available Units Inventory Table */}
      {projectProperties.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Live Inventory Status
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                Available Homes in this Project (उपलब्ध मकान)
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {projectProperties.filter(p => p.status === 'available').length} of {projectProperties.length} Units Available
            </span>
          </div>

          <div className="bg-white rounded-3xl overflow-hidden shadow-md border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">House No.</th>
                    <th className="px-6 py-4">BHK Type</th>
                    <th className="px-6 py-4">Carpet Area</th>
                    <th className="px-6 py-4">Floor & Facing</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {projectProperties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4 font-bold text-slate-900">{prop.houseNo}</td>
                      <td className="px-6 py-4">{prop.bhk}</td>
                      <td className="px-6 py-4">{prop.area}</td>
                      <td className="px-6 py-4 text-xs">
                        {prop.floor} • <span className="text-slate-400">{prop.facing}</span>
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-700">{prop.price}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={prop.status} size="sm" />
                      </td>
                      <td className="px-6 py-4 text-right">
                        {prop.status === 'available' ? (
                          <button
                            onClick={() => openEnquiryModal({ name: `${prop.houseNo} - ${project.name}`, startingPrice: prop.price })}
                            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition cursor-pointer"
                          >
                            Book Unit
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Not Available</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}



      {/* Modals */}
      <FloorPlanModal
        plan={selectedFloorPlan}
        isOpen={!!selectedFloorPlan}
        onClose={() => setSelectedFloorPlan(null)}
      />

      <MediaLightbox
        item={selectedMedia}
        isOpen={!!selectedMedia}
        onClose={() => setSelectedMedia(null)}
      />
    </div>
  );
}
