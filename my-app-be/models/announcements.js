
import pool from "../db.js";


export async function getAnnouncementsForUser(userId) {
  return pool.query(`
    SELECT a.id, a.title, a.message, a.created_at
    FROM announcements a
    JOIN user_hunting_ground uhg ON uhg.hunting_ground_id = a.hunting_ground_id
    WHERE uhg.user_id = $1 AND a.is_deleted = FALSE
    ORDER BY a.created_at DESC
  `, [userId]);
}



export async function insertAnnouncement(userId, title, message) {
  const result = await pool.query(`
    SELECT hunting_ground_id FROM user_hunting_ground
    WHERE user_id = $1 AND role = 'Admin'
  `, [userId]);

  if (result.rowCount === 0) throw new Error("Nemáte oprávnenie vytvoriť oznam.");

  const groundId = result.rows[0].hunting_ground_id;

  const insertRes = await pool.query(`
    INSERT INTO announcements (hunting_ground_id, created_by, title, message)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `, [groundId, userId, title, message]);

  return insertRes.rows[0];
}


export async function updateAnnouncement(userId, id, title, message) {
  const check = await pool.query(`
    SELECT a.hunting_ground_id FROM announcements a
    JOIN user_hunting_ground uhg ON uhg.hunting_ground_id = a.hunting_ground_id
    WHERE a.id = $1 AND uhg.user_id = $2 AND uhg.role = 'Admin' AND a.is_deleted = FALSE
  `, [id, userId]);

  if (check.rowCount === 0) throw new Error("Nemáte oprávnenie upraviť tento oznam.");

  const result = await pool.query(`
    UPDATE announcements
    SET title = $1, message = $2
    WHERE id = $3
    RETURNING *
  `, [title, message, id]);

  return result.rows[0];
}


export async function softDeleteAnnouncement(userId, id) {
  const check = await pool.query(`
    SELECT a.hunting_ground_id FROM announcements a
    JOIN user_hunting_ground uhg ON uhg.hunting_ground_id = a.hunting_ground_id
    WHERE a.id = $1 AND uhg.user_id = $2 AND uhg.role = 'Admin' AND a.is_deleted = FALSE
  `, [id, userId]);

  if (check.rowCount === 0) throw new Error("Nemáte oprávnenie vymazať tento oznam.");

  return pool.query(`
    UPDATE announcements
    SET is_deleted = TRUE
    WHERE id = $1
  `, [id]);
}
