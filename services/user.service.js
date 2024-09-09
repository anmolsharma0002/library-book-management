const createError = require('http-errors');
const Model = require('../models');

class UserService {
    static async getById(userId) {
        try {
            if(!userId) throw createError.BadRequest('User Id is requied');

            const user = await Model.User.findById(userId).select('-password');;
            if (!user) throw createError.NotFound('User not found');
            
            return user;
        } catch (error) {
            throw error;
        }
    }

    static async getOne(body) {
        try {
            if (!body || Object.keys(body).length === 0) {
                throw createError.BadRequest('Provide any paramter');
            }
            
            const user = await Model.User.findOne(body).select('-password');;
            if (!user) throw createError.NotFound('User not found');
            return user;
        } catch (error) {
            throw error;
        }
    }

    static async getAll() {
        try {            
            const user = await Model.User.find().select('-password');;
            return user;
        } catch (error) {
            throw error;
        }
    }

    static async getUsersByRole(role) {
        try {          
            if(!role) throw createError.BadRequest('Role is requied');
            const users = await Model.User.find({ role }).select('-password');
            return users;
        } catch (error) {
            throw error;
        }
    }

    static async updateOneUser(userId, body) {
        try { 
            if (!body || Object.keys(body).length === 0) {
                throw createError.BadRequest('Provide any paramter');
            }

            if(body.password){
                delete body.password
            }

            if(body._id){
                delete body._id
            }
            
            const user = await Model.User.findByIdAndUpdate(Model.mongoose.Types.ObjectId(userId), body, { new: true }).select('-password');;
            return user;
        } catch (error) {
            throw error;
        }
    }

    static async deleteOne(userId) {
        try {
            if (!userId) throw createError.BadRequest('User Id is required');
    
            const user = await Model.User.findByIdAndRemove(Model.mongoose.Types.ObjectId(userId));
            if (!user) throw createError.NotFound('User not found');
    
            return user;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = UserService;