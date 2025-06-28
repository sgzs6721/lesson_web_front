// 支出类别
export const EXPENSE_CATEGORY = {
  SALARY: '工资支出',
  OPERATION: '固定成本',
  OTHER: '其他支出',
};

// 收入类别
export const INCOME_CATEGORY = {
  TUITION: '学费收入',
  TRAINING: '培训收入',
  RETAIL: '零售收入',
  OTHER: '其他收入',
};

// 交易类型
export const TRANSACTION_TYPE = {
  EXPENSE: 'expense',
  INCOME: 'income',
};

// 交易类型标签
export const TRANSACTION_TYPE_LABEL = {
  [TRANSACTION_TYPE.EXPENSE]: '支出',
  [TRANSACTION_TYPE.INCOME]: '收入',
  EXPEND: '支出',
  INCOME: '收入',
}; 