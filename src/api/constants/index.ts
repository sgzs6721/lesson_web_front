import { request, USE_MOCK } from '../config';
import { Constant } from './types';

// API Path Constants
const CONSTANTS_API_PATHS = {
  LIST: '/lesson/api/constants/list',
  SAVE: '/lesson/api/constants/create',
  UPDATE: '/lesson/api/constants/update',
  DELETE: '/lesson/api/constants/delete',
};

// 模拟数据存储 - 确保所有数组为空
let mockConstants: Record<string, Constant[]> = {
  'COURSE_TYPE': [],
  'PAYMENT_TYPE': [],
  'GIFT_ITEM': [],
  'HANDLING_FEE_TYPE': [],
  'VALIDITY_PERIOD': [],
  'STUDENT_SOURCE': [],
  'EXPEND': [
    { id: 1, constantKey: 'RENT', constantValue: '房租', description: '办公室租赁费用', type: 'EXPEND', status: 1 },
    { id: 2, constantKey: 'SALARY', constantValue: '工资', description: '员工工资支出', type: 'EXPEND', status: 1 },
    { id: 3, constantKey: 'EQUIPMENT', constantValue: '设备', description: '教学设备购买', type: 'EXPEND', status: 1 },
    { id: 4, constantKey: 'MARKETING', constantValue: '市场推广', description: '广告宣传费用', type: 'EXPEND', status: 1 },
  ],
  'INCOME': [
    { id: 5, constantKey: 'TUITION', constantValue: '学费', description: '学员学费收入', type: 'INCOME', status: 1 },
    { id: 6, constantKey: 'TRAINING', constantValue: '培训费', description: '专项培训收入', type: 'INCOME', status: 1 },
    { id: 7, constantKey: 'MATERIAL', constantValue: '教材费', description: '教材销售收入', type: 'INCOME', status: 1 },
    { id: 8, constantKey: 'OTHER', constantValue: '其他收入', description: '其他收入来源', type: 'INCOME', status: 1 },
  ]
};

// 常量相关接口
export const constants = {
  // 获取所有常量列表
  getList: async (): Promise<Constant[]> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      // 合并所有类型的模拟数据
      const allConstants: Constant[] = [];
      Object.entries(mockConstants).forEach(([type, constants]) => {
        allConstants.push(...constants.map(constant => ({ ...constant, type })));
      });
      return allConstants;
    }
    
    try {
      const response = await request(CONSTANTS_API_PATHS.LIST, {
        method: 'GET'
      });
      
      // API成功返回code=200
      if (response && response.code === 200) {
        console.log('获取所有常量列表成功:', response.data);
        return response.data || [];
      } else {
        // 抛出错误，包含API返回的错误信息
        const error = new Error(response.message || '获取所有常量列表失败');
        console.error('获取所有常量列表失败:', error);
        throw error;
      }
    } catch (error) {
      console.error('获取所有常量列表失败:', error);
      throw error; // 重新抛出错误，让调用者处理
    }
  },

  // 按类型获取常量列表
  getListByType: async (type: string): Promise<Constant[]> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockConstants[type] || [];
    }
    
    try {
      const url = `${CONSTANTS_API_PATHS.LIST}?type=${encodeURIComponent(type)}`;
      const response = await request(url, {
        method: 'GET'
      });
      
      if (response && response.code === 200) {
        console.log(`获取${type}类型常量列表成功:`, response.data);
        return response.data || [];
      } else {
        const error = new Error(response.message || `获取${type}类型常量列表失败`);
        console.error(`获取${type}类型常量列表失败:`, error);
        throw error;
      }
    } catch (error) {
      console.error(`获取${type}类型常量列表失败:`, error);
      throw error;
    }
  },
  
    
    // 按多个类型获取常量列表
    getListByTypes: async (types: string[]): Promise<Constant[]> => {
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const allConstants: Constant[] = [];
        types.forEach(type => {
          const typeConstants = mockConstants[type] || [];
          allConstants.push(...typeConstants);
        });
        return allConstants;
      }
      
      try {
        // 构建包含多个type参数的URL
        const typeParams = types.map(type => `type=${encodeURIComponent(type)}`).join('&');
        const url = `${CONSTANTS_API_PATHS.LIST}?${typeParams}`;
        const response = await request(url, {
          method: 'GET'
        });
        
        if (response && response.code === 200) {
          console.log(`获取${types.join(',')}类型常量列表成功:`, response.data);
          return response.data || [];
        } else {
          const error = new Error(response.message || `获取${types.join(',')}类型常量列表失败`);
          console.error(`获取${types.join(',')}类型常量列表失败:`, error);
          throw error;
        }
      } catch (error) {
        console.error(`获取${types.join(',')}类型常量列表失败:`, error);
        throw error;
      }
    },
  // 新增常量
  save: async (constant: Omit<Constant, 'id'>): Promise<Constant | null> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 生成一个新ID
      const newId = Math.max(...(mockConstants[constant.type] || []).map(c => c.id || 0), 0) + 1;
      const newConstant = { ...constant, id: newId };
      
      // 初始化数组（如果不存在）
      if (!mockConstants[constant.type]) {
        mockConstants[constant.type] = [];
      }
      
      // 添加到模拟数据中
      mockConstants[constant.type].push(newConstant);
      
      return newConstant;
    }

    try {
      const response = await request(CONSTANTS_API_PATHS.SAVE, {
        method: 'POST',
        body: JSON.stringify(constant)
      });

      // API成功返回code=200
      if (response && response.code === 200) {
        console.log('新增常量成功:', response.data);
        return response.data;
      } else {
        // 抛出错误，包含API返回的错误信息
        const error = new Error(response.message || '新增常量失败');
        console.error('新增常量失败:', error);
        throw error;
      }
    } catch (error) {
      console.error('新增常量失败:', error);
      throw error; // 重新抛出错误，让调用者处理
    }
  },

  // 更新常量
  update: async (constant: Constant): Promise<boolean> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (!mockConstants[constant.type]) {
        return false;
      }
      
      const index = mockConstants[constant.type].findIndex(c => c.id === constant.id);
      if (index === -1) {
        return false;
      }
      
      mockConstants[constant.type][index] = constant;
      return true;
    }

    try {
      // 创建一个不包含type字段的新对象
      const { type, ...constantWithoutType } = constant;
      
      const response = await request(CONSTANTS_API_PATHS.UPDATE, {
        method: 'POST',
        body: JSON.stringify(constantWithoutType)
      });

      // API成功返回code=200
      if (response && response.code === 200) {
        console.log('更新常量成功:', constant);
        return true;
      } else {
        // 抛出错误，包含API返回的错误信息
        const error = new Error(response.message || '更新常量失败');
        console.error('更新常量失败:', error);
        throw error;
      }
    } catch (error) {
      console.error('更新常量失败:', error);
      throw error; // 重新抛出错误，让调用者处理
    }
  },

  // 删除常量
  delete: async (id: number): Promise<boolean> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 在所有类型中查找并删除
      for (const type in mockConstants) {
        const index = mockConstants[type].findIndex(c => c.id === id);
        if (index !== -1) {
          mockConstants[type].splice(index, 1);
          return true;
        }
      }
      
      return false;
    }

    try {
      const response = await request(`${CONSTANTS_API_PATHS.DELETE}?id=${id}`, {
        method: 'POST'
      });

      // API成功返回code=200
      if (response && response.code === 200) {
        console.log('删除常量成功:', id);
        return true;
      } else {
        // 抛出错误，包含API返回的错误信息
        const error = new Error(response.message || '删除常量失败');
        console.error('删除常量失败:', error);
        throw error;
      }
    } catch (error) {
      console.error('删除常量失败:', error);
      throw error; // 重新抛出错误，让调用者处理
    }
  }
};