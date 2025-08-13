import React, { useState, useEffect, useRef } from 'react';
import { Typography, Card, Drawer, List, Button, Space, Tag, message, Input, Spin, Checkbox, Select } from 'antd';
import { ManOutlined, WomanOutlined } from '@ant-design/icons';
import CourseTable from './components/CourseTable';
import CourseCardList from './components/CourseCardList';
import CourseSearchBar from './components/CourseSearchBar';
import CourseEditModal from './components/CourseEditModal';
import CourseDetailModal from './components/CourseDetailModal';
import CourseDeleteModal from './components/CourseDeleteModal';
import CourseViewToggle from './components/CourseViewToggle';
import { useCourseData } from './hooks/useCourseData';
import { useCourseSearch } from './hooks/useCourseSearch';
import { useCourseForm } from './hooks/useCourseForm';
import { Course } from './types/course';
import { coach as coachAPI } from '@/api/coach';
import { CoachSimple } from '@/api/coach/types';
import { fetchCategoryOptions, getCachedCategoryOptions } from './constants/courseOptions';
import { Constant } from '@/api/constants/types';
import './components/CourseManagement.css';
import { student as studentApi } from '@/api/student';
import AttendanceModal from '@/pages/student/components/AttendanceModal';
import { Form } from 'antd';
import { getStatusInfo } from '@/pages/student/utils/student';
import { clearCourseListCache } from '@/api/course';

const { Title } = Typography;

const CourseManagement: React.FC = () => {
  // 初始加载引用
  const initialLoadRef = useRef(true);

  // 使用数据管理钩子
  const {
    courses,
    totalCount,
    loading,
    addCourse,
    updateCourse,
    deleteCourse,
    filterCourses,
    resetFilters
  } = useCourseData();
  
  // 当前页码和页面大小
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  // 新增：记录当前表格排序
  const [tableSortField, setTableSortField] = useState<string | undefined>(undefined);
  const [tableSortOrder, setTableSortOrder] = useState<'ascend' | 'descend' | undefined>(undefined);

  // 使用搜索功能钩子
  const {
    searchParams,
    setSearchText,
    setSelectedType,
    setSelectedStatus,
    setSelectedCoach,
    setSortOrder,
    setSortField,
    handleSearch,
    handleReset
  } = useCourseSearch(async (params) => {
    setCurrentPage(1); // 重置到第一页
    // 搜索时合并当前排序
    const merged = {
      ...params,
      sortField: tableSortField ?? params.sortField ?? 'status',
      sortOrder: (tableSortOrder ? (tableSortOrder === 'ascend' ? 'asc' : 'desc') : (params.sortOrder ?? 'asc'))
    } as any;
    return filterCourses(1, pageSize, merged);
  })

  // 课程类型列表状态
  const [courseTypes, setCourseTypes] = useState<Constant[]>([]);
  const [typesLoading, setTypesLoading] = useState(false);

  // 教练列表状态
  const [coaches, setCoaches] = useState<CoachSimple[]>([]);
  const [coachesLoading, setCoachesLoading] = useState(false);

  // 侧边抽屉 - 报名学员
  const [enrollDrawerVisible, setEnrollDrawerVisible] = useState(false);
  const [enrollCourse, setEnrollCourse] = useState<Course | null>(null);
  const [enrolledStudents, setEnrolledStudents] = useState<any[]>([]);
  const [filteredEnrolled, setFilteredEnrolled] = useState<any[]>([]);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [enrollSearch, setEnrollSearch] = useState('');
  const enrollSearchTimerRef = useRef<number | null>(null);
  // 分页（抽屉内下拉加载）
  const [enrollPageNum, setEnrollPageNum] = useState(1);
  const [enrollPageSize] = useState(10);
  const [enrollTotal, setEnrollTotal] = useState(0);
  const [enrollLoadingMore, setEnrollLoadingMore] = useState(false);
  const enrollScrollRef = useRef<HTMLDivElement | null>(null);
  // 过滤与展示
  const [hideGraduated, setHideGraduated] = useState(true);
  const [hideRefunded, setHideRefunded] = useState(true);

  // 打卡模态框
  const [attendanceModalVisible, setAttendanceModalVisible] = useState(false);
  const [attendanceForm] = Form.useForm();
  const [attendStudent, setAttendStudent] = useState<any | null>(null);

  const openEnrollments = async (course: Course) => {
    try {
      setEnrollCourse(course);
      setEnrollDrawerVisible(true);
      setEnrollLoading(true);
      // 初始化分页
      setEnrollPageNum(1);
      setEnrollTotal(0);
      const data = await studentApi.getList({ courseId: String(course.id), pageNum: 1, pageSize: enrollPageSize } as any);
      const list = (data as any)?.list || [];
      const total = (data as any)?.total ?? list.length;
      setEnrolledStudents(list);
      // 初始过滤
      setFilteredEnrolled(applyEnrollFilters(list, enrollSearch, hideGraduated, hideRefunded));
      setEnrollTotal(total);
      setEnrollSearch('');
    } catch (e) {
      console.error('获取报名学员失败', e);
      message.error('获取报名学员失败');
    } finally {
      setEnrollLoading(false);
    }
  };

  // 尝试填满滚动容器，避免底部空白
  useEffect(() => {
    if (!enrollDrawerVisible) return;
    const el = enrollScrollRef.current;
    if (!el) return;
    const tryFill = () => {
      if (!el) return;
      const needMore = (enrolledStudents.length < enrollTotal) && (el.scrollHeight <= el.clientHeight + 8);
      if (needMore) {
        loadMoreEnrollments();
      }
    };
    const t = window.setTimeout(tryFill, 50);
    return () => window.clearTimeout(t);
  }, [filteredEnrolled, enrollDrawerVisible]);

  // 加载更多
  const loadMoreEnrollments = async () => {
    if (!enrollCourse) return;
    if (enrolledStudents.length >= enrollTotal) return;
    if (enrollLoadingMore) return;
    try {
      setEnrollLoadingMore(true);
      const nextPage = enrollPageNum + 1;
      const data = await studentApi.getList({ courseId: String(enrollCourse.id), pageNum: nextPage, pageSize: enrollPageSize } as any);
      const list = (data as any)?.list || [];
      const merged = [...enrolledStudents, ...list];
      setEnrolledStudents(merged);
      // 维持当前搜索+过滤
      setFilteredEnrolled(applyEnrollFilters(merged, enrollSearch, hideGraduated, hideRefunded));
      setEnrollPageNum(nextPage);
      setEnrollTotal((data as any)?.total ?? enrollTotal);
    } catch (e) {
      console.error('加载更多报名学员失败', e);
    } finally {
      setEnrollLoadingMore(false);
    }
  };

  // 滚动监听
  const handleEnrollScroll = () => {
    const el = enrollScrollRef.current;
    if (!el) return;
    const threshold = 80; // 距底部80px开始加载
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - threshold) {
      loadMoreEnrollments();
    }
  };

  // 报名学员搜索 - 本地模糊过滤 name / phone / parentPhone
  const handleEnrollSearchChange = (val: string) => {
    setEnrollSearch(val);
    if (enrollSearchTimerRef.current) {
      window.clearTimeout(enrollSearchTimerRef.current);
    }
    enrollSearchTimerRef.current = window.setTimeout(() => {
      setFilteredEnrolled(applyEnrollFilters(enrolledStudents, val, hideGraduated, hideRefunded));
    }, 200);
  };

  const applyEnrollFilters = (list: any[], search: string, hideGrad: boolean, hideRef: boolean) => {
    const keyword = (search || '').trim().toLowerCase();
    return list.filter((s: any) => {
      // 状态字段兼容：status/courseStatus
      const status = String(s.status || s.courseStatus || '').toUpperCase();
      if (hideGrad && (status.includes('GRADUATED') || status.includes('结业'))) return false;
      if (hideRef && (status.includes('REFUND') || status.includes('退费'))) return false;
      if (!keyword) return true;
      return (
        String(s.name || '').toLowerCase().includes(keyword) ||
        String(s.phone || '').includes(keyword) ||
        String(s.parentPhone || '').includes(keyword)
      );
    });
  };

  // 过滤开关变化
  const handleToggleFilters = (nextHideGrad?: boolean, nextHideRef?: boolean) => {
    const hg = nextHideGrad === undefined ? hideGraduated : nextHideGrad;
    const hr = nextHideRef === undefined ? hideRefunded : nextHideRef;
    setHideGraduated(hg);
    setHideRefunded(hr);
    setFilteredEnrolled(applyEnrollFilters(enrolledStudents, enrollSearch, hg, hr));
  };

  // 加载课程类型数据
  const loadCourseTypes = async () => {
    try {
      setTypesLoading(true);
      const options = await fetchCategoryOptions();
      // 构建符合Constant接口的数据结构
      const typesData = options.map(option => ({
        id: option.value,
        constantKey: '',  // 由于fetchCategoryOptions可能没返回这个字段，这里设置为空字符串
        constantValue: option.label,
        type: 'COURSE_TYPE',
        status: 1
      }));
      
      setCourseTypes(typesData);
      console.log('课程类型数据已加载:', typesData);
    } catch (error) {
      console.error('获取课程类型数据失败', error);
    } finally {
      setTypesLoading(false);
    }
  };

  // 加载教练列表数据
  const loadCoaches = async () => {
    try {
      setCoachesLoading(true);
      const campusId = localStorage.getItem('currentCampusId') || '1';
      const coachList = await coachAPI.getSimpleList(campusId);
      console.log('获取到教练列表:', coachList);
      setCoaches(coachList);
    } catch (error) {
      console.error('获取教练列表失败', error);
    } finally {
      setCoachesLoading(false);
    }
  };

  // 使用表单管理钩子
  const {
    form,
    visible,
    editingCourse,
    loading: formLoading,
    handleAdd: originalHandleAdd,
    handleEdit: originalHandleEdit,
    handleSubmit,
    handleCancel
  } = useCourseForm(addCourse, updateCourse, coaches);

  // 自定义提交方法，不再重新加载课程类型和教练列表
  const customHandleSubmit = async () => {
    try {
      // 调用原始的提交方法
      await handleSubmit();
      // 提交成功后不再调用 loadCourseTypes 和 loadCoaches
    } catch (error) {
      console.error('提交表单时出错:', error);
    }
  };

  // 包装添加和编辑函数
  const handleAdd = () => {
    // 确保课程类型已加载
    if (courseTypes.length === 0) {
      loadCourseTypes().then(() => {
        originalHandleAdd();
      });
    } else {
      originalHandleAdd();
    }
  };

  const handleEdit = (record: Course) => {
    // 确保课程类型已加载
    if (courseTypes.length === 0) {
      loadCourseTypes().then(() => {
        originalHandleEdit(record);
      });
    } else {
      originalHandleEdit(record);
    }
  };

  // 视图模式
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');

  // 详情模态框状态
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [detailCourse, setDetailCourse] = useState<Course | null>(null);

  // 删除确认模态框状态
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletingCourse, setDeletingCourse] = useState<{ id: string; name: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // 加载课程数据
  const loadCourses = async (page = currentPage, size = pageSize) => {
    try {
      console.log('加载课程数据, 页码:', page, '页大小:', size);
      const merged = {
        ...searchParams,
        sortField: tableSortField ?? searchParams.sortField ?? 'status',
        sortOrder: tableSortOrder ? (tableSortOrder === 'ascend' ? 'asc' : 'desc') : (searchParams.sortOrder ?? 'asc')
      } as any;
      await filterCourses(page, size, merged);
    } catch (error) {
      console.error('加载课程数据失败:', error);
    }
  };

  // 首次加载获取数据
  useEffect(() => {
    // 使用setTimeout确保在组件挂载后再加载数据
    const timer = setTimeout(() => {
      if (initialLoadRef.current) {
        console.log('首次加载课程数据');
        loadCourses();
        loadCourseTypes();  // 加载课程类型数据
        loadCoaches();     // 加载教练列表数据
        initialLoadRef.current = false;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // 处理分页变化（携带当前排序）
  const handlePageChange = async (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
    const merged = {
      ...searchParams,
      sortField: tableSortField ?? searchParams.sortField ?? 'status',
      sortOrder: tableSortOrder ? (tableSortOrder === 'ascend' ? 'asc' : 'desc') : (searchParams.sortOrder ?? 'asc')
    } as any;
    await filterCourses(page, size, merged);
  };

  // 处理查看详情
  const handleShowDetail = (record: Course) => {
    setDetailCourse(record);
    setDetailModalVisible(true);
  };

  // 处理删除确认
  const showDeleteConfirm = (id: string, name: string) => {
    setDeletingCourse({ id, name });
    setDeleteModalVisible(true);
  };

  // 执行删除
  const handleDelete = async () => {
    if (deletingCourse) {
      try {
        setDeleteLoading(true);
        await deleteCourse(deletingCourse.id);
        setDeleteModalVisible(false);
        setDeletingCourse(null);
      } catch (error) {
        // 错误已在 deleteCourse 中处理，这里不需要额外处理
        console.error('删除课程失败:', error);
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  // 取消删除
  const handleCancelDelete = () => {
    setDeleteModalVisible(false);
    setDeletingCourse(null);
  };

  // 处理表格排序变化（记录并应用到列表）
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    console.log('表格排序变化 - 原始sorter:', sorter);
    
    // 字段映射
    let orderField = sorter?.field;
    if (orderField === 'price') {
      orderField = 'unitHours';
    } else if (orderField === 'totalHours') {
      orderField = 'totalHours';
    } else if (orderField === 'consumedHours') {
      orderField = 'consumedHours';
    }

    const order = sorter.order === 'ascend' ? 'asc' : sorter.order === 'descend' ? 'desc' : undefined;
    const tableOrderForState: 'ascend' | 'descend' | undefined = sorter.order === 'ascend' ? 'ascend' : sorter.order === 'descend' ? 'descend' : undefined;
    console.log('排序字段:', orderField, '排序顺序:', order);

    // 同步到本地排序状态与搜索hook状态
    setTableSortField(orderField);
    setTableSortOrder(tableOrderForState);

    if (sorter && sorter.field && sorter.order) {
      console.log('设置排序参数 - sortField:', orderField, 'sortOrder:', order);
      setSortField(orderField || 'status');
      setSortOrder(order || 'asc');
      // 直接调用filterCourses，传入最新的排序参数
      const searchParamsWithSort = {
        ...searchParams,
        sortField: orderField || 'status',
        sortOrder: order || 'asc'
      } as any;
      console.log('调用filterCourses，参数:', searchParamsWithSort);
      filterCourses(1, pageSize, searchParamsWithSort);
      setCurrentPage(1);
    } else {
      console.log('清除排序参数，回到默认 status asc');
      setSortField('status');
      setSortOrder('asc');
      setTableSortField(undefined);
      setTableSortOrder(undefined);
      // 清除排序时也直接调用filterCourses（恢复默认 status asc）
      const searchParamsWithoutSort = {
        ...searchParams,
        sortField: 'status',
        sortOrder: 'asc'
      } as any;
      console.log('调用filterCourses（清除排序），参数:', searchParamsWithoutSort);
      filterCourses(1, pageSize, searchParamsWithoutSort);
      setCurrentPage(1);
    }
  };

  return (
    <div className="course-management">
      <Card className="course-management-card">
        <div className="course-header">
          <Title level={4} className="course-title">课程管理</Title>
          <CourseViewToggle
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onAddCourse={handleAdd}
          />
        </div>
        {/* 搜索栏 */}
        <CourseSearchBar
          params={searchParams}
          onSearch={handleSearch}
          onReset={handleReset}
          onTextChange={setSearchText}
          onCategoryChange={setSelectedType}
          onStatusChange={setSelectedStatus}
          onCoachChange={setSelectedCoach}
          onSortOrderChange={setSortOrder}
          cachedTypes={courseTypes}
          cachedCoaches={coaches}
          typesLoading={typesLoading}
          coachesLoading={coachesLoading}
        />

        {/* 数据展示 - 根据视图模式显示表格或卡片 */}
        {viewMode === 'list' ? (
          <CourseTable
            data={courses}
            loading={loading}
            currentPage={currentPage}
            pageSize={pageSize}
            total={totalCount}
            onShowDetail={handleShowDetail}
            onEdit={handleEdit}
            onDelete={showDeleteConfirm}
            onPageChange={handlePageChange}
            onTableChange={handleTableChange} // 传递排序字段
            onShowEnrollments={openEnrollments}
          />
        ) : (
          <CourseCardList
            data={courses}
            loading={loading}
            currentPage={currentPage}
            pageSize={pageSize}
            total={totalCount}
            onEdit={handleEdit}
            onDelete={showDeleteConfirm}
            onPageChange={handlePageChange}
          />
        )}
      </Card>

      {/* 编辑/添加模态框 */}
      <CourseEditModal
        visible={visible}
        editingCourse={editingCourse}
        loading={formLoading}
        form={form}
        onCancel={handleCancel}
        onSubmit={customHandleSubmit}
        cachedTypes={courseTypes}
        cachedCoaches={coaches}
        typesLoading={typesLoading}
        coachesLoading={coachesLoading}
      />

      {/* 详情模态框 */}
      <CourseDetailModal
        visible={detailModalVisible}
        course={detailCourse}
        onCancel={() => setDetailModalVisible(false)}
      />

      {/* 删除确认模态框 */}
      <CourseDeleteModal
        visible={deleteModalVisible}
        courseName={deletingCourse?.name || ''}
        confirmLoading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={handleCancelDelete}
      />

      {/* 报名学员抽屉 */}
      <Drawer
        title={enrollCourse ? `报名学员 - ${enrollCourse.name}` : '报名学员'}
        open={enrollDrawerVisible}
        width={520}
        onClose={() => setEnrollDrawerVisible(false)}
        destroyOnClose
        styles={{ body: { padding: 12 } }}
      >
        <div className="enroll-drawer-wrapper">
          <div className="enroll-drawer-toolbar">
            <Input.Search
              allowClear
              placeholder="搜索姓名/电话"
              onChange={(e) => handleEnrollSearchChange(e.target.value)}
              onSearch={(val) => handleEnrollSearchChange(val)}
              value={enrollSearch}
              style={{ flex: 1 }}
            />
            <Checkbox checked={hideGraduated} onChange={e => handleToggleFilters(e.target.checked, undefined)}>隐藏结业</Checkbox>
            <Checkbox checked={hideRefunded} onChange={e => handleToggleFilters(undefined, e.target.checked)}>隐藏退费</Checkbox>
            <span className="enroll-drawer-summary">共 {filteredEnrolled.length}/{enrollTotal} 人</span>
          </div>

          <div
            ref={enrollScrollRef}
            className="enroll-scroll-container"
            onScroll={handleEnrollScroll}
            style={{ height: '80vh', overflow: 'auto' }}
          >
            <List
              className="enroll-student-list"
              loading={enrollLoading}
              dataSource={filteredEnrolled}
              renderItem={(item: any) => {
                const remaining = (item.remainingHours ?? item.remainingClasses ?? 0) as number;
                const total = (item.totalHours ?? 0) as number;
                const ratio = total > 0 ? remaining / total : 1;
                const pillClass = ratio <= 0.1 ? 'danger' : ratio <= 0.3 ? 'warn' : 'ok';
                const isMale = String(item.gender || item.studentGender || '').toUpperCase() === 'MALE';
                const isFemale = String(item.gender || item.studentGender || '').toUpperCase() === 'FEMALE';
                // 兼容多处字段：优先 courses[0].status（如 waiting_payment），否则用扁平字段
                const nestedStatus = (Array.isArray(item.courses) && item.courses[0]?.status) ? String(item.courses[0].status) : '';
                const rawStatus = nestedStatus || String(item.status || item.courseStatus || item.studentCourseStatus || item.courseStatusText || '');
                const { text: statusText, color: statusColor } = getStatusInfo(rawStatus);
                const statusTag = <Tag color={statusColor === 'error' ? 'red' : statusColor}>{statusText}</Tag>;
                return (
                  <List.Item className="enroll-student-item"
                    actions={[
                      <span key="status">{statusTag}</span>,
                      <Button key="att" type="link" onClick={() => { setAttendStudent(item); setAttendanceModalVisible(true); }}>
                        打卡
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <div className="enroll-student-title">
                          {isMale && <ManOutlined className="gender-icon male" />}
                          {isFemale && <WomanOutlined className="gender-icon female" />}
                          <span>{item.name}</span>
                          <span className="enroll-student-phone" style={{ marginLeft: 8 }}>{item.phone || item.parentPhone || '-'}</span>
                        </div>
                      }
                      description={
                        <span style={{ color: remaining <= 5 ? '#cf1322' : 'inherit' }}>剩余 {remaining} / {total} 课时</span>
                      }
                    />
                  </List.Item>
                );
              }}
            />
            <div style={{ textAlign: 'center', padding: filteredEnrolled.length < enrollTotal ? '8px 0' : '0', color: 'rgba(0,0,0,0.45)' }}>
              {enrolledStudents.length < enrollTotal ? (
                enrollLoadingMore ? <Spin size="small" /> : <span>向下滚动加载更多...</span>
              ) : null}
            </div>
          </div>
        </div>
      </Drawer>

      {/* 打卡模态框复用学生模块 */}
      {attendanceModalVisible && (
        <AttendanceModal
          visible={attendanceModalVisible}
          student={attendStudent as any}
          form={attendanceForm}
          onCancel={() => setAttendanceModalVisible(false)}
          onOk={() => setAttendanceModalVisible(false)}
        />
      )}
    </div>
  );
};

export default CourseManagement;