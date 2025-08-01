import { Link } from 'react-router-dom';
import {
  HomeTwoTone,
  BankTwoTone,
  UserOutlined,
  TeamOutlined,
  CalendarTwoTone,
  CheckSquareTwoTone,
  DollarCircleTwoTone,
  BarChartOutlined,
  SettingTwoTone,
  ReadOutlined,
  UserSwitchOutlined,
  LineChartOutlined
} from '@ant-design/icons';

interface SidebarProps {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  isDarkTheme: boolean;
  activeMenu: string;
  handleMenuClick: (e: React.MouseEvent, path: string) => Promise<void>;
  institutionName?: string; // 添加机构名称属性
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarCollapsed,
  toggleSidebar,
  isDarkTheme,
  activeMenu,
  handleMenuClick,
  institutionName
}) => {
  return (
    <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${isDarkTheme ? 'dark-theme' : ''}`}>
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
            <h1 style={{ fontSize: '20px', textAlign: 'center' }}>{institutionName || "培训机构管理系统"}</h1>
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

      <ul className="sidebar-menu" style={{ padding: '0 15px' }}>
        <li><a href="#" onClick={(e) => handleMenuClick(e, '/dashboard')} className={activeMenu === '/dashboard' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center' }}><HomeTwoTone style={{ marginRight: '6px', fontSize: '18px' }} twoToneColor="#1890ff" /> {!sidebarCollapsed && <span>首页</span>}</a></li>
        <li><a href="#" onClick={(e) => handleMenuClick(e, '/campuses')} className={activeMenu === '/campuses' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center' }}><BankTwoTone style={{ marginRight: '6px', fontSize: '18px' }} twoToneColor="#52c41a" /> {!sidebarCollapsed && <span>校区管理</span>}</a></li>
        <li><a href="#" onClick={(e) => handleMenuClick(e, '/users')} className={activeMenu === '/users' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center' }}><UserOutlined style={{ marginRight: '6px', fontSize: '18px', color: '#722ed1' }} /> {!sidebarCollapsed && <span>用户管理</span>}</a></li>
        <li><a href="#" onClick={(e) => handleMenuClick(e, '/coaches')} className={activeMenu === '/coaches' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center' }}><TeamOutlined style={{ marginRight: '6px', fontSize: '18px', color: '#eb2f96' }} /> {!sidebarCollapsed && <span>教练管理</span>}</a></li>
        <li><a href="#" onClick={(e) => handleMenuClick(e, '/courses')} className={activeMenu === '/courses' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center' }}><ReadOutlined style={{ marginRight: '6px', fontSize: '18px', color: '#fa8c16' }} /> {!sidebarCollapsed && <span>课程管理</span>}</a></li>
        <li><a href="#" onClick={(e) => handleMenuClick(e, '/students')} className={activeMenu === '/students' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center' }}><UserSwitchOutlined style={{ marginRight: '6px', fontSize: '18px', color: '#13c2c2' }} /> {!sidebarCollapsed && <span>学员管理</span>}</a></li>
        <li><a href="#" onClick={(e) => handleMenuClick(e, '/schedules')} className={activeMenu === '/schedules' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center' }}><CalendarTwoTone style={{ marginRight: '6px', fontSize: '18px' }} twoToneColor="#f5222d" /> {!sidebarCollapsed && <span>课表管理</span>}</a></li>
        <li><a href="#" onClick={(e) => handleMenuClick(e, '/attendance')} className={activeMenu === '/attendance' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center' }}><CheckSquareTwoTone style={{ marginRight: '6px', fontSize: '18px' }} twoToneColor="#faad14" /> {!sidebarCollapsed && <span>出勤记录</span>}</a></li>
        <li><a href="#" onClick={(e) => handleMenuClick(e, '/payments')} className={activeMenu === '/payments' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center' }}><DollarCircleTwoTone style={{ marginRight: '6px', fontSize: '18px' }} twoToneColor="#52c41a" /> {!sidebarCollapsed && <span>缴费记录</span>}</a></li>
        <li><a href="#" onClick={(e) => handleMenuClick(e, '/expenses')} className={activeMenu === '/expenses' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center' }}><DollarCircleTwoTone style={{ marginRight: '6px', fontSize: '18px' }} twoToneColor="#1890ff" /> {!sidebarCollapsed && <span>收支管理</span>}</a></li>
        <li><a href="#" onClick={(e) => handleMenuClick(e, '/statistics')} className={activeMenu === '/statistics' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center' }}><BarChartOutlined style={{ marginRight: '6px', fontSize: '18px', color: '#faad14' }} /> {!sidebarCollapsed && <span>数据统计</span>}</a></li>
        <li><a href="#" onClick={(e) => handleMenuClick(e, '/analysis')} className={activeMenu === '/analysis' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center' }}><LineChartOutlined style={{ marginRight: '6px', fontSize: '18px', color: '#2f54eb' }} /> {!sidebarCollapsed && <span>校区分析</span>}</a></li>
        <li><a href="#" onClick={(e) => handleMenuClick(e, '/settings')} className={activeMenu === '/settings' ? 'active' : ''} style={{ display: 'flex', alignItems: 'center' }}><SettingTwoTone style={{ marginRight: '6px', fontSize: '18px' }} twoToneColor="#722ed1" /> {!sidebarCollapsed && <span>系统设置</span>}</a></li>
      </ul>
    </div>
  );
};

export default Sidebar; 