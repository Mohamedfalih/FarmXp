import React, { useMemo, useState } from 'react';
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
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import './Reports.css';

/*
 * Mock report data.
 *
 * Later replace this with:
 *
 * reportService.getReports()
 *
 * The frontend structure will remain the same when
 * Spring Boot APIs are connected.
 */

const FARMERS = [
  {
    id: 1,
    name: 'Mohamed Falih',
    state: 'Tamil Nadu',
    district: 'Coimbatore',
    score: 82,
    status: 'Active',
  },
  {
    id: 2,
    name: 'Gurumoorthy V',
    state: 'Tamil Nadu',
    district: 'Erode',
    score: 64,
    status: 'New',
  },
  {
    id: 3,
    name: 'Selvi P.',
    state: 'Tamil Nadu',
    district: 'Salem',
    score: 72,
    status: 'Active',
  },
  {
    id: 4,
    name: 'Anitha R.',
    state: 'Tamil Nadu',
    district: 'Salem',
    score: 64,
    status: 'Active',
  },
  {
    id: 5,
    name: 'Velan K.',
    state: 'Tamil Nadu',
    district: 'Erode',
    score: 58,
    status: 'Suspended',
  },
  {
    id: 6,
    name: 'Ravi Kumar',
    state: 'Kerala',
    district: 'Ernakulam',
    score: 76,
    status: 'Active',
  },
  {
    id: 7,
    name: 'Arun Raj',
    state: 'Kerala',
    district: 'Thrissur',
    score: 69,
    status: 'Active',
  },
  {
    id: 8,
    name: 'Priya Devi',
    state: 'Karnataka',
    district: 'Mysuru',
    score: 74,
    status: 'Active',
  },
];

const SUSTAINABILITY = {
  water: 78,
  soil: 72,
  pestControl: 66,
  cropDiversity: 61,
};

const PRACTICES = {
  total: 148,
  verified: 112,
  pending: 24,
  rejected: 12,
};

const LEARNING = {
  totalModules: 6,
  completionRate: 68,
};

const Reports = () => {
  const [stateFilter, setStateFilter] = useState('All States');
  const [districtFilter, setDistrictFilter] = useState('All Districts');

  /*
   * Get unique states from farmer data.
   */
  const states = useMemo(() => {
    return [
      'All States',
      ...new Set(FARMERS.map((farmer) => farmer.state)),
    ];
  }, []);

  /*
   * Districts depend on selected state.
   */
  const districts = useMemo(() => {
    const filteredByState =
      stateFilter === 'All States'
        ? FARMERS
        : FARMERS.filter((farmer) => farmer.state === stateFilter);

    return [
      'All Districts',
      ...new Set(filteredByState.map((farmer) => farmer.district)),
    ];
  }, [stateFilter]);

  /*
   * Farmers displayed in the distribution section.
   */
  const filteredFarmers = useMemo(() => {
    return FARMERS.filter((farmer) => {
      const matchesState =
        stateFilter === 'All States' ||
        farmer.state === stateFilter;

      const matchesDistrict =
        districtFilter === 'All Districts' ||
        farmer.district === districtFilter;

      return matchesState && matchesDistrict;
    });
  }, [stateFilter, districtFilter]);

  /*
   * Farmer distribution by district.
   */
  const districtDistribution = useMemo(() => {
    const counts = {};

    filteredFarmers.forEach((farmer) => {
      counts[farmer.district] =
        (counts[farmer.district] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([district, count]) => ({
        district,
        count,
        percentage:
          filteredFarmers.length > 0
            ? Math.round((count / filteredFarmers.length) * 100)
            : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [filteredFarmers]);

  /*
   * Farmer distribution by state.
   */
  const stateDistribution = useMemo(() => {
    const counts = {};

    FARMERS.forEach((farmer) => {
      counts[farmer.state] =
        (counts[farmer.state] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([state, count]) => ({
        state,
        count,
        percentage: Math.round((count / FARMERS.length) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, []);

  /*
   * Overall statistics.
   */
  const totalFarmers = FARMERS.length;

  const activeFarmers = FARMERS.filter(
    (farmer) => farmer.status === 'Active'
  ).length;

  const averageScore = Math.round(
    FARMERS.reduce((sum, farmer) => sum + farmer.score, 0) /
      FARMERS.length
  );

  const verificationRate = Math.round(
    (PRACTICES.verified / PRACTICES.total) * 100
  );

  /*
   * State selection resets district.
   */
  const handleStateChange = (event) => {
    setStateFilter(event.target.value);
    setDistrictFilter('All Districts');
  };

  const handleRefresh = () => {
    /*
     * Later:
     * fetchReports();
     *
     * Currently mock data is static.
     */
    window.location.reload();
  };

  const handleExport = () => {
    /*
     * Temporary frontend export.
     *
     * Later this should call:
     * reportService.exportReport()
     *
     * and Spring Boot can generate PDF/Excel.
     */

    const reportData = [
      ['FarmXP Admin Report'],
      [''],
      ['Total Farmers', totalFarmers],
      ['Active Farmers', activeFarmers],
      ['Average Sustainability Score', averageScore],
      ['Practice Verification Rate', `${verificationRate}%`],
      [''],
      ['State', 'Farmers'],
      ...stateDistribution.map((item) => [
        item.state,
        item.count,
      ]),
    ];

    const csv = reportData
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'farmxp-admin-report.csv';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <Box className="reports-page">

      {/* =========================
          PAGE HEADER
      ========================== */}
      <Box className="reports-header">

        <Box>
          <Typography className="reports-title">
            Reports
          </Typography>

          <Typography className="reports-subtitle">
            Monitor farmer adoption, sustainability performance,
            learning progress and practice verification.
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

      {/* =========================
          OVERVIEW CARDS
      ========================== */}
      <Box className="report-stat-grid">

        <Card className="report-stat-card">
          <Typography className="stat-label">
            Total Farmers
          </Typography>

          <Typography className="stat-value">
            {totalFarmers}
          </Typography>

          <Typography className="stat-helper">
            Registered on FarmXP
          </Typography>
        </Card>

        <Card className="report-stat-card">
          <Typography className="stat-label">
            Active Farmers
          </Typography>

          <Typography className="stat-value">
            {activeFarmers}
          </Typography>

          <Typography className="stat-helper">
            Currently participating
          </Typography>
        </Card>

        <Card className="report-stat-card">
          <Typography className="stat-label">
            Average Score
          </Typography>

          <Typography className="stat-value">
            {averageScore}
          </Typography>

          <Typography className="stat-helper">
            Out of 100
          </Typography>
        </Card>

        <Card className="report-stat-card">
          <Typography className="stat-label">
            Verified Practices
          </Typography>

          <Typography className="stat-value">
            {verificationRate}%
          </Typography>

          <Typography className="stat-helper">
            Verification rate
          </Typography>
        </Card>

      </Box>

      {/* =========================
          MAIN REPORT GRID
      ========================== */}
      <Box className="reports-main-grid">

        {/* =========================
            SUSTAINABILITY
        ========================== */}
        <Card className="report-card">

          <Typography className="report-card-title">
            Sustainability Performance
          </Typography>

          <Typography className="report-card-subtitle">
            Average category performance across farmers
          </Typography>

          <Box className="sustainability-list">

            <Box className="sustainability-item">
              <Box className="sustainability-label">
                <span>Water Management</span>
                <strong>{SUSTAINABILITY.water}%</strong>
              </Box>

              <LinearProgress
                variant="determinate"
                value={SUSTAINABILITY.water}
                className="sustainability-progress"
              />
            </Box>

            <Box className="sustainability-item">
              <Box className="sustainability-label">
                <span>Soil Health</span>
                <strong>{SUSTAINABILITY.soil}%</strong>
              </Box>

              <LinearProgress
                variant="determinate"
                value={SUSTAINABILITY.soil}
                className="sustainability-progress"
              />
            </Box>

            <Box className="sustainability-item">
              <Box className="sustainability-label">
                <span>Pest Control</span>
                <strong>{SUSTAINABILITY.pestControl}%</strong>
              </Box>

              <LinearProgress
                variant="determinate"
                value={SUSTAINABILITY.pestControl}
                className="sustainability-progress"
              />
            </Box>

            <Box className="sustainability-item">
              <Box className="sustainability-label">
                <span>Crop Diversity</span>
                <strong>{SUSTAINABILITY.cropDiversity}%</strong>
              </Box>

              <LinearProgress
                variant="determinate"
                value={SUSTAINABILITY.cropDiversity}
                className="sustainability-progress"
              />
            </Box>

          </Box>

        </Card>

        {/* =========================
            FARMER DISTRIBUTION
        ========================== */}
        <Card className="report-card farmer-distribution-card">

          <Box className="distribution-header">

            <Box>
              <Typography className="report-card-title">
                Farmer Distribution
              </Typography>

              <Typography className="report-card-subtitle">
                View farmers by state and district
              </Typography>
            </Box>

          </Box>

          {/* Filters */}
          <Box className="distribution-filters">

            <FormControl size="small">
              <InputLabel>State</InputLabel>

              <Select
                value={stateFilter}
                label="State"
                onChange={handleStateChange}
              >
                {states.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small">
              <InputLabel>District</InputLabel>

              <Select
                value={districtFilter}
                label="District"
                onChange={(event) =>
                  setDistrictFilter(event.target.value)
                }
              >
                {districts.map((district) => (
                  <MenuItem
                    key={district}
                    value={district}
                  >
                    {district}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

          </Box>

          {/* State overview */}
          {stateFilter === 'All States' &&
            districtFilter === 'All Districts' && (
              <Box className="distribution-section">

                <Typography className="distribution-section-title">
                  By State
                </Typography>

                {stateDistribution.map((item) => (
                  <Box
                    className="distribution-row"
                    key={item.state}
                  >

                    <Box className="distribution-name">
                      <span>{item.state}</span>

                      <strong>
                        {item.count} farmer
                        {item.count !== 1 ? 's' : ''}
                      </strong>
                    </Box>

                    <Box className="distribution-bar-container">
                      <Box
                        className="distribution-bar"
                        style={{
                          width: `${item.percentage}%`,
                        }}
                      />
                    </Box>

                    <span className="distribution-percentage">
                      {item.percentage}%
                    </span>

                  </Box>
                ))}

              </Box>
            )}

          {/* District overview */}
          <Box className="distribution-section">

            <Typography className="distribution-section-title">
              {stateFilter === 'All States'
                ? 'District Distribution'
                : `${stateFilter} — District Distribution`}
            </Typography>

            {districtDistribution.length === 0 ? (
              <Typography className="no-distribution">
                No farmers found for the selected filters.
              </Typography>
            ) : (
              districtDistribution.map((item) => (
                <Box
                  className="distribution-row"
                  key={item.district}
                >

                  <Box className="distribution-name">
                    <span>{item.district}</span>

                    <strong>
                      {item.count} farmer
                      {item.count !== 1 ? 's' : ''}
                    </strong>
                  </Box>

                  <Box className="distribution-bar-container">
                    <Box
                      className="distribution-bar"
                      style={{
                        width: `${item.percentage}%`,
                      }}
                    />
                  </Box>

                  <span className="distribution-percentage">
                    {item.percentage}%
                  </span>

                </Box>
              ))
            )}

          </Box>

        </Card>

      </Box>

      {/* =========================
          PRACTICE VERIFICATION
      ========================== */}
      <Card className="report-card">

        <Typography className="report-card-title">
          Practice Verification
        </Typography>

        <Typography className="report-card-subtitle">
          Current farmer practice verification status
        </Typography>

        <Box className="verification-grid">

          <Box className="verification-item">
            <span>Total Submitted</span>
            <strong>{PRACTICES.total}</strong>
          </Box>

          <Box className="verification-item">
            <span>Verified</span>
            <strong>{PRACTICES.verified}</strong>
          </Box>

          <Box className="verification-item">
            <span>Pending</span>
            <strong>{PRACTICES.pending}</strong>
          </Box>

          <Box className="verification-item">
            <span>Rejected</span>
            <strong>{PRACTICES.rejected}</strong>
          </Box>

        </Box>

      </Card>

      {/* =========================
          LEARNING MODULE REPORT
      ========================== */}
      <Card className="report-card learning-report-card">

        <Box className="learning-report-header">

          <Box>
            <Typography className="report-card-title">
              Learning Module Completion
            </Typography>

            <Typography className="report-card-subtitle">
              Farmer progress across FarmXP learning modules
            </Typography>
          </Box>

          <Typography className="learning-percentage">
            {LEARNING.completionRate}%
          </Typography>

        </Box>

        <LinearProgress
          variant="determinate"
          value={LEARNING.completionRate}
          className="learning-progress"
        />

        <Typography className="learning-helper">
          {LEARNING.totalModules} learning modules currently
          available to farmers
        </Typography>

      </Card>

    </Box>
  );
};

export default Reports;