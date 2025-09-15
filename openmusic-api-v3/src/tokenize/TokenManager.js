const Jwt = require('jsonwebtoken');
const InvariantError = require('../exceptions/InvariantError');

const TokenManager = {
  generateAccessToken: (payload) => Jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: Number(process.env.ACCESS_TOKEN_AGE),
  }),
  generateRefreshToken: (payload) => Jwt.sign(payload, process.env.REFRESH_TOKEN_KEY),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);

      delete artifacts.iat;
      delete artifacts.exp;

      return artifacts;
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  },
};

module.exports = TokenManager;
