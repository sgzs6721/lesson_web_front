import { Payment } from '../types/payment';
import dayjs from 'dayjs';
import { message } from 'antd';

export const exportToCSV = (data: Payment[]): void => {
  try {
    const exportedData = data.map(item => ({
      日期: item.date,
      学员姓名: item.studentName,
      学员ID: item.studentId,
      课程: item.course,
      金额: item.amount,
      课时类型: item.paymentType,
      缴费类型: item.paymentMethod,
      支付方式: item.status,
      备注: item.remark,
      操作员: item.operator
    }));

    const headers = Object.keys(exportedData[0]).join(',') + '\n';
    const csv = exportedData.reduce((acc, row) => {
      return acc + Object.values(row).join(',') + '\n';
    }, headers);

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `付款记录_${dayjs().format('YYYY-MM-DD')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    message.success('导出成功');
  } catch (error) {
    console.error('导出错误:', error);
    message.error('导出失败，请重试');
  }
}; 