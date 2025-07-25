import { query } from "../utlis/connectToDb.js";
import {
  createCompanyTableQuery,
  getAllCompanyQuery,
  insertCompanyQuery,
  updateCompanyByIdQuery,
  deleteCompanyByIdQuery,
  getCompanyByIdQuery,
} from "../utlis/sqlQuery.js";

// Helper function to validate ID format
const isValidId = (id) => !isNaN(id) && Number(id) > 0;

// GET: List all companies
export async function listAllCompanies(req, res, next) {
  try {
    await query(createCompanyTableQuery);
    const { rows } = await query(getAllCompanyQuery);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error in listAllCompanies:", error);
    next({
      status: 500,
      message: "Could not fetch companies. Try again later.",
    });
  }
}

// POST: Add a new company
export async function addNewCompany(req, res, next) {
  const { name, email, industry, location, founded_year, employee_count } =
    req.body;

  // Basic validation
  if (!name || !email || !founded_year || !employee_count) {
    return res.status(400).json({
      error:
        "Missing required fields: name, email, founded_year, employee_count",
    });
  }

  if (
    isNaN(founded_year) ||
    founded_year < 1800 ||
    founded_year > new Date().getFullYear()
  ) {
    return res.status(400).json({ error: "Invalid founded year" });
  }

  if (isNaN(employee_count) || employee_count < 0) {
    return res
      .status(400)
      .json({ error: "Employee count must be a non-negative number" });
  }

  try {
    await query(createCompanyTableQuery);
    const values = [
      name,
      email,
      industry,
      location,
      founded_year,
      employee_count,
    ];
    const { rows } = await query(insertCompanyQuery, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error in addNewCompany:", error);

    if (error.code === "23505") {
      // Unique constraint violation
      return res.status(409).json({ error: "Email already exists" });
    }

    next({ status: 400, message: "Could not add new company." });
  }
}

// PUT: Update a company
export async function updateCompanyInfo(req, res, next) {
  const { id } = req.params;
  const { name, email, industry, location, founded_year, employee_count } =
    req.body;

  if (!isValidId(id)) {
    return res.status(400).json({ error: "Invalid company ID" });
  }

  if (!name || !email || !founded_year || !employee_count) {
    return res.status(400).json({
      error:
        "Missing required fields: name, email, founded_year, employee_count",
    });
  }

  try {
    const values = [
      name,
      email,
      industry,
      location,
      founded_year,
      employee_count,
      id,
    ];
    const { rows } = await query(updateCompanyByIdQuery, values);
    if (rows.length === 0)
      return res.status(404).json({ error: "Company not found" });

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error in updateCompanyInfo:", error);

    if (error.code === "23505") {
      return res.status(409).json({ error: "Email already in use" });
    }

    next({ status: 400, message: "Could not update company info." });
  }
}

// DELETE: Delete a company
export async function deleteCompany(req, res, next) {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ error: "Invalid company ID" });
  }

  try {
    const { rows } = await query(deleteCompanyByIdQuery, [id]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Company not found" });

    res.status(200).json({ message: "Company deleted", company: rows[0] });
  } catch (error) {
    console.error("Error in deleteCompany:", error);
    next({ status: 400, message: "Could not delete company." });
  }
}

// GET: Get company details by ID
export async function getCompanyDeatails(req, res, next) {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ error: "Invalid company ID" });
  }

  try {
    const { rows } = await query(getCompanyByIdQuery, [id]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Company not found" });

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error in getCompanyDeatails:", error);
    next({ status: 400, message: "Could not get company details." });
  }
}
