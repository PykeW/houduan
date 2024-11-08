const db = require('../config/database');
const Response = require('../utils/response');
const { ErrorCodes } = require('../config/errorCodes');

const SoftwareController = {
    /**
     * 获取软件列表
     */
    async getList(req, res) {
        try {
            const { page = 1, pageSize = 10, category, keyword } = req.query;
            const offset = (page - 1) * pageSize;

            let query = `
                SELECT s.*, c.name as category_name, 
                       (SELECT version_number FROM versions WHERE software_id = s.id ORDER BY release_date DESC LIMIT 1) as latest_version
                FROM software s
                LEFT JOIN categories c ON s.category_id = c.id
                WHERE 1=1
            `;
            const params = [];

            if (category) {
                query += ' AND s.category_id = ?';
                params.push(category);
            }

            if (keyword) {
                query += ' AND (s.name LIKE ? OR s.description LIKE ?)';
                params.push(`%${keyword}%`, `%${keyword}%`);
            }

            // 获取总数
            const [countResult] = await db.query(
                `SELECT COUNT(*) as total FROM (${query}) as temp`,
                params
            );
            const total = countResult[0].total;

            // 获取分页数据
            query += ' LIMIT ? OFFSET ?';
            params.push(Number(pageSize), Number(offset));

            const [rows] = await db.query(query, params);

            res.json(Response.success({
                total,
                list: rows
            }));
        } catch (error) {
            console.error('获取软件列表错误:', error);
            res.status(500).json(Response.error(ErrorCodes.SYSTEM_ERROR));
        }
    },

    /**
     * 获取软件详情
     */
    async getDetail(req, res) {
        try {
            const { id } = req.params;

            const [software] = await db.query(
                `SELECT s.*, c.name as category_name
                 FROM software s
                 LEFT JOIN categories c ON s.category_id = c.id
                 WHERE s.id = ?`,
                [id]
            );

            if (!software[0]) {
                return res.status(404).json(Response.error(ErrorCodes.NOT_FOUND));
            }

            const [versions] = await db.query(
                'SELECT * FROM versions WHERE software_id = ? ORDER BY release_date DESC',
                [id]
            );

            const result = {
                ...software[0],
                versions
            };

            res.json(Response.success(result));
        } catch (error) {
            console.error('获取软件详情错误:', error);
            res.status(500).json(Response.error(ErrorCodes.SYSTEM_ERROR));
        }
    },

    /**
     * 创建新软件
     */
    async create(req, res) {
        try {
            const { name, description, category_id } = req.body;
            
            // 基本验证
            if (!name || !category_id) {
                return res.status(400).json(Response.error(ErrorCodes.PARAM_ERROR));
            }

            const [result] = await db.query(
                'INSERT INTO software (name, description, category_id) VALUES (?, ?, ?)',
                [name, description, category_id]
            );

            res.json(Response.success({
                id: result.insertId
            }));
        } catch (error) {
            console.error('创建软件错误:', error);
            res.status(500).json(Response.error(ErrorCodes.SYSTEM_ERROR));
        }
    }
};

module.exports = SoftwareController; 