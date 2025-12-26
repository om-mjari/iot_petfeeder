# Firestore Integration for IoT Pet Feeder

This document explains how to set up and use Firestore as the real-time database for the IoT Pet Feeder system.

## Table of Contents
- [Overview](#overview)
- [Setup Instructions](#setup-instructions)
- [Firestore Data Structure](#firestore-data-structure)
- [Real-time Features](#real-time-features)
- [API Endpoints](#api-endpoints)

## Overview

The IoT Pet Feeder now supports Google Firestore as an alternative to MongoDB for real-time data synchronization. This enables:

- Real-time updates to the dashboard without page refresh
- Instantaneous synchronization across multiple devices
- Better scalability for handling concurrent users
- Enhanced offline capabilities

## Setup Instructions

### 1. Firebase Project Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Firestore Database
4. Go to Project Settings > Service Accounts
5. Generate a new private key and download the JSON file
6. Rename the file to `service.json` and place it in the `backend/` directory

### 2. Environment Variables

Update your `.env` files with your Firebase configuration:

**Backend (.env in backend/ directory):**
```
# Firebase Configuration (from service account JSON)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_CLIENT_ID=your_client_id
```

**Frontend (.env in root directory):**
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Starting the Application

1. Install dependencies:
   ```
   cd backend
   npm install
   
   cd ..
   npm install
   ```

2. Start the backend server with Firestore:
   ```
   cd backend
   node server_firestore.js
   ```

3. Start the frontend:
   ```
   npm run dev
   ```

## Firestore Data Structure

The application uses three main collections in Firestore:

### Users Collection
```
users/
  {userId}/
    username: string
    email: string
    password: string (hashed)
    petName: string
    createdAt: timestamp
    updatedAt: timestamp
```

### Feeding Schedules Collection
```
feedingSchedules/
  {scheduleId}/
    userId: string (reference)
    feedingTime: string (HH:MM format)
    isActive: boolean
    repeatDaily: boolean
    portionSize: string (small|medium|large)
    lastTriggered: timestamp
    createdAt: timestamp
    updatedAt: timestamp
```

### Feeding Logs Collection
```
feedingLogs/
  {logId}/
    userId: string (reference)
    scheduleId: string (reference, optional)
    action: string (Food Dispensed|Manual Feed|Scheduled Feed|Feed Stopped|System Error)
    status: string (success|failed|in-progress)
    portionSize: string (small|medium|large)
    servoAngle: number
    triggerType: string (manual|scheduled|automatic)
    errorMessage: string (optional)
    timestamp: timestamp
    createdAt: timestamp
    updatedAt: timestamp
```

## Real-time Features

The Firestore integration enables several real-time features:

1. **Live Schedule Updates**: Changes to feeding schedules appear instantly across all connected devices
2. **Real-time Feeding Logs**: Feeding activities are immediately visible in the history tab
3. **Instant Status Updates**: Device status changes are reflected in real-time
4. **Multi-user Sync**: Multiple users can view the same data simultaneously

## API Endpoints

The Firestore-enabled backend provides the same API endpoints as the MongoDB version:

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Scheduling
- `POST /api/schedule/create` - Create a new feeding schedule
- `GET /api/schedule/list` - Get all feeding schedules for user
- `PUT /api/schedule/update/:id` - Update a feeding schedule
- `DELETE /api/schedule/delete/:id` - Delete a feeding schedule

### Feeding Control
- `POST /api/feeding/activate` - Activate servo motor for feeding
- `POST /api/feeding/stop` - Stop servo motor
- `GET /api/feeding/logs` - Get feeding logs for user
- `GET /api/feeding/status` - Get current feeding system status

All endpoints maintain the same request/response format as the original MongoDB version.