import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../utlis/connectToDb.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refreshsupersecret";

// In-memory token store (use Redis/DB for production)
const refreshTokens = new Set();

// === Token Generators ===
const generateAccessToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: "15m",
  });

const generateRefreshToken = (user) => {
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    REFRESH_SECRET,
    { expiresIn: "7d" }
  );
  refreshTokens.add(token);
  return token;
};

// === REGISTER USER ===
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields are required" });

  try {
    const existing = await query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (existing.rows.length > 0)
      return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
      [name, email, hashedPassword, role || "user"]
    );

    const user = result.rows[0];
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(201).json({ accessToken, refreshToken, user });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// === LOGIN USER ===
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  try {
    const result = await query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    // ✅ Role taken from DB — not from request
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await query(
      "INSERT INTO login_logs (user_id, email, role, action) VALUES ($1, $2, $3, 'LOGIN')",
      [user.id, user.email, user.role]
    );

    res.json({
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// === REFRESH TOKEN ===
export const refreshToken = async (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(401).json({ error: "Refresh token required" });
  if (!refreshTokens.has(token))
    return res.status(403).json({ error: "Invalid refresh token" });

  try {
    const decoded = jwt.verify(token, REFRESH_SECRET);
    const newAccessToken = generateAccessToken(decoded);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("Refresh error:", err);
    res.status(403).json({ error: "Token expired or invalid" });
  }
};

// === LOGOUT USER ===
export const logoutUser = async (req, res) => {
  const { refreshToken: token } = req.body;

  try {
    if (token && refreshTokens.has(token)) {
      refreshTokens.delete(token); // Invalidate token

      const decoded = jwt.verify(token, REFRESH_SECRET);
      await query(
        "INSERT INTO login_logs (user_id, email, role, action) VALUES ($1, $2, $3, 'LOGOUT')",
        [decoded.id, decoded.email, decoded.role]
      );
    }

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(200).json({ message: "Logged out" });
  }
};
