# 📚 IoT Pet Feeder - Project Documentation

## 📖 Table of Contents
- [Overview](#-overview)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Database Schema](#-database-schema)
- [API Documentation](#-api-documentation)
- [Frontend Components](#-frontend-components)
- [Backend Structure](#-backend-structure)
- [Hardware Integration](#-hardware-integration)
- [Deployment Guide](#-deployment-guide)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Overview

The **IoT Automatic Pet Feeder** is a comprehensive smart pet care solution that enables remote pet feeding through a web-based dashboard. This system combines modern web technologies with IoT hardware to provide automated scheduling, manual food dispensing, real-time monitoring, and complete activity logging.

### 🔧 Core Features

1. **Secure Authentication**
   - JWT-based authentication with protected routes
   - Password encryption using bcrypt
   - Session management

2. **Automated Scheduling**
   - Recurring feeding schedules
   - Customizable portion sizes
   - Daily repetition options

3. **Manual Control**
   - Instant food dispensing
   - Three portion sizes (small, medium, large)
   - Emergency stop functionality

4. **Real-time Monitoring**
   - Live status updates via MQTT
   - Real-time data synchronization
   - Device connectivity indicators

5. **Activity Tracking**
   - Complete feeding history
   - Timestamped logs
   - Success/failure status tracking

6. **Responsive UI**
   - Modern React dashboard
   - Dark mode theme
   - Mobile-friendly design

---

## 🏗️ Architecture

### 🔄 System Flow

```
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   React Web     │    │   Node.js API    │    │  IoT Device      │
│   Dashboard     │◄──►│   (Express)      │◄──►│  (ESP32/Arduino) │
└─────────────────┘    └──────────────────┘    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Google Firestore │
                    │ (Real-time DB)   │
                    └──────────────────┘
```

### 🔌 Communication Protocols

1. **HTTP/HTTPS**: Web dashboard ↔ API server
2. **MQTT**: API server ↔ IoT device
3. **WebSocket**: Real-time updates (via Firestore)

---

## ⚡ Tech Stack

### Frontend
- **React 18** with Hooks
- **Vite** for fast development
- **CSS3** with modern styling
- **Axios** for HTTP requests
- **Firebase SDK** for real-time updates

### Backend
- **Node.js** with Express.js
- **Google Firestore** (Real-time Database)
- **Firebase Admin SDK**
- **MQTT Protocol** for device communication
- **JWT** for authentication
- **Bcrypt** for password hashing

### Hardware
- **ESP32** or **Arduino** microcontroller
- **SG90 Servo Motor**
- **MQTT Broker** for communication

### DevOps
- **Git** for version control
- **VS Code** as primary IDE
- **Postman** for API testing
- **Firebase Console** for database management

---

## 🗄️ Database Schema

### Firestore Collections Structure

#### Users Collection
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

#### Feeding Schedules Collection
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

#### Feeding Logs Collection
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

### 🔐 Security Rules

Firestore security rules ensure data privacy and integrity:
- Users can only read/write their own data
- Authentication required for all operations
- Data validation on server-side

---

## 🌐 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```
POST /auth/register
```
**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "petName": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "jwt_token",
    "user": {
      "id": "user_id",
      "username": "string",
      "email": "string",
      "petName": "string"
    }
  }
}
```

#### Login User
```
POST /auth/login
```
**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token",
    "user": {
      "id": "user_id",
      "username": "string",
      "email": "string",
      "petName": "string"
    }
  }
}
```

### Schedule Endpoints

#### Create Schedule
```
POST /schedule/create
```
**Headers:**
```
Authorization: Bearer jwt_token
```

**Request Body:**
```json
{
  "feedingTime": "HH:MM",
  "portionSize": "small|medium|large",
  "isActive": boolean,
  "repeatDaily": boolean
}
```

#### List Schedules
```
GET /schedule/list
```
**Headers:**
```
Authorization: Bearer jwt_token
```

#### Update Schedule
```
PUT /schedule/update/{id}
```
**Headers:**
```
Authorization: Bearer jwt_token
```

**Request Body:**
```json
{
  "feedingTime": "HH:MM",
  "portionSize": "small|medium|large",
  "isActive": boolean,
  "repeatDaily": boolean
}
```

#### Delete Schedule
```
DELETE /schedule/delete/{id}
```
**Headers:**
```
Authorization: Bearer jwt_token
```

### Feeding Endpoints

#### Activate Feeding
```
POST /feeding/activate
```
**Headers:**
```
Authorization: Bearer jwt_token
```

**Request Body:**
```json
{
  "portionSize": "small|medium|large",
  "scheduleId": "string (optional)"
}
```

#### Stop Feeding
```
POST /feeding/stop
```
**Headers:**
```
Authorization: Bearer jwt_token
```

#### Get Feeding Logs
```
GET /feeding/logs?limit=number
```
**Headers:**
```
Authorization: Bearer jwt_token
```

#### Get System Status
```
GET /feeding/status
```
**Headers:**
```
Authorization: Bearer jwt_token
```

---

## 🎨 Frontend Components

### Component Hierarchy

```
App.jsx
├── Login.jsx
├── Register.jsx
└── Dashboard.jsx
    ├── Control Panel
    ├── Schedule Manager
    └── History Viewer
```

### Dashboard Features

1. **Control Panel**
   - Manual feeding buttons
   - Portion size selection
   - Emergency stop button

2. **Schedule Manager**
   - Create new schedules
   - View existing schedules
   - Toggle schedule status
   - Delete schedules

3. **History Viewer**
   - Feeding activity logs
   - Status indicators
   - Timestamp information

### State Management

The frontend uses React's built-in state management with:
- `useState` for component state
- `useEffect` for side effects
- `useNavigate` for routing
- Context API for global state (if needed)

---

## ⚙️ Backend Structure

### Directory Layout

```
backend/
├── config/           # Firestore configuration
├── controllers/      # Request handlers
├── middleware/       # Auth middleware
├── models/           # Firestore data models
├── routes/           # API routes
├── services/         # Business logic
├── utils/            # Utility functions
├── .env              # Environment variables
├── server.js         # Entry point
└── service.json      # Firebase service account
```

### Key Modules

1. **Authentication System**
   - User registration and login
   - JWT token generation
   - Password hashing

2. **Schedule Management**
   - CRUD operations for schedules
   - Validation and sanitization
   - Real-time updates

3. **Feeding Control**
   - Manual feeding activation
   - Scheduled feeding automation
   - MQTT communication

4. **Logging System**
   - Activity tracking
   - Error logging
   - Status monitoring

---

## 🤖 Hardware Integration

### Supported Platforms

1. **ESP32**
   - WiFi connectivity
   - MQTT client library
   - Servo control

2. **Arduino**
   - Ethernet/WiFi shield
   - PubSubClient library
   - Servo library

### Circuit Diagram

```
ESP32/Arduino
├── GPIO 18 ──── Servo Signal
├── 5V ───────── Servo VCC
├── GND ──────── Servo GND
├── WiFi ─────── Router
└── MQTT ─────── Broker
```

### Code Structure

```
esp32_code/
├── main.ino          # Main program
├── wifi_config.h     # WiFi credentials
├── mqtt_config.h     # MQTT settings
└── servo_control.h   # Servo functions
```

### Communication Flow

1. **Device Startup**
   - Connect to WiFi
   - Connect to MQTT broker
   - Subscribe to control topics

2. **Command Reception**
   - Listen for feeding commands
   - Validate command structure
   - Execute servo movement

3. **Status Reporting**
   - Send confirmation messages
   - Report errors if any
   - Update device status

---

## ☁️ Deployment Guide

### Prerequisites

1. **Node.js** v16+
2. **Firebase Account**
3. **MQTT Broker** (public or private)
4. **Domain** (optional for production)

### Backend Deployment

1. **Environment Setup**
   ```bash
   # Clone repository
   git clone <repository-url>
   cd iot/backend
   
   # Install dependencies
   npm install
   
   # Configure Firebase
   # Place service account JSON as service.json
   ```

2. **Configuration**
   ```bash
   # Create .env file
   cp .env.example .env
   
   # Edit environment variables
   nano .env
   ```

3. **Start Server**
   ```bash
   # Production
   npm start
   
   # Development
   npm run dev
   ```

### Frontend Deployment

1. **Build Process**
   ```bash
   # Navigate to root
   cd ../
   
   # Install dependencies
   npm install
   
   # Build for production
   npm run build
   ```

2. **Serve Files**
   - Use any static file server
   - Deploy to hosting platform (Vercel, Netlify, etc.)

### Firebase Configuration

1. **Project Setup**
   - Create Firebase project
   - Enable Firestore Database
   - Generate service account key

2. **Security Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /feedingSchedules/{scheduleId} {
         allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
       }
       match /feedingLogs/{logId} {
         allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
       }
     }
   }
   ```

### Production Considerations

1. **Security**
   - Use HTTPS
   - Implement rate limiting
   - Add input validation
   - Secure environment variables

2. **Performance**
   - Enable compression
   - Use CDN for static assets
   - Optimize database queries
   - Implement caching

3. **Monitoring**
   - Set up logging
   - Monitor API usage
   - Track error rates
   - Set up alerts

---

## 🔧 Troubleshooting

### Common Issues

#### Firestore Connection Failed
**Problem:** Unable to connect to Firestore database
**Solution:**
1. Verify service account JSON file
2. Check Firebase project ID
3. Ensure Firestore API is enabled
4. Validate network connectivity

#### Authentication Errors
**Problem:** Login/Register failing with 401/403
**Solution:**
1. Check JWT secret in .env
2. Verify user credentials
3. Ensure proper headers in requests
4. Check Firebase auth configuration

#### MQTT Connection Issues
**Problem:** Device unable to connect to MQTT broker
**Solution:**
1. Verify broker URL and port
2. Check WiFi credentials
3. Confirm broker accessibility
4. Review firewall settings

#### Real-time Updates Not Working
**Problem:** Dashboard not updating in real-time
**Solution:**
1. Check Firebase client configuration
2. Verify Firestore rules
3. Ensure proper subscription setup
4. Test with Firebase Console

### Debugging Tips

1. **Check Logs**
   - Server console output
   - Browser developer tools
   - Firebase Console logs

2. **Test Endpoints**
   - Use Postman to test APIs
   - Verify request/response format
   - Check authentication headers

3. **Validate Configuration**
   - Environment variables
   - Firebase settings
   - Network connectivity

### Support Resources

1. **Documentation**
   - Firebase Docs
   - React Documentation
   - Express.js Guide
   - MQTT Protocol Spec

2. **Community**
   - Stack Overflow
   - GitHub Issues
   - Discord Communities
   - Reddit Forums

---

## 📜 References & Resources

### Documentation Used
- Firebase Official Documentation
- React Documentation
- Express.js Guide
- MQTT Protocol Specification
- ESP32 Arduino Core
- JWT RFC 7519 Standard

### Libraries & Frameworks
- express: ^4.18.2
- firebase-admin: ^11.0.0
- firebase: ^9.0.0
- jsonwebtoken: ^9.0.2
- bcryptjs: ^2.4.3
- react: ^18.2.0
- axios: ^1.6.5
- mqtt: ^5.3.0

---

<div align="center">

**🎉 Happy Coding!**

Made with ❤️ for pet lovers and IoT enthusiasts

</div>