const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// 加载环境变量
dotenv.config();

// 导入路由
const softwareRouter = require('./src/routes/software');
const versionRouter = require('./src/routes/version');
const downloadRouter = require('./src/routes/download');
const authRouter = require('./src/routes/auth');

// 创建Express应用实例
const app = express();

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 配置静态文件目录，但不直接暴露文件路径
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, path, stat) => {
        res.set('Content-Disposition', 'attachment'); // 强制下载而不是在浏览器中打开
    }
}));

// 注册路由
app.use('/api/software', softwareRouter);
app.use('/api/version', versionRouter);
app.use('/api/download', downloadRouter);
app.use('/api/auth', authRouter);

// 添加测试路由
app.get('/api/test', (req, res) => {
    res.json({
        code: 0,
        message: '服务器运行正常',
        time: new Date().toISOString()
    });
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        code: 2001,
        message: '服务器内部错误'
    });
});

// 设置端口
const PORT = process.env.PORT || 3000;

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
}); 