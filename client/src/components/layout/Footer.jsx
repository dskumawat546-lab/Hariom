import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, Phone, Mail, MapPin, ShieldCheck, 
  ArrowRight, Award 
} from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { api } from '../../api/client';

export default function Footer() {
  const { settings } = useSite();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.getProjects()
      .then(data => setProjects((data || []).slice(0, 4)))
      .catch(() => setProjects([]));
  }, []);

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
                <Building2 className="w-7 h-7 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black font-heading text-white tracking-tight">
                  HARIOM<span className="text-amber-500">.</span>BUILDHOMES
                </span>
                <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                  {settings.companyName || 'Hariom Buildhomes'}
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed pr-6">
              {settings.tagline || 'सुरक्षित, आधुनिक और बेहतरीन लोकेशन पर आपके सपनों का घर।'} उच्च गुणवत्ता, समय पर पजेशन और 15+ वर्षों के भरोसे के साथ आपके परिवार के लिए बेहतरीन जीवनशैली का निर्माण।
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-amber-400">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Verified Clear Title</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-emerald-400">
                <Award className="w-4 h-4" />
                <span>{settings.experienceYears || '15+'} Years Trust</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/projects" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
                  All Projects (सभी प्रोजेक्ट्स)
                </Link>
              </li>
              <li>
                <Link to="/properties" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
                  Ready to Move Homes
                </Link>
              </li>
              <li>
                <Link to="/construction-updates" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
                  Live Construction Tracker
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
                  Photo & Video Gallery
                </Link>
              </li>
              <li>
                <Link to="/location" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
                  Location & Map
                </Link>
              </li>
            </ul>
          </div>

          {/* Dynamic Active Projects */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
              Our Landmarks
            </h4>
            <ul className="space-y-2 text-sm">
              {projects.length > 0 ? (
                projects.map(p => (
                  <li key={p.id}>
                    <Link to={`/projects/${p.id}`} className="hover:text-amber-400 transition flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${p.status === 'ready' ? 'bg-blue-500' : p.status === 'upcoming' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                      <span className="truncate">{p.name}</span>
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link to="/projects" className="text-slate-500 hover:text-amber-400">
                    Explore Projects →
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Corporate Office */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
              Corporate Office
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{settings.officeAddress || 'Vaishali Nagar, Jaipur, Rajasthan 302021'}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${settings.phonePrimary}`} className="hover:text-white font-semibold">
                  {settings.phonePrimary || '+91 98765 43210'}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${settings.salesEmail || settings.email}`} className="hover:text-white">
                  {settings.salesEmail || 'sales@hariombuildhomes.com'}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} {settings.companyName || 'Hariom Buildhomes'}. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-amber-400 transition">About Company</Link>
            <Link to="/contact" className="hover:text-amber-400 transition">Contact & Enquiries</Link>
            <Link to="/admin" className="text-amber-400 font-bold hover:underline">
              CMS Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
