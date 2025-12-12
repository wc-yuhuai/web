import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';
import mysql from 'mysql2/promise';
import api from "./api/index.js";

const app = new Hono();

// MySQL 连接池
const dbPool = mysql.createPool({
  host: 'localhost',
  user: 'web-db',
  password: 'Mysql@123',
  database: 'web-db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 将数据库连接池设为全局，以便路由中使用
global.dbPool = dbPool;

// 初始化用户表 - 使用动态导入的正确语法
import UserModule from './models/User.js';
const UserClass = UserModule.User || UserModule.default;
const user = new UserClass(dbPool);
await user.createTable();


// 静态文件中间件：仅当不是 /api 请求时才服务静态文件
app.use('*', async (c, next) => {
  const url = new URL(c.req.url);
  if (url.pathname.startsWith('/api')) {
    return next();
  }
  return serveStatic({ root: './www' })(c, next);
});

// API 路由
app.route('/api', api);

// 错误 & 404 处理
app.onError((err, c) => {
  console.error(err);
  return c.text('Internal Server Error', 500);
});

app.notFound((c) => c.text('Not Found', 404));

// 启动服务器（使用 @hono/node-server 的 serve）
import { serve } from '@hono/node-server';

const port = process.env.PORT || 80;
console.log(`Server is running on http://localhost:${port}`);
serve({ 
  fetch: app.fetch, 
  port 
});