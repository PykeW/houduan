const jwt = require('jsonwebtoken');

/**
 * 可选的JWT认证中间件
 * 如果提供了有效的token，则解析用户信息；如果没有提供token或token无效，则继续处理请求
 */
function optionalAuthMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        } catch (error) {
            // Token无效，但我们不返回错误
            console.warn('Invalid token provided:', error.message);
        }
    }
    
    next();
}

module.exports = optionalAuthMiddleware; 