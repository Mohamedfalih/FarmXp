import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  InputAdornment,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

import { useNavigate } from 'react-router-dom';
import './AdminManagement.css';

const INITIAL_ADMINS = [
  {
    id: 1,
    name: 'System Administrator',
    email: 'admin@farmxp.com',
    phone: '9876543210',
    role: 'SUPER_ADMIN',
    status: 'Active',
    joinedDate: '01 Aug 2026',
  },
  {
    id: 2,
    name: 'FarmXP Admin',
    email: 'manager@farmxp.com',
    phone: '9876543211',
    role: 'ADMIN',
    status: 'Active',
    joinedDate: '03 Aug 2026',
  },
  {
    id: 3,
    name: 'Support Admin',
    email: 'support@farmxp.com',
    phone: '9876543212',
    role: 'ADMIN',
    status: 'Suspended',
    joinedDate: '04 Aug 2026',
  },
];

const STATUS_OPTIONS = ['All Status', 'Active', 'Suspended'];

const ROLE_LABELS = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
};

const AdminManagement = () => {
  const navigate = useNavigate();

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  useEffect(() => {
    /*
      Later replace this with:

      adminService.getAdmins()
        .then((data) => setAdmins(data))
        .finally(() => setLoading(false));
    */

    const timer = setTimeout(() => {
      setAdmins(INITIAL_ADMINS);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const filteredAdmins = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return admins.filter((admin) => {
      const matchesSearch =
        !searchText ||
        admin.name.toLowerCase().includes(searchText) ||
        admin.email.toLowerCase().includes(searchText) ||
        admin.phone.includes(searchText);

      const matchesStatus =
        statusFilter === 'All Status' ||
        admin.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [admins, search, statusFilter]);

  const getInitials = (name) => {
    if (!name) return 'AD';

    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const handleToggleStatus = (adminId) => {
    setAdmins((currentAdmins) =>
      currentAdmins.map((admin) => {
        if (admin.id !== adminId) {
          return admin;
        }

        return {
          ...admin,
          status:
            admin.status === 'Active'
              ? 'Suspended'
              : 'Active',
        };
      })
    );

    /*
      Later:

      adminService.updateAdminStatus(adminId, newStatus);
    */
  };

  const handleAddAdmin = () => {
    navigate('/admin/admins/add');
  };

  return (
    <Box className="admin-management">

      {/* Page Header */}
      <Box className="admin-management-header">

        <Box>
          <Typography
            variant="h4"
            className="admin-management-title"
          >
            Admin Management
          </Typography>

          <Typography
            variant="body2"
            className="admin-management-subtitle"
          >
            Manage administrators who have access to the FarmXP
            admin portal.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={handleAddAdmin}
          className="add-admin-btn"
        >
          Add Admin
        </Button>

      </Box>

      {/* Admin Access Information */}
      <Card className="admin-info-card">

        <Box className="admin-info-icon">
          <AdminPanelSettingsIcon />
        </Box>

        <Box>
          <Typography
            variant="subtitle1"
            className="admin-info-title"
          >
            Administrator Access
          </Typography>

          <Typography
            variant="body2"
            className="admin-info-text"
          >
            Only authorized administrators should be given access
            to the FarmXP management portal. New administrators
            should be added by an existing authorized admin.
          </Typography>
        </Box>

      </Card>

      {/* Filters */}
      <Box className="admin-management-filters">

        <TextField
          size="small"
          placeholder="Search admins by name, email or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-search"
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
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="admin-status-filter"
        >
          {STATUS_OPTIONS.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>

      </Box>

      {/* Admin Table */}
      <Card className="admin-table-card">

        {loading ? (
          <Box className="admin-table-loading">
            <CircularProgress color="success" />
            <Typography variant="body2">
              Loading administrators...
            </Typography>
          </Box>
        ) : (
          <Table>

            <TableHead>
              <TableRow>

                <TableCell>Administrator</TableCell>

                <TableCell>Contact</TableCell>

                <TableCell>Role</TableCell>

                <TableCell>Status</TableCell>

                <TableCell>Joined</TableCell>

                <TableCell align="right">
                  Actions
                </TableCell>

              </TableRow>
            </TableHead>

            <TableBody>

              {filteredAdmins.map((admin) => (
                <TableRow key={admin.id}>

                  {/* Admin */}
                  <TableCell>

                    <Box className="admin-name-cell">

                      <Box className="admin-avatar">
                        {getInitials(admin.name)}
                      </Box>

                      <Box>
                        <Typography
                          variant="body2"
                          className="admin-name"
                        >
                          {admin.name}
                        </Typography>

                        <Typography
                          variant="caption"
                          className="admin-id"
                        >
                          Admin ID: #{admin.id}
                        </Typography>
                      </Box>

                    </Box>

                  </TableCell>

                  {/* Contact */}
                  <TableCell>

                    <Typography
                      variant="body2"
                      className="admin-email"
                    >
                      {admin.email}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {admin.phone}
                    </Typography>

                  </TableCell>

                  {/* Role */}
                  <TableCell>

                    <Chip
                      label={
                        ROLE_LABELS[admin.role] ||
                        admin.role
                      }
                      size="small"
                      className={
                        admin.role === 'SUPER_ADMIN'
                          ? 'role-chip super-admin'
                          : 'role-chip admin'
                      }
                    />

                  </TableCell>

                  {/* Status */}
                  <TableCell>

                    <Chip
                      label={admin.status}
                      size="small"
                      color={
                        admin.status === 'Active'
                          ? 'success'
                          : 'error'
                      }
                    />

                  </TableCell>

                  {/* Joined */}
                  <TableCell>
                    {admin.joinedDate}
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="right">

                    {admin.role !== 'SUPER_ADMIN' && (
                      <Button
                        size="small"
                        variant="outlined"
                        color={
                          admin.status === 'Active'
                            ? 'error'
                            : 'success'
                        }
                        onClick={() =>
                          handleToggleStatus(admin.id)
                        }
                      >
                        {admin.status === 'Active'
                          ? 'Suspend'
                          : 'Activate'}
                      </Button>
                    )}

                    {admin.role === 'SUPER_ADMIN' && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Protected
                      </Typography>
                    )}

                  </TableCell>

                </TableRow>
              ))}

              {filteredAdmins.length === 0 && (
                <TableRow>

                  <TableCell colSpan={6}>

                    <Box className="admin-table-empty">

                      <AdminPanelSettingsIcon />

                      <Typography variant="body1">
                        No administrators found.
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Try changing your search or filter.
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

export default AdminManagement;