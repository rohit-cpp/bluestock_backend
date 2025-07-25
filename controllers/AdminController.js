import { query } from "../utlis/connectToDb.js";
import {
  getAdminCompanyStatsQuery,
  getAllLoginLogsQuery,
} from "../utlis/sqlQuery.js";

/**
 * @route   GET /api/admin/stats
 * @desc    Returns all companies + their IPOs + IPO counts
 * @access  Admin only
 */
export const getAdminStats = async (req, res) => {
  try {
    const { rows } = await query(getAdminCompanyStatsQuery);

    res.status(200).json({
      total_companies: rows.length,
      companies: rows,
    });
  } catch (err) {
    console.error("❌ Error fetching admin stats:", err);
    res.status(500).json({ error: "Failed to load admin stats" });
  }
};

/**
 * @route   GET /api/admin/logs
 * @desc    Returns user login/logout logs
 * @access  Admin only
 */
export const getAdminLogs = async (req, res) => {
  try {
    const { rows } = await query(getAllLoginLogsQuery);

    res.status(200).json({
      total_logs: rows.length,
      logs: rows,
    });
  } catch (err) {
    console.error("❌ Error fetching login logs:", err);
    res.status(500).json({ error: "Failed to fetch user logs" });
  }
};
