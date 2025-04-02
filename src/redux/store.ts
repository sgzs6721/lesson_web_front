import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import campusReducer from './slices/campusSlice';
import courseReducer from './slices/courseSlice';
import studentReducer from './slices/studentSlice';
import coachReducer from './slices/coachSlice';
import attendanceReducer from './slices/attendanceSlice';
import scheduleReducer from './slices/scheduleSlice';
import paymentReducer from './slices/paymentSlice';
import statisticsReducer from './slices/statisticsSlice';
import systemReducer from './slices/systemSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    campus: campusReducer,
    course: courseReducer,
    student: studentReducer,
    coach: coachReducer,
    attendance: attendanceReducer,
    schedule: scheduleReducer,
    payment: paymentReducer,
    statistics: statisticsReducer,
    system: systemReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 忽略特定的非可序列化值
        ignoredActions: ['auth/login/fulfilled', 'auth/logout/fulfilled'],
        ignoredPaths: ['auth.user'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 