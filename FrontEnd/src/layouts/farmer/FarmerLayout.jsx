import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Navbar from '../../components/common/Navbar';
import FarmerSidebar from '../../components/farmer/FarmerSidebar';

const pageTitles = {
  '/farmer/dashboard': 'Dashboard',
  '/farmer/my-farm': 'My Farm',
  '/farmer/learning-modules': 'Learning Modules',
  '/farmer/progress': 'Progress',
  '/farmer/leaderboard': 'Leaderboard',
  '/farmer/practice-logs': 'Certified Practices',
  '/farmer/sustainability-metrics': 'Sustainability Metrics',
  '/farmer/govt-schemes': 'Govt. Schemes',
  '/farmer/ai-assistant': 'AI Assistant',
  '/farmer/market-buyers': 'Market Buyers',
  '/farmer/profile': 'Farmer Profile',
  '/farmer/notifications': 'Notifications',
  '/farmer/settings': 'Settings',
};

const FarmerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const handleSidebarToggle = () => setSidebarOpen((prev) => !prev);
  const handleSidebarClose = () => setSidebarOpen(false);

  const currentTitle = pageTitles[location.pathname] || 'Dashboard';

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