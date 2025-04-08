/**
 * 导出数据到 CSV 文件
 * @param data 要导出的数据数组
 * @param fileName 导出的文件名
 */
export const exportToCSV = (data: any[], fileName: string = 'statistics-data.csv') => {
  if (!data || !data.length) {
    console.warn('没有数据可导出');
    return;
  }

  try {
    // 获取表头（第一行对象的所有键）
    const headers = Object.keys(data[0]);

    // 创建 CSV 内容
    const csvContent = [
      // 表头行
      headers.join(','),
      // 数据行
      ...data.map(row => 
        headers.map(header => {
          // 处理包含逗号、引号或换行符的值
          const cell = row[header] === null || row[header] === undefined ? '' : row[header].toString();
          if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
            return `"${cell.replace(/"/g, '""')}"`;
          }
          return cell;
        }).join(',')
      )
    ].join('\n');

    // 创建 Blob 对象
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // 创建下载链接并触发下载
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('导出数据失败', error);
  }
};

/**
 * 导出数据到 Excel 文件
 * @param data 要导出的数据数组
 * @param fileName 导出的文件名
 * @param sheetName 工作表名称
 */
export const exportToExcel = (
  data: any[],
  fileName: string = 'statistics-data.xlsx',
  sheetName: string = 'Statistics'
) => {
  if (!data || !data.length) {
    console.warn('没有数据可导出');
    return;
  }

  try {
    // 这里可以使用第三方库如 xlsx.js 或 exceljs 来创建 Excel 文件
    // 例如使用 xlsx.js:
    // const worksheet = XLSX.utils.json_to_sheet(data);
    // const workbook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    // XLSX.writeFile(workbook, fileName);
    
    // 由于可能需要导入额外的库，这里仅给出示例代码
    // 实际使用时需要安装相应的依赖
    console.log('导出 Excel', data, fileName, sheetName);
    alert(`导出 Excel 功能需要安装额外依赖，请在正式环境中实现。`);
  } catch (error) {
    console.error('导出数据失败', error);
  }
};

/**
 * 格式化导出数据
 * @param data 原始数据
 * @param section 数据部分（overview, student, coach, finance, campus-comparison）
 * @returns 格式化后的数据数组
 */
export const formatExportData = (data: any, section: string): any[] => {
  if (!data) return [];

  switch (section) {
    case 'overview':
      return [
        {
          指标: '总学员数',
          数值: data.totalStudents,
          增长率: `${data.studentGrowth}%`
        },
        {
          指标: '活跃学员数',
          数值: data.activeStudents,
          增长率: `${data.activeGrowth}%`
        },
        {
          指标: '新增学员',
          数值: data.newStudents,
          增长率: `${data.newGrowth}%`
        },
        {
          指标: '流失学员',
          数值: data.lostStudents,
          增长率: `${data.lostGrowth}%`
        },
        {
          指标: '总教练数',
          数值: data.totalCoaches,
          增长率: `${data.coachGrowth}%`
        },
        {
          指标: '课消总数',
          数值: data.totalLessons,
          增长率: `${data.lessonGrowth}%`
        },
        {
          指标: '总收入(元)',
          数值: data.totalIncome,
          增长率: `${data.incomeGrowth}%`
        },
        {
          指标: '总利润(元)',
          数值: data.totalProfit,
          增长率: `${data.profitGrowth}%`
        },
      ];
    // 可以添加更多部分的数据格式化逻辑
    default:
      return [];
  }
};