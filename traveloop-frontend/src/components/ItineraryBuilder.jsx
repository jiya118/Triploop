import { useState } from 'react';
import { Plus, MapPin, Calendar, Clock, Trash2, ChevronRight, Search, Activity } from 'lucide-react';
import { formatRupees } from '../utils/currency';

const ItineraryBuilder = ({ goTo, currentTrip, stops, setStops, setSelectedStopId, setSelectedCity }) => {
  const [isAddingStop, setIsAddingStop] = useState(false);
  const [newStop, setNewStop] = useState({ city_name: '', arrival: '', departure: '' });
  const [error, setError] = useState('');

  const cardStyle = "bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 mb-6 transition-all hover:shadow-md";

  const removeStop = (id) => {
    setStops(stops.filter((stop) => stop.id !== id));
  };

  const addStop = () => {
    setError('');
    if (!newStop.city_name.trim()) {
      setError('City name is required.');
      return;
    }
    if (!newStop.arrival || !newStop.departure) {
      setError('Arrival and departure dates are required.');
      return;
    }
    if (newStop.departure < newStop.arrival) {
      setError('Departure must be after arrival.');
      return;
    }
    if (newStop.arrival < currentTrip.start_date || newStop.departure > currentTrip.end_date) {
      setError(`Stop dates must be between ${currentTrip.start_date} and ${currentTrip.end_date}.`);
      return;
    }

    const stopId = `stop-${Date.now()}`;
    setStops([
      ...stops,
      {
        id: stopId,
        city_name: newStop.city_name.trim(),
        arrival: newStop.arrival,
        departure: newStop.departure,
        activities: []
      }
    ]);
    setSelectedStopId(stopId);
    setNewStop({ city_name: '', arrival: '', departure: '' });
    setIsAddingStop(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Header Area */}
      <div className="bg-white border-b border-slate-100 px-8 py-10 mb-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <nav className="flex gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">
              <button onClick={() => goTo('TRIPS')}>My Trips</button> <ChevronRight size={12}/> <span>{currentTrip?.name || 'Current Trip'}</span>
            </nav>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Build Your Itinerary</h1>
          </div>
          <button 
            onClick={() => setIsAddingStop(true)}
            className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-100 flex items-center gap-2 hover:scale-105 transition"
          >
            <Plus size={20}/> Add Travel Stop
          </button>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6">
        <div className="relative">
          {/* Vertical Line for Timeline Aesthetic */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-slate-100 rounded-full hidden md:block"></div>

          {stops.map((stop) => (
            <div key={stop.id} className="relative md:pl-20 animate-in fade-in slide-in-from-bottom-4">
              {/* Timeline Marker */}
              <div className="absolute left-6 top-8 w-5 h-5 bg-blue-600 rounded-full border-4 border-white shadow-sm hidden md:block z-10"></div>
              
              <div className={cardStyle}>
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                      <MapPin size={28}/>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-800">{stop.city_name}</h3>
                      <p className="text-sm font-bold text-slate-400 flex items-center gap-1">
                        <Calendar size={14}/> {stop.arrival} — {stop.departure}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => removeStop(stop.id)} className="p-3 bg-slate-50 text-slate-400 hover:text-red-500 rounded-xl transition" aria-label={`Remove ${stop.city_name}`}>
                      <Trash2 size={18}/>
                    </button>
                  </div>
                </div>

                {/* Stop Activities - Table: stop_activities */}
                <div className="space-y-3">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Activities</p>
                  {stop.activities.map((act) => (
                    <div key={act.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-blue-500">
                          <Activity size={18}/>
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{act.name}</p>
                          <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
                            <Clock size={12}/> {act.time}
                          </p>
                        </div>
                      </div>
                      <span className="font-black text-blue-600">{formatRupees(act.cost)}</span>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setSelectedStopId(stop.id);
                      setSelectedCity(stop.city_id ? { id: stop.city_id, name: stop.city_name, country: stop.country } : null);
                      goTo('ACT_SEARCH');
                    }}
                    className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-sm font-bold text-slate-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={16}/> Add Activity to {stop.city_name}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Add Stop Modal (Functional Placeholder) */}
      {isAddingStop && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Select a City</h2>
            <div className="relative mb-6">
              <Search className="absolute left-4 top-4 text-slate-400" size={18}/>
              <input 
                type="text" 
                placeholder="Where to next? (e.g. Tokyo)" 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={newStop.city_name}
                onChange={(e) => setNewStop({ ...newStop, city_name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input
                type="date"
                min={currentTrip.start_date}
                max={currentTrip.end_date}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={newStop.arrival}
                onChange={(e) => setNewStop({ ...newStop, arrival: e.target.value })}
              />
              <input
                type="date"
                min={newStop.arrival || currentTrip.start_date}
                max={currentTrip.end_date}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={newStop.departure}
                onChange={(e) => setNewStop({ ...newStop, departure: e.target.value })}
              />
            </div>
            {error && <p className="mb-4 text-xs font-bold text-red-500">{error}</p>}
            <div className="flex gap-3">
              <button onClick={() => setIsAddingStop(false)} className="flex-1 py-4 font-bold text-slate-500 hover:bg-slate-100 rounded-2xl transition">Cancel</button>
              <button onClick={addStop} className="flex-2 py-4 px-8 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-100 transition transform hover:-translate-y-1">Confirm Stop</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryBuilder;
