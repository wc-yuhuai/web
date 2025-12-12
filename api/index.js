import { Hono } from 'hono';
import { setupAuthRoutes } from './routes/authRoutes.js';

const api = new Hono();

// 设置认证路由
setupAuthRoutes(api, global.dbPool);

api.get('/', (c) => c.text('API Root'));

api.get("/:a/:b", (c)=> {
    const a = Number(c.req.param("a"))
    const b = Number(c.req.param("b"))
    return c.html("<h1>" + (a + b )+"</h1>")
})

export default api;