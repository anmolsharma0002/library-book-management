const mongoose = require('mongoose');
const { Schema } = mongoose;
const timestamps = require('mongoose-timestamp');
const uniqueValidator = require('mongoose-unique-validator');

const BookSchema = new Schema({

    isbn: { 
        type: String, 
        trim: true, 
        required: true 
    },
    title: { 
        type: String, 
        trim: true, 
    },
    author: {
        type: String,
    },
    publisher: {
        type: String,
    },
    status:{
        type: String,
        enum: ['available', 'issued', 'lost', 'damaged'],
        default: 'available'
    },
}, {
    strict: true,
}, {
    timestamps: true
})

BookSchema.plugin(timestamps);
BookSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Book', BookSchema);
module.exports.Schema = BookSchema;