import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LocationProvider } from './contexts/LocationContext';
import SplashScreen from './components/SplashScreen';
import LoginScreen from './pages/LoginScreen';
import SignupScreen from './pages/SignupScreen';
import Dashboard from './pages/Dashboard';
import MapScreen from './pages/MapScreen';
import ContactsScreen from './pages/ContactsScreen';
import SOSActiveScreen from './pages/SOSActiveScreen';
import IncidentReportingScreen from './pages/IncidentReportingScreen';
import SettingsScreen from './pages/SettingsScreen';

import { isFirebaseConfigured } from './firebase';
import ConfigRequiredScreen from './components/ConfigRequiredScreen';

const AppRoutes = () => {
  const { user, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!isFirebaseConfigured) {
    return <ConfigRequiredScreen />;
  }

  if (showSplash || loading) {
    return <SplashScreen />;
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <LoginScreen /> : <Navigate to="/" />} />
      <Route path="/signup" element={!user ? <SignupScreen /> : <Navigate to="/" />} />
      
      <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
      <Route path="/map" element={user ? <MapScreen /> : <Navigate to="/login" />} />
      <Route path="/contacts" element={user ? <ContactsScreen /> : <Navigate to="/login" />} />
      <Route path="/sos-active" element={user ? <SOSActiveScreen /> : <Navigate to="/login" />} />
      <Route path="/reports" element={user ? <IncidentReportingScreen /> : <Navigate to="/login" />} />
      <Route path="/settings" element={user ? <SettingsScreen /> : <Navigate to="/login" />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <Router>
          <AppRoutes />
        </Router>
      </LocationProvider>
    </AuthProvider>
  );
}
