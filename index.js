const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const port = 8080;

require("dotenv").config();

//CORS Configs
const corsOptions = {
  origin: process.env.DEV_FE_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

//Middleware to parse JSON
app.use(cors(corsOptions));
app.use(express.json());

//Create a PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HSOT,
  database: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

app.put("/tickets/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, description, status } = req.body;

  try {
    const result = await pool.query(
      "UPDATE tickets SET name = $1, email = $2, description = $3, status = $4 WHERE ticket_id = $5 RETURNING *",
      [name, email, description, status, id]
    );
    if (result.rowCount > 0) {
      const updatedTicket = result.rows[0];
      res.status(200).json({ status: 200, ticket: updatedTicket });
    } else {
      res.status(404).json({ error: "Ticket not found" });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/tickets", async (req, res) => {
  const { name, email, description } = req.body;

  const status = 0; // new: 0, pending: 1, complete:2

  try {
    const result = await pool.query(
      "INSERT INTO tickets (name, email, description, status) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, description, status]
    );

    if (result.rowCount > 0) {
      //Successful Insertion
      const createdTicketId = result.rows[0];

      res.status(201).json({ status: 200, ticket: createdTicketId });
    } else {
      // No Row Affected
      res.status(500).json({ status: 500, error: "Failed to insert ticket" });
    }
  } catch (e) {
    res.status(500).json({ status: 500, error: e.message });
  }
});

app.get("/tickets", async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM tickets`);
    res.status(200).json({ status: 200, tickets: result.rows });
  } catch (e) {
    res.status(500).json({ status: 500, error: e.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on PORT:${port}`);
});
