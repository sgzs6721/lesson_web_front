// 暂时导出一个空的API对象，实际项目中会逐步实现具体接口
export const API = {
  auth: {
    login: async (data: { username: string; password: string }) => {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (data.username === 'admin' && data.password === 'admin123') {
        return {
          code: 0,
          data: {
            token: 'mock-token',
            user: {
              id: '1',
              username: data.username,
              role: 'admin',
              name: '管理员'
            }
          },
          message: '登录成功'
        };
      }
      throw new Error('用户名或密码错误');
    },
    logout: async () => {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));
      return { code: 0, data: null, message: '退出成功' };
    }
  }
}; 