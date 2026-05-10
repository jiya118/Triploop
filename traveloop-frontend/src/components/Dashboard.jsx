import { useEffect, useState } from 'react';
import { Plus, Calendar, Compass, TrendingUp, Wallet, Eye, Trash2, Edit3 } from 'lucide-react';
import { formatRupees } from '../utils/currency';
import api from '../api';

const cityImages = {
  Paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=400',
  Tokyo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=400',
  'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=400',
  Barcelona: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=400'
};

const Dashboard = ({ goTo, user, currentTrip, mode = 'home' }) => {
  const [trendingCities, setTrendingCities] = useState([]);

  useEffect(() => {
    let ignore = false;
    api.get('/discovery/cities', { params: { min_popularity: 90 } })
      .then((response) => {
        if (!ignore) setTrendingCities(response.data.slice(0, 4));
      })
      .catch(() => {
        if (!ignore) setTrendingCities([]);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const trips = [
    {
      ...currentTrip,
      stops: 3,
      cover: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=800'
    },
    {
      name: 'Hidden Gems of Bali',
      start_date: '2026-08-02',
      end_date: '2026-08-11',
      description: 'Temples, rice terraces, beaches, and quiet food stops.',
      total_budget: 130000,
      is_public: true,
      stops: 4,
      cover: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800'
    }
  ];

  const showTripsOnly = mode === 'trips';

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="max-w-7xl mx-auto p-8">
        <header className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-4xl font-black text-slate-900 leading-tight">
              {showTripsOnly ? 'My Trips' : `Welcome, ${user?.name || 'Traveler'}!`}
            </h2>
            <p className="text-slate-500 font-medium text-lg mt-2">
              {showTripsOnly ? 'View, edit, share, or continue planning your saved itineraries.' : 'Ready for your next multi-city adventure?'}
            </p>
          </div>
          <button onClick={() => goTo('CREATE_TRIP')} className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 flex gap-2 items-center hover:scale-105 transition">
            <Plus size={20}/> Plan New Trip
          </button>
        </header>

        <section className="mb-16">
          <div className="flex items-center gap-2 mb-8">
            <Calendar className="text-blue-600" size={24}/>
            <h3 className="text-2xl font-black text-slate-800">Recent Trips</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {trips.map((trip) => (
              <article key={trip.name} className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition">
                <div className="h-44 overflow-hidden">
                  <img src={trip.cover} alt={trip.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h4 className="text-2xl font-black text-slate-900">{trip.name}</h4>
                      <p className="text-sm font-bold text-slate-400 flex items-center gap-2 mt-1">
                        <Calendar size={14}/> {trip.start_date} to {trip.end_date}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-xl bg-blue-50 px-3 py-2 text-xs font-black text-blue-600">
                      {trip.stops} stops
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 font-medium mb-6">{trip.description}</p>
                  <p className="text-sm font-black text-slate-700 mb-5">Budget: {formatRupees(trip.total_budget)}</p>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => goTo('BUILDER')} className="px-4 py-3 bg-slate-900 text-white rounded-xl text-sm font-black flex items-center gap-2">
                      <Edit3 size={16}/> Build
                    </button>
                    <button onClick={() => goTo('VIEW')} className="px-4 py-3 bg-blue-50 text-blue-700 rounded-xl text-sm font-black flex items-center gap-2">
                      <Eye size={16}/> View
                    </button>
                    <button onClick={() => goTo('BUDGET')} className="px-4 py-3 bg-green-50 text-green-700 rounded-xl text-sm font-black flex items-center gap-2">
                      <Wallet size={16}/> Budget
                    </button>
                    <button className="ml-auto p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl" aria-label={`Delete ${trip.name}`}>
                      <Trash2 size={18}/>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {!showTripsOnly && (
          <section className="mb-16">
            <div className="flex items-center gap-2 mb-8">
              <TrendingUp className="text-orange-500" size={24}/>
              <h3 className="text-2xl font-black text-slate-800">Popular Destinations</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {trendingCities.map((city) => (
                <button key={city.name} onClick={() => goTo('CITY_SEARCH')} className="group relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-xl text-left">
                  <img src={cityImages[city.name] || cityImages.Paris} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={city.name}/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <p className="text-xs font-black uppercase tracking-widest text-blue-300 mb-1">Score: {city.popularity_score}</p>
                    <h4 className="text-2xl font-bold">{city.name}</h4>
                    <p className="text-sm opacity-80 font-medium">{city.country}</p>
                  </div>
                </button>
              ))}
              <button onClick={() => goTo('CITY_SEARCH')} className="border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center p-8 text-center hover:bg-white transition">
                <Compass size={32} className="text-slate-300 mb-2"/>
                <p className="font-bold text-slate-400">Discover More</p>
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
