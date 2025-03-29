import express from "express";
import verifyToken from "../../middleware/verifyToken.js";
import { getHuntingRecordsByUser, validateVisitForHunting,  insertHuntingRecord} from "../../models/huntingRecords.js";


const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await getHuntingRecordsByUser(userId);
    res.json(result.rows);
  } catch (err) {
    console.error("Chyba pri získavaní úlovkov:", err.message);
    res.status(500).json({ msg: "Error getting hunting records" });
  }
});



router.post("/", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { visit_id, animal, weight, date_time } = req.body;

  try {
    const shotTime = new Date(date_time);
    await validateVisitForHunting(userId, visit_id, shotTime);
    const newRecord = await insertHuntingRecord({ visit_id, animal, weight, date_time });
    res.status(201).json(newRecord);
  } catch (err) {
    console.error("Chyba pri ukladaní úlovku:", err.message);
    res.status(400).json({ msg: err.message });
  }
});


router.get("/monthly-stats", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await getMonthlyStats(userId);
    res.json(result.rows);
  } catch (err) {
    console.error("Chyba pri načítaní štatistík:", err.message);
    res.status(500).json({ msg: "Chyba pri načítaní mesačných štatistík" });
  }
});

export default router;


