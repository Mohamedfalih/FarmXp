import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Chip,
  Button,
  Card,
  CircularProgress,
  Typography,
} from '@mui/material';
import { getFarmers } from '../../services/adminService';
import './FarmerManagement.css';
import SearchIcon from '@mui/icons-material/Search';

// Using actual backend statuses for Farmer profile:
const STATUSES = ['All Status', 'ACTIVE', 'PENDING', 'SUSPENDED'];

// Maps a farmer's status to its Chip color
const STATUS_COLOR = {
  ACTIVE: 'success',
  PENDING: 'warning',
  SUSPENDED: 'error',
};

// Deterministic avatar tint based on index
const AVATAR_COLORS = ['#6FA83A', '#3E8FA0', '#C1552E', '#8FBF9E', '#B7A6E0'];

const normalizeFarmer = (raw) => ({
  id: raw.id ?? raw.farmerId ?? raw.userId,
  name: raw.name ?? raw.fullName ?? 'Unknown Farmer',
  location: raw.location ?? raw.village ?? raw.district ?? 'Unknown',
  district: raw.district ?? 'Unknown',
  primaryCrop: raw.primaryCrop ?? raw.crop ?? 'Not specified',
  sustainabilityScore: raw.sustainabilityScore ?? raw.score ?? '—',
  status: raw.status ?? raw.accountStatus ?? 'PENDING',
});

const FarmerManagement = () => {
  const navigate = useNavigate();

  const [farmers, setFarmers] = useState([]);
  const [districts, setDistricts] = useState(['All Districts']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('All Districts');
  const [statusFilter, setStatusFilter] = useState('All Status');

  useEffect(() => {
    loadFarmers();
  }, []);

  const loadFarmers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getFarmers();
      const list = Array.isArray(data) ? data : (data?.farmers ?? data?.content ?? []);
      const normalized = list.map(normalizeFarmer);
      setFarmers(normalized);
      
      // Dynamically extract districts from backend data
      const uniqueDistricts = [...new Set(normalized.map(f => f.district).filter(Boolean))];
      setDistricts(['All Districts', ...uniqueDistricts.sort()]);
    } catch (err) {
      console.error('Failed to load farmers:', err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Unable to load farmers.'
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredFarmers = useMemo(() => {
    const text = search.toLowerCase();
    return farmers.filter((farmer) => {
      const matchesSearch =
        farmer.name.toLowerCase().includes(text) ||
        farmer.location.toLowerCase().includes(text);
      const matchesDistrict =
        districtFilter === 'All Districts' || farmer.district === districtFilter;
      const matchesStatus =
        statusFilter === 'All Status' || farmer.status.toUpperCase() === statusFilter;
      return matchesSearch && matchesDistrict && matchesStatus;
    });
  }, [farmers, search, districtFilter, statusFilter]);

  const handleView = (farmerId) => {
    navigate(`/admin/farmers/${farmerId}`);
  };

  const getInitials = (name) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <Box className="farmer-management">
      <Box className="farmer-management-filters">
        <TextField
          size="small"
          placeholder="Search farmers by name or village..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="farmer-search"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }
          }}
        />

        <Select
          size="small"
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
          className="farmer-filter-select"
        >
          {districts.map((d) => (
            <MenuItem key={d} value={d}>
              {d}
            </MenuItem>
          ))}
        </Select>

        <Select
          size="small"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="farmer-filter-select"
        >
          {STATUSES.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Card className="farmer-table-card">
        {loading ? (
          <Box className="farmer-table-state">
            <CircularProgress color="success" />
          </Box>
        ) : error ? (
          <Box className="farmer-table-state">
            <Typography variant="body2" color="error">{error}</Typography>
            <Button size="small" onClick={loadFarmers} sx={{ mt: 1 }}>Retry</Button>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Farmer</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Primary Crop</TableCell>
                <TableCell>Sustainability Score</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFarmers.map((farmer, index) => (
                <TableRow key={farmer.id}>
                  <TableCell>
                    <Box className="farmer-name-cell">
                      <Avatar
                        className="farmer-avatar"
                        sx={{ bgcolor: AVATAR_COLORS[index % AVATAR_COLORS.length] }}
                      >
                        {getInitials(farmer.name)}
                      </Avatar>
                      <Typography variant="body2" fontWeight={700}>
                        {farmer.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{farmer.location}</TableCell>
                  <TableCell>{farmer.primaryCrop}</TableCell>
                  <TableCell>{farmer.sustainabilityScore}</TableCell>
                  <TableCell>
                    <Chip
                      label={farmer.status}
                      color={STATUS_COLOR[farmer.status.toUpperCase()] || 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleView(farmer.id)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {filteredFarmers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Box className="farmer-table-empty">
                      <Typography variant="body2" color="text.secondary">
                        No farmers match your search.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Card>
    </Box>
  );
};

export default FarmerManagement;