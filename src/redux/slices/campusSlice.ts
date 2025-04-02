import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define types
export interface Campus {
  id: string;
  name: string;
  address: string;
  phone: string;
  manager: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CampusState {
  campuses: Campus[];
  currentCampus: Campus | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: CampusState = {
  campuses: [],
  currentCampus: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchCampuses = createAsyncThunk(
  'campus/fetchCampuses',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, replace with actual API call
      // Example: const response = await api.get('/campuses');
      // For now, simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        {
          id: '1',
          name: '总校区',
          address: '北京市朝阳区建国路88号',
          phone: '010-12345678',
          manager: '张三',
          status: 'active',
          createdAt: '2022-01-01T00:00:00.000Z',
          updatedAt: '2022-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          name: '分校区A',
          address: '北京市海淀区中关村大街1号',
          phone: '010-87654321',
          manager: '李四',
          status: 'active',
          createdAt: '2022-02-01T00:00:00.000Z',
          updatedAt: '2022-02-01T00:00:00.000Z',
        },
        {
          id: '3',
          name: '分校区B',
          address: '北京市西城区西长安街1号',
          phone: '010-98765432',
          manager: '王五',
          status: 'inactive',
          createdAt: '2022-03-01T00:00:00.000Z',
          updatedAt: '2022-03-01T00:00:00.000Z',
        },
      ] as Campus[];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchCampusById = createAsyncThunk(
  'campus/fetchCampusById',
  async (id: string, { rejectWithValue }) => {
    try {
      // In a real app, replace with actual API call
      // Example: const response = await api.get(`/campuses/${id}`);
      // For now, simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        id,
        name: id === '1' ? '总校区' : `分校区${id === '2' ? 'A' : 'B'}`,
        address: id === '1' 
          ? '北京市朝阳区建国路88号' 
          : id === '2' 
            ? '北京市海淀区中关村大街1号' 
            : '北京市西城区西长安街1号',
        phone: id === '1' ? '010-12345678' : id === '2' ? '010-87654321' : '010-98765432',
        manager: id === '1' ? '张三' : id === '2' ? '李四' : '王五',
        status: id === '3' ? 'inactive' as const : 'active' as const,
        createdAt: id === '1' 
          ? '2022-01-01T00:00:00.000Z' 
          : id === '2' 
            ? '2022-02-01T00:00:00.000Z' 
            : '2022-03-01T00:00:00.000Z',
        updatedAt: id === '1' 
          ? '2022-01-01T00:00:00.000Z' 
          : id === '2' 
            ? '2022-02-01T00:00:00.000Z' 
            : '2022-03-01T00:00:00.000Z',
      } as Campus;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Slice
const campusSlice = createSlice({
  name: 'campus',
  initialState,
  reducers: {
    setCampuses: (state, action: PayloadAction<Campus[]>) => {
      state.campuses = action.payload;
    },
    setCurrentCampus: (state, action: PayloadAction<Campus | null>) => {
      state.currentCampus = action.payload;
    },
    addCampus: (state, action: PayloadAction<Campus>) => {
      state.campuses.push(action.payload);
    },
    updateCampus: (state, action: PayloadAction<Campus>) => {
      const index = state.campuses.findIndex(campus => campus.id === action.payload.id);
      if (index !== -1) {
        state.campuses[index] = action.payload;
      }
      if (state.currentCampus?.id === action.payload.id) {
        state.currentCampus = action.payload;
      }
    },
    deleteCampus: (state, action: PayloadAction<string>) => {
      state.campuses = state.campuses.filter(campus => campus.id !== action.payload);
      if (state.currentCampus?.id === action.payload) {
        state.currentCampus = null;
      }
    },
    clearCampusError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCampuses
      .addCase(fetchCampuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampuses.fulfilled, (state, action) => {
        state.loading = false;
        state.campuses = action.payload;
      })
      .addCase(fetchCampuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchCampusById
      .addCase(fetchCampusById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampusById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCampus = action.payload;
      })
      .addCase(fetchCampusById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const { 
  setCampuses, 
  setCurrentCampus, 
  addCampus, 
  updateCampus, 
  deleteCampus,
  clearCampusError,
} = campusSlice.actions;

// Selectors
export const selectCampusState = (state: RootState) => state.campus;
export const selectCampuses = (state: RootState) => state.campus.campuses;
export const selectCurrentCampus = (state: RootState) => state.campus.currentCampus;
export const selectCampusLoading = (state: RootState) => state.campus.loading;
export const selectCampusError = (state: RootState) => state.campus.error;

// Reducer
export default campusSlice.reducer; 