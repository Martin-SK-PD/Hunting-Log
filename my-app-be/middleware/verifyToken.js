import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default function verifyToken(req, res, next) {
  const authHeader = req.header("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  

  if (!token) {
    return res.status(403).json({ msg: "Authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.jwtSecret);
    
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error("Token error:", err.message);
    return res.status(401).json({ msg: "Token is not valid" });
  }
}
