const User = require('../models/userModel');

class UserDAO {
    async createUser(userData) {
        const user = new User(userData);
        return await user.save();
    }

    async getUserById(userId) {
        return await User.findOne({
            _id: userId,
            isActive: true
        });
    }

    async listUsers() {
        return await User.find({ isActive: true });
    }

    async updateUser(userId, updateData) {
        return await User.findByIdAndUpdate(userId, updateData, { new: true });
    }

    async softDeleteUser(userId) {
        return await User.findByIdAndUpdate(userId, { isActive: false }, { new: true });
    }

    async findUserByEmail(email) {
        return await User.findOne({
            email: email
        });
    }
}

module.exports = new UserDAO();
