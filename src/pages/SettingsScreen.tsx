import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Bell, 
  Shield, 
  Lock, 
  Eye, 
  ChevronRight, 
  LogOut, 
  ArrowLeft,
  Smartphone,
  Globe,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';

const SettingsScreen: React.FC = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <header className="bg-white border-b border-zinc-200 px-6 py-6 flex items-center gap-4 sticky top-0 z-30">
        <button onClick={() => navigate('/')} className="text-zinc-400">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-zinc-900">Settings</h1>
      </header>

      <main className="p-6 space-y-8">
        {/* Profile Section */}
        <section className="bg-white rounded-[32px] p-6 border border-zinc-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center overflow-hidden">
              {profile?.profileImage ? (
                <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={32} className="text-zinc-300" />
              )}
            </div>
            <div>
              <h4 className="font-bold text-zinc-900">{profile?.name}</h4>
              <p className="text-zinc-500 text-xs">{profile?.phone}</p>
            </div>
          </div>
          <button className="text-red-600 font-bold text-sm">Edit</button>
        </section>

        {/* Settings Groups */}
        <div className="space-y-4">
          <SettingsGroup title="General">
            <SettingsItem icon={<Bell className="text-blue-500" />} label="Notifications" />
            <SettingsItem icon={<Shield className="text-emerald-500" />} label="Safety Features" />
            <SettingsItem icon={<Smartphone className="text-purple-500" />} label="Device Permissions" />
          </SettingsGroup>

          <SettingsGroup title="Privacy & Security">
            <SettingsItem icon={<Lock className="text-orange-500" />} label="Change Password" />
            <SettingsItem icon={<Eye className="text-zinc-500" />} label="Location Privacy" />
          </SettingsGroup>

          <SettingsGroup title="Support">
            <SettingsItem icon={<Globe className="text-sky-500" />} label="Language" value="English" />
            <SettingsItem icon={<Info className="text-zinc-400" />} label="About Safe Haven" />
          </SettingsGroup>
        </div>

        <button 
          onClick={handleSignOut}
          className="w-full py-5 flex items-center justify-center gap-3 text-red-600 font-bold bg-white border border-red-100 rounded-3xl hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          Sign Out
        </button>

        <div className="text-center pb-8">
          <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Version 1.0.0 (Build 2403)</p>
        </div>
      </main>
    </div>
  );
};

const SettingsGroup: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-2">
    <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-4 mb-2">{title}</h3>
    <div className="bg-white rounded-[32px] border border-zinc-200 shadow-sm overflow-hidden">
      {children}
    </div>
  </div>
);

const SettingsItem: React.FC<{ icon: React.ReactNode, label: string, value?: string }> = ({ icon, label, value }) => (
  <button className="w-full px-6 py-5 flex items-center justify-between hover:bg-zinc-50 transition-colors border-b border-zinc-100 last:border-0">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center">
        {icon}
      </div>
      <span className="font-semibold text-zinc-700">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {value && <span className="text-zinc-400 text-sm">{value}</span>}
      <ChevronRight size={18} className="text-zinc-300" />
    </div>
  </button>
);

export default SettingsScreen;
