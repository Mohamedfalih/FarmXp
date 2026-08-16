import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Card, Typography, TextField, Button, Alert } from '@mui/material';
import axios from 'axios';
import './LoginPage.css';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:9090/api/auth/reset-password', {
        token,
        newPassword
      });
      setMessage('Password reset successfully. You can now login.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="login-container">
      <Card className="login-card">
        <Typography variant="h5" align="center" gutterBottom>
          Create New Password
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

        <form onSubmit={handleSubmit} className="login-form">
          <TextField
            fullWidth
            type="password"
            label="New Password"
            variant="outlined"
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={!token || !!message}
          />

          <TextField
            fullWidth
            type="password"
            label="Confirm Password"
            variant="outlined"
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={!token || !!message}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="success"
            size="large"
            disabled={loading || !token || !!message || !newPassword}
            sx={{ mt: 2, mb: 2 }}
          >
            {loading ? 'Saving...' : 'Save Password'}
          </Button>
          
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/login')}
          >
            Back to Login
          </Button>
        </form>
      </Card>
    </Box>
  );
};

export default ResetPassword;
