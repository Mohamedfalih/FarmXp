import React, { useState, useEffect } from 'react';
import {
  Box, Tabs, Tab, Card, Stack, Avatar, Typography, Button, CircularProgress,
  Dialog, DialogContent, IconButton,
} from '@mui/material';
import { getPendingPractices, getPracticesByStatus, reviewPractice } from '../../services/adminService';
import './VerifyPractices.css';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import BugReportIcon from '@mui/icons-material/BugReport';
import ScienceIcon from '@mui/icons-material/Science';
import GrassIcon from '@mui/icons-material/Grass';
import DescriptionIcon from '@mui/icons-material/Description';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

// Backend uses PENDING, VERIFIED, REJECTED
const STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'VERIFIED',
  REJECTED: 'REJECTED',
};

const TABS = [
  { label: 'Pending', value: STATUS.PENDING },
  { label: 'Approved', value: STATUS.APPROVED },
  { label: 'Rejected', value: STATUS.REJECTED },
];

const getIcon = (type = '') => {
  const t = type.toLowerCase();
  if (t.includes('irrig') || t.includes('water')) return <WaterDropIcon />;
  if (t.includes('pest')) return <BugReportIcon />;
  if (t.includes('rotat') || t.includes('sci')) return <ScienceIcon />;
  return <GrassIcon />;
};

const formatDate = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const normalizePractice = (raw) => {
  const ev = raw.evidenceUrl ?? raw.photoUrl ?? raw.evidence ?? null;
  const hasEvidence = ev && ev !== "No evidence provided" && ev.trim() !== "";
  const isImage = hasEvidence && /^(https?:\/\/|data:image\/|\/.*)/i.test(ev);

  return {
    id: raw.id ?? raw.practiceLogId ?? raw.logId,
    type: raw.type ?? raw.practiceType ?? 'compost',
    farmerName: raw.farmerName ?? raw.fullName ?? 'Unknown Farmer',
    description: raw.description ?? raw.practiceName ?? raw.title ?? 'Sustainable Practice',
    location: raw.location ?? raw.village ?? raw.district ?? 'Unknown Location',
    datePracticed: raw.datePracticed ?? raw.practiceDate,
    submittedLabel: raw.submittedAt ? formatDate(raw.submittedAt) : 'Recently',
    evidenceData: hasEvidence ? ev : null,
    isImage: isImage,
    status: raw.status ?? STATUS.PENDING,
  };
};

const VerifyPractices = () => {
  const [activeTab, setActiveTab] = useState(STATUS.PENDING);
  const [practices, setPractices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [previewPractice, setPreviewPractice] = useState(null);

  // We fetch only the practices for the active tab from the backend
  useEffect(() => {
    loadPractices(activeTab);
  }, [activeTab]);

  const loadPractices = async (status) => {
    setLoading(true);
    setError('');
    try {
      let data;
      if (status === STATUS.PENDING) {
        data = await getPendingPractices();
      } else {
        data = await getPracticesByStatus(status);
      }
      const list = Array.isArray(data) ? data : (data?.practices ?? []);
      setPractices(list.map(normalizePractice));
    } catch (err) {
      console.error(`Failed to load ${status} practices:`, err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Unable to load practices.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (practiceId, decision) => {
    setProcessingId(practiceId);
    try {
      const isApproved = decision === STATUS.APPROVED;
      const payload = {
        approved: isApproved,
        rejectionReason: isApproved ? null : 'Rejected by admin'
      };
      await reviewPractice(practiceId, payload);
      // Remove from the current pending view
      setPractices((prev) => prev.filter((p) => p.id !== practiceId));
    } catch (err) {
      console.error('Failed to review practice:', err);
      alert(err?.response?.data?.message || 'Failed to submit review');
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
            label={tab.label}
          />
        ))}
      </Tabs>

      <Card className="verify-list">
        {loading ? (
          <Box className="verify-state">
            <CircularProgress color="success" />
          </Box>
        ) : error ? (
          <Box className="verify-state">
            <Typography variant="body2" color="error">{error}</Typography>
            <Button size="small" onClick={() => loadPractices(activeTab)} sx={{ mt: 1 }}>Retry</Button>
          </Box>
        ) : practices.length === 0 ? (
          <Box className="verify-state">
            <Typography variant="body2" color="text.secondary">
              No {activeTab.toLowerCase()} practices right now.
            </Typography>
          </Box>
        ) : (
          practices.map((practice) => (
            <Stack
              key={practice.id}
              direction="row"
              alignItems="center"
              spacing={2}
              className="verify-row"
            >
              <Avatar className="verify-row-icon">{getIcon(practice.type)}</Avatar>

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

              {practice.evidenceData ? (
                <Box
                  className="verify-evidence-thumb"
                  onClick={() => setPreviewPractice(practice)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setPreviewPractice(practice)}
                >
                  {practice.isImage ? (
                    <img src={practice.evidenceData} alt={`Evidence for ${practice.description}`} />
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 1 }}>
                      <DescriptionIcon fontSize="small" />
                      <Typography variant="caption">Note</Typography>
                    </Box>
                  )}
                </Box>
              ) : (
                <Box className="verify-evidence-missing" title="No evidence uploaded">
                  <BrokenImageIcon fontSize="small" />
                  <span>No photo</span>
                </Box>
              )}

              {activeTab === STATUS.PENDING && (
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

      <Dialog open={Boolean(previewPractice)} onClose={() => setPreviewPractice(null)} maxWidth="md">
        <DialogContent className="verify-evidence-dialog" sx={{ minWidth: { xs: 280, sm: 400 }, p: 3 }}>
          <IconButton
            className="verify-evidence-close"
            onClick={() => setPreviewPractice(null)}
            aria-label="Close preview"
            sx={{ position: 'absolute', right: 8, top: 8, bgcolor: 'rgba(255,255,255,0.8)' }}
          >
            <CloseIcon />
          </IconButton>
          
          <Typography variant="h6" sx={{ mb: 2 }}>Evidence for {previewPractice?.description}</Typography>
          
          {previewPractice?.isImage ? (
            <img src={previewPractice.evidenceData} alt="Practice evidence full size" style={{ width: '100%', borderRadius: '8px' }} />
          ) : (
            <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: '8px', mt: 2 }}>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {previewPractice?.evidenceData}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default VerifyPractices;