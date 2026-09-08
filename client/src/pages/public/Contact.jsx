import React, { useState, useEffect } from 'react';
import { 
  Phone, Mail, MapPin, MessageSquare, Send, 
  Clock, ShieldCheck, CheckCircle2, Sparkles, Building2 
} from 'lucide-react';
import { api } from '../../api/client';
import { useSite } from '../../context/SiteContext';

export default function Contact() {
  const { settings, showToast, triggerCelebration } = useSite();
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    projectId: '',
    propertyType: '3 BHK',
    budget: '₹50 - 75 Lakhs',
    preferredVisitDate: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await api.getProjects();
        setProjects(data || []);
        if (data && data.length > 0) {
          setFormData(prev => ({ ...prev, projectId: data[0].id }));
        }
      } catch (err) {
        console.error('Error fetching projects for contact form', err);
      }
    }
    loadProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      showToast('कृपया अपना नाम और मोबाइल नंबर भरें', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const selectedProj = projects.find(p => p.id === formData.projectId);
      await api.submitEnquiry({
        ...formData,
        projectName: selectedProj ? selectedProj.name : 'General Contact Form'
      });
      setSubmitted(true);
      triggerCelebration();
      showToast('आपकी enquiry सफलतापूर्वक प्राप्त हुई!');
    } catch (err) {
      showToast(err.message || 'Failed to submit enquiry', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
        <div className="max-w-2xl space-y-3">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold uppercase tracking-wider">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight">
            Contact Us & Site Visit (संपर्क करें)
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            अपने सपनों के घर के बारे में जानकारी प्राप्त करें, ब्रोशर मंगवाएं या फ्री साइट विजिट शेड्यूल करें।
          </p>
        </div>
      </div>

      {/* Main Grid: Form + Contact Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 space-y-6">
            <h3 className="text-xl font-bold font-heading text-slate-900">
              Corporate Office & Helpdesk
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900">Office Address</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {settings.officeAddress || 'Vaishali Nagar, Jaipur, Sector 12, Main Ring Road, Jaipur, Rajasthan 302020'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <Phone className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900">Phone Numbers</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Primary: <a href={`tel:${settings.phonePrimary}`} className="font-bold text-slate-900">{settings.phonePrimary || '+91 98765 43210'}</a>
                  </p>
                  <p className="text-xs text-slate-600">
                    Secondary: <a href={`tel:${settings.phoneSecondary}`} className="font-bold text-slate-900">{settings.phoneSecondary || '+91 98765 43210'}</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <Mail className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900">Email Enquiries</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    <a href={`mailto:${settings.salesEmail || settings.email}`} className="font-bold text-slate-900">
                      {settings.salesEmail || 'sales@hariombuildhomes.com'}
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900">Office Working Hours</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Mon - Sun: 9:30 AM to 7:00 PM (All 7 Days Open)
                  </p>
                </div>
              </div>
            </div>

            {/* Instant Actions */}
            <div className="pt-2 flex flex-col gap-3">
              <a
                href={`https://wa.me/${settings.whatsappNumber || '919876543210'}?text=${encodeURIComponent('Hello Hariom Buildhomes, I would like to schedule a site visit.')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>

              <a
                href={`tel:${settings.phonePrimary?.replace(/[^0-9+]/g, '') || '+919876543210'}`}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Direct Call Sales Desk</span>
              </a>
            </div>
          </div>
        </div>

        {/* Lead Enquiry Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Schedule a Visit or Request Callback
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mt-1">
                Send Enquiry (पूछताछ फॉर्म)
              </h2>
            </div>

            {submitted ? (
              <div className="p-8 text-center space-y-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-xl font-bold text-emerald-950 font-heading">
                  आपकी enquiry दर्ज कर ली गई है!
                </h3>
                <p className="text-xs text-emerald-800 max-w-md mx-auto">
                  धन्यवाद {formData.name}, हमारे प्रोजेक्ट सलाहकार आपसे जल्द ही संपर्क करेंगे।
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  Send Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Your Full Name (आपका पूरा नाम) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Mobile Number (मोबाइल नंबर) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="name@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Interested Project (इच्छुक प्रोजेक्ट)
                    </label>
                    <select
                      value={formData.projectId}
                      onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                      className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      House Type (BHK)
                    </label>
                    <select
                      value={formData.propertyType}
                      onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                      className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="2 BHK">2 BHK Apartment / Villa</option>
                      <option value="3 BHK">3 BHK Luxury Suite</option>
                      <option value="4 BHK">4 BHK Grand Penthouse / Duplex</option>
                      <option value="Plots">Residential Plots</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Preferred Site Visit Date (विजिट की तारीख)
                  </label>
                  <input
                    type="date"
                    value={formData.preferredVisitDate}
                    onChange={(e) => setFormData({ ...formData, preferredVisitDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Your Requirements / Message (संदेश)
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Tell us what you are looking for..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Submitting...' : 'Submit Enquiry & Book Visit'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
