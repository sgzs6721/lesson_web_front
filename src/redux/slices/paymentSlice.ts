import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define types
export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  amount: number;
  paymentMethod: 'cash' | 'credit_card' | 'wechat' | 'alipay' | 'bank_transfer';
  transactionId: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentDate: string;
  note: string;
  operatorId: string;
  operatorName: string;
  campusId: string;
  campusName: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentState {
  payments: Payment[];
  currentPayment: Payment | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: PaymentState = {
  payments: [],
  currentPayment: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchPayments = createAsyncThunk(
  'payment/fetchPayments',
  async (params: { startDate?: string; endDate?: string; studentId?: string } = {}, { rejectWithValue }) => {
    try {
      // In a real app, replace with actual API call
      // Example: const response = await api.get('/payments', { params });
      // For now, simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        {
          id: '1',
          studentId: '1',
          studentName: '张三',
          courseId: '1',
          courseName: '游泳初级班',
          amount: 1500,
          paymentMethod: 'wechat',
          transactionId: 'wxp202201151001',
          status: 'completed',
          paymentDate: '2022-01-15T10:15:00.000Z',
          note: '全额支付',
          operatorId: '1',
          operatorName: '管理员',
          campusId: '1',
          campusName: '总校区',
          createdAt: '2022-01-15T10:15:00.000Z',
          updatedAt: '2022-01-15T10:15:00.000Z',
        },
        {
          id: '2',
          studentId: '2',
          studentName: '李四',
          courseId: '1',
          courseName: '游泳初级班',
          amount: 1500,
          paymentMethod: 'alipay',
          transactionId: 'alp202202011530',
          status: 'completed',
          paymentDate: '2022-02-01T15:30:00.000Z',
          note: '全额支付',
          operatorId: '1',
          operatorName: '管理员',
          campusId: '1',
          campusName: '总校区',
          createdAt: '2022-02-01T15:30:00.000Z',
          updatedAt: '2022-02-01T15:30:00.000Z',
        },
        {
          id: '3',
          studentId: '1',
          studentName: '张三',
          courseId: '2',
          courseName: '游泳中级班',
          amount: 2000,
          paymentMethod: 'wechat',
          transactionId: 'wxp202203101420',
          status: 'completed',
          paymentDate: '2022-03-10T14:20:00.000Z',
          note: '全额支付',
          operatorId: '2',
          operatorName: '前台',
          campusId: '1',
          campusName: '总校区',
          createdAt: '2022-03-10T14:20:00.000Z',
          updatedAt: '2022-03-10T14:20:00.000Z',
        },
      ] as Payment[];
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchPaymentById = createAsyncThunk(
  'payment/fetchPaymentById',
  async (id: string, { rejectWithValue }) => {
    try {
      // In a real app, replace with actual API call
      // Example: const response = await api.get(`/payments/${id}`);
      // For now, simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (id === '1') {
        return {
          id: '1',
          studentId: '1',
          studentName: '张三',
          courseId: '1',
          courseName: '游泳初级班',
          amount: 1500,
          paymentMethod: 'wechat',
          transactionId: 'wxp202201151001',
          status: 'completed',
          paymentDate: '2022-01-15T10:15:00.000Z',
          note: '全额支付',
          operatorId: '1',
          operatorName: '管理员',
          campusId: '1',
          campusName: '总校区',
          createdAt: '2022-01-15T10:15:00.000Z',
          updatedAt: '2022-01-15T10:15:00.000Z',
        } as Payment;
      } else if (id === '2') {
        return {
          id: '2',
          studentId: '2',
          studentName: '李四',
          courseId: '1',
          courseName: '游泳初级班',
          amount: 1500,
          paymentMethod: 'alipay',
          transactionId: 'alp202202011530',
          status: 'completed',
          paymentDate: '2022-02-01T15:30:00.000Z',
          note: '全额支付',
          operatorId: '1',
          operatorName: '管理员',
          campusId: '1',
          campusName: '总校区',
          createdAt: '2022-02-01T15:30:00.000Z',
          updatedAt: '2022-02-01T15:30:00.000Z',
        } as Payment;
      } else {
        return {
          id: '3',
          studentId: '1',
          studentName: '张三',
          courseId: '2',
          courseName: '游泳中级班',
          amount: 2000,
          paymentMethod: 'wechat',
          transactionId: 'wxp202203101420',
          status: 'completed',
          paymentDate: '2022-03-10T14:20:00.000Z',
          note: '全额支付',
          operatorId: '2',
          operatorName: '前台',
          campusId: '1',
          campusName: '总校区',
          createdAt: '2022-03-10T14:20:00.000Z',
          updatedAt: '2022-03-10T14:20:00.000Z',
        } as Payment;
      }
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Slice
const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setPayments: (state, action: PayloadAction<Payment[]>) => {
      state.payments = action.payload;
    },
    setCurrentPayment: (state, action: PayloadAction<Payment | null>) => {
      state.currentPayment = action.payload;
    },
    addPayment: (state, action: PayloadAction<Payment>) => {
      state.payments.push(action.payload);
    },
    updatePayment: (state, action: PayloadAction<Payment>) => {
      const index = state.payments.findIndex(payment => payment.id === action.payload.id);
      if (index !== -1) {
        state.payments[index] = action.payload;
      }
      if (state.currentPayment?.id === action.payload.id) {
        state.currentPayment = action.payload;
      }
    },
    deletePayment: (state, action: PayloadAction<string>) => {
      state.payments = state.payments.filter(payment => payment.id !== action.payload);
      if (state.currentPayment?.id === action.payload) {
        state.currentPayment = null;
      }
    },
    clearPaymentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchPayments
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchPaymentById
      .addCase(fetchPaymentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload;
      })
      .addCase(fetchPaymentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const { 
  setPayments, 
  setCurrentPayment, 
  addPayment, 
  updatePayment, 
  deletePayment,
  clearPaymentError,
} = paymentSlice.actions;

// Selectors
export const selectPaymentState = (state: RootState) => state.payment;
export const selectPayments = (state: RootState) => state.payment.payments;
export const selectCurrentPayment = (state: RootState) => state.payment.currentPayment;
export const selectPaymentLoading = (state: RootState) => state.payment.loading;
export const selectPaymentError = (state: RootState) => state.payment.error;

// Reducer
export default paymentSlice.reducer; 