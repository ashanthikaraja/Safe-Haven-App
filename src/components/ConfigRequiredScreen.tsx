import React from 'react';
import { Shield, AlertCircle, ExternalLink, Copy } from 'lucide-react';
import { motion } from 'motion/react';

const ConfigRequiredScreen: React.FC = () => {
  const appUrl = window.location.origin;

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6 text-zinc-900">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-lg bg-white rounded-[40px] shadow-2xl p-10 border border-zinc-200"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="bg-red-600 p-4 rounded-3xl shadow-lg mb-6">
            <Shield size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-center">Configuration Required</h1>
          <p className="text-zinc-500 text-center mt-2">Safe Haven needs Firebase to function.</p>
        </div>

        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-4">
            <AlertCircle className="text-amber-600 shrink-0" size={24} />
            <div className="text-sm text-amber-800">
              <p className="font-bold mb-1">Missing API Keys</p>
              <p>Firebase environment variables are not set. Please follow the steps below to configure your app.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-widest text-zinc-400">Setup Steps</h3>
            
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-500 shrink-0">1</div>
              <div className="text-sm">
                <p className="font-bold">Create a Firebase Project</p>
                <p className="text-zinc-500">Go to the <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="text-red-600 hover:underline inline-flex items-center gap-1">Firebase Console <ExternalLink size={12} /></a> and create a project.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-500 shrink-0">2</div>
              <div className="text-sm">
                <p className="font-bold">Register Web App</p>
                <p className="text-zinc-500">Add a Web App to your project and copy the configuration object.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-500 shrink-0">3</div>
              <div className="text-sm">
                <p className="font-bold">Enable Email/Password Auth</p>
                <p className="text-zinc-500">In the Firebase Console, go to <b>Authentication</b> &gt; <b>Sign-in method</b> and enable <b>Email/Password</b>. This is required for the app to work.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-500 shrink-0">4</div>
              <div className="text-sm">
                <p className="font-bold">Set Environment Variables</p>
                <p className="text-zinc-500">Open the <b>Secrets</b> panel in AI Studio and add the following keys:</p>
                <div className="mt-2 bg-zinc-900 rounded-xl p-3 font-mono text-[10px] text-zinc-400 space-y-1 overflow-x-auto">
                  <p>VITE_FIREBASE_API_KEY</p>
                  <p>VITE_FIREBASE_AUTH_DOMAIN</p>
                  <p>VITE_FIREBASE_PROJECT_ID</p>
                  <p>VITE_FIREBASE_STORAGE_BUCKET</p>
                  <p>VITE_FIREBASE_MESSAGING_SENDER_ID</p>
                  <p>VITE_FIREBASE_APP_ID</p>
                  <p>VITE_GOOGLE_MAPS_API_KEY</p>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-red-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-red-100 hover:bg-red-700 transition-all"
          >
            I've set the keys, reload app
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfigRequiredScreen;
