import React, { useState, useEffect } from 'react';
import { Settings, Save, Sparkles, Building2, Phone, Mail, MapPin, Award, CheckCircle2 } from 'lucide-react';
import { api } from '../../api/client';
import { useSite } from '../../context/SiteContext';

export default function AdminSettings() {
  const { settings, showToast, refreshSiteData } = useSite();
  const [formData, setFormData] = useState({ ...settings });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData({ ...settings });
  }, [settings]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateSettings(formData);
      showToast('Website settings and company information updated successfully!');
      refreshSiteData();
    } catch (err) {
      showToast('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white tracking-tight">
            Website Settings & CMS (वेबसाइट सेटिंग्स)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Update company profile, contact details, stats counters & About Us content without developer assistance
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Settings (अपडेट सेव करें)'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Company Identity */}
        <div className="bg-slate-800/70 rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-xl space-y-4 text-white text-xs">
          <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            Company Identity & Branding
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-bold mb-1">Company Name (English)</label>
              <input
                type="text"
                value={formData.companyName || ''}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Company Name (Hindi / नाम)</label>
              <input
                type="text"
                value={formData.companyNameHi || ''}
                onChange={(e) => setFormData({ ...formData, companyNameHi: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-bold mb-1">Tagline (Hindi)</label>
              <input
                type="text"
                value={formData.tagline || ''}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Quality & Title Verification Badge</label>
              <input
                type="text"
                value={formData.reraApproved || ''}
                onChange={(e) => setFormData({ ...formData, reraApproved: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Contact Numbers & WhatsApp */}
        <div className="bg-slate-800/70 rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-xl space-y-4 text-white text-xs">
          <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Phone className="w-5 h-5 text-amber-400" />
            Contact Channels & WhatsApp Setup
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 font-bold mb-1">Primary Phone Number</label>
              <input
                type="text"
                value={formData.phonePrimary || ''}
                onChange={(e) => setFormData({ ...formData, phonePrimary: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Secondary Phone Number</label>
              <input
                type="text"
                value={formData.phoneSecondary || ''}
                onChange={(e) => setFormData({ ...formData, phoneSecondary: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">WhatsApp Number (with Country code)</label>
              <input
                type="text"
                placeholder="919876543210"
                value={formData.whatsappNumber || ''}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-bold mb-1">General Inquiries Email</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Sales Desk Email</label>
              <input
                type="email"
                value={formData.salesEmail || ''}
                onChange={(e) => setFormData({ ...formData, salesEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">Corporate Office Address</label>
            <input
              type="text"
              value={formData.officeAddress || ''}
              onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Milestone Stats Counters */}
        <div className="bg-slate-800/70 rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-xl space-y-4 text-white text-xs">
          <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Homepage Highlight Counters
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-slate-400 font-bold mb-1">Experience Years</label>
              <input
                type="text"
                placeholder="15+"
                value={formData.experienceYears || ''}
                onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Projects Delivered</label>
              <input
                type="text"
                placeholder="15+"
                value={formData.projectsCompleted || ''}
                onChange={(e) => setFormData({ ...formData, projectsCompleted: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Happy Families</label>
              <input
                type="text"
                placeholder="100+"
                value={formData.happyFamilies || ''}
                onChange={(e) => setFormData({ ...formData, happyFamilies: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Total Sqft Built</label>
              <input
                type="text"
                placeholder="4.8M+ sq.ft."
                value={formData.totalSqftDelivered || ''}
                onChange={(e) => setFormData({ ...formData, totalSqftDelivered: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Vision & Mission & Founder */}
        <div className="bg-slate-800/70 rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-xl space-y-4 text-white text-xs">
          <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            About Us, Vision & Founder Statement
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-bold mb-1">Founder / MD Name</label>
              <input
                type="text"
                value={formData.founderName || ''}
                onChange={(e) => setFormData({ ...formData, founderName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Founder Role</label>
              <input
                type="text"
                value={formData.founderRole || ''}
                onChange={(e) => setFormData({ ...formData, founderRole: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">Founder's Message</label>
            <textarea
              rows="2"
              value={formData.founderMessage || ''}
              onChange={(e) => setFormData({ ...formData, founderMessage: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500 resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">Vision Statement (हमारा विजन)</label>
            <textarea
              rows="2"
              value={formData.aboutVision || ''}
              onChange={(e) => setFormData({ ...formData, aboutVision: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500 resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-slate-400 font-bold mb-1">Mission Statement (हमारा मिशन)</label>
            <textarea
              rows="2"
              value={formData.aboutMission || ''}
              onChange={(e) => setFormData({ ...formData, aboutMission: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:ring-2 focus:ring-amber-500 resize-none"
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition cursor-pointer"
          >
            {saving ? 'Publishing Updates...' : 'Save All Settings & Publish to Website'}
          </button>
        </div>
      </form>
    </div>
  );
}
