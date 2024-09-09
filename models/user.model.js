const mongoose = require('mongoose'); // Importing mongoose for schema definition and model creation
const { Schema } = mongoose; // Destructuring Schema from mongoose
const timestamps = require('mongoose-timestamp'); // Plugin for adding createdAt and updatedAt timestamps
const uniqueValidator = require('mongoose-unique-validator'); // Plugin for ensuring unique fields
const bcrypt = require('bcryptjs'); // Library for hashing and comparing passwords

// Define the User schema
const UserSchema = new Schema({
    name: { 
        type: String, 
        trim: true, 
        required: true // Name is required
    },
    
    email: {
        type: String,
        trim: true,
        required: [true, `Email can't be blank`], // Email is required
        match: [/\S+@\S+\.\S+/, 'Email is invalid'], // Email must be in valid format
        unique: true, // Email must be unique
        lowercase: true, // Convert email to lowercase
        index: true // Create an index on the email field
    },

    password: { 
        type: String, 
        trim: true, 
        required: true // Password is required
    },

    role: {
        type: String,
        enum: ['librarian', 'staff', 'student'], // Role must be one of these values
        default: 'student', // Default role is 'student'
        lowercase: true // Convert role to lowercase
    }
}, {
    strict: true // Ensures that only fields defined in the schema are saved in the database
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Method to encrypt the user's password
UserSchema.methods.encryptPassword = async function (password) {
    try {
        // Hashing the password with bcrypt
        const hashedPassword = bcrypt.hashSync(password, 10);
        return hashedPassword;
    } catch (error) {
        // Handling any errors
        throw error;
    }
}

// Method to check if a provided password matches the stored hashed password
UserSchema.methods.isValidPassword = async function (password) {
    try {
        // Comparing the provided password with the stored hashed password
        return bcrypt.compareSync(password, this.password);
    } catch (error) {
        // Handling any errors
        console.log('ERROR: isValidPassword', error);
        throw error;
    }
}

// Apply plugins to schema
UserSchema.plugin(timestamps); // Adds timestamps for createdAt and updatedAt fields
UserSchema.plugin(uniqueValidator); // Ensures unique fields

// Export the User model and schema
module.exports = mongoose.model('User', UserSchema);
module.exports.Schema = UserSchema;
