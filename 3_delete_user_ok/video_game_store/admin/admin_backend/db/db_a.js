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
const insertUser = async (fullName,  signInEmail, accessCredentials) => {
  const query = process.env.QUERY_INSERT_USER;
  const plain = signInEmail + accessCredentials;
  const hash = await bcrypt.hash(plain, 10);
  const [result] = await db.query(query, [fullName,  signInEmail, hash]);
  return result;
};

const deleteUser = async (userID) => {
  const query = process.env.DELETE_USER;
  const [result] = await db.query(query, [userID]);
  return result;
};

const findPlayerByEmail = async (signInEmail) => {
  const query = process.env.QUERY_SELECT_USER_BY_EMAIL;
  const [rows] = await db.query(query, [signInEmail]);
  return rows[0];
};

const getPermissions = async () => {
  const query = process.env.GET_PERMISSIONS;
  const [rows] = await db.query(query);
  return rows;
};

const getUsers = async () => {
  const query = process.env.GET_USERS;
  const [rows] = await db.query(query);
  return rows;
};

// New function to compare password
/* const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
}; */

const comparePassword = async (plainPassword, player) => {
  const passwordField = process.env.CREDENTIALS; // Ensure this is correctly set
  const hashedPassword = player[passwordField];

  if (!hashedPassword) {
    throw new Error('Password field not found');
  }

  // 🔹 Hash input during login the same way it was stored (signInEmail + password)
  const plain = player.email + plainPassword; // Ensure the field name is correct (use player.email)

  return bcrypt.compare(plain, hashedPassword);
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
  getPermissions, 
  getUsers,
  deleteUser
};
