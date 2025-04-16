require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const cors = require('cors'); // Import CORS
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow all CORS requests (this should be before any routes)
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
let db;
(async () => {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'your_database_myg'
    });
    console.log("✅ Connected to MySQL database.");
  } catch (err) {
    console.error("❌ Error connecting to database:", err);
  }
})();

// API routes

// Create a booking
app.post('/api/book', async (req, res) => {
  const { name, email, date, time, service } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO bookings (name, email, date, time, service) VALUES (?, ?, ?, ?, ?)',
      [name, email, date, time, service]
    );
    res.json({ message: 'Booking added', bookingId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '
