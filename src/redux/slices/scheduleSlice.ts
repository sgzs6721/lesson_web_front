import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define types
export interface Schedule {
  id: string;
  courseId: string;
  courseName: string;
  coachId: string;
  coachName: string;
  date: string; // ISO date string
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  capacity: number;
  enrolledCount: number;
  campusId: string;
  campusName: string;
  roomName: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleState {
  schedules: Schedule[];
  currentSchedule: Schedule | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: ScheduleState = {
  schedules: [],
  currentSchedule: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchSchedules = createAsyncThunk(
  'schedule/fetchSchedules',
  async (params: { startDate?: string; endDate?: string; campusId?: string } = {}, { rejectWithValue }) => {
    try {
      // In a real app, replace with actual API call
      // Example: const response = await api.get('/schedules', { params });
      // For now, simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        {
          id: '1',
          courseId: '1',
          courseName: '游泳初级班',
          coachId: '1',
          coachName: '王教练',
          date: '2022-06-15',
          startTime: '09:00',
          endTime: '10:00',
          capacity: 20,
          enrolledCount: 15,
          campusId: '1',
          campusName: '总校区',
          roomName: '游泳馆A池',
          status: 'scheduled',
          note: '',
          createdAt: '2022-05-10T10:00:00.000Z',
          updatedAt: '2022-05-10T10:00:00.000Z',
        },
        {
          id: '2',
          courseId: '2',
          courseName: '游泳中级班',
          coachId: '2',
          coachName: '李教练',
          date: '2022-06-15',
          startTime: '10:30',
          endTime: '12:00',
          capacity: 15,
          enrolledCount: 10,
          campusId: '1',
          campusName: '总校区',
          roomName: '游泳馆B池',
          status: 'scheduled',
          note: '',
          createdAt: '2022-05-10T10:15:00.000Z',
          updatedAt: '2022-05-10T10:15:00.000Z',
        },
        {
          id: '3',
          courseId: '3',
          courseName: '游泳高级班',
          coachId: '3',
          coachName: '张教练',
          date: '2022-06-16',
          startTime: '14:00',
          endTime: '16:00',
          capacity: 10,
          enrolledCount: 8,
          campusId: '2',
          campusName: '分校区A',
          roomName: '竞技池',
          status: 'scheduled',
          note: '带比赛准备',
          createdAt: '2022-05-11T09:30:00.000Z',
          updatedAt: '2022-05-11T09:30:00.000Z',
        },
      ] as Schedule[];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchScheduleById = createAsyncThunk(
  'schedule/fetchScheduleById',
  async (id: string, { rejectWithValue }) => {
    try {
      // In a real app, replace with actual API call
      // Example: const response = await api.get(`/schedules/${id}`);
      // For now, simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (id === '1') {
        return {
          id: '1',
          courseId: '1',
          courseName: '游泳初级班',
          coachId: '1',
          coachName: '王教练',
          date: '2022-06-15',
          startTime: '09:00',
          endTime: '10:00',
          capacity: 20,
          enrolledCount: 15,
          campusId: '1',
          campusName: '总校区',
          roomName: '游泳馆A池',
          status: 'scheduled',
          note: '',
          createdAt: '2022-05-10T10:00:00.000Z',
          updatedAt: '2022-05-10T10:00:00.000Z',
        } as Schedule;
      } else if (id === '2') {
        return {
          id: '2',
          courseId: '2',
          courseName: '游泳中级班',
          coachId: '2',
          coachName: '李教练',
          date: '2022-06-15',
          startTime: '10:30',
          endTime: '12:00',
          capacity: 15,
          enrolledCount: 10,
          campusId: '1',
          campusName: '总校区',
          roomName: '游泳馆B池',
          status: 'scheduled',
          note: '',
          createdAt: '2022-05-10T10:15:00.000Z',
          updatedAt: '2022-05-10T10:15:00.000Z',
        } as Schedule;
      } else {
        return {
          id: '3',
          courseId: '3',
          courseName: '游泳高级班',
          coachId: '3',
          coachName: '张教练',
          date: '2022-06-16',
          startTime: '14:00',
          endTime: '16:00',
          capacity: 10,
          enrolledCount: 8,
          campusId: '2',
          campusName: '分校区A',
          roomName: '竞技池',
          status: 'scheduled',
          note: '带比赛准备',
          createdAt: '2022-05-11T09:30:00.000Z',
          updatedAt: '2022-05-11T09:30:00.000Z',
        } as Schedule;
      }
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Slice
const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setSchedules: (state, action: PayloadAction<Schedule[]>) => {
      state.schedules = action.payload;
    },
    setCurrentSchedule: (state, action: PayloadAction<Schedule | null>) => {
      state.currentSchedule = action.payload;
    },
    addSchedule: (state, action: PayloadAction<Schedule>) => {
      state.schedules.push(action.payload);
    },
    updateSchedule: (state, action: PayloadAction<Schedule>) => {
      const index = state.schedules.findIndex(schedule => schedule.id === action.payload.id);
      if (index !== -1) {
        state.schedules[index] = action.payload;
      }
      if (state.currentSchedule?.id === action.payload.id) {
        state.currentSchedule = action.payload;
      }
    },
    deleteSchedule: (state, action: PayloadAction<string>) => {
      state.schedules = state.schedules.filter(schedule => schedule.id !== action.payload);
      if (state.currentSchedule?.id === action.payload) {
        state.currentSchedule = null;
      }
    },
    clearScheduleError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchSchedules
      .addCase(fetchSchedules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchedules.fulfilled, (state, action) => {
        state.loading = false;
        state.schedules = action.payload;
      })
      .addCase(fetchSchedules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchScheduleById
      .addCase(fetchScheduleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchScheduleById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSchedule = action.payload;
      })
      .addCase(fetchScheduleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const { 
  setSchedules, 
  setCurrentSchedule, 
  addSchedule, 
  updateSchedule, 
  deleteSchedule,
  clearScheduleError,
} = scheduleSlice.actions;

// Selectors
export const selectScheduleState = (state: RootState) => state.schedule;
export const selectSchedules = (state: RootState) => state.schedule.schedules;
export const selectCurrentSchedule = (state: RootState) => state.schedule.currentSchedule;
export const selectScheduleLoading = (state: RootState) => state.schedule.loading;
export const selectScheduleError = (state: RootState) => state.schedule.error;

// Reducer
export default scheduleSlice.reducer; 