import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface RegisterFormValues {
  institution: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<RegisterFormValues>({
    institution: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 实际项目中应调用注册API
      // const response = await apiClient.register(formData);

      // 注册成功后跳转到登录页
      navigate('/login', { 
        state: { 
          registered: true,
          message: '注册成功，请登录系统' 
        } 
      });
    } catch (error) {
      setError('注册失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="register-container">
        <div className="logo">
          <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iIzRhNmNmNyIvPjxwYXRoIGQ9Ik0xMjggNDhMMTkyIDEyOEwxMjggMjA4TDY0IDEyOEwxMjggNDhaIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjEwIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTE0NCA2NEwxNDQgMTEyTTExMiA2NEwxMTIgMTEyTTE0NCA4OEwxMTIgODhNMTQ0IDEyOEwxMTIgMTI4TTE0NCAxNjBMMTEyIDE2ME0xNjAgMTQ0TDk2IDE0NCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSI4Ii8+PGNpcmNsZSBjeD0iMTI4IiBjeT0iMzIiIHI9IjE2IiBmaWxsPSJ3aGl0ZSIvPjxwYXRoIGQ9Ik0xMTIgMzJMMTI4IDQ4TDE0NCAzMiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSI4IiBmaWxsPSJub25lIi8+PHRleHQgeD0iMTI4IiB5PSIxODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPuaOpeWPluWPo+S+meS4ujwvdGV4dD48L3N2Zz4=" alt="培训机构Logo" style={{ width: 120 }} />
        </div>
        
        <div className="register-header">
          <h1>培训机构管理系统</h1>
          <p>创建您的机构账户</p>
        </div>
        
        {error && <div style={{ color: 'red', margin: '15px 0', textAlign: 'center' }}>{error}</div>}
        
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="institution">机构名称</label>
            <input 
              type="text" 
              id="institution" 
              name="institution" 
              placeholder="请输入您的机构名称" 
              required
              value={formData.institution}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="username">用户名</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              placeholder="请输入用户名" 
              required
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">电子邮箱</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              placeholder="请输入电子邮箱" 
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              placeholder="请输入密码" 
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">确认密码</label>
            <input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword" 
              placeholder="请再次输入密码" 
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          
          <button type="submit" className="btn" disabled={loading}>
            {loading ? '注册中...' : '注 册'}
          </button>
          
          <div className="login-link">
            已有账户？<Link to="/login">立即登录</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 