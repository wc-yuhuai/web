import { AuthController } from '../controllers/authController.js';
import { User } from './models/User.js';

export function setupAuthRoutes(app, dbPool) {
  const userModel = new User(dbPool);
  const authController = new AuthController(userModel);
  
  // 注册路由
  app.post('/auth/register', async (c) => {
    return authController.register(c);
  });
  
  // 登录路由
  app.post('/auth/login', async (c) => {
    return authController.login(c);
  });
  
  return app;
}
