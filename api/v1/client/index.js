var express = require('express');
var router = express.Router();

// Import route handlers
var auth = require('./routes/auth');
var user = require('./routes/user');
var book = require('./routes/book');

/** 
 * --- Client Routes ---
 * Set up route handlers for different API endpoints.
 */

// Routes for authentication-related operations
router.use('/auth', auth);

// Routes for user-related operations
router.use('/user', user);

// Routes for book-related operations
router.use('/book', book);

module.exports = router;
