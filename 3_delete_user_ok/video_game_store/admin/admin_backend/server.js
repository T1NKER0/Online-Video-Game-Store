const express = require('express'); //Node.js framework for web and mobile application development. 
const jwt = require('jsonwebtoken'); //Sends authentication parameters between backend and frontend using JSON
const db_a = require('./db/db_a.js');
const db_a_s = require('./db/db_a_s.js');
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
  const { fullName, signInEmail, accessCredentials } = req.body;
  console.log("Attempting to create account...");

  try {
    //pause execution until password hash promise returns
    const hashedPassword = await bcrypt.hash(accessCredentials, 10);

    //pause execution until insert user promise returns 
    const result = await db_a.insertUser(fullName, signInEmail, accessCredentials);

    //sign parameters into a json web token
    const token = jwt.sign({ user_id: result.insertId, fullName }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log("Account Created.");
    res.status(201).json({ token });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/delete-account/:id', async (req, res) => {
  const { id } = req.params; // Extract user ID from the request URL

  try {
    const result = await db_a.deleteUser(id); // Call deleteUser function

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Route to get all roles
app.get('/permissions', async (req, res) => {
  try {
      // Obtener los roles de forma asíncrona usando la función getRoles
      const results = await db_a.getPermissions();

      console.log('Permissions fetched:', results); // Log the results

      // Enviar la respuesta con los resultados
      return res.status(200).json({ permissions: results });
  } catch (err) {
      // Si ocurre un error, enviamos una respuesta de error
      console.error('Error fetching permissions:', err);
      return res.status(500).json({ message: 'Error fetching permissions' });
  }
});

// Route to get all users
app.get('/users', async (req, res) => {
  try {
      // Obtener los roles de forma asíncrona usando la función getUsers
      const results = await db_a.getUsers();

      console.log('Users fetched:', results); // Log the results

      // Enviar la respuesta con los resultados
      return res.status(200).json({ users: results });
  } catch (err) {
      // Si ocurre un error, enviamos una respuesta de error
      console.error('Error fetching users:', err);
      return res.status(500).json({ message: 'Error fetching users' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  //destructure request by parameters
  const { signInEmail, accessCredentials } = req.body;

  try {
    // Find user by email
    const player = await db_a.findPlayerByEmail(signInEmail);

    if (!player) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare provided password with stored hash using db.js
    const isMatch = await db_a.comparePassword(accessCredentials, player);


    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    else {
      console.log("success!");
    }

    // Create JWT token
    const token = jwt.sign({ user_id: player.id}, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with the token
    res.status(200).json({ token });

  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
