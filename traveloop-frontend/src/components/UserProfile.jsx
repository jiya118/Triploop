import React, { useState } from 'react';
import { User, Mail, Globe, Bell, Shield, LogOut, Trash2, MapPin, Camera, ChevronRight, Bookmark } from 'lucide-react';

const UserProfile = () => {
  // Aligned with Table 1 (users) and Table 10 (saved_destinations)
  const [profile, setProfile] = useState({
    name: 'Riddhi Thakkar',
    email: 'riddhi@traveloop.com',
    language: 'en',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Riddhi'
  });

  const savedDestinations = [
    { city: 'Kyoto', country: 'Japan', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=400' },
    { city: 'Santorini', country: 'Greece', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=400' }
  ];

  const sectionStyle = "bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 mb-6";
  const itemStyle = "flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer group";

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Profile Header */}
      <div className="bg-white border-b border-slate-100 px-8 py-12 mb-8">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-[2.5rem] border-4 border-white shadow-xl overflow-hidden">
              <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <button className="absolute -bottom-2 -right-2 p-3 bg-blue-600 text-white rounded-2xl shadow-lg hover:scale-110 transition">
              <Camera size={20} />
            </button>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{profile.name}</h1>
          <p className="text-slate-500 font-medium">{profile.email}</p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6">
        {/* Account Settings - Aligned with Screen 12 requirements */}
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-6 mb-4">Account Settings</h3>
        <div className={sectionStyle}>
          <div className={itemStyle}>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><User size={20} /></div>
              <span className="font-bold text-slate-700">Personal Information</span>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </div>
          <div className={itemStyle}>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Globe size={20} /></div>
              <span className="font-bold text-slate-700">Language Preference</span>
              <span className="text-xs font-black text-slate-400 bg-slate-100 px-2 py-1 rounded-lg uppercase">{profile.language}</span>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </div>
          <div className={itemStyle}>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Shield size={20} /></div>
              <span className="font-bold text-slate-700">Privacy & Security</span>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </div>
        </div>

        {/* Saved Destinations - Table: saved_destinations */}
        <div className="flex items-center justify-between mb-4 px-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Saved Destinations</h3>
          <button className="text-xs font-black text-blue-600 hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-10">
          {savedDestinations.map((dest, i) => (
            <div key={i} className="group relative aspect-video rounded-3xl overflow-hidden shadow-sm border border-slate-100">
              <img src={dest.img} alt={dest.city} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-lg font-bold">{dest.city}</p>
                <p className="text-xs font-medium opacity-80">{dest.country}</p>
              </div>
              <button className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-md rounded-xl text-white">
                <Bookmark size={16} fill="white" />
              </button>
            </div>
          ))}
        </div>

        {/* Danger Zone */}
        <div className="space-y-4">
          <button className="w-full py-4 flex items-center justify-center gap-2 font-black text-slate-400 hover:text-slate-900 transition border-2 border-transparent hover:border-slate-200 rounded-[2rem]">
            <LogOut size={20} /> Sign Out
          </button>
          <button className="w-full py-4 flex items-center justify-center gap-2 font-black text-red-400 hover:text-red-600 transition">
            <Trash2 size={20} /> Delete Account
          </button>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;