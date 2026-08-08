import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Card,
  CircularProgress,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getSchemes } from '../../services/adminService';
import './SchemeManagement.css';

// Maps a scheme's status to its Chip color
const STATUS_COLOR = {
  Active: 'success',
  Draft: 'warning',
};

const SchemeManagement = () => {
  const navigate = useNavigate();

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSchemes().then((data) => {
      setSchemes(data);
      setLoading(false);
    });
  }, []);

  const handleAddScheme = () => navigate('/admin/schemes/add');
  const handleEdit = (schemeId) => navigate(`/admin/schemes/edit/${schemeId}`);

  return (
    <Box className="scheme-management">
      <Box className="scheme-management-header">
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={handleAddScheme}
        >
          Add Scheme
        </Button>
      </Box>

      <Card className="scheme-table-card">
        {loading ? (
          <Box className="scheme-table-state">
            <CircularProgress color="success" />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Scheme</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Linked Modules</TableCell>
                <TableCell>Deadline</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schemes.map((scheme) => (
                <TableRow key={scheme.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight={700}>
                      {scheme.title}
                    </Typography>
                  </TableCell>
                  <TableCell>{scheme.category}</TableCell>
                  <TableCell>{scheme.linkedModules}</TableCell>
                  <TableCell>{scheme.deadline}</TableCell>
                  <TableCell>
                    <Chip
                      label={scheme.status}
                      color={STATUS_COLOR[scheme.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleEdit(scheme.id)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {schemes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Box className="scheme-table-empty">
                      <Typography variant="body2" color="text.secondary">
                        No schemes added yet.
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

export default SchemeManagement;