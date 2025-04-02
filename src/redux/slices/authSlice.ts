import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { message } from 'antd';
import { API } from '@/api';

// 定义用户类型
export interface User {
  id: string;
  username: string;
  role: string;
  avatar?: string;
  name?: string;
  email?: string;
  permissions?: string[];
  token?: string;
}

// 登录接口参数
export interface LoginParams {
  username: string;
  password: string;
}

// 认证状态
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

// 初始状态
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

// 从localStorage检查认证状态
export const checkAuth = createAsyncThunk('auth/check', async () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (!token || !userStr) {
    throw new Error('未登录');
  }

  // 在实际应用中，这里可以发送请求验证token是否有效
  return {
    user: JSON.parse(userStr) as User,
    token,
  };
});

// 登录操作
export const login = createAsyncThunk(
  'auth/login',
  async (params: LoginParams, { rejectWithValue }) => {
    try {
      // 在实际应用中，这里应该是API调用
      // const response = await API.auth.login(params);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockUser: User = {
        id: '1',
        username: params.username,
        role: 'admin',
        name: '管理员',
        token: 'mock-token-value'
      };

      // 保存到本地存储
      localStorage.setItem('token', mockUser.token!);
      localStorage.setItem('user', JSON.stringify(mockUser));

      message.success('登录成功');
      return { user: mockUser, token: mockUser.token };
    } catch (error: any) {
      message.error(error.message || '登录失败');
      return rejectWithValue(error.message || '登录失败');
    }
  }
);

// 退出登录
export const logout = createAsyncThunk('auth/logout', async () => {
  // 在实际应用中，这里应该是API调用
  // await API.auth.logout();
  
  // 清理本地存储
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  message.success('已退出登录');
  return null;
});

// 创建Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 其他同步操作
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 检查登录状态
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.loading = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.loading = false;
      })
      // 登录
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload as string || '登录失败';
      })
      // 登出
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer; 