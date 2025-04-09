// 用户类型
export interface User {
  id: string;
  username: string;
  role: string;
  name?: string;
  avatar?: string;
  phone?: string;
  email?: string;
  permissions?: string[];
}

// 登录参数类型
export interface LoginParams {
  username: string;
  password: string;
}

// 登录响应类型
export interface LoginResponse {
  token: string;
  user: User;
}

// 注册参数类型
export interface RegisterParams {
  phone: string;
  password: string;
  realName: string;
  institutionName: string;
  institutionType: string;
  institutionDescription?: string;
  managerName: string;
  managerPhone: string;
}

// 注册响应类型
export interface RegisterResponse {
  userId: number;
  phone: string;
  realName: string;
  status: number;
}
