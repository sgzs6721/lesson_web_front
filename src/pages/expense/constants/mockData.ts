import { Expense } from '../types/expense';

export const mockData: Expense[] = [
  // 支出数据
  {
    id: 'EXP202306001',
    date: '2023-06-01',
    item: '教练工资',
    amount: 5000,
    category: '工资支出',
    remark: '3月份工资',
    operator: '王老师',
    type: 'expense'
  },
  {
    id: 'EXP202306002',
    date: '2023-06-03',
    item: '场地租金',
    amount: 3000,
    category: '固定成本',
    remark: '3月份场地租金',
    operator: '王老师',
    type: 'expense'
  },
  {
    id: 'EXP202306003',
    date: '2023-06-05',
    item: '水电费',
    amount: 1200,
    category: '固定成本',
    remark: '3月份水电费',
    operator: '李老师',
    type: 'expense'
  },
  {
    id: 'EXP202306004',
    date: '2023-06-10',
    item: '办公用品',
    amount: 800,
    category: '其他支出',
    remark: '采购办公用品',
    operator: '李老师',
    type: 'expense'
  },
  {
    id: 'EXP202306005',
    date: '2023-06-15',
    item: '员工福利',
    amount: 1000,
    category: '其他支出',
    remark: '员工生日福利',
    operator: '张老师',
    type: 'expense'
  },
  
  // 收入数据
  {
    id: 'INC202306001',
    date: '2023-06-02',
    item: '游泳课程',
    amount: 3500,
    category: '学费收入',
    remark: '6月份游泳课收入',
    operator: '王老师',
    type: 'income'
  },
  {
    id: 'INC202306002',
    date: '2023-06-07',
    item: '私教课',
    amount: 2800,
    category: '培训收入',
    remark: '李教练私教收入',
    operator: '李老师',
    type: 'income'
  },
  {
    id: 'INC202306003',
    date: '2023-06-12',
    item: '泳具销售',
    amount: 1200,
    category: '零售收入',
    remark: '泳镜、泳帽等销售',
    operator: '张老师',
    type: 'income'
  },
  {
    id: 'INC202306004',
    date: '2023-06-18',
    item: '暑期班报名',
    amount: 5600,
    category: '学费收入',
    remark: '暑期班预付款',
    operator: '王老师',
    type: 'income'
  },
  {
    id: 'INC202306005',
    date: '2023-06-25',
    item: '场地租赁',
    amount: 1800,
    category: '其他收入',
    remark: '周末泳池出租',
    operator: '李老师',
    type: 'income'
  }
]; 