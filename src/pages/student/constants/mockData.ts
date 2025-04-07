import dayjs from 'dayjs';
import { Student } from '@/pages/student/types/student';
import { courseOptions } from './options';

/**
 * 生成模拟学员数据
 */
export const generateMockStudents = (count: number = 50): Student[] => {
  return Array(count)
    .fill(null)
    .map((_, index) => {
      const courseItem = courseOptions[index % courseOptions.length];
      const totalClasses = 20 + (index % 10);
      const remainingClasses = Math.max(1, totalClasses - (index % totalClasses));
      
      return {
        id: `ST${100000 + index}`,
        name: `学员${index + 1}`,
        gender: index % 2 === 0 ? 'male' : 'female',
        age: 6 + (index % 15),
        phone: `13${String(9000000000 + index).substring(0, 10)}`,
        courseType: courseItem.type,
        course: courseItem.value,
        coach: courseItem.coaches[index % 2],
        lastClassDate: dayjs().subtract(index * 30, 'day').format('YYYY-MM-DD'),
        enrollDate: dayjs().subtract(index * 180, 'day').format('YYYY-MM-DD'),
        expireDate: dayjs().add(180 - (index % 180), 'day').format('YYYY-MM-DD'),
        remainingClasses: `${remainingClasses}/${totalClasses}`,
        status: index % 7 === 0 ? 'pending' : index % 7 === 1 ? 'inactive' : 'active',
      };
    });
};

// 导出初始模拟数据
export const mockStudents = generateMockStudents(); 