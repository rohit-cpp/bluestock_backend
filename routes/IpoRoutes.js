// routes/ipoRoutes.js

import express from "express";
import {
  addNewIpo,
  deleteIpo,
  getIpoDetails,
  listAllIpos,
  searchIpos,
  updateIpo,
} from "../controllers/IpoController.js";

const Iporouter = express.Router();

// Public Routes
Iporouter.get("/", listAllIpos); // Get all IPOs
Iporouter.get("/search", searchIpos); // Search IPOs
Iporouter.get("/:id", getIpoDetails); // Get IPO by ID

// Admin Routes
Iporouter.post("/", addNewIpo); // Create IPO
Iporouter.put("/:id", updateIpo); // Update IPO
Iporouter.delete("/:id", deleteIpo); // Delete IPO

export default Iporouter;
