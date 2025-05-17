const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    // Add detailed logging
    console.log('Token verification:', {
      token,
      decodedPayload: user,
      userId: user.userId
    });
    
    req.user = user;
    // Add user_id for database compatibility
    req.user.user_id = user.userId;
    
    console.log('Request user object:', {
      user: req.user,
      userId: req.user.userId,
      user_id: req.user.user_id
    });
    
    console.log('Final user object:', {
      originalToken: token,
      decodedUser: user,
      requestUser: req.user,
      userId: req.user.userId,
      user_id: req.user.user_id
    });
    
    next();
  });
};

// MySQL connection
// MySQL connection with connection pool and reconnection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();

// Replace all db.query with pool.query in your code
const db = pool;

// Add connection status check
setInterval(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('Database connection is healthy');
  } catch (error) {
    console.error('Database connection lost. Reconnecting...', error);
    // The pool will automatically handle reconnection
  }
}, 5000); // Check every 5 seconds

// Test the connection immediately
(async () => {
  try {
    await pool.query('SELECT 1');
    console.log('Database connection test successful');
  } catch (err) {
    console.error('Error connecting to MySQL:', {
      message: err.message,
      code: err.code,
      state: err.sqlState
    });
  }
})();

// Update the signup endpoint
// Update the signup endpoint
app.post('/api/signup', async (req, res) => {
  try {
    const { full_name, email, password, phone } = req.body;
    
    if (!email || !password || !full_name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    console.log('Signup attempt:', { 
      full_name,
      email,
      phone,
      passwordLength: password?.length
    });
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Check if user exists - with detailed logging
    const [existingUsers] = await db.query(
      'SELECT * FROM user WHERE email = ?',
      [email.toLowerCase()]
    );
    
    console.log('Existing users check:', {
      email: email.toLowerCase(),
      found: existingUsers.length > 0,
      existingUsers: existingUsers
    });
    
    if (existingUsers.length > 0) {
      console.log('Email already exists:', email);
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    // Insert new user with all required fields
    const [result] = await db.query(
      'INSERT INTO user (full_name, email, phone, password) VALUES (?, ?, ?, ?)',
      [full_name, email.toLowerCase(), phone, hashedPassword]
    );
    
    console.log('User insertion result:', result);
    
    // Generate JWT token
    const token = jwt.sign({ userId: result.insertId }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });
    
    console.log('New user created:', { 
      userId: result.insertId,
      email: email.toLowerCase()
    });
    
    res.status(201).json({ token });
  } catch (error) {
    console.error('Detailed signup error:', {
      error: error.message,
      stack: error.stack,
      body: req.body
    });
    res.status(500).json({ 
      message: 'Error creating account',
      details: error.message
    });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user with case-insensitive email comparison
    const [users] = await db.query(
      'SELECT * FROM user WHERE LOWER(email) = LOWER(?)',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const user = users[0];
    
    // Check password
    let validPassword = false;
    try {
      if (user.password.startsWith('$2')) {
        validPassword = await bcrypt.compare(password, user.password);
      } else {
        validPassword = password === user.password;
      }
      
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (bcryptError) {
      console.error('Password comparison error:', bcryptError);
      return res.status(500).json({ message: 'Error verifying password' });
    }
    
    // Generate JWT token
    const token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });
    
    console.log('Login successful:', { 
      userId: user.user_id,
      email: user.email
    });
    
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Error logging in',
      details: error.message
    });
  }
});

// Get user profile
app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const [results] = await db.query(
      'SELECT user_id, full_name, email, phone, created_at FROM user WHERE user_id = ?',
      [req.user.userId]
    );
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(results[0]);
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ 
      error: 'Failed to fetch user profile',
      details: err.message 
    });
  }
});

// Add this endpoint after your existing routes

// Search flights
app.get('/api/flights', async (req, res) => {
  try {
    const { from_city, to_city, class_type } = req.query;
    
    const query = `
      SELECT * FROM flights 
      WHERE from_city = ? 
      AND to_city = ? 
      AND class_type = ?
    `;

    const [results] = await db.query(query, [from_city, to_city, class_type]);
    console.log('Flight search results:', {
      from: from_city,
      to: to_city,
      class: class_type,
      resultsCount: results.length
    });
    
    res.json(results);
  } catch (err) {
    console.error('Error searching flights:', err);
    res.status(500).json({ error: 'Failed to search flights. Please try again.' });
  }
});
app.get('/api/flights/search', async (req, res) => {
  try {
    // Remove the incorrect connection check since pool automatically handles connections
    const { from_city, to_city, class_type, passengers, departure_date } = req.query;
    
    console.log('Search parameters:', { from_city, to_city, class_type, passengers, departure_date });
    
    // Validate required parameters
    if (!from_city || !to_city || !class_type || !passengers || !departure_date) {
      console.log('Missing parameters:', { from_city, to_city, class_type, passengers, departure_date });
      return res.status(400).json({ 
        message: 'Missing required parameters. Please provide from_city, to_city, class_type, passengers, and departure_date.',
        error: 'MISSING_PARAMETERS'
      });
    }

    // Validate passenger count is a positive number
    const passengerCount = parseInt(passengers);
    if (isNaN(passengerCount) || passengerCount <= 0) {
      console.log('Invalid passenger count:', passengers);
      return res.status(400).json({ 
        message: 'Invalid passenger count',
        error: 'INVALID_PASSENGER_COUNT'
      });
    }
    
    // Validate string parameters
    if (typeof from_city !== 'string' || typeof to_city !== 'string' || typeof class_type !== 'string') {
      console.log('Invalid parameter types:', { from_city, to_city, class_type });
      return res.status(400).json({ 
        message: 'Invalid parameter types. City names and class type must be text.',
        error: 'INVALID_PARAMETER_TYPE'
      });
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(departure_date)) {
      return res.status(400).json({
        message: 'Invalid date format. Please use YYYY-MM-DD format.',
        error: 'INVALID_DATE_FORMAT'
      });
    }

    // Query with date filter
    const query = `
      SELECT 
        id,
        airline,
        flight_number,
        from_city,
        to_city,
        TIME_FORMAT(departure_time, '%h:%i %p') as departure_time,
        TIME_FORMAT(arrival_time, '%h:%i %p') as arrival_time,
        DATE_FORMAT(departure_date, '%Y-%m-%d') as departure_date,
        class_type,
        price,
        available_seats
      FROM flights 
      WHERE from_city = ? 
      AND to_city = ? 
      AND class_type = ? 
      AND available_seats >= ?
      AND DATE(departure_date) = ?
    `;

    console.log('Executing query:', {
      query,
      params: [from_city, to_city, class_type, passengerCount, departure_date]
    });

    const [flights] = await db.query(query, [
      from_city, 
      to_city,
      class_type, 
      passengerCount,
      departure_date
    ]).catch(error => {
      console.error('Database query error:', error);
      throw new Error('Database query failed');
    });
    
    console.log('Search results:', {
      resultsCount: flights.length,
      params: { from_city, to_city, class_type, passengerCount, departure_date }
    });
    
    if (flights.length === 0) {
      return res.status(404).json({ 
        message: `No flights found from ${from_city} to ${to_city} on ${departure_date} or not enough seats available`,
        error: 'NO_FLIGHTS_FOUND'
      });
    }
    
    res.json(flights);
  } catch (error) {
    console.error('Error searching flights:', {
      error: error.message,
      stack: error.stack,
      query: req.query
    });
    res.status(500).json({ 
      message: 'Error searching flights',
      error: 'SEARCH_ERROR',
      details: error.message
    });
  }
});
app.get('/api/destinations/featured', async (req, res) => {
  try {
    const query = 'SELECT * FROM destinations WHERE featured = true ORDER BY price DESC LIMIT 3';
    const [results] = await db.query(query);
    res.json(results);
  } catch (err) {
    console.error('Error fetching featured destinations:', err);
    res.status(500).json({ error: 'Failed to fetch featured destinations' });
  }
});

// Add flight booking endpoint
// Add flight booking endpoint


// Get flight bookings endpoint
app.get('/api/flight-bookings', authenticateToken, async (req, res) => {
  try {
    const query = 'SELECT * FROM flight_bookings WHERE user_id = ? ORDER BY created_at DESC';
    const [results] = await db.query(query, [req.user.userId]);
    
    console.log('Fetched bookings:', {
      count: results.length,
      userId: req.user.userId,
      results: results
    });
    
    res.json(results);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Update flight booking endpoint to include user_id
app.post('/api/flight-bookings', authenticateToken, async (req, res) => {
  try {
    // Add detailed logging at the start
    console.log('Booking request user:', {
      user: req.user,
      userId: req.user.userId
    });

    const { 
      flight_id,
      from_city,
      to_city,
      departure_date,
      arrival_date,
      airline,
      flight_number,
      price,
      class_type,
      passengers
    } = req.body;

    // Convert date strings to MySQL timestamp format
    const departureTimestamp = new Date(departure_date).toISOString().slice(0, 19).replace('T', ' ');
    const arrivalTimestamp = new Date(arrival_date).toISOString().slice(0, 19).replace('T', ' ');

    // Log the values being used in the query
    console.log('Database insert values:', {
      flight_id,
      user_id: req.user.userId,
      from_city,
      to_city,
      departure_date: departureTimestamp,
      arrival_date: arrivalTimestamp
    });

    // First, get the flight details to ensure it exists
    const [flights] = await db.query(
      'SELECT * FROM flights WHERE id = ? AND flight_number = ? AND from_city = ? AND to_city = ?', 
      [flight_id, flight_number, from_city, to_city]
    );
    const flight = flights[0];
    
    if (!flight) {
      console.log('Flight not found:', { flight_id, flight_number, from_city, to_city });
      return res.status(404).json({ error: 'Flight not found' });
    }

    console.log('Found flight:', flight);
    
    const query = `
      INSERT INTO flight_bookings (
        flight_id, user_id, from_city, to_city, departure_date, arrival_date,
        airline, flight_number, price, class_type, passengers, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')
    `;

    // Log the actual values being inserted
    const insertValues = [
      flight.id,
      req.user.userId, // Use userId directly from token
      from_city,
      to_city,
      departureTimestamp,
      arrivalTimestamp,
      airline,
      flight_number,
      price,
      class_type,
      passengers
    ];

    console.log('SQL Query:', {
      query,
      values: insertValues
    });
    
    const [result] = await db.query(query, insertValues);

    console.log('Booking created:', { 
      bookingId: result.insertId,
      userId: req.user.userId,
      flightId: flight.id
    });
    
    res.status(201).json({
      id: result.insertId,
      message: 'Flight booked successfully'
    });
  } catch (error) {
    console.error('Error booking flight:', {
      error: error.message,
      stack: error.stack,
      sqlMessage: error.sqlMessage,
      sqlState: error.sqlState,
      code: error.code
    });
    res.status(500).json({
      error: 'Failed to book flight. Please try again.',
      details: error.message
    });
  }
});

// Get destination bookings endpoint
app.get('/api/destination-bookings', authenticateToken, async (req, res) => {
  try {
    console.log('User info for destination bookings:', {
      userId: req.user.userId,
      user_id: req.user.user_id,
      fullUser: req.user
    });
    
    // First verify if the table exists
    const [tables] = await db.query(
      'SHOW TABLES LIKE "destination_bookings"'
    );
    
    console.log('Table check result:', {
      tablesFound: tables.length,
      tables: tables
    });
    
    if (tables.length === 0) {
      // Create the table if it doesn't exist
      await db.query(`
        CREATE TABLE destination_bookings (
          id INT PRIMARY KEY AUTO_INCREMENT,
          destination_id INT NOT NULL,
          user_id INT NOT NULL,
          name VARCHAR(255) NOT NULL,
          location VARCHAR(255),
          check_in_date DATETIME NOT NULL,
          check_out_date DATETIME NOT NULL,
          guests INT NOT NULL,
          nights INT NOT NULL,
          price_per_night DECIMAL(10,2) NOT NULL,
          total_price DECIMAL(10,2) NOT NULL,
          status VARCHAR(50) DEFAULT 'confirmed',
          booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Created destination_bookings table');
    }

    // Check if there are any bookings at all
    const [allBookings] = await db.query('SELECT COUNT(*) as total FROM destination_bookings');
    console.log('Total bookings in table:', allBookings[0].total);

    // Now fetch the bookings with detailed logging
    const query = `SELECT * FROM destination_bookings WHERE user_id = ? ORDER BY booking_time DESC`;
    console.log('Executing query:', {
      query,
      userId: req.user.userId,
      params: [req.user.userId]
    });

    const [bookings] = await db.query(query, [req.user.userId]);

    console.log('Destination bookings found:', {
      userId: req.user.userId,
      count: bookings.length,
      bookings: bookings
    });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching destination bookings:', {
      error: error.message,
      stack: error.stack,
      sqlMessage: error.sqlMessage,
      userId: req.user.userId
    });
    res.status(500).json({ 
      error: 'Failed to fetch bookings',
      details: error.sqlMessage || error.message
    });
  }
});

// Book destination endpoint
// Book destination endpoint
// Book destination endpoint
app.post('/api/destination-bookings', authenticateToken, async (req, res) => {
  try {
    // First get the user's full name
    const [users] = await db.query('SELECT full_name FROM user WHERE user_id = ?', [req.user.userId]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userFullName = users[0].full_name;

    const { 
      destination_id,
      location,
      check_in_date,
      check_out_date,
      guests,
      nights,
      price_per_night,
      total_price
    } = req.body;

    // Validate required fields
    if (!destination_id || !check_in_date || !check_out_date || !guests) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Convert date strings to MySQL timestamp format
    const checkInTimestamp = new Date(check_in_date).toISOString().slice(0, 19).replace('T', ' ');
    const checkOutTimestamp = new Date(check_out_date).toISOString().slice(0, 19).replace('T', ' ');

    const query = `
      INSERT INTO destination_bookings (
        destination_id, user_id, name, location, check_in_date,
        check_out_date, guests, nights, price_per_night, total_price, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')
    `;

    const insertValues = [
      destination_id,
      req.user.userId,
      userFullName,  // Use the user's full name here
      location,
      checkInTimestamp,
      checkOutTimestamp,
      guests,
      nights,
      price_per_night,
      total_price
    ];

    const [result] = await db.query(query, insertValues);

    console.log('Destination booking created:', { 
      bookingId: result.insertId,
      userId: req.user.userId,
      userName: userFullName,
      destinationId: destination_id
    });

    res.status(201).json({
      id: result.insertId,
      message: 'Destination booked successfully'
    });
  } catch (error) {
    console.error('Error booking destination:', error);
    res.status(500).json({
      error: 'Failed to book destination. Please try again.',
      details: error.message
    });
  }
});

// Add this at the end of your file, before any exports
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Replace the existing /api/destinations/search endpoint with this
app.get('/api/destinations/search', async (req, res) => {
  try {
    // Hardcoded destinations for now
    const destinations = [
      {
        id: 1,
        name: 'Bali',
        image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
        description: 'Experience tropical paradise',
        price: 899.99,
        location: 'Indonesia'
      },
      {
        id: 2,
        name: 'Singapore',
        image_url: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80',
        description: 'Discover modern Asia',
        price: 999.99,
        location: 'Singapore'
      },
      {
        id: 3,
        name: 'London',
        image_url: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
        description: 'Explore British heritage',
        price: 1299.99,
        location: 'United Kingdom'
      },
      {
        id: 4,
        name: 'Vietnam',
        image_url: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
        description: 'Experience authentic culture',
        price: 799.99,
        location: 'Vietnam'
      },
      {
        id: 5,
        name: 'Maldives',
        image_url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80',
        description: 'Paradise on Earth',
        price: 1599.99,
        location: 'Maldives'
      },
      {
        id: 6,
        name: 'Switzerland',
        image_url: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=800&q=80',
        description: 'Alpine wonderland',
        price: 1399.99,
        location: 'Switzerland'
      }
    ];

    res.json(destinations);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ error: 'Failed to fetch destinations' });
  }
});

// Add this endpoint to handle flight booking cancellations
app.delete('/api/flight-bookings/:id', authenticateToken, async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM flight_bookings WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Booking not found or unauthorized' });
    }

    res.json({ message: 'Flight booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling flight booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const {
      user_id,
      travel_id,
      booking_type,
      provider_name,
      booking_reference,
      cost,
      booking_date,
      status
    } = req.body;

    const [result] = await pool.promise().execute(
      'INSERT INTO booking (user_id, travel_id, booking_type, provider_name, booking_reference, cost, booking_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [user_id, travel_id, booking_type, provider_name, booking_reference, cost, booking_date, status]
    );

    res.json({ success: true, bookingId: result.insertId });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});
// Add this endpoint to handle destination booking cancellations
app.delete('/api/destination-bookings/:id', authenticateToken, async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM destination_bookings WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Booking not found or unauthorized' });
    }

    res.json({ message: 'Destination booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling destination booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});



