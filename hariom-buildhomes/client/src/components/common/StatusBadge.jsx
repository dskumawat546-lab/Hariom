import React from 'react';

export default function StatusBadge({ status, size = 'md' }) {
  const s = String(status || '').toLowerCase();
  
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs font-semibold' 
    : size === 'lg' 
    ? 'px-3.5 py-1.5 text-sm font-bold tracking-wide' 
    : 'px-2.5 py-1 text-xs font-bold';

  if (s === 'ongoing' || s.includes('ongoing')) {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses}`}>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>🟢 Ongoing Construction</span>
      </span>
    );
  }
  
  if (s === 'ready' || s.includes('ready')) {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses}`}>
        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
        <span>🔵 Ready to Move</span>
      </span>
    );
  }

  if (s === 'upcoming' || s.includes('upcoming')) {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 ${sizeClasses}`}>
        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
        <span>🟡 Upcoming Project</span>
      </span>
    );
  }

  if (s === 'sold' || s === 'sold_out' || s.includes('sold')) {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${sizeClasses}`}>
        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
        <span>🔴 Sold Out</span>
      </span>
    );
  }

  if (s === 'available') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses}`}>
        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span>🟢 Available</span>
      </span>
    );
  }

  if (s === 'hold') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 ${sizeClasses}`}>
        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
        <span>🟡 On Hold</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center rounded-full bg-slate-100 text-slate-700 ${sizeClasses}`}>
      {status}
    </span>
  );
}
