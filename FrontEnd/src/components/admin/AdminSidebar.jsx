
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  Typography,
  Chip,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import VerifiedIcon from "@mui/icons-material/Verified";
import PeopleIcon from "@mui/icons-material/People";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import StorefrontIcon from "@mui/icons-material/Storefront";
import BarChartIcon from "@mui/icons-material/BarChart";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

import "./AdminSidebar.css";

const drawerWidth = 250;

const menuGroups = [
  {
    label: null,
    items: [
      {
        text: "Dashboard",
        icon: <DashboardIcon />,
        path: "/admin/dashboard",
      },
    ],
  },

  {
    label: "Verification",
    items: [
      {
        text: "Verify Certified Practices",
        icon: <VerifiedIcon />,
        path: "/admin/verify-practices",
      },
    ],
  },

  {
    label: "Management",
    items: [
      {
        text: "Farmer Management",
        icon: <PeopleIcon />,
        path: "/admin/farmers",
      },
      {
        text: "Government Scheme Mgmt",
        icon: <AccountBalanceIcon />,
        path: "/admin/schemes",
      },
      {
        text: "Market Buyer Mgmt",
        icon: <StorefrontIcon />,
        path: "/admin/buyers",
      },
    ],
  },

  {
    label: "Insights",
    items: [
      {
        text: "Reports & Analytics",
        icon: <BarChartIcon />,
        path: "/admin/reports",
      },
    ],
  },

  {
    label: "Account",
    items: [
      {
        text: "Admin Management",
        icon: <AdminPanelSettingsIcon />,
        path: "/admin/admins",
      },
      {
        text: "Settings",
        icon: <SettingsIcon />,
        path: "/admin/settings",
      },
    ],
  },

  {
    label: "Notifications",
    items: [
      {
        text: "Notifications",
        icon: <NotificationsNoneOutlinedIcon />,
        path: "/admin/notifications",
      },
    ],
  },
];

const SideItem = ({
  icon,
  text,
  path,
  isSelected,
  onClick,
}) => (
  <ListItemButton
    component={Link}
    to={path}
    onClick={onClick}
    disableRipple
    className={`admin-side-item ${
      isSelected ? "active" : ""
    }`}
  >
    <Box
      component="span"
      className="admin-side-item-icon"
    >
      {icon}
    </Box>

    <span>{text}</span>
  </ListItemButton>
);

const AdminSidebar = ({ mobileOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Later:
    // localStorage.removeItem("token");
    // localStorage.removeItem("user");

    navigate("/login");
  };

  const drawerContent = (
    <Box className="admin-sidebar-drawer">
      {/* Logo */}
      <Box className="admin-sidebar-logo">
        <span className="admin-sidebar-mark">
          🌾
        </span>

        <Typography className="admin-sidebar-word">
          FarmXP
        </Typography>

        <Chip
          label="ADMIN"
          size="small"
          className="admin-sidebar-tag"
        />
      </Box>

      {/* Menu Groups */}
      {menuGroups.map((group, index) => (
        <List
          key={index}
          disablePadding
          className="admin-sidebar-list"
        >
          {group.label && (
            <Typography className="admin-sidebar-group-label">
              {group.label}
            </Typography>
          )}

          {group.items.map((item) => (
            <SideItem
              key={item.text}
              icon={item.icon}
              text={item.text}
              path={item.path}
              isSelected={
                location.pathname === item.path
              }
              onClick={onClose}
            />
          ))}
        </List>
      ))}

      {/* Logout */}
      <Box className="admin-sidebar-bottom">
        <SideItem
          icon="🚪"
          text="Log Out"
          path="/login"
          isSelected={false}
          onClick={(event) => {
            event.preventDefault();
            handleLogout();
          }}
        />
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      className="admin-sidebar-nav"
      sx={{
        width: {
          md: drawerWidth,
        },
        flexShrink: {
          md: 0,
        },
      }}
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        className="admin-sidebar-drawer-mobile"
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            border: "none",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        className="admin-sidebar-drawer-desktop"
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            border: "none",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default AdminSidebar;

