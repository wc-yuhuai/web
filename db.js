// db.js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'web-db',
  password: 'Mysql@123',     // ← 替换为你的密码
  database: 'web-db',     // ← 替换为你的数据库名
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 测试连接函数
export const testConnection = async () => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    console.log('✅ Database connected! Test result:', rows[0].solution);
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
};

export default pool;
