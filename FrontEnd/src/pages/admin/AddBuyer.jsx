import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Card,
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  Divider,
  Alert,
} from '@mui/material';

import {
  ArrowBack,
  Save,
  Storefront,
} from '@mui/icons-material';

import { createBuyer } from '../../services/adminService';

import './AddBuyer.css';

const AddBuyer = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    location: '',
    contactPerson: '',
    phone: '',
    email: '',
    description: '',
    status: 'Active',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.category ||
      !formData.location.trim() ||
      !formData.contactPerson.trim() ||
      !formData.phone.trim()
    ) {
      setError(
        'Please fill in all required fields.'
      );
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createBuyer(formData);

      navigate('/admin/buyers');
    } catch (err) {
      console.error('Failed to create buyer:', err);

      setError(
        'Unable to add buyer. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/buyers');
  };

  return (
    <Box className="add-buyer-page">

      {/* =========================
          Back
      ========================= */}
      <Button
        startIcon={<ArrowBack />}
        onClick={handleCancel}
        className="add-buyer-back"
      >
        Back to Buyer Management
      </Button>

      {/* =========================
          Header
      ========================= */}
      <Box className="add-buyer-header">

        <Box>
          <Typography className="add-buyer-title">
            Add New Buyer
          </Typography>

          <Typography className="add-buyer-subtitle">
            Add a market buyer to connect them with
            suitable farmers.
          </Typography>
        </Box>

      </Box>

      {/* =========================
          Form Card
      ========================= */}
      <Card className="add-buyer-card">

        <Box className="add-buyer-section-heading">

          <Box className="add-buyer-section-icon">
            <Storefront />
          </Box>

          <Box>
            <Typography className="section-title">
              Buyer Information
            </Typography>

            <Typography className="section-subtitle">
              Enter the basic details of the buyer.
            </Typography>
          </Box>

        </Box>

        <Divider />

        {error && (
          <Alert
            severity="error"
            className="add-buyer-alert"
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>

          {/* =========================
              Basic Information
          ========================= */}
          <Box className="form-grid">

            <TextField
              required
              label="Buyer / Company Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Example: Green Harvest Foods"
              fullWidth
            />

            <Select
              required
              displayEmpty
              name="category"
              value={formData.category}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="">
                <span className="select-placeholder">
                  Select Buyer Category
                </span>
              </MenuItem>

              <MenuItem value="Organic Produce">
                Organic Produce
              </MenuItem>

              <MenuItem value="Vegetables">
                Vegetables
              </MenuItem>

              <MenuItem value="Fruits">
                Fruits
              </MenuItem>

              <MenuItem value="Grains">
                Grains
              </MenuItem>

              <MenuItem value="Spices">
                Spices
              </MenuItem>
            </Select>

            <TextField
              required
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Example: Coimbatore"
              fullWidth
            />

            <TextField
              required
              label="Contact Person"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              placeholder="Example: Rajesh Kumar"
              fullWidth
            />

            <TextField
              required
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              fullWidth
            />

            <TextField
              type="email"
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="buyer@example.com"
              fullWidth
            />

          </Box>

          {/* =========================
              Description
          ========================= */}
          <Box className="form-full-field">

            <TextField
              label="Buyer Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the buyer, products they purchase, market requirements, etc."
              multiline
              rows={4}
              fullWidth
            />

          </Box>

          {/* =========================
              Status
          ========================= */}
          <Box className="status-field">

            <Typography className="field-label">
              Status
            </Typography>

            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              size="small"
            >
              <MenuItem value="Active">
                Active
              </MenuItem>

              <MenuItem value="Pending">
                Pending
              </MenuItem>

              <MenuItem value="Suspended">
                Suspended
              </MenuItem>
            </Select>

          </Box>

          {/* =========================
              Actions
          ========================= */}
          <Box className="add-buyer-actions">

            <Button
              type="button"
              variant="outlined"
              onClick={handleCancel}
              disabled={loading}
              className="cancel-buyer-btn"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
              disabled={loading}
              className="save-buyer-btn"
            >
              {loading
                ? 'Saving...'
                : 'Save Buyer'}
            </Button>

          </Box>

        </form>

      </Card>

    </Box>
  );
};

export default AddBuyer;