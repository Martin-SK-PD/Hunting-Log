import express from "express";
import verifyToken from "../../middleware/verifyToken.js";
import { getVisitsByUser, createVisitWithChecks, updateVisitWithChecks, getLastVisit, getPlannedVisits } from "../../models/visits.js";

const router = express.Router();



router.get("/", verifyToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await getVisitsByUser(userId);
    res.json(result.rows);
  } catch (err) {
    console.error("Chyba pri načítaní návštev:", err.message);
    res.status(500).json({ msg: "Chyba servera pri načítaní návštev" });
  }
});


router.post("/", verifyToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const newVisit = await createVisitWithChecks(userId, req.body);
    res.status(201).json(newVisit);
  } catch (err) {
    console.error("Chyba pri vytváraní návštevy:", err.message);
    res.status(400).json({ msg: err.message });
  }
});


router.put("/:id", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const visitId = parseInt(req.params.id, 10);
  const {start_datetime, structure_id, end_datetime, purpose, notes } = req.body;

  if (!structure_id && structure_id !== null) return res.status(400).json({ msg: "Neplatné ID štruktúry" });
  if (end_datetime && isNaN(new Date(end_datetime))) return res.status(400).json({ msg: "Neplatný čas ukončenia" });

  try {
    const result = await updateVisitWithChecks(userId, visitId, {
      structure_id,
      start_datetime,
      end_datetime,
      purpose,
      notes
    });
    res.json(result);
  } catch (err) {
    console.error("Chyba pri úprave návštevy:", err.message);
    res.status(400).json({ msg: err.message });
  }
});



export default router;