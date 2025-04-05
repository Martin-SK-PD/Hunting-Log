import express from "express";
import verifyToken from "../../middleware/verifyToken.js";
import { getUserAreas, createArea, softDeleteAreaAndStructures, updateAreaName} from "../../models/areas.js";

const router = express.Router();


router.post("/", verifyToken, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ msg: "Chýba názov oblasti." });

  try {
    const area = await createArea(req.user.id, name);
    res.status(201).json(area);
  } catch (err) {
    console.error("Chyba pri vytváraní oblasti:", err);
    res.status(500).json({ msg: err.message });
  }
});



router.get("/", verifyToken, async (req, res) => {
  try {
    const areas = await getUserAreas(req.user.id);
    res.json(areas.rows); 
  } catch (err) {
    console.error("Chyba pri načítaní oblastí:", err);
    res.status(500).json({ msg: "Server error" });
  }
});



router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await softDeleteAreaAndStructures(req.user.id, req.params.id);
    res.json({ msg: "Oblasť a všetky jej štruktúry boli vymazané." });
  } catch (err) {
    console.error("Chyba pri mazaní oblasti a štruktúr:", err);
    res.status(500).json({ msg: "Chyba pri mazaní oblasti." });
  }
});



router.put("/:id", verifyToken, async (req, res) => {
  const { name } = req.body;
  const areaId = req.params.id;

  if (!name) return res.status(400).json({ msg: "Chýba nový názov oblasti." });

  try {
    const updated = await updateAreaName(req.user.id, areaId, name);
    res.json(updated);
  } catch (err) {
    console.error("Chyba pri úprave oblasti:", err.message);
    res.status(500).json({ msg: err.message });
  }
});


export default router;
