const userDAO = require('../dao/userDao');
const UserDTO = require('../dto/userDto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class UserService {
    async createUser(userData) {
        const user = await userDAO.createUser(userData);
        return new UserDTO(user);
    }

    async getUserById(userId) {
        const user = await userDAO.getUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return new UserDTO(user);
    }

    async listUsers() {
        const users = await userDAO.listUsers();
        return users.map(user => new UserDTO(user));
    }

    async updateUser(userId, updateData) {
        const user = await userDAO.updateUser(userId, updateData);
        return new UserDTO(user);
    }

    async softDeleteUser(userId) {
        const user = await userDAO.softDeleteUser(userId);
        return new UserDTO(user);
    }
    async loginUser(email, password) {
        const user = await userDAO.findUserByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return { user: new UserDTO(user), token };
    }
}

module.exports = new UserService();
