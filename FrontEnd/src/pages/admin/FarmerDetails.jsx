import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Box,
  Card,
  Avatar,
  Chip,
  Button,
  CircularProgress,
  Typography,
  Divider,
  LinearProgress,
} from '@mui/material';

import ArrowBack from "@mui/icons-material/ArrowBack";
import LocationOn from "@mui/icons-material/LocationOn";
import Phone from "@mui/icons-material/Phone";
import Email from "@mui/icons-material/Email";
import CalendarToday from "@mui/icons-material/CalendarToday";
import BugReport from "@mui/icons-material/BugReport";
import Park from "@mui/icons-material/Park";
import Pending from "@mui/icons-material/Pending";
import { getFarmerById, formatDateForFrontend } from '../../services/adminService';
import './FarmerDetails.css';

const STATUS_COLOR = {
  Active: 'success',
  New: 'warning',
  Suspended: 'error',
};

const AVATAR_COLORS = [
  '#6FA83A',
  '#3E8FA0',
  '#C1552E',
  '#8FBF9E',
  '#B7A6E0',
];

const FarmerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFarmer = async () => {
      try {
        const data = await getFarmerById(id);
        
        // Normalize the backend AdminFarmerDetailResponse
        const normalizedFarmer = {
          id: data.profile?.farmerId || id,
          name: data.profile?.fullName || 'Unknown',
          status: data.profile?.status || 'Active',
          location: data.profile?.village || data.profile?.district || 'Unknown',
          phone: data.profile?.phone || 'Not available',
          email: data.email || 'Not available',
          joinedDate: data.joinedDate ? formatDateForFrontend(data.joinedDate) : 'Not available',
          farmSize: data.profile?.farmSize || 0,
          primaryCrop: data.primaryCrop || 'Not available',
          farmingType: data.farmingType || 'Not available',
          sustainabilityScore: data.sustainability?.totalScore || 0,
          metrics: {
            water: data.sustainability?.categoryScores?.find(c => c.category === 'WATER')?.score || 0,
            soil: data.sustainability?.categoryScores?.find(c => c.category === 'SOIL')?.score || 0,
            pestControl: data.sustainability?.categoryScores?.find(c => c.category === 'PEST_CONTROL')?.score || 0,
            cropDiversity: data.sustainability?.categoryScores?.find(c => c.category === 'CROP_DIVERSITY')?.score || 0,
          },
          learning: {
            completed: data.learning?.completedModules || 0,
            inProgress: data.learning?.inProgressModules || 0,
            total: data.learning?.totalModules || 0,
            xp: data.profile?.totalXp || 0
          },
          recentPractices: data.sustainability?.recentPractices || []
        };
        
        setFarmer(normalizedFarmer);
      } catch (error) {
        console.error('Failed to load farmer:', error);
        setFarmer(null);
      } finally {
        setLoading(false);
      }
    };

    loadFarmer();
  }, [id]);

  const getInitials = (name = '') =>
    name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  const handleBack = () => {
    navigate('/admin/farmers');
  };

  if (loading) {
    return (
      <Box className="farmer-details-state">
        <CircularProgress color="success" />
        <Typography color="text.secondary">
          Loading farmer details...
        </Typography>
      </Box>
    );
  }

  if (!farmer) {
    return (
      <Box className="farmer-details-page">
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBack}
          className="farmer-details-back"
        >
          Back to Farmers
        </Button>

        <Card className="farmer-details-not-found">
          <Typography className="not-found-icon">🔍</Typography>

          <Typography variant="h5" fontWeight={700}>
            Farmer Not Found
          </Typography>

          <Typography color="text.secondary">
            The farmer you're looking for doesn't exist or may have
            been removed.
          </Typography>

          <Button
            variant="contained"
            color="success"
            onClick={handleBack}
          >
            Back to Farmers
          </Button>
        </Card>
      </Box>
    );
  }

  return (
    <Box className="farmer-details-page">

      {/* Back */}
      <Button
        startIcon={<ArrowBack />}
        onClick={handleBack}
        className="farmer-details-back"
      >
        Back to Farmers
      </Button>

      {/* =====================================================
          FARMER PROFILE HEADER
      ====================================================== */}
      <Card className="farmer-profile-card">

        <Box className="farmer-profile-main">

          <Avatar
            className="farmer-details-avatar"
            sx={{
              bgcolor:
                AVATAR_COLORS[
                  Number(farmer.id) % AVATAR_COLORS.length
                ],
            }}
          >
            {getInitials(farmer.name)}
          </Avatar>

          <Box className="farmer-profile-info">

            <Box className="farmer-title-row">
              <Typography className="farmer-details-name">
                {farmer.name}
              </Typography>

              <Chip
                label={farmer.status}
                color={STATUS_COLOR[farmer.status] || 'default'}
                size="small"
              />
            </Box>

            <Typography className="farmer-location">
              <LocationOn fontSize="small" />
              {farmer.location}
            </Typography>

            <Typography className="farmer-id">
              Farmer ID: #{farmer.id}
            </Typography>

          </Box>

        </Box>

        <Divider />

        <Box className="farmer-contact-row">

          <Box className="contact-item">
            <Phone fontSize="small" />
            <Box>
              <Typography className="contact-label">
                Phone
              </Typography>
              <Typography className="contact-value">
                {farmer.phone || 'Not available'}
              </Typography>
            </Box>
          </Box>

          <Box className="contact-item">
            <Email fontSize="small" />
            <Box>
              <Typography className="contact-label">
                Email
              </Typography>
              <Typography className="contact-value">
                {farmer.email || 'Not available'}
              </Typography>
            </Box>
          </Box>

          <Box className="contact-item">
            <CalendarToday fontSize="small" />
            <Box>
              <Typography className="contact-label">
                Joined
              </Typography>
              <Typography className="contact-value">
                {farmer.joinedDate || 'Not available'}
              </Typography>
            </Box>
          </Box>

        </Box>

      </Card>

      {/* =====================================================
          FARM INFORMATION
      ====================================================== */}
      <Card className="farmer-details-card">

        <Box className="card-heading">
          <span>🌾</span>

          <Box>
            <Typography className="card-title">
              Farm Information
            </Typography>

            <Typography className="card-subtitle">
              Basic information about the farmer's farm
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box className="farm-info-grid">

          <Box className="info-box">
            <Typography className="info-label">
              Farm Location
            </Typography>

            <Typography className="info-value">
              {farmer.location || '—'}
            </Typography>
          </Box>

          <Box className="info-box">
            <Typography className="info-label">
              Farm Size
            </Typography>

            <Typography className="info-value">
              {farmer.farmSize
                ? `${farmer.farmSize} acres`
                : '—'}
            </Typography>
          </Box>

          <Box className="info-box">
            <Typography className="info-label">
              Primary Crop
            </Typography>

            <Typography className="info-value">
              {farmer.primaryCrop || '—'}
            </Typography>
          </Box>

          <Box className="info-box">
            <Typography className="info-label">
              Farming Type
            </Typography>

            <Typography className="info-value">
              {farmer.farmingType || '—'}
            </Typography>
          </Box>

        </Box>

      </Card>

      {/* =====================================================
          SUSTAINABILITY SCORE
      ====================================================== */}
      <Card className="farmer-details-card">

        <Box className="card-heading">
          <span>🏆</span>

          <Box>
            <Typography className="card-title">
              Sustainability Score
            </Typography>

            <Typography className="card-subtitle">
              Current sustainability performance
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box className="score-summary">

          <Box className="score-main">
            <Typography className="score-number">
              {farmer.sustainabilityScore ?? 0}
            </Typography>

            <Typography className="score-out-of">
              / 100
            </Typography>
          </Box>

          <Box className="score-progress">
            <LinearProgress
              variant="determinate"
              value={farmer.sustainabilityScore ?? 0}
              className="score-linear"
            />

            <Typography>
              Overall Sustainability Score
            </Typography>
          </Box>

        </Box>

        <Box className="metric-grid">

          <Box className="metric-item">
            <span className="metric-icon water-icon">💧</span>

            <Box>
              <Typography className="metric-label">
                Water
              </Typography>

              <Typography className="metric-value">
                {farmer.metrics?.water ?? 0}/25
              </Typography>
            </Box>
          </Box>

          <Box className="metric-item">
            <span className="metric-icon soil-icon">🌱</span>

            <Box>
              <Typography className="metric-label">
                Soil
              </Typography>

              <Typography className="metric-value">
                {farmer.metrics?.soil ?? 0}/25
              </Typography>
            </Box>
          </Box>

          <Box className="metric-item">
            <BugReport className="metric-icon pest-icon" />

            <Box>
              <Typography className="metric-label">
                Pest Control
              </Typography>

              <Typography className="metric-value">
                {farmer.metrics?.pestControl ?? 0}/25
              </Typography>
            </Box>
          </Box>

          <Box className="metric-item">
            <Park className="metric-icon crop-icon" />

            <Box>
              <Typography className="metric-label">
                Crop Diversity
              </Typography>

              <Typography className="metric-value">
                {farmer.metrics?.cropDiversity ?? 0}/25
              </Typography>
            </Box>
          </Box>

        </Box>

      </Card>

      {/* =====================================================
          LEARNING PROGRESS
      ====================================================== */}
      <Card className="farmer-details-card">

        <Box className="card-heading">
          <span>🏆</span>

          <Box>
            <Typography className="card-title">
              Learning Progress
            </Typography>

            <Typography className="card-subtitle">
              Farmer's progress across learning modules
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box className="learning-summary">

          <Box className="learning-stat">
            <Typography className="learning-number">
              {farmer.learning?.completed ?? 0}
            </Typography>

            <Typography>
              Completed
            </Typography>
          </Box>

          <Box className="learning-stat">
            <Typography className="learning-number">
              {farmer.learning?.inProgress ?? 0}
            </Typography>

            <Typography>
              In Progress
            </Typography>
          </Box>

          <Box className="learning-stat">
            <Typography className="learning-number">
              {farmer.learning?.total ?? 0}
            </Typography>

            <Typography>
              Total Modules
            </Typography>
          </Box>

          <Box className="learning-stat">
            <Typography className="learning-number">
              {farmer.learning?.xp ?? 0}
            </Typography>

            <Typography>
              XP Earned
            </Typography>
          </Box>

        </Box>

      </Card>

      {/* =====================================================
          PRACTICE ACTIVITY
      ====================================================== */}
      <Card className="farmer-details-card">

        <Box className="card-heading">
          <span>✅</span>

          <Box>
            <Typography className="card-title">
              Practice Activity
            </Typography>

            <Typography className="card-subtitle">
              Recent sustainable farming practice activity
            </Typography>
          </Box>
        </Box>

        <Divider />

        {farmer.recentPractices?.length > 0 ? (
          <Box className="practice-list">

            {farmer.recentPractices.map((practice) => (
              <Box
                className="practice-item"
                key={practice.id}
              >

                <Box>
                  <Typography className="practice-name">
                    {practice.name}
                  </Typography>

                  <Typography className="practice-date">
                    {practice.date}
                  </Typography>
                </Box>

                <Chip
                  icon={
                    practice.status === 'Verified'
                      ? <span>✅</span>
                      : <Pending />
                  }
                  label={practice.status}
                  color={
                    practice.status === 'Verified'
                      ? 'success'
                      : 'warning'
                  }
                  size="small"
                />

              </Box>
            ))}

          </Box>
        ) : (
          <Box className="no-practices">
            <Typography color="text.secondary">
              No practice activity available.
            </Typography>
          </Box>
        )}

      </Card>

    </Box>
  );
};

export default FarmerDetails;