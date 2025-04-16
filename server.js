// server.js

require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
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
      database: process.env.DB_NAME || 'your_database'
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
    res.status(500).json({ error: 'Failed to save booking' });
  }
});

// Get all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM bookings ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load bookings' });
  }
});

// Delete booking
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    await db.execute('DELETE FROM bookings WHERE id = ?', [req.params.id]);
    res.json({ message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

// Update booking
app.put('/api/bookings/:id', async (req, res) => {
  const { name, email, date, time, service } = req.body;
  try {
    await db.execute(
      'UPDATE bookings SET name = ?, email = ?, date = ?, time = ?, service = ? WHERE id = ?',
      [name, email, date, time, service, req.params.id]
    );
    res.json({ message: 'Booking updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
