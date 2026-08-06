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
import AddIcon from "@mui/icons-material/Add";
import GrassIcon from "@mui/icons-material/Grass";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import ScienceIcon from "@mui/icons-material/Science";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CancelIcon from "@mui/icons-material/Cancel";
import { getPracticeLogs } from "../../services/farmerService";
import "./PracticeLogs.css";

// Page-specific constants — only Practice Logs uses these, so they live here
// instead of constants/status.js
const STATUS = {
  ALL: "all",
  APPROVED: "approved",
  PENDING: "pending",
  REJECTED: "rejected",
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
};

const PracticeLogs = () => {
  const [activeTab, setActiveTab] = useState(STATUS.ALL);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getPracticeLogs().then((data) => {
      setLogs(data);
      setLoading(false);
    });
  }, []);

  const filteredLogs = useMemo(() => {
    if (activeTab === STATUS.ALL) return logs;
    return logs.filter((log) => log.status === activeTab);
  }, [logs, activeTab]);

  const handleAddPractice = () => navigate("/farmer/practice/add");
  const handleViewStatus = (logId) => navigate(`/farmer/practice/status/${logId}`);

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
    </Box>
  );
};

export default PracticeLogs;