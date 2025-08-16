import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define types
export interface Student {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  birthDate: string;
  phone: string;
  emergencyContact: string;
  emergencyPhone: string;
  address: string;
  campusId: string;
  campusName: string;
  enrollmentDate: string;
  enrolledCourses: string[]; // Course IDs
  status: 'active' | 'inactive';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentState {
  students: Student[];
  currentStudent: Student | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: StudentState = {
  students: [],
  currentStudent: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchStudents = createAsyncThunk(
  'student/fetchStudents',
  async (_, { rejectWithValue }) => {
    try {
      // 返回空数据，因为实际使用的是直接API调用
      return [];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchStudentById = createAsyncThunk(
  'student/fetchStudentById',
  async (id: string, { rejectWithValue }) => {
    try {
      // In a real app, replace with actual API call
      // Example: const response = await api.get(`/students/${id}`);
      // For now, simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (id === '1') {
        return {
          id: '1',
          name: '张三',
          gender: 'male',
          birthDate: '2010-05-15',
          phone: '13800138001',
          emergencyContact: '张父',
          emergencyPhone: '13900139001',
          address: '北京市海淀区中关村大街1号',
          campusId: '1',
          campusName: '总校区',
          enrollmentDate: '2022-01-15',
          enrolledCourses: ['1', '2'],
          status: 'active',
          notes: '游泳能力较好，已掌握基本技能',
          createdAt: '2022-01-15T08:30:00.000Z',
          updatedAt: '2022-03-10T14:20:00.000Z',
        } as Student;
      } else if (id === '2') {
        return {
          id: '2',
          name: '李四',
          gender: 'female',
          birthDate: '2011-08-22',
          phone: '13800138002',
          emergencyContact: '李母',
          emergencyPhone: '13900139002',
          address: '北京市朝阳区建国路5号',
          campusId: '1',
          campusName: '总校区',
          enrollmentDate: '2022-02-01',
          enrolledCourses: ['1'],
          status: 'active',
          notes: '初学者，需要特别关注',
          createdAt: '2022-02-01T10:15:00.000Z',
          updatedAt: '2022-02-01T10:15:00.000Z',
        } as Student;
      } else {
        return {
          id: '3',
          name: '王五',
          gender: 'male',
          birthDate: '2009-03-10',
          phone: '13800138003',
          emergencyContact: '王母',
          emergencyPhone: '13900139003',
          address: '北京市西城区西长安街10号',
          campusId: '2',
          campusName: '分校区A',
          enrollmentDate: '2021-09-01',
          enrolledCourses: ['2', '3'],
          status: 'active',
          notes: '有游泳比赛经验，表现优秀',
          createdAt: '2021-09-01T09:00:00.000Z',
          updatedAt: '2022-04-15T16:30:00.000Z',
        } as Student;
      }
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Slice
const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setStudents: (state, action: PayloadAction<Student[]>) => {
      state.students = action.payload;
    },
    setCurrentStudent: (state, action: PayloadAction<Student | null>) => {
      state.currentStudent = action.payload;
    },
    addStudent: (state, action: PayloadAction<Student>) => {
      state.students.push(action.payload);
    },
    updateStudent: (state, action: PayloadAction<Student>) => {
      const index = state.students.findIndex(student => student.id === action.payload.id);
      if (index !== -1) {
        state.students[index] = action.payload;
      }
      if (state.currentStudent?.id === action.payload.id) {
        state.currentStudent = action.payload;
      }
    },
    deleteStudent: (state, action: PayloadAction<string>) => {
      state.students = state.students.filter(student => student.id !== action.payload);
      if (state.currentStudent?.id === action.payload) {
        state.currentStudent = null;
      }
    },
    clearStudentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchStudents
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchStudentById
      .addCase(fetchStudentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStudent = action.payload;
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const { 
  setStudents, 
  setCurrentStudent, 
  addStudent, 
  updateStudent, 
  deleteStudent,
  clearStudentError,
} = studentSlice.actions;

// Selectors
export const selectStudentState = (state: RootState) => state.student;
export const selectStudents = (state: RootState) => state.student.students;
export const selectCurrentStudent = (state: RootState) => state.student.currentStudent;
export const selectStudentLoading = (state: RootState) => state.student.loading;
export const selectStudentError = (state: RootState) => state.student.error;

// Reducer
export default studentSlice.reducer; 