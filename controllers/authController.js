export class AuthController {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async register(c) {
    try {
      const { username, email, password } = await c.req.json();
      
      // 验证输入数据
      const validationErrors = await validateRegistrationData({ username, email, password });
      if (validationErrors.length > 0) {
        return c.json({ error: '验证失败', details: validationErrors }, 400);
      }
      
      // 检查用户名和邮箱是否已存在
      const existingUserByUsername = await this.userModel.findByUsername(username);
      const existingUserByEmail = await this.userModel.findByEmail(email);
      
      if (existingUserByUsername) {
        return c.json({ error: '用户名已存在' }, 409);
      }
      
      if (existingUserByEmail) {
        return c.json({ error: '邮箱已被注册' }, 409);
      }
      
      // 哈希密码
      const hashedPassword = await hashPassword(password);
      
      // 创建用户
      const userId = await this.userModel.create(username, email, hashedPassword);
      
      // 返回成功响应
      return c.json({ 
        message: '注册成功', 
        userId: userId 
      }, 201);
    } catch (error) {
      console.error('注册错误:', error);
      return c.json({ error: '注册失败' }, 500);
    }
  }

  async login(c) {
    try {
      const { username, password } = await c.req.json();
      
      if (!username || !password) {
        return c.json({ error: '用户名和密码不能为空' }, 400);
      }
      
      const authenticatedUser = await authenticateUser(this.userModel, username, password);
      
      if (!authenticatedUser) {
        return c.json({ error: '用户名或密码错误' }, 401);
      }
      
      // 在实际应用中，这里应该生成 JWT token
      // 为了简化，我们返回用户信息
      return c.json({
        message: '登录成功',
        user: authenticatedUser
      });
    } catch (error) {
      console.error('登录错误:', error);
      return c.json({ error: '登录失败' }, 500);
    }
  }
}
