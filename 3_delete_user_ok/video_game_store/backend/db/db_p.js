const mysql = require('mysql2/promise'); //Used for connecting to DBMS
const bcrypt = require('bcrypt'); //Library used for hashing purposes
require('dotenv').config();

// Create MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME_P,
});

// Query functions using environment variables -- asynchronus functions
//these functions keep the program running while their operations take their time to execute
//they return Promises, which determine if the operation was successful or not
const insertUser = async (fullName, psnId, signInEmail, accessCredentials, dateOfBirth) => {
  const query = process.env.QUERY_INSERT_USER;
  const [result] = await db.query(query, [fullName, psnId, signInEmail, accessCredentials, dateOfBirth]);
  return result;
};

const findPlayerByEmail = async (signInEmail) => {
  const query = process.env.QUERY_SELECT_USER_BY_EMAIL;
  const [rows] = await db.query(query, [signInEmail]);
  return rows[0];
};

// New function to compare password
/* const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
}; */

const comparePassword = async (plainPassword, player) => {
  // Dynamically access the hashed password using the field defined in the .env file
  const passwordField = process.env.CREDENTIALS; //|| 'hash'; // Default to 'hash' if CREDENTIALS is not set
  const hashedPassword = player[passwordField];  // Access the player's password dynamically using the field name from .env
  
  if (!hashedPassword) {
    throw new Error('Password field not found');
  }

  return bcrypt.compare(plainPassword, hashedPassword);
};

// New function to get password field name from the .env
const verifyPlayer = () => {
  return process.env.CREDENTIALS; //|| 'hash'; // Default to 'hash' if CREDENTIALS is not set
};

module.exports = {
  insertUser,
  findPlayerByEmail,
  comparePassword, // Expose the comparePassword function
  verifyPlayer,
};
