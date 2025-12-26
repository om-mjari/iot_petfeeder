import { body, validationResult } from "express-validator";
import { db } from "../../config/firestore.js";

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

    const { feedingTime, portionSize, repeatDaily } = req.body;
    const userId = req.user.id;

    // Create schedule in Firestore
    const scheduleData = {
      userId,
      feedingTime,
      portionSize,
      isActive: true,
      repeatDaily: repeatDaily !== undefined ? repeatDaily : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const scheduleRef = await db.collection("feedingSchedules").add(scheduleData);
    const schedule = { id: scheduleRef.id, ...scheduleData };

    res.status(201).json({
      success: true,
      message: "Schedule created successfully",
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
// @desc    Get all schedules for user
// @access  Private
export const getSchedules = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get schedules from Firestore
    const schedulesQuery = db.collection("feedingSchedules")
      .where("userId", "==", userId)
      .orderBy("feedingTime");

    const schedulesSnapshot = await schedulesQuery.get();
    const schedules = [];
    
    schedulesSnapshot.forEach((doc) => {
      schedules.push({ id: doc.id, ...doc.data() });
    });

    res.json({
      success: true,
      data: schedules,
    });
  } catch (error) {
    console.error("Schedule retrieval error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during schedule retrieval",
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
    const scheduleRef = db.collection("feedingSchedules").doc(id);
    const scheduleDoc = await scheduleRef.get();
    
    if (!scheduleDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found",
      });
    }

    const schedule = scheduleDoc.data();
    if (schedule.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this schedule",
      });
    }

    // Update schedule in Firestore
    updateData.updatedAt = new Date();
    await scheduleRef.update(updateData);

    const updatedSchedule = { id: scheduleDoc.id, ...schedule, ...updateData };

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
    const scheduleRef = db.collection("feedingSchedules").doc(id);
    const scheduleDoc = await scheduleRef.get();
    
    if (!scheduleDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found",
      });
    }

    const schedule = scheduleDoc.data();
    if (schedule.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this schedule",
      });
    }

    // Delete schedule from Firestore
    await scheduleRef.delete();

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
  getSchedules,
  updateSchedule,
  deleteSchedule,
};