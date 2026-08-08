import React, { useState } from 'react';
import {
  Box,
  Card,
  TextField,
  Switch,
  Button,
  Divider,
  Typography,
  Alert,
} from '@mui/material';

import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import SaveIcon from '@mui/icons-material/Save';
import LockIcon from '@mui/icons-material/Lock';

import './Settings.css';

const Settings = () => {
  const [profile, setProfile] = useState({
    name: 'System Administrator',
    email: 'admin@farmxp.com',
    phone: '9876543210',
  });

  const [notifications, setNotifications] = useState({
    practiceVerification: true,
    newFarmer: true,
    schemeUpdates: true,
    buyerUpdates: false,
    systemAlerts: true,
  });

  const [platform, setPlatform] = useState({
    emailNotifications: true,
    maintenanceMode: false,
  });

  const [saved, setSaved] = useState(false);

  const handleProfileChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSaved(false);
  };

  const handleNotificationChange = (event) => {
    const { name, checked } = event.target;

    setNotifications((previous) => ({
      ...previous,
      [name]: checked,
    }));

    setSaved(false);
  };

  const handlePlatformChange = (event) => {
    const { name, checked } = event.target;

    setPlatform((previous) => ({
      ...previous,
      [name]: checked,
    }));

    setSaved(false);
  };

  const handleSave = async () => {
    /*
     * Later:
     *
     * await adminService.updateAdminSettings({
     *   profile,
     *   notifications,
     *   platform,
     * });
     */

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <Box className="admin-settings-page">

      {/* Page Header */}
      <Box className="settings-header">

        <Box>
          <Typography
            variant="h4"
            className="settings-title"
          >
            Settings
          </Typography>

          <Typography
            variant="body2"
            className="settings-subtitle"
          >
            Manage your administrator account and platform preferences.
          </Typography>
        </Box>

      </Box>

      {saved && (
        <Alert
          severity="success"
          className="settings-success"
        >
          Settings saved successfully.
        </Alert>
      )}

      {/* ========================= */}
      {/* ADMIN PROFILE */}
      {/* ========================= */}

      <Card className="settings-card">

        <Box className="settings-section-header">

          <Box className="settings-section-icon">
            <PersonIcon />
          </Box>

          <Box>
            <Typography
              variant="h6"
              className="settings-section-title"
            >
              Admin Profile
            </Typography>

            <Typography
              variant="body2"
              className="settings-section-description"
            >
              Update your administrator account information.
            </Typography>
          </Box>

        </Box>

        <Divider className="settings-divider" />

        <Box className="settings-form-grid">

          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={profile.name}
            onChange={handleProfileChange}
          />

          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={profile.email}
            onChange={handleProfileChange}
          />

          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={profile.phone}
            onChange={handleProfileChange}
          />

          <TextField
            fullWidth
            label="Role"
            value="Super Administrator"
            disabled
          />

        </Box>

      </Card>

      {/* ========================= */}
      {/* NOTIFICATIONS */}
      {/* ========================= */}

      <Card className="settings-card">

        <Box className="settings-section-header">

          <Box className="settings-section-icon">
            <NotificationsIcon />
          </Box>

          <Box>
            <Typography
              variant="h6"
              className="settings-section-title"
            >
              Notifications
            </Typography>

            <Typography
              variant="body2"
              className="settings-section-description"
            >
              Choose which platform activities you want to be notified about.
            </Typography>
          </Box>

        </Box>

        <Divider className="settings-divider" />

        <Box className="settings-options">

          <Box className="settings-option">

            <Box>
              <Typography className="settings-option-title">
                Practice Verification
              </Typography>

              <Typography className="settings-option-description">
                Get notified when farmers submit practices for verification.
              </Typography>
            </Box>

            <Switch
              name="practiceVerification"
              checked={notifications.practiceVerification}
              onChange={handleNotificationChange}
              color="success"
            />

          </Box>

          <Box className="settings-option">

            <Box>
              <Typography className="settings-option-title">
                New Farmer Registration
              </Typography>

              <Typography className="settings-option-description">
                Receive notifications when a new farmer joins FarmXP.
              </Typography>
            </Box>

            <Switch
              name="newFarmer"
              checked={notifications.newFarmer}
              onChange={handleNotificationChange}
              color="success"
            />

          </Box>

          <Box className="settings-option">

            <Box>
              <Typography className="settings-option-title">
                Government Scheme Updates
              </Typography>

              <Typography className="settings-option-description">
                Get notified about government scheme changes and updates.
              </Typography>
            </Box>

            <Switch
              name="schemeUpdates"
              checked={notifications.schemeUpdates}
              onChange={handleNotificationChange}
              color="success"
            />

          </Box>

          <Box className="settings-option">

            <Box>
              <Typography className="settings-option-title">
                Buyer Updates
              </Typography>

              <Typography className="settings-option-description">
                Receive notifications about marketplace buyer activity.
              </Typography>
            </Box>

            <Switch
              name="buyerUpdates"
              checked={notifications.buyerUpdates}
              onChange={handleNotificationChange}
              color="success"
            />

          </Box>

          <Box className="settings-option">

            <Box>
              <Typography className="settings-option-title">
                System Alerts
              </Typography>

              <Typography className="settings-option-description">
                Receive important system and security notifications.
              </Typography>
            </Box>

            <Switch
              name="systemAlerts"
              checked={notifications.systemAlerts}
              onChange={handleNotificationChange}
              color="success"
            />

          </Box>

        </Box>

      </Card>

      {/* ========================= */}
      {/* PLATFORM SETTINGS */}
      {/* ========================= */}

      <Card className="settings-card">

        <Box className="settings-section-header">

          <Box className="settings-section-icon">
            <SettingsIcon />
          </Box>

          <Box>
            <Typography
              variant="h6"
              className="settings-section-title"
            >
              Platform Preferences
            </Typography>

            <Typography
              variant="body2"
              className="settings-section-description"
            >
              Configure general FarmXP administration preferences.
            </Typography>
          </Box>

        </Box>

        <Divider className="settings-divider" />

        <Box className="settings-options">

          <Box className="settings-option">

            <Box>
              <Typography className="settings-option-title">
                Email Notifications
              </Typography>

              <Typography className="settings-option-description">
                Allow FarmXP to send administrative notifications by email.
              </Typography>
            </Box>

            <Switch
              name="emailNotifications"
              checked={platform.emailNotifications}
              onChange={handlePlatformChange}
              color="success"
            />

          </Box>

          <Box className="settings-option">

            <Box>
              <Typography className="settings-option-title">
                Maintenance Mode
              </Typography>

              <Typography className="settings-option-description">
                Temporarily restrict platform access during maintenance.
              </Typography>
            </Box>

            <Switch
              name="maintenanceMode"
              checked={platform.maintenanceMode}
              onChange={handlePlatformChange}
              color="success"
            />

          </Box>

        </Box>

      </Card>

      {/* ========================= */}
      {/* SECURITY */}
      {/* ========================= */}

      <Card className="settings-card">

        <Box className="settings-section-header">

          <Box className="settings-section-icon">
            <SecurityIcon />
          </Box>

          <Box>
            <Typography
              variant="h6"
              className="settings-section-title"
            >
              Security
            </Typography>

            <Typography
              variant="body2"
              className="settings-section-description"
            >
              Manage your administrator account security.
            </Typography>
          </Box>

        </Box>

        <Divider className="settings-divider" />

        <Box className="security-row">

          <Box className="security-content">

            <Box className="security-icon">
              <LockIcon />
            </Box>

            <Box>
              <Typography className="settings-option-title">
                Change Password
              </Typography>

              <Typography className="settings-option-description">
                Update your administrator account password regularly.
              </Typography>
            </Box>

          </Box>

          <Button
            variant="outlined"
            className="security-btn"
            onClick={() => {
              alert('Change password feature will be connected to the backend.');
            }}
          >
            Change Password
          </Button>

        </Box>

      </Card>

      {/* ========================= */}
      {/* SAVE */}
      {/* ========================= */}

      <Box className="settings-save-area">

        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          className="settings-save-btn"
          onClick={handleSave}
        >
          Save Changes
        </Button>

      </Box>

    </Box>
  );
};

export default Settings;