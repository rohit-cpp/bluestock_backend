// routes/ipoDocRoutes.js
import express from "express";
import { upload } from "../utlis/upload.js";
import {
  deleteIpoDocument,
  downloadIpoDocument,
  uploadIpoDocument,
} from "../controllers/DocumentController.js";

const router = express.Router();

// Admin: Upload IPO Document (PDF only)
router.post("/:id/upload", upload.single("document"), uploadIpoDocument);

// Public: Download IPO Document
router.get("/:id/download", downloadIpoDocument);

// Admin: Delete IPO Document
router.delete("/:id/delete-doc", deleteIpoDocument);

export default router;
