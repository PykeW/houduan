-- 软件分类表
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 软件信息表
CREATE TABLE software (
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
);

-- 版本信息表
CREATE TABLE versions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    software_id INT NOT NULL,
    version_number VARCHAR(50) NOT NULL,
    release_notes TEXT,
    file_path VARCHAR(255) NOT NULL,
    file_size BIGINT,
    download_count INT DEFAULT 0,
    release_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (software_id) REFERENCES software(id)
);

-- 下载记录表
CREATE TABLE download_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    version_id INT NOT NULL,
    ip_address VARCHAR(50),
    user_agent VARCHAR(255),
    download_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (version_id) REFERENCES versions(id)
);

-- 管理员表
CREATE TABLE admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 