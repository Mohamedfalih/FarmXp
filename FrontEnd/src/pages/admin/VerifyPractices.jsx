import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Tabs, Tab, Card, Stack, Avatar, Typography, Button, CircularProgress,
  Dialog, DialogContent, IconButton,
} from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import GrassIcon from '@mui/icons-material/Grass';
import BugReportIcon from '@mui/icons-material/BugReport';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import { getPendingPractices, reviewPractice } from '../../services/adminService';
import './VerifyPractices.css';

const STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

const TABS = [
  { label: 'Pending', value: STATUS.PENDING },
  { label: 'Approved', value: STATUS.APPROVED },
  { label: 'Rejected', value: STATUS.REJECTED },
];

const ICONS = {
  irrigation: <WaterDropIcon />,
  compost: <GrassIcon />,
  pest: <BugReportIcon />,
  rotation: <ScienceIcon />,
};

const formatDate = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const VerifyPractices = () => {
  const [activeTab, setActiveTab] = useState(STATUS.PENDING);
  const [practices, setPractices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    getPendingPractices().then((data) => {
      setPractices(data);
      setLoading(false);
    });
  }, []);

  const filteredPractices = useMemo(() => {
    return practices.filter((p) => p.status === activeTab);
  }, [practices, activeTab]);

  const pendingCount = useMemo(
    () => practices.filter((p) => p.status === STATUS.PENDING).length,
    [practices]
  );

  const handleReview = async (practiceId, decision) => {
    setProcessingId(practiceId);
    try {
      await reviewPractice(practiceId, decision);
      setPractices((prev) =>
        prev.map((p) => (p.id === practiceId ? { ...p, status: decision } : p))
      );
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <Box className="verify-practices">
      <Tabs
        value={activeTab}
        onChange={(_, value) => setActiveTab(value)}
        textColor="primary"
        indicatorColor="primary"
        className="verify-tabs"
      >
        {TABS.map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            label={tab.value === STATUS.PENDING ? `Pending (${pendingCount})` : tab.label}
          />
        ))}
      </Tabs>

      <Card className="verify-list">
        {loading ? (
          <Box className="verify-state">
            <CircularProgress color="success" />
          </Box>
        ) : filteredPractices.length === 0 ? (
          <Box className="verify-state">
            <Typography variant="body2" color="text.secondary">
              No {activeTab} practices right now.
            </Typography>
          </Box>
        ) : (
          filteredPractices.map((practice) => (
            <Stack
              key={practice.id}
              direction="row"
              alignItems="center"
              spacing={2}
              className="verify-row"
            >
              <Avatar className="verify-row-icon">{ICONS[practice.type]}</Avatar>

              <Box className="verify-row-info">
                <Typography variant="body2">
                  <b>{practice.farmerName}</b> — {practice.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {practice.location}
                  {practice.datePracticed && (
                    <> · Practiced on {formatDate(practice.datePracticed)}</>
                  )}
                  {' '}· Submitted {practice.submittedLabel}
                </Typography>
              </Box>

              {practice.evidenceUrl ? (
                <Box
                  className="verify-evidence-thumb"
                  onClick={() => setPreviewImage(practice.evidenceUrl)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setPreviewImage(practice.evidenceUrl)}
                >
                  <img src={practice.evidenceUrl} alt={`Evidence for ${practice.description}`} />
                </Box>
              ) : (
                <Box className="verify-evidence-missing" title="No evidence uploaded">
                  <BrokenImageIcon fontSize="small" />
                  <span>No photo</span>
                </Box>
              )}

              {practice.status === STATUS.PENDING && (
                <Box className="verify-row-actions">
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    startIcon={<CheckIcon />}
                    disabled={processingId === practice.id}
                    onClick={() => handleReview(practice.id, STATUS.APPROVED)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<CloseIcon />}
                    disabled={processingId === practice.id}
                    onClick={() => handleReview(practice.id, STATUS.REJECTED)}
                  >
                    Reject
                  </Button>
                </Box>
              )}
            </Stack>
          ))
        )}
      </Card>

      <Dialog open={Boolean(previewImage)} onClose={() => setPreviewImage(null)} maxWidth="md">
        <DialogContent className="verify-evidence-dialog">
          <IconButton
            className="verify-evidence-close"
            onClick={() => setPreviewImage(null)}
            aria-label="Close preview"
          >
            <CloseIcon />
          </IconButton>
          {previewImage && <img src={previewImage} alt="Practice evidence full size" />}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default VerifyPractices;