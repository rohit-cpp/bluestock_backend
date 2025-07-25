// controllers/IpoController.js

import { query } from "../utlis/connectToDb.js";
import {
  createIpoTableQuery,
  getAllIposQuery,
  searchIposQuery,
  getIpoByIdQuery,
  insertIpoQuery,
  updateIpoByIdQuery,
  deleteIpoByIdQuery,
} from "../utlis/sqlQuery.js";

const isValidId = (id) => !isNaN(id) && Number(id) > 0;

export async function listAllIpos(req, res, next) {
  try {
    await query(createIpoTableQuery); // Ensure table exists
    const { rows } = await query(getAllIposQuery);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error in listAllIpos:", err);
    next({ status: 500, message: "Failed to fetch IPOs" });
  }
}

export async function searchIpos(req, res, next) {
  const keyword = req.query.keyword;
  if (!keyword)
    return res.status(400).json({ error: "Missing search keyword" });

  try {
    const { rows } = await query(searchIposQuery, [`%${keyword}%`]);
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error in searchIpos:", err);
    next({ status: 500, message: "Failed to search IPOs" });
  }
}

export async function getIpoDetails(req, res, next) {
  const { id } = req.params;
  if (!isValidId(id)) return res.status(400).json({ error: "Invalid IPO ID" });

  try {
    const { rows } = await query(getIpoByIdQuery, [id]);
    if (rows.length === 0)
      return res.status(404).json({ error: "IPO not found" });
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Error in getIpoDetails:", err);
    next({ status: 500, message: "Could not retrieve IPO details" });
  }
}

export async function addNewIpo(req, res, next) {
  const { company_id, issue_price, open_date, close_date, shares_offered } =
    req.body;
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
    ]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error in addNewIpo:", err);
    if (err.code === "23503") {
      return res
        .status(400)
        .json({ error: "Invalid company ID (foreign key)" });
    }
    next({ status: 500, message: "Failed to create IPO" });
  }
}

export async function updateIpo(req, res, next) {
  const { id } = req.params;
  const { company_id, issue_price, open_date, close_date, shares_offered } =
    req.body;

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
    ]);
    if (rows.length === 0)
      return res.status(404).json({ error: "IPO not found" });
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("Error in updateIpo:", err);
    next({ status: 500, message: "Could not update IPO" });
  }
}

export async function deleteIpo(req, res, next) {
  const { id } = req.params;
  if (!isValidId(id)) return res.status(400).json({ error: "Invalid IPO ID" });

  try {
    const { rows } = await query(deleteIpoByIdQuery, [id]);
    if (rows.length === 0)
      return res.status(404).json({ error: "IPO not found" });
    res.status(200).json({ message: "IPO deleted", ipo: rows[0] });
  } catch (err) {
    console.error("Error in deleteIpo:", err);
    next({ status: 500, message: "Could not delete IPO" });
  }
}
