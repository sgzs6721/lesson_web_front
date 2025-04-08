import { useState } from 'react';
import { Payment, PaymentSearchParams } from '../types/payment';
import { mockData } from '../constants/mockData';
import dayjs from 'dayjs';
import { message } from 'antd';
import { generatePaymentId } from '../utils/formatters';

export const usePaymentData = () => {
  const [data, setData] = useState<Payment[]>(mockData);
  
  const addPayment = (values: Omit<Payment, 'id' | 'date' | 'operator'> & { date: dayjs.Dayjs }) => {
    const newPayment: Payment = {
      id: generatePaymentId(data.length),
      ...values,
      date: values.date.format('YYYY-MM-DD'),
      operator: '当前用户'
    };
    setData([...data, newPayment]);
    message.success('付款记录添加成功');
    return newPayment;
  };
  
  const updatePayment = (id: string, values: Omit<Payment, 'id' | 'date'> & { date: dayjs.Dayjs }) => {
    setData(data.map(item =>
      item.id === id ?
      { ...item, ...values, date: values.date.format('YYYY-MM-DD') } :
      item
    ));
    message.success('付款记录更新成功');
  };
  
  const deletePayment = (id: string) => {
    setData(data.filter(item => item.id !== id));
    message.success('删除成功');
  };
  
  const filterData = (params: PaymentSearchParams) => {
    let filteredData = mockData;
    const { searchText, searchStatus, searchPaymentType, searchPaymentMethod, dateRange } = params;

    if (searchText) {
      filteredData = filteredData.filter(
        item => item.studentName.includes(searchText) ||
               item.studentId.includes(searchText) ||
               item.course.includes(searchText) ||
               item.id.includes(searchText)
      );
    }

    if (searchStatus) {
      filteredData = filteredData.filter(item => item.status === searchStatus);
    }

    if (searchPaymentType) {
      filteredData = filteredData.filter(item => item.paymentType === searchPaymentType);
    }

    if (searchPaymentMethod) {
      filteredData = filteredData.filter(item => item.paymentMethod === searchPaymentMethod);
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
  
  // 计算统计数据
  const payments = data.filter(item => item.paymentType === '缴费');
  const refunds = data.filter(item => item.paymentType === '退费');
  
  // 缴费次数
  const paymentCount = payments.length;
  
  // 缴费金额
  const paymentAmount = payments.reduce((sum, item) => sum + item.amount, 0);
  
  // 退费次数
  const refundCount = refunds.length;
  
  // 退费金额
  const refundAmount = refunds.reduce((sum, item) => sum + item.amount, 0);
  
  return {
    data,
    addPayment,
    updatePayment,
    deletePayment,
    filterData,
    resetData,
    paymentCount,
    paymentAmount,
    refundCount,
    refundAmount
  };
}; 