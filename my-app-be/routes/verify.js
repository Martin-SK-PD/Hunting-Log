import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getUserWithGroundInfo } from "../models/users.js";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
  const token = req.header("jwt_token");
  if (!token) return res.status(403).json({ msg: "Authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.jwtSecret);
    const user = await getUserWithGroundInfo(decoded.user.id);

    if (!user) return res.status(404).json({ msg: "User not found" });

    return res.json({ 
      id: decoded.user.id, 
      role: decoded.user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      ground_name: user.ground_name
    });
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
});

export default router;
