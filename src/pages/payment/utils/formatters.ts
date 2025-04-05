import dayjs from 'dayjs';

export const formatCurrency = (amount: number): string => {
  return `¥${amount.toLocaleString('zh-CN')}`;
};

export const generatePaymentId = (dataLength: number): string => {
  return `PAY${dayjs().format('YYYYMM')}${String(dataLength + 1).padStart(3, '0')}`;
}; 