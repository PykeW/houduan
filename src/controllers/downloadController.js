const db = require('../config/database');
const Response = require('../utils/response');
const { ErrorCodes } = require('../config/errorCodes');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const DownloadController = {
    /**
     * 获取下载链接
     */
    async getDownloadUrl(req, res) {
        try {
            const { versionId } = req.params;

            const [version] = await db.query(
                'SELECT id, file_path FROM versions WHERE id = ?',
                [versionId]
            );

            if (!version[0]) {
                return res.status(404).json(Response.error(ErrorCodes.NOT_FOUND));
            }

            // 生成下载令牌
            const token = jwt.sign(
                { versionId, path: version[0].file_path },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            const downloadUrl = `/api/download/file/${token}`;
            const expireTime = Date.now() + 3600000; // 1小时后过期

            res.json(Response.success({
                download_url: downloadUrl,
                expire_time: new Date(expireTime)
            }));
        } catch (error) {
            console.error('获取下载链接错误:', error);
            res.status(500).json(Response.error(ErrorCodes.SYSTEM_ERROR));
        }
    },

    /**
     * 文件下载
     */
    async downloadFile(req, res) {
        try {
            const { token } = req.params;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const { versionId, path: filePath } = decoded;

            // 检查文件是否存在
            if (!fs.existsSync(filePath)) {
                return res.status(404).json(Response.error(ErrorCodes.NOT_FOUND));
            }

            // 记录下载日志
            await db.query(
                `INSERT INTO download_logs (version_id, ip_address, user_agent) 
                 VALUES (?, ?, ?)`,
                [versionId, req.ip, req.headers['user-agent']]
            );

            // 更新下载计数
            await db.query(
                'UPDATE versions SET download_count = download_count + 1 WHERE id = ?',
                [versionId]
            );

            // 支持断点续传
            const stat = fs.statSync(filePath);
            const fileSize = stat.size;
            const range = req.headers.range;

            if (range) {
                const parts = range.replace(/bytes=/, "").split("-");
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

                res.writeHead(206, {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': end - start + 1,
                    'Content-Type': 'application/octet-stream'
                });

                fs.createReadStream(filePath, { start, end }).pipe(res);
            } else {
                res.writeHead(200, {
                    'Content-Length': fileSize,
                    'Content-Type': 'application/octet-stream'
                });

                fs.createReadStream(filePath).pipe(res);
            }
        } catch (error) {
            console.error('文件下载错误:', error);
            res.status(500).json(Response.error(ErrorCodes.SYSTEM_ERROR));
        }
    },

    /**
     * 获取下载统计
     */
    async getStats(req, res) {
        try {
            const { software_id, start_date, end_date } = req.query;
            const isAdmin = !!req.user; // 检查是否是管理员

            let query = `
                SELECT DATE(dl.download_time) as date, 
                       COUNT(*) as count
                       ${isAdmin ? ', dl.ip_address, dl.user_agent' : ''} 
                FROM download_logs dl
                JOIN versions v ON dl.version_id = v.id
            `;
            const params = [];

            if (software_id) {
                query += ' WHERE v.software_id = ?';
                params.push(software_id);
            }

            if (start_date) {
                query += params.length ? ' AND' : ' WHERE';
                query += ' dl.download_time >= ?';
                params.push(start_date);
            }

            if (end_date) {
                query += params.length ? ' AND' : ' WHERE';
                query += ' dl.download_time <= ?';
                params.push(end_date);
            }

            // 非管理员只能查看最近30天的数据
            if (!isAdmin) {
                query += params.length ? ' AND' : ' WHERE';
                query += ' dl.download_time >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)';
            }

            query += ' GROUP BY DATE(dl.download_time)';

            const [rows] = await db.query(query, params);

            const total = rows.reduce((sum, row) => sum + row.count, 0);

            // 根据用户角色返回不同级别的详细信息
            const response = {
                total,
                daily: rows.map(row => ({
                    date: row.date,
                    count: row.count,
                    ...(isAdmin ? {
                        ip_address: row.ip_address,
                        user_agent: row.user_agent
                    } : {})
                }))
            };

            res.json(Response.success(response));
        } catch (error) {
            console.error('获取下载统计错误:', error);
            res.status(500).json(Response.error(ErrorCodes.SYSTEM_ERROR));
        }
    }
};

module.exports = DownloadController; 