import {
  StudentDTO,
  ClassRecord,
  PaymentRecord,
  StudentSearchParams,
  CreateStudentRequest,
  UpdateStudentRequest,
  ScheduleTime,
  // Import Attendance types
  AttendanceListParams,
  AttendanceRecordDTO,
  AttendanceListResponseData,
  AttendanceListApiResponse
} from './types';
// 导入前端 UI 使用的 Student 类型
import { Student } from '@/pages/student/types/student';
import { ApiResponse, PaginationParams, PaginatedResponse } from '../types';
import { mockApiResponse, mockStudents, mockClassRecords, mockPaymentRecords, mockPaginatedResponse } from './mock';

// Import shared config
import { request, USE_MOCK, API_HOST } from '../config';
import { SimpleCourse } from '../course/types';

// API Path Constants
const STUDENT_API_PATHS = {
  LIST: '/lesson/api/student/list',
  DETAIL: (id: string) => `/lesson/api/student/${id}`,
  ADD: '/lesson/api/student/add',
  UPDATE: (id: string) => `/lesson/api/student/update/${id}`,
  DELETE: (id: string) => `/lesson/api/student/delete/${id}`,
  CLASS_RECORDS: (studentId: string) => `/lesson/api/student/${studentId}/class-records`,
  PAYMENT_RECORDS: (studentId: string) => `/lesson/api/student/${studentId}/payment-records`,
  PAYMENT: '/lesson/api/student/payment',
};

// 修正 API 路径
const STUDENT_CREATE_WITH_COURSE_PATH = '/lesson/api/student/create';
const STUDENT_UPDATE_WITH_COURSE_PATH = '/lesson/api/student/update';

// 将API返回的StudentDTO转换为前端使用的Student对象
const convertDtoToStudent = (dto: StudentDTO): Student => {
  // 处理固定排课时间
  let scheduleTimes: ScheduleTime[] = [];
  if (dto.fixedSchedule) {
    try {
      // 尝试解析fixedSchedule字段
      const parsedSchedule = JSON.parse(dto.fixedSchedule);
      if (Array.isArray(parsedSchedule)) {
        scheduleTimes = parsedSchedule.map(item => ({
          weekday: item.weekday,
          time: item.from,
          endTime: item.to
        }));
        console.log('解析固定排课时间成功:', scheduleTimes);
      }
    } catch (error) {
      console.error('解析固定排课时间失败:', error, dto.fixedSchedule);
    }
  }

  // 处理新的API响应结构
  return {
    id: (dto.studentId?.toString() || dto.id || '0'), // 兼容新的API响应结构
    studentId: dto.studentId, // 新增字段，用于表格的rowKey
    name: (dto.studentName || dto.name || ''),
    gender: (dto.studentGender || dto.gender || 'MALE') as 'MALE' | 'FEMALE',
    age: (dto.studentAge || dto.age || 0),
    phone: (dto.studentPhone || dto.phone || ''),
    email: dto.email,
    address: dto.address,
    parentName: dto.parentName,
    parentPhone: dto.parentPhone,
    courseType: dto.courseType || dto.courseTypeName || '',
    course: dto.courseName || '',
    coach: dto.coachName || '',
    lastClassDate: dto.lastClassTime || dto.lastClassDate || '',
    enrollDate: (dto.enrollmentDate || dto.enrollDate || ''),
    expireDate: dto.endDate || dto.expireDate || '',
    remainingClasses: dto.remainingHours?.toString() || dto.remainingClasses?.toString() || '0',
    status: (dto.status || 'normal') as 'normal' | 'expired' | 'graduated' | 'STUDYING',
    campusId: (dto.campusId || 0),
    campusName: dto.campusName,
    createdTime: dto.createdTime,
    updatedTime: dto.updatedTime,
    // 新增字段
    totalHours: dto.totalHours,
    consumedHours: dto.consumedHours,
    courseId: typeof dto.courseId === 'string' ? parseInt(dto.courseId) : dto.courseId,
    coachId: typeof dto.coachId === 'string' ? parseInt(dto.coachId) : dto.coachId,
    institutionId: dto.institutionId,
    institutionName: dto.institutionName,
    // 添加固定排课时间
    scheduleTimes: scheduleTimes,
    // 新增：映射 courses 字段
    courses: dto.courses ? dto.courses.map(courseDto => ({
      ...courseDto, // 直接复制 DTO 的所有字段
      // 如果 CourseInfo 和 CourseInfoDTO 结构完全一致，这里不需要额外转换
      // 如果有差异，需要在这里进行字段映射
    })) : [] // 如果 dto.courses 不存在，则返回空数组
  };
};

// 将前端Student对象转换为API所需的CreateStudentRequest
const convertStudentToCreateRequest = (student: Omit<Student, 'id'>): CreateStudentRequest => {
  return {
    name: student.name,
    gender: student.gender,
    age: student.age,
    phone: student.phone,
    email: student.email,
    address: student.address,
    parentName: student.parentName,
    parentPhone: student.parentPhone,
    courseId: typeof student.course === 'string' ? student.course : student.course?.[0],
    coachId: student.coach,
    enrollDate: student.enrollDate,
    expireDate: student.expireDate,
    remainingClasses: student.remainingClasses ? parseInt(student.remainingClasses) : 0,
    status: student.status,
    campusId: student.campusId
  };
};

// 将前端Student对象转换为API所需的UpdateStudentRequest
const convertStudentToUpdateRequest = (student: Partial<Student>): UpdateStudentRequest => {
  const request: UpdateStudentRequest = {};

  if (student.name !== undefined) request.name = student.name;
  if (student.gender !== undefined) request.gender = student.gender;
  if (student.age !== undefined) request.age = student.age;
  if (student.phone !== undefined) request.phone = student.phone;
  if (student.email !== undefined) request.email = student.email;
  if (student.address !== undefined) request.address = student.address;
  if (student.parentName !== undefined) request.parentName = student.parentName;
  if (student.parentPhone !== undefined) request.parentPhone = student.parentPhone;
  if (student.course !== undefined) {
    request.courseId = typeof student.course === 'string' ? student.course : student.course?.[0];
  }
  if (student.coach !== undefined) request.coachId = student.coach;
  if (student.enrollDate !== undefined) request.enrollDate = student.enrollDate;
  if (student.expireDate !== undefined) request.expireDate = student.expireDate;
  if (student.remainingClasses !== undefined) {
    request.remainingClasses = parseInt(student.remainingClasses);
  }
  if (student.status !== undefined) request.status = student.status;
  if (student.campusId !== undefined) request.campusId = student.campusId;

  return request;
};

// 构建查询参数字符串
const buildQueryString = (params: StudentSearchParams): string => {
  const queryParams: string[] = [];

  if (params.keyword) queryParams.push(`keyword=${encodeURIComponent(params.keyword)}`);
  if (params.status) queryParams.push(`status=${params.status}`);
  if (params.courseId) queryParams.push(`courseId=${params.courseId}`);
  if (params.coachId) queryParams.push(`coachId=${params.coachId}`);
  if (params.campusId) queryParams.push(`campusId=${params.campusId}`);
  if (params.enrollDateStart) queryParams.push(`enrollDateStart=${params.enrollDateStart}`);
  if (params.enrollDateEnd) queryParams.push(`enrollDateEnd=${params.enrollDateEnd}`);
  if (params.page) queryParams.push(`page=${params.page}`);
  if (params.pageSize) queryParams.push(`pageSize=${params.pageSize}`);
  if (params.sortField) queryParams.push(`sortField=${params.sortField}`);
  if (params.sortOrder) queryParams.push(`sortOrder=${params.sortOrder}`);

  return queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
};

// 学生相关接口
export const student = {
  // 获取学生列表
  getList: async (params?: StudentSearchParams): Promise<PaginatedResponse<Student>> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const { page = 1, pageSize = 10 } = params || {};
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const list = mockStudents.slice(start, end);
      const response = mockPaginatedResponse(list, page, pageSize, mockStudents.length);
      return response.data;
    }

    const queryString = params ? buildQueryString(params) : '';
    const response = await request(`${STUDENT_API_PATHS.LIST}${queryString}`);

    console.log('Student list API response:', response);

    // 转换DTO到前端模型
    if (response.code === 200 && response.data) {
      return {
        total: response.data.total || 0,
        pageNum: response.data.pageNum || 1,
        pageSize: response.data.pageSize || 10,
        pages: response.data.pages || 1,
        list: Array.isArray(response.data.list) ? response.data.list.map(convertDtoToStudent) : []
      };
    } else {
      console.error('Invalid response format from student/list API:', response);
      return {
        total: 0,
        pageNum: 1,
        pageSize: 10,
        pages: 0,
        list: []
      };
    }
  },

  // 获取学生详情
  getDetail: async (id: string): Promise<Student> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const student = mockStudents.find(s => s.id === id);
      if (!student) { throw new Error('学生不存在'); }
      return student;
    }

    const response = await request(`${STUDENT_API_PATHS.DETAIL(id)}`);
    return convertDtoToStudent(response.data);
  },

  // 添加学生
  add: async (data: Omit<Student, 'id'>): Promise<Student> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newStudent: Student = { ...data, id: String(mockStudents.length + 1) };
      mockStudents.push(newStudent);
      return newStudent;
    }

    const createRequest = convertStudentToCreateRequest(data);
    const response = await request(`${STUDENT_API_PATHS.ADD}`, {
      method: 'POST',
      body: JSON.stringify(createRequest)
    });

    return convertDtoToStudent(response.data);
  },

  // 创建学员及课程
  createWithCourse: async (payload: { studentInfo: any; courseInfo: any }): Promise<Student> => {
    if (!payload.studentInfo || !payload.courseInfo) {
      throw new Error('创建学员失败：请求参数不完整');
    }

    console.log('创建学员，请求数据:', JSON.stringify(payload, null, 2));

    const response = await request(STUDENT_CREATE_WITH_COURSE_PATH, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    console.log('学员创建API响应:', response);

    // 处理响应
    if (response.code === 200) {
      // 返回学员数据
      if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
        return convertDtoToStudent(response.data);
      }
      // 如果只返回ID
      else if (response.data && (typeof response.data === 'number' || typeof response.data === 'string')) {
        // 创建基本学员对象
        const studentId = typeof response.data === 'string' ? parseInt(response.data) : response.data;

        // 直接使用请求中的课程信息，不再调用课程接口
        let courseName = '';
        let courseTypeName = '大课'; // 默认值
        let coachName = '';

        // 从请求中获取教练信息
        const coachNameFromRequest = payload.courseInfo.coachName || '';

        return {
          id: studentId.toString(),
          studentId: studentId,
          name: payload.studentInfo.name,
          gender: payload.studentInfo.gender,
          age: payload.studentInfo.age,
          phone: payload.studentInfo.phone,
          course: courseName || payload.courseInfo.courseId?.toString() || '',
          courseType: courseTypeName,
          coach: coachNameFromRequest || coachName || '', // 优先使用请求中的教练名称
          enrollDate: payload.courseInfo.startDate || '',
          expireDate: payload.courseInfo.endDate || '',
          remainingClasses: '0', // 默认为0
          status: 'STUDYING', // 使用后端的状态格式：STUDYING-在学
          campusId: payload.studentInfo.campusId || 1,
          createdTime: new Date().toISOString() // 添加创建时间以便排序
        } as Student;
      }
    }

    throw new Error(`创建学员失败: ${response.message || '未知错误'}`);
  },

  // 更新学员及课程
  updateWithCourse: async (payload: { studentId: number; courseId: number; studentInfo: any; courseInfo: any }): Promise<void> => {
    try {
      // 验证payload结构
      if (!payload) {
        throw new Error('更新学员失败：请求参数为空');
      }

      // 确保必要的字段存在且有效
      if (payload.studentId === undefined || isNaN(Number(payload.studentId)) || Number(payload.studentId) <= 0) {
        throw new Error('更新学员失败：无效的学员ID');
      }

      if (payload.courseId === undefined || isNaN(Number(payload.courseId)) || Number(payload.courseId) <= 0) {
        throw new Error('更新学员失败：无效的课程ID');
      }

      if (!payload.studentInfo) {
        throw new Error('更新学员失败：缺少学员信息');
      }

      if (!payload.courseInfo) {
        throw new Error('更新学员失败：缺少课程信息');
      }

      // 确保courseInfo中也有courseId字段，与外层保持一致
      payload.courseInfo.courseId = payload.courseId;

      console.log('更新学员信息，请求数据:', JSON.stringify(payload, null, 2));

      const response = await request(STUDENT_UPDATE_WITH_COURSE_PATH, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      console.log('学员更新API响应:', response);

      if (response.code !== 200) {
        throw new Error(`更新学员失败: ${response.message || '未知错误'}`);
      }
    } catch (error) {
      console.error('更新学员失败:', error);
      throw error;
    }
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

    const updateRequest = convertStudentToUpdateRequest(data);
    const response = await request(`${STUDENT_API_PATHS.UPDATE(id)}`, {
      method: 'POST',
      body: JSON.stringify(updateRequest)
    });

    return convertDtoToStudent(response.data);
  },

  // 删除学生
  delete: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const index = mockStudents.findIndex(s => s.id === id);
      if (index === -1) { throw new Error('学生不存在'); }
      mockStudents.splice(index, 1);
      return;
    }

    await request(`${STUDENT_API_PATHS.DELETE(id)}`, {
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

    const response = await request(`${STUDENT_API_PATHS.CLASS_RECORDS(studentId)}`);
    return response.data;
  },

  // 获取学生缴费记录
  getPaymentRecords: async (studentId: string): Promise<PaymentRecord[]> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 700));
      const records = mockPaymentRecords[studentId] || [];
      return records;
    }

    const response = await request(`${STUDENT_API_PATHS.PAYMENT_RECORDS(studentId)}`);
    return response.data;
  },

  // 添加学生缴费记录
  addPayment: async (paymentData: {
    studentId: number;
    courseId: number;
    paymentType: string;
    amount: number;
    paymentMethod: string;
    transactionDate: string;
    courseHours: number;
    giftHours: number;
    validUntil: string;
    giftItems?: string;
    notes?: string;
  }): Promise<any> => {
    console.log('添加缴费记录，请求数据:', JSON.stringify(paymentData, null, 2));

    const response = await request(STUDENT_API_PATHS.PAYMENT, {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });

    console.log('缴费API响应:', response);
    return response.data;
  },

  // 新增：获取学员打卡记录列表
  getAttendanceList: async (params: AttendanceListParams): Promise<AttendanceListResponseData> => {
    const ATTENDANCE_LIST_PATH = '/lesson/api/student/attendance-list';
    // MOCK data can be added here if needed
    if (USE_MOCK) {
        console.warn('Mock data for getAttendanceList not implemented yet.');
        return { list: [], total: 0, pageNum: 1, pageSize: 10, pages: 0 }; 
    }
    
    // 从 localStorage 获取 campusId，如果 params 中没有提供
    const campusId = params.campusId || Number(localStorage.getItem('currentCampusId'));
    if (!campusId) {
      console.error('获取打卡记录失败: 缺少校区 ID');
      throw new Error('缺少校区 ID');
    }
    
    const requestBody = {
      ...params,
      campusId: campusId
    };

    console.log('请求打卡记录列表，参数:', JSON.stringify(requestBody, null, 2));

    const response: AttendanceListApiResponse = await request(ATTENDANCE_LIST_PATH, {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });

    console.log('打卡记录列表 API 响应:', response);

    if (response.code === 200 && response.data) {
      // API 返回的数据结构已经是 PaginatedResponse<AttendanceRecordDTO>
      return response.data; 
    } else {
      console.error('获取打卡记录列表失败:', response.message);
      throw new Error(response.message || '获取打卡记录列表失败');
    }
  }
};
