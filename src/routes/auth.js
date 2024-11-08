const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

// 管理员登录
router.post('/login', AuthController.login);

module.exports = router; 