import { Constant } from './types';
import { request } from '../config';

// API Path Constants
const CONSTANTS_API_PATHS = {
  LIST: '/lesson/api/constants/list',
  SAVE: '/lesson/api/constants/save',
  UPDATE: '/lesson/api/constants/update',
  DELETE: '/lesson/api/constants/delete'
};

// 常量管理相关接口
export const constants = {
  // 按类型获取常量列表
  getListByType: async (type: string): Promise<Constant[]> => {
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
    try {
      const typeParams = types.map(type => `types=${encodeURIComponent(type)}`).join('&');
      const url = `${CONSTANTS_API_PATHS.LIST}?${typeParams}`;
      const response = await request(url, {
        method: 'GET'
      });
      
      if (response && response.code === 200) {
        console.log('获取多类型常量列表成功:', response.data);
        return response.data || [];
      } else {
        const error = new Error(response.message || '获取多类型常量列表失败');
        console.error('获取多类型常量列表失败:', error);
        throw error;
      }
    } catch (error) {
      console.error('获取多类型常量列表失败:', error);
      throw error;
    }
  },

  // 新增常量
  save: async (constant: Omit<Constant, 'id'>): Promise<Constant | null> => {
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