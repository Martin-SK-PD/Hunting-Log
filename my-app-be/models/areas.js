import pool from "../db.js";

export async function getUserAreas(userId) {
  return pool.query(`
    SELECT a.id, a.name
    FROM hunting_areas a
    JOIN user_hunting_ground u ON u.hunting_ground_id = a.hunting_ground_id
    WHERE u.user_id = $1 AND a.is_deleted = false
    ORDER BY a.name
  `, [userId]);
}

export async function createArea(userId, name) {
  const res = await pool.query(`
    SELECT hunting_ground_id FROM user_hunting_ground WHERE user_id = $1
  `, [userId]);

  if (res.rowCount === 0) throw new Error("Používateľ nemá priradený revír.");
  const groundId = res.rows[0].hunting_ground_id;

  return pool.query(`
    INSERT INTO hunting_areas (name, hunting_ground_id)
    VALUES ($1, $2)
    RETURNING *
  `, [name, groundId]);
}



export async function softDeleteAreaAndStructures(userId, areaId) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const res = await client.query(`
      SELECT a.id
      FROM hunting_areas a
      JOIN user_hunting_ground u ON u.hunting_ground_id = a.hunting_ground_id
      WHERE a.id = $1 AND u.user_id = $2
    `, [areaId, userId]);

    if (res.rowCount === 0) {
      throw new Error("Oblasť neexistuje alebo nemáte oprávnenie.");
    }

    await client.query(`UPDATE hunting_areas SET is_deleted = true WHERE id = $1`, [areaId]);
    await client.query(`UPDATE structures SET is_deleted = true WHERE hunting_area_id = $1`, [areaId]);

    await client.query("COMMIT");
    return true;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}



export async function updateAreaName(userId, areaId, newName) {
  const result = await pool.query(`
    UPDATE hunting_areas
    SET name = $1
    WHERE id = $2
      AND hunting_ground_id = (
        SELECT hunting_ground_id FROM user_hunting_ground WHERE user_id = $3
      )
      AND is_deleted = false
    RETURNING *
  `, [newName, areaId, userId]);

  if (result.rowCount === 0) throw new Error("Nepodarilo sa upraviť oblasť.");
  return result.rows[0];
}
