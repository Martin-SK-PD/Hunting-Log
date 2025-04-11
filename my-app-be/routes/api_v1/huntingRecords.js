import express from "express";
import verifyToken from "../../middleware/verifyToken.js";
import {  validateVisitForHunting, getHuntingRecordsByFilters,
   insertHuntingRecord, getMonthlyStats, updateHuntingRecordWithChecks,
  softDeleteHuntingRecord } from "../../models/huntingRecords.js";


const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const filters = req.query;
    const records = await getHuntingRecordsByFilters(userId, filters);
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chyba pri načítaní úlovkov" });
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



router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const result = await softDeleteHuntingRecord(req.user.id, req.params.id);
    if (result.rowCount === 0) return res.status(403).json({ msg: "Záznam sa nepodarilo vymazať." });
    res.json({ msg: "Záznam bol vymazaný." });
  } catch (err) {
    res.status(500).json({ msg: "Chyba servera." });
  }
});




router.put("/:id", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;
  const recordId = parseInt(req.params.id, 10);
  const { animal, weight, date_time, visit_id } = req.body;

  try {
    const updated = await updateHuntingRecordWithChecks(userId, recordId, {
      animal,
      weight,
      date_time,
      visit_id
    });
    res.json(updated);
  } catch (err) {
    console.error("Chyba pri úprave úlovku:", err.message);
    res.status(400).json({ msg: err.message });
  }
});

export default router;


