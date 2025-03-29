import express from "express";
import verifyToken from "../../middleware/verifyToken.js";
import pool from "../../db.js";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT a.id, a.name
      FROM hunting_areas a
      JOIN user_hunting_ground u ON u.hunting_ground_id = a.hunting_ground_id
      WHERE u.user_id = $1 AND a.is_deleted = FALSE
      ORDER BY a.name
    `, [req.user.id]);

    res.json(result.rows);
  } catch (err) {
    console.error("Chyba pri načítaní oblastí:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
