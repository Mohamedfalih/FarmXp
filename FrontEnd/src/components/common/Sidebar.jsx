import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Drawer, List, ListItemButton, Typography } from '@mui/material';

const drawerWidth = 250;

const menuGroups = [
  {
    label: null,
    items: [
      { text: 'Dashboard', icon: '🏠', path: '/farmer/dashboard' },
      { text: 'Farmer Profile', icon: '👤', path: '/farmer/profile' },
    ],
  },
  {
    label: 'Learn & Grow',
    items: [
      { text: 'Learning Modules', icon: '📚', path: '/farmer/learning-modules' },
      { text: 'Progress', icon: '📈', path: '/farmer/progress' },
      { text: 'Leaderboard', icon: '🏆', path: '/farmer/leaderboard' },
    ],
  },
  {
    label: 'Sustainability',
    items: [
      { text: 'Certified Practices', icon: '🧪', path: '/farmer/practice-logs' },
      { text: 'Sustainability Metrics', icon: '💧', path: '/farmer/sustainability-metrics' },
    ],
  },
  {
    label: 'Opportunities',
    items: [
      { text: 'Govt. Schemes', icon: '🏛️', path: '/farmer/govt-schemes' },
      { text: 'AI Assistant', icon: '🤖', path: '/farmer/ai-assistant' },
      { text: 'Market Buyers', icon: '🛒', path: '/farmer/market-buyers' },
    ],
  },
  {
    label: 'Account',
    items: [
      { text: 'Notifications', icon: '🔔', path: '/farmer/notifications' },
      { text: 'Settings', icon: '⚙️', path: '/farmer/settings' },
    ],
  },
];

const SideItem = ({ icon, text, path, isSelected, onClick }) => (
  <ListItemButton
    component={Link}
    to={path}
    onClick={onClick}
    disableRipple
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '11px 12px',
      borderRadius: '12px',
      color: isSelected ? '#fff' : '#CFE0CC',
      fontWeight: 600,
      fontSize: '14.5px',
      bgcolor: isSelected ? '#6FA83A' : 'transparent',
      boxShadow: isSelected ? '0 6px 14px rgba(0,0,0,0.25)' : 'none',
      mb: '4px',
      '&:hover': {
        bgcolor: isSelected ? '#6FA83A' : 'rgba(255,255,255,0.06)',
        color: '#fff',
      },
    }}
  >
    <Box component="span" sx={{ fontSize: '18px', width: '22px', textAlign: 'center' }}>
      {icon}
    </Box>
    {text}
  </ListItemButton>
);

const Sidebar = ({ mobileOpen, onClose }) => {
  const location = useLocation();

  const drawerContent = (
    <Box
      sx={{
        width: drawerWidth,
        height: '100%',
        bgcolor: '#173019',
        color: '#fff',
        padding: '22px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        overflowY: 'auto',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px 22px 10px' }}>
        <Box component="span" sx={{ fontSize: '26px' }}>🌾</Box>
        <Typography sx={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 800, fontSize: '19px', color: '#fff' }}>
          FarmXP
        </Typography>
      </Box>

      {menuGroups.map((group, idx) => (
        <List key={idx} disablePadding sx={{ p: 0 }}>
          {group.label && (
            <Typography
              sx={{
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#8FA88F',
                padding: '16px 12px 6px',
                fontWeight: 700,
              }}
            >
              {group.label}
            </Typography>
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

      <Box sx={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <SideItem icon="🚪" text="Log Out" path="/login" isSelected={false} onClick={() => {}} />
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      {/* Mobile temporary drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop permanent drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none' },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;





