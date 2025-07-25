import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import Companyrouter from "./routes/CompanyRoute";
import Authrouter from "./routes/AuthRoute";
import DocumentUploadrouter from "./routes/DocumentUpload";

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
app.use("/api/ipos", Companyrouter);
app.use("/api/ipos/:id", DocumentUploadrouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
