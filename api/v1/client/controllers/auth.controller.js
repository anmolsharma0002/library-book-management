const AuthService = require("../../../../services/auth.service"); // Importing the AuthService

class AuthController {
    // Register a new user
    async register(req, res, next) {
        try {
            await AuthService.register(req.body); // Call AuthService to register the user
            res.status(200).json({ success: true, message: 'Account Created Successfully' });
        } catch (error) {
            next(error); // Pass error to the error handling middleware
        }
    }

    // Log in an existing user
    async login(req, res, next) {
        try {
            const token = await AuthService.login(req.body); // Call AuthService to log in the user
            res.status(200).json({ success: true, token: token });
        } catch (error) {
            next(error); // Pass error to the error handling middleware
        }
    }
}

module.exports = AuthController; // Exporting the AuthController class
