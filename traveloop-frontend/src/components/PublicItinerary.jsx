import React from 'react';
import { Copy, Share2, Globe, MapPin, Calendar, Heart, ArrowRight, User, ExternalLink } from 'lucide-react';

const PublicItinerary = () => {
  // Data derived from Table 3 (trips) and Table 4 (trip_stops)
  const sharedTrip = {
    name: "Hidden Gems of Bali",
    creator: "Riddhi Thakkar",
    description: "A 10-day journey through lush rice terraces, sacred temples, and pristine beaches.",
    stops: 4,
    days: 10,
    is_public: true,
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1200"
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <img 
          src={sharedTrip.image} 
          alt={sharedTrip.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        {/* Floating Badge */}
        <div className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white text-xs font-black uppercase tracking-widest">
          <Globe size={14} className="text-blue-400" /> Public Itinerary
        </div>

        <div className="absolute bottom-12 left-8 right-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 text-blue-400 font-bold mb-3">
            <MapPin size={18} /> <span>{sharedTrip.stops} Destinations</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
            {sharedTrip.name}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-lg">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Riddhi" alt="Creator" />
            </div>
            <div className="text-white">
              <p className="text-xs font-black opacity-60 uppercase">Planned By</p>
              <p className="font-bold text-lg">{sharedTrip.creator}</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Stats & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16 p-8 bg-slate-50 rounded-[3rem] border border-slate-100">
          <div className="flex gap-10">
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Duration</p>
              <p className="text-2xl font-black text-slate-900">{sharedTrip.days} Days</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Budget</p>
              <p className="text-2xl font-black text-slate-900">$$$</p>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-8 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 flex items-center justify-center gap-2 hover:scale-105 transition active:scale-95">
              <Copy size={20} /> Copy Trip
            </button>
            <button className="p-4 bg-white text-slate-900 border border-slate-200 rounded-2xl hover:bg-slate-50 transition">
              <Share2 size={20} />
            </button>
          </div>
        </div>

        {/* Itinerary Summary (Read-Only) */}
        <div className="space-y-12">
          <div className="prose prose-slate max-w-none">
            <h3 className="text-2xl font-black text-slate-900 mb-4">About this Trip</h3>
            <p className="text-slate-600 text-lg leading-relaxed font-medium">
              {sharedTrip.description}
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-900">Journey Highlights</h3>
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="group flex gap-6 items-start p-6 rounded-3xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <Calendar size={28} />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-slate-800 mb-1">Day {i * 2 + 1}: Cultural Immersion</h4>
                  <p className="text-slate-500 font-medium line-clamp-2 italic">
                    Exploring the local markets and hidden temples in the heart of the city...
                  </p>
                </div>
                <button className="p-2 text-slate-300 group-hover:text-blue-600 transition">
                  <ExternalLink size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-20 pt-12 border-t border-slate-100 flex justify-between items-center text-slate-400">
          <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest">
            <Heart size={16} className="text-red-500 fill-red-500" /> 1,240 People loved this
          </div>
          <button className="font-black text-xs uppercase tracking-widest hover:text-blue-600 transition">
            Report Itinerary
          </button>
        </div>
      </main>
    </div>
  );
};

export default PublicItinerary;