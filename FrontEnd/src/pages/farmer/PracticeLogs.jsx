import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import farmerService from "../../services/farmerService";
import "./PracticeLogs.css";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelIcon from '@mui/icons-material/Cancel';
import GrassIcon from '@mui/icons-material/Grass';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ScienceIcon from '@mui/icons-material/Science';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';

// Page-specific constants — only Practice Logs uses these, so they live here
// instead of constants/status.js
const STATUS = {
  ALL: "all",
  // Backend uses PENDING / VERIFIED / REJECTED (uppercase)
  APPROVED: "VERIFIED",
  PENDING: "PENDING",
  REJECTED: "REJECTED",
};

const TABS = [
  { label: "All", value: STATUS.ALL },
  { label: "Pending", value: STATUS.PENDING },
  { label: "Approved", value: STATUS.APPROVED },
  { label: "Rejected", value: STATUS.REJECTED },
];

// Maps a status value to its Chip label, color, and icon
const STATUS_CONFIG = {
  [STATUS.APPROVED]: {
    label: "Approved",
    color: "success",
    icon: <CheckCircleIcon fontSize="small" />,
  },
  [STATUS.PENDING]: {
    label: "Pending",
    color: "warning",
    icon: <HourglassEmptyIcon fontSize="small" />,
  },
  [STATUS.REJECTED]: {
    label: "Rejected",
    color: "error",
    icon: <CancelIcon fontSize="small" />,
  },
};

// Maps the serializable "type" field from data/API to a display icon
const ICONS = {
  organic: <GrassIcon />,
  irrigation: <WaterDropIcon />,
  pesticide: <ScienceIcon />,
  ORGANIC: <GrassIcon />,
  IRRIGATION: <WaterDropIcon />,
  PESTICIDE: <ScienceIcon />,
};

// Normalize a raw backend practice log to the shape the UI expects
const normalizeLog = (raw) => {
  const ev = raw.evidenceUrl ?? raw.photoUrl ?? raw.evidence ?? null;
  const hasEvidence = ev && ev !== "No evidence provided" && ev.trim() !== "";
  const isImage = hasEvidence && /^(https?:\/\/|data:image\/|\/.*)/i.test(ev);

  return {
    // Backend may use 'practiceLogId' or 'id'
    id: raw.id ?? raw.practiceLogId ?? raw.logId,
    title: raw.title ?? raw.practiceName ?? raw.practiceType ?? 'Practice',
    // Backend uses PENDING / VERIFIED / REJECTED
    status: raw.status ?? STATUS.PENDING,
    type: (raw.type ?? raw.practiceType ?? 'organic').toLowerCase(),
    submittedLabel:
      raw.submittedAt || raw.createdAt
        ? `Submitted ${new Date(raw.submittedAt ?? raw.createdAt).toLocaleDateString()}`
        : 'Recently submitted',
    evidenceData: hasEvidence ? ev : null,
    isImage: isImage,
  };
};


const PracticeLogs = () => {
  const [activeTab, setActiveTab] = useState(STATUS.ALL);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [previewPractice, setPreviewPractice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await farmerService.getPracticeLogs();
      const list = Array.isArray(data) ? data : (data?.practices ?? data?.logs ?? []);
      setLogs(list.map(normalizeLog));
    } catch (err) {
      console.error('Failed to load practice logs:', err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Unable to load practice logs.'
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = useMemo(() => {
    if (activeTab === STATUS.ALL) return logs;
    return logs.filter((log) => log.status === activeTab);
  }, [logs, activeTab]);

  const handleAddPractice = () => navigate("/farmer/practice/add");

  // Navigate to practice detail view (future route)
  const handleViewStatus = (logId) => {
    // Placeholder: future route for viewing a specific practice log
    console.log('View practice log:', logId);
  };


  return (
    <Box className="practice-logs">
      <Box className="practice-logs-header">
        <Tabs
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
          textColor="primary"
          indicatorColor="primary"
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} label={tab.label} value={tab.value} />
          ))}
        </Tabs>

        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={handleAddPractice}
        >
          Add Practice
        </Button>
      </Box>

      <Card className="practice-log-list">
        {loading ? (
          <Box className="practice-logs-state">
            <CircularProgress color="success" />
          </Box>
        ) : error ? (
          <Box className="practice-logs-state">
            <Typography variant="body2" color="error">
              {error}
            </Typography>
            <Button size="small" onClick={loadLogs} sx={{ mt: 1 }}>Retry</Button>
          </Box>
        ) : filteredLogs.length === 0 ? (
          <Box className="practice-logs-state">
            <Typography variant="body2" color="text.secondary">
              No practices found in this category.
            </Typography>
          </Box>
        ) : (
          filteredLogs.map((log) => {
            const { label, color, icon } = STATUS_CONFIG[log.status];

            return (
              <Stack
                key={log.id}
                direction="row"
                alignItems="center"
                spacing={2}
                className="practice-log-row"
              >
                <Avatar className="practice-log-avatar">
                  {ICONS[log.type]}
                </Avatar>

                <Box className="practice-log-info">
                  <Typography variant="subtitle2">{log.title}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {log.submittedLabel}
                  </Typography>
                </Box>

                {log.evidenceData && (
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    onClick={() => setPreviewPractice(log)}
                    sx={{ mr: 1 }}
                  >
                    View
                  </Button>
                )}

                <Chip
                  label={label}
                  color={color}
                  icon={icon}
                  size="small"
                  onClick={() => handleViewStatus(log.id)}
                />
              </Stack>
            );
          })
        )}
      </Card>

      <Dialog open={Boolean(previewPractice)} onClose={() => setPreviewPractice(null)} maxWidth="md">
        <DialogContent sx={{ minWidth: { xs: 280, sm: 400 }, p: 3, position: 'relative' }}>
          <IconButton
            onClick={() => setPreviewPractice(null)}
            aria-label="Close preview"
            sx={{ position: 'absolute', right: 8, top: 8, bgcolor: 'rgba(255,255,255,0.8)' }}
          >
            <CloseIcon />
          </IconButton>
          
          <Typography variant="h6" sx={{ mb: 2 }}>Evidence for {previewPractice?.title}</Typography>
          
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

export default PracticeLogs;