import { Payment } from '../types/payment';

export const mockData: Payment[] = [
  {
    id: 'PAY202306001',
    date: '2023-06-01',
    studentName: '张小明',
    studentId: 'STU001',
    course: '游泳初级班',
    amount: 2000,
    paymentType: '30次课',
    paymentMethod: '新增',
    status: '微信支付',
    remark: '预付2个月课程',
    operator: '王老师'
  },
  {
    id: 'PAY202306002',
    date: '2023-06-03',
    studentName: '李小红',
    studentId: 'STU002',
    course: '游泳中级班',
    amount: 2400,
    paymentType: '50次课',
    paymentMethod: '续费',
    status: '支付宝支付',
    remark: '预付3个月课程',
    operator: '王老师'
  },
  {
    id: 'PAY202306003',
    date: '2023-06-05',
    studentName: '王小刚',
    studentId: 'STU003',
    course: '游泳高级班',
    amount: 3000,
    paymentType: '100次课',
    paymentMethod: '补费',
    status: '现金支付',
    remark: '预付3个月课程',
    operator: '李老师'
  },
  {
    id: 'PAY202306004',
    date: '2023-06-10',
    studentName: '赵小丽',
    studentId: 'STU004',
    course: '游泳初级班',
    amount: 800,
    paymentType: '30次课',
    paymentMethod: '退费',
    status: '银行卡转账',
    remark: '待确认到账',
    operator: '李老师'
  },
  {
    id: 'PAY202306005',
    date: '2023-06-15',
    studentName: '孙小亮',
    studentId: 'STU005',
    course: '游泳初级班',
    amount: 1000,
    paymentType: '50次课',
    paymentMethod: '新增',
    status: '微信支付',
    remark: '退课退款',
    operator: '张老师'
  }
]; 