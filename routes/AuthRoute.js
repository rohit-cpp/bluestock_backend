import express from "express";

const Authrouter = express.Router();

router.post("/login", (req, res) => {
  res.send("Admin Login Successfully");
});
router.post("/logout", (req, res) => {
  res.send("Admin Logout Successfully");
});

export default Authrouter;
