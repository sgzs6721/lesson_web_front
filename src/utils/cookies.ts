import Cookies from 'js-cookie';

// 定义cookie过期时间（天）
export const TOKEN_EXPIRY_DAYS = 7;

// 设置token到cookie中
export const setTokenCookie = (token: string) => {
  Cookies.set('token', token, { 
    expires: TOKEN_EXPIRY_DAYS, 
    path: '/',
    sameSite: 'strict',
    secure: window.location.protocol === 'https:'
  });
};

// 从cookie中获取token
export const getTokenCookie = (): string | undefined => {
  return Cookies.get('token');
};

// 从cookie中删除token
export const removeTokenCookie = () => {
  Cookies.remove('token', { path: '/' });
};

// 清除所有认证相关的cookie
export const clearAuthCookies = () => {
  removeTokenCookie();
  // 如果有其他认证相关cookie，可以在这里一并清除
}; 