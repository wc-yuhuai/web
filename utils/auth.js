import { User } from './models/User.js';

export async function hashPassword(password) {
  // 在实际应用中，应使用 bcrypt 或其他安全哈希算法
  // 这里简化处理，实际应用中不应明文存储密码
  return password;
}

export async function validateRegistrationData(data) {
  const errors = [];
  
  if (!data.username || data.username.trim().length < 3) {
    errors.push('用户名至少需要3个字符');
  }
  
  if (!data.email || !isValidEmail(data.email)) {
    errors.push('请输入有效的邮箱地址');
  }
  
  if (!data.password || data.password.length < 6) {
    errors.push('密码至少需要6个字符');
  }
  
  return errors;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function authenticateUser(userModel, username, password) {
  const user = await userModel.findByUsername(username);
  if (!user) {
    return null;
  }
  
  const isValid = await userModel.verifyPassword(password, user.password_hash);
  if (!isValid) {
    return null;
  }
  
  // 返回用户信息，但不包含密码
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.created_at
  };
}