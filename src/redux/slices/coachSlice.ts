import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define types
export interface Coach {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email: string;
  specialty: string[];
  qualification: string;
  experience: number; // years of experience
  availability: string[];
  campusId: string;
  campusName: string;
  biography: string;
  rating: number; // average rating from 1-5
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CoachState {
  coaches: Coach[];
  currentCoach: Coach | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: CoachState = {
  coaches: [],
  currentCoach: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchCoaches = createAsyncThunk(
  'coach/fetchCoaches',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, replace with actual API call
      // Example: const response = await api.get('/coaches');
      // For now, simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        {
          id: '1',
          name: '王教练',
          gender: 'male',
          phone: '13800138001',
          email: 'wang@example.com',
          specialty: ['自由泳', '蛙泳', '儿童教学'],
          qualification: '国家一级游泳教练',
          experience: 8,
          availability: ['周一', '周二', '周三', '周五', '周六'],
          campusId: '1',
          campusName: '总校区',
          biography: '毕业于北京体育大学，曾获全国游泳锦标赛冠军，有丰富的青少年教学经验。',
          rating: 4.8,
          status: 'active',
          createdAt: '2020-03-15T00:00:00.000Z',
          updatedAt: '2022-05-10T14:30:00.000Z',
        },
        {
          id: '2',
          name: '李教练',
          gender: 'female',
          phone: '13800138002',
          email: 'li@example.com',
          specialty: ['蝶泳', '仰泳', '竞技训练'],
          qualification: '国家二级游泳教练',
          experience: 5,
          availability: ['周二', '周四', '周六', '周日'],
          campusId: '1',
          campusName: '总校区',
          biography: '前省游泳队队员，擅长竞技游泳训练，曾培养多名获得省级比赛奖项的学员。',
          rating: 4.5,
          status: 'active',
          createdAt: '2021-01-10T00:00:00.000Z',
          updatedAt: '2022-04-20T10:15:00.000Z',
        },
        {
          id: '3',
          name: '张教练',
          gender: 'male',
          phone: '13800138003',
          email: 'zhang@example.com',
          specialty: ['自由泳', '蛙泳', '蝶泳', '高级技术'],
          qualification: '国家高级游泳教练',
          experience: 12,
          availability: ['周一', '周三', '周五', '周日'],
          campusId: '2',
          campusName: '分校区A',
          biography: '前国家队队员，奥运会参赛经历，专注于高水平学员的培养和竞技技术指导。',
          rating: 5.0,
          status: 'active',
          createdAt: '2019-06-01T00:00:00.000Z',
          updatedAt: '2022-03-15T16:45:00.000Z',
        },
      ] as Coach[];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchCoachById = createAsyncThunk(
  'coach/fetchCoachById',
  async (id: string, { rejectWithValue }) => {
    try {
      // In a real app, replace with actual API call
      // Example: const response = await api.get(`/coaches/${id}`);
      // For now, simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (id === '1') {
        return {
          id: '1',
          name: '王教练',
          gender: 'male',
          phone: '13800138001',
          email: 'wang@example.com',
          specialty: ['自由泳', '蛙泳', '儿童教学'],
          qualification: '国家一级游泳教练',
          experience: 8,
          availability: ['周一', '周二', '周三', '周五', '周六'],
          campusId: '1',
          campusName: '总校区',
          biography: '毕业于北京体育大学，曾获全国游泳锦标赛冠军，有丰富的青少年教学经验。',
          rating: 4.8,
          status: 'active',
          createdAt: '2020-03-15T00:00:00.000Z',
          updatedAt: '2022-05-10T14:30:00.000Z',
        } as Coach;
      } else if (id === '2') {
        return {
          id: '2',
          name: '李教练',
          gender: 'female',
          phone: '13800138002',
          email: 'li@example.com',
          specialty: ['蝶泳', '仰泳', '竞技训练'],
          qualification: '国家二级游泳教练',
          experience: 5,
          availability: ['周二', '周四', '周六', '周日'],
          campusId: '1',
          campusName: '总校区',
          biography: '前省游泳队队员，擅长竞技游泳训练，曾培养多名获得省级比赛奖项的学员。',
          rating: 4.5,
          status: 'active',
          createdAt: '2021-01-10T00:00:00.000Z',
          updatedAt: '2022-04-20T10:15:00.000Z',
        } as Coach;
      } else {
        return {
          id: '3',
          name: '张教练',
          gender: 'male',
          phone: '13800138003',
          email: 'zhang@example.com',
          specialty: ['自由泳', '蛙泳', '蝶泳', '高级技术'],
          qualification: '国家高级游泳教练',
          experience: 12,
          availability: ['周一', '周三', '周五', '周日'],
          campusId: '2',
          campusName: '分校区A',
          biography: '前国家队队员，奥运会参赛经历，专注于高水平学员的培养和竞技技术指导。',
          rating: 5.0,
          status: 'active',
          createdAt: '2019-06-01T00:00:00.000Z',
          updatedAt: '2022-03-15T16:45:00.000Z',
        } as Coach;
      }
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Slice
const coachSlice = createSlice({
  name: 'coach',
  initialState,
  reducers: {
    setCoaches: (state, action: PayloadAction<Coach[]>) => {
      state.coaches = action.payload;
    },
    setCurrentCoach: (state, action: PayloadAction<Coach | null>) => {
      state.currentCoach = action.payload;
    },
    addCoach: (state, action: PayloadAction<Coach>) => {
      state.coaches.push(action.payload);
    },
    updateCoach: (state, action: PayloadAction<Coach>) => {
      const index = state.coaches.findIndex(coach => coach.id === action.payload.id);
      if (index !== -1) {
        state.coaches[index] = action.payload;
      }
      if (state.currentCoach?.id === action.payload.id) {
        state.currentCoach = action.payload;
      }
    },
    deleteCoach: (state, action: PayloadAction<string>) => {
      state.coaches = state.coaches.filter(coach => coach.id !== action.payload);
      if (state.currentCoach?.id === action.payload) {
        state.currentCoach = null;
      }
    },
    clearCoachError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCoaches
      .addCase(fetchCoaches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoaches.fulfilled, (state, action) => {
        state.loading = false;
        state.coaches = action.payload;
      })
      .addCase(fetchCoaches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchCoachById
      .addCase(fetchCoachById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoachById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCoach = action.payload;
      })
      .addCase(fetchCoachById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const { 
  setCoaches, 
  setCurrentCoach, 
  addCoach, 
  updateCoach, 
  deleteCoach,
  clearCoachError,
} = coachSlice.actions;

// Selectors
export const selectCoachState = (state: RootState) => state.coach;
export const selectCoaches = (state: RootState) => state.coach.coaches;
export const selectCurrentCoach = (state: RootState) => state.coach.currentCoach;
export const selectCoachLoading = (state: RootState) => state.coach.loading;
export const selectCoachError = (state: RootState) => state.coach.error;

// Reducer
export default coachSlice.reducer; 