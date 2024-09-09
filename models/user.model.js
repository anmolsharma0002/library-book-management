const mongoose = require('mongoose');
const { Schema } = mongoose;
const timestamps = require('mongoose-timestamp');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({

    name: { 
        type: String, 
        trim: true, 
        required: true 
    },
    
    email: {
        type: String,
        trim: true,
        required: [true, `Email Can't be blank`],
        match: [/\S+@\S+\.\S+/, 'Email is invalid'],
        unique: true,
        lowercase: true,
        index: true
    },

    password: { 
        type: String, 
        trim: true, 
        required: true 
    },

    role: {
        type: String,
        enum: ['librarian', 'staff', 'student'],
        default: 'student',
        lowercase: true
    },
    
}, {
    strict: true,
}, {
    timestamps: true
})

UserSchema.methods.encryptPassword = async function (password) {
    try {
        const hashedPassword = bcrypt.hashSync(password, 10);
        return hashedPassword;
    } catch (error) {
        throw error
    }
}


UserSchema.methods.isValidPassword = async function (password) {
    try {
        return bcrypt.compareSync(password, this.password);
    } catch (error) {
        console.log('ERROR:isValidPassword', error);
        throw error
    }
}

UserSchema.plugin(timestamps);
UserSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', UserSchema);
module.exports.Schema = UserSchema;