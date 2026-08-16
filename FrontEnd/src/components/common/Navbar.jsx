import React, { useState, useEffect } from 'react';
import { Box, Typography, Badge, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import authService from '../../services/authService';

import farmerService from '../../services/farmerService';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';

const Navbar = ({ onMenuClick, pageTitle = 'Dashboard' }) => {
  const [farmerName, setFarmerName] = useState('Guest Farmer');
  const notificationCount = 0;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          if (user.role === 'ADMIN') {
             setFarmerName(user.sub || 'Admin');
             return;
          }
          const profile = await farmerService.getProfile();
          if (profile && profile.fullName) {
            setFarmerName(profile.fullName);
          } else {
             setFarmerName(user.sub || 'Farmer');
          }
        }
      } catch (e) {
        const user = await authService.getCurrentUser();
        if (user && user.sub) {
           setFarmerName(user.sub);
        }
      }
    };
    fetchProfile();
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 24px',
        bgcolor: '#FFFFFF',
        borderBottom: '1px solid #E4DFCF',
        width: '100%',
        minHeight: '56px',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Hamburger — only visible on mobile/tablet */}
        <IconButton
          onClick={onMenuClick}
          sx={{
            display: { xs: 'flex', md: 'none' },
            color: '#173019',
          }}
        >
          <MenuIcon />
        </IconButton>

        <Typography sx={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '18px', color: '#173019' }}>
          {pageTitle}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <Box
          component={Link}
          to="/farmer/notifications"
          sx={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            bgcolor: '#FBF7EC',
            border: '1px solid #E4DFCF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '15px',
            position: 'relative',
          }}
        >
          <NotificationsIcon sx={{ fontSize: '20px' }} />
          {notificationCount > 0 && (
            <Badge
              variant="dot"
              sx={{
                position: 'absolute',
                top: 6,
                right: 7,
                '& .MuiBadge-dot': { bgcolor: '#C1552E', border: '2px solid #fff' },
              }}
            />
          )}
        </Box>

        <Box
          component={Link}
          to="/farmer/my-farm"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 10px 4px 4px',
            borderRadius: '100px',
            bgcolor: '#FBF7EC',
            border: '1px solid #E4DFCF',
            textDecoration: 'none',
          }}
        >
          <Box
            sx={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              bgcolor: '#6FA83A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: '12px',
            }}
          >
            {farmerName.charAt(0)}
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: '13px', color: '#1E2B1F' }}>
            {farmerName}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Navbar;