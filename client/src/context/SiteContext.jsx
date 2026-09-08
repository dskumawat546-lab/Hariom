import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';
import confetti from 'canvas-confetti';

const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  const [settings, setSettings] = useState({
    companyName: 'Hariom Buildhomes',
    companyNameHi: 'हरिओम बिल्डहोम्स',
    tagline: 'सुरक्षित, आधुनिक और बेहतरीन लोकेशन पर आपके सपनों का घर',
    taglineEn: 'Building Trust, Crafting Luxury & Creating Dream Living Spaces',
    phonePrimary: '+91 98765 43210',
    phoneSecondary: '+91 98765 43210',
    whatsappNumber: '919876543210',
    email: 'info@hariombuildhomes.com',
    salesEmail: 'sales@hariombuildhomes.com',
    officeAddress: 'Vaishali Nagar, Jaipur, Sector 12, Main Ring Road, Jaipur, Rajasthan 302020',
    experienceYears: '15+',
    projectsCompleted: '15+',
    happyFamilies: '100+',
    totalSqftDelivered: '4.8M+ sq.ft.',
    reraApproved: '100% Legal Clear Title & Verified Approvals',
    aboutMission: 'उच्चतम गुणवत्ता, पूर्ण पारदर्शिता और समय पर पजेशन के साथ हर परिवार को उनके सपनों का मजबूत और सुरक्षित आशियाना प्रदान करना।',
    aboutVision: 'भारत का सबसे भरोसेमंद, आधुनिक एवं पर्यावरण-अनुकूल रियल एस्टेट और होम कंस्ट्रक्शन ब्रांड बनना।'
  });

  const [stats, setStats] = useState(null);
  const [language, setLanguage] = useState('hi'); // 'hi' or 'en'
  const [toast, setToast] = useState(null);
  const [quickEnquiryOpen, setQuickEnquiryOpen] = useState(false);
  const [enquiryProject, setEnquiryProject] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const refreshSiteData = async () => {
    try {
      const [settData, statsData] = await Promise.all([
        api.getSettings().catch(() => null),
        api.getStats().catch(() => null)
      ]);
      if (settData) setSettings(settData);
      if (statsData) setStats(statsData);
    } catch (err) {
      console.error('Failed to load initial site data', err);
    }
  };

  useEffect(() => {
    refreshSiteData();
  }, []);

  const openEnquiryModal = (project = null) => {
    setEnquiryProject(project);
    setQuickEnquiryOpen(true);
  };

  const closeEnquiryModal = () => {
    setQuickEnquiryOpen(false);
    setEnquiryProject(null);
  };

  const formatPrice = (amount) => {
    if (!amount) return 'Price on Request';
    if (typeof amount === 'string' && (amount.includes('₹') || amount.includes('Lakh') || amount.includes('Cr'))) {
      return amount;
    }
    const val = Number(amount);
    if (isNaN(val)) return amount;
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakhs`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <SiteContext.Provider value={{
      settings,
      stats,
      language,
      setLanguage,
      toast,
      showToast,
      triggerCelebration,
      refreshSiteData,
      quickEnquiryOpen,
      enquiryProject,
      openEnquiryModal,
      closeEnquiryModal,
      formatPrice
    }}>
      {children}
    </SiteContext.Provider>
  );
}

export const useSite = () => useContext(SiteContext);
