import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Typography,
  TextField,
  MenuItem,
  IconButton,
  Button,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SaveIcon from '@mui/icons-material/Save';
import { getSchemeById, updateScheme } from '../../services/adminService';
import './EditScheme.css';

// Page-specific constants — only this page uses these
const CATEGORIES = [
  'Irrigation',
  'Soil',
  'Income Support',
  'Livestock',
  'Organic Certification',
];

const STATUSES = ['Active', 'Draft'];

const EditScheme = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [schemeName, setSchemeName] = useState('');
  const [category, setCategory] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('Active');
  const [benefitSummary, setBenefitSummary] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [minFarmSize, setMinFarmSize] = useState('');
  const [applicableCrops, setApplicableCrops] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    getSchemeById(id).then((scheme) => {
      if (!scheme) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setSchemeName(scheme.title || '');
      setCategory(scheme.category || '');
      setDeadline(scheme.deadline || '');
      setStatus(scheme.status || 'Active');
      setBenefitSummary(scheme.benefitSummary || '');
      setEligibility(scheme.eligibility || '');
      setMinFarmSize(scheme.minFarmSize || '');
      setApplicableCrops(scheme.applicableCrops || '');
      setLoading(false);
    });
  }, [id]);

  const handleBack = () => navigate('/admin/schemes');

  const isFormValid = schemeName.trim() && category.trim() && deadline.trim();

  const handleSave = async () => {
    setSaving(true);

    try {
      await updateScheme(id, {
        schemeName,
        category,
        deadline,
        status,
        benefitSummary,
        eligibility,
        minFarmSize,
        applicableCrops,
      });
      navigate('/admin/schemes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box className="edit-scheme-state">
        <CircularProgress color="success" />
      </Box>
    );
  }

  if (notFound) {
    return (
      <Box className="edit-scheme">
        <IconButton onClick={handleBack} className="edit-scheme-back">
          <ArrowBackIcon />
        </IconButton>
        <Card className="edit-scheme-card">
          <Typography>Scheme not found.</Typography>
        </Card>
      </Box>
    );
  }

  return (
    <Box className="edit-scheme">
      <IconButton onClick={handleBack} className="edit-scheme-back">
        <ArrowBackIcon />
      </IconButton>

      <Card className="edit-scheme-card">
        <Box className="edit-scheme-title">
          <AccountBalanceIcon color="success" />
          <Typography variant="h6">Edit Government Scheme</Typography>
        </Box>

        <TextField
          fullWidth
          label="Scheme name"
          value={schemeName}
          onChange={(e) => setSchemeName(e.target.value)}
          margin="normal"
        />

        <Box className="edit-scheme-row">
          <TextField
            select
            fullWidth
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            margin="normal"
          >
            {CATEGORIES.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            margin="normal"
          />
        </Box>

        <TextField
          select
          fullWidth
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          margin="normal"
        >
          {STATUSES.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          multiline
          rows={2}
          label="Benefit summary"
          value={benefitSummary}
          onChange={(e) => setBenefitSummary(e.target.value)}
          margin="normal"
        />

        <TextField
          fullWidth
          multiline
          rows={2}
          label="Eligibility criteria"
          value={eligibility}
          onChange={(e) => setEligibility(e.target.value)}
          margin="normal"
        />

        <Box className="edit-scheme-row">
          <TextField
            fullWidth
            label="Min. farm size (acres)"
            value={minFarmSize}
            onChange={(e) => setMinFarmSize(e.target.value)}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Applicable crops"
            value={applicableCrops}
            onChange={(e) => setApplicableCrops(e.target.value)}
            margin="normal"
          />
        </Box>

        <Button
          fullWidth
          variant="contained"
          color="success"
          size="large"
          startIcon={<SaveIcon />}
          disabled={!isFormValid || saving}
          onClick={handleSave}
          className="edit-scheme-submit"
        >
          {saving ? 'Saving...' : 'Update Scheme'}
        </Button>
      </Card>
    </Box>
  );
};

export default EditScheme;