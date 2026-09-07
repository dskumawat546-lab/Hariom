import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  HardHat, Calendar, CheckCircle2, Play, Eye, 
  MapPin, ArrowRight, Sparkles, Building2, ChevronRight 
} from 'lucide-react';
import { api } from '../../api/client';
import MediaLightbox from '../../components/common/MediaLightbox';

export default function ConstructionUpdates() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getProjects();
        setProjects(data || []);
      } catch (err) {
        console.error('Error fetching progress updates', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-16 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <HardHat className="w-4 h-4" />
            <span>100% Construction Transparency</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight">
            Live Construction Updates (निर्माण प्रगति)
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            हमारे सभी प्रोजेक्ट्स की नवीनतम निर्माण स्थिति, कंक्रीट स्लैब कास्टिंग, स्ट्रक्चरल स्टेज और मासिक ऑनसाइट फोटो/वीडियो रिपोर्ट।
          </p>
        </div>
      </div>

      {/* Projects Timeline Feed */}
      <div className="space-y-12">
        {loading ? (
          <div className="py-20 text-center text-slate-500">Loading live site updates...</div>
        ) : projects.map((project) => {
          const progress = project.constructionProgress;
          if (!progress) return null;

          return (
            <div
              key={project.id}
              className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-100 space-y-8"
            >
              {/* Project Header Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 text-xs font-bold uppercase">
                      {project.status === 'ready' ? 'Ready to Move' : 'Ongoing Construction'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Updated: {progress.lastUpdated}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900">
                    {project.name}
                  </h2>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    {project.location}
                  </p>
                </div>

                {/* Progress % Widget */}
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-[11px] text-slate-400 block uppercase font-bold">Progress</span>
                    <span className="text-2xl font-black text-amber-600 font-heading">
                      {progress.percentage}%
                    </span>
                  </div>
                  <div className="w-28 bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${progress.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Current Active Milestone Callout */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-center gap-3 text-amber-950">
                <HardHat className="w-5 h-5 text-amber-600 shrink-0" />
                <div className="text-xs sm:text-sm">
                  <span className="font-bold">Current Milestone: </span>
                  <span>{progress.currentStageTitle}</span>
                  {progress.currentStageHi && <span className="text-slate-600 ml-1">({progress.currentStageHi})</span>}
                </div>
              </div>

              {/* Stage Flow Badges */}
              {progress.stages && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Milestone Progress Pipeline
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {progress.stages.map((stage) => {
                      const isDone = stage.status === 'completed';
                      const isRun = stage.status === 'running';
                      return (
                        <div
                          key={stage.id}
                          className={`p-3.5 rounded-xl border text-xs ${
                            isDone ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                            isRun ? 'bg-amber-50 border-amber-200 text-amber-800' :
                            'bg-slate-50 border-slate-100 text-slate-400'
                          }`}
                        >
                          <span className="font-bold block">
                            {isDone ? '✅' : isRun ? '🔄' : '⏳'} {stage.name}
                          </span>
                          <span className="text-[10px] text-slate-500 block mt-0.5">{stage.date}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Monthly Updates Photo Stream */}
              {progress.monthlyUpdates && progress.monthlyUpdates.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Monthly Photo & Video Documentation
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {progress.monthlyUpdates.map((update) => (
                      <div
                        key={update.id}
                        className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 flex flex-col justify-between"
                      >
                        <div className="relative aspect-[16/9] bg-slate-900">
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
                          <h4 className="text-base font-bold text-slate-900">{update.monthTitle}</h4>
                          <p className="text-xs text-slate-600 leading-relaxed">{update.description}</p>
                          {update.descriptionHi && (
                            <p className="text-xs text-amber-800 font-semibold">{update.descriptionHi}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* View Full Project Link */}
              <div className="pt-2 text-right">
                <Link
                  to={`/projects/${project.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700"
                >
                  <span>Explore All House Details in {project.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <MediaLightbox
        item={selectedMedia}
        isOpen={!!selectedMedia}
        onClose={() => setSelectedMedia(null)}
      />
    </div>
  );
}
