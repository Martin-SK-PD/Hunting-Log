import express from "express";
import bcrypt from "bcryptjs";
import pool from "../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
 
  const {
    username, email, password, first_name, last_name, 
    street, house_number, postal_code, city, 
    is_admin, hunting_ground_id, hunting_ground_name
  } = req.body;

  try {

    if (
      !username || !email || !password || !first_name || !last_name ||
      !street || !house_number || !postal_code || !city ||
      !hunting_ground_id ||
      (is_admin && !hunting_ground_name)
    ) {
      return res.status(400).json({ error: "Missing required registration fields" });
    }



    // Overenie, či užívateľ s daným emailom alebo menom už existuje
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );
    if (userExists.rows.length > 0) {
      return res.status(401).json({ error: "Používateľ s týmto emailom alebo používateľským menom už existuje." });
    }



    const groundCheck = await pool.query(
      "SELECT * FROM hunting_grounds WHERE id = $1",
      [parseInt(hunting_ground_id)]
    );

    if (is_admin) {
      // Ak je admin, revír nesmie existovať
      if (groundCheck.rows.length > 0) {
        return res.status(400).json({ error: "Pre tento revír už existuje spravca, správcu nemožno pridať." });
      }

      // Vytvorenie nového revíru
      await pool.query(
        "INSERT INTO hunting_grounds (id, name) VALUES ($1, $2)",
        [parseInt(hunting_ground_id), hunting_ground_name]
      );

    } else {
      // Ak je hunter, revír musí existovať
      if (groundCheck.rows.length === 0) {
        return res.status(400).json({ error: "Zvolený revír neexistuje." });
      }
    }


    // Hashovanie hesla
    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);


    // Vytvorenie používateľa
    const newUser = await pool.query(
      `INSERT INTO users (username, email, password_hash, first_name, last_name, street, house_number, postal_code, city)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
      [
        username, email, bcryptPassword,
        first_name, last_name,
        street, house_number, postal_code, city
      ]
    );

    const userId = newUser.rows[0].id;

    

    // Priradenie používateľa do user_hunting_ground s príslušnou rolou
    const role = is_admin ? "Admin" : "Hunter";
    console.log("Vkladám do user_hunting_ground:", userId, hunting_ground_id, role);

    await pool.query(
    "INSERT INTO user_hunting_ground (user_id, hunting_ground_id, role) VALUES ($1, $2, $3)",
    [userId, parseInt(hunting_ground_id), role]
    );
    
    return res.status(200).json({ message: "Registration successful" });


  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

export default router;
