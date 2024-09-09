var express = require('express');
var router = express.Router();

const UserController = require('../../controllers/user.controller');
const { isLibrarian } = require('../../../../../middlewares/auth');

// Instantiate the UserController
const userController = new UserController();

/** 
 * --- User Routes ---
 * These routes handle user-related operations.
 */

/**
 * @route GET /user
 * @description Get a list of users. Optionally filter by role.
 * @middleware isLibrarian - Requires librarian role to access this route.
 * @access Private
 */
router.get('/', isLibrarian, userController.getUsers);

/**
 * @route DELETE /user/:userId
 * @description Delete a specific user by ID.
 * @param {string} userId - ID of the user to delete.
 * @middleware isLibrarian - Requires librarian role to access this route.
 * @access Private
 */
router.delete('/:userId', isLibrarian, userController.deleteOneUser);

/**
 * @route PUT /user/:userId
 * @description Update a specific user by ID.
 * @param {string} userId - ID of the user to update.
 * @middleware isLibrarian - Requires librarian role to access this route.
 * @access Private
 */
router.put('/:userId', isLibrarian, userController.updateOneUser);

module.exports = router;
