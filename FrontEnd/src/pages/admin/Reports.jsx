import React, { useMemo, useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import { getFarmers, getPracticesByStatus } from '../../services/adminService';
import './Reports.css';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';

const normalizeFarmer = (raw) => ({
  id: raw.id ?? raw.farmerId ?? raw.userId,
  name: raw.name ?? raw.fullName ?? 'Unknown Farmer',
  state: raw.state ?? 'Unknown',
  district: raw.district ?? 'Unknown',
  score: raw.sustainabilityScore ?? raw.score ?? 0,
  status: raw.status ?? raw.accountStatus ?? 'PENDING',
});

const Reports = () => {
  const [farmers, setFarmers] = useState([]);
  const [practices, setPractices] = useState({ total: 0, verified: 0, pending: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [stateFilter, setStateFilter] = useState('All States');
  const [districtFilter, setDistrictFilter] = useState('All Districts');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    setError('');
    try {
      const [farmersData, verifiedData, pendingData, rejectedData] = await Promise.all([
        getFarmers(),
        getPracticesByStatus('VERIFIED'),
        getPracticesByStatus('PENDING'),
        getPracticesByStatus('REJECTED'),
      ]);

      const farmersList = Array.isArray(farmersData) ? farmersData : (farmersData?.farmers ?? farmersData?.content ?? []);
      setFarmers(farmersList.map(normalizeFarmer));

      const vCount = Array.isArray(verifiedData) ? verifiedData.length : 0;
      const pCount = Array.isArray(pendingData) ? pendingData.length : 0;
      const rCount = Array.isArray(rejectedData) ? rejectedData.length : 0;

      setPractices({
        total: vCount + pCount + rCount,
        verified: vCount,
        pending: pCount,
        rejected: rCount,
      });

    } catch (err) {
      console.error('Failed to load reports:', err);
      setError('Unable to load reporting data.');
    } finally {
      setLoading(false);
    }
  };

  const states = useMemo(() => {
    return ['All States', ...new Set(farmers.map((farmer) => farmer.state).filter(Boolean))];
  }, [farmers]);

  const districts = useMemo(() => {
    const filteredByState =
      stateFilter === 'All States'
        ? farmers
        : farmers.filter((farmer) => farmer.state === stateFilter);

    return ['All Districts', ...new Set(filteredByState.map((farmer) => farmer.district).filter(Boolean))];
  }, [stateFilter, farmers]);

  const filteredFarmers = useMemo(() => {
    return farmers.filter((farmer) => {
      const matchesState = stateFilter === 'All States' || farmer.state === stateFilter;
      const matchesDistrict = districtFilter === 'All Districts' || farmer.district === districtFilter;
      return matchesState && matchesDistrict;
    });
  }, [stateFilter, districtFilter, farmers]);

  const districtDistribution = useMemo(() => {
    const counts = {};
    filteredFarmers.forEach((farmer) => {
      const d = farmer.district || 'Unknown';
      counts[d] = (counts[d] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([district, count]) => ({
        district,
        count,
        percentage: filteredFarmers.length > 0 ? Math.round((count / filteredFarmers.length) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredFarmers]);

  const stateDistribution = useMemo(() => {
    const counts = {};
    farmers.forEach((farmer) => {
      const s = farmer.state || 'Unknown';
      counts[s] = (counts[s] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([state, count]) => ({
        state,
        count,
        percentage: farmers.length > 0 ? Math.round((count / farmers.length) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [farmers]);

  const totalFarmers = farmers.length;
  const activeFarmers = farmers.filter((farmer) => farmer.status.toUpperCase() === 'ACTIVE').length;
  const averageScore = farmers.length > 0 
    ? Math.round(farmers.reduce((sum, farmer) => sum + farmer.score, 0) / farmers.length) 
    : 0;

  const verificationRate = practices.total > 0
    ? Math.round((practices.verified / practices.total) * 100)
    : 0;

  const handleStateChange = (event) => {
    setStateFilter(event.target.value);
    setDistrictFilter('All Districts');
  };

  const handleRefresh = () => {
    loadReports();
  };

  const handleExport = () => {
    const reportData = [
      ['FarmXP Admin Report'],
      [''],
      ['Total Farmers', totalFarmers],
      ['Active Farmers', activeFarmers],
      ['Average Sustainability Score', averageScore],
      ['Practice Verification Rate', `${verificationRate}%`],
      [''],
      ['State', 'Farmers'],
      ...stateDistribution.map((item) => [item.state, item.count]),
    ];

    const csv = reportData.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'farmxp-admin-report.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Box className="reports-page" sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress color="success" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="reports-page" sx={{ textAlign: 'center', py: 10 }}>
        <Typography color="error">{error}</Typography>
        <Button onClick={loadReports} sx={{ mt: 2 }} variant="outlined">Retry</Button>
      </Box>
    );
  }

  return (
    <Box className="reports-page">
      <Box className="reports-header">
        <Box>
          <Typography className="reports-title">Reports</Typography>
          <Typography className="reports-subtitle">
            Monitor farmer adoption, sustainability performance, and practice verification.
          </Typography>
        </Box>
        <Box className="reports-actions">
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            className="reports-refresh-btn"
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            className="reports-export-btn"
          >
            Export Report
          </Button>
        </Box>
      </Box>

      <Box className="report-stat-grid">
        <Card className="report-stat-card">
          <Typography className="stat-label">Total Farmers</Typography>
          <Typography className="stat-value">{totalFarmers}</Typography>
          <Typography className="stat-helper">Registered on FarmXP</Typography>
        </Card>
        <Card className="report-stat-card">
          <Typography className="stat-label">Active Farmers</Typography>
          <Typography className="stat-value">{activeFarmers}</Typography>
          <Typography className="stat-helper">Currently participating</Typography>
        </Card>
        <Card className="report-stat-card">
          <Typography className="stat-label">Average Score</Typography>
          <Typography className="stat-value">{averageScore}</Typography>
          <Typography className="stat-helper">Out of 100</Typography>
        </Card>
        <Card className="report-stat-card">
          <Typography className="stat-label">Verified Practices</Typography>
          <Typography className="stat-value">{verificationRate}%</Typography>
          <Typography className="stat-helper">Verification rate</Typography>
        </Card>
      </Box>

      <Box className="reports-main-grid">
        <Card className="report-card">
          <Typography className="report-card-title">Sustainability Performance</Typography>
          <Typography className="report-card-subtitle">
            Average overall performance (Detailed category APIs not available)
          </Typography>
          <Box className="sustainability-list">
            <Box className="sustainability-item">
              <Box className="sustainability-label">
                <span>Overall Sustainability</span>
                <strong>{averageScore}%</strong>
              </Box>
              <LinearProgress
                variant="determinate"
                value={averageScore}
                className="sustainability-progress"
              />
            </Box>
          </Box>
        </Card>

        <Card className="report-card farmer-distribution-card">
          <Box className="distribution-header">
            <Box>
              <Typography className="report-card-title">Farmer Distribution</Typography>
              <Typography className="report-card-subtitle">View farmers by state and district</Typography>
            </Box>
          </Box>

          <Box className="distribution-filters">
            <FormControl size="small">
              <InputLabel>State</InputLabel>
              <Select value={stateFilter} label="State" onChange={handleStateChange}>
                {states.map((state) => (
                  <MenuItem key={state} value={state}>{state}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small">
              <InputLabel>District</InputLabel>
              <Select
                value={districtFilter}
                label="District"
                onChange={(event) => setDistrictFilter(event.target.value)}
              >
                {districts.map((district) => (
                  <MenuItem key={district} value={district}>{district}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {stateFilter === 'All States' && districtFilter === 'All Districts' && (
            <Box className="distribution-section">
              <Typography className="distribution-section-title">By State</Typography>
              {stateDistribution.map((item) => (
                <Box className="distribution-row" key={item.state}>
                  <Box className="distribution-name">
                    <span>{item.state}</span>
                    <strong>{item.count} farmer{item.count !== 1 ? 's' : ''}</strong>
                  </Box>
                  <Box className="distribution-bar-container">
                    <Box className="distribution-bar" style={{ width: `${item.percentage}%` }} />
                  </Box>
                  <span className="distribution-percentage">{item.percentage}%</span>
                </Box>
              ))}
            </Box>
          )}

          <Box className="distribution-section">
            <Typography className="distribution-section-title">
              {stateFilter === 'All States' ? 'District Distribution' : `${stateFilter} — District Distribution`}
            </Typography>
            {districtDistribution.length === 0 ? (
              <Typography className="no-distribution">No farmers found for the selected filters.</Typography>
            ) : (
              districtDistribution.map((item) => (
                <Box className="distribution-row" key={item.district}>
                  <Box className="distribution-name">
                    <span>{item.district}</span>
                    <strong>{item.count} farmer{item.count !== 1 ? 's' : ''}</strong>
                  </Box>
                  <Box className="distribution-bar-container">
                    <Box className="distribution-bar" style={{ width: `${item.percentage}%` }} />
                  </Box>
                  <span className="distribution-percentage">{item.percentage}%</span>
                </Box>
              ))
            )}
          </Box>
        </Card>
      </Box>

      <Card className="report-card">
        <Typography className="report-card-title">Practice Verification</Typography>
        <Typography className="report-card-subtitle">Current farmer practice verification status</Typography>
        <Box className="verification-grid">
          <Box className="verification-item">
            <span>Total Submitted</span>
            <strong>{practices.total}</strong>
          </Box>
          <Box className="verification-item">
            <span>Verified</span>
            <strong>{practices.verified}</strong>
          </Box>
          <Box className="verification-item">
            <span>Pending</span>
            <strong>{practices.pending}</strong>
          </Box>
          <Box className="verification-item">
            <span>Rejected</span>
            <strong>{practices.rejected}</strong>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default Reports;