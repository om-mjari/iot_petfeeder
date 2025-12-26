import { body, validationResult } from "express-validator";
import FeedingSchedule from "../../models/firestore/FeedingSchedule.js";

// @route   POST /api/schedule/create
// @desc    Create a new feeding schedule
// @access  Private
export const createSchedule = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { feedingTime, isActive, repeatDaily, portionSize } = req.body;
    const userId = req.user.id;

    const scheduleData = {
      userId,
      feedingTime,
      isActive: isActive !== undefined ? isActive : true,
      repeatDaily: repeatDaily !== undefined ? repeatDaily : true,
      portionSize: portionSize || "medium",
    };

    const schedule = await FeedingSchedule.createFeedingSchedule(scheduleData);

    res.status(201).json({
      success: true,
      message: "Feeding schedule created successfully",
      data: schedule,
    });
  } catch (error) {
    console.error("Schedule creation error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during schedule creation",
    });
  }
};

// @route   GET /api/schedule/list
// @desc    Get all feeding schedules for user
// @access  Private
export const listSchedules = async (req, res) => {
  try {
    const userId = req.user.id;
    const schedules = await FeedingSchedule.getUserSchedules(userId);

    res.json({
      success: true,
      data: schedules,
    });
  } catch (error) {
    console.error("Schedule listing error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during schedule listing",
    });
  }
};

// @route   PUT /api/schedule/update/:id
// @desc    Update a feeding schedule
// @access  Private
export const updateSchedule = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const updateData = req.body;
    const userId = req.user.id;

    // Verify schedule belongs to user
    const schedule = await FeedingSchedule.getScheduleById(id);
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found",
      });
    }

    if (schedule.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this schedule",
      });
    }

    // Update schedule
    const updatedSchedule = await FeedingSchedule.updateSchedule(id, updateData);

    res.json({
      success: true,
      message: "Schedule updated successfully",
      data: updatedSchedule,
    });
  } catch (error) {
    console.error("Schedule update error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during schedule update",
    });
  }
};

// @route   DELETE /api/schedule/delete/:id
// @desc    Delete a feeding schedule
// @access  Private
export const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify schedule belongs to user
    const schedule = await FeedingSchedule.getScheduleById(id);
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found",
      });
    }

    if (schedule.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this schedule",
      });
    }

    // Delete schedule
    await FeedingSchedule.deleteSchedule(id);

    res.json({
      success: true,
      message: "Schedule deleted successfully",
    });
  } catch (error) {
    console.error("Schedule deletion error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during schedule deletion",
    });
  }
};

export default {
  createSchedule,
  listSchedules,
  updateSchedule,
  deleteSchedule,
};