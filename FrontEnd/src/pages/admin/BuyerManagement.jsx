import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Card,
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
  CircularProgress,
  Typography,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import StorefrontIcon from '@mui/icons-material/Storefront';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { getBuyers } from '../../services/adminService';

import './BuyerManagement.css';

const CATEGORIES = [
  'All Categories',
  'Organic Produce',
  'Vegetables',
  'Fruits',
  'Grains',
  'Spices',
];

const STATUSES = [
  'All Status',
  'Active',
  'Pending',
  'Suspended',
];

const STATUS_COLOR = {
  Active: 'success',
  Pending: 'warning',
  Suspended: 'error',
};

const AVATAR_COLORS = [
  '#6FA83A',
  '#3E8FA0',
  '#C1552E',
  '#8FBF9E',
  '#B7A6E0',
];

const BuyerManagement = () => {
  const navigate = useNavigate();

  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] =
    useState('All Categories');

  const [statusFilter, setStatusFilter] =
    useState('All Status');

  useEffect(() => {
    const loadBuyers = async () => {
      try {
        const data = await getBuyers();
        setBuyers(data);
      } catch (error) {
        console.error('Failed to load buyers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBuyers();
  }, []);

  const filteredBuyers = useMemo(() => {
    const text = search.toLowerCase().trim();

    return buyers.filter((buyer) => {
      const matchesSearch =
        buyer.name?.toLowerCase().includes(text) ||
        buyer.location?.toLowerCase().includes(text) ||
        buyer.contactPerson?.toLowerCase().includes(text);

      const matchesCategory =
        categoryFilter === 'All Categories' ||
        buyer.category === categoryFilter;

      const matchesStatus =
        statusFilter === 'All Status' ||
        buyer.status === statusFilter;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    buyers,
    search,
    categoryFilter,
    statusFilter,
  ]);

  const getInitials = (name = '') =>
    name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  const handleAddBuyer = () => {
    navigate('/admin/buyers/add');
  };

  const handleView = (buyerId) => {
    navigate(`/admin/buyers/${buyerId}`);
  };

  return (
    <Box className="buyer-management">

      {/* =========================
          Page Header
      ========================= */}
      <Box className="buyer-management-header">

        <Box>
          <Typography className="buyer-page-title">
            Buyer Management
          </Typography>

          <Typography className="buyer-page-subtitle">
            Manage market buyers and connect them with farmers.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddBuyer}
          className="add-buyer-btn"
        >
          Add Buyer
        </Button>

      </Box>

      {/* =========================
          Filters
      ========================= */}
      <Box className="buyer-management-filters">

        <TextField
          size="small"
          placeholder="Search buyers by name, location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="buyer-search"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Select
          size="small"
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter(e.target.value)
          }
          className="buyer-filter-select"
        >
          {CATEGORIES.map((category) => (
            <MenuItem
              key={category}
              value={category}
            >
              {category}
            </MenuItem>
          ))}
        </Select>

        <Select
          size="small"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          className="buyer-filter-select"
        >
          {STATUSES.map((status) => (
            <MenuItem
              key={status}
              value={status}
            >
              {status}
            </MenuItem>
          ))}
        </Select>

      </Box>

      {/* =========================
          Buyer Table
      ========================= */}
      <Card className="buyer-table-card">

        {loading ? (
          <Box className="buyer-table-state">
            <CircularProgress color="success" />

            <Typography color="text.secondary">
              Loading buyers...
            </Typography>
          </Box>
        ) : (
          <Table>

            <TableHead>
              <TableRow>

                <TableCell>
                  Buyer
                </TableCell>

                <TableCell>
                  Location
                </TableCell>

                <TableCell>
                  Category
                </TableCell>

                <TableCell>
                  Contact Person
                </TableCell>

                <TableCell>
                  Farmers Matched
                </TableCell>

                <TableCell>
                  Status
                </TableCell>

                <TableCell align="right">
                  Actions
                </TableCell>

              </TableRow>
            </TableHead>

            <TableBody>

              {filteredBuyers.map(
                (buyer, index) => (
                  <TableRow key={buyer.id}>

                    {/* Buyer */}
                    <TableCell>

                      <Box className="buyer-name-cell">

                        <Avatar
                          className="buyer-avatar"
                          sx={{
                            bgcolor:
                              AVATAR_COLORS[
                                index %
                                  AVATAR_COLORS.length
                              ],
                          }}
                        >
                          {getInitials(
                            buyer.name
                          )}
                        </Avatar>

                        <Box>

                          <Typography
                            className="buyer-name"
                          >
                            {buyer.name}
                          </Typography>

                          <Typography
                            className="buyer-id"
                          >
                            Buyer #{buyer.id}
                          </Typography>

                        </Box>

                      </Box>

                    </TableCell>

                    {/* Location */}
                    <TableCell>
                      {buyer.location || '—'}
                    </TableCell>

                    {/* Category */}
                    <TableCell>

                      <Chip
                        label={buyer.category}
                        size="small"
                        className="buyer-category-chip"
                      />

                    </TableCell>

                    {/* Contact */}
                    <TableCell>
                      {buyer.contactPerson || '—'}
                    </TableCell>

                    {/* Matches */}
                    <TableCell>
                      {buyer.farmersMatched ?? 0}
                    </TableCell>

                    {/* Status */}
                    <TableCell>

                      <Chip
                        label={buyer.status}
                        color={
                          STATUS_COLOR[
                            buyer.status
                          ] || 'default'
                        }
                        size="small"
                      />

                    </TableCell>

                    {/* Actions */}
                    <TableCell align="right">

                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() =>
                          handleView(
                            buyer.id
                          )
                        }
                      >
                        View
                      </Button>

                    </TableCell>

                  </TableRow>
                )
              )}

              {/* Empty */}
              {filteredBuyers.length === 0 && (
                <TableRow>

                  <TableCell colSpan={7}>

                    <Box className="buyer-table-empty">

                      <StorefrontIcon />

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        No buyers match your
                        search or filters.
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

export default BuyerManagement;