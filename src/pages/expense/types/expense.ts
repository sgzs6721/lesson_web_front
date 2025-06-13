import { Dayjs } from 'dayjs';

export interface Expense {
  id: string;
  date: string;
  item: string;
  amount: number;
  category: string;
  remark: string;
  operator: string;
  type: 'income' | 'expense';
}

export interface ExpenseSearchParams {
  text?: string;
  type?: 'income' | 'expense' | null;
  searchCategories?: string[];
  dateRange: [Dayjs | null, Dayjs | null] | null;
} 