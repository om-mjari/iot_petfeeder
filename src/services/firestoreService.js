// Firestore Service for Frontend
import { db } from "../config/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

// Get user's feeding schedules in real-time
export const subscribeToSchedules = (userId, callback) => {
  try {
    const q = query(
      collection(db, "feedingSchedules"),
      where("userId", "==", userId),
      orderBy("feedingTime")
    );

    return onSnapshot(q, (snapshot) => {
      const schedules = [];
      snapshot.forEach((doc) => {
        schedules.push({ id: doc.id, ...doc.data() });
      });
      callback(schedules);
    }, (error) => {
      console.error("Error subscribing to schedules:", error);
      // Check if it's an index error
      if (error.code === 'failed-precondition' && error.message.includes('query requires an index')) {
        console.error("⚠️ Firestore index required. Please create a composite index for feedingSchedules collection with fields: userId (ascending), feedingTime (ascending)");
      }
      callback([]); // Return empty array on error
    });
  } catch (error) {
    console.error("Error setting up schedule subscription:", error);
    return () => {}; // Return noop cleanup function
  }
};

// Get user's feeding logs in real-time
export const subscribeToFeedingLogs = (userId, callback) => {
  try {
    const q = query(
      collection(db, "feedingLogs"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(50)
    );

    return onSnapshot(q, (snapshot) => {
      const logs = [];
      snapshot.forEach((doc) => {
        logs.push({ id: doc.id, ...doc.data() });
      });
      callback(logs);
    }, (error) => {
      console.error("Error subscribing to logs:", error);
      // Check if it's an index error
      if (error.code === 'failed-precondition' && error.message.includes('query requires an index')) {
        console.error("⚠️ Firestore index required. Please create a composite index for feedingLogs collection with fields: userId (ascending), timestamp (descending)");
      }
      callback([]); // Return empty array on error
    });
  } catch (error) {
    console.error("Error setting up logs subscription:", error);
    return () => {}; // Return noop cleanup function
  }
};

// Create a new feeding schedule
export const createSchedule = async (scheduleData) => {
  try {
    const docRef = await addDoc(
      collection(db, "feedingSchedules"),
      scheduleData
    );
    return { id: docRef.id, ...scheduleData };
  } catch (error) {
    throw new Error(`Error creating schedule: ${error.message}`);
  }
};

// Update a feeding schedule
export const updateSchedule = async (scheduleId, updateData) => {
  try {
    const scheduleRef = doc(db, "feedingSchedules", scheduleId);
    await updateDoc(scheduleRef, updateData);
    return { id: scheduleId, ...updateData };
  } catch (error) {
    throw new Error(`Error updating schedule: ${error.message}`);
  }
};

// Delete a feeding schedule
export const deleteSchedule = async (scheduleId) => {
  try {
    await deleteDoc(doc(db, "feedingSchedules", scheduleId));
    return { message: "Schedule deleted successfully" };
  } catch (error) {
    throw new Error(`Error deleting schedule: ${error.message}`);
  }
};

// Create a feeding log
export const createFeedingLog = async (logData) => {
  try {
    const docRef = await addDoc(collection(db, "feedingLogs"), logData);
    return { id: docRef.id, ...logData };
  } catch (error) {
    throw new Error(`Error creating feeding log: ${error.message}`);
  }
};

// Get all schedules for a user (one-time fetch)
export const getUserSchedules = async (userId) => {
  try {
    const q = query(
      collection(db, "feedingSchedules"),
      where("userId", "==", userId),
      orderBy("feedingTime")
    );

    const snapshot = await getDocs(q);
    const schedules = [];
    snapshot.forEach((doc) => {
      schedules.push({ id: doc.id, ...doc.data() });
    });
    return schedules;
  } catch (error) {
    // Check if it's an index error
    if (error.code === 'failed-precondition' && error.message.includes('query requires an index')) {
      console.error("⚠️ Firestore index required. Please create a composite index for feedingSchedules collection with fields: userId (ascending), feedingTime (ascending)");
    }
    throw new Error(`Error fetching schedules: ${error.message}`);
  }
};

// Get feeding logs for a user (one-time fetch)
export const getUserFeedingLogs = async (userId, limitCount = 50) => {
  try {
    const q = query(
      collection(db, "feedingLogs"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    const logs = [];
    snapshot.forEach((doc) => {
      logs.push({ id: doc.id, ...doc.data() });
    });
    return logs;
  } catch (error) {
    // Check if it's an index error
    if (error.code === 'failed-precondition' && error.message.includes('query requires an index')) {
      console.error("⚠️ Firestore index required. Please create a composite index for feedingLogs collection with fields: userId (ascending), timestamp (descending)");
    }
    throw new Error(`Error fetching feeding logs: ${error.message}`);
  }
};

export default {
  subscribeToSchedules,
  subscribeToFeedingLogs,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  createFeedingLog,
  getUserSchedules,
  getUserFeedingLogs,
};