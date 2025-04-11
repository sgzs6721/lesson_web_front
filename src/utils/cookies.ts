import Cookies from 'js-cookie';

// 定义cookie过期时间（天）
export const TOKEN_EXPIRY_DAYS = 7;

// 设置token到cookie中
export const setTokenCookie = (token: string) => {
  try {
    console.log('正在设置token到cookie, token值:', token.substring(0, 10) + '...');
    
    // 获取当前域名，用于设置cookie
    const domain = window.location.hostname === 'localhost' ? undefined : window.location.hostname;
    
    const cookieOptions = {
      expires: TOKEN_EXPIRY_DAYS,
      path: '/',
      // 在生产环境可能需要根据域名调整
      domain: domain,
      // 放宽SameSite限制，使其在跨站请求时也能发送
      sameSite: 'lax' as 'lax',
      // 只在HTTPS下启用secure
      secure: window.location.protocol === 'https:'
    };
    
    console.log('Cookie设置选项:', cookieOptions);
    
    // 首先检查cookie是否已经存在
    const existingToken = Cookies.get('token');
    if (existingToken) {
      console.log('Cookie已存在，不重复设置');
      return;
    }
    
    // 尝试使用js-cookie设置
    try {
      Cookies.set('token', token, cookieOptions);
      
      // 检查cookie是否设置成功
      const savedToken = Cookies.get('token');
      if (savedToken) {
        console.log('通过js-cookie设置cookie成功');
        return;
      } else {
        console.log('通过js-cookie设置cookie失败，尝试原生方式');
      }
    } catch (e) {
      console.error('js-cookie设置失败:', e);
    }
    
    // 如果js-cookie设置失败，尝试原生方式
    try {
      document.cookie = `token=${token}; path=/; max-age=${TOKEN_EXPIRY_DAYS * 24 * 60 * 60}; ${window.location.protocol === 'https:' ? 'secure; ' : ''}samesite=lax`;
      console.log('通过原生方式设置cookie完成');
    } catch (e) {
      console.error('原生cookie设置失败:', e);
    }
  } catch (error) {
    console.error('设置cookie时出错:', error);
  }
};

// 从cookie中获取token
export const getTokenCookie = (): string | undefined => {
  try {
    // 首先尝试从js-cookie获取
    const tokenFromJsCookie = Cookies.get('token');
    if (tokenFromJsCookie) {
      return tokenFromJsCookie;
    }
    
    // 备用方式：直接解析document.cookie
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith('token=')) {
        return cookie.substring('token='.length);
      }
    }
    
    return undefined;
  } catch (error) {
    console.error('获取token cookie时出错:', error);
    return undefined;
  }
};

// 从cookie中删除token
export const removeTokenCookie = () => {
  try {
    const domain = window.location.hostname === 'localhost' ? undefined : window.location.hostname;
    
    // 使用js-cookie删除
    Cookies.remove('token', { 
      path: '/', 
      domain: domain 
    });
    
    // 备用方式：设置过期时间为过去的时间点
    document.cookie = `token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
    console.log('Token cookie已删除');
  } catch (error) {
    console.error('删除token cookie时出错:', error);
  }
};

// 清除所有认证相关的cookie
export const clearAuthCookies = () => {
  removeTokenCookie();
  // 如果有其他认证相关cookie，可以在这里一并清除
}; 