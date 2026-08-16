import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, Typography, TextField, Button, Alert } from '@mui/material';
import axios from 'axios';
import './LoginPage.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:9090/api/auth/forgot-password', { email });
      setMessage(response.data.message || 'If an account exists, a reset link will be sent.');
    } catch (err) {
      // Keep error vague for security
      setMessage('If an account exists, a reset link will be sent.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="login-container">
      <Card className="login-card">
        <Typography variant="h5" align="center" gutterBottom>
          Reset Password
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Enter your email to receive a password reset link.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

        <form onSubmit={handleSubmit} className="login-form">
          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="success"
            size="large"
            disabled={loading}
            sx={{ mt: 2, mb: 2 }}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPassword;
