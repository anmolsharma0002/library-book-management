const jwt = require('jsonwebtoken');
const createError = require('http-errors'); // Import createError to handle HTTP errors
const env = require('../config/env');
const Model = require('../models');

/**
 * Authentication middleware function.
 * 
 * @param {string|string[]} role - The role(s) required for the route.
 * @returns {function} - The middleware function.
 */
const auth = (role = []) => (req, res, next) => {
  try {
    // Retrieve the token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) throw createError.Unauthorized('Unauthorized Access');
  
    // Verify the token using the secret
    const decoded = jwt.verify(token, env.tokenSecret);
    req.user = decoded;
    
    // Convert the user ID to an ObjectId
    req.user.id = new Model.mongoose.Types.ObjectId(decoded.aud);
    
    // Check if the user has the required role
    if (Array.isArray(role) && role.length && !role.includes(decoded.role)) {
      throw createError.Unauthorized('Access Denied');
    }
    
    next();
  } catch (err) {
    console.error(err);
    err.message = 'Provide a valid token';
    next(err);
  }
};

// Middleware for specific roles
const isLibrarian = auth('librarian');
const isStaff = auth('staff');
const isStudent = auth('student');
const isLibrarianOrStaff = auth(['librarian', 'staff']);
const isStaffOrStudent = auth(['staff', 'student']);
const isLibrarianOrStaffOrStudent = auth(['librarian', 'staff', 'student']);

module.exports = {
  isLibrarian,
  isStaff,
  isStudent,
  isLibrarianOrStaff,
  isStaffOrStudent,
  isLibrarianOrStaffOrStudent
};
