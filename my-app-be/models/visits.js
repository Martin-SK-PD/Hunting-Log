import pool from "../db.js";

export function getVisitsByUser(userId) {
  return pool.query(`
    SELECT
      v.id,
      v.hunter_id, 
      (u.first_name || ' ' || u.last_name) AS hunter_name,
      a.name AS area_name,
      s.name AS structure_name,
      v.purpose,
      v.start_datetime,
      v.end_datetime,
      v.notes,
      v.updated_at
    FROM visits v
    JOIN users u ON v.hunter_id = u.id
    JOIN hunting_areas a ON v.hunting_area_id = a.id
    LEFT JOIN structures s ON v.structure_id = s.id
    JOIN user_hunting_ground uhg ON uhg.hunting_ground_id = a.hunting_ground_id
    WHERE uhg.user_id = $1 AND v.is_deleted = false
    ORDER BY v.start_datetime DESC
  `, [userId]);
}

export async function createVisitWithChecks(userId, data) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const rev = await client.query(
      `SELECT hunting_ground_id FROM user_hunting_ground WHERE user_id = $1`,
      [userId]
    );
    if (rev.rowCount === 0) throw new Error("Používateľ nepatrí do žiadneho revíru");
    const groundId = rev.rows[0].hunting_ground_id;

    const area = await client.query(
      `SELECT * FROM hunting_areas WHERE id = $1 AND hunting_ground_id = $2 AND is_deleted = false`,
      [data.hunting_area_id, groundId]
    );
    if (area.rowCount === 0) throw new Error("Neplatná oblasť");

    if (data.structure_id) {
      const structure = await client.query(
        `SELECT * FROM structures WHERE id = $1 AND hunting_area_id = $2 AND is_deleted = false`,
        [data.structure_id, data.hunting_area_id]
      );
      if (structure.rowCount === 0) throw new Error("Neplatná štruktúra");
    }

    const start = new Date(data.start_datetime);
    const end = new Date(data.end_datetime);
    if (end && end <= start) {
      throw new Error("Dátum konca musí byť neskorší ako dátum začiatku.");
    }

    const result = await client.query(
      `INSERT INTO visits (hunter_id, hunting_area_id, structure_id, start_datetime, end_datetime, purpose, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        userId,
        data.hunting_area_id,
        data.structure_id || null,
        data.start_datetime,
        data.end_datetime || null,
        data.purpose,
        data.notes || null
      ]
    );

    await client.query("COMMIT");
    return result.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}


export async function updateVisitWithChecks(userId, visitId, updates) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    
    const visitRes = await client.query(`
      SELECT * FROM visits WHERE id = $1 AND hunter_id = $2 AND is_deleted = false
    `, [visitId, userId]);

    if (visitRes.rowCount === 0) throw new Error("Návšteva neexistuje alebo nie je vaša");

    const visit = visitRes.rows[0];


    // ak existuje úlovok a účel sa mení alebo meníme čas
    const records = await client.query(`SELECT * FROM hunting_records WHERE visit_id = $1 AND is_deleted = false`, [visitId]);
    if (records.rowCount > 0) {
      const shotTimes = records.rows.map(r => new Date(r.date_time));
      const minShot = new Date(Math.min(...shotTimes));
      const maxShot = new Date(Math.max(...shotTimes));

      if (
        updates.end_datetime &&
        (new Date(visit.start_datetime) > new Date(updates.end_datetime) || new Date(updates.end_datetime) < minShot || new Date(updates.end_datetime) < maxShot)
      ) {
        throw new Error("Úprava konca návštevy by spôsobila nesúlad s časom úlovku.");
      }

      if (updates.purpose && updates.purpose !== visit.purpose) {
        throw new Error("Nie je možné meniť účel návštevy, ktorá má úlovok.");
      }
    }

    // kontrola štruktúry (ak sa mení)
    if (updates.structure_id) {
      const sCheck = await client.query(`
        SELECT * FROM structures WHERE id = $1 AND hunting_area_id = $2 AND is_deleted = false
      `, [updates.structure_id, visit.hunting_area_id]);
      if (sCheck.rowCount === 0) throw new Error("Neplatná štruktúra");
    }

    const updated = await client.query(`
      UPDATE visits SET 
        structure_id = $1,
        start_datetime = $2,
        end_datetime = $3,
        purpose = $4,
        notes = $5,
        updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `, [
      updates.structure_id || null,
      updates.start_datetime,
      updates.end_datetime || null,
      updates.purpose,
      updates.notes || null,
      visitId
    ]);

    await client.query("COMMIT");
    return updated.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}


