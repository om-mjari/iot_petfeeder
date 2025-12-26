# IoT Automatic Pet Feeder System

<p align="center">
  <img src="./src/assets/logo.png" alt="Pet Feeder Logo" width="200"/>
</p>

## 🐶 Overview

The **IoT Automatic Pet Feeder** is a full-stack system that enables remote pet feeding through a web dashboard. Leveraging modern web technologies and real-time cloud database capabilities, this system provides automated scheduling, manual food dispensing with portion control, real-time monitoring, and complete activity logging.

## 🌟 Key Features

- **🔐 Secure Authentication**: JWT-based authentication with protected routes
- **⏰ Automated Scheduling**: Set recurring feeding times with customizable portions
- **🎮 Manual Control**: Instant food dispensing with three portion sizes (small, medium, large)
- **📡 Real-time Updates**: Live status updates via MQTT protocol
- **📊 Activity Tracking**: Complete feeding history with timestamps and status
- **📱 Responsive UI**: Modern React dashboard with dark mode theme
- **🔥 Real-time Database**: Powered by Google Firestore for instant data synchronization

## 🏗️ Architecture

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

## 🚀 Tech Stack

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

## 📁 Project Structure

```
iot/
├── backend/
│   ├── config/           # Firestore configuration
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Auth middleware
│   ├── models/           # Firestore data models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── utils/            # Utility functions
│   ├── .env              # Environment variables
│   ├── server.js         # Entry point
│   └── service.json      # Firebase service account
├── src/
│   ├── components/       # React components
│   ├── config/           # Firebase client config
│   ├── services/         # API services
│   ├── App.jsx           # Main App component
│   └── main.jsx          # Entry point
├── esp32_code/           # Microcontroller code
├── arduino_code/         # Arduino alternative
├── .env                  # Frontend environment
├── package.json          # Dependencies
└── vite.config.js        # Vite configuration
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js v16+
- Firebase Account
- MQTT Broker (optional for device communication)

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Firebase**:
   - Create a Firebase project
   - Enable Firestore Database
   - Generate a service account key
   - Rename the downloaded JSON file to `service.json` and place in `backend/`

4. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Start the server**:
   ```bash
   npm start
   # or for development
   npm run dev
   ```

### Frontend Setup

1. **Navigate to root directory**:
   ```bash
   cd ..
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Firebase**:
   - In Firebase Console, add a web app
   - Copy the Firebase config
   - Update `.env` with your Firebase web config

4. **Start the development server**:
   ```bash
   npm run dev
   ```

### Hardware Setup

1. **Flash the microcontroller**:
   - Upload code from `esp32_code/` or `arduino_code/`
   - Update WiFi and MQTT credentials

2. **Connect the servo motor**:
   - Attach SG90 servo to specified pins
   - Ensure proper power supply

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Scheduling
- `POST /api/schedule/create` - Create feeding schedule
- `GET /api/schedule/list` - List all schedules
- `PUT /api/schedule/update/:id` - Update schedule
- `DELETE /api/schedule/delete/:id` - Delete schedule

### Feeding Control
- `POST /api/feeding/activate` - Manual feeding
- `POST /api/feeding/stop` - Stop feeding
- `GET /api/feeding/logs` - Get feeding logs
- `GET /api/feeding/status` - Get device status

## 📊 Real-time Features

- **Live Schedule Updates**: Changes appear instantly across all devices
- **Real-time Feeding Logs**: Activity tracking with immediate updates
- **Instant Status Sync**: Device status reflected in real-time
- **Multi-user Support**: Concurrent access with synchronized data

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Firebase for real-time database capabilities
- React team for the amazing library
- Express.js community for the robust framework
- ESP32/Arduino communities for hardware support