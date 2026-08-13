

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
import {
  Visibility,
  VisibilityOff,
  Edit,
  Delete,
} from '@mui/icons-material';
import authService from '../../services/authService';
import './RegisterPage.css';

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

const CROP_ICONS = {
  paddy: '🌾',
  banana: '🍌',
  coconut: '🥥',
  millets: '🌾',
  sugarcane: '🎋',
  cotton: '🌱',
  default: '🌱',
};

const getCropIcon = (name) =>
  CROP_ICONS[name.trim().toLowerCase()] ||
  CROP_ICONS.default;

const RegisterPage = () => {
  const navigate = useNavigate();

  // ============================================================
  // FORM DATA
  // ============================================================

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    email: '',
    password: '',
    state: '',
    totalLand: '',
  });

  // ============================================================
  // CROPS
  // ============================================================

  // No mock crops.
  // Farmer adds their actual crops.
  const [crops, setCrops] = useState([]);

  const [newCrop, setNewCrop] = useState({
    name: '',
    acres: '',
  });

  const [editingId, setEditingId] = useState(null);

  // ============================================================
  // UI STATE
  // ============================================================

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ============================================================
  // FORM CHANGE
  // ============================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ============================================================
  // ADD / UPDATE CROP
  // ============================================================

  const handleAddCrop = () => {
    const cropName = newCrop.name.trim();
    const acres = newCrop.acres.trim();

    if (!cropName || !acres) {
      setError('Please enter crop name and acres.');
      return;
    }

    const acresValue = Number(acres);

    if (!Number.isFinite(acresValue) || acresValue <= 0) {
      setError('Please enter a valid crop area.');
      return;
    }

    // Check duplicate crop
    if (!editingId) {
      const duplicate = crops.some(
        (crop) =>
          crop.name.trim().toLowerCase() ===
          cropName.toLowerCase()
      );

      if (duplicate) {
        setError('This crop has already been added.');
        return;
      }
    }

    setError('');

    // UPDATE
    if (editingId) {
      setCrops(
        crops.map((crop) =>
          crop.id === editingId
            ? {
                ...crop,
                name: cropName,
                acres,
              }
            : crop
        )
      );

      setEditingId(null);
    }

    // ADD
    else {
      setCrops([
        ...crops,
        {
          id: Date.now(),
          name: cropName,
          acres,
        },
      ]);
    }

    setNewCrop({
      name: '',
      acres: '',
    });
  };

  // ============================================================
  // EDIT CROP
  // ============================================================

  const handleEditCrop = (crop) => {
    setNewCrop({
      name: crop.name,
      acres: crop.acres,
    });

    setEditingId(crop.id);
    setError('');
  };

  // ============================================================
  // DELETE CROP
  // ============================================================

  const handleDeleteCrop = (id) => {
    setCrops(
      crops.filter((crop) => crop.id !== id)
    );

    if (editingId === id) {
      setEditingId(null);

      setNewCrop({
        name: '',
        acres: '',
      });
    }

    setError('');
  };

  // ============================================================
  // VALIDATION
  // ============================================================

  const validate = () => {
    if (!formData.name.trim()) {
      return 'Please enter your full name.';
    }

    if (!formData.phone.trim()) {
      return 'Please enter your phone number.';
    }

    const phone = formData.phone.replace(/\s/g, '');

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return 'Please enter a valid 10-digit phone number.';
    }

    if (!formData.location.trim()) {
      return 'Please enter your village/district.';
    }

    if (!formData.email.trim()) {
      return 'Please enter your email.';
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {
      return 'Please enter a valid email address.';
    }

    if (!formData.password) {
      return 'Please create a password.';
    }

    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters.';
    }

    if (!formData.state) {
      return 'Please select your state.';
    }

    if (!formData.totalLand.trim()) {
      return 'Please enter your total land size.';
    }

    const totalLand = Number(formData.totalLand);

    if (!Number.isFinite(totalLand) || totalLand <= 0) {
      return 'Please enter a valid total land size.';
    }

    if (crops.length === 0) {
      return 'Please add at least one crop.';
    }

    const totalCropArea = crops.reduce(
      (total, crop) =>
        total + Number(crop.acres),
      0
    );

    if (totalCropArea > totalLand) {
      return 'Total crop area cannot be greater than total land size.';
    }

    return '';
  };

  // ============================================================
  // SUBMIT REGISTRATION
  // ============================================================

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
      const registrationData = {
        ...formData,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        location: formData.location.trim(),
        email: formData.email.trim(),
        state: formData.state,
        totalLand: formData.totalLand,
        crops,
      };

      console.log(
        'FarmXP Registration Request:',
        registrationData
      );

      const result =
        await authService.register(
          registrationData
        );

      console.log(
        'FarmXP Registration Successful:',
        result
      );

      navigate('/farmer/dashboard', {
        replace: true,
      });

    } catch (err) {
      console.error(
        'FarmXP Registration Error:',
        err.response?.data || err.message
      );

      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message;

      setError(
        backendMessage ||
        'Registration failed. Please check your details and try again.'
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-stage">
      <Container maxWidth="xs">

        <form
          onSubmit={handleSubmit}
          noValidate
        >

          {/* ==================================================
              CARD 1: ACCOUNT INFORMATION
              ================================================== */}

          <Paper
            elevation={0}
            className="auth-card"
          >
            <div className="auth-band" />

            <div className="auth-logo">
              <span className="mark">
                🌾
              </span>

              <span className="word">
                FarmXP
              </span>
            </div>

            <Typography
              className="auth-title"
              variant="h6"
              align="center"
            >
              Create your farmer account
            </Typography>

            {error && (
              <Alert
                severity="error"
                className="auth-alert"
              >
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
              type={
                showPassword
                  ? 'text'
                  : 'password'
              }
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              placeholder="••••••••"
              required

              // MUI current API
              // Replaces deprecated InputProps
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">

                      <IconButton
                        onClick={() =>
                          setShowPassword(
                            (previous) =>
                              !previous
                          )
                        }
                        edge="end"
                        type="button"
                      >
                        {showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>

                    </InputAdornment>
                  ),
                },
              }}
            />

          </Paper>

          {/* ==================================================
              CARD 2: FARM INFORMATION
              ================================================== */}

          <Paper
            elevation={0}
            className="auth-card farm-card"
          >

            <Typography
              className="farm-title"
              variant="subtitle1"
              align="center"
            >
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
                {INDIAN_STATES.map(
                  (state) => (
                    <MenuItem
                      key={state}
                      value={state}
                    >
                      {state}
                    </MenuItem>
                  )
                )}
              </TextField>

              <TextField
                fullWidth
                label="🚜 Total land (acres)"
                name="totalLand"
                type="number"
                value={formData.totalLand}
                onChange={handleChange}
                margin="normal"
                placeholder="4.25"
                required
                inputProps={{
                  min: 0,
                  step: '0.01',
                }}
              />

            </div>

            <Typography
              className="crops-label"
              variant="body2"
            >
              🌱 Current crops
            </Typography>

            <div className="crop-list">

              {crops.map((crop) => (
                <div
                  key={crop.id}
                  className="crop-row"
                >

                  <span className="crop-icon">
                    {getCropIcon(
                      crop.name
                    )}
                  </span>

                  <span className="crop-name">
                    {crop.name}
                  </span>

                  <span className="crop-acres">
                    {crop.acres} Acre
                    {crop.acres !== '1'
                      ? 's'
                      : ''}
                  </span>

                  <IconBtn
                    size="small"
                    type="button"
                    onClick={() =>
                      handleEditCrop(crop)
                    }
                  >
                    <Edit fontSize="small" />
                  </IconBtn>

                  <IconBtn
                    size="small"
                    type="button"
                    onClick={() =>
                      handleDeleteCrop(
                        crop.id
                      )
                    }
                  >
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
                onChange={(e) =>
                  setNewCrop({
                    ...newCrop,
                    name: e.target.value,
                  })
                }
              />

              <TextField
                size="small"
                placeholder="Acres"
                className="acres-input"
                type="number"
                value={newCrop.acres}
                onChange={(e) =>
                  setNewCrop({
                    ...newCrop,
                    acres: e.target.value,
                  })
                }
                inputProps={{
                  min: 0,
                  step: '0.01',
                }}
              />

            </div>

            <Button
              variant="outlined"
              className="add-crop-btn"
              onClick={handleAddCrop}
              type="button"
            >
              {editingId
                ? 'Update Crop'
                : '+ Add Crop'}
            </Button>

          </Paper>

          {/* ==================================================
              CREATE ACCOUNT
              ================================================== */}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            className="auth-submit-btn"
          >
            {loading ? (
              <CircularProgress
                size={24}
                color="inherit"
              />
            ) : (
              'Create Account'
            )}
          </Button>

          {/* ==================================================
              LOGIN LINK
              ================================================== */}

          <Typography
            variant="body2"
            align="center"
            className="auth-foot"
          >
            Already have an account?{' '}

            <span
              className="auth-link"
              onClick={() =>
                navigate('/login')
              }
            >
              Log in
            </span>
          </Typography>

        </form>

      </Container>
    </div>
  );
};

export default RegisterPage;
