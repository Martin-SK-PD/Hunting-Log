import express from "express";
import bcrypt from "bcryptjs";
import pool from "../db.js";
import jwtGenerator from "../utils/jwtGenerator.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email_username, password } = req.body;

  if (!email_username || !password) {
    return res.status(400).json({ error: "Neplatné údaje" });
  }

  try {
    const userRes = await pool.query(
      `SELECT u.id, u.password_hash, uhg.role FROM users u
       JOIN user_hunting_ground uhg ON u.id = uhg.user_id
       WHERE u.email = $1 OR u.username = $1`,
      [email_username]
    );

    if (userRes.rows.length === 0) {
      return res.status(401).json({ error: "Neplatné údaje" });
    }

    const user = userRes.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: "Neplatné údaje" });
    }

    const jwtToken = jwtGenerator(user.id, user.role);
    res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

export default router;
