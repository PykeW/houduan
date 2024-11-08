# API 测试用例文档

## 1. 管理员认证

### 1.1 管理员登录
- 接口：POST /api/auth/login
- 功能：管理员账号登录
- 测试代码：
```bash
# curl
curl -X POST https://vwswgnefsnhk.sealosgzg.site/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password123"}'
```
```javascript
// JavaScript
async function login() {
    const response = await fetch('https://vwswgnefsnhk.sealosgzg.site/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: 'admin',
            password: 'password123'
        })
    });
    const data = await response.json();
    console.log(data);
    // 保存token供后续使用
    localStorage.setItem('token', data.data.token);
}
```

## 2. 软件管理

### 2.1 获取软件列表
- 接口：GET /api/software/list
- 测试代码：
```bash
# curl
curl "https://vwswgnefsnhk.sealosgzg.site/api/software/list?page=1&pageSize=10&category=1&keyword=test"
```
```javascript
// JavaScript
async function getSoftwareList() {
    const params = new URLSearchParams({
        page: '1',
        pageSize: '10',
        category: '1',
        keyword: 'test'
    });
    const response = await fetch(`https://vwswgnefsnhk.sealosgzg.site/api/software/list?${params}`);
    const data = await response.json();
    console.log(data);
}
```

### 2.2 获取软件详情
- 测试代码：
```bash
# curl
curl https://vwswgnefsnhk.sealosgzg.site/api/software/detail/1
```
```javascript
// JavaScript
async function getSoftwareDetail(id) {
    const response = await fetch(`https://vwswgnefsnhk.sealosgzg.site/api/software/detail/${id}`);
    const data = await response.json();
    console.log(data);
}
```

### 2.3 创建新软件
- 测试代码：
```bash
# curl
curl -X POST https://vwswgnefsnhk.sealosgzg.site/api/software/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=新软件" \
  -F "description=软件描述" \
  -F "category_id=1" \
  -F "logo_file=@/path/to/logo.png"
```
```javascript
// JavaScript
async function createSoftware() {
    const formData = new FormData();
    formData.append('name', '新软件');
    formData.append('description', '软件描述');
    formData.append('category_id', '1');
    formData.append('logo_file', logoFileInput.files[0]);

    const response = await fetch('https://vwswgnefsnhk.sealosgzg.site/api/software/create', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
    });
    const data = await response.json();
    console.log(data);
}
```

## 3. 版本管理

### 3.1 获取版本列表
- 测试代码：
```bash
# curl
curl https://vwswgnefsnhk.sealosgzg.site/api/version/list/1
```
```javascript
// JavaScript
async function getVersionList(softwareId) {
    const response = await fetch(`https://vwswgnefsnhk.sealosgzg.site/api/version/list/${softwareId}`);
    const data = await response.json();
    console.log(data);
}
```

### 3.2 创建新版本
- 测试代码：
```bash
# curl
curl -X POST https://vwswgnefsnhk.sealosgzg.site/api/version/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "software_id=1" \
  -F "version_number=1.1.0" \
  -F "release_notes=版本更新说明" \
  -F "file=@/path/to/software.zip"
```
```javascript
// JavaScript
async function createVersion() {
    const formData = new FormData();
    formData.append('software_id', '1');
    formData.append('version_number', '1.1.0');
    formData.append('release_notes', '版本更新说明');
    formData.append('file', fileInput.files[0]);

    const response = await fetch('https://vwswgnefsnhk.sealosgzg.site/api/version/create', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
    });
    const data = await response.json();
    console.log(data);
}
```

### 3.3 删除版本
- 测试代码：
```bash
# curl
curl -X DELETE https://vwswgnefsnhk.sealosgzg.site/api/version/delete/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```
```javascript
// JavaScript
async function deleteVersion(id) {
    const response = await fetch(`https://vwswgnefsnhk.sealosgzg.site/api/version/delete/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    const data = await response.json();
    console.log(data);
}
```

## 4. 下载管理

### 4.1 获取下载链接
- 测试代码：
```bash
# curl
curl https://vwswgnefsnhk.sealosgzg.site/api/download/url/1
```
```javascript
// JavaScript
async function getDownloadUrl(versionId) {
    const response = await fetch(`https://vwswgnefsnhk.sealosgzg.site/api/download/url/${versionId}`);
    const data = await response.json();
    console.log(data);
}
```

### 4.2 文件下载
- 测试代码：
```bash
# curl 支持断点续传
curl -H "Range: bytes=0-1023" \
  https://vwswgnefsnhk.sealosgzg.site/api/download/file/YOUR_DOWNLOAD_TOKEN \
  -O output.file
```
```javascript
// JavaScript
async function downloadFile(token) {
    // 普通下载
    const response = await fetch(`https://vwswgnefsnhk.sealosgzg.site/api/download/file/${token}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'filename';
    a.click();

    // 支持断点续传的下载
    const rangeResponse = await fetch(`https://vwswgnefsnhk.sealosgzg.site/api/download/file/${token}`, {
        headers: {
            'Range': 'bytes=0-1023'
        }
    });
    // 处理分片下载...
}
```

### 4.3 下载统计
- 测试代码：
```bash
# curl
curl "https://vwswgnefsnhk.sealosgzg.site/api/stats/download?software_id=1&start_date=2024-01-01&end_date=2024-12-31"
```
```javascript
// JavaScript
async function getDownloadStats() {
    const params = new URLSearchParams({
        software_id: '1',
        start_date: '2024-01-01',
        end_date: '2024-12-31'
    });
    
    // 可选带上token获取更详细的信息
    const headers = {};
    const token = localStorage.getItem('token');
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`https://vwswgnefsnhk.sealosgzg.site/api/stats/download?${params}`, {
        headers
    });
    const data = await response.json();
    console.log(data);
}
```

## 5. 完整的测试脚本
```javascript
// 测试工具函数
const test = {
    token: null,
    baseUrl: 'https://vwswgnefsnhk.sealosgzg.site',

    async init() {
        // 登录获取token
        await this.login();
        console.log('初始化完成');
    },

    async login() {
        const response = await fetch(`${this.baseUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'admin',
                password: 'password123'
            })
        });
        const data = await response.json();
        this.token = data.data.token;
    },

    async runAll() {
        await this.init();
        
        // 测试软件管理
        const softwareId = await this.testSoftwareManagement();
        
        // 测试版本管理
        const versionId = await this.testVersionManagement(softwareId);
        
        // 测试下载管理
        await this.testDownloadManagement(versionId);
        
        console.log('所有测试完成');
    },

    async testSoftwareManagement() {
        // 创建软件
        const createResponse = await this.createSoftware();
        const softwareId = createResponse.data.id;
        
        // 获取列表
        await this.getSoftwareList();
        
        // 获取详情
        await this.getSoftwareDetail(softwareId);
        
        return softwareId;
    },

    async testVersionManagement(softwareId) {
        // 创建版本
        const createResponse = await this.createVersion(softwareId);
        const versionId = createResponse.data.id;
        
        // 获取版本列表
        await this.getVersionList(softwareId);
        
        return versionId;
    },

    async testDownloadManagement(versionId) {
        // 获取下载链接
        const urlResponse = await this.getDownloadUrl(versionId);
        const downloadToken = urlResponse.data.download_url.split('/').pop();
        
        // 下载文件
        await this.downloadFile(downloadToken);
        
        // 获取统计
        await this.getDownloadStats();
    }
};

// 运行所有测试
test.runAll().catch(console.error);
```

## 6. 测试注意事项
1. 在运行测试之前，确保服务器已经启动并且数据库已经初始化
2. 文件上传测试需要准备实际的测试文件
3. 建议先在开发环境中进行测试
4. 注意保存和管理测试过程中获取的token
5. 对于大文件下载测试，建议使用支持断点续传的下载工具
6. 所有请求都使用 HTTPS 协议访问 vwswgnefsnhk.sealosgzg.site 域名
```

