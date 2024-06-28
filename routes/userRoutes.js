const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// TODO: later on add admin only access to this
router.get('/user', userController.listUsers);

router.get('/user/:userId', authMiddleware, userController.getUserById);
router.post('/user', userController.createUser);

router.put('/user/:userId', authMiddleware, userController.updateUser);
router.patch('/user/:userId', authMiddleware, userController.updateUser);
router.delete('/user/:userId', authMiddleware, userController.softDeleteUser);

router.post('/user/login', userController.loginUser);

module.exports = router;
