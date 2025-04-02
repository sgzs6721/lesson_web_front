import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define types
export interface SystemNotification {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: string;
}

export interface SystemSetting {
  id: string;
  key: string;
  value: string;
  description: string;
  category: 'general' | 'appearance' | 'notification' | 'security';
  updatedAt: string;
}

export interface SystemLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  ip: string;
  userAgent: string;
  createdAt: string;
}

export interface SystemState {
  notifications: SystemNotification[];
  settings: SystemSetting[];
  logs: SystemLog[];
  unreadNotificationCount: number;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: SystemState = {
  notifications: [],
  settings: [],
  logs: [],
  unreadNotificationCount: 0,
  loading: false,
  error: null,
};

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'system/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, replace with actual API call
      // Example: const response = await api.get('/system/notifications');
      // For now, simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        {
          id: '1',
          title: '系统维护通知',
          content: '系统将于2022年7月1日凌晨2点至4点进行维护升级，期间系统将不可用。',
          type: 'warning',
          read: false,
          createdAt: '2022-06-25T10:00:00.000Z',
        },
        {
          id: '2',
          title: '新功能上线',
          content: '学员管理模块新增批量导入功能，请查看帮助文档了解详情。',
          type: 'info',
          read: false,
          createdAt: '2022-06-20T15:30:00.000Z',
        },
        {
          id: '3',
          title: '数据备份成功',
          content: '系统数据已成功备份至云端存储，备份时间：2022年6月18日 03:00。',
          type: 'success',
          read: true,
          createdAt: '2022-06-18T03:00:00.000Z',
        },
      ] as SystemNotification[];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchSettings = createAsyncThunk(
  'system/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, replace with actual API call
      // Example: const response = await api.get('/system/settings');
      // For now, simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        {
          id: '1',
          key: 'system_name',
          value: '游泳教学管理系统',
          description: '系统名称，显示在浏览器标题和登录页面',
          category: 'general',
          updatedAt: '2022-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          key: 'theme_color',
          value: 'blue',
          description: '系统主题颜色',
          category: 'appearance',
          updatedAt: '2022-03-15T10:30:00.000Z',
        },
        {
          id: '3',
          key: 'notification_email',
          value: 'admin@example.com',
          description: '系统通知接收邮箱',
          category: 'notification',
          updatedAt: '2022-02-10T14:20:00.000Z',
        },
        {
          id: '4',
          key: 'password_expire_days',
          value: '90',
          description: '密码过期天数，超过后需要重新设置密码',
          category: 'security',
          updatedAt: '2022-05-01T09:15:00.000Z',
        },
      ] as SystemSetting[];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchSystemLogs = createAsyncThunk(
  'system/fetchLogs',
  async (params: { startDate?: string; endDate?: string; userId?: string; action?: string } = {}, { rejectWithValue }) => {
    try {
      // In a real app, replace with actual API call
      // Example: const response = await api.get('/system/logs', { params });
      // For now, simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        {
          id: '1',
          userId: '1',
          userName: '管理员',
          action: 'LOGIN',
          details: '用户登录成功',
          ip: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
          createdAt: '2022-06-28T08:00:00.000Z',
        },
        {
          id: '2',
          userId: '1',
          userName: '管理员',
          action: 'UPDATE_SETTING',
          details: '更新系统设置：theme_color',
          ip: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
          createdAt: '2022-06-28T08:15:00.000Z',
        },
        {
          id: '3',
          userId: '2',
          userName: '前台',
          action: 'CREATE_STUDENT',
          details: '创建新学员：张三',
          ip: '192.168.1.101',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
          createdAt: '2022-06-28T09:30:00.000Z',
        },
      ] as SystemLog[];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateNotificationStatus = createAsyncThunk(
  'system/updateNotificationStatus',
  async ({ id, read }: { id: string; read: boolean }, { rejectWithValue }) => {
    try {
      // In a real app, replace with actual API call
      // Example: const response = await api.patch(`/system/notifications/${id}`, { read });
      // For now, simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      return { id, read };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateSystemSetting = createAsyncThunk(
  'system/updateSetting',
  async ({ id, value }: { id: string; value: string }, { rejectWithValue }) => {
    try {
      // In a real app, replace with actual API call
      // Example: const response = await api.patch(`/system/settings/${id}`, { value });
      // For now, simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      return { id, value, updatedAt: new Date().toISOString() };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Slice
const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    clearSystemError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<SystemNotification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadNotificationCount += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchNotifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.unreadNotificationCount = action.payload.filter(notification => !notification.read).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchSettings
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchSystemLogs
      .addCase(fetchSystemLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSystemLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
      })
      .addCase(fetchSystemLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // updateNotificationStatus
      .addCase(updateNotificationStatus.fulfilled, (state, action) => {
        const { id, read } = action.payload;
        const notification = state.notifications.find(n => n.id === id);
        if (notification) {
          // If marking as read and it was previously unread, decrement count
          if (read && !notification.read) {
            state.unreadNotificationCount -= 1;
          }
          // If marking as unread and it was previously read, increment count
          else if (!read && notification.read) {
            state.unreadNotificationCount += 1;
          }
          notification.read = read;
        }
      })
      // updateSystemSetting
      .addCase(updateSystemSetting.fulfilled, (state, action) => {
        const { id, value, updatedAt } = action.payload;
        const setting = state.settings.find(s => s.id === id);
        if (setting) {
          setting.value = value;
          setting.updatedAt = updatedAt;
        }
      });
  },
});

// Actions
export const { clearSystemError, addNotification } = systemSlice.actions;

// Selectors
export const selectSystemState = (state: RootState) => state.system;
export const selectNotifications = (state: RootState) => state.system.notifications;
export const selectUnreadNotificationCount = (state: RootState) => state.system.unreadNotificationCount;
export const selectSettings = (state: RootState) => state.system.settings;
export const selectSystemLogs = (state: RootState) => state.system.logs;
export const selectSystemLoading = (state: RootState) => state.system.loading;
export const selectSystemError = (state: RootState) => state.system.error;

// Helper selector to get a setting by key
export const selectSettingByKey = (state: RootState, key: string) => 
  state.system.settings.find(setting => setting.key === key)?.value;

// Reducer
export default systemSlice.reducer; 