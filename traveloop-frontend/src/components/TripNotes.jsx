import { useState } from 'react';
import { StickyNote, Plus, MapPin, Calendar, Search, Edit3, Trash2, MoreVertical, AlignLeft } from 'lucide-react';

const TripNotes = () => {
  // Aligned with Table 9: trip_notes
  const [notes] = useState([
    { 
      id: 1, 
      title: 'Hotel Check-in Info', 
      content: 'Confirmation: #TRV123. Check-in at 3 PM. They have a luggage room if we arrive early.',
      stop_name: 'Paris',
      updated_at: '2026-05-10'
    },
    { 
      id: 2, 
      title: 'Local Emergency Contacts', 
      content: 'Tourist Police: 1155. Embassy: +66 2 205 4000.',
      stop_name: null, // Trip-level note
      updated_at: '2026-05-09'
    }
  ]);

  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Sticky Header */}
      <div className="bg-white border-b border-slate-100 px-8 py-8 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
              <StickyNote size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Trip Journal</h1>
              <p className="text-sm font-bold text-slate-400">Manage notes for Europe Summer Soul</p>
            </div>
          </div>
          <button className="px-8 py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-black transition flex items-center gap-2 transform active:scale-95">
            <Plus size={20} /> New Note
          </button>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-4 text-slate-300 group-focus-within:text-orange-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search your notes..." 
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-orange-400 transition-all font-medium"
            />
          </div>
          <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
            {['all', 'Paris', 'Tokyo'].map((stop) => (
              <button 
                key={stop}
                onClick={() => setActiveTab(stop)}
                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                  ${activeTab === stop ? 'bg-orange-500 text-white shadow-lg shadow-orange-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {stop}
              </button>
            ))}
          </div>
        </div>

        {/* Notes Grid - Pinterest-style Layout */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {notes.map((note) => (
            <div key={note.id} className="break-inside-avoid bg-white rounded-[2rem] p-8 shadow-sm border border-slate-50 hover:shadow-xl hover:border-orange-100 transition-all duration-500 group relative">
              <div className="flex justify-between items-start mb-4">
                {note.stop_name ? (
                  <div className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase">
                    <MapPin size={10} /> {note.stop_name}
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase">
                    General
                  </div>
                )}
                <button className="text-slate-300 hover:text-slate-600"><MoreVertical size={18} /></button>
              </div>

              <h3 className="text-xl font-black text-slate-800 mb-3 group-hover:text-orange-600 transition-colors">{note.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed text-sm mb-6 whitespace-pre-line">
                {note.content}
              </p>

              <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1 uppercase">
                  <Calendar size={12} /> {note.updated_at}
                </span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-slate-400 hover:text-blue-600"><Edit3 size={16} /></button>
                  <button className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State / Add Suggestion */}
          <div className="break-inside-avoid border-2 border-dashed border-slate-200 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center group hover:border-orange-300 hover:bg-orange-50 transition-all cursor-pointer">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-white transition-colors">
              <AlignLeft className="text-slate-300 group-hover:text-orange-500" size={24} />
            </div>
            <p className="text-sm font-black text-slate-400 group-hover:text-orange-600 uppercase tracking-widest">Add Reminder</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TripNotes;
