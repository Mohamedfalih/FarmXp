import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import authService from '../../services/authService';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      const data = await authService.login(formData); // swap for real API later

      if (data.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Invalid phone/email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-stage">
      <Container maxWidth="xs">
        <Paper elevation={0} className="auth-card">
          <div className="auth-band" />

          <div className="auth-logo">
            <span className="mark">🌾</span>
            <span className="word">FarmXP</span>
          </div>

          <Typography className="auth-title" variant="h6" align="center">
            Welcome back, farmer
          </Typography>
          <Typography className="auth-subtitle" variant="body2" align="center">
            Log in to continue growing
          </Typography>

          {error && (
            <Alert severity="error" className="auth-alert">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="📱 Phone number or email"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              margin="normal"
              placeholder="98765 43210"
              required
            />

            <TextField
              fullWidth
              label="🔒 Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              placeholder="••••••••"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <div className="auth-row">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    size="small"
                    color="primary"
                  />
                }
                label={<Typography variant="body2">Remember me</Typography>}
              />
              <Typography
                variant="body2"
                className="forgot-link"
                onClick={() => navigate('/forgot-password')}
              >
                Forgot password?
              </Typography>
            </div>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              className="auth-submit-btn"
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
            </Button>

            <Typography variant="body2" align="center" className="auth-foot">
              New to FarmXP?{' '}
              <span className="auth-link" onClick={() => navigate('/register')}>
                Create an account
              </span>
            </Typography>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default LoginPage;