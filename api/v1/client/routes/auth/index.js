var express = require('express');
var router = express.Router();

const AuthController = require('../../controllers/auth.controller');

// Instantiate the AuthController
const authController = new AuthController();

/** 
 * --- Authentication Routes ---
 * These routes handle user authentication such as login and registration.
 */

/**
 * @route POST /auth/login
 * @description Login route for user authentication.
 * @body {Object} - Request body should include user credentials (email and password).
 * @access Public
 */
router.post('/login', authController.login);

/**
 * @route POST /auth/register
 * @description Register route for creating a new user account.
 * @body {Object} - Request body should include user details (name, email, password, etc.).
 * @access Public
 */
router.post('/register', authController.register);

module.exports = router;
