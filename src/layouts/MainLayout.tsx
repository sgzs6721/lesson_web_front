import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { logout } from '@/redux/slices/authSlice';

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
    navigate('/home');
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
            <Link to="/home" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" style={{ height: '60px', marginBottom: '10px' }}>
                {/* 简化日历/课表元素 */}
                <rect x="50" y="50" width="100" height="100" rx="10" ry="10" fill="#ffffff" stroke="#4285f4" strokeWidth="5"/>
                
                {/* 日历顶部条 */}
                <rect x="50" y="50" width="100" height="20" rx="10" ry="10" fill="#4285f4"/>
                
                {/* 简化日历线条 */}
                <line x1="50" y1="90" x2="150" y2="90" stroke="#4285f4" strokeWidth="2.5"/>
                <line x1="50" y1="130" x2="150" y2="130" stroke="#4285f4" strokeWidth="2.5"/>
                <line x1="83" y1="70" x2="83" y2="150" stroke="#4285f4" strokeWidth="2.5"/>
                <line x1="117" y1="70" x2="117" y2="150" stroke="#4285f4" strokeWidth="2.5"/>
                
                {/* 钟表指针，代表时间/课时 */}
                <circle cx="100" cy="110" r="25" fill="#ffffff" stroke="#4285f4" strokeWidth="4"/>
                <line x1="100" y1="110" x2="100" y2="93" stroke="#4285f4" strokeWidth="4" strokeLinecap="round"/>
                <line x1="100" y1="110" x2="114" y2="110" stroke="#4285f4" strokeWidth="4" strokeLinecap="round"/>
                <circle cx="100" cy="110" r="4" fill="#4285f4"/>
              </svg>
              <h1 style={{ fontSize: '20px', textAlign: 'center' }}>培训机构管理系统</h1>
              <p style={{ opacity: 0.7, marginTop: '5px', fontSize: '12px', textAlign: 'center' }}>核心业务管理平台</p>
            </Link>
          ) : (
            <Link to="/home" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '10px 0' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" style={{ height: '45px' }}>
                {/* 简化日历/课表元素 */}
                <rect x="50" y="50" width="100" height="100" rx="10" ry="10" fill="#ffffff" stroke="#4285f4" strokeWidth="5"/>
                
                {/* 日历顶部条 */}
                <rect x="50" y="50" width="100" height="20" rx="10" ry="10" fill="#4285f4"/>
                
                {/* 简化日历线条 */}
                <line x1="50" y1="90" x2="150" y2="90" stroke="#4285f4" strokeWidth="2.5"/>
                <line x1="50" y1="130" x2="150" y2="130" stroke="#4285f4" strokeWidth="2.5"/>
                <line x1="83" y1="70" x2="83" y2="150" stroke="#4285f4" strokeWidth="2.5"/>
                <line x1="117" y1="70" x2="117" y2="150" stroke="#4285f4" strokeWidth="2.5"/>
                
                {/* 钟表指针，代表时间/课时 */}
                <circle cx="100" cy="110" r="25" fill="#ffffff" stroke="#4285f4" strokeWidth="4"/>
                <line x1="100" y1="110" x2="100" y2="93" stroke="#4285f4" strokeWidth="4" strokeLinecap="round"/>
                <line x1="100" y1="110" x2="114" y2="110" stroke="#4285f4" strokeWidth="4" strokeLinecap="round"/>
                <circle cx="100" cy="110" r="4" fill="#4285f4"/>
              </svg>
            </Link>
          )}
          <button 
            className="sidebar-toggle" 
            onClick={toggleSidebar} 
            title={sidebarCollapsed ? "展开菜单" : "收起菜单"}
            style={{ 
              top: sidebarCollapsed ? '45px' : 'auto', 
              bottom: sidebarCollapsed ? 'auto' : '10px',
              right: sidebarCollapsed ? '50%' : '10px',
              marginRight: sidebarCollapsed ? '-12px' : '0',
              position: 'absolute',
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              color: 'white',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s',
              zIndex: 101
            }}
          >
            {sidebarCollapsed ? '❯' : '❮'}
          </button>
        </div>

        <ul className="sidebar-menu">
          <li><a href="#" onClick={(e) => handleMenuClick(e, '/dashboard')} className={activeMenu === '/dashboard' ? 'active' : ''}><i>🏠</i> {!sidebarCollapsed && <span>首页</span>}</a></li>
          <li><a href="#" onClick={(e) => handleMenuClick(e, '/campuses')} className={activeMenu === '/campuses' ? 'active' : ''}><i>🏢</i> {!sidebarCollapsed && <span>校区管理</span>}</a></li>
          <li><a href="#" onClick={(e) => handleMenuClick(e, '/users')} className={activeMenu === '/users' ? 'active' : ''}><i>👤</i> {!sidebarCollapsed && <span>用户管理</span>}</a></li>
          <li><a href="#" onClick={(e) => handleMenuClick(e, '/coaches')} className={activeMenu === '/coaches' ? 'active' : ''}><i>🏋️</i> {!sidebarCollapsed && <span>教练管理</span>}</a></li>
          <li><a href="#" onClick={(e) => handleMenuClick(e, '/courses')} className={activeMenu === '/courses' ? 'active' : ''}><i>📚</i> {!sidebarCollapsed && <span>课程管理</span>}</a></li>
          <li><a href="#" onClick={(e) => handleMenuClick(e, '/students')} className={activeMenu === '/students' ? 'active' : ''}><i>👨‍🎓</i> {!sidebarCollapsed && <span>学员管理</span>}</a></li>
          <li><a href="#" onClick={(e) => handleMenuClick(e, '/schedules')} className={activeMenu === '/schedules' ? 'active' : ''}><i>📅</i> {!sidebarCollapsed && <span>课表管理</span>}</a></li>
          <li><a href="#" onClick={(e) => handleMenuClick(e, '/attendance')} className={activeMenu === '/attendance' ? 'active' : ''}><i>✅</i> {!sidebarCollapsed && <span>打卡消课</span>}</a></li>
          <li><a href="#" onClick={(e) => handleMenuClick(e, '/payments')} className={activeMenu === '/payments' ? 'active' : ''}><i>💰</i> {!sidebarCollapsed && <span>缴费记录</span>}</a></li>
          <li><a href="#" onClick={(e) => handleMenuClick(e, '/expenses')} className={activeMenu === '/expenses' ? 'active' : ''}><i>💸</i> {!sidebarCollapsed && <span>支出管理</span>}</a></li>
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
          padding: '12px 20px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease'
        }}>
          <div className="campus-info-content" style={{ width: '100%' }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column'
            }}>
              {/* 第一行：校区名称和管理员信息 */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: '6px'
              }}>
                <div className="campus-name" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  flexWrap: 'nowrap'
                }}>
                  {currentCampus}
                  <div className="campus-status-badge" style={{ 
                    marginLeft: '15px', 
                    marginBottom: '0', 
                    whiteSpace: 'nowrap',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    fontWeight: '500',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}>正常运营中</div>
                </div>
                
                <div className="user-info" onClick={toggleDropdown} style={{ 
                  background: 'transparent', 
                  display: 'flex', 
                  alignItems: 'center',
                  height: '100%',
                  padding: '0 15px',
                  cursor: 'pointer',
                  position: 'relative',
                  marginTop: 'auto',
                  marginBottom: 'auto'
                }}>
                  <div className="user-avatar" style={{ 
                    height: '44px', 
                    width: '44px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontSize: '20px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '2px solid rgba(255, 255, 255, 0.5)',
                    borderRadius: '50%'
                  }}>{username.charAt(0).toUpperCase()}</div>
                  <div style={{ 
                    color: 'white',
                    marginLeft: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    height: '44px',
                    lineHeight: '1.2'
                  }}>
                    <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '2px' }}>{username}</div>
                    <div style={{ fontSize: '13px', opacity: '0.9' }}>超级管理员</div>
                  </div>
                  <div className={`dropdown-content ${showDropdown ? 'show' : ''}`}>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('/settings/profile'); }}>设置</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('/settings/password'); }}>修改密码</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }}>登出</a>
                  </div>
                </div>
              </div>
              
              {/* 第二行：校区选择器、负责人和联系电话 */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center'
              }}>
                {/* 校区选择器 */}
                <div style={{ 
                  position: 'relative', 
                  marginRight: '25px',
                  height: '34px',
                  minWidth: '120px'
                }}>
                  <button 
                    onClick={toggleCampusList}
                    style={{
                      padding: '6px 16px',
                      background: 'rgba(255, 255, 255, 0.15)',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      color: 'white',
                      fontSize: '15px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      height: '34px',
                      width: '100%',
                      justifyContent: 'center'
                    }}
                  >
                    校区选择 <span style={{ marginLeft: '6px', fontSize: '12px' }}>▼</span>
                  </button>
                  
                  {showCampusList && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: '0',
                      backgroundColor: '#fff',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      borderRadius: '4px',
                      padding: '8px 0',
                      marginTop: '5px',
                      zIndex: 1000,
                      minWidth: '150px'
                    }}>
                      {['总部校区', '东城校区', '西城校区', '南城校区', '北城校区', '天骄校区'].map(campus => (
                        <div 
                          key={campus}
                          style={{ 
                            padding: '8px 15px', 
                            cursor: 'pointer', 
                            color: '#333', 
                            backgroundColor: currentCampus === campus ? 'rgba(52, 152, 219, 0.1)' : 'transparent' 
                          }}
                          onClick={(e) => { e.stopPropagation(); selectCampus(campus); }}
                        >
                          {campus}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* 负责人信息 */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  marginRight: '25px',
                  height: '34px'
                }}>
                  <i style={{ 
                    color: 'rgba(255, 255, 255, 0.9)', 
                    background: 'rgba(255, 255, 255, 0.2)', 
                    borderRadius: '50%', 
                    width: '24px', 
                    height: '24px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '13px' 
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664z"/>
                    </svg>
                  </i>
                  <span style={{ color: 'white', fontSize: '15px', whiteSpace: 'nowrap' }}>负责人：张明</span>
                </div>
                
                {/* 联系电话信息 */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  height: '34px'
                }}>
                  <i style={{ 
                    color: 'rgba(255, 255, 255, 0.9)', 
                    background: 'rgba(255, 255, 255, 0.2)', 
                    borderRadius: '50%', 
                    width: '24px', 
                    height: '24px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '13px' 
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                    </svg>
                  </i>
                  <span style={{ color: 'white', fontSize: '15px', whiteSpace: 'nowrap' }}>联系电话：13800138001</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="content-panel" style={{ marginTop: '110px' }}>
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