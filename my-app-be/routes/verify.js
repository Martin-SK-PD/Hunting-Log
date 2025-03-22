import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/", (req, res) => {
  const token = req.header("jwt_token");
  if (!token) return res.status(403).json({ msg: "Authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.jwtSecret);
    return res.json({ id: decoded.user.id, role: decoded.user.role });
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
});

export default router;
