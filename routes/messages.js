const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT m.id, m.timestamp, m.message_text, u.username
      FROM messages m
      JOIN users u ON m.user_id = u.id
      ORDER BY m.timestamp DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
