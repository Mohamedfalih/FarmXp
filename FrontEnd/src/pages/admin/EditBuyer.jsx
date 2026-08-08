import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';

import {
  getBuyerById,
  updateBuyer,
} from '../../services/adminService';

import './EditBuyer.css';

const EditBuyer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    crops: '',
    status: 'Active',
    contactPerson: '',
    phone: '',
    email: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBuyer = async () => {
      try {
        const buyer = await getBuyerById(id);

        if (!buyer) {
          setError('Buyer not found.');
          return;
        }

        setFormData({
          name: buyer.name || '',
          location: buyer.location || '',
          crops: buyer.crops || '',
          status: buyer.status || 'Active',
          contactPerson: buyer.contactPerson || '',
          phone: buyer.phone || '',
          email: buyer.email || '',
        });
      } catch (err) {
        console.error('Failed to load buyer:', err);
        setError('Failed to load buyer.');
      } finally {
        setLoading(false);
      }
    };

    loadBuyer();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');

    if (
      !formData.name ||
      !formData.location ||
      !formData.crops ||
      !formData.contactPerson ||
      !formData.phone ||
      !formData.email
    ) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setSaving(true);

      await updateBuyer(id, formData);

      navigate(`/admin/buyers/${id}`);
    } catch (err) {
      console.error('Failed to update buyer:', err);
      setError('Failed to update buyer. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box className="edit-buyer-state">
        <CircularProgress color="success" />
      </Box>
    );
  }

  if (error && !formData.name) {
    return (
      <Box className="edit-buyer-page">

        <button
          className="edit-buyer-back"
          type="button"
          onClick={() => navigate('/admin/buyers')}
        >
          ← Back to Buyer Management
        </button>

        <Card className="edit-buyer-card edit-buyer-not-found">
          <Typography variant="h5">
            Buyer Not Found
          </Typography>

          <Typography color="text.secondary">
            {error}
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

  return (
    <Box className="edit-buyer-page">

      <button
        className="edit-buyer-back"
        type="button"
        onClick={() => navigate(`/admin/buyers/${id}`)}
      >
        ← Back to Buyer Details
      </button>

      <Card className="edit-buyer-card">

        <Typography
          variant="h5"
          className="edit-buyer-title"
        >
          Edit Buyer
        </Typography>

        <Typography
          variant="body2"
          className="edit-buyer-subtitle"
        >
          Update buyer information and market details.
        </Typography>

        {error && (
          <div className="edit-buyer-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="edit-buyer-grid">

            <TextField
              label="Buyer / Company Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />

            <TextField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              fullWidth
            />

            <TextField
              label="Crops / Products"
              name="crops"
              value={formData.crops}
              onChange={handleChange}
              placeholder="Example: Paddy, Vegetables"
              required
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>

              <Select
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleChange}
              >
                <MenuItem value="Active">
                  Active
                </MenuItem>

                <MenuItem value="Pending">
                  Pending
                </MenuItem>

                <MenuItem value="Suspended">
                  Suspended
                </MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Contact Person"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              required
              fullWidth
            />

            <TextField
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              fullWidth
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
            />

          </div>

          <Box className="edit-buyer-actions">

            <Button
              type="button"
              variant="outlined"
              onClick={() => navigate(`/admin/buyers/${id}`)}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>

          </Box>

        </form>

      </Card>

    </Box>
  );
};

export default EditBuyer;