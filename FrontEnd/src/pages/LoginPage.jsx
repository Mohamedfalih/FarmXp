import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState('FARMER');

  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ==========================================================
  // INPUT CHANGE
  // ==========================================================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    // Remove previous error when user starts typing
    if (error) {
      setError('');
    }
  };

  // ==========================================================
  // ROLE SELECT
  // ==========================================================

  const handleRoleSelect = (role) => {

    setSelectedRole(role);
    setError('');
  };

  // ==========================================================
  // LOGIN
  // ==========================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');

    const identifier =
      formData.identifier.trim();

    const password =
      formData.password;

    // ========================================================
    // VALIDATION
    // ========================================================

    if (!identifier || !password) {

      setError(
        'Please enter both username/email and password.'
      );

      return;
    }

    setLoading(true);

    try {

      // ======================================================
      // SEND LOGIN REQUEST
      //
      // Backend:
      // POST /api/auth/login
      //
      // {
      //   "username": identifier,
      //   "password": password
      // }
      // ======================================================

      const data =
        await authService.login({
          identifier: identifier,
          password: password,
          role: selectedRole
        });

      // ======================================================
      // VERIFY RESPONSE
      // ======================================================

      if (!data || !data.token) {

        throw new Error(
          'Login failed. Authentication token was not received.'
        );
      }

      // ======================================================
      // ROLE FROM BACKEND
      // ======================================================

      const backendRole =
        data.role?.toUpperCase();

      // ======================================================
      // ADMIN
      // ======================================================

      if (backendRole === 'ADMIN') {

        navigate('/admin/dashboard', {
          replace: true
        });

        return;
      }

      // ======================================================
      // FARMER
      // ======================================================

      if (backendRole === 'FARMER') {

        navigate('/farmer/dashboard', {
          replace: true
        });

        return;
      }

      // ======================================================
      // UNKNOWN ROLE
      // ======================================================

      throw new Error(
        'Login successful, but the account role is invalid.'
      );

    } catch (err) {

      console.error(
        'Login failed:',
        err.response?.data ||
        err.message ||
        err
      );

      // ======================================================
      // SHOW ACTUAL BACKEND ERROR
      // ======================================================

      const backendMessage =
        err.response?.data?.message;

      if (backendMessage) {

        setError(
          backendMessage
        );

      } else if (err.message) {

        setError(
          err.message
        );

      } else {

        setError(
          'Unable to login. Please check your credentials and try again.'
        );
      }

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
        <p className="auth-subtitle">
          Log in to your FarmXP account
        </p>

        {/* Farmer / Admin role toggle */}
        <div className="role-toggle">

          <button
            type="button"
            className={`role-btn ${
              selectedRole === 'FARMER'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              handleRoleSelect('FARMER')
            }
          >
            🌾 Farmer
          </button>

          <button
            type="button"
            className={`role-btn ${
              selectedRole === 'ADMIN'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              handleRoleSelect('ADMIN')
            }
          >
            🛠️ Admin
          </button>

        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
        >

          <div className="field">

            <label>
              📱 Phone number or email
            </label>

            <input
              type="text"
              name="identifier"
              placeholder="98765 43210"
              value={formData.identifier}
              onChange={handleChange}
              autoComplete="username"
              disabled={loading}
            />

          </div>

          <div className="field">

            <label>
              🔒 Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              disabled={loading}
            />

          </div>

          <div className="auth-forgot-row">

            <button
              type="button"
              className="btn-ghost forgot-link"
              onClick={() =>
                navigate('/forgot-password')
              }
              disabled={loading}
            >
              Forgot password?
            </button>

          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading
              ? 'Logging in…'
              : `Log In as ${
                  selectedRole === 'ADMIN'
                    ? 'Admin'
                    : 'Farmer'
                }`}
          </button>

          {selectedRole === 'FARMER' && (

            <div className="auth-foot">

              New to FarmXP?{' '}

              <b
                onClick={() =>
                  navigate('/register')
                }
              >
                Create an account
              </b>

            </div>

          )}

        </form>
      </div>
    </div>
  );
};

export default LoginPage;