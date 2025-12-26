import express from "express";
import { body } from "express-validator";
import {
  activateFeeding,
  stopFeeding,
  getFeedingLogs,
  getFeedingStatus,
} from "../../controllers/firestore/feedingController.js";
import { authenticateToken } from "../../middleware/auth.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// @route   POST /api/feeding/activate
// @desc    Activate servo motor for feeding
// @access  Private
router.post(
  "/activate",
  [
    body("portionSize")
      .optional()
      .isIn(["small", "medium", "large"])
      .withMessage("Portion size must be small, medium, or large"),
    body("scheduleId").optional().isString(),
  ],
  activateFeeding
);

// @route   POST /api/feeding/stop
// @desc    Stop servo motor
// @access  Private
router.post("/stop", stopFeeding);

// @route   GET /api/feeding/logs
// @desc    Get feeding logs for user
// @access  Private
router.get("/logs", getFeedingLogs);

// @route   GET /api/feeding/status
// @desc    Get current feeding system status
// @access  Private
router.get("/status", getFeedingStatus);

export default router;