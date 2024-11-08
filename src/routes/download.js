const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const optionalAuthMiddleware = require('../middleware/optionalAuth');
const DownloadController = require('../controllers/downloadController');

// 获取下载链接 - 所有人都可以访问
router.get('/url/:versionId', DownloadController.getDownloadUrl);

// 文件下载 - 所有人都可以访问
router.get('/file/:token', DownloadController.downloadFile);

// 下载统计 - 使用可选认证，管理员可以看到更多信息
router.get('/stats', optionalAuthMiddleware, DownloadController.getStats);

module.exports = router; 