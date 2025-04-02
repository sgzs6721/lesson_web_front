import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define types
export interface Course {
  id: string;
  name: string;
  description: string;
  capacity: number;
  price: number;
  duration: number; // in minutes
  coachId: string;
  coachName: string;
  campusId: string;
  campusName: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CourseState {
  courses: Course[];
  currentCourse: Course | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: CourseState = {
  courses: [],
  currentCourse: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchCourses = createAsyncThunk(
  'course/fetchCourses',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, replace with actual API call
      // Example: const response = await api.get('/courses');
      // For now, simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        {
          id: '1',
          name: '游泳初级班',
          description: '适合初学者的游泳课程，教授基本的游泳技巧和安全知识。',
          capacity: 20,
          price: 1500,
          duration: 60,
          coachId: '1',
          coachName: '王教练',
          campusId: '1',
          campusName: '总校区',
          status: 'active',
          createdAt: '2022-01-01T00:00:00.000Z',
          updatedAt: '2022-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          name: '游泳中级班',
          description: '适合有基础的学员，教授各种泳姿和提高技巧。',
          capacity: 15,
          price: 2000,
          duration: 90,
          coachId: '2',
          coachName: '李教练',
          campusId: '1',
          campusName: '总校区',
          status: 'active',
          createdAt: '2022-02-01T00:00:00.000Z',
          updatedAt: '2022-02-01T00:00:00.000Z',
        },
        {
          id: '3',
          name: '游泳高级班',
          description: '竞技游泳训练，针对有意向参加比赛的学员。',
          capacity: 10,
          price: 3000,
          duration: 120,
          coachId: '3',
          coachName: '张教练',
          campusId: '2',
          campusName: '分校区A',
          status: 'active',
          createdAt: '2022-03-01T00:00:00.000Z',
          updatedAt: '2022-03-01T00:00:00.000Z',
        },
      ] as Course[];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  'course/fetchCourseById',
  async (id: string, { rejectWithValue }) => {
    try {
      // In a real app, replace with actual API call
      // Example: const response = await api.get(`/courses/${id}`);
      // For now, simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (id === '1') {
        return {
          id: '1',
          name: '游泳初级班',
          description: '适合初学者的游泳课程，教授基本的游泳技巧和安全知识。',
          capacity: 20,
          price: 1500,
          duration: 60,
          coachId: '1',
          coachName: '王教练',
          campusId: '1',
          campusName: '总校区',
          status: 'active',
          createdAt: '2022-01-01T00:00:00.000Z',
          updatedAt: '2022-01-01T00:00:00.000Z',
        } as Course;
      } else if (id === '2') {
        return {
          id: '2',
          name: '游泳中级班',
          description: '适合有基础的学员，教授各种泳姿和提高技巧。',
          capacity: 15,
          price: 2000,
          duration: 90,
          coachId: '2',
          coachName: '李教练',
          campusId: '1',
          campusName: '总校区',
          status: 'active',
          createdAt: '2022-02-01T00:00:00.000Z',
          updatedAt: '2022-02-01T00:00:00.000Z',
        } as Course;
      } else {
        return {
          id: '3',
          name: '游泳高级班',
          description: '竞技游泳训练，针对有意向参加比赛的学员。',
          capacity: 10,
          price: 3000,
          duration: 120,
          coachId: '3',
          coachName: '张教练',
          campusId: '2',
          campusName: '分校区A',
          status: 'active',
          createdAt: '2022-03-01T00:00:00.000Z',
          updatedAt: '2022-03-01T00:00:00.000Z',
        } as Course;
      }
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Slice
const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    setCourses: (state, action: PayloadAction<Course[]>) => {
      state.courses = action.payload;
    },
    setCurrentCourse: (state, action: PayloadAction<Course | null>) => {
      state.currentCourse = action.payload;
    },
    addCourse: (state, action: PayloadAction<Course>) => {
      state.courses.push(action.payload);
    },
    updateCourse: (state, action: PayloadAction<Course>) => {
      const index = state.courses.findIndex(course => course.id === action.payload.id);
      if (index !== -1) {
        state.courses[index] = action.payload;
      }
      if (state.currentCourse?.id === action.payload.id) {
        state.currentCourse = action.payload;
      }
    },
    deleteCourse: (state, action: PayloadAction<string>) => {
      state.courses = state.courses.filter(course => course.id !== action.payload);
      if (state.currentCourse?.id === action.payload) {
        state.currentCourse = null;
      }
    },
    clearCourseError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCourses
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchCourseById
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const { 
  setCourses, 
  setCurrentCourse, 
  addCourse, 
  updateCourse, 
  deleteCourse,
  clearCourseError,
} = courseSlice.actions;

// Selectors
export const selectCourseState = (state: RootState) => state.course;
export const selectCourses = (state: RootState) => state.course.courses;
export const selectCurrentCourse = (state: RootState) => state.course.currentCourse;
export const selectCourseLoading = (state: RootState) => state.course.loading;
export const selectCourseError = (state: RootState) => state.course.error;

// Reducer
export default courseSlice.reducer; 