const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateUserId } = require('../validators/userValidator');

// TODO: later on add admin only access to this
router.get('/user', userController.listUsers);

router.get('/user/:userId', authMiddleware, validateUserId, userController.getUserById);
router.put('/user/:userId', authMiddleware, validateUserId, userController.updateUser);
router.patch('/user/:userId', authMiddleware, validateUserId, userController.updateUser);
router.delete('/user/:userId', authMiddleware, validateUserId, userController.softDeleteUser);

router.post('/user', userController.createUser);
router.post('/user/login', userController.loginUser);

module.exports = router;
