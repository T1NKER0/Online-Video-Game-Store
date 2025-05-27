const express = require('express'); //Node.js framework for web and mobile application development. 
const jwt = require('jsonwebtoken'); //Sends authentication parameters between backend and frontend using JSON
const { insertUser, findPlayerByEmail, comparePassword, findGame, wishGame, checkWishlist, myWishlist } = require('./db/db_p.js');
const bodyParser = require('body-parser'); //used in Node.js to parse incoming requests into a more convenient format
const helmet = require('helmet'); //enables application security by establishing several HTTP headers
const rateLimit = require('express-rate-limit'); //limit requests inside a time frame
const bcrypt = require('bcrypt'); //used for hashing purposes
require('dotenv').config();

// Initialize Express app
const app = express();

//allows or restricts API resources to be accessed from another domain
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
  //req: request from frontend. res: json response sent to frontend. 
  //receive parameters from request and destructure them -- helps to avoid using res.xy for every parameter
  const { fullName, psnID, signInEmail, accessCredentials, dateOfBirth } = req.body;
  console.log("Attempting to create account...");

  try {
    //pause execution until password hash promise returns
    const hashedPassword = await bcrypt.hash(accessCredentials, 10);

    //pause execution until insert user promise returns 
    const result = await insertUser(fullName, psnID, signInEmail, hashedPassword, dateOfBirth);

    //sign parameters into a json web token
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
  //destructure request by parameters
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
      console.log(player.user_id);
    }

    // Create JWT token
    const token = jwt.sign({ user_id: player.id, psnID: player.psnID }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with the token
    const playerId = player.user_id;
    res.status(200).json({ token, playerId });
  

  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Search game route
app.post('/api/search-game', async (req, res) => {
  const { title } = req.body;

  try {
    const game = await findGame(title);
    console.log("Searching for:", title);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    console.log("Game found:", game);
    res.status(200).json({ game });
  } catch (err) {
    console.error('Error finding game:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// wishlist route
app.post('/api/my-wishlist', async (req, res) => {
  const { player } = req.body;

  try {
    const games = await myWishlist(player);

    if (!games) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    console.log("Wishlist found:", games);
    res.status(200).json({ games }); // ✅ CORREGIDO AQUÍ
  } catch (err) {
    console.error('Error finding wishlist:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/my-games', async (req, res) => {
  const { player } = req.body;

  try {
    const games = await myGames(player);

    if (!games) {
      return res.status(404).json({ message: 'Game list not found' });
    }

    console.log("Game list found:", games);
    res.status(200).json({ games }); // ✅ CORREGIDO AQUÍ
  } catch (err) {
    console.error('Error finding game list:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Search game route
app.post('/api/check-wishlist', async (req, res) => {
  const { player, game } = req.body;

  try {
    const game = await checkWishlist(player, game);

    if (!game) {
      return res.status(404).json({ message: 'not in wishlist' });
    }

    console.log("Game found:", game);
    res.status(200).json({ game });
  } catch (err) {
    console.error('Error finding game:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Register route
app.post('/api/wishlist', async (req, res) => {
  //req: request from frontend. res: json response sent to frontend. 
  //receive parameters from request and destructure them -- helps to avoid using res.xy for every parameter
  const { player, game } = req.body;

  try {
    const result = await wishGame(player, game);

    //sign parameters into a json web token
    const token = jwt.sign({ user_id: result.insertId, player }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log("Account Created.");
    res.status(201).json({ token });
  } catch (err) {
    console.error('Error adding game to wishlist:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
