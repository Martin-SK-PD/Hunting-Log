import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "admin",
  port: 5432,
  database: "Hunting_log",
});

export default pool;
