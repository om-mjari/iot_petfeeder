import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load service account key
const serviceAccountPath = path.join(__dirname, "service.json");
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

console.log("Service Account Project ID:", serviceAccount.project_id);

// Initialize Firebase Admin SDK with explicit project ID
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id
});

// Note: We can't create a Firestore database programmatically
// This needs to be done through the Firebase Console

console.log("Please ensure you have created the Firestore database in the Firebase Console:");
console.log("1. Go to https://console.firebase.google.com/");
console.log("2. Select your project (petfeeder-b0206)");
console.log("3. Click on 'Firestore Database' in the left sidebar");
console.log("4. Click 'Create database'");
console.log("5. Select 'Start in test mode'");
console.log("6. Choose a location and click 'Enable'");
console.log("");
console.log("After creating the database, run this script again.");

const db = admin.firestore();

console.log("Attempting to connect to Firestore...");

// Enable logging to see what's happening
admin.firestore.setLogFunction((msg) => {
  console.log("[Firestore Log]:", msg);
});

try {
  console.log("Testing Firestore connection...");
  
  // Try to list collections first
  const collections = await db.listCollections();
  console.log("Available collections:", collections.length);
  
  // Test the connection by creating a test collection
  const testDoc = await db.collection("test").add({
    test: "connection",
    timestamp: new Date()
  });
  
  console.log("✅ Firestore Connected Successfully!");
  console.log("Test document created with ID:", testDoc.id);
  
  // Clean up test document
  await testDoc.delete();
  console.log("Test document cleaned up");
  
} catch (error) {
  console.error("❌ Firestore Connection Error:");
  console.error("Code:", error.code);
  console.error("Message:", error.message);
  console.error("Details:", error.details);
  if (error.stack) {
    console.error("Stack:", error.stack);
  }
}