import express from "express";

const Authrouter = express.Router();

Authrouter.post("/login", (req, res) => {
  res.send("Admin Login Successfully");
});
Authrouter.post("/logout", (req, res) => {
  res.send("Admin Logout Successfully");
});

export default Authrouter;
