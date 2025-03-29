import pool from "../db.js";

export function getHuntingRecordsByUser(userId) {
  return pool.query(`
    SELECT hr.id, hr.animal, hr.weight, hr.date_time, 
           (u.first_name || ' ' || u.last_name) AS hunter_name,
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


export async function validateVisitForHunting(userId, visitId, shotTime) {
  const result = await pool.query(
    `SELECT * FROM visits
     WHERE id = $1 AND hunter_id = $2 AND purpose = 'Lov'
       AND is_deleted = false`,
    [visitId, userId]
  );

  if (result.rowCount === 0) throw new Error("Neplatná návšteva pre úlovok");

  const visit = result.rows[0];
  if (shotTime < new Date(visit.start_datetime) || shotTime > new Date(visit.end_datetime)) {
    throw new Error("Čas úlovku nie je v rozsahu návštevy");
  }

  return visit;
}

export async function insertHuntingRecord({ visit_id, animal, weight, date_time }) {
  const result = await pool.query(
    `INSERT INTO hunting_records (visit_id, animal, weight, date_time)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [visit_id, animal, weight, date_time]
  );
  return result.rows[0];
}
