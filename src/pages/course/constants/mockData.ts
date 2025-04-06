import dayjs from 'dayjs';
import { Course } from '../types/course';
import { categoryOptions, campusOptions, coachOptions } from './courseOptions';

export const generateMockCourses = (): Course[] => {
  return Array(30)
    .fill(null)
    .map((_, index) => {
      const category = categoryOptions[index % categoryOptions.length].value;
      const level = index % 3 === 0 ? 'beginner' : index % 3 === 1 ? 'intermediate' : 'advanced';
      const periodUnit = index % 3 === 0 ? 'day' : index % 3 === 1 ? 'week' : 'month';
      const totalHours = 10 + (index % 10) * 4;
      
      return {
        id: `C${10000 + index}`,
        name: `${categoryOptions[index % categoryOptions.length].label}${level === 'beginner' ? '初级' : level === 'intermediate' ? '中级' : '高级'}班`,
        category,
        level,
        price: 500 + index * 100,
        capacity: 10 + (index % 15),
        period: 1 + (index % 5),
        periodUnit,
        totalHours,
        consumedHours: Math.floor(totalHours * (0.1 + Math.random() * 0.7)),
        hoursPerClass: 1 + (index % 3),
        unitPrice: 50 + (index % 10) * 15,
        status: index % 5 === 0 ? 'pending' : index % 7 === 0 ? 'inactive' : 'active',
        description: `这是一个${categoryOptions[index % categoryOptions.length].label}${level === 'beginner' ? '初级' : level === 'intermediate' ? '中级' : '高级'}班，适合${level === 'beginner' ? '初学者' : level === 'intermediate' ? '有一定基础的学员' : '高级学员'}。`,
        cover: `https://picsum.photos/200/300?random=${index}`,
        createdAt: dayjs().subtract(index * 2, 'day').format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: dayjs().subtract(index, 'day').format('YYYY-MM-DD HH:mm:ss'),
        campuses: [
          campusOptions[index % campusOptions.length].value,
          campusOptions[(index + 2) % campusOptions.length].value,
        ],
        coaches: [
          coachOptions[index % coachOptions.length].value,
          coachOptions[(index + 3) % coachOptions.length].value,
        ],
      };
    });
};

export const mockCourses = generateMockCourses(); 