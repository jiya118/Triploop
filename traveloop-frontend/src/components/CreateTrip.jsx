import React, { useState } from 'react';
import { Calendar as CalendarIcon, Map, ChevronRight, Info, Edit2 } from 'lucide-react';

const CreateTrip = () => {
  const [step, setStep] = useState(1);
  const [dateMode, setDateMode] = useState({ start: 'picker', end: 'picker' });
  const [tripData, setTripData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    total_budget: '',
    is_public: false,
    description: ''
  });

  const inputClass = "w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none font-medium transition-all duration-300";
  const labelClass = "block text-sm font-black text-slate-700 mb-2 uppercase tracking-wide flex justify-between items-center";

  const toggleDateMode = (field) => {
    setDateMode(prev => ({
      ...prev,
      [field]: prev[field] === 'picker' ? 'manual' : 'picker'
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-[3rem] shadow-2xl border border-white overflow-hidden">
        {/* Banner Section */}
        <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white relative">
          <div className="text-center">
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-md mb-3 inline-block shadow-xl"><Map size={32}/></div>
            <h2 className="text-3xl font-black tracking-tight">Design Your Trip</h2>
          </div>
          <div className="absolute -bottom-1 flex w-full">
            <div className={`h-1 flex-1 transition-all duration-500 ${step >= 1 ? 'bg-white' : 'bg-white/20'}`}></div>
            <div className={`h-1 flex-1 transition-all duration-500 ${step >= 2 ? 'bg-white' : 'bg-white/20'}`}></div>
          </div>
        </div>

        <div className="p-10">
          {step === 1 ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Trip Name */}
              <div>
                <label className={labelClass}>Trip Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Europe Soul Searching" 
                  className={inputClass} 
                  onChange={(e) => setTripData({...tripData, name: e.target.value})}
                />
              </div>

              {/* Start Date Selection */}
              <div>
                <label className={labelClass}>
                  Start Date
                  <button onClick={() => toggleDateMode('start')} className="text-[10px] bg-slate-100 px-2 py-1 rounded-lg text-blue-600 hover:bg-blue-50 transition flex items-center gap-1">
                    <Edit2 size={10} /> {dateMode.start === 'picker' ? 'Enter Manually' : 'Use Calendar'}
                  </button>
                </label>
                <div className="relative group">
                  <CalendarIcon className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-500" size={18} />
                  <input 
                    type={dateMode.start === 'picker' ? "date" : "text"} 
                    placeholder={dateMode.start === 'manual' ? "YYYY-MM-DD" : ""}
                    className={`${inputClass} pl-12`}
                    onChange={(e) => setTripData({...tripData, start_date: e.target.value})}
                  />
                </div>
              </div>

              {/* End Date Selection */}
              <div>
                <label className={labelClass}>
                  End Date
                  <button onClick={() => toggleDateMode('end')} className="text-[10px] bg-slate-100 px-2 py-1 rounded-lg text-blue-600 hover:bg-blue-50 transition flex items-center gap-1">
                    <Edit2 size={10} /> {dateMode.end === 'picker' ? 'Enter Manually' : 'Use Calendar'}
                  </button>
                </label>
                <div className="relative group">
                  <CalendarIcon className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-500" size={18} />
                  <input 
                    type={dateMode.end === 'picker' ? "date" : "text"} 
                    placeholder={dateMode.end === 'manual' ? "YYYY-MM-DD" : ""}
                    className={`${inputClass} pl-12`}
                    onChange={(e) => setTripData({...tripData, end_date: e.target.value})}
                  />
                </div>
              </div>

              <button onClick={() => setStep(2)} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-black transition-all transform hover:-translate-y-1 shadow-lg shadow-slate-200">
                Next Details <ChevronRight size={18}/>
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div>
                <label className={labelClass}>Description</label>
                <textarea 
                  rows="3" 
                  className={inputClass + " resize-none"} 
                  placeholder="What's the vibe of this trip?" 
                  onChange={(e) => setTripData({...tripData, description: e.target.value})}
                ></textarea>
              </div>

              {/* Public Toggle - Table: trips.is_public */}
              <div className="flex items-center justify-between p-5 bg-blue-50 rounded-[2rem] border border-blue-100">
                <div className="flex gap-3 items-center">
                  <div className="bg-white p-2 rounded-xl text-blue-500 shadow-sm"><Info size={20}/></div>
                  <span className="font-bold text-blue-900 text-sm">Make itinerary public?</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    onChange={(e) => setTripData({...tripData, is_public: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl transition hover:bg-slate-200">Back</button>
                <button onClick={() => console.log("Insert into Table: trips", tripData)} className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 transition transform hover:-translate-y-1 active:scale-95">
                  Create Trip & Add Stops
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;