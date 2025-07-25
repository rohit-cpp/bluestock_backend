// IPOController.js

import { query } from "../utlis/connectToDb.js";
import {
  createIpoTableQuery,
  getAllIpoQuery,
  insertIpoQuery,
  updateIpoByIdQuery,
  deleteIpoByIdQuery,
  getIpoByIdQuery,
} from "../utlis/sqlQuery.js";

const isValidId = (id) => !isNaN(id) && Number(id) > 0;

// GET: List all IPOs
export async function listAllIpos(req, res, next) {
  try {
    await query(createIpoTableQuery);
    const { rows } = await query(getAllIpoQuery);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error in listAllIpos:", error);
    next({ status: 500, message: "Could not fetch IPOs. Try again later." });
  }
}

// POST: Add new IPO
export async function addNewIpo(req, res, next) {
  const {
    company_id,
    price_band,
    lot_size,
    open_date,
    close_date,
    issue_size,
    ipo_type,
  } = req.body;

  // Validate required fields
  if (
    !company_id ||
    !price_band ||
    !lot_size ||
    !open_date ||
    !close_date ||
    !issue_size
  ) {
    return res.status(400).json({
      error:
        "Missing required fields: company_id, price_band, lot_size, open_date, close_date, issue_size",
    });
  }

  if (!isValidId(company_id)) {
    return res.status(400).json({ error: "Invalid company ID" });
  }

  try {
    await query(createIpoTableQuery);
    const values = [
      company_id,
      price_band,
      lot_size,
      open_date,
      close_date,
      issue_size,
      ipo_type,
    ];
    const { rows } = await query(insertIpoQuery, values);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error("Error in addNewIpo:", error);

    if (error.code === "23503") {
      // Foreign key violation (invalid company_id)
      return res.status(404).json({ error: "Referenced company not found" });
    }

    if (error.code === "23505") {
      // Unique violation
      return res
        .status(409)
        .json({ error: "IPO already exists for this company" });
    }

    next({ status: 400, message: "Could not add IPO" });
  }
}

// PUT: Update IPO
export async function updateIpo(req, res, next) {
  const { id } = req.params;
  const {
    company_id,
    price_band,
    lot_size,
    open_date,
    close_date,
    issue_size,
    ipo_type,
  } = req.body;

  if (!isValidId(id)) {
    return res.status(400).json({ error: "Invalid IPO ID" });
  }

  try {
    const values = [
      company_id,
      price_band,
      lot_size,
      open_date,
      close_date,
      issue_size,
      ipo_type,
      id,
    ];
    const { rows } = await query(updateIpoByIdQuery, values);

    if (rows.length === 0)
      return res.status(404).json({ error: "IPO not found" });

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error in updateIpo:", error);

    if (error.code === "23503") {
      return res.status(404).json({ error: "Referenced company not found" });
    }

    if (error.code === "23505") {
      return res.status(409).json({ error: "Duplicate IPO record" });
    }

    next({ status: 400, message: "Could not update IPO" });
  }
}

// DELETE: Delete IPO
export async function deleteIpo(req, res, next) {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ error: "Invalid IPO ID" });
  }

  try {
    const { rows } = await query(deleteIpoByIdQuery, [id]);
    if (rows.length === 0)
      return res.status(404).json({ error: "IPO not found" });

    res.status(200).json({ message: "IPO deleted", ipo: rows[0] });
  } catch (error) {
    console.error("Error in deleteIpo:", error);
    next({ status: 400, message: "Could not delete IPO" });
  }
}

// GET: Get IPO by ID
export async function getIpoDetails(req, res, next) {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ error: "Invalid IPO ID" });
  }

  try {
    const { rows } = await query(getIpoByIdQuery, [id]);
    if (rows.length === 0)
      return res.status(404).json({ error: "IPO not found" });

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error in getIpoDetails:", error);
    next({ status: 400, message: "Could not get IPO details" });
  }
}
