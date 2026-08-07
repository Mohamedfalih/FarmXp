import React from 'react';
import { Box, Typography } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ScienceIcon from '@mui/icons-material/Science';
import PersonIcon from '@mui/icons-material/Person';
import ShieldIcon from '@mui/icons-material/Shield';
import './AdminDashboard.css';

// Mock stat data — kept inline in this page. Replace with
// adminService.getDashboardStats() once the backend is ready.
const STATS = [
  {
    id: 1,
    icon: <PeopleIcon />,
    iconBg: 'var(--sprout-light)',
    value: '1,284',
    label: 'Total Farmers',
    trend: '+18 today',
  },
  {
    id: 2,
    icon: <HourglassEmptyIcon />,
    iconBg: 'var(--harvest-light)',
    value: '7',
    label: 'Practices Pending Review',
    trend: '3 new',
  },
  {
    id: 3,
    icon: <AccountBalanceIcon />,
    iconBg: 'var(--sky-light)',
    value: '24',
    label: 'Active Schemes',
    trend: '2 new',
  },
  {
    id: 4,
    icon: <StorefrontIcon />,
    iconBg: 'var(--clay-light)',
    value: '312',
    label: 'Buyer Matches',
    trend: '+12',
  },
];

// Mock recent activity — kept inline, same pattern as above.
// Replace with adminService.getRecentActivity() once the backend is ready.
const RECENT_ACTIVITY = [
  {
    id: 1,
    icon: <ScienceIcon fontSize="small" />,
    badgeType: 'harvest',
    text: 'Selvi P. submitted a new practice for verification',
    time: '10 min ago',
  },
  {
    id: 2,
    icon: <PersonIcon fontSize="small" />,
    badgeType: 'sky',
    text: '3 new farmers registered today',
    time: '1h ago',
  },
  {
    id: 3,
    icon: <AccountBalanceIcon fontSize="small" />,
    badgeType: 'harvest',
    text: 'Scheme "Soil Health Card" updated',
    time: '3h ago',
  },
  {
    id: 4,
    icon: <StorefrontIcon fontSize="small" />,
    badgeType: 'clay',
    text: 'New buyer "Nilgiri Organics" onboarded',
    time: '1 day ago',
  },
];

const AdminDashboard = () => {
  return (
    <Box className="admin-dashboard">
      {/* Hero banner */}
      <Box className="dashboard-hero">
        <Box>
          <Typography className="dashboard-hero-eyebrow">
            FARMXP ADMIN OVERVIEW
          </Typography>
          <Typography className="dashboard-hero-title">
            Platform Health Summary
          </Typography>
          <Typography className="dashboard-hero-subtitle">
            1,284 farmers · 24 active schemes · 79% verification rate
          </Typography>
        </Box>
        <ShieldIcon className="dashboard-hero-icon" />
      </Box>

      {/* Stat cards */}
      <Box className="dashboard-stats-grid">
        {STATS.map((stat) => (
          <Box key={stat.id} className="dashboard-stat-card">
            <Box className="dashboard-stat-top">
              <Box className="dashboard-stat-icon" sx={{ background: stat.iconBg }}>
                {stat.icon}
              </Box>
              <span className="dashboard-stat-trend">{stat.trend}</span>
            </Box>
            <Typography className="dashboard-stat-value">{stat.value}</Typography>
            <Typography className="dashboard-stat-label">{stat.label}</Typography>
          </Box>
        ))}
      </Box>

      {/* Recent activity */}
      <Box className="dashboard-section-title">
        <Typography variant="h6">Recent Activity</Typography>
      </Box>
      <Box className="dashboard-activity-card">
        {RECENT_ACTIVITY.map((item) => (
          <Box key={item.id} className="dashboard-activity-row">
            <Box className={`dashboard-activity-icon ${item.badgeType}`}>
              {item.icon}
            </Box>
            <Typography className="dashboard-activity-text">{item.text}</Typography>
            <span className="dashboard-activity-time">{item.time}</span>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AdminDashboard;