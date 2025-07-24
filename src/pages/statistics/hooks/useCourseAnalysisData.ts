import { useState, useEffect } from 'react';
import {
  CourseAnalysisData,
  CourseMetrics,
  CourseSalesData,
  CourseComparisonData
} from '../components/CourseAnalysis';

export interface CourseRevenueData {
  revenueByType: {
    courseType: string;
    revenue: number;
    percentage: number;
  }[];
  totalRevenue: number;
  averagePrice: number;
  revenueTrend: {
    month: string;
    revenue: number;
  }[];
}

export const useCourseAnalysisData = (
  timeframe: string
) => {
  const [courseData, setCourseData] = useState<CourseAnalysisData | null>(null);
  const [salesData, setSalesData] = useState<CourseSalesData | null>(null);
  const [comparisonData, setComparisonData] = useState<CourseComparisonData[] | null>(null);
  const [revenueData, setRevenueData] = useState<CourseRevenueData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourseAnalysisData = async () => {
      setLoading(true);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock course analysis data
        const mockCourseData: CourseAnalysisData = {
          totalCourses: 156,              // 课程总数
          soldCourses: 1284,              // 已销课程数
          newCourses: 68,                 // 新报课程数
          consumedLessons: 3420,          // 已消耗课时
          remainingLessons: 8760,         // 剩余课时
          averagePrice: 180,              // 课程平均单价(元/课时)
          totalSalesAmount: 2456800,      // 总销售额(元)
          courseGrowth: 8.3,              // 课程总数增长率
          soldGrowth: 12.5,               // 销课增长率
          newGrowth: 15.3,                // 新报课程增长率
          consumedGrowth: 9.7,            // 消耗课时增长率
          salesGrowth: 11.8,              // 销售额增长率
          priceGrowth: 2.1,               // 单价增长率
        };

        // Mock sales data
        const mockSalesData: CourseSalesData = {
          months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          soldCourses: [95, 108, 125, 142, 156, 178, 195, 210, 225, 240, 255, 268],      // 每月销课数量
          consumedLessons: [280, 295, 310, 325, 340, 355, 370, 385, 400, 415, 430, 445], // 每月消耗课时
          salesAmount: [171, 194.4, 225, 255.6, 280.8, 320.4, 351, 378, 405, 432, 459, 482.4], // 每月销售额(万元)
          newCourses: [45, 52, 58, 65, 72, 78, 85, 92, 98, 105, 112, 118],              // 每月新报课程数
        };

        // Mock comparison data
        const mockComparisonData: CourseComparisonData[] = [
          {
            courseId: 'course-001',
            courseName: '基础数学一对一',
            courseType: '一对一',
            totalSold: 245,
            consumedLessons: 1960,
            remainingLessons: 980,
            unitPrice: 200,
            totalRevenue: 588000,
          },
          {
            courseId: 'course-002',
            courseName: '高级英语小班课',
            courseType: '小班课',
            totalSold: 189,
            consumedLessons: 1512,
            remainingLessons: 756,
            unitPrice: 150,
            totalRevenue: 340200,
          },
          {
            courseId: 'course-003',
            courseName: '物理实验课',
            courseType: '大班课',
            totalSold: 167,
            consumedLessons: 1336,
            remainingLessons: 668,
            unitPrice: 120,
            totalRevenue: 240480,
          },
          {
            courseId: 'course-004',
            courseName: '化学基础课',
            courseType: '大班课',
            totalSold: 134,
            consumedLessons: 1072,
            remainingLessons: 536,
            unitPrice: 120,
            totalRevenue: 192960,
          },
          {
            courseId: 'course-005',
            courseName: '生物科学课',
            courseType: '小班课',
            totalSold: 123,
            consumedLessons: 984,
            remainingLessons: 492,
            unitPrice: 150,
            totalRevenue: 221400,
          },
          {
            courseId: 'course-006',
            courseName: '计算机编程',
            courseType: '一对一',
            totalSold: 198,
            consumedLessons: 1584,
            remainingLessons: 792,
            unitPrice: 250,
            totalRevenue: 594000,
          },
          {
            courseId: 'course-007',
            courseName: '艺术设计课',
            courseType: '小班课',
            totalSold: 89,
            consumedLessons: 712,
            remainingLessons: 356,
            unitPrice: 180,
            totalRevenue: 192240,
          },
          {
            courseId: 'course-008',
            courseName: '音乐理论课',
            courseType: '大班课',
            totalSold: 67,
            consumedLessons: 536,
            remainingLessons: 268,
            unitPrice: 100,
            totalRevenue: 80400,
          },
        ];

        // Mock revenue data
        const mockRevenueData: CourseRevenueData = {
          revenueByType: [
            { courseType: '一对一', revenue: 1182000, percentage: 45.2 },
            { courseType: '小班课', revenue: 753840, percentage: 28.8 },
            { courseType: '大班课', revenue: 513840, percentage: 19.6 },
            { courseType: '其他', revenue: 166320, percentage: 6.4 },
          ],
          totalRevenue: 2616000,
          averagePrice: 180,
          revenueTrend: [
            { month: '1月', revenue: 171000 },
            { month: '2月', revenue: 194400 },
            { month: '3月', revenue: 225000 },
            { month: '4月', revenue: 255600 },
            { month: '5月', revenue: 280800 },
            { month: '6月', revenue: 320400 },
            { month: '7月', revenue: 351000 },
            { month: '8月', revenue: 378000 },
            { month: '9月', revenue: 405000 },
            { month: '10月', revenue: 432000 },
            { month: '11月', revenue: 459000 },
            { month: '12月', revenue: 482400 },
          ],
        };

        setCourseData(mockCourseData);
        setSalesData(mockSalesData);
        setComparisonData(mockComparisonData);
        setRevenueData(mockRevenueData);
        
      } catch (error) {
        console.error('Error fetching course analysis data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAnalysisData();
  }, [timeframe]);

  return {
    courseData,
    salesData,
    comparisonData,
    revenueData,
    loading,
  };
};

// Additional utility functions for data processing
export const calculateCourseMetrics = (data: CourseComparisonData[]): CourseMetrics[] => {
  return data.map(course => ({
    courseId: course.courseId,
    courseName: course.courseName,
    courseType: 'General', // This would come from actual data
    enrollmentCount: course.enrollments,
    completionRate: (course.completions / course.enrollments) * 100,
    averageRating: course.rating,
    revenue: course.revenue,
    engagementScore: Math.round(((course.completions / course.enrollments) * course.rating * 20)),
    lastUpdated: new Date().toISOString(),
  }));
};

export const getTopPerformingCourses = (data: CourseComparisonData[], limit: number = 5): CourseComparisonData[] => {
  return data
    .sort((a, b) => (b.completions / b.enrollments * b.rating) - (a.completions / a.enrollments * a.rating))
    .slice(0, limit);
};

export const getCourseRevenueRanking = (data: CourseComparisonData[], limit: number = 5): CourseComparisonData[] => {
  return data
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
};

export const formatCurrency = (amount: number): string => {
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(1)}万`;
  }
  return amount.toLocaleString();
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const getGrowthColor = (growth: number): string => {
  if (growth > 0) return '#52c41a';
  if (growth < 0) return '#f5222d';
  return '#8c8c8c';
};

export const getGrowthIcon = (growth: number): string => {
  if (growth > 0) return '↗';
  if (growth < 0) return '↘';
  return '→';
};
