import React from 'react';
import { Plus, MapPin, Calendar, Compass, ArrowRight, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  // Aligned with Table 2: cities
  const trendingCities = [
    { name: "Paris", country: "France", cost_index: 1.8, popularity: 98, img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=400" },
    { name: "Tokyo", country: "Japan", cost_index: 1.6, popularity: 97, img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=400" }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-xl"><MapPin className="text-white" size={20}/></div>
          <span className="text-2xl font-black text-slate-800">Traveloop</span>
        </div>
        <div className="flex gap-6 items-center">
          <button className="text-sm font-bold text-slate-600">My Itineraries</button>
          <div className="w-10 h-10 rounded-full border-2 border-blue-100 bg-slate-200 overflow-hidden shadow-inner">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Riddhi" alt="profile"/>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8">
        <header className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-4xl font-black text-slate-900 leading-tight">Welcome, Riddhi! 👋</h2>
            <p className="text-slate-500 font-medium text-lg mt-2">Ready for your next multi-city adventure?</p>
          </div>
          <button className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 flex gap-2 items-center hover:scale-105 transition">
            <Plus size={20}/> Plan New Trip
          </button>
        </header>

        {/* Section: Trending Cities (From Table 2) */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp className="text-orange-500" size={24}/>
            <h3 className="text-2xl font-black text-slate-800">Popular Destinations</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {trendingCities.map((city, idx) => (
              <div key={idx} className="group relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-xl cursor-pointer">
                <img src={city.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={city.name}/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-xs font-black uppercase tracking-widest text-blue-300 mb-1">Score: {city.popularity}</p>
                  <h4 className="text-2xl font-bold">{city.name}</h4>
                  <p className="text-sm opacity-80 font-medium">{city.country}</p>
                </div>
              </div>
            ))}
            <div className="border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-8 text-center hover:bg-white transition cursor-pointer">
              <Compass size={32} className="text-slate-300 mb-2"/>
              <p className="font-bold text-slate-400">Discover More</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;