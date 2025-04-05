import express from "express";
import verifyToken from "../../middleware/verifyToken.js";
import {
  getStructuresInArea,
  createStructure,
  softDeleteStructure,
  updateStructure
} from "../../models/structures.js";

const router = express.Router();

// GET všetky štruktúry v oblasti
router.get("/", verifyToken, async (req, res) => {
  const { area_id } = req.query;
  if (!area_id) return res.status(400).json({ msg: "Chýba area_id" });

  try {
    const structures = await getStructuresInArea(req.user.id, area_id);
    res.json(structures.rows);
  } catch (err) {
    console.error("Chyba pri načítaní štruktúr:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// POST nová štruktúra
router.post("/", verifyToken, async (req, res) => {
  const { area_id, name, type, notes } = req.body;
  if (!area_id || !name || !type)
    return res.status(400).json({ msg: "Chýbajú požadované údaje." });

  try {
    const structure = await createStructure(req.user.id, area_id, name, type, notes || null);
    res.status(201).json(structure);
  } catch (err) {
    console.error("Chyba pri vytváraní štruktúry:", err);
    res.status(500).json({ msg: err.message });
  }
});

// DELETE (soft delete) štruktúra
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const success = await softDeleteStructure(req.user.id, req.params.id);

    if (!success) return res.status(403).json({ msg: "Štruktúru sa nepodarilo vymazať." });
    res.json({ msg: "Štruktúra bola vymazaná." });
  } catch (err) {
    console.error("Chyba pri mazaní štruktúry:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


router.put("/:id", verifyToken, async (req, res) => {
  const { name, type, notes } = req.body;
  if (!name || !type)
    return res.status(400).json({ msg: "Chýbajú požadované údaje." });

  try {
    const success = await updateStructure(
      req.user.id,
      req.params.id,
      name,
      type,
      notes || null
    );

    if (!success) return res.status(403).json({ msg: "Nepodarilo sa upraviť štruktúru." });
    res.json({ msg: "Štruktúra bola aktualizovaná." });
  } catch (err) {
    console.error("Chyba pri úprave štruktúry:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
