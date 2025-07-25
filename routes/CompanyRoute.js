// routes/CompanyRoute.js

import express from "express";
import {
  addNewCompany,
  deleteCompany,
  getCompanyDeatails,
  listAllCompanies,
  updateCompanyInfo,
} from "../controllers/CompanyController.js";

const Companyrouter = express.Router();

// RESTful routes
Companyrouter.get("/", listAllCompanies); // Get all companies
Companyrouter.post("/", addNewCompany); // Add a new company
Companyrouter.get("/:id", getCompanyDeatails); // Get company by ID
Companyrouter.put("/:id", updateCompanyInfo); // Update company
Companyrouter.delete("/:id", deleteCompany); // Delete company

export default Companyrouter;
