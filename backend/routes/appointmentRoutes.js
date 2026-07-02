import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  bookAppointment,
  getMyAppointments,
  updateAppointmentStatus,
} from "../controllers/appointmentController.js";

const router = express.Router();

// Patient books
router.post("/", protect, bookAppointment);

// Both can view
router.get("/", protect, getMyAppointments);

// Doctor updates
router.put("/:id", protect, updateAppointmentStatus);

export default router;