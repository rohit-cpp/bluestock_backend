import express from "express";

const DocumentUploadrouter = express.Router();

DocumentUploadrouter.post("/upload", (req, res) => {
  res.send("Upload RHP/DRHP PDF");
});
DocumentUploadrouter.get("/download", (req, res) => {
  res.send("Download RHP/DRHP document");
});
DocumentUploadrouter.delete("/delete-doc", (req, res) => {
  res.send("Delete document from IPO");
});

export default DocumentUploadrouter;
