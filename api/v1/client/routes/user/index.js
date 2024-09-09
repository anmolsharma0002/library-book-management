var express = require('express');
var router = express.Router();

const UserController = require('../../controllers/user.controller');

const { isLibrarian } = require('../../../../../middlewares/auth');

const userController = new UserController();
/** -- User Routes --*/

/** -- get users (All, add query role) -- */
router.get('/', isLibrarian, userController.getUsers);

/** -- delete one user -- */
router.delete('/:userId', isLibrarian, userController.deleteOneUser);

/** -- update one user -- */
router.put('/:userId', isLibrarian, userController.updateOneUser);

module.exports = router;