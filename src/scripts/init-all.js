const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

async function initializeAll() {
    let connection;
    
    try {
        // 首先创建没有指定数据库的连接
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT
        });

        console.log('连接数据库服务器成功');

        // 创建数据库
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        console.log('创建数据库成功');

        // 使用新数据库
        await connection.query(`USE ${process.env.DB_NAME}`);
        console.log('切换到数据库成功');

        // 创建表
        await connection.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('创建categories表成功');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS software (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                logo_url VARCHAR(255),
                publisher VARCHAR(100),
                category_id INT,
                download_count INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories(id)
            )
        `);
        console.log('创建software表成功');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS versions (
                id INT PRIMARY KEY AUTO_INCREMENT,
                software_id INT NOT NULL,
                version_number VARCHAR(50) NOT NULL,
                release_notes TEXT,
                file_path VARCHAR(255) NOT NULL,
                file_size BIGINT,
                download_count INT DEFAULT 0,
                release_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (software_id) REFERENCES software(id)
            )
        `);
        console.log('创建versions表成功');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS download_logs (
                id INT PRIMARY KEY AUTO_INCREMENT,
                version_id INT NOT NULL,
                ip_address VARCHAR(50),
                user_agent VARCHAR(255),
                download_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (version_id) REFERENCES versions(id)
            )
        `);
        console.log('创建download_logs表成功');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS admins (
                id INT PRIMARY KEY AUTO_INCREMENT,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('创建admins表成功');

        // 创建管理员账号
        const [admins] = await connection.query('SELECT * FROM admins WHERE username = ?', ['admin']);
        
        if (admins.length === 0) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password123', salt);
            
            await connection.query(
                'INSERT INTO admins (username, password) VALUES (?, ?)',
                ['admin', hashedPassword]
            );
            console.log('创建管理员账号成功');
            console.log('用户名: admin');
            console.log('密码: password123');
        } else {
            console.log('管理员账号已存在');
        }

        console.log('所有初始化操作完成');
        process.exit(0);
    } catch (error) {
        console.error('初始化过程出错:', error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// 运行初始化
initializeAll(); 