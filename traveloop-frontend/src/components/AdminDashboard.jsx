import { Users, Map, TrendingUp, ArrowUpRight, Globe, ShieldCheck } from 'lucide-react';

const AdminDashboard = () => {
  // Data mapped from Admin Views: top_cities, top_activities, and user_engagement
  const stats = [
    { label: 'Total Users', value: '12,840', change: '+12%', icon: Users, color: 'text-blue-600' },
    { label: 'Trips Created', value: '45,210', change: '+18%', icon: Map, color: 'text-indigo-600' },
    { label: 'Active Cities', value: '840', change: '+5%', icon: Globe, color: 'text-emerald-600' },
  ];

  const topCities = [
    { name: 'Paris', country: 'France', stops: 1240, growth: '+14%' },
    { name: 'Tokyo', country: 'Japan', stops: 980, growth: '+22%' },
    { name: 'Bali', country: 'Indonesia', stops: 850, growth: '+8%' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Optional for Admin look */}
      <aside className="w-64 bg-slate-900 hidden lg:flex flex-col p-6 text-white">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="bg-blue-600 p-2 rounded-lg"><Map size={20}/></div>
          <span className="text-xl font-black tracking-tight">Traveloop</span>
        </div>
        <nav className="space-y-2">
          {['Dashboard', 'Users', 'Destinations', 'Security', 'Settings'].map((item) => (
            <button key={item} className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition ${item === 'Dashboard' ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5'}`}>
              {item}
            </button>
          ))}
        </nav>
        <div className="mt-auto p-4 bg-blue-600/20 rounded-2xl border border-blue-600/30">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <ShieldCheck size={16}/> <span className="text-xs font-black uppercase">Admin Pro</span>
          </div>
          <p className="text-[10px] text-blue-100 leading-relaxed">You have full access to the travel analytics engine.</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Platform Analytics</h1>
          <p className="text-slate-500 font-medium mt-1">Real-time performance monitoring for Traveloop.</p>
        </header>

        {/* High-Level Stats - Aligned with analytics_events */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-500">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-slate-50 ${stat.color} group-hover:scale-110 transition-transform`}>
                  <stat.icon size={24} />
                </div>
                <span className="flex items-center gap-1 text-xs font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                  <ArrowUpRight size={12}/> {stat.change}
                </span>
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Cities - View: top_cities */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-800">Popular Destinations </h3>
              <button className="text-xs font-black text-blue-600 hover:underline">Full Report</button>
            </div>
            <div className="space-y-6">
              {topCities.map((city, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-black text-slate-300 w-4">{i + 1}</span>
                    <div>
                      <p className="font-bold text-slate-800">{city.name}</p>
                      <p className="text-xs font-medium text-slate-400">{city.country}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-900">{city.stops} stops</p>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">{city.growth} growth</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Engagement Overview - Using analytics_events logic */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-black mb-8 flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-400" /> User Engagement
              </h3>
              <div className="space-y-6">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                  <p className="text-xs font-black text-blue-400 uppercase mb-2">Most Active Time</p>
                  <p className="text-2xl font-bold">7:00 PM - 10:00 PM</p>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                  <p className="text-xs font-black text-indigo-400 uppercase mb-2">Avg. Itinerary Length</p>
                  <p className="text-2xl font-bold">5.4 Cities / Trip</p>
                </div>
              </div>
            </div>
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full opacity-10 blur-[100px]"></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
