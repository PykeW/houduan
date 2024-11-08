// 错误码定义
const ErrorCodes = {
  SUCCESS: 0,           // 成功
  PARAM_ERROR: 1001,    // 参数错误
  UNAUTHORIZED: 1002,   // 未授权
  NOT_FOUND: 1003,      // 资源不存在
  OPERATION_FAILED: 1004, // 操作失败
  SYSTEM_ERROR: 2001    // 系统错误
};

// 错误码对应的消息
const ErrorMessages = {
  [ErrorCodes.SUCCESS]: '操作成功',
  [ErrorCodes.PARAM_ERROR]: '参数错误',
  [ErrorCodes.UNAUTHORIZED]: '未授权',
  [ErrorCodes.NOT_FOUND]: '资源不存在',
  [ErrorCodes.OPERATION_FAILED]: '操作失败',
  [ErrorCodes.SYSTEM_ERROR]: '系统错误'
};

module.exports = {
  ErrorCodes,
  ErrorMessages
}; 