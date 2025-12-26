# 🔧 Troubleshooting Guide - Pet Feeder IoT System

## Common Issues & Solutions

---

## 🖥️ Backend Issues

### Issue 1: Backend won't start - "npm: command not found"

**Symptom:** Error when running `npm install` or `npm run dev`

**Cause:** Node.js not installed

**Solution:**

```powershell
# Check if Node.js is installed
node --version

# If not installed, download from:
# https://nodejs.org/
# Install LTS version (v18 or higher)
```

---

### Issue 2: Firestore connection failed

**Symptom:** `❌ Firestore Connection Error` in console

**Possible Causes & Solutions:**

**A) Invalid service account JSON:**

```powershell
# Check if service.json exists in backend directory
# Ensure it contains valid JSON with correct credentials
```

**B) Firestore API not enabled:**

```
Solution:
1. Go to Google Cloud Console
2. Select your project
3. Enable Firestore API
4. Wait 2-3 minutes for propagation
```

**C) Wrong project ID:**

```
Solution:
1. Check service.json for correct project_id
2. Verify project exists in Firebase Console
3. Ensure Firestore Database is created
```

---

### Issue 3: Port 5000 already in use

**Symptom:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**

```powershell
# Option 1: Kill process using port 5000
netstat -ano | findstr :5000
# Find PID (last column)
taskkill /PID <PID_NUMBER> /F

# Option 2: Change port in .env
PORT=5001
```

---

### Issue 4: JWT token errors

**Symptom:** `Invalid or expired token` errors

**Solution:**

```powershell
# Check JWT_SECRET in .env
JWT_SECRET=your_secret_key_here_make_it_long_and_random

# Clear browser localStorage
# In browser console:
localStorage.clear()

# Login again to get new token
```

---

## 🎨 Frontend Issues

### Issue 1: Frontend won't start - Module not found

**Symptom:** `Error: Cannot find module 'react'`

**Solution:**

```powershell
cd IOT
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

### Issue 2: Blank white screen

**Symptom:** Browser shows blank page, no errors

**Solution:**

```powershell
# Check browser console (F12)
# Look for specific errors

# Common fixes:
# 1. Clear browser cache (Ctrl + Shift + Delete)
# 2. Restart dev server
# 3. Check if backend is running on port 5000
```

---

### Issue 3: CORS errors

**Symptom:** `Access-Control-Allow-Origin` error in browser console

**Solution:**

```javascript
// In backend/server.js, ensure CORS is configured:
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Or in .env:
FRONTEND_URL=http://localhost:5173
```

---

### Issue 4: API calls failing - 404 errors

**Symptom:** All API requests return 404

**Solution:**

```javascript
// Check src/services/api.js
const API_URL = 'http://localhost:5000/api';

// Ensure backend is running:
curl http://localhost:5000/health
```

---

### Issue 5: Login not working - token not saving

**Symptom:** Can login but immediately redirected back

**Solution:**

```javascript
// Check browser console for errors
// Clear localStorage:
localStorage.clear();

// Check if token is saved:
localStorage.getItem("token");

// Verify backend is returning token:
// Check Network tab in DevTools
```

---

## 🔌 Hardware Issues

### Issue 1: ESP32 won't connect to WiFi

**Symptom:** `Connecting to WiFi......` never ends

**Solution:**

```cpp
// Check WiFi credentials in .ino file:
const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";

// Ensure:
// 1. SSID and password are correct
// 2. WiFi is 2.4GHz (ESP32 doesn't support 5GHz)
// 3. No special characters in password
// 4. WiFi signal is strong enough
```

---

### Issue 2: Servo not moving

**Symptom:** MQTT commands received but servo doesn't move

**Solution:**

```
1. Check wiring:
   - Signal pin → GPIO 18 (ESP32) or Pin 9 (Arduino)
   - VCC → 5V
   - GND → GND

2. Check power supply:
   - Servo needs 5V with sufficient current (>500mA)
   - USB power might not be enough
   - Use external power supply

3. Test servo manually:
   - Upload basic sweep code
   - Verify servo works
```

---

### Issue 3: ESP32 upload fails

**Symptom:** `A fatal error occurred: Failed to connect`

**Solution:**

```
1. Hold BOOT button on ESP32
2. Click Upload in Arduino IDE
3. Release BOOT when "Connecting..." appears

4. Check:
   - Correct COM port selected
   - USB cable supports data (not just power)
   - Driver installed (CP2102/CH340)
```

---

### Issue 4: MQTT not connecting

**Symptom:** `MQTT Connection failed, rc=...`

**Solution:**

```cpp
// Check broker URL:
const char* mqtt_server = "broker.hivemq.com";

// Error codes:
// rc=-4: Connection timeout (check internet)
// rc=-2: Connection refused (check broker URL)
// rc=5: Connection refused (check credentials if using auth)

// Try alternative brokers:
// test.mosquitto.org
// mqtt.eclipse.org
```

---

## 📦 Dependency Issues

### Issue 1: npm install fails

**Symptom:** Errors during `npm install`

**Solution:**

```powershell
# Clear npm cache
npm cache clean --force

# Delete lock files
rm package-lock.json
rm -rf node_modules

# Reinstall
npm install

# If still fails, try:
npm install --legacy-peer-deps
```

---

### Issue 2: Vite build errors

**Symptom:** `Failed to resolve import` or similar

**Solution:**

```powershell
# Check package.json dependencies
# Ensure all listed packages are installed

# Reinstall specific package:
npm install react-router-dom

# Or reinstall all:
rm -rf node_modules
npm install
```

---

## 🔐 Authentication Issues

### Issue 1: Can't register - validation errors

**Symptom:** `Username must be at least 3 characters`

**Solution:**

```
Check requirements:
- Username: 3-30 characters
- Email: Valid email format
- Password: Minimum 6 characters
- All fields required
```

---

### Issue 2: Login fails - "Invalid email or password"

**Symptom:** Correct credentials but can't login

**Solution:**

```powershell
# Check if user exists in database
# Use Firebase Console to check users

# Re-register if needed
# Password might have been hashed incorrectly

# Check backend logs for detailed error
```

---

## 🗄️ Database Issues

### Issue 1: Data not saving

**Symptom:** Can perform actions but data doesn't persist

**Solution:**

```javascript
// Check Firestore connection status
// Look for: ✅ Firestore Connected Successfully

// Verify service account JSON file:
// Ensure it has correct permissions

// Check Firebase Console for data
```

---

### Issue 2: Collections not created

**Symptom:** Empty database in Firebase Console

**Solution:**

```
Firestore creates collections on first insert
Steps:
1. Register a user
2. Create a schedule
3. Check Firebase Console
4. Collections should appear automatically
```

---

## 🌐 Network Issues

### Issue 1: Can't access localhost:5173

**Symptom:** Browser can't load frontend

**Solution:**

```powershell
# Check if Vite is running
# Look for: "Local: http://localhost:5173"

# If port is taken:
# Vite will automatically use next available port
# Check terminal for actual port number

# Firewall might be blocking
# Allow Node.js through Windows Firewall
```

---

### Issue 2: Backend not responding

**Symptom:** Frontend loads but API calls timeout

**Solution:**

```powershell
# Test backend directly:
curl http://localhost:5000/health

# If no response:
# 1. Check if backend is running
# 2. Check port number in .env
# 3. Check firewall settings
```

---

## 📱 Browser Issues

### Issue 1: Dashboard not responsive on mobile

**Symptom:** UI broken on small screens

**Solution:**

```
Open browser DevTools (F12)
Click device toolbar (Ctrl+Shift+M)
Refresh page
CSS media queries should activate
```

---

### Issue 2: LocalStorage not working

**Symptom:** Can't save token, keeps logging out

**Solution:**

```javascript
// Check browser settings:
// Allow cookies and site data

// Test in console:
localStorage.setItem("test", "123");
localStorage.getItem("test");

// Try incognito mode
// Some extensions block localStorage
```

---

## 🔄 General Debugging Steps

### Step 1: Check all services are running

```powershell
# Backend: http://localhost:5000
curl http://localhost:5000/health

# Frontend: http://localhost:5173
# Open in browser

# Firestore: Check Firebase Console
```

---

### Step 2: Check logs

```powershell
# Backend logs: Terminal running npm run dev
# Look for errors in red

# Frontend logs: Browser Console (F12)
# Look for errors in red

# ESP32 logs: Arduino Serial Monitor
# Baud rate: 115200
```

---

### Step 3: Verify environment variables

```powershell
# Backend .env file should exist and contain:
cat backend/.env

# Check all values are set
# No <brackets> in values
# No trailing spaces
```

---

### Step 4: Test API endpoints manually

```powershell
# Health check
Invoke-RestMethod -Uri "http://localhost:5000/health"

# Register user
$body = @{username="test"; email="test@test.com"; password="test123"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```

---

## 🆘 Still Having Issues?

### Debug Checklist:

- [ ] Node.js installed (v18+)
- [ ] Backend dependencies installed (`npm install`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] .env file configured correctly
- [ ] Firestore API enabled in Google Cloud
- [ ] Service account JSON file valid
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Browser console clear of errors
- [ ] Backend terminal clear of errors

---

### Restart Everything:

```powershell
# 1. Stop all servers (Ctrl+C)
# 2. Close all terminals
# 3. Restart in order:

# Terminal 1: Backend
cd IOT/backend
npm run dev

# Terminal 2: Frontend
cd IOT
npm run dev

# Terminal 3: Hardware (if using)
# Open Arduino Serial Monitor
```

---

### Reset Project:

```powershell
# Nuclear option - fresh start:

# 1. Delete node_modules
rm -rf IOT/node_modules
rm -rf IOT/backend/node_modules

# 2. Delete lock files
rm IOT/package-lock.json
rm IOT/backend/package-lock.json

# 3. Reinstall everything
cd IOT/backend
npm install
cd ..
npm install

# 4. Restart servers
```

---

## 📞 Getting Help

### Error Message Format:

When reporting issues, include:

1. Full error message (copy/paste)
2. What you were trying to do
3. Steps you've already tried
4. Operating system
5. Node.js version (`node --version`)
6. Screenshot if applicable

---

### Useful Commands:

```powershell
# Check versions
node --version
npm --version

# Check running processes
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# Test network connectivity
ping google.com
curl http://localhost:5000/health

# View all environment variables
Get-ChildItem Env:
```

---

**💡 Remember:** Most issues are due to:

1. Missing environment variables
2. Services not running
3. Port conflicts
4. Incorrect credentials
5. Network/firewall blocking

**Always check logs first!**

---

_Last Updated: December 2025_