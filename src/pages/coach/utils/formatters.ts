// 生成教练ID
export const generateCoachId = (length: number): string => {
  return `C${10000 + length + 1}`;
};

// 获取状态标签信息
export const getStatusTagInfo = (status: string): { color: string; text: string } => {
  let color = '';
  let text = '';

  // 直接使用大写状态值进行比较
  switch (status) {
    case 'ACTIVE':
      color = 'green';
      text = '在职';
      break;
    case 'VACATION':
      color = 'orange';
      text = '休假中';
      break;
    case 'RESIGNED':
      color = 'red';
      text = '已离职';
      break;
    default:
      color = 'default';
      text = status;
  }

  return { color, text };
};