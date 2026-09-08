import React from 'react';
import { X, Download, PhoneCall, BedDouble, Bath, Maximize2, Check } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

export default function FloorPlanModal({ plan, isOpen, onClose }) {
  const { openEnquiryModal } = useSite();
  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200 relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase">
                {plan.type || 'Floor Plan'}
              </span>
              <span className="text-xs text-slate-500 font-medium">Vastu Compliant Architectural Plan</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-heading mt-0.5">
              {plan.type} — {plan.carpetArea || plan.area}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 flex-1 space-y-6">
          <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner flex items-center justify-center min-h-[320px]">
            <img
              src={plan.floorPlanImg || plan.floorPlan || 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'}
              alt={plan.type}
              className="max-h-[460px] w-auto object-contain hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-xs px-3 py-1.5 rounded-lg backdrop-blur-sm flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
              HD Layout View
            </div>
          </div>

          {/* Quick Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100">
              <span className="text-xs text-amber-800 font-medium">Carpet Area</span>
              <p className="text-base font-bold text-slate-900">{plan.carpetArea || plan.area || '1,250 sq.ft.'}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-500 font-medium">Super Built-up</span>
              <p className="text-base font-bold text-slate-900">{plan.superArea || '1,450 sq.ft.'}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-500 font-medium">Bedrooms / Baths</span>
              <p className="text-base font-bold text-slate-900">
                {plan.bedrooms || 3} Bed • {plan.bathrooms || 3} Bath
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100">
              <span className="text-xs text-emerald-700 font-medium">Starting Price</span>
              <p className="text-base font-bold text-emerald-800">{plan.price || '₹48.5 Lakhs*'}</p>
            </div>
          </div>

          {/* Features Checklist */}
          {plan.features && (
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">Key Highlights</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {plan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              window.open(plan.floorPlanImg || plan.floorPlan, '_blank');
            }}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-white font-semibold text-sm flex items-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            Download Floor Plan
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onClose();
                openEnquiryModal({ name: plan.type, startingPrice: plan.price });
              }}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md transition cursor-pointer"
            >
              Enquire For This Layout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
