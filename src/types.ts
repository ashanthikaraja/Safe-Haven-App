export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  emergencyContacts: string[]; // IDs of contacts
}

export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

export interface SOSAlert {
  id: string;
  userId: string;
  userName: string;
  timestamp: any; // Firestore Timestamp
  location: {
    lat: number;
    lng: number;
  };
  status: 'active' | 'resolved';
  audioUrl?: string;
}

export interface IncidentReport {
  id: string;
  userId: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  type: 'unsafe_street' | 'harassment' | 'suspicious_activity' | 'other';
  description: string;
  imageUrl?: string;
  timestamp: any;
}

export interface NearbyService {
  id: string;
  name: string;
  type: 'police' | 'hospital' | 'fire_station';
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  phone?: string;
  distance?: string;
}
