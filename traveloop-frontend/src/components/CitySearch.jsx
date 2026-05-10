import { useEffect, useMemo, useState } from 'react';
import { Search, Filter, Plus, Globe, Star, Loader2 } from 'lucide-react';
import api from '../api';

const cityImages = {
  Paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600',
  Tokyo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=600',
  Bali: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600',
  'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=600',
  Barcelona: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=600',
  Bangkok: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?q=80&w=600',
  Dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=600',
  Prague: 'https://images.unsplash.com/photo-1541849546-216549ae216d?q=80&w=600',
  'Cape Town': 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=600',
  'Mexico City': 'https://images.unsplash.com/photo-1585464231875-d9ef1f5ad396?q=80&w=600'
};

const CitySearch = ({ goTo, setSelectedCity, addStopToTrip }) => {
  const [cities, setCities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeRegion, setActiveRegion] = useState('All');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let ignore = false;

    const loadCities = async () => {
      setLoading(true);
      setMessage('');
      try {
        const response = await api.get('/discovery/cities', {
          params: activeRegion === 'All' ? {} : { region: activeRegion }
        });
        if (!ignore) setCities(response.data);
      } catch (err) {
        if (!ignore) setMessage(err.response?.data?.detail || 'Could not load cities from database.');
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadCities();
    return () => {
      ignore = true;
    };
  }, [activeRegion]);

  const regions = useMemo(() => ['All', 'Europe', 'Asia', 'North America', 'Africa', 'Middle East'], []);

  const filteredCities = cities.filter((city) => {
    const query = searchTerm.toLowerCase();
    return [city.name, city.country, city.region].some((value) => String(value || '').toLowerCase().includes(query));
  });

  const getCostLabel = (index) => {
    if (index > 1.8) return 'Premium';
    if (index > 1.0) return 'Moderate';
    return 'Budget';
  };

  const openActivities = (city) => {
    setSelectedCity(city);
    goTo('ACT_SEARCH');
  };

  const addCity = (city) => {
    const result = addStopToTrip(city);
    if (!result.ok) {
      setMessage(result.error);
      return;
    }
    goTo('BUILDER');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white border-b border-slate-100 z-50 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Explore Destinations</h1>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search by city, country or region..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:bg-white outline-none transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black transition">
              <Filter size={18} /> Filters
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-6">
        <div className="flex gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => setActiveRegion(reg)}
              className={`px-5 py-2 whitespace-nowrap rounded-full border text-sm font-bold transition ${activeRegion === reg ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 text-slate-500 hover:border-blue-500 hover:text-blue-600'}`}
            >
              {reg}
            </button>
          ))}
        </div>

        {message && <p className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{message}</p>}
        {loading && (
          <div className="flex items-center gap-2 text-slate-500 font-bold">
            <Loader2 className="animate-spin" size={18} /> Loading cities from database...
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCities.map((city) => (
            <div key={city.id} className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500">
              <div className="relative h-64">
                <img src={cityImages[city.name] || cityImages.Paris} alt={city.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <button onClick={() => addCity(city)} className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur rounded-2xl flex items-center justify-center text-blue-600 shadow-lg hover:bg-blue-600 hover:text-white transition-all transform active:scale-90" aria-label={`Add ${city.name} to trip`}>
                  <Plus size={24} />
                </button>
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe size={14} className="text-blue-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80">{city.region}</span>
                  </div>
                  <h3 className="text-3xl font-black">{city.name}</h3>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-1 text-orange-500 font-bold">
                    <Star size={16} fill="currentColor" />
                    <span>{(city.popularity_score || 0) / 10}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Cost Index</span>
                    <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-black">
                      {getCostLabel(Number(city.cost_index))}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-500 font-medium mb-6 line-clamp-2 italic">
                  Explore database activities and stops for {city.name}, {city.country}.
                </p>

                <button onClick={() => openActivities(city)} className="w-full py-4 border-2 border-blue-600 text-blue-600 font-black rounded-2xl hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1">
                  View Activities
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CitySearch;
