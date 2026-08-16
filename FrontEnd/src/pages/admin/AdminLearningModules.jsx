import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAdminModules, createModule, updateModule, deleteModule } from '../../services/adminService';
import AddIcon from '@mui/icons-material/Add';
import ViewListIcon from '@mui/icons-material/ViewList';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './AdminManagement.css'; // Reuse existing styles for layout

const AdminLearningModules = () => {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', category: '', status: 'PUBLISHED', displayOrder: 1, durationMinutes: 30, xpReward: 100, videoUrl: '', description: '', objectives: '' });
  const [editId, setEditId] = useState(null);

  const fetchModules = async () => {
    try {
      const data = await getAdminModules();
      setModules(data);
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const handleOpen = (module = null) => {
    if (module) {
      setFormData(module);
      setEditId(module.moduleId);
    } else {
      setFormData({ title: '', category: '', status: 'PUBLISHED', displayOrder: modules.length + 1, durationMinutes: 30, xpReward: 100, videoUrl: '', description: '', objectives: '' });
      setEditId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    try {
      if (editId) {
        await updateModule(editId, formData);
      } else {
        await createModule(formData);
      }
      fetchModules();
      handleClose();
    } catch (error) {
      console.error('Error saving module:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this module?")) {
      try {
        await deleteModule(id);
        fetchModules();
      } catch (error) {
        console.error('Error deleting module:', error);
      }
    }
  };

  return (
    <Box>
      <Box className="admin-management-header" sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">Learning Modules</Typography>
        <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Add Module
        </Button>
      </Box>

      <TableContainer component={Paper} className="admin-table-card" sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Duration (Mins)</TableCell>
              <TableCell>XP Reward</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {modules.map((mod) => (
              <TableRow key={mod.moduleId}>
                <TableCell>{mod.title}</TableCell>
                <TableCell>{mod.category}</TableCell>
                <TableCell>{mod.durationMinutes}</TableCell>
                <TableCell>{mod.xpReward}</TableCell>
                <TableCell>
                  <Chip
                    label={mod.status}
                    color={mod.status === 'PUBLISHED' ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton color="info" onClick={() => navigate(`/admin/learning-modules/${mod.moduleId}`)}><ViewListIcon /></IconButton>
                  <IconButton color="primary" onClick={() => handleOpen(mod)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(mod.moduleId)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? 'Edit Module' : 'Add Module'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} fullWidth />
            <TextField label="Category" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} fullWidth />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField label="Duration (Mins)" type="number" value={formData.durationMinutes} onChange={e => setFormData({ ...formData, durationMinutes: e.target.value })} fullWidth />
              </Grid>
              <Grid item xs={6}>
                <TextField label="XP Reward" type="number" value={formData.xpReward} onChange={e => setFormData({ ...formData, xpReward: e.target.value })} fullWidth />
              </Grid>
            </Grid>
            <TextField label="Video Resource URL" placeholder="e.g. https://www.youtube.com/watch?v=..." value={formData.videoUrl || ''} onChange={e => setFormData({ ...formData, videoUrl: e.target.value })} fullWidth />
            <TextField label="Description" multiline rows={2} value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} fullWidth />
            <TextField label="Objectives (comma separated)" multiline rows={2} value={formData.objectives || ''} onChange={e => setFormData({ ...formData, objectives: e.target.value })} fullWidth />
            <TextField
              select
              label="Status"
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
              fullWidth
            >
              <MenuItem value="DRAFT">DRAFT</MenuItem>
              <MenuItem value="PUBLISHED">PUBLISHED</MenuItem>
              <MenuItem value="ARCHIVED">ARCHIVED</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="success">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminLearningModules;
