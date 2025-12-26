import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectFirestore } from "./config/firestore.js";
import authRoutes from "./routes/firestore/auth.js";
import scheduleRoutes from "./routes/firestore/schedule.js";
import feedingRoutes from "./routes/firestore/feeding.js";
import { initializeMQTT, getMQTTStatus } from "./controllers/servoController.js";
import { initializeScheduler } from "./utils/scheduler.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Health check route
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "🐾 Pet Feeder API with Firestore is running",
    timestamp: new Date(),
    environment: process.env.NODE_ENV || "development",
    mqtt: getMQTTStatus(), // Add MQTT status to health check
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/feeding", feedingRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error Handler
app.use((error, req, res, next) => {
  console.error("Server Error:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
});

// Start Server
const PORT = process.env.PORT || 5001; // Changed from 5000 to 5001

const startServer = async () => {
  try {
    // Connect to Firestore
    await connectFirestore();

    // Initialize MQTT connection
    initializeMQTT();

    // Initialize automatic feeding scheduler
    initializeScheduler();

    // Start Express server
    app.listen(PORT, () => {
      console.log("");
      console.log("🚀 ============================================");
      console.log("🐶 Pet Feeder IoT System with Firestore Started");
      console.log("🚀 ============================================");
      console.log(`📡 Server: http://localhost:${PORT}`);
      console.log(`🏥 Health: http://localhost:${PORT}/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log("🚀 ============================================");
      console.log("");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;