const createError = require('http-errors');
const Model = require('../models');
const { signUserAccessToken } = require('../helpers/jwt');

class AuthService {
    static async register(body){
        try {
            const { name, email, password, role } = body;

            if (!name || !email || !password || !role) throw createError.BadRequest();

            var user = await Model.User.findOne({ email });

            if(user) throw createError.Conflict(`${email} is already been registered`);
            
            // Create a new user instance
            let newUser = new Model.User({ name, email, password, role });
            
            // Call encryptPassword on the new user instance
            let encryptedPass = await newUser.encryptPassword(password);

            newUser.password = encryptedPass;

            // Save the new user to the database
            user = await newUser.save();
            
            return user;
            
        } catch (error) {
            throw error
        }
    }

    static async login(body){
        try {

            const { email, password } = body;
            
            if(!email || !password) throw createError.BadRequest();

            const user = await Model.User.findOne({ email });

            if (!user) throw createError.BadRequest(`${email} is not registered`);
      
            const isValidPassword = user.isValidPassword(password);

            if (!isValidPassword) throw createError.Unauthorized('Invalid Password');
      
            const token = await signUserAccessToken(user._id, user.role);

            return token;
          } catch (err) {
            throw err;
          }
    }
}

module.exports = AuthService;