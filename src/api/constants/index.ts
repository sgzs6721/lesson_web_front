import { Constant, ConstantListResponse } from './types';
import { request, USE_MOCK } from '../config';

// API Path Constants
const CONSTANTS_API_PATHS = {
  LIST: '/lesson/api/constants/list',
};

// 模拟课程类型数据
const mockCourseTypes: Constant[] = [
  { id: 11, constantKey: 'ONE_TO_TWO', constantValue: '一对二', description: '一对二课程类型', type: 'COURSE_TYPE', status: 1 },
  { id: 12, constantKey: 'ONE_TO_ONE', constantValue: '一对一', description: '一对一课程类型', type: 'COURSE_TYPE', status: 1 },
  { id: 13, constantKey: 'GROUP', constantValue: '大课', description: '团体课程类型', type: 'COURSE_TYPE', status: 1 },
];

// 常量相关接口
export const constants = {
  // 获取常量列表
  getList: async (type: string): Promise<Constant[]> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));

      // 根据类型返回不同的模拟数据
      if (type === 'COURSE_TYPE') {
        return mockCourseTypes;
      }

      return [];
    }

    try {
      // 构建查询参数
      const queryParams = new URLSearchParams();
      queryParams.append('type', type);

      const queryString = `?${queryParams.toString()}`;
      const response: ConstantListResponse = await request(`${CONSTANTS_API_PATHS.LIST}${queryString}`);

      console.log(`获取常量列表成功，类型: ${type}`, response.data);
      return response.data;
    } catch (error) {
      console.error(`获取常量列表失败，类型: ${type}`, error);
      return [];
    }
  }
};
