const { ErrorCodes, ErrorMessages } = require('../config/errorCodes');

/**
 * 统一响应处理工具
 */
const Response = {
    /**
     * 成功响应
     */
    success(data = null, message = '操作成功') {
        return {
            code: ErrorCodes.SUCCESS,
            message,
            data
        };
    },

    /**
     * 错误响应
     */
    error(code = ErrorCodes.SYSTEM_ERROR, message = null) {
        return {
            code,
            message: message || ErrorMessages[code]
        };
    }
};

module.exports = Response; 