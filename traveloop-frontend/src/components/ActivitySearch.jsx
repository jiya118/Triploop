import React, { useState } from 'react';
import { Search, Clock, DollarSign, Plus, MapPin, Filter, Star, Info } from 'lucide-react';

const ActivitySearch = () => {
  // Aligned with Table 5: activities (Seed data included)
  const [activities] = useState([
    { id: 'a1', name: 'Eiffel Tower Visit', category: 'sightseeing', cost: 28.00, duration: 120, img: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?q=80&w=400' },
    { id: 'a2', name: 'Seine River Cruise', category: 'sightseeing', cost: 20.00, duration: 90, img: 'https://images.unsplash.com/photo-1503917988258-f87a78e3c995?q=80&w=400' },
    { id: 'a3', name: 'Le Marais Food Tour', category: 'food_tour', cost: 45.00, duration: 180, img: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=400' }
  ]);

  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header with City Context */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest mb-2">
            <MapPin size={14} /> Paris, France
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-6">Things to Do</h1>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-4 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Find sightseeing, food, adventure..." 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none font-medium transition-all"
              />
            </div>
            <div className="flex gap-2">
              <button className="p-4 bg-slate-900 text-white rounded-2xl hover:shadow-lg transition">
                <Filter size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Category ENUM Pills - Aligned with activity_category */}
        <div className="max-w-6xl mx-auto px-6 pb-6 flex gap-3 overflow-x-auto scrollbar-hide">
          {['all', 'sightseeing', 'food_tour', 'adventure', 'culture', 'nature'].map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all whitespace-nowrap
                ${activeCategory === cat 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                  : 'bg-white border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-600'}`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-6 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity) => (
            <div key={activity.id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col">
              <div className="relative h-56">
                <img src={activity.img} alt={activity.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm">
                   <p className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">{activity.category.replace('_', ' ')}</p>
                </div>
                <button className="absolute bottom-4 right-4 w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-all hover:bg-blue-700 active:scale-90">
                  <Plus size={24} />
                </button>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-black text-slate-800 mb-2 leading-tight">{activity.name}</h3>
                
                <div className="flex gap-4 mb-6">
                  <div className="flex items-center gap-1 text-slate-400 font-bold text-xs">
                    <Clock size={14} /> {activity.duration} min
                  </div>
                  <div className="flex items-center gap-1 text-green-600 font-bold text-xs">
                    <DollarSign size={14} /> ${activity.cost}
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center">
                  <button className="text-xs font-bold text-slate-400 hover:text-blue-600 flex items-center gap-1">
                    <Info size={14} /> Quick Details
                  </button>
                  <div className="flex text-orange-400">
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" className="opacity-30" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ActivitySearch;