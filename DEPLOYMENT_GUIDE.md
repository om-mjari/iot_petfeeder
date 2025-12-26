# 🚀 IoT Pet Feeder - Deployment Guide

This guide will help you deploy your IoT Pet Feeder application to production using free hosting services.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Deployment (Render)](#backend-deployment)
3. [Frontend Deployment (Vercel)](#frontend-deployment)
4. [Alternative: Netlify for Frontend](#alternative-netlify)
5. [Environment Variables Setup](#environment-variables)
6. [Post-Deployment Configuration](#post-deployment)
7. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

Before deploying, ensure you have:

- ✅ GitHub account with your code pushed to repository
- ✅ Firebase project set up with Firestore enabled
- ✅ Firebase service account credentials
- ✅ All environment variables ready

---

## 🖥️ Backend Deployment (Render)

### Step 1: Create Render Account

1. Go to [Render.com](https://render.com/)
2. Sign up using your GitHub account
3. Authorize Render to access your repositories

### Step 2: Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `om-mjari/iot_petfeeder`
3. Configure the service:
   - **Name**: `iot-petfeeder-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

### Step 3: Add Environment Variables

In the Render dashboard, add these environment variables:

```env
NODE_ENV=production
PORT=10000
JWT_SECRET=your_secure_random_string_here_change_this

# Firebase Configuration (from your backend/.env file)
FIREBASE_PROJECT_ID=petfeeder-b0206
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY=your_private_key_with_newlines
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@petfeeder-b0206.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id

# MQTT Configuration
MQTT_BROKER_URL=mqtt://broker.hivemq.com
MQTT_PORT=1883
MQTT_TOPIC=petfeeder/servo

# Frontend URL (update after frontend deployment)
FRONTEND_URL=https://your-frontend-url.vercel.app
```

**Important Notes:**
- For `FIREBASE_PRIVATE_KEY`, copy the entire key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Keep the `\n` characters in the private key
- Generate a strong `JWT_SECRET` (you can use: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Wait for the build to complete (3-5 minutes)
3. Once deployed, copy your backend URL (e.g., `https://iot-petfeeder-backend.onrender.com`)

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Create Vercel Account

1. Go to [Vercel.com](https://vercel.com/)
2. Sign up using your GitHub account
3. Authorize Vercel to access your repositories

### Step 2: Import Project

1. Click **"Add New..."** → **"Project"**
2. Import your repository: `om-mjari/iot_petfeeder`
3. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 3: Add Environment Variables

Add these environment variables in Vercel:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=petfeeder-b0206.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=petfeeder-b0206
VITE_FIREBASE_STORAGE_BUCKET=petfeeder-b0206.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=https://iot-petfeeder-backend.onrender.com
```

**Note**: Replace the backend URL with your actual Render backend URL from Step 4 above.

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for deployment (1-2 minutes)
3. Once deployed, you'll get a URL like `https://iot-petfeeder.vercel.app`

### Step 5: Update Backend CORS

Go back to Render and update the `FRONTEND_URL` environment variable with your Vercel URL:

```env
FRONTEND_URL=https://iot-petfeeder.vercel.app
```

Then redeploy the backend service.

---

## 🔄 Alternative: Netlify for Frontend

If you prefer Netlify over Vercel:

### Step 1: Create Netlify Account

1. Go to [Netlify.com](https://www.netlify.com/)
2. Sign up using your GitHub account

### Step 2: Deploy

1. Click **"Add new site"** → **"Import an existing project"**
2. Choose GitHub and select your repository
3. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Base directory**: Leave empty

### Step 3: Environment Variables

Go to **Site settings** → **Environment variables** and add:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=petfeeder-b0206.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=petfeeder-b0206
VITE_FIREBASE_STORAGE_BUCKET=petfeeder-b0206.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=https://iot-petfeeder-backend.onrender.com
```

### Step 4: Redeploy

Click **"Trigger deploy"** to rebuild with environment variables.

---

## 🔐 Environment Variables Setup

### Getting Firebase Credentials

#### For Frontend (Web Config):

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`petfeeder-b0206`)
3. Click ⚙️ → **Project settings**
4. Scroll to **Your apps** → Select your web app
5. Copy the config values:
   - `apiKey` → `VITE_FIREBASE_API_KEY`
   - `authDomain` → `VITE_FIREBASE_AUTH_DOMAIN`
   - `projectId` → `VITE_FIREBASE_PROJECT_ID`
   - `storageBucket` → `VITE_FIREBASE_STORAGE_BUCKET`
   - `messagingSenderId` → `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `appId` → `VITE_FIREBASE_APP_ID`

#### For Backend (Service Account):

1. In Firebase Console → ⚙️ → **Project settings**
2. Go to **Service accounts** tab
3. Click **"Generate new private key"**
4. Download the JSON file
5. Extract values:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `private_key_id` → `FIREBASE_PRIVATE_KEY_ID`
   - `private_key` → `FIREBASE_PRIVATE_KEY`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `client_id` → `FIREBASE_CLIENT_ID`

---

## ✅ Post-Deployment Configuration

### 1. Update API URL in Frontend

If you didn't set `VITE_API_URL` during deployment, update your frontend code:

**File**: `src/services/api.js`

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://iot-petfeeder-backend.onrender.com';
```

### 2. Configure CORS in Backend

Ensure your backend allows requests from your frontend domain.

**File**: `backend/server.js` (should already be configured via `FRONTEND_URL` env var)

### 3. Test the Deployment

1. Visit your frontend URL
2. Try to register/login
3. Test manual feeding
4. Create a schedule
5. Check feeding logs

### 4. Update ESP32/Arduino Code

Update your hardware code with the production backend URL:

```cpp
const char* serverUrl = "https://iot-petfeeder-backend.onrender.com";
```

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: "Application failed to respond"
- **Solution**: Check Render logs for errors
- Verify all environment variables are set correctly
- Ensure Firebase credentials are valid

**Problem**: CORS errors
- **Solution**: Update `FRONTEND_URL` in backend environment variables
- Redeploy backend after updating

### Frontend Issues

**Problem**: "Failed to fetch" or API errors
- **Solution**: Check if `VITE_API_URL` is set correctly
- Verify backend is running and accessible
- Check browser console for specific errors

**Problem**: Firebase connection errors
- **Solution**: Verify all Firebase environment variables
- Check Firebase project settings
- Ensure Firestore is enabled

### General Issues

**Problem**: Environment variables not working
- **Solution**: Redeploy after adding/updating variables
- For Vite, ensure variables start with `VITE_`
- Check for typos in variable names

**Problem**: Build failures
- **Solution**: Check build logs for specific errors
- Ensure `package.json` has correct scripts
- Verify Node.js version compatibility

---

## 📊 Monitoring Your Deployment

### Render (Backend)

- View logs: Dashboard → Your service → Logs
- Monitor metrics: Dashboard → Your service → Metrics
- Check health: Your backend URL should return a response

### Vercel/Netlify (Frontend)

- View deployments: Project → Deployments
- Check analytics: Project → Analytics
- Monitor errors: Project → Logs

---

## 🔄 Continuous Deployment

Both Render and Vercel/Netlify support automatic deployments:

1. **Push to GitHub**: Any push to `main` branch triggers deployment
2. **Pull Requests**: Preview deployments for PRs
3. **Rollback**: Easy rollback to previous deployments

---

## 🎉 Success!

Your IoT Pet Feeder is now live! 

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`

Share your project and start feeding your pets remotely! 🐶🐱

---

## 📝 Next Steps

1. ✅ Set up custom domain (optional)
2. ✅ Configure SSL certificates (automatic on Vercel/Render)
3. ✅ Set up monitoring and alerts
4. ✅ Add analytics
5. ✅ Create user documentation

---

## 🆘 Need Help?

- Check [Render Documentation](https://render.com/docs)
- Check [Vercel Documentation](https://vercel.com/docs)
- Review your project's GitHub Issues
- Firebase [Support](https://firebase.google.com/support)

---

**Happy Deploying! 🚀**
