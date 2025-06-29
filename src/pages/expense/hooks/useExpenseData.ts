import { useState, useEffect, useRef } from 'react';
import { Expense, ExpenseSearchParams } from '../types/expense';
import dayjs from 'dayjs';
import { message } from 'antd';
import { generateTransactionId } from '../utils/formatters';
import { API } from '@/api';
import { FinanceListRequest } from '@/api/finance';

export const useFinanceData = () => {
  const [data, setData] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // 用于防止重复错误提示的ref
  const lastErrorTimeRef = useRef<number>(0);
  const lastErrorMessageRef = useRef<string>('');

  // 用于防止重复请求的ref
  const lastFetchTimeRef = useRef<number>(0);
  const lastFetchParamsRef = useRef<string>('');
  const fetchPromiseRef = useRef<Promise<any> | null>(null);

  // 显示错误消息的函数，带防重复机制
  const showErrorMessage = (errorMessage: string) => {
    const now = Date.now();
    const timeDiff = now - lastErrorTimeRef.current;
    
    // 如果距离上次错误提示不足1秒且错误消息相同，则不显示
    if (timeDiff < 1000 && lastErrorMessageRef.current === errorMessage) {
      return;
    }
    
    lastErrorTimeRef.current = now;
    lastErrorMessageRef.current = errorMessage;
    message.error(errorMessage);
  };

  // 获取数据的函数
  const fetchData = async (
    params: Partial<FinanceListRequest> = {},
    currentPage?: number,
    currentPageSize?: number
  ) => {
    const now = Date.now();
    const timeDiff = now - lastFetchTimeRef.current;
    
    // 生成请求参数的唯一标识
    const requestKey = JSON.stringify({
      ...params,
      pageNum: currentPage || pagination.current,
      pageSize: currentPageSize || pagination.pageSize,
      campusId: localStorage.getItem('currentCampusId') || '1'
    });

    // 如果距离上次请求不足500ms且请求参数相同，则不重复请求
    if (timeDiff < 500 && lastFetchParamsRef.current === requestKey) {
      return;
    }

    // 如果当前有正在进行的相同请求，则复用该请求
    if (fetchPromiseRef.current && lastFetchParamsRef.current === requestKey) {
      return fetchPromiseRef.current;
    }

    const doFetch = async () => {
      try {
        setLoading(true);
        const currentCampusId = localStorage.getItem('currentCampusId') || '1';
        
        const requestParams: FinanceListRequest = {
          campusId: Number(currentCampusId),
          pageNum: currentPage || pagination.current,
          pageSize: currentPageSize || pagination.pageSize,
          ...params
        };

        const response = await API.finance.getList(requestParams);
        
        // 转换API响应数据到前端格式
        // 由于API返回的id可能重复，我们生成唯一的前端id
        const transformedData: Expense[] = response.data.list.map((item, index) => ({
          id: `${item.id}-${index}-${item.date}`, // 使用id+索引+日期确保唯一性
          type: item.transactionType, // 将API的transactionType映射到前端的type
          date: item.date,
          item: item.item,
          amount: item.amount,
          category: item.categoryName, // 将API的categoryName映射到前端的category
          remark: item.notes,
          operator: item.operator
        }));

        setData(transformedData);
        setPagination(prev => ({
          ...prev,
          total: response.data.total
        }));
      } catch (error) {
        console.error('获取数据失败:', error);
        setData([]);
        setPagination(prev => ({
          ...prev,
          total: 0
        }));
        showErrorMessage('获取数据失败，请检查网络连接或稍后再试');
      } finally {
        setLoading(false);
        // 清除请求promise引用
        fetchPromiseRef.current = null;
      }
    };

    // 记录请求信息
    lastFetchTimeRef.current = now;
    lastFetchParamsRef.current = requestKey;
    
    // 保存并执行请求
    const promise = doFetch();
    fetchPromiseRef.current = promise;
    
    return promise;
  };

  // 初始化加载数据
  useEffect(() => {
    fetchData({}, pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);
  
  const addTransaction = (values: Omit<Expense, 'id' | 'date' | 'operator'> & { date: dayjs.Dayjs; type: 'EXPEND' | 'INCOME' }) => {
    // 不再在本地添加数据，而是等待API调用后刷新
    // 这样可以避免id重复的问题
    const newTransaction: Expense = {
      id: `temp-${Date.now()}`, // 临时id，不会被使用
      ...values,
      date: values.date.format('YYYY-MM-DD'),
      operator: '当前用户'
    };
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
    // 使用API搜索
    const apiParams: Partial<FinanceListRequest> = {};
    
    if (params.text) {
      apiParams.keyword = params.text;
    }
    
    if (params.searchCategories && params.searchCategories.length > 0) {
      // 现在API支持多分类搜索，传递分类ID数组
      // 假设searchCategories中存储的是分类ID
      apiParams.categoryId = params.searchCategories.map(category => Number(category));
    }
    
    if (params.type) {
      apiParams.transactionType = params.type;
    }
    
    if (params.dateRange && params.dateRange[0] && params.dateRange[1]) {
      apiParams.startDate = params.dateRange[0].format('YYYY-MM-DD');
      apiParams.endDate = params.dateRange[1].format('YYYY-MM-DD');
    }
    
    fetchData(apiParams);
  };
  
  const resetData = () => {
    fetchData();
  };

  // 分页处理
  const handlePageChange = (page: number, pageSize?: number) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      pageSize: pageSize || prev.pageSize
    }));
  };
  
  // 支出数据统计
  const expenseData = data.filter(item => item.type === 'EXPEND');
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
  const incomeData = data.filter(item => item.type === 'INCOME');
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
    loading,
    pagination,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    filterData,
    resetData,
    handlePageChange,
    fetchData,
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