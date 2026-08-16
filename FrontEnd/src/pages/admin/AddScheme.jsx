import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Typography,
  TextField,
  MenuItem,
  IconButton,
  Button,
} from '@mui/material';
import { addScheme } from '../../services/adminService';
import './AddScheme.css';
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

const AddScheme = () => {
  const navigate = useNavigate();

  const [schemeName, setSchemeName] = useState('');
  const [category, setCategory] = useState('');
  const [deadline, setDeadline] = useState('');
  const [benefitSummary, setBenefitSummary] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [minFarmSize, setMinFarmSize] = useState('');
  const [applicableCrops, setApplicableCrops] = useState('');
  const [officialWebsiteUrl, setOfficialWebsiteUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const handleBack = () => navigate('/admin/schemes');

  const isFormValid =
    schemeName.trim() && category.trim() && deadline.trim() && benefitSummary.trim();

  const handleSave = async () => {
    setSaving(true);

    try {
      await addScheme({
        schemeName,
        category,
        deadline,
        benefitSummary,
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

  return (
    <Box className="add-scheme">
      <IconButton onClick={handleBack} className="add-scheme-back">
        <ArrowBackIcon />
      </IconButton>

      <Card className="add-scheme-card">
        <Box className="add-scheme-title">
          <AccountBalanceIcon color="success" />
          <Typography variant="h6">Add Government Scheme</Typography>
        </Box>

        <TextField
          fullWidth
          label="Scheme name"
          placeholder="e.g. PM Krishi Sinchayee Yojana"
          value={schemeName}
          onChange={(e) => setSchemeName(e.target.value)}
          margin="normal"
        />

        <Box className="add-scheme-row">
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
            placeholder="e.g. 30 Sep 2026 or Ongoing"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            margin="normal"
          />
        </Box>

        <TextField
          fullWidth
          multiline
          rows={2}
          label="Benefit summary"
          placeholder="e.g. Up to 55% subsidy on drip/sprinkler systems"
          value={benefitSummary}
          onChange={(e) => setBenefitSummary(e.target.value)}
          margin="normal"
        />

        <TextField
          fullWidth
          multiline
          rows={2}
          label="Eligibility criteria"
          placeholder="e.g. Farmers with valid land records, up to 5 acres"
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

        <Box className="add-scheme-row">
          <TextField
            fullWidth
            label="Min. farm size (acres)"
            placeholder="e.g. 0"
            value={minFarmSize}
            onChange={(e) => setMinFarmSize(e.target.value)}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Applicable crops"
            placeholder="e.g. All, or Paddy, Millets"
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
          className="add-scheme-submit"
        >
          {saving ? 'Saving...' : 'Save Scheme'}
        </Button>
      </Card>
    </Box>
  );
};

export default AddScheme;