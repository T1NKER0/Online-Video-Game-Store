/* const bcrypt = require("bcrypt");

const plainPassword = "admin@example.com1234"; // Change this to your desired password
const saltRounds = 10;

bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
  if (err) {
    console.error("Error hashing password:", err);
  } else {
    console.log("Hashed Password:", hash);
  }
}); */

const bcrypt = require('bcrypt');
const plain = 'testuser@example.com' + 'Test@1234'; // Concatenation logic
bcrypt.hash(plain, 10).then(hash => console.log(hash));

