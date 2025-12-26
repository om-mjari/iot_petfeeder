import { body, validationResult } from "express-validator";
import FeedingLog from "../../models/firestore/FeedingLog.js";
import { publishServoCommand } from "../servoController.js";

// @route   POST /api/feeding/activate
// @desc    Activate servo motor for feeding
// @access  Private
export const activateFeeding = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { portionSize, scheduleId } = req.body;
    const userId = req.user.id;

    // Map portion size to servo angle
    const portionAngles = {
      small: 45,
      medium: 90,
      large: 135,
    };

    const servoAngle = portionAngles[portionSize] || portionAngles.medium;

    // Send command to servo
    const command = {
      action: "feed",
      angle: servoAngle,
      timestamp: new Date().toISOString(),
    };

    const success = await publishServoCommand(command);

    // Log the feeding action
    const logData = {
      userId,
      scheduleId: scheduleId || null,
      action: "Food Dispensed",
      status: success ? "success" : "failed",
      portionSize: portionSize || "medium",
      servoAngle,
      triggerType: scheduleId ? "scheduled" : "manual",
      errorMessage: success ? null : "Failed to send command to device",
    };

    const log = await FeedingLog.createFeedingLog(logData);

    res.json({
      success: true,
      message: success
        ? "Feeding activated successfully"
        : "Command sent but device may be offline",
      data: log,
    });
  } catch (error) {
    console.error("Feeding activation error:", error);

    // Log the error
    try {
      const errorLogData = {
        userId: req.user.id,
        action: "System Error",
        status: "failed",
        errorMessage: error.message,
        triggerType: "manual",
      };

      await FeedingLog.createFeedingLog(errorLogData);
    } catch (logError) {
      console.error("Error logging feeding error:", logError);
    }

    res.status(500).json({
      success: false,
      message: "Server error during feeding activation",
    });
  }
};

// @route   POST /api/feeding/stop
// @desc    Stop servo motor
// @access  Private
export const stopFeeding = async (req, res) => {
  try {
    const userId = req.user.id;

    // Send stop command to servo
    const command = {
      action: "stop",
      timestamp: new Date().toISOString(),
    };

    const success = await publishServoCommand(command);

    // Log the stop action
    const logData = {
      userId,
      action: "Feed Stopped",
      status: success ? "success" : "failed",
      triggerType: "manual",
      errorMessage: success ? null : "Failed to send command to device",
    };

    const log = await FeedingLog.createFeedingLog(logData);

    res.json({
      success: true,
      message: success
        ? "Feeding stopped successfully"
        : "Command sent but device may be offline",
      data: log,
    });
  } catch (error) {
    console.error("Feeding stop error:", error);

    // Log the error
    try {
      const errorLogData = {
        userId: req.user.id,
        action: "System Error",
        status: "failed",
        errorMessage: error.message,
        triggerType: "manual",
      };

      await FeedingLog.createFeedingLog(errorLogData);
    } catch (logError) {
      console.error("Error logging feeding error:", logError);
    }

    res.status(500).json({
      success: false,
      message: "Server error during feeding stop",
    });
  }
};

// @route   GET /api/feeding/logs
// @desc    Get feeding logs for user
// @access  Private
export const getFeedingLogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 50 } = req.query;

    const logs = await FeedingLog.getUserFeedingLogs(userId, parseInt(limit));

    res.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    console.error("Feeding logs error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during feeding logs retrieval",
    });
  }
};

// @route   GET /api/feeding/status
// @desc    Get current feeding system status
// @access  Private
export const getFeedingStatus = async (req, res) => {
  try {
    // In a real implementation, this would check device status
    // For now, we'll return a simulated status
    const status = {
      deviceConnected: true,
      lastActivity: new Date(),
      nextScheduledFeed: null,
    };

    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    console.error("Feeding status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during status retrieval",
    });
  }
};

export default {
  activateFeeding,
  stopFeeding,
  getFeedingLogs,
  getFeedingStatus,
};