import express from "express";
import { protect } from "../utlis/authmiddleware.js";
import { getAdminLogs, getAdminStats } from "../controllers/AdminController.js";

const router = express.Router();

// ✅ GET /api/admin/stats
// Admin dashboard: Get total companies, total IPOs, and IPOs per company
router.get("/stats", protect, getAdminStats);

// ✅ GET /api/admin/logs
// Admin activity logs: login/logout history
router.get("/logs", protect, getAdminLogs);

export default router;
