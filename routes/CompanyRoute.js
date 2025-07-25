import express from "express";

const Companyrouter = express.Router();

router.get("/", (req, res) => {
  res.send("List all companies");
});
router.post("/", (req, res) => {
  res.send("Add new company");
});
router.put("/:id", (req, res) => {
  res.send("Update company info");
});
router.post("/:id", (req, res) => {
  res.send("Delete company");
});
router.post("/:id", (req, res) => {
  res.send("Get company details");
});

export default Companyrouter;
