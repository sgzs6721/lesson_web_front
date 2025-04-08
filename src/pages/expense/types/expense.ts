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

export type ExpenseSearchParams = {
  searchText: string;
  searchCategories: string[];
  dateRange: [Dayjs | null, Dayjs | null] | null;
  type?: 'income' | 'expense' | null;
}; 