const userService = require('../services/userService');
const { validateUser } = require('../validators/userValidator');

class UserController {
    async createUser(req, res) {
        const { error } = validateUser(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        try {
            const user = await userService.createUser(req.body);
            res.status(201).json(user);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async getUserById(req, res) {
        try {
            const user = await userService.getUserById(req.params.userId);
            res.json(user);
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    }

    async listUsers(req, res) {
        try {
            const users = await userService.listUsers();
            res.json(users);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    async updateUser(req, res) {
        try {
            const user = await userService.updateUser(req.params.userId, req.body);
            res.json(user);
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    }

    async softDeleteUser(req, res) {
        try {
            const user = await userService.softDeleteUser(req.params.userId);
            res.status(204).send();
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    }

    async loginUser(req, res) {
        try {
            const { email, password } = req.body;
            const result = await userService.loginUser(email, password);
            res.json(result);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
}

module.exports = new UserController();
