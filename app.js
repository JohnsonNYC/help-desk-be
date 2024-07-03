require("dotenv").config();

const cors = require("cors");
const express = require("express");

const app = express();

//Middleware to parse JSON
app.use(
  cors({
    origin: true, // Adjust according to your frontend's URL
    methods: ["GET", "POST", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

const ticketRouter = require("./routers/tickets");
app.use(ticketRouter);

module.exports = app;
