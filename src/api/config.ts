import { ApiError } from './types'; // Import ApiError
import { getTokenCookie } from '@/utils/cookies'; // 导入cookie工具

// 是否启用 Mock 数据 - 暂时恢复硬编码以修复 'process is not defined' 错误
// export const USE_MOCK = process.env.NODE_ENV === 'development';
export const USE_MOCK = false; // 恢复为 false (或 true 如果你需要 MOCK)

// API 基础 URL 配置 - 暂时恢复硬编码
// export const API_HOST = process.env.REACT_APP_API_HOST || 'http://localhost:8080';
export const API_HOST = 'http://lesson.devtesting.top'; // 更新为指定的 API 地址

// 请求超时时间（毫秒）
export const API_TIMEOUT = 30000; // 将超时时间增加到30秒

// 默认请求头
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
};

// 请求拦截器
export const requestInterceptor = (config: RequestInit) => {
  try {
    // 首先从cookie中获取token，如果没有则从localStorage获取
    const tokenFromCookie = getTokenCookie();
    const tokenFromStorage = localStorage.getItem('token');
    const token = tokenFromCookie || tokenFromStorage;
    
    console.log('请求拦截器:', token ? `找到token, 值: ${token.substring(0, 10)}...` : '未找到token');
    
    // 如果有 token，添加到请求头
    if (token) {
      console.log('为请求添加Authorization头');
      return {
        ...config,
        headers: {
          ...config.headers,
          'Authorization': token
        }
      };
    }
  } catch (error) {
    console.error('请求拦截器出错:', error);
  }
  
  return config;
};

// 响应拦截器
export const responseInterceptor = async (response: Response) => {
  // 如果响应状态码不是 2xx
  if (!response.ok) {
    let errorData: any = {};
    try {
      // 尝试解析 JSON 错误体
      errorData = await response.json();
    } catch (e) {
      // 如果解析失败，至少保留状态文本
      errorData.message = response.statusText || 'HTTP Error';
    }
    // 抛出自定义 ApiError，包含 HTTP 状态码和后端返回的错误信息（如果有）
    throw new ApiError(
      errorData.message || `请求失败: ${response.status}`,
      response.status, // 使用 HTTP status 作为 code
      errorData // 将整个错误体作为附加数据
    );
  }
  
  // 如果响应成功，直接返回 response 对象，让后续处理
  return response;
};

// 统一的请求函数
export const request = async (url: string, options: RequestInit = {}) => {
  // 合并默认配置和自定义配置
  const config = {
    ...options,
    headers: {
      ...DEFAULT_HEADERS,
      ...options.headers
    }
  };
  
  // 应用请求拦截器
  const interceptedConfig = requestInterceptor(config);
  
  // 设置超时
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
  
  try {
    // 发送请求
    console.log(`正在请求API: ${url}`);
    const startTime = Date.now();
    const response = await fetch(url, {
      ...interceptedConfig,
      signal: controller.signal
    });
    const endTime = Date.now();
    console.log(`API响应时间: ${endTime - startTime}ms`);
    
    // 应用响应拦截器 (现在它只在 !response.ok 时抛出 ApiError)
    await responseInterceptor(response); // 注意：这里不再接收返回值，只用于检查和抛错
    
    // 解析 JSON (如果上面没抛错，说明 response.ok 是 true)
    const data = await response.json();
    console.log(`API返回数据:`, data);
    
    // 检查业务状态码
    // 假设后端接口成功时 code 为 0 或 200，非 0/200 表示业务错误
    if (data.code !== 0 && data.code !== 200) {
      // 抛出 ApiError，包含业务错误码和消息
      console.error(`业务错误: code=${data.code}, message=${data.message}`);
      throw new ApiError(
        data.message || '业务处理失败', 
        data.code, // 使用业务 code
        data.data // 可能包含的额外业务数据
      );
    }
    
    // 如果一切正常，返回完整响应对象
    return data; // 返回完整的响应对象，包含 code, message, data
  } catch (error: any) {
    // 清理超时计时器
    clearTimeout(timeoutId);
    
    // 如果错误已经是 ApiError，直接重新抛出
    if (error instanceof ApiError) {
      console.error(`API错误: ${error.message}, code=${error.code}`);
      throw error;
    }
    
    // 处理 AbortError (超时)
    if (error.name === 'AbortError') {
      console.error(`API请求超时: ${url}`);
      throw new ApiError(`请求超时(${API_TIMEOUT}ms)，请稍后再试或检查网络连接`, -1); // 使用 -1 作为网络/超时错误的 code
    }
    
    // 处理其他网络错误或未知错误
    console.error(`网络请求失败: ${error.message || '未知错误'}`, error);
    throw new ApiError(error.message || '网络请求失败，请检查网络连接', -2); // 使用 -2 作为其他网络错误的 code
  }
};
