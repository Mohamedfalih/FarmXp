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
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  getSchemeById,
  updateScheme,
  formatDateForFrontend
} from '../../services/adminService';
import './EditScheme.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SaveIcon from '@mui/icons-material/Save';

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

  // NEW: controls whether the scheme has a fixed deadline
  const [hasDeadline, setHasDeadline] = useState(true);

  const [status, setStatus] = useState('Active');
  const [benefitSummary, setBenefitSummary] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [minFarmSize, setMinFarmSize] = useState('');
  const [applicableCrops, setApplicableCrops] = useState('');
  const [officialWebsiteUrl, setOfficialWebsiteUrl] = useState('');
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
      setCategory(scheme.department || scheme.category || '');

      const formattedDeadline = formatDateForFrontend(
        scheme.lastDate || scheme.deadline
      );

      setDeadline(formattedDeadline);

      // If backend has no date, treat it as "No fixed deadline"
      if (formattedDeadline) {
        setHasDeadline(true);
      } else {
        setHasDeadline(false);
      }

      setStatus(
        scheme.status === 'INACTIVE'
          ? 'Draft'
          : scheme.status === 'ACTIVE'
            ? 'Active'
            : scheme.status || 'Active'
      );

      // backend field is 'description' — map to benefitSummary state
      setBenefitSummary(scheme.description || '');

      setEligibility(scheme.eligibility || '');
      setMinFarmSize(scheme.minFarmSize || '');
      setApplicableCrops(scheme.applicableCrops || '');
      setOfficialWebsiteUrl(scheme.officialWebsiteUrl || '');

      setLoading(false);
    });
  }, [id]);

  const handleBack = () => navigate('/admin/schemes');

  // Deadline is required only when hasDeadline is true
  const isFormValid =
    schemeName.trim() &&
    category.trim() &&
    (!hasDeadline || deadline.trim());

  const handleSave = async () => {
    setSaving(true);

    try {
      await updateScheme(id, {
        schemeName,
        category,

        // If no fixed deadline, send null
        deadline: hasDeadline ? deadline : null,

        // pass benefitSummary as description so adminService maps it
        // to the backend 'description' field
        description: benefitSummary,
        benefits: benefitSummary,

        status,
        eligibility,
        minFarmSize,
        applicableCrops,
        officialWebsiteUrl,
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

      <IconButton
        onClick={handleBack}
        className="edit-scheme-back"
      >
        <ArrowBackIcon />
      </IconButton>

      <Card className="edit-scheme-card">

        <Box className="edit-scheme-title">
          <AccountBalanceIcon color="success" />

          <Typography variant="h6">
            Edit Government Scheme
          </Typography>
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
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            label="Deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            margin="normal"
            disabled={!hasDeadline}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={!hasDeadline}
                onChange={(e) => {
                  const noDeadline = e.target.checked;

                  setHasDeadline(!noDeadline);

                  if (noDeadline) {
                    setDeadline('');
                  }
                }}
              />
            }
            label="No fixed deadline"
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

        <TextField
          fullWidth
          label="Official Website URL"
          placeholder="e.g. https://pmksy.gov.in/"
          value={officialWebsiteUrl}
          onChange={(e) => setOfficialWebsiteUrl(e.target.value)}
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