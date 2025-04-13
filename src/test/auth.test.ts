// 测试文件，用于验证认证流程

import { API } from '../api';
import { getTokenCookie } from '../utils/cookies';

/**
 * 测试登录流程
 */
async function testLogin() {
  console.log('开始测试登录流程...');
  
  try {
    // 1. 测试登录
    const loginResponse = await API.auth.login({
      phone: '13800138000',
      password: 'password123'
    });
    
    console.log('登录响应:', loginResponse);
    
    if (loginResponse.code !== 200) {
      console.error('登录失败:', loginResponse.message);
      return;
    }
    
    console.log('登录成功，获取到token:', loginResponse.data.token);
    
    // 2. 验证cookie是否设置成功
    const tokenCookie = getTokenCookie();
    console.log('Cookie中的token:', tokenCookie);
    
    if (!tokenCookie) {
      console.error('Cookie设置失败');
      return;
    }
    
    // 3. 测试校区列表API
    console.log('测试校区列表API...');
    const campusResponse = await API.campus.getList();
    console.log('校区列表响应:', campusResponse);
    
    // 4. 测试创建校区
    if (!campusResponse || campusResponse.total === 0) {
      console.log('无校区，测试创建校区...');
      const createResponse = await API.campus.create({
        name: '测试校区',
        address: '测试地址',
        phone: '13800138001',
        contactPerson: '测试联系人',
        status: 'open'
      });
      
      console.log('创建校区响应:', createResponse);
      
      // 5. 再次获取校区列表
      console.log('再次获取校区列表...');
      const newCampusResponse = await API.campus.getList();
      console.log('新校区列表响应:', newCampusResponse);
    }
    
    console.log('测试完成');
  } catch (error) {
    console.error('测试过程中出错:', error);
  }
}

// 执行测试
testLogin();

export {};
