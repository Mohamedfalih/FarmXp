import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Navbar from '../../components/common/Navbar';
import FarmerSidebar from '../../components/farmer/FarmerSidebar';

const getPageTitle = (pathname) => {
  if (pathname === '/farmer/dashboard' || pathname === '/farmer') return 'Dashboard';
  if (pathname.startsWith('/farmer/my-farm')) return 'My Farm';
  if (pathname.includes('/quiz')) return 'Quiz';
  if (pathname.includes('/start')) return 'Start Module';
  if (pathname.match(/\/learning-modules\/\d+/)) return 'Module Details';
  if (pathname.startsWith('/farmer/learning-modules')) return 'Learning Modules';
  if (pathname.startsWith('/farmer/progress')) return 'Progress';
  if (pathname.startsWith('/farmer/leaderboard')) return 'Leaderboard';
  if (pathname.startsWith('/farmer/practice/add')) return 'Add Practice';
  if (pathname.startsWith('/farmer/practice-logs')) return 'Certified Practices';
  if (pathname.startsWith('/farmer/sustainability-metrics')) return 'Sustainability Metrics';
  if (pathname.match(/\/govt-schemes\/\d+/)) return 'Scheme Details';
  if (pathname.startsWith('/farmer/govt-schemes')) return 'Govt. Schemes';
  if (pathname.startsWith('/farmer/ai-assistant')) return 'AI Assistant';
  if (pathname.match(/\/market-buyers\/\d+/)) return 'Contact Buyer';
  if (pathname.startsWith('/farmer/market-buyers')) return 'Market Buyers';
  if (pathname.startsWith('/farmer/profile') || pathname.startsWith('/farmer/edit-farm')) return 'Edit Farm';
  if (pathname.startsWith('/farmer/notifications')) return 'Notifications';
  if (pathname.startsWith('/farmer/settings')) return 'Settings';
  return 'Dashboard';
};

const FarmerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const handleSidebarToggle = () => setSidebarOpen((prev) => !prev);
  const handleSidebarClose = () => setSidebarOpen(false);

  const currentTitle = getPageTitle(location.pathname);

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <CssBaseline />

      <FarmerSidebar mobileOpen={sidebarOpen} onClose={handleSidebarClose} />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          height: '100vh',
          minWidth: 0,
        }}
      >
        {/* Fixed header — no longer sticky inside the scroll area, so it can never overlap content */}
        <Navbar onMenuClick={handleSidebarToggle} pageTitle={currentTitle} />

        {/* Only this region scrolls */}
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

export default FarmerLayout;