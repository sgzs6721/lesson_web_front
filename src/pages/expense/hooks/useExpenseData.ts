import { useState } from 'react';
import { Expense, ExpenseSearchParams } from '../types/expense';
import { mockData } from '../constants/mockData';
import dayjs from 'dayjs';
import { message } from 'antd';
import { generateTransactionId } from '../utils/formatters';

export const useFinanceData = () => {
  const [data, setData] = useState<Expense[]>(mockData);
  
  const addTransaction = (values: Omit<Expense, 'id' | 'date' | 'operator'> & { date: dayjs.Dayjs; type: 'income' | 'expense' }) => {
    const countByType = data.filter(item => item.type === values.type).length;
    const newTransaction: Expense = {
      id: generateTransactionId(countByType, values.type),
      ...values,
      date: values.date.format('YYYY-MM-DD'),
      operator: '当前用户'
    };
    setData([...data, newTransaction]);
    message.success(values.type === 'income' ? '收入记录添加成功' : '支出记录添加成功');
    return newTransaction;
  };
  
  const updateTransaction = (id: string, values: Omit<Expense, 'id' | 'date'> & { date: dayjs.Dayjs }) => {
    setData(data.map(item =>
      item.id === id ?
      { ...item, ...values, date: values.date.format('YYYY-MM-DD') } :
      item
    ));
    message.success('记录更新成功');
  };
  
  const deleteTransaction = (id: string) => {
    setData(data.filter(item => item.id !== id));
    message.success('删除成功');
  };
  
  const filterData = (params: ExpenseSearchParams) => {
    let filteredData = mockData;
    const { text, searchCategories, dateRange, type } = params;

    if (text) {
      filteredData = filteredData.filter(
        item => item.item.includes(text) ||
               item.remark.includes(text) ||
               item.id.includes(text)
      );
    }

    if (searchCategories && searchCategories.length > 0) {
      filteredData = filteredData.filter(item => searchCategories.includes(item.category));
    }

    if (type) {
      filteredData = filteredData.filter(item => item.type === type);
    }

    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].format('YYYY-MM-DD');
      const endDate = dateRange[1].format('YYYY-MM-DD');
      filteredData = filteredData.filter(
        item => item.date >= startDate && item.date <= endDate
      );
    }

    setData(filteredData);
  };
  
  const resetData = () => {
    setData(mockData);
  };
  
  // 支出数据统计
  const expenseData = data.filter(item => item.type === 'expense');
  const totalExpense = expenseData.reduce((sum, item) => sum + item.amount, 0);
  
  const salaryExpense = expenseData
    .filter(item => item.category === '工资支出')
    .reduce((sum, item) => sum + item.amount, 0);
  
  const operationExpense = expenseData
    .filter(item => item.category === '固定成本')
    .reduce((sum, item) => sum + item.amount, 0);
  
  const otherExpense = expenseData
    .filter(item => item.category === '其他支出')
    .reduce((sum, item) => sum + item.amount, 0);

  // 收入数据统计
  const incomeData = data.filter(item => item.type === 'income');
  const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);
  
  const tuitionIncome = incomeData
    .filter(item => item.category === '学费收入')
    .reduce((sum, item) => sum + item.amount, 0);
  
  const trainingIncome = incomeData
    .filter(item => item.category === '培训收入')
    .reduce((sum, item) => sum + item.amount, 0);
  
  const retailIncome = incomeData
    .filter(item => item.category === '零售收入')
    .reduce((sum, item) => sum + item.amount, 0);
  
  const otherIncome = incomeData
    .filter(item => item.category === '其他收入')
    .reduce((sum, item) => sum + item.amount, 0);
  
  return {
    data,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    filterData,
    resetData,
    // 支出统计
    totalExpense,
    salaryExpense,
    operationExpense,
    otherExpense,
    // 收入统计
    totalIncome,
    tuitionIncome,
    trainingIncome,
    retailIncome,
    otherIncome
  };
}; 