import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import { useNavigate } from "react-router-dom";
import { createAdmin } from "../../services/adminService";
import "./AddAdmin.css";

const AddAdmin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "ADMIN",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Admin name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must contain 10 digits.";
    }

    if (!formData.password) {
      newErrors.password = "Temporary password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must contain at least 8 characters.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm the password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    setErrors({});

    try {
      await createAdmin({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        role: formData.role,
        password: formData.password,
      });

      navigate("/admin/admins");
    } catch (error) {
      console.error("Create admin error:", error);

      setErrors({
        submit: "Unable to create administrator. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/admins");
  };

  return (
    <Box className="add-admin-page">
      {/* Back */}
      <button type="button" className="add-admin-back" onClick={handleCancel}>
        <ArrowBackIcon fontSize="small" />
        Back to Admin Management
      </button>

      {/* Header */}
      <Box className="add-admin-header">
        <Box>
          <Typography variant="h4" className="add-admin-title">
            Add Administrator
          </Typography>

          <Typography variant="body2" className="add-admin-subtitle">
            Create an administrator account for the FarmXP management portal.
          </Typography>
        </Box>
      </Box>

      {/* Security Information */}
      <Card className="add-admin-security-card">
        <Box className="security-icon">
          <AdminPanelSettingsIcon />
        </Box>

        <Box>
          <Typography variant="subtitle1" className="security-title">
            Administrator access
          </Typography>

          <Typography variant="body2" className="security-text">
            Only create accounts for trusted FarmXP staff. Administrators will
            have access to management features and farmer-related information.
          </Typography>
        </Box>
      </Card>

      {/* Form */}
      <Card className="add-admin-form-card">
        <Box className="form-section-header">
          <Box className="form-section-icon">
            <PersonAddIcon />
          </Box>

          <Box>
            <Typography variant="h6" className="form-section-title">
              Administrator Details
            </Typography>

            <Typography variant="body2" className="form-section-description">
              Enter the details for the new administrator.
            </Typography>
          </Box>
        </Box>

        {errors.submit && (
          <Box className="add-admin-error">{errors.submit}</Box>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <Box className="form-field">
            <TextField
              fullWidth
              label="Full name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter administrator name"
              error={Boolean(errors.name)}
              helperText={errors.name}
              required
            />
          </Box>

          {/* Email + Phone */}
          <Box className="form-row">
            <Box className="form-field">
              <TextField
                fullWidth
                label="Email address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                error={Boolean(errors.email)}
                helperText={errors.email}
                required
              />
            </Box>

            <Box className="form-field">
              <TextField
                fullWidth
                label="Phone number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                error={Boolean(errors.phone)}
                helperText={errors.phone}
                inputProps={{
                  maxLength: 10,
                }}
                required
              />
            </Box>
          </Box>

          {/* Role */}
          <Box className="form-field">
            <FormControl fullWidth>
              <InputLabel id="admin-role-label">Admin Role</InputLabel>

              <Select
                labelId="admin-role-label"
                label="Admin Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <MenuItem value="ADMIN">Admin</MenuItem>

                <MenuItem value="SUPER_ADMIN" disabled>
                  Super Admin
                </MenuItem>
              </Select>
            </FormControl>

            <Typography variant="caption" className="field-note">
              Super Admin accounts cannot be created from this page.
            </Typography>
          </Box>

          {/* Password */}
          <Box className="form-row">
            <Box className="form-field">
              <TextField
                fullWidth
                label="Temporary password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                error={Boolean(errors.password)}
                helperText={errors.password}
                required
              />
            </Box>

            <Box className="form-field">
              <TextField
                fullWidth
                label="Confirm password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                error={Boolean(errors.confirmPassword)}
                helperText={errors.confirmPassword}
                required
              />
            </Box>
          </Box>

          {/* Password Notice */}
          <Box className="password-notice">
            <Typography variant="body2" className="password-notice-title">
              🔐 Password security
            </Typography>

            <Typography variant="body2" className="password-notice-text">
              The password will be securely hashed by the backend before being
              stored. The raw password should never be stored in the database.
            </Typography>
          </Box>

          {/* Actions */}
          <Box className="add-admin-actions">
            <Button
              type="button"
              variant="outlined"
              onClick={handleCancel}
              className="cancel-admin-btn"
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              startIcon={<PersonAddIcon />}
              className="save-admin-btn"
              disabled={saving}
            >
              {saving ? "Creating Admin..." : "Create Admin"}
            </Button>
          </Box>
        </form>
      </Card>
    </Box>
  );
};

export default AddAdmin;
