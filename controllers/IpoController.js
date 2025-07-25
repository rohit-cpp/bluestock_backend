import {
  createIpoTableQuery,
  getAllIposQuery,
  searchIposQuery,
  getIpoByIdQuery,
  insertIpoQuery,
  updateIpoByIdQuery,
  deleteIpoByIdQuery,
  createCompaniesDetailsTableQuery, // (Unused; can be removed if not needed)
} from "../utlis/sqlQuery.js";
import { query } from "../utlis/connectToDb.js";

// ✅ Helper to validate IDs
const isValidId = (id) => !isNaN(id) && Number(id) > 0;

/**
 * @route   GET /api/ipos
 * @desc    Fetch all IPO records (public)
 * @access  Public
 */
export async function listAllIpos(req, res, next) {
  try {
    // (Optional) Create table if not exists — useful for fresh DB setups
    await query(createIpoTableQuery);
    const { rows } = await query(getAllIposQuery); // 🔍 Get all IPOs
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error in listAllIpos:", err);
    next({ status: 500, message: "Failed to fetch IPOs" });
  }
}

/**
 * @route   GET /api/ipos/search?keyword=
 * @desc    Search IPOs by keyword (company name or issue price)
 * @access  Public
 */
export async function searchIpos(req, res, next) {
  const keyword = req.query.keyword;
  if (!keyword)
    return res.status(400).json({ error: "Missing search keyword" });

  try {
    const { rows } = await query(searchIposQuery, [`%${keyword}%`]); // 🔍 Search IPOs
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error in searchIpos:", err);
    next({ status: 500, message: "Failed to search IPOs" });
  }
}

/**
 * @route   GET /api/ipos/:id
 * @desc    Get a single IPO's full details by ID
 * @access  Public
 */
export async function getIpoDetails(req, res, next) {
  const { id } = req.params;
  if (!isValidId(id)) return res.status(400).json({ error: "Invalid IPO ID" });

  try {
    const { rows } = await query(getIpoByIdQuery, [id]); // 📥 Read IPO
    if (rows.length === 0)
      return res.status(404).json({ error: "IPO not found" });

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Error in getIpoDetails:", err);
    next({ status: 500, message: "Could not retrieve IPO details" });
  }
}

/**
 * @route   POST /api/ipos
 * @desc    Add a new IPO record (admin only)
 * @access  Admin
 */
export async function addNewIpo(req, res, next) {
  const { company_id, issue_price, open_date, close_date, shares_offered } =
    req.body;

  // 🛡️ Validate input
  if (
    !company_id ||
    !issue_price ||
    !open_date ||
    !close_date ||
    !shares_offered
  ) {
    return res.status(400).json({ error: "All IPO fields are required" });
  }

  try {
    const { rows } = await query(insertIpoQuery, [
      company_id,
      issue_price,
      open_date,
      close_date,
      shares_offered,
    ]); // ✅ Create new IPO

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error in addNewIpo:", err);

    // Handle FK constraint (invalid company_id)
    if (err.code === "23503") {
      return res
        .status(400)
        .json({ error: "Invalid company_id (FK constraint)" });
    }

    next({ status: 500, message: "Failed to create IPO" });
  }
}

/**
 * @route   PUT /api/ipos/:id
 * @desc    Update an existing IPO by ID (admin only)
 * @access  Admin
 */
export async function updateIpo(req, res, next) {
  const { id } = req.params;
  const { company_id, issue_price, open_date, close_date, shares_offered } =
    req.body;

  // Validate
  if (!isValidId(id)) return res.status(400).json({ error: "Invalid IPO ID" });

  if (
    !company_id ||
    !issue_price ||
    !open_date ||
    !close_date ||
    !shares_offered
  ) {
    return res.status(400).json({ error: "All IPO fields are required" });
  }

  try {
    const { rows } = await query(updateIpoByIdQuery, [
      company_id,
      issue_price,
      open_date,
      close_date,
      shares_offered,
      id,
    ]); // 🔁 Update IPO

    if (rows.length === 0)
      return res.status(404).json({ error: "IPO not found" });

    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Error in updateIpo:", err);
    next({ status: 500, message: "Could not update IPO" });
  }
}

/**
 * @route   DELETE /api/ipos/:id
 * @desc    Delete an IPO by ID (admin only)
 * @access  Admin
 */
export async function deleteIpo(req, res, next) {
  const { id } = req.params;

  if (!isValidId(id)) return res.status(400).json({ error: "Invalid IPO ID" });

  try {
    const { rows } = await query(deleteIpoByIdQuery, [id]); // ❌ Delete IPO

    if (rows.length === 0)
      return res.status(404).json({ error: "IPO not found" });

    res.status(200).json({ message: "IPO deleted", ipo: rows[0] });
  } catch (err) {
    console.error("Error in deleteIpo:", err);
    next({ status: 500, message: "Could not delete IPO" });
  }
}
