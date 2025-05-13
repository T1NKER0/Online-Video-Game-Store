const mysql = require('mysql2/promise'); // MySQL connection library
const bcrypt = require('bcrypt'); // Library for hashing
require('dotenv').config(); // Load environment variables

// Create MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME_P,
});

// Function to insert a user with correct hashing logic
const createUser = async (fullName, signInEmail, accessCredentials) => {
  try {
    const query = process.env.QUERY_INSERT_USER;
    
    // 🔹 Use the same hashing logic as `insertUser`
    const plain = signInEmail + accessCredentials;
    const hash = await bcrypt.hash(plain, 10);

    // Insert user into database
    const [result] = await db.query(query, [fullName, signInEmail, hash]);

    console.log('User successfully created:', { id: result.insertId, fullName, signInEmail });
    return result;
  } catch (err) {
    console.error('Error creating user:', err);
  }
};

// Call function to create user manually
(async () => {
  await createUser('Admin User', 'test@example.com', '1234');
  process.exit();
})();
