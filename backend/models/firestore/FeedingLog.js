import { db } from "../../config/firestore.js";

// FeedingLog model for Firestore
class FeedingLog {
  // Create a new feeding log
  static async createFeedingLog(logData) {
    try {
      // Prepare log data for Firestore
      const log = {
        ...logData,
        timestamp: logData.timestamp || new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Add log to Firestore
      const logRef = await db.collection("feedingLogs").add(log);
      
      // Return log with ID
      return { id: logRef.id, ...log };
    } catch (error) {
      throw new Error(`Error creating feeding log: ${error.message}`);
    }
  }

  // Get user's feeding logs
  static async getUserFeedingLogs(userId, limit = 50) {
    try {
      const logsQuery = db.collection("feedingLogs")
        .where("userId", "==", userId)
        .orderBy("timestamp", "desc")
        .limit(limit);

      const logsSnapshot = await logsQuery.get();
      const logs = [];

      logsSnapshot.forEach((doc) => {
        logs.push({ id: doc.id, ...doc.data() });
      });

      return logs;
    } catch (error) {
      throw new Error(`Error getting user feeding logs: ${error.message}`);
    }
  }

  // Get log by ID
  static async getLogById(logId) {
    try {
      const logDoc = await db.collection("feedingLogs").doc(logId).get();

      if (!logDoc.exists) {
        return null;
      }

      return { id: logDoc.id, ...logDoc.data() };
    } catch (error) {
      throw new Error(`Error getting log by ID: ${error.message}`);
    }
  }

  // Update log
  static async updateLog(logId, updateData) {
    try {
      updateData.updatedAt = new Date();
      
      await db.collection("feedingLogs").doc(logId).update(updateData);
      
      // Return updated log
      const updatedLog = await this.getLogById(logId);
      return updatedLog;
    } catch (error) {
      throw new Error(`Error updating log: ${error.message}`);
    }
  }
}

export default FeedingLog;