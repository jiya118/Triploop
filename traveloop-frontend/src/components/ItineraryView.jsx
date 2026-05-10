import { useState } from 'react';
import { Calendar, MapPin, Clock, IndianRupee, Share2, Download, ChevronLeft, LayoutGrid, List } from 'lucide-react';
import { formatRupees } from '../utils/currency';

const ItineraryView = ({ goTo, currentTrip }) => {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar' mapping to Screen 6 requirements

  // Aligned with Table 3, 4, and 6
  const itineraryData = {
    tripName: currentTrip?.name || "Europe Summer Soul",
    totalBudget: currentTrip?.total_budget || 240000,
    stops: [
      {
        city: "Paris",
        dates: "Jun 20 - Jun 23",
        activities: [
          { name: "Eiffel Tower", time: "10:00 AM", cost: 2400, type: "Sightseeing" },
          { name: "Seine River Cruise", time: "08:00 PM", cost: 1700, type: "Sightseeing" }
        ]
      },
      {
        city: "Tokyo",
        dates: "Jun 25 - Jun 28",
        activities: [
          { name: "Tsukiji Food Tour", time: "06:00 AM", cost: 3000, type: "Food" },
          { name: "Shibuya Crossing", time: "04:00 PM", cost: 0, type: "Culture" }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Action Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-100 z-50 px-6 py-4 flex justify-between items-center">
        <button onClick={() => goTo('TRIPS')} className="p-2 hover:bg-slate-100 rounded-full transition" aria-label="Back to trips">
          <ChevronLeft size={24} />
        </button>
        <div className="flex gap-2 bg-slate-100 p-1 rounded-2xl">
          <button 
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-xl transition ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
          >
            <List size={20} />
          </button>
          <button 
            onClick={() => setViewMode('calendar')}
            className={`p-2 rounded-xl transition ${viewMode === 'calendar' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
          >
            <LayoutGrid size={20} />
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={() => goTo('PUBLIC')} className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition" aria-label="Open public share"><Share2 size={20}/></button>
          <button onClick={() => goTo('BUILDER')} className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition" aria-label="Edit itinerary"><Download size={20}/></button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto p-8">
        {/* Trip Summary Card */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-5xl font-black tracking-tighter mb-4">{itineraryData.tripName}</h1>
          <div className="flex flex-wrap gap-6 justify-center md:justify-start items-center">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-2xl font-bold text-sm">
              <Calendar size={16} /> Jun 20 - Jul 05
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-2xl font-bold text-sm">
              <IndianRupee size={16} /> Est. {formatRupees(itineraryData.totalBudget)}
            </div>
          </div>
        </div>

        {/* Timeline View */}
        <div className={viewMode === 'calendar' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-12'}>
          {itineraryData.stops.map((stop, idx) => (
            <section key={idx} className="relative">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-slate-900 text-white w-10 h-10 rounded-2xl flex items-center justify-center font-black">
                  {idx + 1}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight leading-none">{stop.city}</h2>
                  <p className="text-sm font-bold text-slate-400">{stop.dates}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-2 md:ml-14">
                {stop.activities.map((act, aIdx) => (
                  <div key={aIdx} className="p-6 rounded-[2rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all duration-500 group">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-50 px-2 py-1 rounded-lg">
                        {act.type}
                      </span>
                      <span className="text-sm font-black text-slate-900">{formatRupees(act.cost)}</span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">{act.name}</h4>
                    <div className="flex items-center gap-3 text-slate-400 font-bold text-xs">
                      <div className="flex items-center gap-1">
                        <Clock size={14} /> {act.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={14} /> Local Spot
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ItineraryView;
