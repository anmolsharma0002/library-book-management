// Import necessary modules
const createError = require('http-errors'); // Module to handle HTTP errors
const Model = require('../models');         // Importing the models (User, etc.)

class UserService {
    // Method to get a user by their ID
    static async getById(userId) {
        try {
            if (!userId) throw createError.BadRequest('User Id is required');

            // Fetching user details by ID and excluding the password field
            const user = await Model.User.findById(userId).select('-password');
            if (!user) throw createError.NotFound('User not found');
            
            return user;
        } catch (error) {
            // Handling any errors that occur
            throw error;
        }
    }

    // Method to get a user based on a query object
    static async getOne(body) {
        try {
            if (!body || Object.keys(body).length === 0) {
                throw createError.BadRequest('Provide any parameter');
            }
            
            // Fetching a single user based on the query object and excluding the password field
            const user = await Model.User.findOne(body).select('-password');
            if (!user) throw createError.NotFound('User not found');
            
            return user;
        } catch (error) {
            // Handling any errors that occur
            throw error;
        }
    }

    // Method to get all users
    static async getAll() {
        try {            
            // Fetching all users and excluding the password field
            const users = await Model.User.find().select('-password');
            return users;
        } catch (error) {
            // Handling any errors that occur
            throw error;
        }
    }

    // Method to get users by their role
    static async getUsersByRole(role) {
        try {          
            if (!role) throw createError.BadRequest('Role is required');
            
            // Fetching users with the specified role and excluding the password field
            const users = await Model.User.find({ role }).select('-password');
            return users;
        } catch (error) {
            // Handling any errors that occur
            throw error;
        }
    }

    // Method to update a user's details
    static async updateOneUser(userId, body) {
        try { 
            if (!body || Object.keys(body).length === 0) {
                throw createError.BadRequest('Provide any parameter');
            }

            // Removing password and _id fields from the update body
            if (body.password) {
                delete body.password;
            }

            if (body._id) {
                delete body._id;
            }
            
            // Updating the user by ID and excluding the password field from the result
            const user = await Model.User.findByIdAndUpdate(userId, body, { new: true }).select('-password');
            return user;
        } catch (error) {
            // Handling any errors that occur
            throw error;
        }
    }

    // Method to delete a user by their ID
    static async deleteOne(userId) {
        try {
            if (!userId) throw createError.BadRequest('User Id is required');
    
            // Removing the user by ID
            const user = await Model.User.findByIdAndRemove(userId);
            if (!user) throw createError.NotFound('User not found');
    
            return user;
        } catch (error) {
            // Handling any errors that occur
            throw error;
        }
    }
}

// Exporting the UserService class for use in other parts of the application
module.exports = UserService;
