import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../contexts/LocationContext';
import { 
  Shield, 
  PhoneCall, 
  MapPin, 
  Clock, 
  Users, 
  AlertTriangle, 
  Settings,
  Bell,
  Menu,
  X,
  Mic
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const Dashboard: React.FC = () => {
  const { profile, signOut } = useAuth();
  const { location, startTracking, stopTracking, isTracking } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();

  // Safety Timer Logic
  useEffect(() => {
    let interval: any;
    if (timerActive && timer !== null && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (timer === 0) {
      handleSOS();
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timer]);

  const handleSOS = async () => {
    if (!profile || !location) return;
    
    try {
      await addDoc(collection(db, 'sos_alerts'), {
        userId: profile.uid,
        userName: profile.name,
        timestamp: serverTimestamp(),
        location: location,
        status: 'active'
      });
      navigate('/sos-active');
    } catch (error) {
      console.error("SOS Error:", error);
    }
  };

  const toggleSafetyTimer = () => {
    if (timerActive) {
      setTimerActive(false);
      setTimer(null);
    } else {
      setTimer(1800); // 30 minutes default
      setTimerActive(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startVoiceDetection = () => {
    setIsListening(true);
    // In a real app, we'd use Web Speech API or Gemini here
    setTimeout(() => {
      setIsListening(false);
      // Mock detection
      // handleSOS();
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col pb-20">
      {/* Header */}
      <header className="bg-white border-bottom border-zinc-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="bg-red-600 p-1.5 rounded-lg">
            <Shield size={20} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">Safe Haven</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-zinc-400 hover:text-zinc-600 relative">
            <Bell size={24} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button onClick={() => setIsMenuOpen(true)} className="text-zinc-400 hover:text-zinc-600">
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-8">
        {/* Welcome Section */}
        <section>
          <h2 className="text-2xl font-bold text-zinc-900">Hello, {profile?.name?.split(' ')[0] || 'User'}</h2>
          <p className="text-zinc-500 text-sm">You are currently in a <span className="text-emerald-600 font-semibold">Safe Zone</span></p>
        </section>

        {/* SOS Button Section */}
        <section className="flex flex-col items-center justify-center py-8">
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-red-100 rounded-full"
            />
            <button
              onClick={handleSOS}
              className="relative z-10 w-48 h-48 bg-red-600 rounded-full shadow-2xl shadow-red-200 flex flex-col items-center justify-center text-white active:scale-95 transition-transform"
            >
              <Shield size={64} className="mb-2" />
              <span className="text-2xl font-black tracking-widest">SOS</span>
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Press for 3s</span>
            </button>
          </div>
          <p className="mt-6 text-zinc-400 text-xs font-medium uppercase tracking-widest">Emergency Assistance</p>
        </section>

        {/* Quick Actions Grid */}
        <section className="grid grid-cols-2 gap-4">
          <QuickActionCard 
            icon={<PhoneCall className="text-blue-600" />}
            title="Call Police"
            subtitle="Immediate help"
            onClick={() => window.open('tel:911')}
            color="bg-blue-50"
          />
          <QuickActionCard 
            icon={<MapPin className={isTracking ? "text-emerald-600" : "text-zinc-600"} />}
            title={isTracking ? "Sharing Live" : "Share Location"}
            subtitle={isTracking ? "Contacts notified" : "Real-time tracking"}
            onClick={isTracking ? stopTracking : startTracking}
            color={isTracking ? "bg-emerald-50" : "bg-zinc-100"}
          />
          <QuickActionCard 
            icon={<Clock className={timerActive ? "text-orange-600" : "text-zinc-600"} />}
            title="Safety Timer"
            subtitle={timerActive ? `Expires in ${formatTime(timer || 0)}` : "Set for travel"}
            onClick={toggleSafetyTimer}
            color={timerActive ? "bg-orange-50" : "bg-zinc-100"}
          />
          <QuickActionCard 
            icon={<Mic className={isListening ? "text-red-600 animate-pulse" : "text-zinc-600"} />}
            title="Voice Trigger"
            subtitle={isListening ? "Listening..." : "Hands-free SOS"}
            onClick={startVoiceDetection}
            color={isListening ? "bg-red-50" : "bg-zinc-100"}
          />
        </section>

        {/* Recent Activity / Safety Score */}
        <section className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-zinc-900">Safety Score</h3>
            <span className="text-emerald-600 font-bold text-xl">98/100</span>
          </div>
          <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-[98%]"></div>
          </div>
          <p className="text-zinc-500 text-xs mt-3">Your current route is highly rated by other users.</p>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 px-6 py-3 flex items-center justify-between z-30">
        <NavIcon icon={<Shield size={24} />} label="Home" active />
        <NavIcon icon={<MapPin size={24} />} label="Map" onClick={() => navigate('/map')} />
        <NavIcon icon={<Users size={24} />} label="Contacts" onClick={() => navigate('/contacts')} />
        <NavIcon icon={<AlertTriangle size={24} />} label="Reports" onClick={() => navigate('/reports')} />
        <NavIcon icon={<Settings size={24} />} label="Settings" onClick={() => navigate('/settings')} />
      </nav>

      {/* Side Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-white z-50 p-8 flex flex-col shadow-2xl"
            >
              <div className="flex justify-end mb-8">
                <button onClick={() => setIsMenuOpen(false)} className="text-zinc-400">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex items-center gap-4 mb-10">
                <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center overflow-hidden">
                  {profile?.profileImage ? (
                    <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <Users size={32} className="text-zinc-300" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900">{profile?.name}</h4>
                  <p className="text-zinc-500 text-xs">{profile?.email}</p>
                </div>
              </div>

              <div className="space-y-6 flex-1">
                <MenuLink icon={<Users size={20} />} label="Emergency Contacts" onClick={() => navigate('/contacts')} />
                <MenuLink icon={<Clock size={20} />} label="Safety History" />
                <MenuLink icon={<Shield size={20} />} label="Privacy Settings" />
                <MenuLink icon={<Settings size={20} />} label="App Settings" onClick={() => navigate('/settings')} />
              </div>

              <button 
                onClick={() => signOut()}
                className="w-full py-4 text-red-600 font-bold border border-red-100 rounded-xl hover:bg-red-50 transition-colors"
              >
                Sign Out
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const QuickActionCard: React.FC<{ icon: React.ReactNode, title: string, subtitle: string, onClick: () => void, color: string }> = ({ icon, title, subtitle, onClick, color }) => (
  <button 
    onClick={onClick}
    className={`${color} p-5 rounded-3xl flex flex-col items-start text-left transition-all active:scale-95 border border-transparent hover:border-zinc-200`}
  >
    <div className="mb-3">{icon}</div>
    <h4 className="font-bold text-zinc-900 text-sm">{title}</h4>
    <p className="text-zinc-500 text-[10px] leading-tight mt-1">{subtitle}</p>
  </button>
);

const NavIcon: React.FC<{ icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 ${active ? 'text-red-600' : 'text-zinc-400'}`}>
    {icon}
    <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
  </button>
);

const MenuLink: React.FC<{ icon: React.ReactNode, label: string, onClick?: () => void }> = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="flex items-center gap-4 text-zinc-600 hover:text-zinc-900 font-medium transition-colors w-full text-left">
    <div className="text-zinc-400">{icon}</div>
    <span>{label}</span>
  </button>
);

export default Dashboard;
