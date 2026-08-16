
import { useState, useEffect } from "react";
import authService from "../../services/authService";
import {
  Box,
  Typography,
  Avatar,
  TextField,
  MenuItem,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Divider,
  Chip,

} from "@mui/material";
import { Palette, Security } from "@mui/icons-material";
import Close from "@mui/icons-material/Close";
import Login from "@mui/icons-material/Login";
import LightMode from "@mui/icons-material/LightMode";
import DarkMode from "@mui/icons-material/DarkMode";
import SettingsBrightness from "@mui/icons-material/SettingsBrightness";
import Save from "@mui/icons-material/Save";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "./Settings.css";

/* =========================================================
   CONSTANTS
========================================================= */

const NAV_SECTIONS = [
  {
    id: "profile",
    label: "Profile",
    icon: '👤',
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: '🔔',
  },
  {
    id: "preferences",
    label: "Preferences",
    icon: <Palette />,
  },
  {
    id: "security",
    label: "Security",
    icon: <Security />,
  },
];

const LANGUAGES = [
  "English",
  "Tamil",
  "Malayalam",
  "Hindi",
];

const NOTIFICATION_ITEMS = [
  {
    id: "newFarmer",
    title: "New Farmer Registrations",
    description:
      "Get notified when a new farmer registers on FarmXP.",
  },
  {
    id: "practiceVerification",
    title: "Practice Verification",
    description:
      "Receive alerts when farmer practices require verification.",
  },
  {
    id: "buyerActivity",
    title: "Buyer Activity",
    description:
      "Get notified about important buyer activity and requests.",
  },
  {
    id: "farmerReports",
    title: "Farmer Reports",
    description:
      "Receive notifications when farmers submit reports or issues.",
  },
  {
    id: "schemeUpdates",
    title: "Government Scheme Updates",
    description:
      "Stay informed about government scheme updates.",
  },
  {
    id: "systemAlerts",
    title: "System Alerts",
    description:
      "Receive important FarmXP system and security alerts.",
  },
];

const LOGIN_ACTIVITY = [
  {
    id: 1,
    device: "Chrome · Windows",
    time: "Today, 10:42 AM",
    current: true,
  },
  {
    id: 2,
    device: "Chrome · Windows",
    time: "Yesterday, 8:15 PM",
    current: false,
  },
  {
    id: 3,
    device: "Mobile Browser · Android",
    time: "August 5, 2026",
    current: false,
  },
];

/* =========================================================
   SMALL COMPONENTS
========================================================= */

const SettingNavItem = ({
  section,
  isActive,
  onClick,
}) => (
  <Box
    className={`settings-nav-item ${
      isActive ? "active" : ""
    }`}
    onClick={() => onClick(section.id)}
  >
    <Box className="settings-nav-icon">
      {section.icon}
    </Box>

    <Typography
      variant="body2"
      className="settings-nav-label"
    >
      {section.label}
    </Typography>
  </Box>
);

const NotificationRow = ({
  title,
  description,
  checked,
  onChange,
}) => (
  <Box className="setting-row">
    <Box className="setting-row-text">
      <Typography
        variant="body2"
        className="setting-row-title"
      >
        {title}
      </Typography>

      <Typography
        variant="caption"
        color="text.secondary"
      >
        {description}
      </Typography>
    </Box>

    <Button
      size="small"
      className={`notification-toggle ${
        checked ? "enabled" : ""
      }`}
      onClick={onChange}
    >
      {checked ? "On" : "Off"}
    </Button>
  </Box>
);

const SecurityItem = ({
  icon,
  title,
  description,
  children,
  danger = false,
}) => (
  <Box
    className={`security-item ${
      danger ? "danger-zone" : ""
    }`}
  >
    <Box className="security-item-header">
      <Box
        className={`security-item-icon ${
          danger ? "danger-icon" : ""
        }`}
      >
        {icon}
      </Box>

      <Box className="security-item-heading">
        <Typography
          variant="body2"
          className="security-item-title"
        >
          {title}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
        >
          {description}
        </Typography>
      </Box>
    </Box>

    {children}
  </Box>
);

/* =========================================================
   SETTINGS PAGE
========================================================= */

const Settings = () => {
  const [activeSection, setActiveSection] =
    useState("profile");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (
    message,
    severity = "success"
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  /* =======================================================
     PROFILE
  ======================================================= */

  const [profile, setProfile] = useState({
    fullName: "Loading...",
    email: "Loading...",
    phone: "Loading...",
    role: "Administrator",
  });

  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getCurrentUser();
        setProfile({
          fullName: data.username,
          email: data.email,
          phone: data.phone || "Not provided",
          role: data.role,
        });
        setProfileForm({
          fullName: data.username,
          email: data.email,
          phone: data.phone || "",
          role: data.role,
        });
      } catch (error) {
        showSnackbar("Failed to load profile", "error");
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  const [editProfile, setEditProfile] =
    useState(false);

  const [profileForm, setProfileForm] =
    useState(profile);

  const handleProfileChange = (field) => (event) => {
    setProfileForm((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleStartEditing = () => {
    setProfileForm(profile);
    setEditProfile(true);
  };

  const handleCancelEditing = () => {
    setProfileForm(profile);
    setEditProfile(false);
  };

  const [savingProfile, setSavingProfile] = useState(false);

  const handleSaveProfile = async () => {
    try {
      setSavingProfile(true);
      const data = await authService.updateProfile({
        username: profileForm.fullName,
        email: profileForm.email,
        phone: profileForm.phone,
      });
      setProfile({
        ...profile,
        fullName: data.username,
        email: data.email,
        phone: data.phone || "Not provided",
      });
      setEditProfile(false);
      showSnackbar("Profile updated successfully");
    } catch (error) {
      showSnackbar(error.message || "Failed to update profile", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  /* =======================================================
     NOTIFICATIONS
  ======================================================= */

  const [notificationPreferences, setNotificationPreferences] =
    useState({
      newFarmer: true,
      practiceVerification: true,
      buyerActivity: true,
      farmerReports: true,
      schemeUpdates: false,
      systemAlerts: true,
    });

  const handleNotificationToggle = (id) => {
    setNotificationPreferences((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

    // Later:
    // PUT /api/admin/settings/notifications
  };

  /* =======================================================
     PREFERENCES
  ======================================================= */

  const [language, setLanguage] =
    useState("English");

  const [appearance, setAppearance] =
    useState(() => {
      return (
        localStorage.getItem("farmxp-theme") ||
        "light"
      );
    });

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleAppearanceChange = (_, value) => {
    if (!value) return;

    setAppearance(value);

    localStorage.setItem(
      "farmxp-theme",
      value
    );

    /*
      This event can be listened to by your
      application's central ThemeProvider.
    */
    window.dispatchEvent(
      new CustomEvent("farmxp-theme-change", {
        detail: value,
      })
    );

    showSnackbar(
      `${value.charAt(0).toUpperCase() + value.slice(1)} theme selected`
    );
  };

  const handleSavePreferences = () => {
    // Later:
    // PUT /api/admin/settings

    showSnackbar(
      "Preferences saved successfully"
    );
  };

  /* =======================================================
     PASSWORD
  ======================================================= */

  const [passwordFormOpen, setPasswordFormOpen] =
    useState(false);

  const [passwordForm, setPasswordForm] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

  const [showPassword, setShowPassword] =
    useState({
      current: false,
      new: false,
      confirm: false,
    });

  const [passwordErrors, setPasswordErrors] =
    useState({});

  const handlePasswordFieldChange =
    (field) => (event) => {
      setPasswordForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));

      setPasswordErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleCancelPassword = () => {
    setPasswordFormOpen(false);

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setPasswordErrors({});
  };

  const validatePassword = () => {
    const errors = {};

    if (!passwordForm.currentPassword.trim()) {
      errors.currentPassword =
        "Current password is required";
    }

    if (!passwordForm.newPassword.trim()) {
      errors.newPassword =
        "New password is required";
    } else if (
      passwordForm.newPassword.length < 8
    ) {
      errors.newPassword =
        "Password must contain at least 8 characters";
    } else if (
      passwordForm.newPassword ===
      passwordForm.currentPassword
    ) {
      errors.newPassword =
        "New password must be different";
    }

    if (
      !passwordForm.confirmPassword.trim()
    ) {
      errors.confirmPassword =
        "Please confirm your password";
    } else if (
      passwordForm.confirmPassword !==
      passwordForm.newPassword
    ) {
      errors.confirmPassword =
        "Passwords do not match";
    }

    setPasswordErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const [savingPassword, setSavingPassword] = useState(false);

  const handleUpdatePassword = async () => {
    if (!validatePassword()) return;

    try {
      setSavingPassword(true);
      await authService.updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      
      handleCancelPassword();
      showSnackbar("Password updated successfully");
    } catch (error) {
      const backendError = error.response?.data;
      
      // Handle generic message response (e.g., "Current password is incorrect")
      if (backendError && backendError.message) {
        setPasswordErrors({
          currentPassword: backendError.message
        });
      } 
      // Handle validation errors from MethodArgumentNotValidException
      else if (backendError && typeof backendError === 'object') {
        // Validation errors come as a map of field names to error messages
        setPasswordErrors({
          currentPassword: backendError.currentPassword || "",
          newPassword: backendError.newPassword || ""
        });
      }
      // Fallback
      else {
        setPasswordErrors({
          currentPassword: error.message || "Failed to update password"
        });
      }
    } finally {
      setSavingPassword(false);
    }
  };

  /* =======================================================
     LOGIN ACTIVITY
  ======================================================= */

  const [loginActivityOpen, setLoginActivityOpen] =
    useState(false);

  /* =======================================================
     DELETE ACCOUNT
  ======================================================= */

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);

  const handleDeleteAccount = () => {
    setDeleteDialogOpen(false);

    // UI only for now.
    // Later:
    // DELETE /api/admin/account

    showSnackbar(
      "Account deletion is not enabled yet",
      "info"
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <Box className="settings-page">

      {/* ===================================================
          HEADER
      =================================================== */}

      <Box className="settings-header">
        <Box>
          <Typography
            variant="h5"
            className="settings-title"
          >
            Settings
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Manage your administrator account and
            preferences.
          </Typography>
        </Box>

        <Box className="settings-header-icon">
          <span>🌾</span>
        </Box>
      </Box>

      {/* ===================================================
          MAIN SETTINGS LAYOUT
      =================================================== */}

      <Box className="settings-layout">

        {/* LEFT NAVIGATION */}

        <Box className="settings-nav">

          {NAV_SECTIONS.map((section) => (
            <SettingNavItem
              key={section.id}
              section={section}
              isActive={
                activeSection === section.id
              }
              onClick={setActiveSection}
            />
          ))}

        </Box>

        {/* RIGHT CONTENT */}

        <Box className="settings-content">

          {/* =================================================
              PROFILE
          ================================================= */}

          {activeSection === "profile" && (
            <Box className="settings-panel">

              <Box className="settings-panel-heading">

                <Box>
                  <Typography
                    variant="subtitle1"
                    className="settings-panel-title"
                  >
                    Profile
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    View and manage your administrator
                    profile.
                  </Typography>
                </Box>

                <span className="panel-heading-icon">👤</span>

              </Box>

              <Divider />

              {!editProfile ? (
                <>
                  {/* PROFILE VIEW */}

                  <Box className="profile-summary">

                    <Avatar className="profile-avatar">
                      <span>🌾</span>
                    </Avatar>

                    <Box>
                      <Typography
                        className="profile-name"
                      >
                        {profile.fullName}
                      </Typography>

                      <Chip
                        label={profile.role}
                        size="small"
                        className="profile-role-chip"
                      />
                    </Box>

                  </Box>

                  <Box className="profile-details">

                    <Box className="profile-detail">
                      <Typography className="detail-label">
                        Full Name
                      </Typography>

                      <Typography className="detail-value">
                        {profile.fullName}
                      </Typography>
                    </Box>

                    <Box className="profile-detail">
                      <Typography className="detail-label">
                        Email
                      </Typography>

                      <Typography className="detail-value">
                        {profile.email}
                      </Typography>
                    </Box>

                    <Box className="profile-detail">
                      <Typography className="detail-label">
                        Phone Number
                      </Typography>

                      <Typography className="detail-value">
                        {profile.phone}
                      </Typography>
                    </Box>

                    <Box className="profile-detail">
                      <Typography className="detail-label">
                        Role
                      </Typography>

                      <Typography className="detail-value">
                        {profile.role}
                      </Typography>
                    </Box>

                  </Box>

                  <Box className="settings-panel-actions">

                    <Button
                      variant="outlined"
                      startIcon={<span>✏️</span>}
                      onClick={
                        handleStartEditing
                      }
                    >
                      Edit Profile
                    </Button>

                  </Box>
                </>
              ) : (
                <>
                  {/* PROFILE EDIT */}

                  <Box className="edit-profile-heading">

                    <Typography
                      variant="body2"
                      fontWeight={600}
                    >
                      Edit Profile
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Update your administrator
                      information.
                    </Typography>

                  </Box>

                  <Box className="settings-form-grid">

                    <TextField
                      label="Full Name"
                      value={
                        profileForm.fullName
                      }
                      onChange={handleProfileChange(
                        "fullName"
                      )}
                      size="small"
                      fullWidth
                    />

                    <TextField
                      label="Email"
                      value={
                        profileForm.email
                      }
                      onChange={handleProfileChange(
                        "email"
                      )}
                      size="small"
                      fullWidth
                    />

                    <TextField
                      label="Phone Number"
                      value={
                        profileForm.phone
                      }
                      onChange={handleProfileChange(
                        "phone"
                      )}
                      size="small"
                      fullWidth
                    />

                    <TextField
                      label="Role"
                      value={
                        profileForm.role
                      }
                      size="small"
                      fullWidth
                      disabled
                    />

                  </Box>

                  <Box className="settings-panel-actions">

                    <Button
                      variant="text"
                      onClick={
                        handleCancelEditing
                      }
                    >
                      Cancel
                    </Button>

                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<Save />}
                      onClick={
                        handleSaveProfile
                      }
                      disabled={savingProfile}
                    >
                      {savingProfile ? "Saving..." : "Save Changes"}
                    </Button>

                  </Box>
                </>
              )}

            </Box>
          )}

          {/* =================================================
              NOTIFICATIONS
          ================================================= */}

          {activeSection === "notifications" && (
            <Box className="settings-panel">

              <Box className="settings-panel-heading">

                <Box>
                  <Typography
                    variant="subtitle1"
                    className="settings-panel-title"
                  >
                    Notification Preferences
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Choose which FarmXP events should
                    notify you.
                  </Typography>
                </Box>

                <span className="panel-heading-icon">🔔</span>

              </Box>

              <Divider />

              <Box className="settings-rows-list">

                {NOTIFICATION_ITEMS.map(
                  (item, index) => (
                    <Box key={item.id}>

                      <NotificationRow
                        title={item.title}
                        description={
                          item.description
                        }
                        checked={
                          notificationPreferences[
                            item.id
                          ]
                        }
                        onChange={() =>
                          handleNotificationToggle(
                            item.id
                          )
                        }
                      />

                      {index <
                        NOTIFICATION_ITEMS.length -
                          1 && (
                        <Divider />
                      )}

                    </Box>
                  )
                )}

              </Box>

            </Box>
          )}

          {/* =================================================
              PREFERENCES
          ================================================= */}

          {activeSection === "preferences" && (
            <Box className="settings-panel">

              <Box className="settings-panel-heading">

                <Box>
                  <Typography
                    variant="subtitle1"
                    className="settings-panel-title"
                  >
                    Preferences
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Customize your FarmXP experience.
                  </Typography>
                </Box>

                <Palette className="panel-heading-icon" />

              </Box>

              <Divider />

              {/* LANGUAGE */}

              <Box className="preferences-block">

                <Typography
                  className="preferences-label"
                >
                  Language
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Select your preferred language.
                </Typography>

                <TextField
                  select
                  value={language}
                  onChange={
                    handleLanguageChange
                  }
                  size="small"
                  className="preferences-language-select"
                >
                  {LANGUAGES.map((lang) => (
                    <MenuItem
                      key={lang}
                      value={lang}
                    >
                      {lang}
                    </MenuItem>
                  ))}
                </TextField>

              </Box>

              <Divider />

              {/* APPEARANCE */}

              <Box className="preferences-block">

                <Typography
                  className="preferences-label"
                >
                  Appearance
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Choose how FarmXP should appear.
                </Typography>

                <ToggleButtonGroup
                  value={appearance}
                  exclusive
                  onChange={
                    handleAppearanceChange
                  }
                  size="small"
                  className="appearance-toggle-group"
                >

                  <ToggleButton value="light">
                    <LightMode
                      fontSize="small"
                    />

                    <span>Light</span>
                  </ToggleButton>

                  <ToggleButton value="system">
                    <SettingsBrightness
                      fontSize="small"
                    />

                    <span>System</span>
                  </ToggleButton>

                  <ToggleButton value="dark">
                    <DarkMode
                      fontSize="small"
                    />

                    <span>Dark</span>
                  </ToggleButton>

                </ToggleButtonGroup>

              </Box>

              <Box className="settings-panel-actions">

                <Button
                  variant="contained"
                  color="success"
                  startIcon={<Save />}
                  onClick={
                    handleSavePreferences
                  }
                >
                  Save Preferences
                </Button>

              </Box>

            </Box>
          )}

          {/* =================================================
              SECURITY
          ================================================= */}

          {activeSection === "security" && (
            <Box className="settings-panel">

              <Box className="settings-panel-heading">

                <Box>
                  <Typography
                    variant="subtitle1"
                    className="settings-panel-title"
                  >
                    Security
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Protect your FarmXP administrator
                    account.
                  </Typography>
                </Box>

                <Security className="panel-heading-icon" />

              </Box>

              <Divider />

              {/* PASSWORD */}

              <SecurityItem
                icon="🔒"
                title="Password"
                description="Keep your account secure by regularly updating your password."
              >

                {!passwordFormOpen ? (
                  <Box className="security-item-action">

                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        setPasswordFormOpen(true)
                      }
                    >
                      Change Password
                    </Button>

                  </Box>
                ) : (
                  <Box className="password-form">

                    <Typography
                      variant="body2"
                      fontWeight={600}
                    >
                      Change Password
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Enter your current password
                      and choose a new password.
                    </Typography>

                    {/* CURRENT PASSWORD */}

                    <TextField
                      label="Current Password"
                      type={
                        showPassword.current
                          ? "text"
                          : "password"
                      }
                      value={
                        passwordForm.currentPassword
                      }
                      onChange={
                        handlePasswordFieldChange(
                          "currentPassword"
                        )
                      }
                      error={Boolean(
                        passwordErrors.currentPassword
                      )}
                      helperText={
                        passwordErrors.currentPassword
                      }
                      size="small"
                      fullWidth
                      margin="dense"
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">

                              <IconButton
                                size="small"
                                onClick={() =>
                                  togglePasswordVisibility(
                                    "current"
                                  )
                                }
                              >
                                {showPassword.current ? (
                                  <VisibilityOff fontSize="small" />
                                ) : (
                                  <Visibility fontSize="small" />
                                )}
                              </IconButton>

                            </InputAdornment>
                          ),
                        }
                      }}
                    />

                    {/* NEW PASSWORD */}

                    <TextField
                      label="New Password"
                      type={
                        showPassword.new
                          ? "text"
                          : "password"
                      }
                      value={
                        passwordForm.newPassword
                      }
                      onChange={
                        handlePasswordFieldChange(
                          "newPassword"
                        )
                      }
                      error={Boolean(
                        passwordErrors.newPassword
                      )}
                      helperText={
                        passwordErrors.newPassword ||
                        "Minimum 8 characters"
                      }
                      size="small"
                      fullWidth
                      margin="dense"
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">

                              <IconButton
                                size="small"
                                onClick={() =>
                                  togglePasswordVisibility(
                                    "new"
                                  )
                                }
                              >
                                {showPassword.new ? (
                                  <VisibilityOff fontSize="small" />
                                ) : (
                                  <Visibility fontSize="small" />
                                )}
                              </IconButton>

                            </InputAdornment>
                          ),
                        }
                      }}
                    />

                    {/* CONFIRM PASSWORD */}

                    <TextField
                      label="Confirm New Password"
                      type={
                        showPassword.confirm
                          ? "text"
                          : "password"
                      }
                      value={
                        passwordForm.confirmPassword
                      }
                      onChange={
                        handlePasswordFieldChange(
                          "confirmPassword"
                        )
                      }
                      error={Boolean(
                        passwordErrors.confirmPassword
                      )}
                      helperText={
                        passwordErrors.confirmPassword
                      }
                      size="small"
                      fullWidth
                      margin="dense"
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">

                              <IconButton
                                size="small"
                                onClick={() =>
                                  togglePasswordVisibility(
                                    "confirm"
                                  )
                                }
                              >
                                {showPassword.confirm ? (
                                  <VisibilityOff fontSize="small" />
                                ) : (
                                  <Visibility fontSize="small" />
                                )}
                              </IconButton>

                            </InputAdornment>
                          ),
                        }
                      }}
                    />

                    <Box className="password-form-actions">

                      <Button
                        variant="text"
                        size="small"
                        onClick={
                          handleCancelPassword
                        }
                      >
                        Cancel
                      </Button>

                        <Button
                          variant="contained"
                          color="success"
                          onClick={
                            handleUpdatePassword
                          }
                          disabled={savingPassword}
                        >
                          {savingPassword ? "Updating..." : "Update Password"}
                        </Button>

                    </Box>

                  </Box>
                )}

              </SecurityItem>

              <Divider className="security-divider" />

              {/* LOGIN ACTIVITY */}

              <SecurityItem
                icon={<Login />}
                title="Login Activity"
                description="Review recent login activity on your administrator account."
              >

                <Box className="security-item-action">

                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() =>
                      setLoginActivityOpen(true)
                    }
                  >
                    View Activity
                  </Button>

                </Box>

              </SecurityItem>

              <Divider className="security-divider" />

              {/* DELETE ACCOUNT */}

              <SecurityItem
                icon="🗑️"
                title="Delete Account"
                description="Permanently delete your FarmXP administrator account."
                danger
              >

                <Box className="security-item-action">

                  <Button
                    variant="text"
                    color="error"
                    size="small"
                    startIcon={<span>🗑️</span>}
                    onClick={() =>
                      setDeleteDialogOpen(true)
                    }
                  >
                    Delete Account
                  </Button>

                </Box>

              </SecurityItem>

            </Box>
          )}

        </Box>
      </Box>

      {/* =====================================================
          LOGIN ACTIVITY DIALOG
      ===================================================== */}

      <Dialog
        open={loginActivityOpen}
        onClose={() =>
          setLoginActivityOpen(false)
        }
        maxWidth="xs"
        fullWidth
      >

        <DialogTitle>

          Login Activity

          <IconButton
            onClick={() =>
              setLoginActivityOpen(false)
            }
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <Close />
          </IconButton>

        </DialogTitle>

        <DialogContent dividers>

          {LOGIN_ACTIVITY.map((entry) => (
            <Box
              key={entry.id}
              className="login-activity-row"
            >

              <Box>

                <Typography
                  variant="body2"
                  fontWeight={600}
                >
                  {entry.device}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  {entry.time}
                </Typography>

              </Box>

              {entry.current && (
                <Chip
                  label="Current"
                  size="small"
                  color="success"
                  variant="outlined"
                />
              )}

            </Box>
          ))}

        </DialogContent>

        <DialogActions>

          <Button
            onClick={() =>
              setLoginActivityOpen(false)
            }
          >
            Close
          </Button>

        </DialogActions>

      </Dialog>

      {/* =====================================================
          DELETE ACCOUNT DIALOG
      ===================================================== */}

      <Dialog
        open={deleteDialogOpen}
        onClose={() =>
          setDeleteDialogOpen(false)
        }
        maxWidth="xs"
        fullWidth
      >

        <DialogTitle>
          Delete your account?
        </DialogTitle>

        <DialogContent>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            This action cannot be undone. Your
            FarmXP administrator account and
            associated data will be permanently
            removed.
          </Typography>

        </DialogContent>

        <DialogActions>

          <Button
            onClick={() =>
              setDeleteDialogOpen(false)
            }
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </Button>

        </DialogActions>

      </Dialog>

      {/* =====================================================
          SNACKBAR
      ===================================================== */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >

        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={closeSnackbar}
        >
          {snackbar.message}
        </Alert>

      </Snackbar>

    </Box>
  );
};

export default Settings;