// controllers/IpoDocController.js
import fs from "fs";

import { getIpoByIdQuery } from "../utlis/sqlQuery.js";
import { query } from "../utlis/connectToDb.js";

export async function uploadIpoDocument(req, res, next) {
  const { id } = req.params;
  const userEmail = req.user?.email || "unknown";

  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const filePath = req.file.path;
  const fileName = req.file.originalname;

  try {
    const check = await query(getIpoByIdQuery, [id]);
    if (check.rows.length === 0)
      return res.status(404).json({ error: "IPO not found" });

    await query(`UPDATE ipos SET document_url = $1 WHERE id = $2`, [
      filePath,
      id,
    ]);

    const insert = await query(
      `INSERT INTO documents (ipo_id, filename, file_path, uploaded_by)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [id, fileName, filePath, userEmail]
    );

    res.status(200).json({
      message: "Document uploaded and recorded",
      ipo_id: id,
      file: insert.rows[0],
    });
  } catch (err) {
    console.error("Upload error:", err);
    next({ status: 500, message: "Failed to upload document" });
  }
}

export async function downloadIpoDocument(req, res, next) {
  const { id } = req.params;
  try {
    const { rows } = await query(getIpoByIdQuery, [id]);
    if (rows.length === 0)
      return res.status(404).json({ error: "IPO not found" });

    const filePath = rows[0].document_url;
    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Document not found" });
    }
    res.download(filePath);
  } catch (err) {
    console.error("Download error:", err);
    next({ status: 500, message: "Failed to download document" });
  }
}

export async function deleteIpoDocument(req, res, next) {
  const { id } = req.params;
  try {
    const { rows } = await query(getIpoByIdQuery, [id]);
    if (rows.length === 0)
      return res.status(404).json({ error: "IPO not found" });

    const filePath = rows[0].document_url;
    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Document not found" });
    }

    fs.unlinkSync(filePath);
    await query(`UPDATE ipos SET document_url = NULL WHERE id = $1`, [id]);

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    next({ status: 500, message: "Failed to delete document" });
  }
}
