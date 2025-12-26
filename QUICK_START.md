# 🚀 Quick Start Guide - Pet Feeder IoT System

## ⚡ Fast Setup (5 Minutes)

### 1️⃣ Install Dependencies

**Backend:**

```bash
cd IOT/backend
npm install
```

**Frontend:**

```bash
cd IOT
npm install
```

### 2️⃣ Configure Environment

Create `IOT/backend/.env`:

```env
# Firebase Configuration (from service account JSON)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_CLIENT_ID=your_client_id
JWT_SECRET=change_this_secret_key_12345
PORT=5000
FRONTEND_URL=http://localhost:5173
MQTT_BROKER_URL=mqtt://broker.hivemq.com
MQTT_PORT=1883
```

Also create `IOT/.env` for frontend:

```env
# Firebase Web Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3️⃣ Firebase Setup

1. Go to Firebase Console (https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Firestore Database
4. Go to Project Settings > Service Accounts
5. Generate a new private key and download JSON file
6. Rename to `service.json` and place in `IOT/backend/` directory

### 4️⃣ Start Servers

**Terminal 1 - Backend:**

```bash
cd IOT/backend
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd IOT
npm run dev
```

### 5️⃣ Access Application

Open browser: **http://localhost:5173**

1. Click "Register here"
2. Create account
3. Login
4. Test manual feeding!

---

## 🔌 Hardware Setup (Optional)

### ESP32 Quick Setup:

1. Install Arduino IDE
2. Add ESP32 board support
3. Install libraries: PubSubClient, ESP32Servo, ArduinoJson
4. Open `esp32_code/pet_feeder_esp32.ino`
5. Update WiFi credentials
6. Upload to ESP32
7. Connect servo to GPIO 18

### Arduino Quick Setup:

1. Open `arduino_code/pet_feeder_arduino.ino`
2. Connect servo to Pin 9
3. Upload code
4. Use Serial Monitor for testing

---

## 📝 Test Without Hardware

The system runs in **simulation mode** without ESP32/Arduino connected. You can:

- Create schedules
- Test manual feeding
- View logs in backend console
- Full dashboard functionality

---

## 🎯 Common Commands

```bash
# Start backend
cd IOT/backend && npm run dev

# Start frontend
cd IOT && npm run dev

# Install all dependencies
cd IOT/backend && npm install && cd .. && npm install

# Check backend health
curl http://localhost:5000/health
```

---

## ✅ Verification Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Firestore connection successful
- [ ] Can register new user
- [ ] Can login
- [ ] Dashboard loads
- [ ] Can create schedule
- [ ] Manual feeding works

---

## 🆘 Quick Troubleshooting

**Backend won't start:**

```bash
# Check if port is already in use
netstat -ano | findstr :5000
# Kill process if needed
```

**Frontend errors:**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Firestore connection failed:**

- Check internet connection
- Verify Firebase service account JSON file
- Ensure Firestore API is enabled in Google Cloud Console

---

## 📚 Next Steps

1. Read full documentation: `PROJECT_DOCUMENTATION.md`
2. Test API endpoints with Postman
3. Connect hardware (ESP32/Arduino)
4. Customize UI colors in `src/App.css`
5. Deploy to production

---

**Need Help?** Check the full documentation for detailed guides!

🎉 **Happy Coding!**