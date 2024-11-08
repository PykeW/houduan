const db = require('../config/database');
const Response = require('../utils/response');
const { ErrorCodes } = require('../config/errorCodes');
const FileHandler = require('../utils/fileHandler');

const VersionController = {
    /**
     * 获取版本列表
     */
    async getList(req, res) {
        try {
            const { softwareId } = req.params;
            
            const [versions] = await db.query(
                `SELECT id, version_number, release_notes, file_size, 
                        download_count, release_date
                 FROM versions 
                 WHERE software_id = ? 
                 ORDER BY release_date DESC`,
                [softwareId]
            );

            res.json(Response.success(versions));
        } catch (error) {
            console.error('获取版本列表错误:', error);
            res.status(500).json(Response.error(ErrorCodes.SYSTEM_ERROR));
        }
    },

    /**
     * 创建新版本
     */
    async create(req, res) {
        try {
            const { software_id, version_number, release_notes } = req.body;
            const file = req.file;

            if (!software_id || !version_number || !file) {
                return res.status(400).json(Response.error(ErrorCodes.PARAM_ERROR));
            }

            const fileSize = await FileHandler.getFileSize(file.path);

            const [result] = await db.query(
                `INSERT INTO versions (software_id, version_number, release_notes, 
                                     file_path, file_size) 
                 VALUES (?, ?, ?, ?, ?)`,
                [software_id, version_number, release_notes, file.path, fileSize]
            );

            res.json(Response.success({
                id: result.insertId
            }));
        } catch (error) {
            console.error('创建版本错误:', error);
            res.status(500).json(Response.error(ErrorCodes.SYSTEM_ERROR));
        }
    },

    /**
     * 删除版本
     */
    async delete(req, res) {
        try {
            const { id } = req.params;

            const [version] = await db.query(
                'SELECT file_path FROM versions WHERE id = ?',
                [id]
            );

            if (!version[0]) {
                return res.status(404).json(Response.error(ErrorCodes.NOT_FOUND));
            }

            // 删除文件
            try {
                await FileHandler.deleteFile(version[0].file_path);
            } catch (error) {
                console.error('删除文件错误:', error);
            }

            // 删除数据库记录
            await db.query('DELETE FROM versions WHERE id = ?', [id]);

            res.json(Response.success(null, '删除成功'));
        } catch (error) {
            console.error('删除版本错误:', error);
            res.status(500).json(Response.error(ErrorCodes.SYSTEM_ERROR));
        }
    }
};

module.exports = VersionController; 