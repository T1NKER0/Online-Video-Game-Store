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

const wishGame = async (player, game) => {
  const query = process.env.WISH_GAME;
  const [result] = await db.query(query, [player, game]);
  return result;
};

const purchaseGame = async (player, game) => {
  const query = process.env.PURCHASE_GAME;
  const [result] = await db.query(query, [player, game]);
  return result;
};

const removeWishGame = async (player, game) => {
  const query = process.env.REMOVE_WISH_GAME;
  const [result] = await db.query(query, [player, game]);
  return result;
};

const checkWishlist = async (player, game) => {
  const query = process.env.CHECK_WISHLIST_FOR_GAME;
  const [rows] = await db.query(query, [player, game]);
  return rows[0]
};

const checkPurchased = async (player, game) => {
  const query = process.env.CHECK_PURCHASED_GAME;
  const [rows] = await db.query(query, [player, game]);
  return rows[0]
};

const findPlayerByEmail = async (signInEmail) => {
  const query = process.env.QUERY_SELECT_USER_BY_EMAIL;
  const [rows] = await db.query(query, [signInEmail]);
  return rows[0]
};

const findGame = async (gameName) => {
  const query = process.env.SEARCH_GAME;
  const [rows] = await db.query(query, [gameName]);
  return rows[0];
};

const findGenreGames = async (genreName) => {
  const query = process.env.GET_GENRE_GAMES;
  const [rows] = await db.query(query, [genreName]);
  return rows;
};

const myWishlist = async (player) => {
  const query = process.env.MY_WISHLIST;
  const [rows] = await db.query(query, [player]);
  return rows;
};

const myGames = async (player) => {
  const query = process.env.MY_GAMES;
  const [rows] = await db.query(query, [player]);
  return rows;
};

const getGenres = async () => {
  const query = process.env.GET_GENRES;
  const [rows] = await db.query(query);
  return rows;
};

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
  findGame,
  findGenreGames,
  wishGame,
  purchaseGame,
  removeWishGame,
  checkWishlist,
  checkPurchased,
  myWishlist,
  myGames,
  getGenres
};
