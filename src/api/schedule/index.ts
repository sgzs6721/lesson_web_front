import { request, USE_MOCK } from '../config';
import { 
  FixedScheduleData, 
  FixedScheduleResponse, 
  CoachSimpleInfo, 
  CoachSimpleListResponse,
  ScheduleCourseInfo
} from './types';

// API路径常量
const SCHEDULE_API_PATHS = {
  FIXED_SCHEDULE: '/lesson/api/fixed-schedule/list',
  COACH_SIMPLE_LIST: '/lesson/api/coach/simple/list'
};

// 模拟数据
const mockCoachList: CoachSimpleInfo[] = [
  { id: 1, name: '李教练' },
  { id: 2, name: '王教练' },
  { id: 3, name: '张教练' },
  { id: 4, name: '刘教练' }
];

const mockFixedScheduleData: FixedScheduleData = {
  timeSlots: ['9:00-10:00', '10:00-11:00', '14:00-15:00', '15:00-16:00'],
  days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  schedule: {
    '9:00-10:00': {
      '周一': [
        {
          coachName: '李华',
          remainHours: '15',
          totalHours: '30',
          unitPrice: '180',
          courseName: '少儿街舞',
          courseType: '舞蹈课',
          description: '少儿街舞基础班'
        }
      ],
      '周二': [
        {
          coachName: '李华',
          remainHours: '15',
          totalHours: '30',
          unitPrice: '180',
          courseName: '少儿街舞',
          courseType: '舞蹈课',
          description: '少儿街舞基础班'
        }
      ],
      '周三': [
        {
          coachName: '李华',
          remainHours: '15',
          totalHours: '30',
          unitPrice: '180',
          courseName: '少儿街舞',
          courseType: '舞蹈课',
          description: '少儿街舞基础班'
        }
      ],
      '周四': [
        {
          coachName: '李华',
          remainHours: '15',
          totalHours: '30',
          unitPrice: '180',
          courseName: '少儿街舞',
          courseType: '舞蹈课',
          description: '少儿街舞基础班'
        }
      ],
      '周五': [
        {
          coachName: '张小明',
          remainHours: '12',
          totalHours: '24',
          unitPrice: '200',
          courseName: '少儿街舞',
          courseType: '舞蹈课',
          description: '少儿街舞进阶班'
        }
      ],
      '周六': [
        {
          coachName: '张小明',
          remainHours: '12',
          totalHours: '24',
          unitPrice: '200',
          courseName: '少儿街舞',
          courseType: '舞蹈课',
          description: '少儿街舞进阶班'
        }
      ]
    },
    '10:00-11:00': {
      '周一': [
        {
          coachName: '张小明',
          remainHours: '12',
          totalHours: '24',
          unitPrice: '200',
          courseName: '少儿街舞',
          courseType: '舞蹈课',
          description: '少儿街舞进阶班'
        }
      ],
      '周二': [
        {
          coachName: '张小明',
          remainHours: '12',
          totalHours: '24',
          unitPrice: '200',
          courseName: '少儿街舞',
          courseType: '舞蹈课',
          description: '少儿街舞进阶班'
        }
      ],
      '周三': [
        {
          coachName: '张小明',
          remainHours: '12',
          totalHours: '24',
          unitPrice: '200',
          courseName: '少儿街舞',
          courseType: '舞蹈课',
          description: '少儿街舞进阶班'
        }
      ],
      '周四': [
        {
          coachName: '张小明',
          remainHours: '12',
          totalHours: '24',
          unitPrice: '200',
          courseName: '少儿街舞',
          courseType: '舞蹈课',
          description: '少儿街舞进阶班'
        }
      ],
      '周五': [
        {
          coachName: '王芳',
          remainHours: '8',
          totalHours: '20',
          unitPrice: '150',
          courseName: '有氧训练',
          courseType: '健身课',
          description: '有氧运动基础课程'
        }
      ]
    },
    '14:00-15:00': {
      '周一': [
        {
          coachName: '王芳',
          remainHours: '8',
          totalHours: '20',
          unitPrice: '150',
          courseName: '有氧训练',
          courseType: '健身课',
          description: '有氧运动基础课程'
        }
      ],
      '周三': [
        {
          coachName: '王芳',
          remainHours: '8',
          totalHours: '20',
          unitPrice: '150',
          courseName: '有氧训练',
          courseType: '健身课',
          description: '有氧运动基础课程'
        }
      ],
      '周四': [
        {
          coachName: '王芳',
          remainHours: '8',
          totalHours: '20',
          unitPrice: '150',
          courseName: '有氧训练',
          courseType: '健身课',
          description: '有氧运动基础课程'
        }
      ]
    },
    '15:00-16:00': {
      '周二': [
        {
          coachName: '李华',
          remainHours: '15',
          totalHours: '30',
          unitPrice: '180',
          courseName: '少儿街舞',
          courseType: '舞蹈课',
          description: '少儿街舞基础班'
        }
      ],
      '周五': [
        {
          coachName: '张小明',
          remainHours: '12',
          totalHours: '24',
          unitPrice: '200',
          courseName: '少儿街舞',
          courseType: '舞蹈课',
          description: '少儿街舞进阶班'
        }
      ]
    }
  }
};

// 课表管理相关接口
export const schedule = {
  // 获取固定课表
  getFixedSchedule: async (campusId: number): Promise<FixedScheduleData> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockFixedScheduleData;
    }

    const url = `${SCHEDULE_API_PATHS.FIXED_SCHEDULE}?campusId=${campusId}`;
    const response: FixedScheduleResponse = await request(url);
    return response.data;
  },

  // 获取教练简单列表
  getCoachSimpleList: async (campusId: number): Promise<CoachSimpleInfo[]> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockCoachList;
    }

    const url = `${SCHEDULE_API_PATHS.COACH_SIMPLE_LIST}?campusId=${campusId}`;
    const response: CoachSimpleListResponse = await request(url);
    return response.data;
  }
}; 