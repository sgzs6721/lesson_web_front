import { useState, useEffect, useCallback, useRef } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import { Payment, PaymentSearchParams, PaymentStatistics, PaymentFilterParams } from '../types/payment';
import { getPaymentStatistics, getPaymentList, PaymentRecordItem, PaymentStatRequest } from '@/api/payment';

export const usePaymentData = () => {
  const [data, setData] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [statisticsLoading, setStatisticsLoading] = useState(false);
  const [statistics, setStatistics] = useState<PaymentStatistics>({
    paymentCount: 0,
    paymentTotal: 0,
    refundCount: 0,
    refundTotal: 0,
  });
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState<PaymentSearchParams>({
    searchText: '',
    searchStatus: '',
    searchPaymentType: '',
    searchPaymentMethod: [],
    selectedCourse: [],
    dateRange: null,
  });

  // 防重复请求
  const lastFetchParams = useRef<string>('');
  const isLoadingRef = useRef(false);

  // 将API返回的记录转换为本地格式
  const transformApiRecord = (apiRecord: PaymentRecordItem, index: number): Payment => {
    return {
      id: String(apiRecord.id), // 直接使用API返回的id字段
      date: apiRecord.date || '',
      studentName: apiRecord.student || '',
      studentId: apiRecord.studentId || '', // 使用API返回的studentId字段
      course: apiRecord.course || '',
      amount: parseFloat(apiRecord.amount || '0'),
      paymentType: apiRecord.paymentType || '',
      paymentMethod: apiRecord.payType || '',
      status: (apiRecord.payType || '') as any,
      remark: '',
      operator: '系统',
      lessonType: apiRecord.lessonType,
      lessonChange: apiRecord.hours ? `${apiRecord.hours}课时` : (apiRecord.lessonChange || '-'),
      payType: apiRecord.payType,
      giftHours: apiRecord.giftedHours || 0, // 添加赠课课时字段
    };
  };

  // 获取数据的函数
  const fetchData = useCallback(async () => {
    const campusId = Number(localStorage.getItem('currentCampusId')) || 1;
    
    // 构建列表查询参数
    const listParams: PaymentFilterParams = {
      pageNum: currentPage,
      pageSize: pageSize,
      campusId,
      sortField: 'createdTime', // 默认按缴费时间排序
      sortOrder: 'desc', // 默认降序排列
    };

    // 构建统计查询参数
    const statParams: PaymentStatRequest = {
      campusId,
    };

    if (searchParams.searchText) {
      listParams.keyword = searchParams.searchText;
      statParams.keyword = searchParams.searchText;
    }
    if (searchParams.selectedCourse) {
      if (Array.isArray(searchParams.selectedCourse) && searchParams.selectedCourse.length > 0) {
        listParams.courseIds = searchParams.selectedCourse.map(id => Number(id));
        statParams.courseIds = searchParams.selectedCourse.map(id => Number(id));
      } else if (typeof searchParams.selectedCourse === 'string' && searchParams.selectedCourse) {
        listParams.courseId = Number(searchParams.selectedCourse);
        statParams.courseId = Number(searchParams.selectedCourse);
      }
    }
    if (searchParams.searchPaymentType) {
      listParams.lessonType = searchParams.searchPaymentType;
      statParams.lessonType = searchParams.searchPaymentType;
    }
    if (searchParams.searchPaymentMethod) {
      if (Array.isArray(searchParams.searchPaymentMethod) && searchParams.searchPaymentMethod.length > 0) {
        listParams.paymentTypes = searchParams.searchPaymentMethod;
        statParams.paymentTypes = searchParams.searchPaymentMethod;
      } else if (typeof searchParams.searchPaymentMethod === 'string' && searchParams.searchPaymentMethod) {
        listParams.paymentType = searchParams.searchPaymentMethod;
        statParams.paymentType = searchParams.searchPaymentMethod;
      }
    }
    if (searchParams.dateRange?.[0] && searchParams.dateRange?.[1]) {
      listParams.startDate = searchParams.dateRange[0].format('YYYY-MM-DD');
      listParams.endDate = searchParams.dateRange[1].format('YYYY-MM-DD');
      statParams.startDate = searchParams.dateRange[0].format('YYYY-MM-DD');
      statParams.endDate = searchParams.dateRange[1].format('YYYY-MM-DD');
    }
    
    // 生成参数的唯一标识，避免相同参数重复请求
    const paramsKey = JSON.stringify({ listParams, statParams });
    if (lastFetchParams.current === paramsKey || isLoadingRef.current) {
      return;
    }
    lastFetchParams.current = paramsKey;
    isLoadingRef.current = true;

    console.log('开始获取缴费数据，列表参数:', listParams, '统计参数:', statParams);

    try {
      setLoading(true);
      setStatisticsLoading(true);

      // 并行请求两个API
      const [listResponse, statResponse] = await Promise.all([
        getPaymentList(listParams),
        getPaymentStatistics(statParams)
      ]);

      // 处理列表数据
      const transformedData = listResponse.list.map((apiRecord, index) => 
        transformApiRecord(apiRecord, index)
      );
      
      // 批量更新状态
      setData(transformedData);
      setTotal(listResponse.total);
      setStatistics({
        paymentCount: statResponse.paymentCount || 0,
        paymentTotal: statResponse.paymentTotal || 0,
        refundCount: statResponse.refundCount || 0,
        refundTotal: statResponse.refundTotal || 0,
      });

      console.log('缴费数据获取成功');
    } catch (error) {
      console.error('获取缴费数据失败:', error);
      message.error('获取缴费数据失败');
      setData([]);
      setTotal(0);
      setStatistics({
        paymentCount: 0,
        paymentTotal: 0,
        refundCount: 0,
        refundTotal: 0,
      });
    } finally {
      setLoading(false);
      setStatisticsLoading(false);
      isLoadingRef.current = false;
    }
  }, [currentPage, pageSize, searchParams]);

  // 只在依赖项变化时调用
  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchParams]);
  
  const deletePayment = (id: string) => {
    setData(data.filter(item => item.id !== id));
    message.success('删除成功');
  };
  
  const filterData = useCallback((params: PaymentSearchParams) => {
    // 过滤掉所有value数组中的空字符串，防止antd Select渲染空标签
    const cleanedParams: PaymentSearchParams = {
      ...params,
      searchPaymentMethod: Array.isArray(params.searchPaymentMethod) 
        ? params.searchPaymentMethod.filter(v => v) 
        : params.searchPaymentMethod,
      selectedCourse: Array.isArray(params.selectedCourse)
        ? params.selectedCourse.filter(v => v)
        : params.selectedCourse,
    };

    // 使用React 18的自动批处理，同时更新多个状态
    setSearchParams(cleanedParams);
    if (currentPage !== 1) {
      setCurrentPage(1); // 重置到第一页
    }
  }, [currentPage]);
  
  const resetData = useCallback(() => {
    const defaultParams = {
      searchText: '',
      searchStatus: '',
      searchPaymentType: '',
      searchPaymentMethod: [],
      selectedCourse: [],
      dateRange: null,
    };
    setSearchParams(defaultParams);
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [currentPage]);

  const handlePageChange = useCallback((page: number, size: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
    if (size !== pageSize) {
      setPageSize(size);
    }
  }, [currentPage, pageSize]);
  
  return {
    data,
    loading,
    statisticsLoading,
    statistics,
    total,
    currentPage,
    pageSize,
    deletePayment,
    filterData,
    resetData,
    handlePageChange,
    paymentCount: statistics.paymentCount,
    paymentAmount: statistics.paymentTotal,
    refundCount: statistics.refundCount,
    refundAmount: statistics.refundTotal
  };
}; 