import dayjs from 'dayjs';

export const formatCurrency = (amount: number): string => {
  return `¥${amount.toLocaleString('zh-CN')}`;
};

export const generateExpenseId = (dataLength: number): string => {
  return `EXP${dayjs().format('YYYYMM')}${String(dataLength + 1).padStart(3, '0')}`;
};

export const generateIncomeId = (dataLength: number): string => {
  return `INC${dayjs().format('YYYYMM')}${String(dataLength + 1).padStart(3, '0')}`;
};

// 根据交易类型生成ID
export const generateTransactionId = (dataLength: number, type: 'income' | 'expense'): string => {
  return type === 'income' 
    ? generateIncomeId(dataLength) 
    : generateExpenseId(dataLength);
}; 