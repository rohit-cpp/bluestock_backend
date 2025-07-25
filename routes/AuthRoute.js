// routes/authRoutes.js
import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/AuthController.js";
import { protect } from "../utlis/authmiddleware.js";

const router = express.Router();

router.post("/register", registerUser); // POST /api/auth/register
router.post("/login", loginUser); // POST /api/auth/login
router.post("/logout", protect, logoutUser); // POST /api/auth/logout

export default router;
