const mongoose = require('mongoose'); // Import mongoose for schema definition and model creation
const { Schema } = mongoose; // Destructuring Schema from mongoose
const timestamps = require('mongoose-timestamp'); // Plugin for adding createdAt and updatedAt timestamps
const uniqueValidator = require('mongoose-unique-validator'); // Plugin for ensuring unique fields

// Define the Book schema
const BookSchema = new Schema({
    isbn: {
        type: String,
        trim: true, // Removes whitespace
        required: true // This field is required
    },
    title: {
        type: String,
        trim: true // Removes whitespace
    },
    author: {
        type: String
    },
    publisher: {
        type: String
    },
    status: {
        type: String,
        enum: ['available', 'issued', 'lost', 'damaged'], // statuses for the book
        default: 'available', // Default is 'available'
        lowercase: true // Convert role to lowercase
    }
}, {
    strict: true, // Ensures that only fields defined in the schema are saved in the database
    
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Apply plugins to schema
BookSchema.plugin(timestamps); // Adds timestamps for created and updated fields
BookSchema.plugin(uniqueValidator); // Ensures unique fields for the schema

// Export the Book model and schema
module.exports = mongoose.model('Book', BookSchema);
module.exports.Schema = BookSchema;
