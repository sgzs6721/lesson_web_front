import { Student } from '@/pages/student/types/student';
import dayjs from 'dayjs';
import { courseTypeOptions } from '@/pages/student/constants/options';
import { message } from 'antd';

/**
 * 导出学员数据为CSV文件
 * @param students 学员数据列表
 */
export const exportToCSV = (students: Student[]) => {
  // 创建导出数据
  const exportData = students.map(student => ({
    ID: student.id,
    姓名: student.name,
    性别: student.gender === 'MALE' ? '男' : '女',
    年龄: student.age,
    联系电话: student.phone,
    课程类型: courseTypeOptions.find(t => t.value === student.courseType)?.label || student.courseType,
    教练: student.coach,
    剩余课时: student.remainingClasses,
    最近上课时间: student.lastClassDate ? dayjs(student.lastClassDate).format('YYYY-MM-DD') : '-',
    报名日期: dayjs(student.enrollDate).format('YYYY-MM-DD'),
    有效期至: dayjs(student.expireDate).format('YYYY-MM-DD'),
    状态: student.status === 'normal' ? '在学' :
          student.status === 'expired' ? '停课' :
          student.status === 'graduated' ? '已毕业' :
          student.status === 'STUDYING' ? '在学' : student.status
  }));

  if (exportData.length === 0) {
    message.warning('没有数据可导出');
    return;
  }

  // 转换为CSV内容
  const headers = Object.keys(exportData[0]);
  const csvContent = [
    // 添加标题行
    headers.join(','),
    // 添加数据行
    ...exportData.map(row =>
      headers.map(header => {
        // 处理包含逗号的单元格数据
        const cell = row[header as keyof typeof row];
        const cellStr = String(cell);
        return cellStr.includes(',') ? `"${cellStr}"` : cellStr;
      }).join(',')
    )
  ].join('\n');

  // 创建Blob对象
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  // 创建下载链接
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  // 设置下载属性
  link.setAttribute('href', url);
  link.setAttribute('download', `学员列表_${dayjs().format('YYYYMMDD')}.csv`);
  link.style.visibility = 'hidden';

  // 添加到文档并触发点击
  document.body.appendChild(link);
  link.click();

  // 清理
  document.body.removeChild(link);
  message.success('导出成功');
};