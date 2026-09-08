import React from 'react';
import { 
  Building2, Award, Users, ShieldCheck, HardHat, 
  CheckCircle2, Target, Eye, Quote, ArrowRight, Sparkles 
} from 'lucide-react';
import { useSite } from '../../context/SiteContext';

export default function About() {
  const { settings, openEnquiryModal } = useSite();

  const leadershipTeam = [
    {
      name: 'जितेंद्र कुमावत (Jitendra Kumawat)',
      role: 'Founder & Managing Director',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
      exp: '25+ Years Experience in Civil Engineering & Real Estate'
    },
    {
      name: 'संजय मेहरा (Sanjay Mehra)',
      role: 'Chief Structural Engineer',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
      exp: 'IIT Roorkee Alumnus • Earthquake-Resistant RCC Specialist'
    },
    {
      name: 'नेहा सिंघल (Neha Singhal)',
      role: 'Head of Architecture & Design',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      exp: 'Senior Urban Planner & Vastu Consultant'
    }
  ];

  return (
    <div className="space-y-16 py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
        <div className="max-w-3xl space-y-3">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold uppercase tracking-wider">
            About Aadya Dream Homes
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight">
            Building Trust, Quality & Happiness
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            {settings.companyName || 'Hariom Buildhomes'} पिछले {settings.experienceYears || '15+'} वर्षों से सुरक्षित, आधुनिक और प्रीमियम आवासीय प्रोजेक्ट्स के निर्माण में अग्रणी नाम है।
          </p>
        </div>
      </div>

      {/* Founder Message Section */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-100 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-4">
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl bg-slate-900">
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80"
              alt="Founder"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-base font-bold">{settings.founderName || 'जितेंद्र कुमावत'}</p>
              <p className="text-xs text-amber-400">{settings.founderRole || 'Founder & MD'}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <Quote className="w-10 h-10 text-amber-500/40" />
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 leading-tight">
            "हम केवल ईंट और कंक्रीट का ढांचा नहीं बनाते, बल्कि ऐसे घरों का निर्माण करते हैं जहां पीढ़ियां खुशहाल जीवन बिता सकें।"
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {settings.founderMessage || 'हमारे लिए प्रत्येक प्रोजेक्ट केवल एक व्यावसायिक उपक्रम नहीं, बल्कि हजारों परिवारों के सपनों की धरोहर है। हम हर निर्माण में उच्चतम गुणवत्ता वाले मैटेरियल और आधुनिक इंजीनियरिंग का प्रयोग करते हैं।'}
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center gap-6 text-xs text-slate-500">
            <div>
              <span className="font-bold text-slate-900 block text-sm">{settings.experienceYears || '15+'} Years</span>
              <span>Engineering Excellence</span>
            </div>
            <div>
              <span className="font-bold text-slate-900 block text-sm">{settings.happyFamilies || '100+'} Families</span>
              <span>Delivered Homes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-heading text-slate-900">
            हमारा विजन (Our Vision)
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            {settings.aboutVision || 'भारत का सबसे भरोसेमंद, आधुनिक एवं पर्यावरण-अनुकूल रियल एस्टेट और होम कंस्ट्रक्शन ब्रांड बनना।'}
          </p>
        </div>

        <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-amber-400 flex items-center justify-center font-bold border border-slate-700 shadow-md">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-heading text-white">
            हमारा मिशन (Our Mission)
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            {settings.aboutMission || 'उच्चतम गुणवत्ता, पूर्ण पारदर्शिता और समय पर पजेशन के साथ हर परिवार को उनके सपनों का मजबूत और सुंदर आशियाना प्रदान करना।'}
          </p>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">The Builders of Tomorrow</span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900">
            Our Experienced Leadership (हमारा नेतृत्व)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {leadershipTeam.map((leader, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 space-y-4">
              <img
                src={leader.image}
                alt={leader.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-500/40 shadow-md"
              />
              <div>
                <h3 className="text-base font-bold text-slate-900">{leader.name}</h3>
                <p className="text-xs font-bold text-amber-600 mt-0.5">{leader.role}</p>
                <p className="text-xs text-slate-500 mt-2">{leader.exp}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
