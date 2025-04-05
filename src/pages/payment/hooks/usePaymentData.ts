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
  const totalIncome = data
    .filter(item => item.status === '微信支付' || item.status === '现金支付' || item.status === '支付宝支付' || item.status === '银行卡转账')
    .reduce((sum, item) => sum + item.amount, 0);

  const pendingIncome = 0; // 没有待确认收入的状态

  const refundedAmount = 0; // 没有退款的状态
  
  return {
    data,
    addPayment,
    updatePayment,
    deletePayment,
    filterData,
    resetData,
    totalIncome,
    pendingIncome,
    refundedAmount
  };
}; 