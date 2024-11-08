const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');

/**
 * 文件处理工具类
 */
const FileHandler = {
    /**
     * 生成唯一的文件名
     */
    generateUniqueFileName(originalName) {
        const timestamp = Date.now();
        const random = crypto.randomBytes(8).toString('hex');
        const ext = path.extname(originalName);
        return `${timestamp}-${random}${ext}`;
    },

    /**
     * 确保目录存在
     */
    async ensureDir(dirPath) {
        try {
            await fs.access(dirPath);
        } catch {
            await fs.mkdir(dirPath, { recursive: true });
        }
    },

    /**
     * 获取文件大小
     */
    async getFileSize(filePath) {
        const stats = await fs.stat(filePath);
        return stats.size;
    }
};

module.exports = FileHandler; 