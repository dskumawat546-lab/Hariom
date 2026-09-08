import React from 'react';
import { MessageSquare, PhoneCall } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

export default function FloatingActions() {
  const { settings } = useSite();

  const whatsappNumber = settings.whatsappNumber || '919876543210';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello Hariom Buildhomes, I would like to enquire about your available properties and schedule a site visit.')}`;
  const phoneUrl = `tel:${settings.phonePrimary?.replace(/[^0-9+]/g, '') || '+919876543210'}`;

  return (
    <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-3">
      {/* WhatsApp Quick Chat */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/40 flex items-center justify-center transition-transform hover:scale-110 group relative"
        title="Chat on WhatsApp (व्हाट्सएप पर बात करें)"
      >
        <MessageSquare className="w-7 h-7 fill-white/20" />
        <span className="absolute left-16 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          WhatsApp Instant Chat
        </span>
      </a>

      {/* Direct Call Button */}
      <a
        href={phoneUrl}
        className="w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xl shadow-amber-500/40 flex items-center justify-center transition-transform hover:scale-110 group relative"
        title="Direct Call (सीधे कॉल करें)"
      >
        <PhoneCall className="w-7 h-7 stroke-[2.2]" />
        <span className="absolute left-16 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Call: {settings.phonePrimary || '+91 98765 43210'}
        </span>
      </a>
    </div>
  );
}
