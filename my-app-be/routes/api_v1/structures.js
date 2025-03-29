import express from "express";
import verifyToken from "../../middleware/verifyToken.js";
import pool from "../../db.js";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  const { area_id } = req.query;

  if (!area_id) return res.status(400).json({ msg: "Chýba area_id" });

  try {
    const result = await pool.query(`
      SELECT s.id, s.name
      FROM structures s
      JOIN hunting_areas a ON s.hunting_area_id = a.id
      JOIN user_hunting_ground u ON u.hunting_ground_id = a.hunting_ground_id
      WHERE u.user_id = $1 AND a.id = $2 AND s.is_deleted = FALSE
      ORDER BY s.name
    `, [req.user.id, area_id]);

    res.json(result.rows);
  } catch (err) {
    console.error("Chyba pri načítaní štruktúr:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
