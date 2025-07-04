import express from "express";
import verifyToken from "../../middleware/verifyToken.js";
import { getVisitsByFilters, createVisitWithChecks, updateVisitWithChecks, 
         getLastVisit, getPlannedVisits, softDeleteVisitAndRecords} from "../../models/visits.js";

const router = express.Router();



router.get("/", verifyToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await getVisitsByFilters(userId, req.query);
    res.json(result);
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
  const {hunting_area_id , start_datetime, structure_id, end_datetime, purpose, notes } = req.body;

  if (!structure_id && structure_id !== null) return res.status(400).json({ msg: "Neplatné ID štruktúry" });
  if (end_datetime && isNaN(new Date(end_datetime))) return res.status(400).json({ msg: "Neplatný čas ukončenia" });

  try {
    const result = await updateVisitWithChecks(userId, visitId, {
      hunting_area_id,
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


router.get("/planned", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await getPlannedVisits(userId);
    res.json(result.rows);
  } catch (err) {
    console.error("Chyba pri načítaní plánovaných návštev:", err.message);
    res.status(500).json({ msg: "Chyba servera pri načítaní plánovaných návštev" });
  }
});


router.get("/last", verifyToken, async (req, res) => {
  const userId = req.user.id;
  
  try {
    const result = await getLastVisit(userId);
    if (result.rowCount === 0) return res.status(404).json({ msg: "Žiadna ukončená návšteva" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Chyba pri získavaní poslednej návštevy:", err.message);
    res.status(500).json({ msg: "Chyba servera pri načítaní poslednej návštevy" });
  }
});




router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const success = await softDeleteVisitAndRecords(req.user.id, req.params.id);
    if (!success) return res.status(403).json({ msg: "Nemáš oprávnenie vymazať túto návštevu." });
    res.json({ msg: "Návšteva a prípadné úlovky boli vymazané." });
  } catch (err) {
    console.error("Chyba pri mazaní návštevy:", err.message);
    res.status(500).json({ msg: "Chyba servera." });
  }
});

export default router;


