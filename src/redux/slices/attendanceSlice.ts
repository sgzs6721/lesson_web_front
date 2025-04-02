import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define types
export interface Attendance {
  id: string;
  scheduleId: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  coachId: string;
  coachName: string;
  date: string;
  checkInTime: string | null;
  status: 'present' | 'absent' | 'late' | 'excused' | 'pending';
  note: string;
  campusId: string;
  campusName: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceState {
  attendances: Attendance[];
  currentAttendance: Attendance | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AttendanceState = {
  attendances: [],
  currentAttendance: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchAttendances = createAsyncThunk(
  'attendance/fetchAttendances',
  async (params: { scheduleId?: string; studentId?: string; courseId?: string; date?: string; startDate?: string; endDate?: string } = {}, { rejectWithValue }) => {
    try {
      // In a real app, replace with actual API call
      // Example: const response = await api.get('/attendances', { params });
      // For now, simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        {
          id: '1',
          scheduleId: '1',
          studentId: '1',
          studentName: '张三',
          courseId: '1',
          courseName: '游泳初级班',
          coachId: '1',
          coachName: '王教练',
          date: '2022-06-15',
          checkInTime: '09:05:00',
          status: 'present',
          note: '',
          campusId: '1',
          campusName: '总校区',
          createdAt: '2022-06-15T09:05:00.000Z',
          updatedAt: '2022-06-15T09:05:00.000Z',
        },
        {
          id: '2',
          scheduleId: '1',
          studentId: '2',
          studentName: '李四',
          courseId: '1',
          courseName: '游泳初级班',
          coachId: '1',
          coachName: '王教练',
          date: '2022-06-15',
          checkInTime: '09:15:00',
          status: 'late',
          note: '迟到15分钟',
          campusId: '1',
          campusName: '总校区',
          createdAt: '2022-06-15T09:15:00.000Z',
          updatedAt: '2022-06-15T09:15:00.000Z',
        },
        {
          id: '3',
          scheduleId: '2',
          studentId: '1',
          studentName: '张三',
          courseId: '2',
          courseName: '游泳中级班',
          coachId: '2',
          coachName: '李教练',
          date: '2022-06-15',
          checkInTime: '10:30:00',
          status: 'present',
          note: '',
          campusId: '1',
          campusName: '总校区',
          createdAt: '2022-06-15T10:30:00.000Z',
          updatedAt: '2022-06-15T10:30:00.000Z',
        },
        {
          id: '4',
          scheduleId: '3',
          studentId: '3',
          studentName: '王五',
          courseId: '3',
          courseName: '游泳高级班',
          coachId: '3',
          coachName: '张教练',
          date: '2022-06-16',
          checkInTime: null,
          status: 'absent',
          note: '未请假',
          campusId: '2',
          campusName: '分校区A',
          createdAt: '2022-06-16T16:00:00.000Z',
          updatedAt: '2022-06-16T16:00:00.000Z',
        },
      ] as Attendance[];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchAttendanceById = createAsyncThunk(
  'attendance/fetchAttendanceById',
  async (id: string, { rejectWithValue }) => {
    try {
      // In a real app, replace with actual API call
      // Example: const response = await api.get(`/attendances/${id}`);
      // For now, simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (id === '1') {
        return {
          id: '1',
          scheduleId: '1',
          studentId: '1',
          studentName: '张三',
          courseId: '1',
          courseName: '游泳初级班',
          coachId: '1',
          coachName: '王教练',
          date: '2022-06-15',
          checkInTime: '09:05:00',
          status: 'present',
          note: '',
          campusId: '1',
          campusName: '总校区',
          createdAt: '2022-06-15T09:05:00.000Z',
          updatedAt: '2022-06-15T09:05:00.000Z',
        } as Attendance;
      } else if (id === '2') {
        return {
          id: '2',
          scheduleId: '1',
          studentId: '2',
          studentName: '李四',
          courseId: '1',
          courseName: '游泳初级班',
          coachId: '1',
          coachName: '王教练',
          date: '2022-06-15',
          checkInTime: '09:15:00',
          status: 'late',
          note: '迟到15分钟',
          campusId: '1',
          campusName: '总校区',
          createdAt: '2022-06-15T09:15:00.000Z',
          updatedAt: '2022-06-15T09:15:00.000Z',
        } as Attendance;
      } else {
        return {
          id: '3',
          scheduleId: '2',
          studentId: '1',
          studentName: '张三',
          courseId: '2',
          courseName: '游泳中级班',
          coachId: '2',
          coachName: '李教练',
          date: '2022-06-15',
          checkInTime: '10:30:00',
          status: 'present',
          note: '',
          campusId: '1',
          campusName: '总校区',
          createdAt: '2022-06-15T10:30:00.000Z',
          updatedAt: '2022-06-15T10:30:00.000Z',
        } as Attendance;
      }
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateAttendanceStatus = createAsyncThunk(
  'attendance/updateAttendanceStatus',
  async ({ id, status, note }: { id: string; status: Attendance['status']; note?: string }, { rejectWithValue }) => {
    try {
      // In a real app, replace with actual API call
      // Example: const response = await api.patch(`/attendances/${id}`, { status, note });
      // For now, simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mocked response - in a real app this would come from the server
      return {
        id,
        status,
        note: note || '',
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Slice
const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setAttendances: (state, action: PayloadAction<Attendance[]>) => {
      state.attendances = action.payload;
    },
    setCurrentAttendance: (state, action: PayloadAction<Attendance | null>) => {
      state.currentAttendance = action.payload;
    },
    addAttendance: (state, action: PayloadAction<Attendance>) => {
      state.attendances.push(action.payload);
    },
    updateAttendance: (state, action: PayloadAction<Attendance>) => {
      const index = state.attendances.findIndex(attendance => attendance.id === action.payload.id);
      if (index !== -1) {
        state.attendances[index] = action.payload;
      }
      if (state.currentAttendance?.id === action.payload.id) {
        state.currentAttendance = action.payload;
      }
    },
    deleteAttendance: (state, action: PayloadAction<string>) => {
      state.attendances = state.attendances.filter(attendance => attendance.id !== action.payload);
      if (state.currentAttendance?.id === action.payload) {
        state.currentAttendance = null;
      }
    },
    clearAttendanceError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAttendances
      .addCase(fetchAttendances.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendances.fulfilled, (state, action) => {
        state.loading = false;
        state.attendances = action.payload;
      })
      .addCase(fetchAttendances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchAttendanceById
      .addCase(fetchAttendanceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendanceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAttendance = action.payload;
      })
      .addCase(fetchAttendanceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // updateAttendanceStatus
      .addCase(updateAttendanceStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAttendanceStatus.fulfilled, (state, action) => {
        state.loading = false;
        // In a real implementation, we would get the full updated attendance object
        // For the mock, we just update the specific fields
        const { id, status, note, updatedAt } = action.payload;
        const index = state.attendances.findIndex(attendance => attendance.id === id);
        if (index !== -1) {
          state.attendances[index] = {
            ...state.attendances[index],
            status,
            note: note || state.attendances[index].note,
            updatedAt,
          };
        }
        if (state.currentAttendance?.id === id) {
          state.currentAttendance = {
            ...state.currentAttendance,
            status,
            note: note || state.currentAttendance.note,
            updatedAt,
          };
        }
      })
      .addCase(updateAttendanceStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const { 
  setAttendances, 
  setCurrentAttendance, 
  addAttendance, 
  updateAttendance, 
  deleteAttendance,
  clearAttendanceError,
} = attendanceSlice.actions;

// Selectors
export const selectAttendanceState = (state: RootState) => state.attendance;
export const selectAttendances = (state: RootState) => state.attendance.attendances;
export const selectCurrentAttendance = (state: RootState) => state.attendance.currentAttendance;
export const selectAttendanceLoading = (state: RootState) => state.attendance.loading;
export const selectAttendanceError = (state: RootState) => state.attendance.error;

// Reducer
export default attendanceSlice.reducer; 