// 生成教练ID
export const generateCoachId = (length: number): string => {
  return `C${10000 + length + 1}`;
};

// 获取状态标签信息
export const getStatusTagInfo = (status: string): { color: string; text: string } => {
  let color = '';
  let text = '';
  
  switch (status) {
    case 'active':
      color = 'green';
      text = '在职';
      break;
    case 'vacation':
      color = 'orange';
      text = '休假中';
      break;
    case 'resigned':
      color = 'red';
      text = '已离职';
      break;
    default:
      color = 'default';
      text = status;
  }
  
  return { color, text };
}; 