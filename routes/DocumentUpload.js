import express from "express";

const DocumentUploadrouter = express.Router();

router.post("/upload", (req, res) => {
  res.send("Upload RHP/DRHP PDF");
});
router.get("/download", (req, res) => {
  res.send("Download RHP/DRHP document");
});
router.delete("/delete-doc", (req, res) => {
  res.send("Delete document from IPO");
});

export default DocumentUploadrouter;
