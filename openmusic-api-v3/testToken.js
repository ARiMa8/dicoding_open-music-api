require('dotenv').config();
const Jwt = require('jsonwebtoken');

console.log('ACCESS_TOKEN_AGE from env:', process.env.ACCESS_TOKEN_AGE);

const token = Jwt.sign({ userId: 123 }, process.env.ACCESS_TOKEN_KEY, {
  expiresIn: parseInt(process.env.ACCESS_TOKEN_AGE, 10),
});

console.log('Generated Token:', token);

try {
  const decoded = Jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
  console.log('Decoded payload:', decoded);
} catch (err) {
  console.error('Error verifying token:', err.message);
}
