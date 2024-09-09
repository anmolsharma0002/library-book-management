const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { tokenIssuer, tokenSecret } = require('../config/env');

/**
 * Generates a JSON Web Token (JWT) for a user.
 * 
 * @param {ObjectId} userId - The _id of the user.
 * @param {string} userRole - The role of the user.
 * @returns {Promise<string>} A promise that resolves to the generated JWT.
 */
const signUserAccessToken = (userId, userRole) => {
  const payload = { app: 'client', role: userRole, id: userId };

  const options = { 
    expiresIn: '7d', 
    issuer: tokenIssuer, 
    audience: userId.toString() // Convert userId to string for audience
  };

  return new Promise((resolve, reject) => {
    jwt.sign(payload, tokenSecret, options, (err, token) => {
      if (err) {
        console.error('[ERROR:signUserAccessToken]', err);
        reject(createError.InternalServerError('Failed to generate token'));
      } else {
        resolve(token);
      }
    });
  });
};

module.exports = { 
  signUserAccessToken 
};
