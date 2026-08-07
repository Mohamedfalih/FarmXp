import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState('FARMER');
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.identifier || !formData.password) {
      setError('Please enter both phone/email and password.');
      return;
    }

    setLoading(true);
    try {
      const data = await authService.login({ ...formData, role: selectedRole }); // swap for real API later

      if (data.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/farmer/dashboard');
      }
    } catch (err) {
      setError('Invalid phone/email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stage">
      <div className="auth-card">
        <div className="auth-band"></div>

        <div className="auth-logo">
          <span className="mark">🌾</span>
          <span className="word">FarmXP</span>
        </div>

        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Log in to your FarmXP account</p>

        {/* Farmer / Admin role toggle */}
        <div className="role-toggle">
          <button
            type="button"
            className={`role-btn ${selectedRole === 'FARMER' ? 'active' : ''}`}
            onClick={() => handleRoleSelect('FARMER')}
          >
            🌾 Farmer
          </button>
          <button
            type="button"
            className={`role-btn ${selectedRole === 'ADMIN' ? 'active' : ''}`}
            onClick={() => handleRoleSelect('ADMIN')}
          >
            🛠️ Admin
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label>📱 Phone number or email</label>
            <input
              type="text"
              name="identifier"
              placeholder="98765 43210"
              value={formData.identifier}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>🔒 Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="auth-forgot-row">
            <button
              type="button"
              className="btn-ghost forgot-link"
              onClick={() => navigate('/forgot-password')}
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Logging in…' : `Log In as ${selectedRole === 'ADMIN' ? 'Admin' : 'Farmer'}`}
          </button>

          {selectedRole === 'FARMER' && (
            <div className="auth-foot">
              New to FarmXP?{' '}
              <b onClick={() => navigate('/register')}>Create an account</b>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;