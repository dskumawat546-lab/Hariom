import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SiteProvider } from './context/SiteContext';

// Layout & Global Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingActions from './components/layout/FloatingActions';
import AdminLayout from './components/layout/AdminLayout';
import QuickEnquiryModal from './components/common/QuickEnquiryModal';
import Toast from './components/common/Toast';

// Public Pages
import Home from './pages/public/Home';
import Projects from './pages/public/Projects';
import ProjectDetail from './pages/public/ProjectDetail';
import Properties from './pages/public/Properties';
import ConstructionUpdates from './pages/public/ConstructionUpdates';
import Gallery from './pages/public/Gallery';
import Location from './pages/public/Location';
import About from './pages/public/About';
import Contact from './pages/public/Contact';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminProperties from './pages/admin/AdminProperties';
import AdminProgress from './pages/admin/AdminProgress';
import AdminLeads from './pages/admin/AdminLeads';
import AdminGallery from './pages/admin/AdminGallery';
import AdminSettings from './pages/admin/AdminSettings';
import AdminUsers from './pages/admin/AdminUsers';

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}

function ProtectedAdminRoute() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <AdminLayout />;
}

export default function App() {
  return (
    <AuthProvider>
      <SiteProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Website Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/construction-updates" element={<ConstructionUpdates />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/location" element={<Location />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Admin Authentication */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Admin CMS & CRM Routes */}
            <Route path="/admin" element={<ProtectedAdminRoute />}>
              <Route index element={<AdminDashboard />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="properties" element={<AdminProperties />} />
              <Route path="progress" element={<AdminProgress />} />
              <Route path="leads" element={<AdminLeads />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Global Modals & Notifications */}
          <QuickEnquiryModal />
          <Toast />
        </BrowserRouter>
      </SiteProvider>
    </AuthProvider>
  );
}
