import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../contexts/LocationContext';
import { Shield, Phone, MessageSquare, MapPin, X, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const SOSActiveScreen: React.FC = () => {
  const { profile } = useAuth();
  const { location } = useLocation();
  const [alertId, setAlertId] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile) return;

    const q = query(
      collection(db, 'sos_alerts'), 
      where('userId', '==', profile.uid),
      where('status', '==', 'active')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setAlertId(snapshot.docs[0].id);
      } else {
        navigate('/');
      }
    });

    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [profile, navigate]);

  const handleResolve = async () => {
    if (alertId) {
      await updateDoc(doc(db, 'sos_alerts', alertId), {
        status: 'resolved',
        resolvedAt: new Date().toISOString()
      });
      navigate('/');
    }
  };

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const rs = s % 60;
    return `${m}:${rs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-red-600 flex flex-col p-8 text-white">
      <div className="flex-1 flex flex-col items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-64 h-64 bg-white/20 rounded-full flex items-center justify-center mb-8"
        >
          <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-2xl">
            <Shield size={80} className="text-red-600" />
          </div>
        </motion.div>

        <h1 className="text-4xl font-black tracking-tighter mb-2">SOS ACTIVE</h1>
        <p className="text-red-100 text-center max-w-xs mb-8">
          Your emergency contacts and nearby authorities have been notified.
        </p>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 w-full max-w-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-red-100 text-sm font-bold uppercase tracking-widest">Duration</span>
            <span className="text-2xl font-mono font-bold">{formatDuration(seconds)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-red-100 text-sm font-bold uppercase tracking-widest">Location</span>
            <span className="text-sm font-bold truncate ml-4">
              {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : 'Locating...'}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <button 
          onClick={() => window.open('tel:911')}
          className="w-full bg-white text-red-600 font-bold py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-transform"
        >
          <Phone size={24} />
          Call Emergency Services
        </button>
        
        <button 
          onClick={handleResolve}
          className="w-full bg-red-700 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 border border-red-500 active:scale-95 transition-transform"
        >
          <X size={24} />
          I am Safe Now
        </button>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 text-red-200 text-xs font-bold uppercase tracking-widest">
        <AlertCircle size={14} />
        Live Tracking Enabled
      </div>
    </div>
  );
};

export default SOSActiveScreen;
