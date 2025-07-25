import env from "dotenv";
import PG from "pg";
env.config();

const requiredEnvVars = [
  "PG_USER",
  "PG_HOST",
  "PG_DATABASE",
  "PG_PASSWORD",
  "PG_PORT",
];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.log(`missing required env variables : ${varName}`);
    process.exit(1);
  }
});

const db = new PG.Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect()
  .then(() => console.log("connected with the database"))
  .catch((err) => {
    console.log("Couldn't connect with the database", err);
    process.exit(1);
  });

db.on("error", (err) => {
  console.log("database error:", err);
  process.exit(1);
});

export const query = async (text, params) => {
  return await db.query(text, params);
};
