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

// 获取职位标签信息
export const getJobTitleTagInfo = (jobTitle: string): { color: string; text: string } => {
  let color = '';
  let text = jobTitle;

  // 根据职位名称返回不同的颜色
  if (jobTitle.includes('高级') || jobTitle.includes('资深') || jobTitle.includes('首席')) {
    color = 'purple'; // 高级教练使用紫色
  } else if (jobTitle.includes('中级')) {
    color = 'blue'; // 中级教练使用蓝色
  } else if (jobTitle.includes('初级')) {
    color = 'cyan'; // 初级教练使用青色
  } else {
    color = 'geekblue'; // 其他职位使用深蓝色
  }

  return { color, text };
};