import express from "express";
import verifyToken from "../../middleware/verifyToken.js";
import { getUsersInSameGround, transferAdminRole } from "../../models/users.js";

const router = express.Router();

router.get("/users", verifyToken, async (req, res) => {
  try {
    const result = await getUsersInSameGround(req.user.id);
    res.json(result.rows);
  } catch (err) {
    console.error("Chyba pri načítaní používateľov:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/transfer-admin", verifyToken, async (req, res) => {
  const { newAdminId } = req.body;
  try {
    await transferAdminRole(req.user.id, newAdminId);
    res.status(200).json({ msg: "Rola bola úspešne presunutá" });
  } catch (err) {
    console.error("Chyba pri presune roly:", err.message);
    res.status(400).json({ msg: err.message });
  }
});

export default router;
