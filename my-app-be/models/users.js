import pool from "../db.js";

export async function getUsersInSameGround(adminId) {
    return pool.query(`
        SELECT u.id, u.first_name,u.email, u.last_name, u.username, u.street, u.house_number, u.postal_code, u.city
        FROM users u
        JOIN user_hunting_ground uhg ON u.id = uhg.user_id
        WHERE uhg.hunting_ground_id = (
        SELECT hunting_ground_id FROM user_hunting_ground WHERE user_id = $1
        )
        ORDER BY u.last_name, u.first_name
    `, [adminId]);
}

export async function transferAdminRole(currentAdminId, newAdminId) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
  

        // revír aktuálneho admina
        const res = await client.query(`
          SELECT hunting_ground_id FROM user_hunting_ground WHERE user_id = $1
        `, [currentAdminId]);
  
        if (res.rowCount === 0) throw new Error("Nebolo možné nájsť revír pre aktuálneho admina.");
  
        const groundId = res.rows[0].hunting_ground_id;
  

        // Nový admin patrí do rovnakého revíru?
        const checkNew = await client.query(`
            SELECT 1 FROM user_hunting_ground 
            WHERE user_id = $1 AND hunting_ground_id = $2
        `, [newAdminId, groundId]);
  
        if (checkNew.rowCount === 0) {
            throw new Error("Budúci admin nepatrí do rovnakého revíru.");
        }
  

        // zmena admina
        await client.query(`
            UPDATE user_hunting_ground
            SET role = CASE 
              WHEN user_id = $1 THEN 'Hunter'
              WHEN user_id = $2 THEN 'Admin'
              ELSE role
            END
            WHERE hunting_ground_id = $3
          `, [currentAdminId, newAdminId, groundId]);
  
        await client.query("COMMIT");
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
    client.release();
    }
}



export async function getUserWithGroundInfo(userId) {
    
    const res = await pool.query(
      `
      SELECT 
        u.first_name, u.last_name,
        hg.name AS ground_name
      FROM users u
      JOIN user_hunting_ground uhg ON uhg.user_id = u.id
      JOIN hunting_grounds hg ON hg.id = uhg.hunting_ground_id
      WHERE u.id = $1
      `,
      [userId]
    );
    return res.rows[0] || null;
}