import { Coach } from '../types/coach';
import dayjs from 'dayjs';

// 生成测试数据
export const mockData: Coach[] = Array(50)
  .fill(null)
  .map((_, index) => {
    return {
      id: `C${10000 + index}`,
      name: `教练${index + 1}`,
      gender: index % 2 === 0 ? 'male' : 'female',
      age: 25 + (index % 20),
      phone: `13${String(9000000000 + index).substring(0, 10)}`,
      avatar: `https://randomuser.me/api/portraits/${index % 2 === 0 ? 'men' : 'women'}/${index % 15}.jpg`,
      jobTitle: index % 5 === 0 ? '高级教练' : index % 3 === 0 ? '中级教练' : '初级教练',
      certifications: index % 3 === 0 ? '国家体育教练员证' : index % 2 === 0 ? '急救证，专业教练认证' : '健身教练证',
      experience: 1 + (index % 15),
      status: index % 7 === 0 ? 'vacation' : index % 11 === 0 ? 'resigned' : 'active',
      hireDate: dayjs().subtract(index % 1000, 'day').format('YYYY-MM-DD'),
      baseSalary: 5000 + (index % 10) * 500,
      socialSecurity: 500 + (index % 5) * 50,
      hourlyRate: 100 + (index % 8) * 10,
      performanceBonus: (index % 3) * 1000,
      commission: 5 + (index % 10),
      dividend: (index % 4) * 500,
    };
  }); 