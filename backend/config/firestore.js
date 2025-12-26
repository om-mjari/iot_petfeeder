import admin from "firebase-admin";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load service account key
const serviceAccountPath = path.join(__dirname, "..", "service.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

dotenv.config();

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

const connectFirestore = async () => {
  try {
    // Test the connection
    await db.collection("test").limit(1).get();
    console.log("✅ Firestore Connected Successfully");
    return db;
  } catch (error) {
    console.error("❌ Firestore Connection Error:", error.message);
    process.exit(1);
  }
};

export { db, connectFirestore };