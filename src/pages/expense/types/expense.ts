import { Dayjs } from 'dayjs';

// 支出项目枚举类型
export type ExpenseItemType =
  | 'FIXED_COST'
  | 'SALARY_EXPENSE'
  | 'OTHER_EXPENSE'
  | 'TUITION_INCOME'
  | 'RETAIL_INCOME'
  | 'OTHER_INCOME';

export interface Expense {
  id: string;
  date: string;
  item: string | ExpenseItemType; // 支持字符串或枚举类型
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