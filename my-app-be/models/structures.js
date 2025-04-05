import pool from "../db.js";

export async function getStructuresInArea(userId, areaId) {
  return pool.query(`
    SELECT s.id, s.name, s.type, s.notes
    FROM structures s
    JOIN hunting_areas a ON s.hunting_area_id = a.id
    JOIN user_hunting_ground u ON u.hunting_ground_id = a.hunting_ground_id
    WHERE u.user_id = $1 AND s.hunting_area_id = $2 AND s.is_deleted = false
    ORDER BY s.name
  `, [userId, areaId]);
}

export async function createStructure(userId, areaId, name, type, notes) {
  const res = await pool.query(`
    SELECT a.id
    FROM hunting_areas a
    JOIN user_hunting_ground u ON u.hunting_ground_id = a.hunting_ground_id
    WHERE u.user_id = $1 AND a.id = $2 AND a.is_deleted = false
  `, [userId, areaId]);

  if (res.rowCount === 0) throw new Error("Neplatná alebo neprístupná oblasť.");

  return pool.query(`
    INSERT INTO structures (hunting_area_id, name, type, notes)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `, [areaId, name, type, notes]);
}

export async function softDeleteStructure(userId, structureId) {
  const result = await pool.query(`
    UPDATE structures
    SET is_deleted = true
    WHERE id = $1
      AND hunting_area_id IN (
        SELECT a.id
        FROM hunting_areas a
        JOIN user_hunting_ground u ON u.hunting_ground_id = a.hunting_ground_id
        WHERE u.user_id = $2
      )
  `, [structureId, userId]);

  return result.rowCount > 0; 
}


export async function updateStructure(userId, structureId, name, type, notes) {
  const result = await pool.query(`
    UPDATE structures
    SET name = $1, type = $2, notes = $3
    WHERE id = $4
      AND hunting_area_id IN (
        SELECT a.id
        FROM hunting_areas a
        JOIN user_hunting_ground u ON u.hunting_ground_id = a.hunting_ground_id
        WHERE u.user_id = $5
      )
      AND is_deleted = false
  `, [name, type, notes, structureId, userId]);

  return result.rowCount > 0;
}