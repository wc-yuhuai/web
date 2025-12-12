export class User {
  constructor(dbPool) {
    this.dbPool = dbPool;
  }

  async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    const connection = await this.dbPool.getConnection();
    try {
      await connection.query(query);
    } finally {
      connection.release();
    }
  }

  async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = ?';
    const connection = await this.dbPool.getConnection();
    try {
      const [rows] = await connection.query(query, [username]);
      return rows.length > 0 ? rows[0] : null;
    } finally {
      connection.release();
    }
  }

  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const connection = await this.dbPool.getConnection();
    try {
      const [rows] = await connection.query(query, [email]);
      return rows.length > 0 ? rows[0] : null;
    } finally {
      connection.release();
    }
  }

  async create(username, email, passwordHash) {
    const query = 'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)';
    const connection = await this.dbPool.getConnection();
    try {
      const [result] = await connection.query(query, [username, email, passwordHash]);
      return result.insertId;
    } finally {
      connection.release();
    }
  }

  async verifyPassword(inputPassword, storedHash) {
    // 在实际应用中，应使用 bcrypt 进行密码比较
    // 这里简化处理，实际应用中不应明文存储密码
    return inputPassword === storedHash;
  }
}
