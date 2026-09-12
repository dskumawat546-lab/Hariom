import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Building2, Phone, MessageSquare, Menu, X, ShieldCheck, 
  MapPin, Sparkles, UserCheck, ChevronRight 
} from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { settings, openEnquiryModal } = useSite();
  const { isAuthenticated } = useAuth();

  const navLinks = [
    { name: 'Home', nameHi: 'होम', path: '/' },
    { name: 'Projects', nameHi: 'प्रोजेक्ट्स', path: '/projects' },
    { name: 'Ready to Move', nameHi: 'रेडी टू मूव', path: '/properties' },
    { name: 'Construction Updates', nameHi: 'निर्माण प्रगति', path: '/construction-updates' },
    { name: 'Gallery', nameHi: 'गैलरी', path: '/gallery' },
    { name: 'Location', nameHi: 'लोकेशन', path: '/location' },
    { name: 'About Us', nameHi: 'हमारे बारे में', path: '/about' },
    { name: 'Contact', nameHi: 'संपर्क', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="bg-slate-950 text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              {settings.reraApproved || '100% Verified Legal Clear Title'}
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-slate-400">
              <MapPin className="w-3 h-3 text-amber-500" />
              Jaipur, Rajasthan
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <a 
              href={`tel:${settings.phonePrimary?.replace(/[^0-9+]/g, '') || '+919876543210'}`}
              className="flex items-center gap-1 hover:text-amber-400 transition"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span className="hidden md:inline">Call Sales:</span>
              <span className="font-bold text-white">{settings.phonePrimary || '+91 98765 43210'}</span>
            </a>

            <Link
              to="/admin"
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 bg-slate-900 px-2.5 py-0.5 rounded border border-amber-500/30 transition"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}</span>
            </Link>
          </div>
        </div>
      </div>

      <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/10 group-hover:scale-105 transition-transform duration-200">
                <Building2 className="w-7 h-7 text-amber-400 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black font-heading text-slate-900 tracking-tight leading-none group-hover:text-amber-600 transition">
                  HARIOM<span className="text-amber-500">.</span>BUILDHOMES
                </span>
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-700 font-semibold mt-0.5">
                  Dream Homes & Builders
                </span>
              </div>
            </Link>

            <div className="hidden xl:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                    isActive(link.path)
                      ? 'bg-amber-50 text-amber-700 shadow-sm border border-amber-200/60'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/80'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="hidden sm:flex items-center gap-3">
              <a
                href={`https://wa.me/${settings.whatsappNumber || '919876543210'}?text=${encodeURIComponent('Hello Kumawat Homes, I am interested in your residential projects.')}`}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 flex items-center justify-center transition"
                title="Chat on WhatsApp"
              >
                <MessageSquare className="w-5 h-5" />
              </a>

              <button
                onClick={() => openEnquiryModal()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 transition flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Book Site Visit</span>
              </button>
            </div>

            <div className="flex xl:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 animate-fade-in shadow-xl">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition ${
                  isActive(link.path)
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                <span>{link.name} ({link.nameHi})</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            ))}

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openEnquiryModal();
                }}
                className="w-full py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-center text-sm shadow-md cursor-pointer"
              >
                Schedule Site Visit (साइट विजिट बुक करें)
              </button>

              <div className="flex gap-2">
                <a
                  href={`tel:${settings.phonePrimary?.replace(/[^0-9+]/g, '') || '+919876543210'}`}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-4 h-4 text-amber-600" />
                  Call Us
                </a>
                <a
                  href={`https://wa.me/${settings.whatsappNumber || '919876543210'}?text=${encodeURIComponent('Hello Kumawat Homes, I need project details.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
