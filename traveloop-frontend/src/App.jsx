import { useCallback, useMemo, useState } from 'react';
import AuthSystem from './components/AuthSystem';
import Dashboard from './components/Dashboard';
import CreateTrip from './components/CreateTrip';
import ItineraryBuilder from './components/ItineraryBuilder';
import ItineraryView from './components/ItineraryView';
import CitySearch from './components/CitySearch';
import ActivitySearch from './components/ActivitySearch';
import BudgetScreen from './components/BudgetScreen';
import PackingChecklist from './components/PackingChecklist';
import PublicItinerary from './components/PublicItinerary';
import UserProfile from './components/UserProfile';
import TripNotes from './components/TripNotes';
import AdminDashboard from './components/AdminDashboard';
import { LayoutDashboard, PlusCircle, Package, Notebook, User as UserIcon, ShieldAlert, LogOut, Menu, X, Map, Search, Wallet, Share2 } from 'lucide-react';

function App() {
  // role-based user state: { name: string, is_admin: boolean }
  const [user, setUser] = useState(null);
  const [activeScreen, setActiveScreen] = useState('DASHBOARD');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentTrip, setCurrentTrip] = useState({
    name: 'Europe Summer Soul',
    start_date: '2026-06-20',
    end_date: '2026-07-05',
    description: 'A multi-city summer plan with city stops, activities, notes, and budget tracking.',
    total_budget: 240000,
    is_public: true
  });
  const [selectedStopId, setSelectedStopId] = useState('stop-1');
  const [selectedCity, setSelectedCity] = useState(null);
  const [stops, setStops] = useState([
    {
      id: 'stop-1',
      city_name: 'Paris',
      arrival: '2026-06-20',
      departure: '2026-06-23',
      activities: [
        { id: 'act-1', name: 'Eiffel Tower Visit', time: '10:00 AM', cost: 2400 }
      ]
    }
  ]);

  const goTo = (screen) => {
    setActiveScreen(screen);
    setSidebarOpen(false);
  };

  const handleLogin = (userData) => {
    // userData should contain is_admin from Table 1
    setUser(userData);
    setActiveScreen('DASHBOARD');
  };

  const addActivityToStop = useCallback((activity, stopId) => {
    const targetStopId = stopId || selectedStopId || stops[0]?.id;
    if (!targetStopId) return;

    setStops((prevStops) =>
      prevStops.map((stop) =>
        stop.id === targetStopId
          ? {
              ...stop,
              activities: [
                ...stop.activities,
                {
                  id: `${activity.id}-${Date.now()}`,
                  name: activity.name,
                  time: activity.time || '09:00 AM',
                  cost: activity.cost,
                  category: activity.category
                }
              ]
            }
          : stop
      )
    );
  }, [selectedStopId, stops]);

  const addStopToTrip = useCallback((city, dates = {}) => {
    const arrival = dates.arrival || currentTrip.start_date;
    const departure = dates.departure || currentTrip.start_date;

    if (arrival < currentTrip.start_date || departure > currentTrip.end_date || departure < arrival) {
      return { ok: false, error: `Stop dates must be between ${currentTrip.start_date} and ${currentTrip.end_date}.` };
    }

    const existing = stops.find((stop) => stop.city_id === city.id || stop.city_name.toLowerCase() === city.name.toLowerCase());
    if (existing) {
      setSelectedStopId(existing.id);
      setSelectedCity(city);
      return { ok: true, stopId: existing.id };
    }

    const newStop = {
      id: `stop-${Date.now()}`,
      city_id: city.id,
      city_name: city.name,
      country: city.country,
      arrival,
      departure,
      activities: []
    };

    setStops((prevStops) => [...prevStops, newStop]);
    setSelectedStopId(newStop.id);
    setSelectedCity(city);
    return { ok: true, stopId: newStop.id };
  }, [currentTrip.end_date, currentTrip.start_date, stops]);

  const navItems = [
    { id: 'DASHBOARD', label: 'My Dashboard', icon: LayoutDashboard, adminOnly: false },
    { id: 'TRIPS', label: 'My Trips', icon: Map, adminOnly: false },
    { id: 'CREATE_TRIP', label: 'Plan New Trip', icon: PlusCircle, adminOnly: false },
    { id: 'CITY_SEARCH', label: 'Explore Cities', icon: Search, adminOnly: false },
    { id: 'BUDGET', label: 'Trip Budget', icon: Wallet, adminOnly: false },
    { id: 'PACKING', label: 'Packing List', icon: Package, adminOnly: false },
    { id: 'NOTES', label: 'Trip Journal', icon: Notebook, adminOnly: false },
    { id: 'PUBLIC', label: 'Public Share', icon: Share2, adminOnly: false },
    { id: 'PROFILE', label: 'My Settings', icon: UserIcon, adminOnly: false },
    { id: 'ADMIN', label: 'Platform Admin', icon: ShieldAlert, adminOnly: true },
  ];

  const appActions = useMemo(() => ({
    goTo,
    setCurrentTrip,
    currentTrip,
    stops,
    setStops,
    selectedStopId,
    setSelectedStopId,
    selectedCity,
    setSelectedCity,
    addActivityToStop,
    addStopToTrip
  }), [addActivityToStop, addStopToTrip, currentTrip, selectedCity, selectedStopId, stops]);

  if (!user) {
    return <AuthSystem onLogin={handleLogin} />;
  }

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'DASHBOARD': return <Dashboard {...appActions} user={user} />;
      case 'TRIPS': return <Dashboard {...appActions} user={user} mode="trips" />;
      case 'CREATE_TRIP': return <CreateTrip {...appActions} />;
      case 'BUILDER': return <ItineraryBuilder {...appActions} />;
      case 'VIEW': return <ItineraryView {...appActions} />;
      case 'CITY_SEARCH': return <CitySearch {...appActions} />;
      case 'ACT_SEARCH': return <ActivitySearch {...appActions} />;
      case 'BUDGET': return <BudgetScreen {...appActions} />;
      case 'PACKING': return <PackingChecklist />;
      case 'PUBLIC': return <PublicItinerary />;
      case 'PROFILE': return <UserProfile />;
      case 'NOTES': return <TripNotes />;
      case 'ADMIN': return user.is_admin ? <AdminDashboard /> : <Dashboard />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      {/* Role-Based Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out shadow-2xl`}>
        <div className="flex flex-col h-full">
          <div className="p-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-900/50">
                <ShieldAlert size={20} className="text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter">Traveloop</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {navItems.map((item) => {
              if (item.adminOnly && !user.is_admin) return null;
              
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => goTo(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bold text-sm transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 translate-x-1' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                >
                  <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-500'} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="p-6 border-t border-white/5">
            <div className="flex items-center gap-4 mb-6 px-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 border-2 border-white/10 overflow-hidden shadow-md">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="avatar" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-black truncate">{user.name}</p>
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                  {user.is_admin ? 'Global Admin' : 'Traveler'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setUser(null)}
              className="w-full flex items-center justify-center gap-2 py-4 bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-2xl font-bold text-sm transition-all border border-white/5"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Screen Content */}
      <div className="flex-1 relative flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-black text-slate-900">Traveloop</span>
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl">
            <Menu size={24} />
          </button>
        </header>

        {renderActiveScreen()}
      </div>
    </div>
  );
}

export default App;
