import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { getFarmers, getPendingPractices, getSchemes, getBuyers } from '../../services/adminService';
import './AdminDashboard.css';
import ScienceIcon from '@mui/icons-material/Science';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PeopleIcon from '@mui/icons-material/People';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ShieldIcon from '@mui/icons-material/Shield';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch multiple resources in parallel to aggregate admin stats
      const [farmersData, pendingPracticesData, schemesData, buyersData] = await Promise.all([
        getFarmers(),
        getPendingPractices(),
        getSchemes(),
        getBuyers()
      ]);

      const farmersList = Array.isArray(farmersData) ? farmersData : (farmersData?.farmers ?? farmersData?.content ?? []);
      const pendingList = Array.isArray(pendingPracticesData) ? pendingPracticesData : (pendingPracticesData?.practices ?? []);
      const schemesList = Array.isArray(schemesData) ? schemesData : (schemesData?.schemes ?? schemesData?.content ?? []);
      const buyersList = Array.isArray(buyersData) ? buyersData : (buyersData?.buyers ?? buyersData?.content ?? []);

      setStats({
        totalFarmers: farmersList.length,
        pendingPractices: pendingList.length,
        activeSchemes: schemesList.length,
        buyerMatches: buyersList.length, // representing total buyers for now
      });

      // Derive some basic "recent activity" from the lists
      const activity = [];
      if (pendingList.length > 0) {
        activity.push({
          id: 'act1',
          icon: <ScienceIcon fontSize="small" />,
          badgeType: 'harvest',
          text: `${pendingList.length} practices awaiting verification`,
          time: 'Action required',
        });
      }
      if (farmersList.length > 0) {
        activity.push({
          id: 'act2',
          icon: <PersonIcon fontSize="small" />,
          badgeType: 'sky',
          text: `${farmersList.length} total farmers registered`,
          time: 'Active',
        });
      }
      if (schemesList.length > 0) {
        activity.push({
          id: 'act3',
          icon: <AccountBalanceIcon fontSize="small" />,
          badgeType: 'harvest',
          text: `${schemesList.length} government schemes configured`,
          time: 'Active',
        });
      }
      if (buyersList.length > 0) {
        activity.push({
          id: 'act4',
          icon: <StorefrontIcon fontSize="small" />,
          badgeType: 'clay',
          text: `${buyersList.length} market buyers available`,
          time: 'Active',
        });
      }

      setRecentActivity(activity);
    } catch (err) {
      console.error('Failed to load admin dashboard stats:', err);
      setError('Unable to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box className="admin-dashboard">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress color="success" />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="admin-dashboard">
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Box>
    );
  }

  const STATS_CARDS = [
    {
      id: 1,
      icon: <PeopleIcon />,
      iconBg: 'var(--sprout-light)',
      value: stats.totalFarmers.toLocaleString(),
      label: 'Total Farmers',
      trend: 'Active',
    },
    {
      id: 2,
      icon: <HourglassEmptyIcon />,
      iconBg: 'var(--harvest-light)',
      value: stats.pendingPractices.toLocaleString(),
      label: 'Practices Pending Review',
      trend: stats.pendingPractices > 0 ? 'Requires action' : 'All clear',
    },
    {
      id: 3,
      icon: <AccountBalanceIcon />,
      iconBg: 'var(--sky-light)',
      value: stats.activeSchemes.toLocaleString(),
      label: 'Active Schemes',
      trend: 'Configured',
    },
    {
      id: 4,
      icon: <StorefrontIcon />,
      iconBg: 'var(--clay-light)',
      value: stats.buyerMatches.toLocaleString(),
      label: 'Market Buyers',
      trend: 'Configured',
    },
  ];

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
            {stats.totalFarmers} farmers · {stats.activeSchemes} active schemes
          </Typography>
        </Box>
        <ShieldIcon className="dashboard-hero-icon" />
      </Box>

      {/* Stat cards */}
      <Box className="dashboard-stats-grid">
        {STATS_CARDS.map((stat) => (
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
      {recentActivity.length > 0 && (
        <>
          <Box className="dashboard-section-title">
            <Typography variant="h6">System Overview</Typography>
          </Box>
          <Box className="dashboard-activity-card">
            {recentActivity.map((item) => (
              <Box key={item.id} className="dashboard-activity-row">
                <Box className={`dashboard-activity-icon ${item.badgeType}`}>
                  {item.icon}
                </Box>
                <Typography className="dashboard-activity-text">{item.text}</Typography>
                <span className="dashboard-activity-time">{item.time}</span>
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default AdminDashboard;