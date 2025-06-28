import { Dayjs } from 'dayjs';

export interface Expense {
  id: string;
  date: string;
  item: string;
  amount: number;
  category: string;
  remark: string;
  operator: string;
  type: 'EXPEND' | 'INCOME';
}

export interface ExpenseSearchParams {
  text?: string;
  type?: 'EXPEND' | 'INCOME' | null;
  searchCategories?: string[];
  dateRange: [Dayjs | null, Dayjs | null] | null;
} 