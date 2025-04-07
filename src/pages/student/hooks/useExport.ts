import { message } from 'antd';
import { Student } from '../types/student';
import { exportToCSV } from '../utils/exportData';

/**
 * 导出功能相关的hook
 * @returns 导出功能相关的函数
 */
export const useExport = () => {
  // 处理导出
  const handleExport = (students: Student[]) => {
    if (students.length === 0) {
      message.warning('没有数据可导出');
      return;
    }
    
    exportToCSV(students);
  };
  
  return {
    handleExport
  };
}; 