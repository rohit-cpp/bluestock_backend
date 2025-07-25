import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import Companyrouter from "./routes/CompanyRoute.js";
import Authrouter from "./routes/AuthRoute.js";
import DocumentUploadrouter from "./routes/DocumentUpload.js";
import Iporouter from "./routes/IpoRoutes.js";
import router from "./routes/AdminRoute.js";

dotenv.config();

const app = express();
const PORT = 3000;

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use("/api/auth", Authrouter);
app.use("/api/companies", Companyrouter);
app.use("/api/ipos", Iporouter);
app.use("/api/ipos_doc", DocumentUploadrouter);
app.use("/api/admin", router);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({ error: message });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
