const express = require('express'); //Node.js framework for web and mobile application development. 
const jwt = require('jsonwebtoken'); //Sends authentication parameters between backend and frontend using JSON

const { insertUser, findPlayerByEmail, comparePassword, findGame, wishGame, checkWishlist, myWishlist, 
  removeWishGame, getGenres, findGenreGames, 
  purchaseGame,
  checkPurchased, myGames} = require('./db/db_p.js');

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

// Search genre games route
app.post('/api/genre-games', async (req, res) => {
  const { selectedGenre } = req.body;

  try {
    const games = await findGenreGames(selectedGenre);
    console.log("Searching for games in genre:", selectedGenre);

    if (!games || games.length === 0) {
      return res.status(404).json({ message: 'No games found for this genre' });
    }

    console.log("Games found:", games);
    res.status(200).json({ games });
  } catch (err) {
    console.error('Error finding games by genre:', err);
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
    const gameCheck = await checkWishlist(player, game);

    if (!gameCheck) {
      return res.status(404).json({ message: 'not in wishlist' });
    }

    console.log("Game found:", gameCheck);
    res.status(200).json({ game: gameCheck });
  } catch (err) {
    console.error('Error finding game:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Search game route
app.post('/api/check-purchased', async (req, res) => {
  const { player, game } = req.body;

  try {
    const gameCheck = await checkPurchased(player, game);

    if (!gameCheck) {
      return res.status(404).json({ message: 'not purchased' });
    }
    

    console.log("Purchase found for:", gameCheck);
    res.status(200).json({ game: gameCheck });
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

    console.log("Game added to wishlist.");
    res.status(201).json({ token });
  } catch (err) {
    console.error('Error adding game to wishlist:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Register route
app.post('/api/purchased', async (req, res) => {
  //req: request from frontend. res: json response sent to frontend. 
  //receive parameters from request and destructure them -- helps to avoid using res.xy for every parameter
  const { player, game } = req.body;

  try {
    const result = await purchaseGame(player, game);
    //await removeWishGame(player, game);

    //sign parameters into a json web token
    const token = jwt.sign({ user_id: result.insertId, player }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log("Game Purchased.");
    res.status(201).json({ token });
  } catch (err) {
    console.error('Error purchasing game:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Register route
app.post('/api/remove-from-wishlist', async (req, res) => {
  //req: request from frontend. res: json response sent to frontend. 
  //receive parameters from request and destructure them -- helps to avoid using res.xy for every parameter
  const { player, game } = req.body;

  try {
    const result = await removeWishGame(player, game);

    //sign parameters into a json web token
    const token = jwt.sign({ user_id: result.insertId, player }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log("Game removed from wishlist.");
    res.status(201).json({ token });
  } catch (err) {
    console.error('Error removing game from wishlist:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get all roles
app.get('/api/gameTypes', async (req, res) => {
  try {
      // Obtener los roles de forma asíncrona usando la función getRoles
      const results = await getGenres();

      console.log('Genres fetched:', results); // Log the results

      // Enviar la respuesta con los resultados
      return res.status(200).json({ genres: results });
  } catch (err) {
      // Si ocurre un error, enviamos una respuesta de error
      console.error('Error fetching genres:', err);
      return res.status(500).json({ message: 'Error fetching genres' });
  }
});

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
