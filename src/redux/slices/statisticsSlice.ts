import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define types
export interface CourseStatistics {
  courseId: string;
  courseName: string;
  totalStudents: number;
  attendanceRate: number;
  revenue: number;
}

export interface CampusStatistics {
  campusId: string;
  campusName: string;
  totalStudents: number;
  totalCourses: number;
  totalCoaches: number;
  revenue: number;
}

export interface CoachStatistics {
  coachId: string;
  coachName: string;
  totalCourses: number;
  totalStudents: number;
  attendanceRate: number;
  rating: number;
}

export interface OverviewStatistics {
  studentCount: number;
  courseCount: number;
  coachCount: number;
  campusCount: number;
  totalRevenue: number;
  revenueByMonth: { month: string; revenue: number }[];
  studentsByMonth: { month: string; count: number }[];
  attendanceRate: number;
}

export interface StatisticsState {
  overview: OverviewStatistics | null;
  courseStats: CourseStatistics[];
  campusStats: CampusStatistics[];
  coachStats: CoachStatistics[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: StatisticsState = {
  overview: null,
  courseStats: [],
  campusStats: [],
  coachStats: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchOverviewStatistics = createAsyncThunk(
  'statistics/fetchOverview',
  async (params: { startDate?: string; endDate?: string } = {}, { rejectWithValue }) => {
    try {
      // In a real app, replace with actual API call
      // Example: const response = await api.get('/statistics/overview', { params });
      // For now, simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        studentCount: 150,
        courseCount: 12,
        coachCount: 8,
        campusCount: 3,
        totalRevenue: 250000,
        revenueByMonth: [
          { month: '2022-01', revenue: 35000 },
          { month: '2022-02', revenue: 38000 },
          { month: '2022-03', revenue: 42000 },
          { month: '2022-04', revenue: 45000 },
          { month: '2022-05', revenue: 50000 },
          { month: '2022-06', revenue: 40000 },
        ],
        studentsByMonth: [
          { month: '2022-01', count: 120 },
          { month: '2022-02', count: 125 },
          { month: '2022-03', count: 130 },
          { month: '2022-04', count: 135 },
          { month: '2022-05', count: 145 },
          { month: '2022-06', count: 150 },
        ],
        attendanceRate: 0.86,
      } as OverviewStatistics;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchCourseStatistics = createAsyncThunk(
  'statistics/fetchCourseStats',
  async (params: { startDate?: string; endDate?: string } = {}, { rejectWithValue }) => {
    try {
      // In a real app, replace with actual API call
      // Example: const response = await api.get('/statistics/courses', { params });
      // For now, simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        {
          courseId: '1',
          courseName: '游泳初级班',
          totalStudents: 45,
          attendanceRate: 0.88,
          revenue: 67500,
        },
        {
          courseId: '2',
          courseName: '游泳中级班',
          totalStudents: 35,
          attendanceRate: 0.92,
          revenue: 70000,
        },
        {
          courseId: '3',
          courseName: '游泳高级班',
          totalStudents: 15,
          attendanceRate: 0.95,
          revenue: 45000,
        },
      ] as CourseStatistics[];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchCampusStatistics = createAsyncThunk(
  'statistics/fetchCampusStats',
  async (params: { startDate?: string; endDate?: string } = {}, { rejectWithValue }) => {
    try {
      // In a real app, replace with actual API call
      // Example: const response = await api.get('/statistics/campuses', { params });
      // For now, simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        {
          campusId: '1',
          campusName: '总校区',
          totalStudents: 85,
          totalCourses: 8,
          totalCoaches: 5,
          revenue: 170000,
        },
        {
          campusId: '2',
          campusName: '分校区A',
          totalStudents: 45,
          totalCourses: 4,
          totalCoaches: 3,
          revenue: 90000,
        },
        {
          campusId: '3',
          campusName: '分校区B',
          totalStudents: 20,
          totalCourses: 2,
          totalCoaches: 2,
          revenue: 40000,
        },
      ] as CampusStatistics[];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchCoachStatistics = createAsyncThunk(
  'statistics/fetchCoachStats',
  async (params: { startDate?: string; endDate?: string } = {}, { rejectWithValue }) => {
    try {
      // In a real app, replace with actual API call
      // Example: const response = await api.get('/statistics/coaches', { params });
      // For now, simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        {
          coachId: '1',
          coachName: '王教练',
          totalCourses: 3,
          totalStudents: 50,
          attendanceRate: 0.87,
          rating: 4.8,
        },
        {
          coachId: '2',
          coachName: '李教练',
          totalCourses: 2,
          totalStudents: 30,
          attendanceRate: 0.85,
          rating: 4.5,
        },
        {
          coachId: '3',
          coachName: '张教练',
          totalCourses: 2,
          totalStudents: 20,
          attendanceRate: 0.92,
          rating: 5.0,
        },
      ] as CoachStatistics[];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Slice
const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {
    clearStatisticsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchOverviewStatistics
      .addCase(fetchOverviewStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOverviewStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload;
      })
      .addCase(fetchOverviewStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchCourseStatistics
      .addCase(fetchCourseStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.courseStats = action.payload;
      })
      .addCase(fetchCourseStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchCampusStatistics
      .addCase(fetchCampusStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampusStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.campusStats = action.payload;
      })
      .addCase(fetchCampusStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchCoachStatistics
      .addCase(fetchCoachStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoachStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.coachStats = action.payload;
      })
      .addCase(fetchCoachStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const { clearStatisticsError } = statisticsSlice.actions;

// Selectors
export const selectStatisticsState = (state: RootState) => state.statistics;
export const selectOverviewStatistics = (state: RootState) => state.statistics.overview;
export const selectCourseStatistics = (state: RootState) => state.statistics.courseStats;
export const selectCampusStatistics = (state: RootState) => state.statistics.campusStats;
export const selectCoachStatistics = (state: RootState) => state.statistics.coachStats;
export const selectStatisticsLoading = (state: RootState) => state.statistics.loading;
export const selectStatisticsError = (state: RootState) => state.statistics.error;

// Reducer
export default statisticsSlice.reducer; 