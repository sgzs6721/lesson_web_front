import { Constant } from './types';
import { request } from '../config';

// 简单的内存缓存（页面级共享，刷新后失效）
const constantsCache: Record<string, Constant[] | undefined> = {};
const inflightRequests: Record<string, Promise<Constant[]> | undefined> = {};

// API Path Constants
const CONSTANTS_API_PATHS = {
  LIST: '/lesson/api/constants/list',
  SAVE: '/lesson/api/constants/save',
  UPDATE: '/lesson/api/constants/update',
  DELETE: '/lesson/api/constants/delete'
};

// 工具：清空缓存（按类型或全部）
const clearCache = (type?: string) => {
  if (type) {
    delete constantsCache[type];
    delete inflightRequests[type];
  } else {
    Object.keys(constantsCache).forEach(k => delete constantsCache[k]);
    Object.keys(inflightRequests).forEach(k => delete inflightRequests[k]);
  }
};

// 常量管理相关接口
export const constants = {
  // 按类型获取常量列表（带内存缓存）
  getListByType: async (type: string): Promise<Constant[]> => {
    try {
      // 命中缓存：直接返回，避免重复HTTP请求
      if (constantsCache[type]) {
        return constantsCache[type] as Constant[];
      }
      // 正在请求：复用同一个Promise，避免并发重复请求
      if (inflightRequests[type]) {
        return inflightRequests[type] as Promise<Constant[]>;
      }

      const url = `${CONSTANTS_API_PATHS.LIST}?type=${encodeURIComponent(type)}`;
      const req = request(url, { method: 'GET' })
        .then(response => {
          if (response && response.code === 200) {
            const data: Constant[] = response.data || [];
            constantsCache[type] = data; // 写入缓存
            return data;
          }
          const error = new Error(response?.message || `获取${type}类型常量列表失败`);
          throw error;
        })
        .finally(() => {
          // 清理inflight占位
          delete inflightRequests[type];
        });

      inflightRequests[type] = req;
      return req;
    } catch (error) {
      console.error(`获取${type}类型常量列表失败:`, error);
      throw error;
    }
  },
  
  // 按多个类型获取常量列表（保持原实现，不做缓存合并，避免引入行为变化）
  getListByTypes: async (types: string[]): Promise<Constant[]> => {
    try {
      const typeParams = types.map(type => `types=${encodeURIComponent(type)}`).join('&');
      const url = `${CONSTANTS_API_PATHS.LIST}?${typeParams}`;
      const response = await request(url, {
        method: 'GET'
      });
      
      if (response && response.code === 200) {
        return response.data || [];
      } else {
        const error = new Error(response.message || '获取多类型常量列表失败');
        throw error;
      }
    } catch (error) {
      console.error('获取多类型常量列表失败:', error);
      throw error;
    }
  },

  // 新增常量（成功后清理缓存）
  save: async (constant: Omit<Constant, 'id'>): Promise<Constant | null> => {
    try {
      const response = await request(CONSTANTS_API_PATHS.SAVE, {
        method: 'POST',
        body: JSON.stringify(constant)
      });

      if (response && response.code === 200) {
        clearCache(constant.type); // 变更对应type缓存
        return response.data;
      } else {
        const error = new Error(response.message || '新增常量失败');
        throw error;
      }
    } catch (error) {
      console.error('新增常量失败:', error);
      throw error;
    }
  },

  // 更新常量（成功后清理缓存）
  update: async (constant: Constant): Promise<boolean> => {
    try {
      // 创建一个不包含type字段的新对象
      const { type, ...constantWithoutType } = constant;
      
      const response = await request(CONSTANTS_API_PATHS.UPDATE, {
        method: 'POST',
        body: JSON.stringify(constantWithoutType)
      });

      if (response && response.code === 200) {
        clearCache(type); // 清除该类型缓存
        return true;
      } else {
        const error = new Error(response.message || '更新常量失败');
        throw error;
      }
    } catch (error) {
      console.error('更新常量失败:', error);
      throw error;
    }
  },

  // 删除常量（成功后清理全部缓存，避免遗漏）
  delete: async (id: number): Promise<boolean> => {
    try {
      const response = await request(`${CONSTANTS_API_PATHS.DELETE}?id=${id}`, {
        method: 'POST'
      });

      if (response && response.code === 200) {
        clearCache(); // 不知道属于哪个type，全部清理
        return true;
      } else {
        const error = new Error(response.message || '删除常量失败');
        throw error;
      }
    } catch (error) {
      console.error('删除常量失败:', error);
      throw error;
    }
  }
};