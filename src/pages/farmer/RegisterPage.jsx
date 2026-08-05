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
  MenuItem,
  IconButton as IconBtn,
} from '@mui/material';
import { Visibility, VisibilityOff, Edit, Delete } from '@mui/icons-material';
import authService from '../../services/authService';
import './RegisterPage.css';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Lakshadweep', 'Puducherry',
];

const CROP_ICONS = {
  paddy: '🌾', banana: '🍌', coconut: '🥥', millets: '🌾',
  sugarcane: '🎋', cotton: '🌱', default: '🌱',
};

const getCropIcon = (name) =>
  CROP_ICONS[name.trim().toLowerCase()] || CROP_ICONS.default;

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    email: '',
    password: '',
    state: '',
    totalLand: '',
  });

  const [crops, setCrops] = useState([
    { id: 1, name: 'Paddy', acres: '2' },
    { id: 2, name: 'Banana', acres: '1' },
    { id: 3, name: 'Coconut', acres: '0.75' },
  ]);
  const [newCrop, setNewCrop] = useState({ name: '', acres: '' });
  const [editingId, setEditingId] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddCrop = () => {
    if (!newCrop.name.trim() || !newCrop.acres.trim()) return;

    if (editingId) {
      setCrops(
        crops.map((c) =>
          c.id === editingId ? { ...c, name: newCrop.name, acres: newCrop.acres } : c
        )
      );
      setEditingId(null);
    } else {
      setCrops([...crops, { id: Date.now(), name: newCrop.name, acres: newCrop.acres }]);
    }
    setNewCrop({ name: '', acres: '' });
  };

  const handleEditCrop = (crop) => {
    setNewCrop({ name: crop.name, acres: crop.acres });
    setEditingId(crop.id);
  };

  const handleDeleteCrop = (id) => {
    setCrops(crops.filter((c) => c.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setNewCrop({ name: '', acres: '' });
    }
  };

  const validate = () => {
    if (!formData.name.trim()) return 'Please enter your full name.';
    if (!formData.phone.trim()) return 'Please enter your phone number.';
    if (!formData.location.trim()) return 'Please enter your village/district.';
    if (!formData.email.trim()) return 'Please enter your email.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return 'Please enter a valid email address.';
    if (!formData.password) return 'Please create a password.';
    if (formData.password.length < 6) return 'Password must be at least 6 characters.';
    if (!formData.state) return 'Please select your state.';
    if (!formData.totalLand.trim()) return 'Please enter your total land size.';
    if (crops.length === 0) return 'Please add at least one crop.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await authService.register({ ...formData, crops }); // swap for real API later
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-stage">
      <Container maxWidth="xs">
        <form onSubmit={handleSubmit} noValidate>
          {/* ---------- Card 1: Account Info ---------- */}
          <Paper elevation={0} className="auth-card">
            <div className="auth-band" />

            <div className="auth-logo">
              <span className="mark">🌾</span>
              <span className="word">FarmXP</span>
            </div>

            <Typography className="auth-title" variant="h6" align="center">
              Create your farmer account
            </Typography>

            {error && (
              <Alert severity="error" className="auth-alert">
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="👤 Full name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              placeholder="Enter your name"
              required
            />

            <div className="field-row">
              <TextField
                fullWidth
                label="📱 Phone number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                margin="normal"
                placeholder="98765 43210"
                required
              />
              <TextField
                fullWidth
                label="📍 Village / District"
                name="location"
                value={formData.location}
                onChange={handleChange}
                margin="normal"
                placeholder="Coimbatore"
                required
              />
            </div>

            <TextField
              fullWidth
              label="👤 Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              placeholder="you@example.com"
              required
            />

            <TextField
              fullWidth
              label="🔒 Create password"
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
                    <IconButton onClick={() => setShowPassword((p) => !p)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Paper>

          {/* ---------- Card 2: Farm Information ---------- */}
          <Paper elevation={0} className="auth-card farm-card">
            <Typography className="farm-title" variant="subtitle1" align="center">
              🌾 Farm Information
            </Typography>

            <div className="field-row">
              <TextField
                  fullWidth
                  select
                  label="🗺️ State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  margin="normal"
                  required
                >
                  {INDIAN_STATES.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </TextField>

              <TextField
                fullWidth
                label="🚜 Total land (acres)"
                name="totalLand"
                value={formData.totalLand}
                onChange={handleChange}
                margin="normal"
                placeholder="4.25"
                required
              />
            </div>

            <Typography className="crops-label" variant="body2">
              🌱 Current crops
            </Typography>

            <div className="crop-list">
              {crops.map((crop) => (
                <div key={crop.id} className="crop-row">
                  <span className="crop-icon">{getCropIcon(crop.name)}</span>
                  <span className="crop-name">{crop.name}</span>
                  <span className="crop-acres">
                    {crop.acres} Acre{crop.acres !== '1' ? 's' : ''}
                  </span>
                  <IconBtn size="small" onClick={() => handleEditCrop(crop)}>
                    <Edit fontSize="small" />
                  </IconBtn>
                  <IconBtn size="small" onClick={() => handleDeleteCrop(crop.id)}>
                    <Delete fontSize="small" />
                  </IconBtn>
                </div>
              ))}
            </div>

            <div className="field-row crop-add-row">
              <TextField
                fullWidth
                size="small"
                placeholder="Crop name (e.g. Millets)"
                value={newCrop.name}
                onChange={(e) => setNewCrop({ ...newCrop, name: e.target.value })}
              />
              <TextField
                size="small"
                placeholder="Acres"
                className="acres-input"
                value={newCrop.acres}
                onChange={(e) => setNewCrop({ ...newCrop, acres: e.target.value })}
              />
            </div>

            <Button
              variant="outlined"
              className="add-crop-btn"
              onClick={handleAddCrop}
              type="button"
            >
              {editingId ? 'Update Crop' : '+ Add Crop'}
            </Button>
          </Paper>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            className="auth-submit-btn"
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
          </Button>

          <Typography variant="body2" align="center" className="auth-foot">
            Already have an account?{' '}
            <span className="auth-link" onClick={() => navigate('/login')}>
              Log in
            </span>
          </Typography>
        </form>
      </Container>
    </div>
  );
};

export default RegisterPage;