// 课程类型选项
export const courseTypeOptions = [
  { value: 'sports', label: '体育类' },
  { value: 'art', label: '艺术类' },
  { value: 'academic', label: '学术类' },
];

// 课程列表
export const courseOptions = [
  { value: 'basketball', label: '篮球训练', type: 'sports', coaches: ['王教练', '李教练'], description: '专业篮球训练，提高球技和团队协作能力。' },
  { value: 'swimming', label: '游泳课程', type: 'sports', coaches: ['张教练', '刘教练'], description: '专业游泳教学，从零基础到自由泳、蛙泳等多种泳姿。' },
  { value: 'tennis', label: '网球培训', type: 'sports', coaches: ['赵教练', '钱教练'], description: '网球基础教学，培养灵活反应和协调能力。' },
  { value: 'painting', label: '绘画班', type: 'art', coaches: ['孙教练', '周教练'], description: '儿童创意绘画，激发艺术潜能和想象力。' },
  { value: 'piano', label: '钢琴培训', type: 'art', coaches: ['吴教练', '郑教练'], description: '一对一钢琴教学，从基础到进阶的专业指导。' },
  { value: 'dance', label: '舞蹈课程', type: 'art', coaches: ['冯教练', '陈教练'], description: '儿童舞蹈培训，包括芭蕾、街舞、中国舞等多种风格。' },
  { value: 'math', label: '数学辅导', type: 'academic', coaches: ['杨教练', '朱教练'], description: '小学数学思维训练，培养逻辑思维和解题能力。' },
  { value: 'english', label: '英语班', type: 'academic', coaches: ['秦教练', '许教练'], description: '趣味英语学习，提高听说读写综合能力。' },
];

// 课程类型描述
export const typeDescriptions: Record<string, string[]> = {
  sports: [
    '适合对体育运动有兴趣的学生',
    '提供专业的体育培训和指导',
    '包括篮球、足球、游泳等多种运动项目',
    '注重身体素质和团队协作能力的培养'
  ],
  art: [
    '适合对艺术有浓厚兴趣的学生',
    '提供专业的艺术技巧训练',
    '包括绘画、音乐、舞蹈等多种艺术形式',
    '注重创造力和艺术表现力的培养'
  ],
  academic: [
    '适合需要提高学习成绩的学生',
    '提供针对性的学科辅导',
    '包括数学、英语、物理等多个学科',
    '注重学习方法和思维能力的培养'
  ]
};

// 周几选项
export const weekdayOptions = [
  { value: '一', label: '周一' },
  { value: '二', label: '周二' },
  { value: '三', label: '周三' },
  { value: '四', label: '周四' },
  { value: '五', label: '周五' },
  { value: '六', label: '周六' },
  { value: '日', label: '周日' },
];

// 缴费类型选项
export const paymentTypeOptions = [
  { value: 'NEW', label: '新报名' },
  { value: 'RENEWAL', label: '续费' },
  { value: 'TRANSFER', label: '转课' },
];

// 支付方式选项
export const paymentMethodOptions = [
  { value: 'WECHAT', label: '微信支付' },
  { value: 'ALIPAY', label: '支付宝' },
  { value: 'CASH', label: '现金' },
  { value: 'CARD', label: '刷卡' },
  { value: 'TRANSFER', label: '转账' },
];

// 赠品选项列表
export const giftOptions = [
  { value: 'bag', label: '背包' },
  { value: 'bottle', label: '水杯' },
  { value: 'notebook', label: '笔记本' },
  { value: 'tshirt', label: 'T恤' },
  { value: 'cap', label: '帽子' },
];

// 学员状态选项
export const studentStatusOptions = [
  { value: 'STUDYING', label: '学习中' },
  { value: 'EXPIRED', label: '过期' },
  { value: 'GRADUATED', label: '结业' },
  { value: 'WAITING_PAYMENT', label: '待缴费' },
  { value: 'WAITING_RENEWAL', label: '待续费' },
  { value: 'REFUNDED', label: '已退费' },
];

// 状态中英文映射
export const statusMap = {
  'STUDYING': '学习中',
  'EXPIRED': '过期',
  'GRADUATED': '结业',
  'WAITING_PAYMENT': '待缴费',
  'WAITING_RENEWAL': '待续费',
  'REFUNDED': '已退费',
  // 兼容旧状态
  'NORMAL': '学习中'
};