import dayjs from 'dayjs';
import { Course, CourseStatus, CourseType } from '../types/course';
import { categoryOptions, campusOptions, coachOptions } from './courseOptions';

export const generateMockCourses = (): Course[] => {
  return Array(30)
    .fill(null)
    .map((_, index) => {
      const typeId = categoryOptions[index % categoryOptions.length].value;
      const typeValue = index % 3 === 0 ? CourseType.PRIVATE : index % 3 === 1 ? CourseType.GROUP : CourseType.PACKAGE;
      const totalHours = 10 + (index % 10) * 4;
      const campusId = index % 3 + 1;
      const institutionId = 1;

      return {
        id: `C${10000 + index}`,
        name: `${categoryOptions[index % categoryOptions.length].label}${index % 3 === 0 ? '初级' : index % 3 === 1 ? '中级' : '高级'}班`,
        type: typeValue,
        status: index % 5 === 0 ? CourseStatus.DRAFT : index % 7 === 0 ? CourseStatus.SUSPENDED : CourseStatus.PUBLISHED,
        unitHours: 1 + (index % 3),
        totalHours,
        consumedHours: Math.floor(totalHours * (0.1 + Math.random() * 0.7)),
        price: 500 + index * 100,
        coachIds: [
          String(index % 5 + 1),
          String((index + 3) % 5 + 1),
        ],
        coachNames: [
          `教练${index % 5 + 1}`,
          `教练${(index + 3) % 5 + 1}`,
        ],
        campusId,
        campusName: `校区${campusId}`,
        institutionId,
        institutionName: '模拟机构',
        description: `这是一个${categoryOptions[index % categoryOptions.length].label}${index % 3 === 0 ? '初级' : index % 3 === 1 ? '中级' : '高级'}班，适合${index % 3 === 0 ? '初学者' : index % 3 === 1 ? '有一定基础的学员' : '高级学员'}。`,
        createdTime: dayjs().subtract(index * 2, 'day').format('YYYY-MM-DD HH:mm:ss'),
        updateTime: dayjs().subtract(index, 'day').format('YYYY-MM-DD HH:mm:ss'),
      };
    });
};

export const mockCourses = generateMockCourses();