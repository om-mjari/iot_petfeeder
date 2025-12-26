import express from "express";
import { body } from "express-validator";
import {
  createSchedule,
  getSchedules,
  updateSchedule,
  deleteSchedule,
} from "../../controllers/firestore/scheduleController.js";
import { authenticateToken } from "../../middleware/auth.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// @route   POST /api/schedule/create
// @desc    Create a new feeding schedule
// @access  Private
router.post(
  "/create",
  [
    body("feedingTime")
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage("Invalid time format. Use HH:MM"),
    body("portionSize")
      .isIn(["small", "medium", "large"])
      .withMessage("Portion size must be small, medium, or large"),
  ],
  createSchedule
);

// @route   GET /api/schedule/list
// @desc    Get all schedules for user
// @access  Private
router.get("/list", getSchedules);

// @route   PUT /api/schedule/update/:id
// @desc    Update a feeding schedule
// @access  Private
router.put(
  "/update/:id",
  [
    body("feedingTime")
      .optional()
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage("Invalid time format. Use HH:MM"),
    body("portionSize")
      .optional()
      .isIn(["small", "medium", "large"])
      .withMessage("Portion size must be small, medium, or large"),
  ],
  updateSchedule
);

// @route   DELETE /api/schedule/delete/:id
// @desc    Delete a feeding schedule
// @access  Private
router.delete("/delete/:id", deleteSchedule);

export default router;