
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";

import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SettingsIcon from "@mui/icons-material/Settings";
import VerifiedIcon from "@mui/icons-material/Verified";

import "./AdminTopbar.css";

const AdminTopbar = ({ pageTitle, onMenuToggle }) => {
  const navigate = useNavigate();

  const [profileAnchor, setProfileAnchor] = useState(null);

  const profileOpen = Boolean(profileAnchor);

  const handleProfileOpen = (event) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchor(null);
  };

  const handleAdminProfile = () => {
    handleProfileClose();
    navigate("/admin/settings");
  };

  const handleSettings = () => {
    handleProfileClose();
    navigate("/admin/settings");
  };

  const handleNotifications = () => {
    navigate("/admin/notifications");
  };

  const handleLogout = () => {
    handleProfileClose();

    // Later:
    // localStorage.removeItem("token");
    // localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <Box className="admin-topbar">

      {/* LEFT */}
      <Box className="admin-topbar-left">

        <IconButton
          className="admin-topbar-menu-btn"
          onClick={onMenuToggle}
          aria-label="Open menu"
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          className="admin-topbar-title"
        >
          {pageTitle}
        </Typography>

      </Box>

      {/* RIGHT */}
      <Box className="admin-topbar-actions">

        {/* Notifications */}
        <IconButton
          className="admin-topbar-icon-btn"
          onClick={handleNotifications}
          aria-label="Notifications"
        >
          <Badge
            variant="dot"
            color="error"
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>

        {/* Admin Profile */}
        <Box
          className="admin-topbar-profile"
          onClick={handleProfileOpen}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" ||
              event.key === " "
            ) {
              handleProfileOpen(event);
            }
          }}
        >
          <Avatar className="admin-topbar-avatar">
            AD
          </Avatar>

          <Typography
            variant="body2"
            className="admin-topbar-name"
          >
            Admin
          </Typography>
        </Box>

      </Box>

      {/* PROFILE MENU */}
      <Menu
        anchorEl={profileAnchor}
        open={profileOpen}
        onClose={handleProfileClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >

        {/* Profile Header */}
        <Box className="admin-profile-menu-header">

          <Avatar className="admin-profile-menu-avatar">
            AD
          </Avatar>

          <Box>
            <Typography className="admin-profile-menu-name">
              Admin
            </Typography>

            <Typography className="admin-profile-menu-role">
              Administrator
            </Typography>
          </Box>

        </Box>

        <Divider />

        {/* Admin Profile */}
        <MenuItem onClick={handleAdminProfile}>
          <AdminPanelSettingsIcon fontSize="small" />

          <span>Admin Profile</span>
        </MenuItem>

        {/* Settings */}
        <MenuItem onClick={handleSettings}>
          <SettingsIcon fontSize="small" />

          <span>Settings</span>
        </MenuItem>

        <Divider />

        {/* Logout */}
        <MenuItem
          onClick={handleLogout}
          className="admin-profile-logout"
        >
          <VerifiedIcon fontSize="small" />

          <span>Log Out</span>
        </MenuItem>

      </Menu>

    </Box>
  );
};

export default AdminTopbar;

