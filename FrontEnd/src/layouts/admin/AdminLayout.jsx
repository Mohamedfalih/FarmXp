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
};

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const handleSidebarToggle = () => setSidebarOpen((prev) => !prev);
  const handleSidebarClose = () => setSidebarOpen(false);

  const currentTitle = pageTitles[location.pathname] || 'Dashboard';

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
        }}
      >
        <AdminTopbar onMenuClick={handleSidebarToggle} pageTitle={currentTitle} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            bgcolor: '#FBF7EC',
            padding: { xs: '20px', md: '30px 34px 60px' },
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