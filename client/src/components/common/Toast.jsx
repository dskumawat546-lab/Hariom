import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

export default function Toast() {
  const { toast } = useSite();
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div className={`px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border ${
        isSuccess ? 'bg-slate-900 text-white border-emerald-500/40 shadow-emerald-950/30' :
        isError ? 'bg-rose-900 text-white border-rose-500/40' :
        'bg-slate-900 text-white border-slate-700'
      }`}>
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
        {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
        {!isSuccess && !isError && <Info className="w-5 h-5 text-amber-400 shrink-0" />}
        <span className="text-sm font-semibold">{toast.message}</span>
      </div>
    </div>
  );
}
