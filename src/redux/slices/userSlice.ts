import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '@/api';

interface User {
  id: string;
  username: string;
  role: string;
  name: string;
  email?: string;
  avatar?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface UserState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  total: number;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
  total: 0,
};

// 异步获取用户列表
export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async (params: any, { rejectWithValue }) => {
    try {
      // 实际项目中会调用API
      // const response = await API.user.getList(params);
      
      // 这里暂时模拟数据
      return {
        list: [
          {
            id: '1',
            username: 'admin',
            role: 'admin',
            name: '管理员',
            email: 'admin@example.com',
            status: 'active',
            createdAt: '2023-01-01T00:00:00Z',
          }
        ],
        total: 1,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || '获取用户列表失败');
    }
  }
);

// 创建用户
export const createUser = createAsyncThunk(
  'user/createUser',
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      // 实际项目中会调用API
      // const response = await API.user.create(userData);
      
      // 这里暂时模拟数据
      return {
        id: Date.now().toString(),
        username: userData.username || '',
        role: userData.role || 'user',
        name: userData.name || '',
        email: userData.email,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
    } catch (error: any) {
      return rejectWithValue(error.message || '创建用户失败');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // 获取用户列表
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload.list;
        state.total = action.payload.total;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 创建用户
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
        state.total += 1;
      });
  },
});

export const { clearUserError, setCurrentUser } = userSlice.actions;
export default userSlice.reducer; 