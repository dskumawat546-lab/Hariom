import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, MapPin, CheckCircle2, ArrowRight, ShieldCheck, 
  Sparkles, Award, Users, HardHat, PhoneCall, ChevronRight,
  Clock, IndianRupee, Layers, BedDouble, Trees, Eye, MessageSquare
} from 'lucide-react';
import { api } from '../../api/client';
import { useSite } from '../../context/SiteContext';
import StatusBadge from '../../components/common/StatusBadge';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // all, ongoing, ready, upcoming
  const [currentSlide, setCurrentSlide] = useState(0);
  const { settings, stats, openEnquiryModal } = useSite();

  useEffect(() => {
    async function loadData() {
      try {
        const [projRes, propRes] = await Promise.all([
          api.getProjects(),
          api.getProperties()
        ]);
        setProjects(projRes || []);
        setProperties(propRes || []);
      } catch (err) {
        console.error('Error fetching homepage data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // 100% Dynamic Hero Slides generated ONLY from existing projects in the database
  const heroSlides = projects.length > 0
    ? projects.slice(0, 5).map((p) => ({
        title: p.nameHi ? `${p.name} — ${p.nameHi}` : (p.name + (p.tagline ? ` — ${p.tagline}` : '')),
        subtitle: p.description || 'Experience eco-luxury gated communities and modern living built with uncompromised engineering excellence.',
        image: p.heroImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
        projectTag: `${p.statusLabel || 'Featured Landmark'}: ${p.name}`,
        link: `/projects/${p.id}`,
        startingPrice: p.startingPrice
      }))
    : [
        {
          title: "Hariom Buildhomes — सुरक्षित, आधुनिक और बेहतरीन लोकेशन पर आपके सपनों का घर",
          subtitle: "Experience luxury living spaces built with 15+ years of trust and engineering excellence.",
          image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
          projectTag: "Hariom Buildhomes Jaipur",
          link: "/projects"
        }
      ];

  useEffect(() => {
    if (heroSlides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const filteredProjects = projects.filter(p => {
    if (activeTab === 'all') return true;
    return p.status === activeTab;
  });

  const featuredProperties = properties.filter(p => p.status === 'available').slice(0, 4);

  return (
    <div className="space-y-20 pb-20">
      {/* Dynamic Hero Section */}
      <section className="relative min-h-[580px] md:min-h-[660px] flex items-center bg-slate-950 overflow-hidden">
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === (currentSlide % heroSlides.length) ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center scale-105 animate-pulse-slow"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-950/40"></div>
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl text-white space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{heroSlides[currentSlide % heroSlides.length]?.projectTag}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-heading leading-tight tracking-tight text-white drop-shadow-md">
              {heroSlides[currentSlide % heroSlides.length]?.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed drop-shadow line-clamp-3">
              {heroSlides[currentSlide % heroSlides.length]?.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => openEnquiryModal()}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/30 transition-transform hover:scale-105 flex items-center gap-2.5 cursor-pointer"
              >
                <Sparkles className="w-5 h-5" />
                <span>Book Free Site Visit (विजिट बुक करें)</span>
              </button>

              <Link
                to={heroSlides[currentSlide % heroSlides.length]?.link || '/projects'}
                className="px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base backdrop-blur-md border border-white/20 transition flex items-center gap-2"
              >
                <span>View Project Details</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Micro Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Clear Title</span>
              </div>
              <div className="flex items-center gap-2">
                <HardHat className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Live Site Updates</span>
              </div>
              <div className="flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Bank Loan Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Indicators */}
        {heroSlides.length > 1 && (
          <div className="absolute bottom-6 right-6 z-20 flex gap-2">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === (currentSlide % heroSlides.length) ? 'w-8 bg-amber-500' : 'w-2 bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Stats Counter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                {settings.experienceYears || '15+'}
              </p>
              <p className="text-xs text-slate-700 font-medium">Years of Trust (वर्षों का भरोसा)</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                {projects.length || settings.projectsCompleted || '15+'}
              </p>
              <p className="text-xs text-slate-700 font-medium">Projects Delivered (प्रोजेक्ट्स)</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                {settings.happyFamilies || '100+'}
              </p>
              <p className="text-xs text-slate-700 font-medium">Happy Families (संतुष्ट परिवार)</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Layers className="w-7 h-7" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                {settings.totalSqftDelivered || '4.8M+'}
              </p>
              <p className="text-xs text-slate-700 font-medium">Sq.ft. Area Built (निर्मित क्षेत्र)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60 mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>Signature Developments</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
              Our Construction Projects (हमारे प्रोजेक्ट्स)
            </h2>
            <p className="text-sm text-slate-700 mt-1">
              Ongoing, Ready to Move और Upcoming प्रोजेक्ट्स देखें
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
            {[
              { key: 'all', label: 'All Projects' },
              { key: 'ongoing', label: '🟢 Ongoing' },
              { key: 'ready', label: '🔵 Ready to Move' },
              { key: 'upcoming', label: '🟡 Upcoming' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === tab.key
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-100 text-slate-500">
            No projects currently listed in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col group"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  <img
                    src={project.heroImage}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <StatusBadge status={project.status} />
                  </div>
                  <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-xl">
                    Starts {project.startingPrice}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-heading group-hover:text-amber-800 transition">
                      {project.name}
                    </h3>
                    <p className="text-xs text-slate-700 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      {project.location}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center text-xs">
                    <div className="bg-slate-50 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-600 block">Total Homes</span>
                      <span className="font-bold text-slate-900">{project.totalHomes} Units</span>
                    </div>
                    <div className="bg-emerald-50/60 p-2 rounded-xl">
                      <span className="text-[10px] text-emerald-800 block">Available</span>
                      <span className="font-bold text-emerald-800">{project.availableHomes} Left</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl">
                      <span className="text-[10px] text-slate-600 block">Possession</span>
                      <span className="font-bold text-slate-900">{project.possessionDate?.split(' ')[0] || '2027'}</span>
                    </div>
                  </div>

                  {project.constructionProgress && (
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-700 flex items-center gap-1">
                          <HardHat className="w-3.5 h-3.5 text-amber-500" />
                          Construction Progress
                        </span>
                        <span className="text-amber-600 font-bold">
                          {project.constructionProgress.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${project.constructionProgress.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex items-center gap-2">
                    <Link
                      to={`/projects/${project.id}`}
                      className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs text-center transition flex items-center justify-center gap-1"
                    >
                      <span>View Project Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => openEnquiryModal(project)}
                      className="px-3.5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition cursor-pointer"
                      title="Quick Enquiry"
                    >
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Ready to Move Featured Section */}
      {featuredProperties.length > 0 && (
        <section className="bg-slate-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60 mb-2">
                  🔵 Ready for Immediate Handover
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading">
                  Ready to Move Homes (तुरंत रहने योग्य घर)
                </h2>
                <p className="text-sm text-slate-700 mt-1">
                  गृह प्रवेश के लिए तैयार घर — रजिस्ट्री और चाबी तुरंत प्राप्त करें
                </p>
              </div>

              <Link
                to="/properties"
                className="inline-flex items-center gap-2 text-sm font-bold text-amber-800 hover:text-amber-900 hover:underline"
              >
                <span>View All Available Units ({properties.filter(p => p.status === 'available').length} Homes)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProperties.map((prop) => (
                <div
                  key={prop.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition border border-slate-200 flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] bg-slate-900">
                    <img src={prop.image} alt={prop.houseNo} className="w-full h-full object-cover" />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[11px] font-bold">
                        {prop.statusLabel}
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 left-2.5 bg-slate-950/80 text-white text-xs font-bold px-2.5 py-1 rounded-lg backdrop-blur-sm">
                      {prop.bhk}
                    </div>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-base font-bold text-slate-900">{prop.houseNo}</h4>
                        <span className="text-xs font-bold text-emerald-800">{prop.price}</span>
                      </div>
                      <p className="text-xs text-slate-700 truncate">{prop.projectName}</p>
                      <p className="text-xs text-slate-700 mt-1">{prop.area} • {prop.floor}</p>
                    </div>

                    <button
                      onClick={() => openEnquiryModal({ name: `${prop.houseNo} - ${prop.projectName}`, startingPrice: prop.price })}
                      className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition cursor-pointer"
                    >
                      Book Unit (बुक करें)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us & Quality Promise */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-3xl p-8 md:p-14 text-white shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="max-w-2xl space-y-4 mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Why Homebuyers Trust Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-heading text-white">
              हमारा निर्माण — सुरक्षा, गुणवत्ता और समयबद्धता का प्रतीक
            </h2>
            <p className="text-sm text-slate-300">
              हर घर में हम ग्रेड-A स्टील, अल्ट्रा-टेक सीमेंट और आधुनिक भूकंपरोधी इंजीनियरिंग का उपयोग करते हैं।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">100% Legal Clear Title</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                सभी प्रोजेक्ट्स को क्लियर लैंड टाइटल, फ्रीहोल्ड पट्टा और प्रमाणित निर्माण गुणवत्ता प्राप्त है।
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Guaranteed On-Time Possession</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                हम समय के पाबंद हैं। तय की गई तारीख पर ही चाबी सौंपने का हमारा 15+ वर्षों का 100% ट्रैक रिकॉर्ड है।
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <HardHat className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Live Online Construction Logs</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                आप घर बैठे हर महीने निर्माण कार्य के फोटो और वीडियो ऑनलाइन देख सकते हैं। पूरी पारदर्शिता की गारंटी।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8 text-slate-950">
          <div className="space-y-2 text-center lg:text-left">
            <h3 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
              क्या आप अपने परिवार के लिए सही घर तलाश रहे हैं?
            </h3>
            <p className="text-sm font-semibold text-slate-900">
              आज ही हमारे रियल एस्टेट सलाहकार से बात करें और विशेष डिस्काउंट का लाभ उठाएं।
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={`tel:${settings.phonePrimary?.replace(/[^0-9+]/g, '') || '+919876543210'}`}
              className="px-6 py-3.5 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-sm shadow-xl flex items-center gap-2 transition"
            >
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>Call Us: {settings.phonePrimary || '+91 98765 43210'}</span>
            </a>

            <button
              onClick={() => openEnquiryModal()}
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-950 font-bold text-sm shadow-md transition cursor-pointer"
            >
              Schedule Free Site Visit
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
