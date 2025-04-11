
import express from "express";
import verifyToken from "../../middleware/verifyToken.js";
import {
  getAnnouncementsForUser,
  insertAnnouncement,
  updateAnnouncement,
  softDeleteAnnouncement
} from "../../models/announcements.js";

const router = express.Router();


router.get("/", verifyToken, async (req, res) => {
  try {
    const result = await getAnnouncementsForUser(req.user.id);
    res.json(result.rows);
  } catch (err) {
    console.error("Chyba pri načítaní oznamov:", err.message);
    res.status(500).json({ msg: "Chyba pri načítaní oznamov" });
  }
});


router.post("/", verifyToken, async (req, res) => {
  const { title, message } = req.body;
  try {
    const created = await insertAnnouncement(req.user.id, title, message);
    res.status(201).json(created);
  } catch (err) {
    res.status(403).json({ msg: err.message });
  }
});


router.put("/:id", verifyToken, async (req, res) => {
  const { title, message } = req.body;
  const id = parseInt(req.params.id);
  try {
    const updated = await updateAnnouncement(req.user.id, id, title, message);
    res.json(updated);
  } catch (err) {
    res.status(403).json({ msg: err.message });
  }
});



router.delete("/:id", verifyToken, async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await softDeleteAnnouncement(req.user.id, id);
    res.json({ msg: "Oznam bol vymazaný." });
  } catch (err) {
    res.status(403).json({ msg: err.message });
  }
});

export default router;
