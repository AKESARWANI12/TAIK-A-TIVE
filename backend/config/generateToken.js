//jwt ..it helps us to authorize the user from the backend..if user is trying to accessa resource ,and only user can access that resource ..so it validates the user
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: "30d",});
};

module.exports = generateToken;



// const jwt = require("jsonwebtoken");: Imports the jsonwebtoken library.

// const generateToken = (id) => {: Defines a function named generateToken that takes a user ID (id) as a parameter.

// return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });: Uses the sign method from the jsonwebtoken library to create a JWT. The method takes three parameters:

// The first parameter is the payload, which is an object containing the user ID (id in this case).
// The second parameter is the secret key used to sign the token. It's fetched from the environment variable process.env.JWT_SECRET.
// The third parameter is an options object, specifying the token expiration time (expiresIn: "30d"), which means the token will be valid for 30 days.
