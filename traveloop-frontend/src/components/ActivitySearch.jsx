import { useEffect, useMemo, useState } from 'react';
import { Search, Clock, IndianRupee, Plus, MapPin, Filter, Star, Info, ArrowLeft, Loader2 } from 'lucide-react';
import { formatRupees } from '../utils/currency';
import api from '../api';

const activityImages = {
  sightseeing: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?q=80&w=400',
  food_tour: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=400',
  adventure: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=400',
  culture: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=400',
  nature: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400',
};

const ActivitySearch = ({ goTo, addActivityToStop, addStopToTrip, stops, selectedStopId, selectedCity }) => {
  const [activities, setActivities] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [resolvedCity, setResolvedCity] = useState(null);

  const selectedStop = stops.find((stop) => stop.id === selectedStopId) || stops[0];
  const cityForActivities = resolvedCity || selectedCity || (selectedStop?.city_id ? { id: selectedStop.city_id, name: selectedStop.city_name, country: selectedStop.country } : null);

  useEffect(() => {
    let ignore = false;

    const resolveCityByName = async () => {
      if (selectedCity?.id || selectedStop?.city_id || !selectedStop?.city_name) return;

      try {
        const response = await api.get('/discovery/cities');
        const match = response.data.find((city) => city.name.toLowerCase() === selectedStop.city_name.toLowerCase());
        if (!ignore) setResolvedCity(match || null);
      } catch {
        if (!ignore) setResolvedCity(null);
      }
    };

    resolveCityByName();
    return () => {
      ignore = true;
    };
  }, [selectedCity?.id, selectedStop?.city_id, selectedStop?.city_name]);

  useEffect(() => {
    let ignore = false;

    const loadActivities = async () => {
      if (!cityForActivities?.id) {
        setActivities([]);
        setMessage('Choose a city from Explore Cities before browsing database activities.');
        return;
      }

      setLoading(true);
      setMessage('');
      try {
        const response = await api.get(`/discovery/activities/${cityForActivities.id}`, {
          params: activeCategory === 'all' ? {} : { category: activeCategory }
        });
        if (!ignore) setActivities(response.data);
      } catch (err) {
        if (!ignore) setMessage(err.response?.data?.detail || 'Could not load activities from database.');
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadActivities();
    return () => {
      ignore = true;
    };
  }, [activeCategory, cityForActivities?.id]);

  const categories = useMemo(() => ['all', ...new Set(activities.map((activity) => activity.category).filter(Boolean))], [activities]);

  const filteredActivities = activities.filter((activity) => {
    const query = searchTerm.toLowerCase();
    return activity.name.toLowerCase().includes(query) || String(activity.category || '').toLowerCase().includes(query);
  });

  const handleAddActivity = (activity) => {
    let targetStop = selectedStop;

    if (cityForActivities?.id) {
      targetStop = stops.find((stop) => stop.city_id === cityForActivities.id || stop.city_name === cityForActivities.name);
      if (!targetStop) {
        const result = addStopToTrip(cityForActivities);
        if (!result.ok) {
          setMessage(result.error);
          return;
        }
        targetStop = { id: result.stopId };
      }
    }

    addActivityToStop({
      id: activity.id,
      name: activity.name,
      category: activity.category,
      cost: Number(activity.cost) || 0,
      time: '09:00 AM'
    }, targetStop?.id);
    goTo('BUILDER');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <button onClick={() => goTo('CITY_SEARCH')} className="mb-5 inline-flex items-center gap-2 text-sm font-black text-slate-500 hover:text-blue-600">
            <ArrowLeft size={18} /> Back to Explore Cities
          </button>
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest mb-2">
            <MapPin size={14} /> {cityForActivities ? `Activities in ${cityForActivities.name}` : `Adding to ${selectedStop?.city_name || 'your trip'}`}
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-6">Things to Do</h1>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-4 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Find sightseeing, food, adventure..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none font-medium transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="p-4 bg-slate-900 text-white rounded-2xl hover:shadow-lg transition">
              <Filter size={20} />
            </button>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 pb-6 flex gap-3 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
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
        {message && <p className="mb-6 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">{message}</p>}
        {loading && (
          <div className="flex items-center gap-2 text-slate-500 font-bold">
            <Loader2 className="animate-spin" size={18} /> Loading activities from database...
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {!loading && filteredActivities.length === 0 && (
            <div className="col-span-full rounded-[2rem] border-2 border-dashed border-slate-200 bg-white p-10 text-center">
              <p className="font-black text-slate-700">No activities found in the database for this city/filter.</p>
              <button onClick={() => goTo('CITY_SEARCH')} className="mt-4 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-black text-white">
                Explore Another City
              </button>
            </div>
          )}
          {filteredActivities.map((activity) => (
            <div key={activity.id} className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col">
              <div className="relative h-56">
                <img src={activityImages[activity.category] || activityImages.sightseeing} alt={activity.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">{String(activity.category || 'activity').replace('_', ' ')}</p>
                </div>
                <button onClick={() => handleAddActivity(activity)} className="absolute bottom-4 right-4 w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-all hover:bg-blue-700 active:scale-90" aria-label={`Add ${activity.name}`}>
                  <Plus size={24} />
                </button>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-black text-slate-800 mb-2 leading-tight">{activity.name}</h3>

                <div className="flex gap-4 mb-6">
                  <div className="flex items-center gap-1 text-slate-400 font-bold text-xs">
                    <Clock size={14} /> {activity.duration_minutes} min
                  </div>
                  <div className="flex items-center gap-1 text-green-600 font-bold text-xs">
                    <IndianRupee size={14} /> {formatRupees(activity.cost)}
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center gap-3">
                  <button className="text-xs font-bold text-slate-400 hover:text-blue-600 flex items-center gap-1">
                    <Info size={14} /> Details
                  </button>
                  <button onClick={() => handleAddActivity(activity)} className="text-xs font-black text-blue-600 hover:text-blue-800">
                    Add to Trip
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
