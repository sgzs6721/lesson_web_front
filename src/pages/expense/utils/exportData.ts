import { Expense } from '../types/expense';

export const exportToCSV = (data: Expense[]) => {
  // 定义CSV头部
  const headers = ['日期', '支出项目', '金额', '类别', '备注', '操作人'];
  
  // 转换数据为CSV行
  const rows = data.map(item => [
    item.date,
    item.item,
    item.amount,
    item.category,
    item.remark,
    item.operator
  ]);
  
  // 合并头部和数据行
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  // 创建Blob对象
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // 创建下载链接
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  // 设置下载属性
  link.setAttribute('href', url);
  link.setAttribute('download', `支出记录_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  // 添加到文档并触发点击
  document.body.appendChild(link);
  link.click();
  
  // 清理
  document.body.removeChild(link);
}; 