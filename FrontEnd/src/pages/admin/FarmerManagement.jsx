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
import SearchIcon from '@mui/icons-material/Search';
import { getFarmers } from '../../services/adminService';
import './FarmerManagement.css';

// Page-specific filter options — only this page uses these
const DISTRICTS = ['All Districts', 'Coimbatore', 'Erode', 'Salem'];
const STATUSES = ['All Status', 'Active', 'New', 'Suspended'];

// Maps a farmer's status to its Chip color
const STATUS_COLOR = {
  Active: 'success',
  New: 'warning',
  Suspended: 'error',
};

// Deterministic avatar tint based on farmer id — matches the Figma design's
// varied avatar colors without needing a color field in the data itself
const AVATAR_COLORS = ['#6FA83A', '#3E8FA0', '#C1552E', '#8FBF9E', '#B7A6E0'];

const FarmerManagement = () => {
  const navigate = useNavigate();

  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('All Districts');
  const [statusFilter, setStatusFilter] = useState('All Status');

  useEffect(() => {
    getFarmers().then((data) => {
      setFarmers(data);
      setLoading(false);
    });
  }, []);

  const filteredFarmers = useMemo(() => {
    const text = search.toLowerCase();
    return farmers.filter((farmer) => {
      const matchesSearch =
        farmer.name.toLowerCase().includes(text) ||
        farmer.location.toLowerCase().includes(text);
      const matchesDistrict =
        districtFilter === 'All Districts' || farmer.location === districtFilter;
      const matchesStatus =
        statusFilter === 'All Status' || farmer.status === statusFilter;
      return matchesSearch && matchesDistrict && matchesStatus;
    });
  }, [farmers, search, districtFilter, statusFilter]);

  const handleView = (farmerId) => {
    navigate(`/admin/farmers/${farmerId}`);
  };

  const getInitials = (name) =>
    name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  return (
    <Box className="farmer-management">
      <Box className="farmer-management-filters">
        <TextField
          size="small"
          placeholder="Search farmers by name or village..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="farmer-search"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <Select
          size="small"
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
          className="farmer-filter-select"
        >
          {DISTRICTS.map((d) => (
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
                  <TableCell>{farmer.sustainabilityScore ?? '—'}</TableCell>
                  <TableCell>
                    <Chip
                      label={farmer.status}
                      color={STATUS_COLOR[farmer.status]}
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