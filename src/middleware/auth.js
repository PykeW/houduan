const jwt = require('jsonwebtoken');
const { ErrorCodes } = require('../config/errorCodes');

/**
 * 验证JWT令牌的中间件
 */
function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            code: ErrorCodes.UNAUTHORIZED,
            message: '未提供认证令牌'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            code: ErrorCodes.UNAUTHORIZED,
            message: '无效的认证令牌'
        });
    }
}

module.exports = authMiddleware; 