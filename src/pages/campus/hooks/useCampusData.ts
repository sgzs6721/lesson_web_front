import { useState, useEffect, useRef } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import { Campus, CampusSearchParams } from '../types/campus';
import { API } from '@/api';
import { refreshAllCampusSelectors } from '@/components/CampusSelector';

// 创建模块级缓存
let campusListCache: {
  data: Campus[];
  total: number;
  pageNum: number;
  pageSize: number;
  timestamp: number;
  searchParams?: CampusSearchParams;
} | null = null;

// 缓存过期时间（毫秒）
const CACHE_EXPIRY = 60000; // 1分钟

// 正在进行的请求标记
let isFetchingCampusList = false;
let campusListCallbacks: ((data: any) => void)[] = [];

export const useCampusData = () => {
  const [loading, setLoading] = useState(false);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 记录当前的搜索参数
  const searchParamsRef = useRef<CampusSearchParams | undefined>();

  // 页面加载或参数变化时获取数据
  useEffect(() => {
    fetchCampuses(searchParamsRef.current);
  }, [currentPage, pageSize]);

  // 获取校区数据
  const fetchCampuses = async (searchParams?: CampusSearchParams) => {
    // 更新搜索参数引用
    searchParamsRef.current = searchParams;

    // 检查缓存是否有效
    const now = Date.now();
    if (campusListCache &&
        campusListCache.pageNum === currentPage &&
        campusListCache.pageSize === pageSize &&
        now - campusListCache.timestamp < CACHE_EXPIRY &&
        JSON.stringify(campusListCache.searchParams) === JSON.stringify(searchParams)) {
      // 使用缓存数据
      console.log('使用缓存的校区列表数据');
      setCampuses(campusListCache.data);
      setTotal(campusListCache.total);
      return;
    }

    // 如果有正在进行的请求，等待该请求完成
    if (isFetchingCampusList) {
      console.log('等待现有的校区列表请求完成');
      setLoading(true);
      return new Promise<void>((resolve) => {
        campusListCallbacks.push((data) => {
          setCampuses(data.list || []);
          setTotal(data.total || 0);
          setLoading(false);
          resolve();
        });
      });
    }

    // 标记正在进行请求
    isFetchingCampusList = true;
    setLoading(true);

    try {
      console.log('获取校区列表，页码:', currentPage, '每页数量:', pageSize);

      // 注意: 我们现在直接使用queryParams构建查询参数

      // 调用API获取校区列表
      // 构建完整的URL查询参数
      const queryParams = new URLSearchParams();
      queryParams.append('pageNum', currentPage.toString());
      queryParams.append('pageSize', pageSize.toString());

      if (searchParams?.searchText) {
        queryParams.append('keyword', searchParams.searchText);
      }

      if (searchParams?.selectedStatus) {
        queryParams.append('status', searchParams.selectedStatus);
      }

      // 只调用一次API
      const directResponse = await fetch(`/lesson/api/campus/list?${queryParams.toString()}`, {
        headers: {
          'Authorization': document.cookie.split(';').find(c => c.trim().startsWith('token='))?.trim().substring('token='.length) || ''
        }
      });
      const directData = await directResponse.json();
      console.log('校区列表原始数据:', directData);

      // 处理数据
      let campusList: Campus[] = [];
      let totalCount = 0;

      if (directData && directData.code === 200 && directData.data) {
        // 使用API返回的数据
        campusList = directData.data.list || [];
        totalCount = directData.data.total || 0;
        console.log('校区列表数据处理成功:', campusList);
      }

      console.log('最终处理后的校区列表数据:', campusList);

      // 更新缓存
      campusListCache = {
        data: campusList,
        total: totalCount,
        pageNum: currentPage,
        pageSize: pageSize,
        timestamp: Date.now(),
        searchParams: searchParams
      };

      // 设置校区列表和总数
      setCampuses(campusList);
      setTotal(totalCount);
      console.log('设置后的校区列表数据:', campusList);

      // 通知所有等待的回调
      campusListCallbacks.forEach(callback => callback({ list: campusList, total: totalCount }));
      campusListCallbacks = [];
    } catch (error) {
      message.error('获取校区列表失败');
      console.error('获取校区列表错误:', error);
      setCampuses([]);
      setTotal(0);

      // 清除缓存
      campusListCache = null;
    } finally {
      isFetchingCampusList = false;
      setLoading(false);
    }
  };

  // 根据条件过滤数据
  const filterData = (params: CampusSearchParams) => {
    // 重置到第一页
    setCurrentPage(1);
    // 调用fetchCampuses并传入搜索参数
    fetchCampuses(params);
  };

  // 添加校区
  const addCampus = async (values: Partial<Campus> & { utilitiesFee?: number }) => {
    try {
      setLoading(true);

      // 准备请求数据
      const campusData = {
        name: values.name || '',
        address: values.address || '',
        phone: values.phone || '',
        contactPerson: values.contactPerson || '',
        status: values.status || 'OPERATING',
        monthlyRent: values.monthlyRent || 0,
        propertyFee: values.propertyFee || 0,
        utilityFee: values.utilityFee || (values as any).utilitiesFee || 0, // 兼容表单字段名
        capacity: 200, // 使用默认值
        area: 1000, // 使用默认值
        facilities: [] // 使用默认空数组
      };

      // 调用API创建校区
      const newCampusId = await API.campus.create(campusData);
      console.log('校区创建成功，ID:', newCampusId);

      // 创建本地校区对象用于UI更新
      const newCampus: Campus = {
        id: newCampusId,
        name: campusData.name,
        address: campusData.address,
        phone: campusData.phone,
        contactPerson: campusData.contactPerson,
        status: campusData.status as 'OPERATING' | 'CLOSED',
        monthlyRent: campusData.monthlyRent,
        propertyFee: campusData.propertyFee,
        utilityFee: campusData.utilityFee,
        openDate: dayjs().format('YYYY-MM-DD'),
        studentCount: 0,
        coachCount: 0,
        courseCount: 0,
        capacity: campusData.capacity,
        area: campusData.area,
        facilities: campusData.facilities,
        image: '',
      };

      // 清除缓存
      campusListCache = null;

      // 重新获取最新数据，更新表格
      await fetchCampuses(searchParamsRef.current);

      // 触发所有校区选择器组件刷新
      refreshAllCampusSelectors();

      return newCampus;
    } catch (error) {
      console.error('添加校区失败:', error);
      message.error('添加校区失败');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 更新校区
  const updateCampus = async (id: string | number, values: Partial<Campus>) => {
    try {
      setLoading(true);

      // 准备请求数据
      const updateData = {
        name: values.name,
        address: values.address,
        phone: values.phone,
        contactPerson: values.contactPerson,
        status: values.status,
        monthlyRent: values.monthlyRent,
        propertyFee: values.propertyFee,
        utilityFee: values.utilityFee, // 水电费
      };

      // 调用API更新校区
      await API.campus.update(String(id), updateData);
      console.log('校区更新成功:', id);

      // 清除缓存
      campusListCache = null;

      // 重新获取最新数据，更新表格
      await fetchCampuses(searchParamsRef.current);

      // 成功提示已移至useCampusForm.ts中处理，这里不再显示

      // 触发所有校区选择器组件刷新
      refreshAllCampusSelectors();
    } catch (error) {
      console.error('更新校区失败:', error);
      message.error('更新校区失败');
      // 重新抛出错误，使调用者知道函数失败
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 删除校区
  const deleteCampus = async (id: string | number) => {
    try {
      setLoading(true);

      // 调用API删除校区
      await API.campus.delete(String(id));
      console.log('校区删除成功:', id);

      message.success('校区已删除');

      // 清除缓存
      campusListCache = null;

      // 重新获取最新数据，更新表格
      await fetchCampuses(searchParamsRef.current);

      // 触发所有校区选择器组件刷新
      refreshAllCampusSelectors();
    } catch (error) {
      console.error('删除校区失败:', error);
      message.error('删除校区失败');
    } finally {
      setLoading(false);
    }
  };

  // 切换校区状态
  const toggleCampusStatus = async (record: Campus) => {
    try {
      setLoading(true);

      // 计算新状态
      const newStatus = record.status === 'CLOSED' ? 'OPERATING' : 'CLOSED';
      const statusValue = newStatus === 'OPERATING' ? 1 : 0; // 1表示营业中，0表示已关闭

      // 调用API更新校区状态，使用updateStatus接口
      await API.campus.updateStatus(String(record.id), statusValue);
      console.log('校区状态更新成功:', record.id, newStatus);

      message.success(`校区状态已更新为${newStatus === 'OPERATING' ? '运营中' : '已关闭'}`);

      // 清除缓存
      campusListCache = null;

      // 重新获取最新数据，更新表格
      await fetchCampuses(searchParamsRef.current);

      // 触发所有校区选择器组件刷新
      refreshAllCampusSelectors();
    } catch (error) {
      console.error('更新校区状态失败:', error);
      message.error('更新校区状态失败');
    } finally {
      setLoading(false);
    }
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