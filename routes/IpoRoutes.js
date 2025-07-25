import express from "express";
import { listAllCompanies } from "../controllers/CompanyController";
import {
  addNewIpo,
  deleteIpo,
  getIpoDetails,
  listAllIpos,
  updateIpo,
} from "../controllers/IpoController";

const Iporouter = express.Router();

Iporouter.get("/", listAllIpos);
Iporouter.get("/search", addNewIpo);
Iporouter.get("/:id");
Iporouter.post("/", updateIpo);
Iporouter.put("/:id", deleteIpo);
Iporouter.delete("/:id");

export default Iporouter;
