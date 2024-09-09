const AuthService = require("../../../../services/auth.service")

class AuthController{
    async register(req, res, next){
        try {
            await AuthService.register(req.body)
            res.status(200).json({ success: true, message: 'Account Created Successfully'});
        } catch (error) {
            next(error)
        }
    }

    async login(req, res, next){
        try {
            const token = await AuthService.login(req.body);
            res.status(200).json({ success: true, token: token });
        } catch (error) {
            next(error)
        }
    }
}

module.exports = AuthController;