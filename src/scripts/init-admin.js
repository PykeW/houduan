const db = require('../config/database');
const bcrypt = require('bcryptjs');

async function createInitialAdmin() {
    try {
        // 检查是否已存在管理员账号
        const [existingAdmins] = await db.query('SELECT * FROM admins WHERE username = ?', ['admin']);
        
        if (existingAdmins.length > 0) {
            console.log('管理员账号已存在');
            process.exit(0);
        }

        // 创建密码哈希
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        // 插入管理员账号
        await db.query(
            'INSERT INTO admins (username, password) VALUES (?, ?)',
            ['admin', hashedPassword]
        );

        console.log('初始管理员账号创建成功');
        console.log('用户名: admin');
        console.log('密码: password123');
        
        process.exit(0);
    } catch (error) {
        console.error('创建管理员账号失败:', error);
        process.exit(1);
    }
}

// 运行初始化函数
createInitialAdmin(); 