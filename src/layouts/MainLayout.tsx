import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { logout } from '@/redux/slices/authSlice';
import { getCampusList } from '@/components/CampusSelector';
import UserProfileModal from '@/components/UserProfileModal';
import { Campus } from '@/api/campus/types';
import { useCampusCheck } from '@/contexts/CampusCheckContext';

// 导入拆分后的组件
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import MainContent from '@/components/MainContent';

// 导入样式
import './MainLayout.css';

const MainLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState('/dashboard');
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentCampus, setCurrentCampus] = useState<Campus | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // 使用校区检查Context
  const { refreshCampusCheck, checkCampusBeforeNavigate } = useCampusCheck();

  // Get user info from redux store
  const auth = useAppSelector((state) => state.auth);
  const username = auth && (auth as any).user?.name || '管理员';
  const userRole = auth && (auth as any).user?.role || '超级管理员';

  // 设置当前活动菜单
  useEffect(() => {
    const pathKey = location.pathname;
    setActiveMenu(pathKey);
  }, [location.pathname]);

  // 初始化加载校区信息 - 只在组件挂载时执行一次
  useEffect(() => {
    // 使用引用来跟踪是否已经加载过校区信息
    const hasLoadedRef = { current: false };

    const loadCampusInfo = async () => {
      // 如果已经加载过，不重复加载
      if (hasLoadedRef.current) {
        console.log('校区信息已经加载过，不重复加载');
        return;
      }

      try {
        // 只有在用户已登录的情况下才加载校区信息
        if (auth.isAuthenticated) {
          console.log('MainLayout: 开始加载校区信息');
          const campusList = await getCampusList();

          if (campusList && campusList.length > 0) {
            // 尝试从localStorage中获取上次选择的校区ID
            const savedCampusId = localStorage.getItem('currentCampusId');
            let selectedCampus = savedCampusId
              ? campusList.find(c => String(c.id) === savedCampusId)
              : campusList[0];

            if (selectedCampus) {
              console.log('MainLayout: 设置当前校区:', selectedCampus.name);

              // 不再调用getDetail接口，直接使用list接口返回的完整信息
              // 优化说明：/campus/list接口已经返回了校区的所有必要信息，包括管理员、联系电话等
              // 不需要再额外调用/campus/detail接口，减少不必要的网络请求，提高性能
              setCurrentCampus(selectedCampus);
              
              // 将校区完整信息存储到localStorage中，供其他组件使用
              localStorage.setItem('currentCampusId', String(selectedCampus.id));
              localStorage.setItem('currentCampusName', selectedCampus.name);
              
              // 存储校区的其他重要信息
              if (selectedCampus.managerName) {
                localStorage.setItem('currentCampusManagerName', selectedCampus.managerName);
              }
              if (selectedCampus.managerPhone) {
                localStorage.setItem('currentCampusManagerPhone', selectedCampus.managerPhone);
              }
              if (selectedCampus.address) {
                localStorage.setItem('currentCampusAddress', selectedCampus.address);
              }
              if (selectedCampus.status) {
                localStorage.setItem('currentCampusStatus', selectedCampus.status);
              }
              
              // 也可以选择将整个校区对象序列化后存储，便于获取所有信息
              try {
                localStorage.setItem('currentCampusDetail', JSON.stringify(selectedCampus));
              } catch (error) {
                console.error('存储校区详情到localStorage失败:', error);
              }
            }
          }

          // 更新校区检查状态
          refreshCampusCheck();

          // 标记为已加载
          hasLoadedRef.current = true;
        }
      } catch (error) {
        console.error('加载校区信息失败:', error);
      }
    };

    loadCampusInfo();
    // 不将 refreshCampusCheck 添加到依赖数组中，避免重复调用
  }, [auth.isAuthenticated]);

  // 处理菜单点击
  const handleMenuClick = async (e: React.MouseEvent, path: string) => {
    e.preventDefault();

    // 使用校区检查逻辑，只有校区检查通过才导航
    const canProceed = await checkCampusBeforeNavigate(path);

    if (canProceed) {
      // 导航到目标页面
      navigate(path);
      setActiveMenu(path);
    }
    // 如果canProceed为false，表示没有校区，此时已显示模态框，不进行导航
  };

  // 处理校区切换 - 不再调用 detail API
  const handleCampusChange = (campus: Campus) => {
    console.log('切换到校区:', campus.name);

    // 直接使用从列表中获取的校区信息，不再调用 detail API
    // 优化说明：从校区列表中获取的校区信息已经包含了所有必要数据，不需要再调用detail接口
    setCurrentCampus(campus);

    // 将校区完整信息存储到localStorage中，供其他组件使用
    localStorage.setItem('currentCampusId', String(campus.id));
    localStorage.setItem('currentCampusName', campus.name);
    
    // 存储校区的其他重要信息
    if (campus.managerName) {
      localStorage.setItem('currentCampusManagerName', campus.managerName);
    }
    if (campus.managerPhone) {
      localStorage.setItem('currentCampusManagerPhone', campus.managerPhone);
    }
    if (campus.address) {
      localStorage.setItem('currentCampusAddress', campus.address);
    }
    if (campus.status) {
      localStorage.setItem('currentCampusStatus', campus.status);
    }
    
    // 也可以选择将整个校区对象序列化后存储，便于获取所有信息
    try {
      localStorage.setItem('currentCampusDetail', JSON.stringify(campus));
    } catch (error) {
      console.error('存储校区详情到localStorage失败:', error);
    }
  };

  // 处理登出
  const handleLogout = () => {
    dispatch(logout());
    navigate('/home');
  };

  // 切换主题
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  // Toggle sidebar collapse state
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);

    // On mobile, we need different behavior
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      // For mobile, collapsed actually means visible/expanded
      document.body.style.overflow = !sidebarCollapsed ? 'hidden' : '';
    }
  };

  // Check window size for responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarCollapsed(true); // Start collapsed on mobile (which means hidden)
      } else {
        setSidebarCollapsed(false); // Start expanded on desktop
        document.body.style.overflow = '';
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = '';
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.user-info')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="container">
      {/* 侧边栏组件 */}
      <Sidebar 
        sidebarCollapsed={sidebarCollapsed}
        toggleSidebar={toggleSidebar}
        isDarkTheme={isDarkTheme}
        activeMenu={activeMenu}
        handleMenuClick={handleMenuClick}
      />

      {/* 主内容区 */}
      <MainContent sidebarCollapsed={sidebarCollapsed} />

      {/* 头部组件 */}
      <Header 
        isDarkTheme={isDarkTheme}
        toggleTheme={toggleTheme}
        currentCampus={currentCampus}
        handleCampusChange={handleCampusChange}
        username={username}
        userRole={userRole}
        handleLogout={handleLogout}
        setShowProfileModal={setShowProfileModal}
        sidebarCollapsed={sidebarCollapsed}
      />

      {/* 个人信息模态框 */}
      <UserProfileModal
        visible={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </div>
  );
};

export default MainLayout;