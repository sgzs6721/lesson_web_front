import {
  StudentDTO,
  ClassRecord,
  PaymentRecord,
  StudentSearchParams,
  CreateStudentRequest,
  UpdateStudentRequest,
  ScheduleTime,
  Student as ApiStudent,
  // Import Attendance types
  AttendanceListParams,
  AttendanceRecordDTO,
  AttendanceListResponseData,
  AttendanceListApiResponse,
  // Import Refund types
  RefundRequest,
  RefundResponse
} from './types';
// 导入前端 UI 使用的 Student 类型
import { Student } from '@/pages/student/types/student';
import { ApiResponse, PaginationParams, PaginatedResponse } from '../types';
// 修改导入，确保使用正确类型
// Import shared config
import { request, API_HOST } from '../config';
import { SimpleCourse } from '../course/types';
import { message } from 'antd';

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
  REFUND: '/lesson/api/student/refund',
  TRANSFER_WITHIN_COURSE: '/lesson/api/student/transfer-within-course',
  TRANSFER_COURSE: '/lesson/api/student/transfer-course',
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
    status: ((): 'normal' | 'expired' | 'graduated' | 'STUDYING' => {
      const raw = String(dto.status || '').trim();
      const upper = raw.toUpperCase();
      // 统一到前端可识别的四种展示态（不影响查询枚举）
      if (upper.includes('STUDYING') || upper === 'NORMAL' || raw === '学习中') return 'STUDYING';
      if (upper.includes('EXPIRED') || raw === '过期') return 'expired';
      if (upper.includes('GRADUATED') || raw === '结业') return 'graduated';
      if (upper.includes('REFUND') || raw === '已退费') return 'expired';
      if (upper.includes('WAITING_RENEWAL') || raw === '待续费') return 'expired';
      if (upper.includes('WAITING_PAYMENT') || raw === '待缴费') return 'expired';
      return 'STUDYING';
    })(),
    campusId: (dto.campusId || 0),
    campusName: dto.campusName,
    sourceId: (dto as any).sourceId, // 学员来源ID（来自列表/详情接口）
    // 可选：如果需要显示来源名称，可在UI层扩展类型再使用
    // sourceName: (dto as any).sourceName,
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
      ...courseDto,
    })) : []
  } as Student; // 使用类型断言解决类型兼容问题
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
    campusId: student.campusId
  } as CreateStudentRequest;
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
  if (params.pageNum) queryParams.push(`pageNum=${params.pageNum}`);
  if (params.pageSize) queryParams.push(`pageSize=${params.pageSize}`);
  if (params.sortField) queryParams.push(`sortField=${params.sortField}`);
  if (params.sortOrder) queryParams.push(`sortOrder=${params.sortOrder}`);

  return queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
};

// 学生相关接口
// 转课请求接口
interface TransferCourseRequest {
  studentId: number;
  targetStudentId: number;
  courseId: number;
  targetCourseId: number;
  transferHours: number;
  validUntil?: string;
  validityPeriod?: number;
  compensationFee?: number;
  transferCause: string;
  campusId?: number;
}

// 转班请求接口
interface TransferWithinCourseRequest {
  studentId: number;
  courseId?: number;
  sourceCourseId: number;
  targetCourseId: number;
  transferHours: number;
  validityPeriod?: number;
  compensationFee?: number;
  transferCause: string;
  campusId?: number;
}

export const student = {
  // 转课API
  transferCourse: async (data: TransferCourseRequest): Promise<any> => {
    console.log('调用转课API，请求数据:', data);

    try {
      const response = await request(STUDENT_API_PATHS.TRANSFER_COURSE, {
        method: 'POST',
        body: JSON.stringify(data)
      });

      console.log('转课API响应:', response);
      message.success('转课成功');
      return response;
    } catch (error) {
      console.error('转课API调用失败:', error);
      message.error('转课失败: ' + (error instanceof Error ? error.message : '未知错误'));
      throw error;
    }
  },

  // 转班API
  transferWithinCourse: async (data: TransferWithinCourseRequest): Promise<any> => {
    console.log('调用转班API，请求数据:', data);

    try {
      const response = await request(STUDENT_API_PATHS.TRANSFER_WITHIN_COURSE, {
        method: 'POST',
        body: JSON.stringify(data)
      });

      console.log('转班API响应:', response);
      return response;
    } catch (error) {
      console.error('转班API调用失败:', error);
      throw error;
    }
  },

  // 获取学生列表
  getList: async (params?: StudentSearchParams): Promise<PaginatedResponse<Student>> => {

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

    try {
      console.log(`获取学生详情，学生ID: ${id}`);

      const response = await request(`/lesson/api/student/detail?id=${id}`, {
        method: 'GET'
      });

      console.log('学生详情API响应:', response);

      if (response.code !== 200) {
        console.error(`获取学生详情失败: ${response.message}`);
        throw new Error(`获取学生详情失败: ${response.message || '未知错误'}`);
      }

      return convertDtoToStudent(response.data);
    } catch (error) {
      console.error(`获取学生详情失败:`, error);
      throw error;
    }
  },

  // 添加学生
  add: async (data: Omit<Student, 'id'>): Promise<Student> => {

    const createRequest = convertStudentToCreateRequest(data);
    const response = await request(`${STUDENT_API_PATHS.ADD}`, {
      method: 'POST',
      body: JSON.stringify(createRequest)
    });

    return convertDtoToStudent(response.data);
  },

  // 创建学员及课程
  createWithCourse: async (payload: { studentInfo: any; courseInfoList: any[] }): Promise<Student> => {
    if (!payload.studentInfo || !payload.courseInfoList) {
      throw new Error('学员信息或课程信息不能为空');
    }

    // 确保有校区ID
    const currentCampusId = localStorage.getItem('currentCampusId');
    if (!currentCampusId) {
      message.warning('请先选择校区');
      throw new Error('未选择校区，无法创建学员');
    }

    // 添加校区ID到学员信息中，如果没有的话
    if (!payload.studentInfo.campusId) {
      payload.studentInfo.campusId = Number(currentCampusId);
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

        // 直接使用表单数据构建学员信息，不调用课程列表API
        const courses = payload.courseInfoList.map(courseInfo => {
          console.log('处理课程信息:', courseInfo);

          // 使用表单数据中的课程信息
          let courseItemName = courseInfo.courseName || courseInfo.originalCourseName || `课程${courseInfo.courseId}`;
          let courseItemType = courseInfo.courseTypeName || courseInfo.courseType || '';
          let coachItemName = courseInfo.coachName || '';

          console.log('使用表单数据构建课程信息:', {
            courseId: courseInfo.courseId,
            courseName: courseItemName,
            courseType: courseItemType,
            coachName: coachItemName
          });

          return {
            courseId: courseInfo.courseId,
            courseName: courseItemName,
            courseType: courseItemType,
            coachName: coachItemName,
            enrollDate: courseInfo.enrollDate,
            status: courseInfo.status || 'STUDYING'
          };
        });

        // 获取第一个课程信息用于学员基本信息
        const primaryCourseInfo = payload.courseInfoList[0] || {};
        const primaryCourse = courses[0];
        
        // 使用真实的课程信息
        const courseName = primaryCourse ? primaryCourse.courseName : '';
        const courseTypeName = primaryCourse ? primaryCourse.courseType : '';
        const coachName = primaryCourse ? primaryCourse.coachName : '';

        console.log('创建学员数据时使用的课程和教练信息:', {
          primaryCourseInfo,
          courseName,
          courseTypeName,
          coachName,
          fromCourses: primaryCourse
        });

        // 使用类型断言确保类型兼容性
        const studentData = {
          id: studentId.toString(),
          studentId: studentId,
          name: payload.studentInfo.name,
          gender: payload.studentInfo.gender,
          age: payload.studentInfo.age,
          phone: payload.studentInfo.phone,
          course: courseName,
          courseType: courseTypeName,
          coach: coachName,
          enrollDate: primaryCourseInfo.enrollDate || primaryCourseInfo.startDate || '',
          expireDate: primaryCourseInfo.endDate || primaryCourseInfo.expireDate || '',
          remainingClasses: primaryCourseInfo.remainingHours?.toString() || primaryCourseInfo.remainingClasses?.toString() || '0',
          status: 'STUDYING' as 'normal' | 'expired' | 'graduated' | 'STUDYING',
          campusId: payload.studentInfo.campusId || Number(currentCampusId),
          createdTime: new Date().toISOString(),
          courses: courses.map(course => ({
            studentCourseId: 0,
            courseId: course.courseId,
            courseName: course.courseName,
            courseTypeId: 0,
            courseTypeName: course.courseType,
            coachId: 0,
            coachName: course.coachName,
            consumedHours: 0,
            totalHours: 0,
            status: course.status,
            endDate: '',
            enrollmentDate: course.enrollDate,
            fixedSchedule: null,
            lastClassTime: null,
            remainingHours: 0
          }))
        } as Student;

        // 触发自定义事件通知前端更新列表，这是API层的触发，作为双保险
        try {
          const event = new CustomEvent('studentCreated', {
            detail: {
              student: studentData
            }
          });
          window.dispatchEvent(event);
          console.log('API层触发学员创建事件，数据:', studentData);
        } catch (eventError) {
          console.error('API层触发学员创建事件失败:', eventError);
          // 触发事件失败不影响API调用结果
        }

        return studentData;
      }
    }

    throw new Error(`创建学员失败: ${response.message || '未知错误'}`);
  },

  // 更新学员及课程
  updateWithCourse: async (payload: {
    studentId: number;
    studentInfo: any;
    courseInfoList: Array<{
      courseId: number;
      startDate: string;
      endDate: string;
      fixedScheduleTimes?: Array<{
        weekday: string;
        from: string;
        to: string;
      }>;
      status?: string;
    }>;
  }): Promise<void> => {
    try {
      // 验证payload结构
      if (!payload) {
        throw new Error('更新学员失败：请求参数为空');
      }

      // 确保必要的字段存在且有效
      if (payload.studentId === undefined || isNaN(Number(payload.studentId)) || Number(payload.studentId) <= 0) {
        throw new Error('更新学员失败：无效的学员ID');
      }

      if (!payload.studentInfo) {
        throw new Error('更新学员失败：缺少学员信息');
      }

      if (!payload.courseInfoList || !Array.isArray(payload.courseInfoList) || payload.courseInfoList.length === 0) {
        throw new Error('更新学员失败：缺少课程信息列表');
      }

      // 验证课程信息
      for (const courseInfo of payload.courseInfoList) {
        if (courseInfo.courseId === undefined || isNaN(Number(courseInfo.courseId)) || Number(courseInfo.courseId) <= 0) {
          throw new Error('更新学员失败：课程列表中存在无效的课程ID');
        }
      }

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

    const updateRequest = convertStudentToUpdateRequest(data);
    const response = await request(`${STUDENT_API_PATHS.UPDATE(id)}`, {
      method: 'POST',
      body: JSON.stringify(updateRequest)
    });

    return convertDtoToStudent(response.data);
  },

  // 删除学生
  delete: async (id: string): Promise<void> => {

    await request(`/lesson/api/student/delete?id=${id}`, {
      method: 'POST'
    });
  },

  // 获取学生课程记录
  getClassRecords: async (studentId: string): Promise<ClassRecord[]> => {

    const response = await request(`${STUDENT_API_PATHS.CLASS_RECORDS(studentId)}`);
    return response.data;
  },

  // 获取学生缴费记录
  getPaymentRecords: async (studentId: string): Promise<PaymentRecord[]> => {

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
    validityPeriodId: number;
    giftItems?: any[];
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

  // 添加学生退费记录
  refund: async (refundData: RefundRequest): Promise<RefundResponse> => {
    console.log('添加退费记录，请求数据:', JSON.stringify(refundData, null, 2));

    const response = await request(STUDENT_API_PATHS.REFUND, {
      method: 'POST',
      body: JSON.stringify(refundData)
    });

    console.log('退费API响应:', response);
    return response.data;
  },

  // 新增：获取学员打卡记录列表
  getAttendanceList: async (params: AttendanceListParams): Promise<AttendanceListResponseData> => {
    const ATTENDANCE_LIST_PATH = '/lesson/api/student/attendance-list';
    // MOCK data can be added here if needed

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
