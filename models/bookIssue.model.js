const mongoose = require('mongoose'); // Import mongoose for schema definition and model creation
const { Schema } = mongoose; // Destructuring Schema from mongoose
const timestamps = require('mongoose-timestamp'); // Plugin for adding createdAt and updatedAt timestamps
const uniqueValidator = require('mongoose-unique-validator'); // Plugin for ensuring unique fields

// Define the BookIssue schema
const BookIssueSchema = new Schema({
  book: {
    type: Schema.ObjectId,
    ref: 'Book', // Reference to the Book model
    required: true // This field is required
  },
  originalIssuedTo: {
    type: Schema.ObjectId,
    ref: 'User', // Reference to the User model for the original user who was issued the book
    required: true // This field is required
  },
  issuedTo: {
    type: Schema.ObjectId,
    ref: 'User', // Reference to the User model for the current user who has the book
    required: true // This field is required
  },
  issuedBy: {
    type: Schema.ObjectId,
    ref: 'User', // Reference to the User model for the user who issued the book
    required: true // This field is required
  },
  issueDate: {
    type: Date,
    default: Date.now // Default to the current date and time
  },
  returnDate: {
    type: Date // Optional field for the date the book was returned
  },
  status: {
    type: String,
    enum: ['issued', 'returned', 'overdue', 'transferred'], // status to issue book
    default: 'issued', // Default is 'issued'
    lowercase: true // Convert role to lowercase
  },
  transferHistory: [
    {
      transferredTo: {
        type: Schema.ObjectId,
        ref: 'User' // Reference to the User model for the new user to whom the book was transferred
      },
      transferredBy: {
        type: Schema.ObjectId,
        ref: 'User' // Reference to the User model for the user who transferred the book
      },
      transferDate: {
        type: Date // Date when the transfer took place
      }
    }
  ]
}, {
  strict: true, // Ensures that only fields defined in the schema are saved in the database
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Apply plugins to schema
BookIssueSchema.plugin(timestamps); // Adds timestamps for created and updated fields
BookIssueSchema.plugin(uniqueValidator); // Ensures unique fields

// Export the BookIssue model and schema
module.exports = mongoose.model('BookIssue', BookIssueSchema);
module.exports.Schema = BookIssueSchema;
