import React, { useState } from 'react';
import { X, Send, CheckCircle2, Sparkles } from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { api } from '../../api/client';

export default function QuickEnquiryModal() {
  const { quickEnquiryOpen, closeEnquiryModal, enquiryProject, showToast, triggerCelebration } = useSite();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    propertyType: '3 BHK',
    budget: '₹50 - 75 Lakhs',
    preferredVisitDate: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!quickEnquiryOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      showToast('कृपया अपना नाम और मोबाइल नंबर दर्ज करें (Please enter name & phone)', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await api.submitEnquiry({
        ...formData,
        projectId: enquiryProject?.id || '',
        projectName: enquiryProject?.name || 'General Website Enquiry'
      });
      setSubmitted(true);
      triggerCelebration();
      showToast('आपकी enquiry सफलतापूर्वक दर्ज हो गई है! हम जल्द ही संपर्क करेंगे।');
    } catch (err) {
      showToast(err.message || 'Failed to submit enquiry', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      phone: '',
      email: '',
      propertyType: '3 BHK',
      budget: '₹50 - 75 Lakhs',
      preferredVisitDate: '',
      message: ''
    });
    closeEnquiryModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 relative">
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative">
          <button
            onClick={handleResetAndClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Free Site Visit & Price Quote</span>
          </div>
          <h3 className="text-xl font-bold font-heading text-white">
            {enquiryProject ? `Enquire for ${enquiryProject.name}` : 'Book a Site Visit / Get Quote'}
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            {enquiryProject?.startingPrice ? `Starting from ${enquiryProject.startingPrice}` : 'सर्वश्रेष्ठ ऑफर और साइट विजिट का समय बुक करें'}
          </p>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 font-heading">
              धन्यवाद! Thank You, {formData.name}
            </h4>
            <p className="text-sm text-slate-600">
              हमारी सेल्स टीम आपके दिए गए नंबर <b>{formData.phone}</b> पर 15 मिनट के भीतर कॉल करके पूरी जानकारी व साइट विजिट का विवरण साझा करेगी।
            </p>
            <div className="pt-4">
              <button
                onClick={handleResetAndClose}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition cursor-pointer"
              >
                Close (बंद करें)
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Your Full Name (आपका नाम) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Mobile Number (फ़ोन) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 99831 88677"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Preferred BHK
                </label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="2 BHK">2 BHK Luxury</option>
                  <option value="3 BHK">3 BHK Premium</option>
                  <option value="4 BHK">4 BHK Penthouse / Villa</option>
                  <option value="Plots">Residential Plot</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Preferred Visit Date
                </label>
                <input
                  type="date"
                  value={formData.preferredVisitDate}
                  onChange={(e) => setFormData({ ...formData, preferredVisitDate: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Your Message / Requirement (वैकल्पिक संदेश)
              </label>
              <textarea
                rows="2"
                placeholder="I would like to visit the site this weekend..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <span>Submitting...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Request Instant Callback & Site Visit</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-slate-400">
              🔒 आपकी जानकारी 100% सुरक्षित है। कोई स्पैम नहीं।
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
