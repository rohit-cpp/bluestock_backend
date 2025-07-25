// controllers/IpoDocController.js
import path from "path";
import fs from "fs";
import { query } from "../utlis/connectToDb.js";
import { getIpoByIdQuery } from "../utlis/sqlQuery.js";

export async function uploadIpoDocument(req, res, next) {
  const { id } = req.params;
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const filePath = req.file.path;

  try {
    const result = await query(
      `UPDATE ipos SET document_url = $1 WHERE id = $2 RETURNING *`,
      [filePath, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "IPO not found" });
    }

    res.status(200).json({ message: "Document uploaded", ipo: result.rows[0] });
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

    res.download(filePath); // triggers browser download
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
