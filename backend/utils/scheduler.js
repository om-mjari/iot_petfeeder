import cron from "node-cron";
// Import Firestore models instead of MongoDB models
import { db } from "../config/firestore.js";
import { publishServoCommand } from "../controllers/servoController.js";

// Track which schedules have been triggered today
const triggeredSchedules = new Map();

// Run every minute to check for scheduled feedings
export const initializeScheduler = () => {
  console.log("⏰ Feeding scheduler initialized");

  // Check every minute
  cron.schedule("* * * * *", async () => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
    const currentDate = now.toDateString();

    try {
      // Find all active schedules matching current time using Firestore
      const schedulesQuery = db.collection("feedingSchedules")
        .where("feedingTime", "==", currentTime)
        .where("isActive", "==", true);
      
      const schedulesSnapshot = await schedulesQuery.get();
      
      for (const doc of schedulesSnapshot.docs) {
        const schedule = { id: doc.id, ...doc.data() };
        const scheduleKey = `${schedule.id}_${currentDate}`;

        // Check if already triggered today
        if (triggeredSchedules.has(scheduleKey)) {
          continue;
        }

        console.log(
          `🔔 Triggering scheduled feeding for user: ${schedule.userId}`
        );

        // Map portion size to servo angle and duration
        const portionSettings = {
          small: { angle: 90, duration: 2000 },   // 2 seconds
          medium: { angle: 90, duration: 4000 },  // 4 seconds
          large: { angle: 90, duration: 6000 }    // 6 seconds
        };

        const settings = portionSettings[schedule.portionSize] || portionSettings.medium;

        // Create feeding log in Firestore
        const logData = {
          userId: schedule.userId,
          scheduleId: schedule.id,
          action: "Scheduled Feed",
          status: "success",
          portionSize: schedule.portionSize,
          servoAngle: settings.angle,
          triggerType: "scheduled",
          timestamp: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const logRef = await db.collection("feedingLogs").add(logData);
        const logId = logRef.id;

        // Send command to servo
        const servoCommand = {
          action: "feed",
          angle: settings.angle,
          duration: settings.duration,
          scheduleId: schedule.id,
          logId: logId,
        };

        try {
          await publishServoCommand(servoCommand);

          // Update last triggered time in Firestore
          await db.collection("feedingSchedules").doc(schedule.id).update({
            lastTriggered: now,
            updatedAt: new Date(),
          });

          // Mark as triggered for today
          triggeredSchedules.set(scheduleKey, true);

          console.log(
            `✅ Scheduled feeding completed for schedule: ${schedule.id}`
          );
        } catch (error) {
          console.error("❌ Servo activation failed:", error);

          // Update log with error
          await db.collection("feedingLogs").doc(logId).update({
            status: "failed",
            errorMessage: error.message,
            updatedAt: new Date(),
          });
        }
      }
    } catch (error) {
      console.error("❌ Scheduler error:", error);
    }
  });

  // Clear triggered schedules map at midnight
  cron.schedule("0 0 * * *", () => {
    triggeredSchedules.clear();
    console.log("🔄 Triggered schedules cleared for new day");
  });
};

export default { initializeScheduler };