var express = require('express');
var router = express.Router();

const AuthController = require('../../controllers/auth.controller');

const authController = new AuthController();
/** -- Auth Routes --*/

/** -- Login Route -- */
router.post('/login', authController.login);

/** -- Register Route -- */
router.post('/register', authController.register);



module.exports = router;