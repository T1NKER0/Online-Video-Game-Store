const express = require('express');
const jwt = require('jsonwebtoken');
const { insertUser, findPlayerByEmail, comparePassword, getAllGames } = require('./db/db.js');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Initialize Express app
const app = express();

const cors = require('cors');
app.use(cors());

// Enable security headers
app.use(helmet());

// Middleware to parse incoming JSON data
app.use(bodyParser.json());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests, please try again later.',
});
app.use(limiter);


// Register route
app.post('/api/register', async (req, res) => {
  const { fullName, psnID, signInEmail, accessCredentials, dateOfBirth } = req.body;
  console.log("Attempting to create account...");

  try {
    const hashedPassword = await bcrypt.hash(accessCredentials, 10);

    const result = await insertUser(fullName, psnID, signInEmail, hashedPassword, dateOfBirth);

    const token = jwt.sign({ user_id: result.insertId, psnID }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log("Account Created.");
    res.status(201).json({ token });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { signInEmail, accessCredentials } = req.body;

  try {
    // Find user by email
    const player = await findPlayerByEmail(signInEmail);

    if (!player) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare provided password with stored hash using db.js
    const isMatch = await comparePassword(accessCredentials, player);


    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    else {
      console.log("success!");
    }

    // Create JWT token
    const token = jwt.sign({ user_id: player.id, psnID: player.psnID }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with the token
    res.status(200).json({ token });

  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
