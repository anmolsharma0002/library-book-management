const jwt = require('jsonwebtoken');
const env = require('../config/env');
const Model = require('../models');

/**
 * Authentication middleware function.
 * 
 * @param {string} role - The role required for the route.
 * @returns {function} - The middleware function.
 */

const auth = (role=[]) => (req, res, next) => {
  console.log('role', role);
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    
    if( !token ) throw createError.Unauthorized('Unauthorized Access');
  
    const decoded = jwt.verify(token, env.tokenSecret);
    console.log('User Decoded',  decoded )
    req.user = decoded;
    req.user.id = new Model.mongoose.Types.ObjectId(decoded.aud)
    if (Array.isArray(role) && role.length && !role.includes(decoded.role)) {
      throw createError.Unauthorized('Access Denied');
    }
    
    next();
  } catch (err) {
    console.log( err )
    err.message = 'provide valid token'
    next(err);
  }
};

// Create a middleware function for librarian role.
const isLibrarian = auth('librarian');

const isStaff = auth('staff');

const isStudent = auth('student');

const isLibrarianOrStaff = auth(['librarian', 'staff'])

const isStaffOrStudent = auth(['staff', 'student'])

const isLibrarianOrStaffOrStudent = auth(['librarian', 'staff', 'student']);

module.exports = { isLibrarian, isStaff, isStudent, isLibrarianOrStaff, isStaffOrStudent, isLibrarianOrStaffOrStudent};
