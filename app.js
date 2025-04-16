const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

// Set up MySQL connection

const db = mysql.createConnection({
    host: 'localhost',   // Use 'localhost' for local MySQL server
    user: 'root',        // Default MySQL username in XAMPP
    password: '',        // Default password in XAMPP (empty)
    database: 'your_database_myg'  // Replace with your actual database name
  });
  

// Connect to the database
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to the MySQL database!');
});

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Parse incoming request bodies (for POST requests)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve the homepage
});

// Handle booking form submission
app.post('/book', (req, res) => {
  const { name, email, date, time, service } = req.body;

  const sql = 'INSERT INTO bookings (name, email, date, time, service) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, email, date, time, service], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error saving booking');
    }
    res.send('Booking saved successfully');
  });
});

// Get all bookings
app.get('/bookings', (req, res) => {
  const sql = 'SELECT * FROM bookings';
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error retrieving bookings');
    }
    res.json(results);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
