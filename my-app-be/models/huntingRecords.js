import pool from "../db.js";
import { adjustDateIfNeeded } from "../utils/adjustDateTime.js";

export function getHuntingRecordsByUser(userId) {
  return pool.query(`
    SELECT 
      hr.id, 
      hr.animal, 
      hr.weight, 
      hr.date_time, 
      (u.first_name || ' ' || u.last_name) AS hunter_name,
      u.username AS hunter_username,
      u.id AS hunter_id,                    
      a.name AS area_name,
      s.name AS structure_name
    FROM hunting_records hr
    JOIN visits v ON hr.visit_id = v.id
    JOIN users u ON v.hunter_id = u.id
    JOIN hunting_areas a ON v.hunting_area_id = a.id
    LEFT JOIN structures s ON v.structure_id = s.id
    JOIN user_hunting_ground uhg ON uhg.hunting_ground_id = a.hunting_ground_id
    WHERE uhg.user_id = $1 AND hr.is_deleted = false
    ORDER BY hr.date_time DESC
  `, [userId]);
}



export async function getHuntingRecordsByFilters(userId, filters = {}) {
  const values = [userId];
  let conditions = [`uhg.user_id = $1`, `hr.is_deleted = false`];

  if (filters.month) {
    const [year, m] = filters.month.split("-");
    values.push(year, m);
    conditions.push(`EXTRACT(YEAR FROM hr.date_time) = $${values.length - 1}`);
    conditions.push(`EXTRACT(MONTH FROM hr.date_time) = $${values.length}`);
  }

  if (filters.hunter) {
    values.push(`%${filters.hunter}%`);
    conditions.push(`(u.first_name || ' ' || u.last_name) ILIKE $${values.length}`);
  }

  if (filters.location) {
    values.push(`%${filters.location}%`);
    conditions.push(`(a.name ILIKE $${values.length} OR s.name ILIKE $${values.length})`);
  }

  if (filters.animal) {
    values.push(`%${filters.animal}%`);
    conditions.push(`hr.animal ILIKE $${values.length}`);
  }

  const result = await pool.query(`
    SELECT
      hr.*,
      (u.first_name || ' ' || u.last_name) AS hunter_name,
      a.name AS area_name,
      s.name AS structure_name,
      v.hunter_id
    FROM hunting_records hr
    JOIN visits v ON hr.visit_id = v.id
    JOIN users u ON v.hunter_id = u.id
    JOIN hunting_areas a ON v.hunting_area_id = a.id
    LEFT JOIN structures s ON v.structure_id = s.id
    JOIN user_hunting_ground uhg ON uhg.hunting_ground_id = a.hunting_ground_id
    WHERE ${conditions.join(" AND ")}
    ORDER BY hr.date_time DESC
  `, values);

  return result.rows;
}



export async function validateVisitForHunting(userId, visitId, shotTime, isAdmin = false) {
  const params = isAdmin ? [visitId] : [visitId, userId];
  const query = `
    SELECT * FROM visits
    WHERE id = $1
      ${isAdmin ? "" : "AND hunter_id = $2"}
      AND purpose = 'Lov'
      AND is_deleted = false
  `;

  const result = await pool.query(query, params);
  if (result.rowCount === 0) throw new Error("Neplatná návšteva pre úlovok");

  const visit = result.rows[0];

  const visitStart = new Date(visit.start_datetime);
  const visitEnd = new Date(visit.end_datetime);

  if (shotTime < visitStart || shotTime > visitEnd) {
    throw new Error("Čas úlovku nie je v rozsahu návštevy");
  }

  if (shotTime > new Date()) {
    throw new Error("Čas úlovku nemôže byť v budúncnosti");
  }

  return visit;
}


export async function insertHuntingRecord({ visit_id, animal, weight, date_time }) {
  const adjustedDateTime = adjustDateIfNeeded(date_time, { fromBrowser: true });

  await validateVisitForHunting(null, visit_id, adjustedDateTime, true);

  const result = await pool.query(
    `INSERT INTO hunting_records (visit_id, animal, weight, date_time)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [visit_id, animal, weight, adjustedDateTime]
  );

  return result.rows[0];
}

export async function getMonthlyStats(userId) {
  return pool.query(`
    SELECT 
      animal,
      COUNT(*) AS count_per_animal
    FROM (
      SELECT DISTINCT ON (hr.id) hr.*
      FROM hunting_records hr
      JOIN visits v ON hr.visit_id = v.id
      JOIN hunting_areas a ON v.hunting_area_id = a.id
      JOIN user_hunting_ground uhg ON uhg.hunting_ground_id = a.hunting_ground_id
      WHERE v.hunter_id = $1
        AND hr.is_deleted = false
        AND DATE_TRUNC('month', hr.date_time) = DATE_TRUNC('month', NOW())
    ) sub
    GROUP BY animal
  `, [userId]);
}

export async function softDeleteHuntingRecord(userId, recordId) {
  return pool.query(`
    UPDATE hunting_records
    SET is_deleted = true
    WHERE id = $1 AND visit_id IN (
      SELECT v.id
      FROM visits v
      JOIN user_hunting_ground u ON u.hunting_ground_id = (SELECT hunting_ground_id FROM user_hunting_ground WHERE user_id = $2)
      WHERE v.id = hunting_records.visit_id
    )
  `, [recordId, userId]);
}

export async function updateHuntingRecordWithChecks(userId, recordId, updates) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const recordRes = await client.query(`
      SELECT hr.*, v.hunter_id, v.id AS visit_id, a.hunting_ground_id
      FROM hunting_records hr
      JOIN visits v ON hr.visit_id = v.id
      JOIN hunting_areas a ON v.hunting_area_id = a.id
      WHERE hr.id = $1 AND hr.is_deleted = false
    `, [recordId]);

    if (recordRes.rowCount === 0) throw new Error("Úlovok neexistuje alebo bol vymazaný.");

    const record = recordRes.rows[0];

    const userGroundRes = await client.query(`
      SELECT role FROM user_hunting_ground
      WHERE user_id = $1 AND hunting_ground_id = $2
    `, [userId, record.hunting_ground_id]);

    if (userGroundRes.rowCount === 0) throw new Error("Nemáte oprávnenie meniť tento úlovok.");

    const isAdmin = userGroundRes.rows[0].role === "Admin";

    if (!isAdmin && record.hunter_id !== userId) {
      throw new Error("Nemáte oprávnenie upravovať tento úlovok.");
    }

    const adjustedDateTime = adjustDateIfNeeded(updates.date_time, { fromBrowser: true });

    await validateVisitForHunting(userId, record.visit_id, adjustedDateTime, isAdmin);

    const result = await client.query(`
      UPDATE hunting_records
      SET animal = $1,
          weight = $2,
          date_time = $3
      WHERE id = $4
      RETURNING *
    `, [updates.animal, updates.weight, adjustedDateTime, recordId]);

    await client.query("COMMIT");
    return result.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}