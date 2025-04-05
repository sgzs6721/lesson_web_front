import { useState, useEffect } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import { Campus, CampusSearchParams } from '../types/campus';
import { facilityOptions } from '../constants/facilityOptions';

export const useCampusData = () => {
  const [loading, setLoading] = useState(false);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 页面加载时获取数据
  useEffect(() => {
    fetchCampuses();
  }, [currentPage, pageSize]);

  // 模拟获取校区数据
  const fetchCampuses = async () => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 生成测试数据
      const mockData: Campus[] = Array(30)
        .fill(null)
        .map((_, index) => {
          // 随机生成设施
          const facilitiesCount = Math.floor(Math.random() * 6) + 3;
          const selectedFacilities = facilityOptions
            .sort(() => 0.5 - Math.random())
            .slice(0, facilitiesCount)
            .map(f => f.value);

          const studentCount = Math.floor(Math.random() * 300) + 100;
          const coachCount = Math.floor(Math.random() * 20) + 5;
          
          return {
            id: `CA${10000 + index}`,
            name: ['北京中关村校区', '北京望京校区', '上海徐汇校区', '上海浦东校区', '广州天河校区', '深圳南山校区', '杭州西湖校区', '成都锦江校区', '武汉江岸校区', '南京鼓楼校区'][index % 10],
            address: `${['北京市', '上海市', '广州市', '深圳市', '杭州市', '成都市', '武汉市', '南京市', '天津市', '重庆市'][index % 10]}${['海淀区', '朝阳区', '徐汇区', '浦东新区', '天河区', '南山区', '西湖区', '锦江区', '江岸区', '鼓楼区'][index % 10]}${['中关村大街', '望京街道', '徐家汇路', '张江高科技园区', '天河路', '科技园路', '西湖大道', '锦江大道', '江岸大道', '鼓楼街'][index % 10]}${index + 1}号`,
            phone: `${['010', '021', '020', '0755', '0571', '028', '027', '025', '022', '023'][index % 10]}-${String(55000000 + index * 10000).substring(0, 8)}`,
            contactPerson: `负责人${index + 1}`,
            capacity: (index % 5 + 2) * 100,
            area: (index % 10 + 5) * 200,
            facilities: selectedFacilities,
            image: `https://picsum.photos/800/400?random=${index}`,
            status: index % 10 === 0 ? 'closed' : index % 15 === 0 ? 'renovating' : 'open',
            openDate: dayjs().subtract((index + 1) * 90, 'day').format('YYYY-MM-DD'),
            studentCount,
            coachCount,
            courseCount: Math.floor(Math.random() * 30) + 10,
            monthlyRent: Math.floor(Math.random() * 50000) + 10000,
            propertyFee: Math.floor(Math.random() * 5000) + 1000,
            utilitiesFee: Math.floor(Math.random() * 3000) + 500,
          };
        });

      // 分页
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      const paginatedData = mockData.slice(start, end);
      
      setTotal(mockData.length);
      setCampuses(paginatedData);
    } catch (error) {
      message.error('获取校区列表失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 根据条件过滤数据
  const filterData = (params: CampusSearchParams) => {
    setLoading(true);
    const { searchText, selectedStatus } = params;
    setTimeout(() => {
      try {
        // 模拟API调用 - 实际情况应该是调用fetchCampuses但传入搜索参数
        // 生成测试数据
        const mockData: Campus[] = Array(30)
          .fill(null)
          .map((_, index) => {
            // 随机生成设施
            const facilitiesCount = Math.floor(Math.random() * 6) + 3;
            const selectedFacilities = facilityOptions
              .sort(() => 0.5 - Math.random())
              .slice(0, facilitiesCount)
              .map(f => f.value);

            const studentCount = Math.floor(Math.random() * 300) + 100;
            const coachCount = Math.floor(Math.random() * 20) + 5;
            
            return {
              id: `CA${10000 + index}`,
              name: ['北京中关村校区', '北京望京校区', '上海徐汇校区', '上海浦东校区', '广州天河校区', '深圳南山校区', '杭州西湖校区', '成都锦江校区', '武汉江岸校区', '南京鼓楼校区'][index % 10],
              address: `${['北京市', '上海市', '广州市', '深圳市', '杭州市', '成都市', '武汉市', '南京市', '天津市', '重庆市'][index % 10]}${['海淀区', '朝阳区', '徐汇区', '浦东新区', '天河区', '南山区', '西湖区', '锦江区', '江岸区', '鼓楼区'][index % 10]}${['中关村大街', '望京街道', '徐家汇路', '张江高科技园区', '天河路', '科技园路', '西湖大道', '锦江大道', '江岸大道', '鼓楼街'][index % 10]}${index + 1}号`,
              phone: `${['010', '021', '020', '0755', '0571', '028', '027', '025', '022', '023'][index % 10]}-${String(55000000 + index * 10000).substring(0, 8)}`,
              contactPerson: `负责人${index + 1}`,
              capacity: (index % 5 + 2) * 100,
              area: (index % 10 + 5) * 200,
              facilities: selectedFacilities,
              image: `https://picsum.photos/800/400?random=${index}`,
              status: index % 10 === 0 ? 'closed' : index % 15 === 0 ? 'renovating' : 'open',
              openDate: dayjs().subtract((index + 1) * 90, 'day').format('YYYY-MM-DD'),
              studentCount,
              coachCount,
              courseCount: Math.floor(Math.random() * 30) + 10,
              monthlyRent: Math.floor(Math.random() * 50000) + 10000,
              propertyFee: Math.floor(Math.random() * 5000) + 1000,
              utilitiesFee: Math.floor(Math.random() * 3000) + 500,
            };
          });

        // 过滤数据
        let filteredData = mockData;
        
        if (searchText) {
          filteredData = filteredData.filter(
            campus => 
              campus.name.includes(searchText) || 
              campus.address.includes(searchText) ||
              campus.phone.includes(searchText)
          );
        }
        
        if (selectedStatus) {
          filteredData = filteredData.filter(campus => campus.status === selectedStatus);
        }

        // 分页
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        const paginatedData = filteredData.slice(start, end);
        
        setTotal(filteredData.length);
        setCampuses(paginatedData);
      } catch (error) {
        message.error('筛选校区列表失败');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  // 添加校区
  const addCampus = (values: Partial<Campus>) => {
    const newCampus: Campus = {
      id: `CA${10000 + Math.floor(Math.random() * 90000)}`,
      name: values.name || '',
      address: values.address || '',
      phone: values.phone || '',
      contactPerson: values.contactPerson || '',
      capacity: values.capacity || 200,
      area: values.area || 1000,
      facilities: values.facilities || [],
      image: values.image || '',
      status: values.status || 'open',
      openDate: dayjs().format('YYYY-MM-DD'),
      studentCount: 0,
      coachCount: 0,
      courseCount: 0,
      monthlyRent: values.monthlyRent || 0,
      propertyFee: values.propertyFee || 0,
      utilitiesFee: values.utilitiesFee || 0
    };
    
    setCampuses(prevCampuses => [newCampus, ...prevCampuses]);
    setTotal(prev => prev + 1);
    message.success('校区添加成功');
    return newCampus;
  };

  // 更新校区
  const updateCampus = (id: string, values: Partial<Campus>) => {
    setCampuses(prevCampuses => 
      prevCampuses.map(campus => 
        campus.id === id 
          ? { ...campus, ...values } 
          : campus
      )
    );
    message.success('校区信息已更新');
  };

  // 删除校区
  const deleteCampus = (id: string) => {
    setCampuses(campuses.filter(campus => campus.id !== id));
    setTotal(prev => prev - 1);
    message.success('校区已删除');
  };

  // 切换校区状态
  const toggleCampusStatus = (record: Campus) => {
    const newStatus = record.status === 'closed' ? 'open' : 'closed';
    setCampuses(prevCampuses => 
      prevCampuses.map(campus => 
        campus.id === record.id 
          ? { ...campus, status: newStatus } 
          : campus
      )
    );
    message.success(`校区已${newStatus === 'closed' ? '停用' : '启用'}`);
  };

  return {
    loading,
    campuses,
    total,
    currentPage,
    pageSize,
    fetchCampuses,
    filterData,
    addCampus,
    updateCampus,
    deleteCampus,
    toggleCampusStatus,
    setCurrentPage,
    setPageSize
  };
}; 