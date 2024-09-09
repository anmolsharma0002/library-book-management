const UserService = require("../../../../services/user.service");

class UserController {
    /**
     * @route GET /user
     * @description Retrieve users based on role or all users if no role is specified.
     * @query {string} role - The role to filter users by (staff, students, librarian).
     * @access Private (Librarian)
     */
    async getUsers(req, res, next) {
        try {
            const { role } = req.query;
            let users = [];

            if (role === 'staff') {
                users = await UserService.getUsersByRole('staff');
            } else if (role === 'students') {
                users = await UserService.getUsersByRole('student');
            } else if (role === 'librarian') {
                users = await UserService.getUsersByRole('librarian');
            } else {
                users = await UserService.getAll();
            }

            res.status(200).json({ success: true, users });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @route DELETE /user/:userId
     * @description Delete a user by their ID.
     * @param {string} userId - The ID of the user to delete.
     * @access Private (Librarian)
     */
    async deleteOneUser(req, res, next) {
        try {
            const { userId } = req.params;
            await UserService.deleteOne(userId);
            res.status(200).json({ success: true, message: 'User deleted successfully' });
        } catch (error) {
            next(error);
        }
    }

    /**
     * @route PUT /user/:userId
     * @description Update a user's details.
     * @param {string} userId - The ID of the user to update.
     * @body {Object} userDetails - The details to update (e.g., name, email, etc.).
     * @access Private (Librarian)
     */
    async updateOneUser(req, res, next) {
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
