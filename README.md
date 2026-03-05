<div align="center">
<img width="1200" height="475" alt="Safe Haven Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Safe Haven – Personal Safety & Emergency Assistance App 🚨

Safe Haven is a modern safety-focused web/mobile application designed to help users quickly request help during emergency situations. The platform enables users to trigger SOS alerts, share live location with trusted contacts, and access nearby emergency services instantly.

This project demonstrates how **AI, real-time location tracking, and cloud technologies** can be combined to create a smart personal safety system.

---

# Features

🚨 **Emergency SOS Alert**
Send instant emergency alerts to trusted contacts with your real-time location.

📍 **Live Location Sharing**
Share GPS location so friends or family can track your safety.

📞 **Emergency Contacts Management**
Add, edit, or remove trusted contacts who will receive alerts.

🗺 **Nearby Emergency Services**
Locate nearby hospitals, police stations, and fire stations.

⏱ **Safety Timer**
Automatically trigger an SOS alert if the user fails to confirm safety within a specified time.

📝 **Incident Reporting**
Users can report unsafe areas or suspicious incidents to improve community awareness.

🤖 **AI Integration**
Uses Google Gemini AI to enhance app intelligence and future safety features.

---

# Tech Stack

Frontend

* React + Vite

Backend / AI

* Google AI Studio
* Gemini API

Cloud Services

* Firebase Authentication
* Firestore Database
* Firebase Cloud Messaging

Maps & Location

* Google Maps API

---

# Run and Deploy the App

This repository contains everything needed to run the application locally.

View the project in AI Studio:
https://ai.studio/apps/cc71cba6-be76-4d09-86f5-ade1e499acd2

---

# Run Locally

## Prerequisites

* Node.js (latest LTS recommended)

## Installation

1. Clone the repository

git clone https://github.com/yourusername/safe-haven-app.git

2. Navigate to the project folder

cd safe-haven-app

3. Install dependencies

npm install

4. Create a `.env.local` file and add the following environment variables

GEMINI_API_KEY=your_gemini_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

5. Start the development server

npm run dev

The app will now run locally.

---

# Project Purpose

Safe Haven was developed as a technology project focused on improving **personal safety using modern cloud technologies, AI capabilities, and real-time communication systems**.

---

# Future Improvements

• Voice-activated SOS detection
• AI-based danger prediction
• Wearable device integration
• Community safety heatmaps
• Offline emergency alerts

---

# License

This project is for educational and research purposes.
