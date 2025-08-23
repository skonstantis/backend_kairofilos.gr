const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const validator = require("validator");

router.post("/", async (req, res) => {
  const errors = [];

  if (!req.body) {
    errors.push("Request body is missing");
    return res.status(400).json({ errors });
  }

  const { username, email, password } = req.body || {};

  if (!username) errors.push("Username is required");
  if (!email) errors.push("Email is required");
  if (!password) errors.push("Password is required");
  
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  if (email && !validator.isEmail(email)) 
  {
    errors.push("Invalid email format");
    return res.status(400).json({ errors });
  }

  try {
    const existing = await pool.query(
      "SELECT username, email FROM users WHERE username=$1 OR email=$2",
      [username, email]
    );

    if (existing.rows.some(u => u.username === username)) errors.push("Username already exists");
    if (existing.rows.some(u => u.email === email)) errors.push("Email already exists");

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at",
      [username, email, hashedPassword]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    errors.push("Server error");
    res.status(500).json({ errors });
  }
});

module.exports = router;
