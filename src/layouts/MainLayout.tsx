import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { logout } from '@/redux/slices/authSlice';
import '@/assets/styles/index.css';

const MainLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState('/dashboard');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCampusList, setShowCampusList] = useState(false);
  const [currentCampus, setCurrentCampus] = useState('总部校区');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Get user info from redux store
  const auth = useAppSelector((state) => state.auth);
  const username = auth && (auth as any).user?.username || '管理员';

  useEffect(() => {
    const pathKey = location.pathname;
    setActiveMenu(pathKey);
  }, [location.pathname]);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
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
  
  // Close sidebar when clicking on menu item on mobile
  const handleMenuClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path);
    
    const isMobile = window.innerWidth <= 768;
    if (isMobile && !sidebarCollapsed) {
      setSidebarCollapsed(true);
      document.body.style.overflow = '';
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
      if (!(e.target as HTMLElement).closest('.campus-selector')) {
        setShowCampusList(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  // Toggle campus list visibility
  const toggleCampusList = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCampusList(!showCampusList);
  };

  const selectCampus = (campus: string) => {
    setCurrentCampus(campus);
    setShowCampusList(false);
  };

  return (
    <div className="container">
      {/* 侧边栏 */}
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          {!sidebarCollapsed ? (
            <>
              <div style={{ fontSize: '32px', textAlign: 'center' }}>🏫</div>
              <h1 style={{ fontSize: '20px', textAlign: 'center' }}>培训机构管理系统</h1>
              <p style={{ opacity: 0.7, marginTop: '5px', fontSize: '12px', textAlign: 'center' }}>核心业务管理平台</p>
            </>
          ) : (
            <div style={{ fontSize: '32px', textAlign: 'center', marginTop: '10px' }}>🏫</div>
          )}
          <button className="sidebar-toggle" onClick={toggleSidebar} title={sidebarCollapsed ? "展开菜单" : "收起菜单"}>
            {sidebarCollapsed ? '❯' : '❮'}
          </button>
        </div>

        <ul className="sidebar-menu">
          <li><a href="#" onClick={(e) => handleMenuClick(e, '/dashboard')} className={activeMenu === '/dashboard' ? 'active' : ''}><i>📊</i> {!sidebarCollapsed && <span>仪表盘</span>}</a></li>
          <li><a href="#" onClick={(e) => handleMenuClick(e, '/campuses')} className={activeMenu === '/campuses' ? 'active' : ''}><i>🏢</i> {!sidebarCollapsed && <span>校区管理</span>}</a></li>
          <li><a href="#" onClick={(e) => handleMenuClick(e, '/users')} className={activeMenu === '/users' ? 'active' : ''}><i>👤</i> {!sidebarCollapsed && <span>用户管理</span>}</a></li>
          <li><a href="#" onClick={(e) => handleMenuClick(e, '/coaches')} className={activeMenu === '/coaches' ? 'active' : ''}><i>🏋️</i> {!sidebarCollapsed && <span>教练管理</span>}</a></li>
          <li><a href="#" onClick={(e) => handleMenuClick(e, '/courses')} className={activeMenu === '/courses' ? 'active' : ''}><i>📚</i> {!sidebarCollapsed && <span>课程管理</span>}</a></li>
          <li><a href="#" onClick={(e) => handleMenuClick(e, '/students')} className={activeMenu === '/students' ? 'active' : ''}><i>👨‍🎓</i> {!sidebarCollapsed && <span>学员管理</span>}</a></li>
          <li><a href="#" onClick={(e) => handleMenuClick(e, '/payments')} className={activeMenu === '/payments' ? 'active' : ''}><i>💰</i> {!sidebarCollapsed && <span>缴费记录</span>}</a></li>
          <li><a href="#" onClick={(e) => handleMenuClick(e, '/expenses')} className={activeMenu === '/expenses' ? 'active' : ''}><i>💸</i> {!sidebarCollapsed && <span>支出管理</span>}</a></li>
          <li><a href="#" onClick={(e) => handleMenuClick(e, '/schedules')} className={activeMenu === '/schedules' ? 'active' : ''}><i>📅</i> {!sidebarCollapsed && <span>课表管理</span>}</a></li>
          <li><a href="#" onClick={(e) => handleMenuClick(e, '/attendance')} className={activeMenu === '/attendance' ? 'active' : ''}><i>✅</i> {!sidebarCollapsed && <span>打卡与消课</span>}</a></li>
          <li><a href="#" onClick={(e) => handleMenuClick(e, '/miniprogram')} className={activeMenu === '/miniprogram' ? 'active' : ''}><i>📱</i> {!sidebarCollapsed && <span>小程序管理</span>}</a></li>
          <li><a href="#" onClick={(e) => handleMenuClick(e, '/statistics')} className={activeMenu === '/statistics' ? 'active' : ''}><i>📈</i> {!sidebarCollapsed && <span>数据统计</span>}</a></li>
          <li><a href="#" onClick={(e) => handleMenuClick(e, '/analysis')} className={activeMenu === '/analysis' ? 'active' : ''}><i>🏢</i> {!sidebarCollapsed && <span>校区分析</span>}</a></li>
          <li><a href="#" onClick={(e) => handleMenuClick(e, '/settings')} className={activeMenu === '/settings' ? 'active' : ''}><i>⚙️</i> {!sidebarCollapsed && <span>系统设置</span>}</a></li>
        </ul>
      </div>

      {/* 主内容区 */}
      <div className="main-content">
        {/* Show campus info on all pages */}
        <div className="campus-info" style={{ 
          margin: '0', 
          position: 'fixed', 
          top: '0', 
          left: sidebarCollapsed ? '70px' : '240px',
          right: '0',
          zIndex: '999',
          width: 'auto',
          backgroundColor: '#374263',
          padding: '8px 20px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease'
        }}>
          <div className="campus-info-content">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="campus-name" style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', fontSize: '18px' }}>
                {currentCampus}
                <div className="campus-status-badge" style={{ marginLeft: '15px', marginBottom: '0', whiteSpace: 'nowrap' }}>正常运营中</div>
              </div>
              <div className="user-info" onClick={toggleDropdown} style={{ background: 'transparent' }}>
                <div className="user-avatar">{username.charAt(0).toUpperCase()}</div>
                <div style={{ color: 'white' }}>
                  <div style={{ fontWeight: 600 }}>{username}</div>
                  <div style={{ fontSize: '12px', opacity: '0.9' }}>超级管理员</div>
                </div>
                <div className={`dropdown-content ${showDropdown ? 'show' : ''}`}>
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate('/settings/profile'); }}>设置</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); navigate('/settings/password'); }}>修改密码</a>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>登出</a>
                </div>
              </div>
            </div>
            
            <div className="campus-details" style={{ display: 'flex', flexDirection: 'row', marginTop: '6px', gap: '30px', alignItems: 'center' }}>
              {/* 校区选择器 - 简化样式，无箭头 */}
              <div className="campus-selector" style={{
                padding: '0',
                position: 'relative',
                display: 'inline-block'
              }}>
                <div 
                  className={`campus-header ${showCampusList ? 'active' : ''}`}
                  onClick={toggleCampusList}
                  style={{
                    padding: '4px 12px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                    切换校区
                  </span>
                </div>
                {showCampusList && (
                  <ul className="campus-list show" style={{
                    position: 'absolute',
                    top: '100%',
                    left: '0',
                    right: 'auto',
                    backgroundColor: '#fff',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    borderRadius: '4px',
                    padding: '8px 0',
                    marginTop: '5px',
                    zIndex: 1000,
                    minWidth: '150px'
                  }}>
                    <li className={`campus-item ${currentCampus === '总部校区' ? 'active' : ''}`} 
                        onClick={(e) => { e.stopPropagation(); selectCampus('总部校区'); }}
                        style={{ 
                          padding: '8px 15px',
                          cursor: 'pointer',
                          color: '#333',
                          backgroundColor: currentCampus === '总部校区' ? 'rgba(52, 152, 219, 0.1)' : 'transparent',
                          transition: 'all 0.2s ease'
                        }}>总部校区</li>
                    <li className={`campus-item ${currentCampus === '东城校区' ? 'active' : ''}`} 
                        onClick={(e) => { e.stopPropagation(); selectCampus('东城校区'); }}
                        style={{ 
                          padding: '8px 15px',
                          cursor: 'pointer',
                          color: '#333',
                          backgroundColor: currentCampus === '东城校区' ? 'rgba(52, 152, 219, 0.1)' : 'transparent' 
                        }}>东城校区</li>
                    <li className={`campus-item ${currentCampus === '西城校区' ? 'active' : ''}`} 
                        onClick={(e) => { e.stopPropagation(); selectCampus('西城校区'); }}
                        style={{ 
                          padding: '8px 15px',
                          cursor: 'pointer',
                          color: '#333',
                          backgroundColor: currentCampus === '西城校区' ? 'rgba(52, 152, 219, 0.1)' : 'transparent' 
                        }}>西城校区</li>
                    <li className={`campus-item ${currentCampus === '南城校区' ? 'active' : ''}`} 
                        onClick={(e) => { e.stopPropagation(); selectCampus('南城校区'); }}
                        style={{ 
                          padding: '8px 15px',
                          cursor: 'pointer',
                          color: '#333',
                          backgroundColor: currentCampus === '南城校区' ? 'rgba(52, 152, 219, 0.1)' : 'transparent' 
                        }}>南城校区</li>
                    <li className={`campus-item ${currentCampus === '北城校区' ? 'active' : ''}`} 
                        onClick={(e) => { e.stopPropagation(); selectCampus('北城校区'); }}
                        style={{ 
                          padding: '8px 15px',
                          cursor: 'pointer',
                          color: '#333',
                          backgroundColor: currentCampus === '北城校区' ? 'rgba(52, 152, 219, 0.1)' : 'transparent' 
                        }}>北城校区</li>
                    <li className={`campus-item ${currentCampus === '天骄校区' ? 'active' : ''}`} 
                        onClick={(e) => { e.stopPropagation(); selectCampus('天骄校区'); }}
                        style={{ 
                          padding: '8px 15px',
                          cursor: 'pointer',
                          color: '#333',
                          backgroundColor: currentCampus === '天骄校区' ? 'rgba(52, 152, 219, 0.1)' : 'transparent' 
                        }}>天骄校区</li>
                  </ul>
                )}
              </div>
              
              {/* 联系信息容器 - 让两个信息项横向对齐并使用相同宽度的容器 */}
              <div style={{ display: 'flex', gap: '30px', flexWrap: 'nowrap', flex: 1 }}>
                <div className="campus-detail-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap', minWidth: '140px' }}>
                  <i style={{ color: 'rgba(255, 255, 255, 0.9)', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>👨‍💼</i>
                  <span>负责人：张明</span>
                </div>
                <div className="campus-detail-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                  <i style={{ color: 'rgba(255, 255, 255, 0.9)', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>📱</i>
                  <span>联系电话：13800138001</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="content-panel" style={{ marginTop: '70px' }}>
          <div className="header" style={{ display: 'none' }}>
            <h1 className="page-title">
              {activeMenu.startsWith('/dashboard') ? '数据概览' : 
               activeMenu.startsWith('/campuses') ? '校区管理' : 
               activeMenu.startsWith('/users') ? '用户管理' : 
               activeMenu.startsWith('/coaches') ? '教练管理' : 
               activeMenu.startsWith('/courses') ? '课程管理' : 
               activeMenu.startsWith('/students') ? '学员管理' : 
               activeMenu.startsWith('/payments') ? '缴费记录' : 
               activeMenu.startsWith('/expenses') ? '支出管理' : 
               activeMenu.startsWith('/schedules') ? '课表管理' : 
               activeMenu.startsWith('/attendance') ? '打卡与消课' : 
               activeMenu.startsWith('/miniprogram') ? '小程序管理' : 
               activeMenu.startsWith('/statistics') ? '数据统计' : 
               activeMenu.startsWith('/analysis') ? '校区分析' : 
               activeMenu.startsWith('/settings') ? '系统设置' : '未知页面'}
            </h1>
          </div>
          
          {/* 主要内容，使用Outlet渲染嵌套路由内容 */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout; 