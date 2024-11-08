const db = require('../config/database');
const Response = require('../utils/response');
const { ErrorCodes } = require('../config/errorCodes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AuthController = {
    /**
     * 管理员登录
     */
    async login(req, res) {
        try {
            console.log('登录请求参数:', req.body);

            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json(Response.error(ErrorCodes.PARAM_ERROR));
            }

            const [users] = await db.query(
                'SELECT * FROM admins WHERE username = ?',
                [username]
            );

            console.log('查询到的用户:', users);

            const user = users[0];

            if (!user) {
                console.log('用户不存在');
                return res.status(401).json(Response.error(ErrorCodes.UNAUTHORIZED, '用户名或密码错误'));
            }

            const isValidPassword = await bcrypt.compare(password, user.password);
            console.log('密码验证结果:', isValidPassword);

            if (!isValidPassword) {
                console.log('密码错误');
                return res.status(401).json(Response.error(ErrorCodes.UNAUTHORIZED, '用户名或密码错误'));
            }

            const token = jwt.sign(
                { id: user.id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            res.json(Response.success({
                token,
                user_info: {
                    id: user.id,
                    username: user.username
                }
            }));
        } catch (error) {
            console.error('登录错误详情:', error);
            res.status(500).json(Response.error(ErrorCodes.SYSTEM_ERROR));
        }
    }
};

module.exports = AuthController; 