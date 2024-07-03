const express = require("express");
const router = new express.Router();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

/* This is defining a route handler for updating a specific ticket in the database.*/
router.put("/tickets/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, description, status } = req.body;

  try {
    const result = await pool.query(
      "UPDATE tickets SET name = $1, email = $2, description = $3, status = $4 WHERE ticket_id = $5 RETURNING *",
      [name, email, description, status, id]
    );

    if (result && result.rowCount == 0) return;

    const updatedTicket = result.rows[0];
    res.status(200).json({ status: 200, ticket: updatedTicket });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* This is defining a route handler for creating a new ticket in the database*/
router.post("/tickets", async (req, res) => {
  const { name, email, description } = req.body;

  const status = 0; // new: 0, pending: 1, complete:2

  try {
    const result = await pool.query(
      "INSERT INTO tickets (name, email, description, status) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, description, status]
    );

    if (result && result.rowCount == 0) return;

    const createdTicketId = result.rows[0];
    res.status(201).json({ status: 200, ticket: createdTicketId });
  } catch (e) {
    res.status(500).json({ status: 500, error: e.message });
  }
});

/* This is defining a route handler for handling GET requests to select all records from the "tickets" table in the database */
router.get("/tickets", async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM tickets`);
    res.status(200).json({ status: 200, tickets: result.rows });
  } catch (e) {
    res.status(500).json({ status: 500, error: e.message });
  }
});

router.get("/", async (req, res) => {
  res.send("Welcome to the Help Desk!!");
});

module.exports = router;
