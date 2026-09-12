import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  Building2, LayoutDashboard, FolderKanban, Home, HardHat, 
  Image, Users, Settings, LogOut, ExternalLink, Menu, X, 
  MessageSquare 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSite } from '../../context/SiteContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { stats, showToast } = useSite();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully');
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Projects (प्रोजेक्ट्स)', path: '/admin/projects', icon: FolderKanban },
    { name: 'House Inventory (मकान)', path: '/admin/properties', icon: Home },
    { name: 'Construction Updates', path: '/admin/progress', icon: HardHat },
    { name: 'Leads & Enquiries (CRM)', path: '/admin/leads', icon: MessageSquare, badge: stats?.newEnquiries || 0 },
    { name: 'Photos & Videos', path: '/admin/gallery', icon: Image },
    { name: 'Website Settings', path: '/admin/settings', icon: Settings },
    { name: 'Team & Users', path: '/admin/users', icon: Users },
  ];

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-950 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-white font-heading">Kumawat CMS</span>
            <span className="text-[10px] block text-amber-400 uppercase font-semibold">Admin Portal</span>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl bg-slate-800 text-white cursor-pointer"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-slate-950 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          <div className="flex items-center gap-3 pb-6 border-b border-slate-800/80">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
              <Building2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-black font-heading text-white tracking-tight">
                HARIOM<span className="text-amber-500">.</span>ADMIN
              </h2>
              <span className="text-[11px] text-slate-400 font-medium block">
                Construction CMS & CRM
              </span>
            </div>
          </div>

          <div className="my-5 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80'}
              alt={user?.name}
              className="w-10 h-10 rounded-xl object-cover border border-amber-500/40"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.name || 'Super Admin'}</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
                {user?.role || 'Super Admin'}
              </span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const active = isActive(item);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition ${
                    active
                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${active ? 'text-slate-950' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      active ? 'bg-slate-950 text-white' : 'bg-amber-500 text-slate-950'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-slate-800 space-y-3">
          <Link
            to="/"
            target="_blank"
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700/60 transition"
          >
            <ExternalLink className="w-4 h-4 text-amber-400" />
            <span>View Live Website</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold text-xs flex items-center justify-center gap-2 border border-rose-500/20 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out (लॉग आउट)</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-slate-900 min-h-screen overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
