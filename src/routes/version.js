const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const VersionController = require('../controllers/versionController');
const multer = require('multer');
const path = require('path');

// 配置文件上传
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/software');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// 公开接口 - 所有人都可以访问
router.get('/list/:softwareId', VersionController.getList);

// 管理接口 - 需要认证
router.post('/create', authMiddleware, upload.single('file'), VersionController.create);
router.delete('/delete/:id', authMiddleware, VersionController.delete);

module.exports = router; 