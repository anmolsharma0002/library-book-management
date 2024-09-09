const mongoose = require('mongoose');
const { Schema } = mongoose;
const timestamps = require('mongoose-timestamp');
const uniqueValidator = require('mongoose-unique-validator');

const BookIssueSchema = new Schema({
  book: {
    type: Schema.ObjectId,
    ref: 'Book',
    required: true
  },
  originalIssuedTo: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  issuedTo: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  issuedBy: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  returnDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['issued', 'returned', 'overdue', 'transferred']
  },
  transferHistory: [
    {
      transferredTo: {
        type: Schema.ObjectId,
        ref: 'User'
      },
      transferredBy: {
        type: Schema.ObjectId,
        ref: 'User'
      },
      transferDate: {
        type: Date
      }
    }
  ]
}, {
  strict: true
}, {
  timestamps: true
});

BookIssueSchema.plugin(timestamps);
BookIssueSchema.plugin(uniqueValidator);

module.exports = mongoose.model('BookIssue', BookIssueSchema);
module.exports.Schema = BookIssueSchema;