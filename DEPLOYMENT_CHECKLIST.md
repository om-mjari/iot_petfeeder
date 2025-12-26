# 🚀 Quick Deployment Checklist

Use this checklist to deploy your IoT Pet Feeder application step by step.

## ✅ Pre-Deployment Checklist

- [ ] Code pushed to GitHub repository
- [ ] Firebase project created and Firestore enabled
- [ ] Firebase service account key downloaded
- [ ] All local environment variables documented

---

## 🖥️ Backend Deployment (Render.com)

### Step 1: Sign Up & Connect
- [ ] Create account at [Render.com](https://render.com/)
- [ ] Connect your GitHub account
- [ ] Authorize access to `om-mjari/iot_petfeeder` repository

### Step 2: Create Web Service
- [ ] Click "New +" → "Web Service"
- [ ] Select `om-mjari/iot_petfeeder` repository
- [ ] Configure settings:
  - Name: `iot-petfeeder-backend`
  - Root Directory: `backend`
  - Runtime: `Node`
  - Build Command: `npm install`
  - Start Command: `npm start`
  - Plan: `Free`

### Step 3: Environment Variables
Add these in Render dashboard:

```
✅ NODE_ENV=production
✅ PORT=10000
✅ JWT_SECRET=[generate using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]
✅ FIREBASE_PROJECT_ID=[from Firebase]
✅ FIREBASE_PRIVATE_KEY_ID=[from service account JSON]
✅ FIREBASE_PRIVATE_KEY=[from service account JSON - keep \n characters]
✅ FIREBASE_CLIENT_EMAIL=[from service account JSON]
✅ FIREBASE_CLIENT_ID=[from service account JSON]
✅ MQTT_BROKER_URL=mqtt://broker.hivemq.com
✅ MQTT_PORT=1883
✅ MQTT_TOPIC=petfeeder/servo
✅ FRONTEND_URL=[will update after frontend deployment]
```

### Step 4: Deploy
- [ ] Click "Create Web Service"
- [ ] Wait for build to complete (3-5 minutes)
- [ ] Copy backend URL: `https://iot-petfeeder-backend.onrender.com`
- [ ] Test backend: Visit `[YOUR_BACKEND_URL]/api/health` (if you have a health endpoint)

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Sign Up & Connect
- [ ] Create account at [Vercel.com](https://vercel.com/)
- [ ] Connect your GitHub account
- [ ] Authorize access to repositories

### Step 2: Import Project
- [ ] Click "Add New..." → "Project"
- [ ] Import `om-mjari/iot_petfeeder`
- [ ] Configure:
  - Framework: `Vite`
  - Root Directory: `./`
  - Build Command: `npm run build`
  - Output Directory: `dist`

### Step 3: Environment Variables
Add these in Vercel:

```
✅ VITE_FIREBASE_API_KEY=[from Firebase web config]
✅ VITE_FIREBASE_AUTH_DOMAIN=petfeeder-b0206.firebaseapp.com
✅ VITE_FIREBASE_PROJECT_ID=petfeeder-b0206
✅ VITE_FIREBASE_STORAGE_BUCKET=petfeeder-b0206.appspot.com
✅ VITE_FIREBASE_MESSAGING_SENDER_ID=[from Firebase web config]
✅ VITE_FIREBASE_APP_ID=[from Firebase web config]
✅ VITE_API_URL=https://iot-petfeeder-backend.onrender.com/api
```

### Step 4: Deploy
- [ ] Click "Deploy"
- [ ] Wait for deployment (1-2 minutes)
- [ ] Copy frontend URL: `https://iot-petfeeder.vercel.app`

---

## 🔄 Post-Deployment Configuration

### Update Backend CORS
- [ ] Go back to Render dashboard
- [ ] Update `FRONTEND_URL` environment variable with your Vercel URL
- [ ] Redeploy backend service

### Test Your Application
- [ ] Visit your frontend URL
- [ ] Test user registration
- [ ] Test user login
- [ ] Test manual feeding
- [ ] Create a feeding schedule
- [ ] Check feeding logs
- [ ] Verify real-time updates

### Update Hardware (ESP32/Arduino)
- [ ] Update server URL in your ESP32/Arduino code
- [ ] Change from `http://localhost:5000` to your Render backend URL
- [ ] Re-upload code to your device
- [ ] Test device connectivity

---

## 📝 Important URLs to Save

```
Backend URL: https://iot-petfeeder-backend.onrender.com
Frontend URL: https://iot-petfeeder.vercel.app
GitHub Repo: https://github.com/om-mjari/iot_petfeeder
Firebase Console: https://console.firebase.google.com/project/petfeeder-b0206
```

---

## 🐛 Common Issues & Solutions

### Issue: Backend not responding
- **Check**: Render logs for errors
- **Fix**: Verify all environment variables are set
- **Fix**: Ensure Firebase credentials are correct

### Issue: CORS errors
- **Check**: `FRONTEND_URL` in backend matches your Vercel URL
- **Fix**: Update and redeploy backend

### Issue: Frontend can't connect to backend
- **Check**: `VITE_API_URL` is set correctly in Vercel
- **Fix**: Ensure it includes `/api` at the end
- **Fix**: Redeploy frontend after updating

### Issue: Firebase errors
- **Check**: All Firebase environment variables are set
- **Fix**: Verify Firestore is enabled in Firebase Console
- **Fix**: Check Firebase rules allow read/write

---

## 🎉 Deployment Complete!

Once all checkboxes are marked:

✅ Your backend is live on Render
✅ Your frontend is live on Vercel
✅ CORS is configured correctly
✅ All features are tested
✅ Hardware is updated

**Your IoT Pet Feeder is now accessible from anywhere in the world!** 🌍

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Full Deployment Guide](./DEPLOYMENT_GUIDE.md)

---

**Need help? Check the detailed [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for step-by-step instructions!**
