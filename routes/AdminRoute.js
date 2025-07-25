import express from "express";

const Adminrouter = express.Router();

router.get("/stats", (req, res) => {
  res.send("Total IPOs and total companies");
});
router.get("/logs", (req, res) => {
  res.send("Login logs, and all activtes");
});

export default Adminrouter;
