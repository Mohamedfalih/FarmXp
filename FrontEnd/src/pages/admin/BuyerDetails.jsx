import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Card,
  Typography,
  Avatar,
  Chip,
  Button,
  CircularProgress,
} from '@mui/material';

import { getBuyerById } from '../../services/adminService';

import './BuyerDetails.css';

const BuyerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [buyer, setBuyer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBuyer = async () => {
      try {
        const data = await getBuyerById(id);
        setBuyer(data);
      } catch (error) {
        console.error('Failed to load buyer:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBuyer();
  }, [id]);

  if (loading) {
    return (
      <Box className="buyer-details-state">
        <CircularProgress color="success" />
      </Box>
    );
  }

  if (!buyer) {
    return (
      <Box className="buyer-details-page">

        <button
          className="buyer-details-back"
          type="button"
          onClick={() => navigate('/admin/buyers')}
        >
          ← Back to Buyer Management
        </button>

        <Card className="buyer-details-card not-found">
          <Typography variant="h5">
            Buyer Not Found
          </Typography>

          <Typography color="text.secondary">
            The buyer you're looking for does not exist.
          </Typography>

          <Button
            variant="contained"
            color="success"
            onClick={() => navigate('/admin/buyers')}
          >
            Back to Buyers
          </Button>
        </Card>

      </Box>
    );
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <Box className="buyer-details-page">

      <button
        className="buyer-details-back"
        type="button"
        onClick={() => navigate('/admin/buyers')}
      >
        ← Back to Buyer Management
      </button>

      <Card className="buyer-details-card">

        {/* Header */}
        <Box className="buyer-details-header">

          <Avatar className="buyer-details-avatar">
            {getInitials(buyer.name)}
          </Avatar>

          <Box>
            <Typography
              variant="h5"
              className="buyer-details-title"
            >
              {buyer.name}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              {buyer.location}
            </Typography>
          </Box>

          <Chip
            label={buyer.status}
            color={
              buyer.status === 'Active'
                ? 'success'
                : buyer.status === 'Pending'
                  ? 'warning'
                  : 'error'
            }
            className="buyer-status"
          />

        </Box>

        {/* Information */}
        <Box className="buyer-info-grid">

          <Box className="buyer-info-item">
            <span>📍 Location</span>
            <strong>{buyer.location}</strong>
          </Box>

          <Box className="buyer-info-item">
            <span>🌾 Crops / Products</span>
            <strong>{buyer.crops}</strong>
          </Box>

          <Box className="buyer-info-item">
            <span>👤 Contact Person</span>
            <strong>{buyer.contactPerson}</strong>
          </Box>

          <Box className="buyer-info-item">
            <span>📞 Phone</span>
            <strong>{buyer.phone}</strong>
          </Box>

          <Box className="buyer-info-item">
            <span>✉️ Email</span>
            <strong>{buyer.email}</strong>
          </Box>

          <Box className="buyer-info-item">
            <span>📊 Status</span>
            <strong>{buyer.status}</strong>
          </Box>

        </Box>

        {/* Actions */}
        <Box className="buyer-details-actions">

          <Button
            variant="outlined"
            onClick={() => navigate('/admin/buyers')}
          >
            Back
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={() => navigate(`/admin/buyers/${buyer.id}/edit`)}
          >
            Edit Buyer
          </Button>

        </Box>

      </Card>

    </Box>
  );
};

export default BuyerDetails;