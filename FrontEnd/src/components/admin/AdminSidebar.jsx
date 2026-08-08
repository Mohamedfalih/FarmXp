import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Box, Drawer, List, ListItemButton, Typography, Chip } from '@mui/material';
import {
  Dashboard,
  Verified,
  People,
  AccountBalance,
  Storefront,
  BarChart,
  AdminPanelSettings,
  Settings,
} from '@mui/icons-material';
import './AdminSidebar.css';

const drawerWidth = 250;

const menuGroups = [
  {
    label: null,
    items: [{ text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' }],
  },
  {
    label: 'Verification',
    items: [
      { text: 'Verify Certified Practices', icon: <Verified />, path: '/admin/verify-practices' },
    ],
  },
  {
    label: 'Management',
    items: [
      { text: 'Farmer Management', icon: <People />, path: '/admin/farmers' },
      { text: 'Government Scheme Mgmt', icon: <AccountBalance />, path: '/admin/schemes' },
      { text: 'Market Buyer Mgmt', icon: <Storefront />, path: '/admin/buyers' },
    ],
  },
  {
    label: 'Insights',
    items: [{ text: 'Reports & Analytics', icon: <BarChart />, path: '/admin/reports' }],
  },
  {
    label: 'Account',
    items: [
      { text: 'Admin Management', icon: <AdminPanelSettings />, path: '/admin/admins' },
      { text: 'Settings', icon: <Settings />, path: '/admin/settings' },
    ],
  },
];

const SideItem = ({ icon, text, path, isSelected, onClick }) => (
  <ListItemButton
    component={Link}
    to={path}
    onClick={onClick}
    disableRipple
    className={`admin-side-item ${isSelected ? 'active' : ''}`}
  >
    <Box component="span" className="admin-side-item-icon">
      {icon}
    </Box>
    {text}
  </ListItemButton>
);

const AdminSidebar = ({ mobileOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Later: clear JWT / auth state here before redirecting
    navigate('/login');
  };

  const drawerContent = (
    <Box className="admin-sidebar-drawer">
      <Box className="admin-sidebar-logo">
        <Box component="span" className="admin-sidebar-mark">🌾</Box>
        <Typography className="admin-sidebar-word">FarmXP</Typography>
        <Chip label="ADMIN" size="small" className="admin-sidebar-tag" />
      </Box>

      {menuGroups.map((group, idx) => (
        <List key={idx} disablePadding className="admin-sidebar-list">
          {group.label && (
            <Typography className="admin-sidebar-group-label">{group.label}</Typography>
          )}
          {group.items.map((item) => (
            <SideItem
              key={item.text}
              icon={item.icon}
              text={item.text}
              path={item.path}
              isSelected={location.pathname === item.path}
              onClick={onClose}
            />
          ))}
        </List>
      ))}

      <Box className="admin-sidebar-bottom">
        <SideItem icon="🚪" text="Log Out" path="#" isSelected={false} onClick={handleLogout} />
      </Box>
    </Box>
  );

  return (
    <Box component="nav" className="admin-sidebar-nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      {/* Mobile temporary drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        className="admin-sidebar-drawer-mobile"
        sx={{
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop permanent drawer */}
      <Drawer
        variant="permanent"
        className="admin-sidebar-drawer-desktop"
        sx={{
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default AdminSidebar;