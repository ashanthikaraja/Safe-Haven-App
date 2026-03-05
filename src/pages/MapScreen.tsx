import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { useLocation } from '../contexts/LocationContext';
import { Shield, Phone, Navigation, Map as MapIcon, Hospital, Building2, Flame, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NearbyService } from '../types';

const MapScreen: React.FC = () => {
  const { location } = useLocation();
  const [services, setServices] = useState<NearbyService[]>([]);
  const [selectedService, setSelectedService] = useState<NearbyService | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""
  });

  useEffect(() => {
    if (location) {
      // Mock nearby services
      setServices([
        {
          id: '1',
          name: 'Central Police Station',
          type: 'police',
          location: { lat: location.lat + 0.005, lng: location.lng + 0.005 },
          address: '123 Justice Ave',
          phone: '555-0123'
        },
        {
          id: '2',
          name: 'City General Hospital',
          type: 'hospital',
          location: { lat: location.lat - 0.005, lng: location.lng - 0.002 },
          address: '456 Health St',
          phone: '555-0456'
        },
        {
          id: '3',
          name: 'Fire Station #4',
          type: 'fire_station',
          location: { lat: location.lat + 0.002, lng: location.lng - 0.006 },
          address: '789 Safety Rd',
          phone: '555-0789'
        }
      ]);
    }
  }, [location]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'police': return <Building2 size={20} className="text-blue-600" />;
      case 'hospital': return <Hospital size={20} className="text-emerald-600" />;
      case 'fire_station': return <Flame size={20} className="text-orange-600" />;
      default: return <Shield size={20} />;
    }
  };

  if (!isLoaded) return <div className="h-screen flex items-center justify-center">Loading Maps...</div>;

  return (
    <div className="h-screen relative flex flex-col">
      <div className="absolute top-6 left-6 right-6 z-10 flex items-center justify-between pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-zinc-200 pointer-events-auto flex items-center gap-3">
          <div className="bg-red-600 p-2 rounded-lg">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-zinc-900 text-sm">Safe Haven Map</h1>
            <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Nearby Services</p>
          </div>
        </div>
        
        <button 
          onClick={() => setMapType(prev => prev === 'roadmap' ? 'satellite' : 'roadmap')}
          className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-zinc-200 pointer-events-auto text-zinc-600"
        >
          <MapIcon size={24} />
        </button>
      </div>

      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={location || { lat: 0, lng: 0 }}
        zoom={15}
        mapTypeId={mapType}
        options={{
          disableDefaultUI: true,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        }}
      >
        {location && (
          <Marker 
            position={location} 
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#3b82f6",
              fillOpacity: 1,
              strokeWeight: 3,
              strokeColor: "#ffffff",
            }}
          />
        )}

        {services.map(service => (
          <Marker
            key={service.id}
            position={service.location}
            onClick={() => setSelectedService(service)}
            icon={{
              url: `https://maps.google.com/mapfiles/ms/icons/${service.type === 'police' ? 'blue' : service.type === 'hospital' ? 'green' : 'orange'}-dot.png`
            }}
          />
        ))}

        {selectedService && (
          <InfoWindow
            position={selectedService.location}
            onCloseClick={() => setSelectedService(null)}
          >
            <div className="p-2 max-w-[200px]">
              <h3 className="font-bold text-zinc-900">{selectedService.name}</h3>
              <p className="text-zinc-500 text-xs mt-1">{selectedService.address}</p>
              <div className="flex gap-2 mt-3">
                <button 
                  onClick={() => window.open(`tel:${selectedService.phone}`)}
                  className="flex-1 bg-zinc-100 p-2 rounded-lg flex items-center justify-center text-zinc-600"
                >
                  <Phone size={16} />
                </button>
                <button 
                  className="flex-1 bg-red-600 p-2 rounded-lg flex items-center justify-center text-white"
                >
                  <Navigation size={16} />
                </button>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Bottom Sheet Overlay */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[40px] shadow-2xl p-8 z-20 border-t border-zinc-100"
          >
            <div className="w-12 h-1.5 bg-zinc-200 rounded-full mx-auto mb-6" />
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${
                  selectedService.type === 'police' ? 'bg-blue-50' : 
                  selectedService.type === 'hospital' ? 'bg-emerald-50' : 'bg-orange-50'
                }`}>
                  {getIcon(selectedService.type)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-zinc-900">{selectedService.name}</h2>
                  <p className="text-zinc-500 text-sm uppercase font-bold tracking-widest">{selectedService.type.replace('_', ' ')}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-zinc-600">
                <MapPin size={18} className="text-zinc-400" />
                <span className="text-sm">{selectedService.address}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-600">
                <Phone size={18} className="text-zinc-400" />
                <span className="text-sm">{selectedService.phone}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => window.open(`tel:${selectedService.phone}`)}
                className="py-4 bg-zinc-100 rounded-2xl font-bold text-zinc-900 flex items-center justify-center gap-2"
              >
                <Phone size={20} />
                Call
              </button>
              <button className="py-4 bg-red-600 rounded-2xl font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-red-100">
                <Navigation size={20} />
                Navigate
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MapScreen;
