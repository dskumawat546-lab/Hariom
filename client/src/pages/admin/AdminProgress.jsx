import React, { useState, useEffect } from 'react';
import { 
  HardHat, Plus, Save, CheckCircle2, 
  Clock, Image, Play, Sparkles, X, Trash2 
} from 'lucide-react';
import { api } from '../../api/client';
import { useSite } from '../../context/SiteContext';

export default function AdminProgress() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast, refreshSiteData } = useSite();

  // Selected project state
  const [percentage, setPercentage] = useState(50);
  const [currentStageTitle, setCurrentStageTitle] = useState('');
  const [currentStageHi, setCurrentStageHi] = useState('');
  const [stages, setStages] = useState([]);
  const [monthlyUpdates, setMonthlyUpdates] = useState([]);

  // New Monthly Update Form
  const [newLogTitle, setNewLogTitle] = useState('');
  const [newLogDesc, setNewLogDesc] = useState('');
  const [newLogDescHi, setNewLogDescHi] = useState('');
  const [newLogPhoto, setNewLogPhoto] = useState('');
  const [newLogVideo, setNewLogVideo] = useState('');

  const loadProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data || []);
      if (data && data.length > 0) {
        selectProject(data[0]);
      }
    } catch (err) {
      console.error('Failed to load projects for progress admin', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const selectProject = (proj) => {
    setSelectedProjectId(proj.id);
    const cp = proj.constructionProgress || {};
    setPercentage(cp.percentage || 0);
    setCurrentStageTitle(cp.currentStageTitle || '');
    setCurrentStageHi(cp.currentStageHi || '');
    setStages(cp.stages || [
      { id: 's1', name: 'Foundation Work', nameHi: 'नींव कार्य', status: 'completed', progress: 100, date: 'Completed' },
      { id: 's2', name: 'Ground Floor Structure', nameHi: 'भूतल स्ट्रक्चर', status: 'running', progress: 50, date: 'Running' },
      { id: 's3', name: 'Finishing & Handover', nameHi: 'फिनिशिंग व पजेशन', status: 'pending', progress: 0, date: 'Pending' }
    ]);
    setMonthlyUpdates(cp.monthlyUpdates || []);
  };

  const handleStageStatusChange = (index, newStatus) => {
    const updated = [...stages];
    updated[index].status = newStatus;
    updated[index].progress = newStatus === 'completed' ? 100 : newStatus === 'running' ? 50 : 0;
    setStages(updated);
  };

  const handleSaveProgress = async () => {
    if (!selectedProjectId) return;
    setSaving(true);
    try {
      const currentProj = projects.find(p => p.id === selectedProjectId);
      const todayStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

      const updatedProgress = {
        percentage: Number(percentage),
        currentStageTitle,
        currentStageHi,
        lastUpdated: todayStr,
        stages,
        monthlyUpdates
      };

      await api.updateProject(selectedProjectId, {
        constructionProgress: updatedProgress
      });

      showToast('Live construction progress saved successfully!');
      refreshSiteData();
    } catch (err) {
      showToast('Failed to save progress', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddMonthlyLog = () => {
    if (!newLogTitle || !newLogPhoto) {
      showToast('Please provide an update title and photo URL', 'error');
      return;
    }

    const todayStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const newEntry = {
      id: 'up-' + Date.now(),
      date: todayStr,
      monthTitle: newLogTitle,
      description: newLogDesc,
      descriptionHi: newLogDescHi || newLogDesc,
      photo: newLogPhoto,
      videoUrl: newLogVideo
    };

    setMonthlyUpdates([newEntry, ...monthlyUpdates]);
    setNewLogTitle('');
    setNewLogDesc('');
    setNewLogDescHi('');
    setNewLogPhoto('');
    setNewLogVideo('');
    showToast('New monthly photo log added! Click "Save All Changes" to publish.');
  };

  const handleDeleteMonthlyLog = (id) => {
    setMonthlyUpdates(monthlyUpdates.filter(u => u.id !== id));
    showToast('Log entry removed');
  };

  const currentProj = projects.find(p => p.id === selectedProjectId);

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight">
            Live Construction Progress Manager (निर्माण प्रगति)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Update project % completion, milestones, stages & monthly on-site logs
          </p>
        </div>

        <button
          onClick={handleSaveProgress}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save All Changes (अपडेट सेव करें)'}</span>
        </button>
      </div>

      {/* Project Selector Tabs */}
      <div className="flex flex-wrap gap-2 p-2 bg-slate-800/80 rounded-2xl border border-slate-700">
        {projects.map((proj) => (
          <button
            key={proj.id}
            onClick={() => selectProject(proj)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              selectedProjectId === proj.id ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <HardHat className="w-4 h-4" />
            <span>{proj.name}</span>
          </button>
        ))}
      </div>

      {currentProj && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Progress Sliders & Stages */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-800/70 rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-xl space-y-6">
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <HardHat className="w-5 h-5 text-amber-400" />
                Overall Completion Percentage
              </h3>

              {/* Progress Slider */}
              <div className="space-y-3 p-5 rounded-2xl bg-slate-900 border border-slate-700">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-300">Drag Progress Slider (0% - 100%)</span>
                  <span className="text-2xl font-black text-amber-400 font-heading">{percentage}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={percentage}
                  onChange={(e) => setPercentage(Number(e.target.value))}
                  className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Current Milestone Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Current Active Stage (English)
                  </label>
                  <input
                    type="text"
                    value={currentStageTitle}
                    onChange={(e) => setCurrentStageTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Current Active Stage (Hindi)
                  </label>
                  <input
                    type="text"
                    value={currentStageHi}
                    onChange={(e) => setCurrentStageHi(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Stage Milestones Checklist */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Individual Construction Stages
                </h4>
                <div className="space-y-2.5">
                  {stages.map((st, idx) => (
                    <div
                      key={st.id || idx}
                      className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700 flex items-center justify-between gap-4"
                    >
                      <div>
                        <h5 className="text-xs font-bold text-white">{st.name}</h5>
                        {st.nameHi && <p className="text-[11px] text-slate-400">{st.nameHi}</p>}
                      </div>

                      <div className="inline-flex rounded-lg p-1 bg-slate-800 border border-slate-700">
                        <button
                          type="button"
                          onClick={() => handleStageStatusChange(idx, 'completed')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                            st.status === 'completed' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400'
                          }`}
                        >
                          Completed
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStageStatusChange(idx, 'running')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                            st.status === 'running' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400'
                          }`}
                        >
                          Running
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStageStatusChange(idx, 'pending')}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                            st.status === 'pending' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'
                          }`}
                        >
                          Pending
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Add Monthly Construction Photo / Video Log */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-800/70 rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Image className="w-5 h-5 text-amber-400" />
                Add Monthly Photo / Video Log
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Update Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. August 2026 Slab Milestone"
                    value={newLogTitle}
                    onChange={(e) => setNewLogTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Photo URL *</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={newLogPhoto}
                    onChange={(e) => setNewLogPhoto(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Video Embed URL (YouTube/MP4 - Optional)</label>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/embed/..."
                    value={newLogVideo}
                    onChange={(e) => setNewLogVideo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Engineer Note / Description</label>
                  <textarea
                    rows="2"
                    placeholder="Ground floor slab casting completed with 100% curing test passed..."
                    value={newLogDesc}
                    onChange={(e) => setNewLogDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  ></textarea>
                </div>

                <button
                  type="button"
                  onClick={handleAddMonthlyLog}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Attach Update to Project</span>
                </button>
              </div>

              {/* List of Existing Monthly Logs */}
              <div className="pt-4 border-t border-slate-700 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Published Monthly Logs ({monthlyUpdates.length})
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {monthlyUpdates.map((log) => (
                    <div key={log.id} className="p-3 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={log.photo} alt="log" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate">{log.monthTitle}</p>
                          <span className="text-[10px] text-slate-400">{log.date}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteMonthlyLog(log.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
