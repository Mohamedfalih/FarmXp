import React from 'react';
import { Box, Typography, Badge } from '@mui/material';
import { Link } from 'react-router-dom';

const drawerWidth = 250;

const Navbar = ({ onMenuClick, pageTitle = 'Dashboard' }) => {
  const farmerName = 'Guest Farmer';
  const notificationCount = 0;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 34px',
        bgcolor: '#FFFFFF',
        borderBottom: '1px solid #E4DFCF',
        position: 'sticky',
        top: 0,
        zIndex: 5,
        width: { md: `calc(100% - ${drawerWidth}px)` },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <Box
          component="button"
          onClick={onMenuClick}
          sx={{
            display: { xs: 'flex', md: 'none' },
            width: 42,
            height: 42,
            borderRadius: '50%',
            bgcolor: '#FBF7EC',
            border: '1px solid #E4DFCF',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            cursor: 'pointer',
          }}
        >
          ☰
        </Box>
        <Typography sx={{ fontFamily: "'Baloo 2', sans-serif", fontSize: '22px', color: '#173019' }}>
          {pageTitle}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        <Box
          component={Link}
          to="/farmer/notifications"
          sx={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            bgcolor: '#FBF7EC',
            border: '1px solid #E4DFCF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            position: 'relative',
            textDecoration: 'none',
          }}
        >
          🔔
          {notificationCount > 0 && (
            <Badge
              variant="dot"
              sx={{
                position: 'absolute',
                top: 8,
                right: 9,
                '& .MuiBadge-dot': { bgcolor: '#C1552E', border: '2px solid #fff' },
              }}
            />
          )}
        </Box>

        <Box
          component={Link}
          to="/farmer/profile"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '6px 12px 6px 6px',
            borderRadius: '100px',
            bgcolor: '#FBF7EC',
            border: '1px solid #E4DFCF',
            textDecoration: 'none',
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              bgcolor: '#6FA83A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: '14px',
            }}
          >
            {farmerName.charAt(0)}
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: '14px', color: '#1E2B1F' }}>
            {farmerName}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Navbar;