import pool from "../db.js";

export async function getVisitsByUser(userId) {
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




export async function getVisitsByFilters(userId, filters) {
  const baseQuery = `
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
  `;

  const conditions = [];
  const values = [userId];

  if (filters.date) {
    values.push(filters.date);
    conditions.push(`DATE(v.start_datetime) = $${values.length}`);
  }

  if (filters.hunter) {
    values.push(`%${filters.hunter}%`);
    conditions.push(`(u.first_name || ' ' || u.last_name) ILIKE $${values.length}`);
  }

  if (filters.location) {
    values.push(`%${filters.location}%`);
    conditions.push(`(a.name ILIKE $${values.length} OR s.name ILIKE $${values.length})`);
  }

  if (filters.purpose) {
    values.push(filters.purpose);
    conditions.push(`v.purpose = $${values.length}`);
  }

  const query = baseQuery +
    (conditions.length ? ` AND ${conditions.join(" AND ")}` : "") +
    ` ORDER BY v.start_datetime DESC`;

  const result = await pool.query(query, values);
  return result.rows;
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

    // zisti revír a rolu používateľa
    const userGroundRes = await client.query(`
      SELECT hunting_ground_id, role 
      FROM user_hunting_ground 
      WHERE user_id = $1
    `, [userId]);

    if (userGroundRes.rowCount === 0) throw new Error("Používateľ nie je členom žiadneho revíru");
    const { hunting_ground_id, role } = userGroundRes.rows[0];

    // zisti návštevu
    const visitRes = await client.query(`
      SELECT v.*, a.hunting_ground_id 
      FROM visits v
      JOIN hunting_areas a ON v.hunting_area_id = a.id
      WHERE v.id = $1 AND v.is_deleted = false
    `, [visitId]);

    if (visitRes.rowCount === 0) throw new Error("Návšteva neexistuje alebo bola vymazaná");

    const visit = visitRes.rows[0];

    // kontrola oprávnenia
    if (role !== "Admin" && visit.hunter_id !== userId) {
      throw new Error("Nemáte oprávnenie upravovať túto návštevu.");
    }

    const areaCheck = await client.query(`
      SELECT * FROM hunting_areas
      WHERE id = $1
        AND hunting_ground_id = $2
        AND is_deleted = false
    `, [updates.hunting_area_id, hunting_ground_id]);

    if (areaCheck.rowCount === 0) {
      throw new Error("Neplatná oblasť pre tento revír.");
    }

    // kontrola - ak existuje úlovok a účel sa mení alebo meníme čas
    const records = await client.query(`
      SELECT * FROM hunting_records 
      WHERE visit_id = $1 AND is_deleted = false
    `, [visitId]);

    if (records.rowCount > 0) {
      const shotTimes = records.rows.map(r => new Date(r.date_time));
      const minShot = new Date(Math.min(...shotTimes));
      const maxShot = new Date(Math.max(...shotTimes));
    
      if (updates.start_datetime && new Date(updates.start_datetime) > minShot) {
        throw new Error("Začiatok návštevy musí byť pred časom úlovku.");
      }
    
      if (updates.end_datetime &&
          (new Date(visit.start_datetime) > new Date(updates.end_datetime) ||
           new Date(updates.end_datetime) < minShot ||
           new Date(updates.end_datetime) < maxShot)) {
        throw new Error("Úprava konca návštevy by spôsobila nesúlad s časom úlovku.");
      }
    
      if (updates.purpose && updates.purpose !== visit.purpose) {
        throw new Error("Nie je možné meniť účel návštevy, ktorá má úlovok.");
      }
    }

    // vykonanie aktualizácie návštevy
    const updated = await client.query(`
      UPDATE visits SET 
        hunting_area_id = $1,
        structure_id = $2,
        start_datetime = $3,
        end_datetime = $4,
        purpose = $5,
        notes = $6,
        updated_at = NOW()
      WHERE id = $7
      RETURNING *
    `, [
      updates.hunting_area_id,
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



export async function getPlannedVisits(userId) {
  return pool.query(`
    SELECT v.id, v.start_datetime, v.end_datetime, v.purpose, v.notes,
           a.name AS area_name,
           s.name AS structure_name
    FROM visits v
    JOIN hunting_areas a ON v.hunting_area_id = a.id
    LEFT JOIN structures s ON v.structure_id = s.id
    WHERE v.hunter_id = $1
      AND v.start_datetime > NOW()
      AND v.is_deleted = false
    ORDER BY v.start_datetime ASC, v.id
  `, [userId]);
}


export async function getLastVisit(userId) {
  return pool.query(`
    SELECT v.*, 
           (u.first_name || ' ' || u.last_name) AS hunter_name,
           a.name AS area_name,
           s.name AS structure_name
    FROM visits v
    JOIN users u ON v.hunter_id = u.id
    JOIN hunting_areas a ON v.hunting_area_id = a.id
    LEFT JOIN structures s ON v.structure_id = s.id
    WHERE v.hunter_id = $1
      AND v.start_datetime < Now()
      AND v.is_deleted = false
    ORDER BY v.start_datetime DESC
    LIMIT 1
  `, [userId]);
}


export async function softDeleteVisitAndRecords(userId, visitId) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Overenie, či je používateľ admin v danom revíri
    const isAdmin = await client.query(`
      SELECT 1
      FROM visits v
      JOIN hunting_areas ha ON v.hunting_area_id = ha.id
      JOIN user_hunting_ground uhg ON uhg.hunting_ground_id = ha.hunting_ground_id
      WHERE v.id = $1 AND uhg.user_id = $2 AND uhg.role = 'Admin' AND v.is_deleted = false
    `, [visitId, userId]);

    if (isAdmin.rowCount === 0) {
      await client.query("ROLLBACK");
      return false; // nie je admin v revíri – zakázať vymazanie
    }

    // Soft delete úlovkov
    await client.query(`
      UPDATE hunting_records
      SET is_deleted = true
      WHERE visit_id = $1
    `, [visitId]);

    // Soft delete návštevy
    const result = await client.query(`
      UPDATE visits
      SET is_deleted = true
      WHERE id = $1
    `, [visitId]);

    await client.query("COMMIT");
    return result.rowCount > 0;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}