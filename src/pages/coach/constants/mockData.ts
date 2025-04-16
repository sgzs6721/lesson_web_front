import { Coach } from '../types/coach';
import dayjs from 'dayjs';
import { avatarOptions } from './avatarOptions';
import { CoachGender, CoachStatus } from '../../../api/coach/types';

// 生成随机数据
export const generateMockCoaches = (count: number): Coach[] => {
  const coaches: Coach[] = [];

  for (let i = 0; i < count; i++) {
    const gender = Math.random() > 0.5 ? CoachGender.MALE : CoachGender.FEMALE;
    const avatars = gender === CoachGender.MALE ? avatarOptions.male : avatarOptions.female;
    const avatar = avatars[Math.floor(Math.random() * avatars.length)].url;

    // 随机状态
    const statusOptions = [CoachStatus.ACTIVE, CoachStatus.VACATION, CoachStatus.RESIGNED];
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];

    // 随机证书
    const certificationOptions = ['私教认证', '瑜伽教练认证', '普拉提认证', '游泳教练认证', '营养师认证'];
    const certifications = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => 
      certificationOptions[Math.floor(Math.random() * certificationOptions.length)]
    );

    // 随机职称
    const jobTitleOptions = ['初级教练', '中级教练', '高级教练', '资深教练', '首席教练'];
    const jobTitle = jobTitleOptions[Math.floor(Math.random() * jobTitleOptions.length)];

    // 随机入职日期 (1-3年内)
    const daysAgo = Math.floor(Math.random() * 1095) + 1;
    const hireDate = dayjs().subtract(daysAgo, 'day').format('YYYY-MM-DD');

    // 工作年限 (1-10年)
    const experience = Math.floor(Math.random() * 10) + 1;

    // 随机薪资数据
    const baseSalary = Math.floor(Math.random() * 5000) + 5000;
    const socialInsurance = Math.floor(Math.random() * 2000) + 1000;
    const classFee = Math.floor(Math.random() * 200) + 100;
    const performanceBonus = Math.floor(Math.random() * 3000) + 1000;
    const commission = Math.floor(Math.random() * 2000) + 500;
    const dividend = Math.floor(Math.random() * 5000);

    coaches.push({
      id: `COACH${1000 + i}`,
      name: `教练${i + 1}`,
      gender,
      age: Math.floor(Math.random() * 15) + 25,
      phone: `1${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10000000).toString().padStart(8, '0')}`,
      avatar,
      jobTitle,
      certifications,
      experience,
      status,
      hireDate,
      baseSalary,
      socialInsurance,
      classFee,
      performanceBonus,
      commission,
      dividend,
      campusId: Math.floor(Math.random() * 5) + 1,
      campusName: `校区${Math.floor(Math.random() * 5) + 1}`,
      institutionId: Math.floor(Math.random() * 3) + 1,
      institutionName: `机构${Math.floor(Math.random() * 3) + 1}`,
      salaryEffectiveDate: dayjs().subtract(Math.floor(Math.random() * 365), 'day').format('YYYY-MM-DD'),
    });
  }

  return coaches;
};

// 生成50个模拟教练数据
export const mockCoaches = generateMockCoaches(50); 