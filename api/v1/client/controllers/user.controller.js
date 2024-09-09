const UserService = require("../../../../services/user.service")

class UserController{
    async getUsers(req, res, next){
        try {
            const { role } = req.query;
            let users = []
            if( role === 'staff'){
                users = await UserService.getUsersByRole('staff');
            }else if(role === 'students'){
                users = await UserService.getUsersByRole('students');
            }else if(role === 'librarian'){
                users = await UserService.getUsersByRole('librarian');
            }else{
                users = await UserService.getAll();
            }
            
            console.log( users )
            res.status(200).json({ success: true, users: users });
        } catch (error) {
            next(error)
        }
    }

    async deleteOneUser(req, res, next) {
        try {
            const { userId } = req.params;
            await UserService.deleteOne(userId);
            res.status(200).json({ success: true, message: 'User deleted successfully' });
        } catch (error) {
            next(error);
        }
    }

    async updateOneUser(req, res, next){
        try {
            const { userId } = req.params;

            const updatedUser = await UserService.updateOneUser(userId, req.body);
            res.status(200).json({ success: true, message: 'User updated successfully', data: updatedUser });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = UserController;