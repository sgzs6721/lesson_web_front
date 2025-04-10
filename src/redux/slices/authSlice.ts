import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
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
  phone: string;
  password: string;
}

// 注册接口参数
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
      console.log('开始调用登录 API:', params);
      // 调用实际的API接口
      const response = await API.auth.login(params);
      console.log('登录 API 调用成功:', response);

      // 保存到本地存储
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));

      message.success('登录成功');
      return response;
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

// 注册操作
export const register = createAsyncThunk(
  'auth/register',
  async (params: RegisterParams, { rejectWithValue }) => {
    try {
      console.log('开始调用注册 API:', params);
      // 调用实际的API接口
      const response = await API.auth.register(params);

      console.log('注册 API 调用成功:', response);
      
      // 检查响应状态码
      if (response.code === 200) {
        message.success(response.message || '注册成功');
        return response.data;
      } else {
        message.error(response.message || '注册失败');
        return rejectWithValue(response.message || '注册失败');
      }
    } catch (error: any) {
      console.error('注册 API 调用失败:', error);
      message.error(error.message || '注册失败');
      return rejectWithValue(error.message || '注册失败');
    }
  }
);

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
      // 注册
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || '注册失败';
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