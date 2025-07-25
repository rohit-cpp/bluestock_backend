import express from "express";

const Adminrouter = express.Router();

Adminrouter.get("/stats", (req, res) => {
  res.send("Total IPOs and total companies");
});
Adminrouter.get("/logs", (req, res) => {
  res.send("Login logs, and all activtes");
});

export default Adminrouter;
