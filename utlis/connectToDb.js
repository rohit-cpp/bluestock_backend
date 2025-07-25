import dotenv from "dotenv";
import { Pool } from "pg";
import {
  createCompanyTableQuery,
  createUsersTableQuery,
  createIpoTableQuery,
  createDocumentsTableQuery,
  createLoginLogsTableQuery,
  createIndexesQuery,
} from "./sqlQuery.js"; // Make sure this path is correct

dotenv.config();

const requiredEnvVars = [
  "PG_USER",
  "PG_HOST",
  "PG_DATABASE",
  "PG_PASSWORD",
  "PG_PORT",
];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`❌ Missing required env variable: ${varName}`);
    process.exit(1);
  }
});

const db = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT),
});

db.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => {
    console.error("❌ PostgreSQL connection error:", err);
    process.exit(1);
  });

(async () => {
  try {
    console.log("⏳ Syncing tables...");
    await db.query(createCompanyTableQuery);
    await db.query(createUsersTableQuery);
    await db.query(createLoginLogsTableQuery);
    await db.query(createIpoTableQuery); // Must include document_url
    await db.query(createDocumentsTableQuery);
    await db.query(createIndexesQuery);
    console.log("✅ All tables and indexes are synced");
  } catch (err) {
    console.error("❌ Table sync error:", err);
  }
})();

db.on("error", (err) => {
  console.error("❌ Database error:", err);
  process.exit(1);
});

export const query = async (text, params) => {
  return db.query(text, params);
};
