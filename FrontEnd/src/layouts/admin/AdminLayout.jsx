import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import AdminTopbar from '../../components/admin/AdminTopbar';
import AdminSidebar from '../../components/admin/AdminSidebar';

const pageTitles = {
  '/admin/dashboard': 'Dashboard',
  '/admin/verify-practices': 'Verify Certified Practices',
  '/admin/farmers': 'Farmer Management',
  '/admin/schemes': 'Government Scheme Management',
  '/admin/schemes/add': 'Add Scheme',
  '/admin/buyers': 'Market Buyer Management',
  '/admin/buyers/add': 'Add Buyer',
  '/admin/reports': 'Reports & Analytics',
  '/admin/admin-management': 'Admin Management',
  '/admin/settings': 'Settings',
  '/admin/notifications': 'Notifications', // ← added
};

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const handleSidebarToggle = () => setSidebarOpen((prev) => !prev);
  const handleSidebarClose = () => setSidebarOpen(false);

  // Dynamic matching
  const getPageTitle = (path) => {
    if (path.startsWith('/admin/dashboard')) return 'Dashboard';
    if (path.startsWith('/admin/verify-practices')) return 'Verify Certified Practices';
    if (path.startsWith('/admin/farmers')) return 'Farmer Management';
    if (path.startsWith('/admin/schemes')) return 'Government Scheme Management';
    if (path.startsWith('/admin/buyers')) return 'Market Buyer Management';
    if (path.startsWith('/admin/reports')) return 'Reports & Analytics';
    if (path.startsWith('/admin/admins')) return 'Admin Management';
    if (path.startsWith('/admin/settings')) return 'Settings';
    if (path.startsWith('/admin/notifications')) return 'Notifications';
    if (path.startsWith('/admin/learning-modules')) return 'Learning Modules';
    return 'Dashboard';
  };

  const currentTitle = getPageTitle(location.pathname);

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <CssBaseline />

      <AdminSidebar mobileOpen={sidebarOpen} onClose={handleSidebarClose} />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          height: '100vh',
          minWidth: 0,
        }}
      >
        <AdminTopbar onMenuToggle={handleSidebarToggle} pageTitle={currentTitle} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            bgcolor: '#FBF7EC',
            padding: { xs: '20px', md: '30px 34px 60px' },
            minWidth: 0,
          }}
        >
          <Box sx={{ maxWidth: '1280px', margin: '0 auto' }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;