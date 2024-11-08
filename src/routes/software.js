const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const optionalAuthMiddleware = require('../middleware/optionalAuth');
const SoftwareController = require('../controllers/softwareController');

// 公开接口 - 所有人都可以访问
router.get('/list', SoftwareController.getList);
router.get('/detail/:id', SoftwareController.getDetail);

// 管理接口 - 需要认证
router.post('/create', authMiddleware, SoftwareController.create);

module.exports = router; 