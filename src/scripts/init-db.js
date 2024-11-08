const db = require('../config/database');
const fs = require('fs').promises;
const path = require('path');

async function initDatabase() {
    try {
        // 读取 schema.sql 文件
        const schema = await fs.readFile(
            path.join(__dirname, '../models/schema.sql'),
            'utf8'
        );

        // 分割SQL语句
        const statements = schema
            .split(';')
            .filter(statement => statement.trim());

        // 执行每个SQL语句
        for (const statement of statements) {
            if (statement.trim()) {
                await db.query(statement);
                console.log('执行SQL语句成功');
            }
        }

        console.log('数据库初始化完成');
        process.exit(0);
    } catch (error) {
        console.error('数据库初始化失败:', error);
        process.exit(1);
    }
}

// 运行初始化函数
initDatabase(); 