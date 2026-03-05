import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../contexts/LocationContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { AlertTriangle, Camera, MapPin, Send, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const IncidentReportingScreen: React.FC = () => {
  const { user } = useAuth();
  const { location } = useLocation();
  const [type, setType] = useState<'unsafe_street' | 'harassment' | 'suspicious_activity' | 'other'>('unsafe_street');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !location) return;

    setLoading(true);
    try {
      let imageUrl = '';
      if (image) {
        const imageRef = ref(storage, `incidents/${user.uid}/${Date.now()}_${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, 'incident_reports'), {
        userId: user.uid,
        type,
        description,
        imageUrl,
        location: {
          lat: location.lat,
          lng: location.lng
        },
        timestamp: serverTimestamp()
      });

      setSubmitted(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error("Error reporting incident:", error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-emerald-500 flex flex-col items-center justify-center p-8 text-white">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center"
        >
          <div className="bg-white p-6 rounded-full shadow-2xl mb-6">
            <CheckCircle size={80} className="text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Report Submitted</h1>
          <p className="text-emerald-100 text-center">Thank you for helping keep the community safe.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-6 pb-24">
      <header className="flex items-center justify-between mb-8">
        <button onClick={() => navigate('/')} className="text-zinc-400">
          <X size={24} />
        </button>
        <h1 className="text-xl font-bold text-zinc-900">Report Incident</h1>
        <div className="w-6" />
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Incident Type</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'unsafe_street', label: 'Unsafe Street', icon: <AlertTriangle size={18} /> },
              { id: 'harassment', label: 'Harassment', icon: <AlertTriangle size={18} /> },
              { id: 'suspicious_activity', label: 'Suspicious', icon: <AlertTriangle size={18} /> },
              { id: 'other', label: 'Other', icon: <AlertTriangle size={18} /> }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setType(item.id as any)}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                  type === item.id 
                    ? 'bg-red-50 border-red-200 text-red-600' 
                    : 'bg-white border-zinc-200 text-zinc-500'
                }`}
              >
                {item.icon}
                <span className="text-[10px] font-bold uppercase">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white border border-zinc-200 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-red-500 outline-none min-h-[120px]"
            placeholder="Describe what happened..."
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Add Photo (Optional)</label>
          <div className="relative">
            {preview ? (
              <div className="relative rounded-2xl overflow-hidden aspect-video">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  onClick={() => { setImage(null); setPreview(null); }}
                  className="absolute top-2 right-2 bg-black/50 p-2 rounded-full text-white"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full aspect-video bg-white border-2 border-dashed border-zinc-200 rounded-2xl cursor-pointer hover:bg-zinc-50 transition-colors">
                <Camera size={32} className="text-zinc-300 mb-2" />
                <span className="text-zinc-400 text-sm">Tap to take photo</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>
        </div>

        <div className="bg-emerald-50 p-4 rounded-2xl flex items-center gap-3 text-emerald-700 text-xs">
          <MapPin size={18} />
          <span>Your current location will be attached to this report.</span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-red-100 flex items-center justify-center gap-3 disabled:opacity-70 active:scale-95 transition-transform"
        >
          {loading ? 'Submitting...' : (
            <>
              <Send size={20} />
              Submit Report
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default IncidentReportingScreen;
