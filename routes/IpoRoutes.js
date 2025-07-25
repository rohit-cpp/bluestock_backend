import express from "express";

const Iporouter = express.Router();

router.get("/", (req, res) => {
  res.send("List all Ipos");
});
router.get("/search", (req, res) => {
  res.send("Search IPOs by Keyword");
});
router.get("/:id", (req, res) => {
  res.send("Get IPO details by ID");
});
router.post("/", (req, res) => {
  res.send("Create new IPO");
});
router.put("/:id", (req, res) => {
  res.send("Update IPO details");
});
router.delete("/:id", (req, res) => {
  res.send("Delete IPO record");
});

export default Iporouter;
