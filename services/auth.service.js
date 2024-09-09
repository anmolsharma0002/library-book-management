// Importing necessary modules
const createError = require('http-errors'); // Module to create HTTP error responses
const Model = require('../models');         // Importing the User model from the models folder
const { signUserAccessToken } = require('../helpers/jwt'); // Function to generate JWT token for user authentication

// AuthService class contains static methods for user registration and login
class AuthService {
    
    // Static method to handle user registration
    static async register(body) {
        try {
            // Destructuring the required fields from the request body
            const { name, email, password, role } = body;

            // Check if any required fields are missing, throw a 400 Bad Request error
            if (!name || !email || !password || !role) throw createError.BadRequest();

            // Check if a user with the provided email already exists in the database
            var user = await Model.User.findOne({ email });

            // If the user already exists, throw a 409 Conflict error
            if (user) throw createError.Conflict(`${email} is already registered`);
            
            // Create a new user instance with the provided details
            let newUser = new Model.User({ name, email, password, role });
            
            // Encrypt the user's password using the custom `encryptPassword` method
            let encryptedPass = await newUser.encryptPassword(password);

            // Assign the encrypted password to the new user instance
            newUser.password = encryptedPass;

            // Save the new user to the database
            user = await newUser.save();
            
            // Return the created user object
            return user;
            
        } catch (error) {
            // If an error occurs during registration, rethrow it to be handled elsewhere
            throw error;
        }
    }

    // Static method to handle user login
    static async login(body) {
        try {
            // Destructuring email and password from the request body
            const { email, password } = body;
            
            // Check if email or password is missing, throw a 400 Bad Request error
            if (!email || !password) throw createError.BadRequest();

            // Find the user in the database based on the provided email
            const user = await Model.User.findOne({ email });

            // If the user doesn't exist, throw a 400 Bad Request error
            if (!user) throw createError.BadRequest(`${email} is not registered`);
      
            // Validate the provided password using a custom `isValidPassword` method
            const isValidPassword = user.isValidPassword(password);

            // If the password is incorrect, throw a 401 Unauthorized error
            if (!isValidPassword) throw createError.Unauthorized('Invalid Password');
      
            // Generate a JWT token using the user's ID and role
            const token = await signUserAccessToken(user._id, user.role);

            // Return the generated JWT token
            return token;

        } catch (err) {
            // If an error occurs during login, rethrow it to be handled elsewhere
            throw err;
        }
    }
}

// Exporting the AuthService class for use in other parts of the application
module.exports = AuthService;
