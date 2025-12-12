// index.js

import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static'; // ✅ 正确路径
import mysql from 'mysql2/promise';

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

// 静态文件中间件：仅当不是 /api 请求时才服务静态文件
app.use('*', async (c, next) => {
  const url = new URL(c.req.url);
  if (url.pathname.startsWith('/api')) {
    return next();
  }
  return serveStatic({ root: './www' })(c, next);
});

// API 路由
const api = new Hono();
api.get('/', (c) => c.text('Hello, World!'));
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
serve({ fetch: app.fetch, port });