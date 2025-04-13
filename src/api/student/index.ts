import { Student, ClassRecord, PaymentRecord } from './types';
// Import shared types from the new central file
import { ApiResponse, PaginationParams, PaginatedResponse } from '../types';
import { mockApiResponse, mockStudents, mockClassRecords, mockPaymentRecords, mockPaginatedResponse } from './mock';

// Import shared config
import { request, USE_MOCK } from '../config';

// API Path Constants
const STUDENT_API_PATHS = {
  LIST: '/lesson/api/students',
  DETAIL: (id: string) => `/lesson/api/students/${id}`,
  ADD: '/lesson/api/students',
  UPDATE: (id: string) => `/lesson/api/students/${id}`,
  DELETE: (id: string) => `/lesson/api/students/${id}`,
  CLASS_RECORDS: (studentId: string) => `/lesson/api/students/${studentId}/class-records`,
  PAYMENT_RECORDS: (studentId: string) => `/lesson/api/students/${studentId}/payment-records`,
};

// 学生相关接口
export const student = {
  // 获取学生列表
  getList: async (params?: PaginationParams): Promise<PaginatedResponse<Student>> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const { page = 1, pageSize = 10 } = params || {};
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const list = mockStudents.slice(start, end);
      const response = mockPaginatedResponse(list, page, pageSize, mockStudents.length);
      return response.data;
    }
    const queryParams = params ? `?page=${params.page}&pageSize=${params.pageSize}` : '';
    return request(`${STUDENT_API_PATHS.LIST}${queryParams}`);
  },

  // 获取学生详情
  getDetail: async (id: string): Promise<Student> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const student = mockStudents.find(s => s.id === id);
      if (!student) { throw new Error('学生不存在'); }
      return student;
    }
    return request(`${STUDENT_API_PATHS.DETAIL(id)}`);
  },

  // 添加学生
  add: async (data: Omit<Student, 'id'>): Promise<Student> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newStudent: Student = { ...data, id: String(mockStudents.length + 1) };
      mockStudents.push(newStudent);
      return newStudent;
    }
    return request(`${STUDENT_API_PATHS.ADD}`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // 更新学生
  update: async (id: string, data: Partial<Student>): Promise<Student> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const index = mockStudents.findIndex(s => s.id === id);
      if (index === -1) { throw new Error('学生不存在'); }
      const updatedStudent = { ...mockStudents[index], ...data };
      mockStudents[index] = updatedStudent;
      return updatedStudent;
    }
    return request(`${STUDENT_API_PATHS.UPDATE(id)}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  // 删除学生
  delete: async (id: string): Promise<null> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const index = mockStudents.findIndex(s => s.id === id);
      if (index === -1) { throw new Error('学生不存在'); }
      mockStudents.splice(index, 1);
      return null;
    }
    return request(`${STUDENT_API_PATHS.DELETE(id)}`, {
      method: 'DELETE'
    });
  },

  // 获取学生课程记录
  getClassRecords: async (studentId: string): Promise<ClassRecord[]> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 700));
      const records = mockClassRecords[studentId] || [];
      return records;
    }
    return request(`${STUDENT_API_PATHS.CLASS_RECORDS(studentId)}`);
  },

  // 获取学生缴费记录
  getPaymentRecords: async (studentId: string): Promise<PaymentRecord[]> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 700));
      const records = mockPaymentRecords[studentId] || [];
      return records;
    }
    return request(`${STUDENT_API_PATHS.PAYMENT_RECORDS(studentId)}`);
  }
};
