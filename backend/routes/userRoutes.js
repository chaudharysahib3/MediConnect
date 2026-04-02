import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getProfile,
  updateProfile,
  getDoctors,
  getPatients
} from "../controllers/userController.js";

const router = express.Router();

//Profile routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

//Get doctors list (for patients)
router.get("/doctors", protect, getDoctors);
router.get("/patients", protect, getPatients);

export default router;