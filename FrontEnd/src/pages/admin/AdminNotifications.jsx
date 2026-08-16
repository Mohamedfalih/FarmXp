import { useMemo, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";

import notificationService from "../../services/notificationService";

import "./AdminNotifications.css";
import PeopleIcon from '@mui/icons-material/People';
import VerifiedIcon from '@mui/icons-material/Verified';
import StorefrontIcon from '@mui/icons-material/Storefront';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';

/* =========================================================
   FILTERS
========================================================= */

const FILTERS = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "verification", label: "Verification" },
  { value: "farmer", label: "Farmers" },
  { value: "market", label: "Market" },
  { value: "system", label: "System" },
];

/* =========================================================
   ICONS & LABELS
========================================================= */

const getNotificationIcon = (type) => {
  const t = (type || "").toLowerCase();
  if (t.includes("farmer")) return <PeopleIcon />;
  if (t.includes("verif") || t.includes("practic")) return <VerifiedIcon />;
  if (t.includes("market") || t.includes("buyer")) return <StorefrontIcon />;
  if (t.includes("report")) return <BarChartIcon />;
  if (t.includes("scheme")) return <AccountBalanceIcon />;
  if (t.includes("secur")) return <AdminPanelSettingsIcon />;
  return <NotificationsNoneOutlinedIcon />;
};

const getNotificationLabel = (type) => {
  const t = (type || "").toLowerCase();
  if (t.includes("farmer")) return "Farmer";
  if (t.includes("verif") || t.includes("practic")) return "Verification";
  if (t.includes("market") || t.includes("buyer")) return "Market";
  if (t.includes("report")) return "Report";
  if (t.includes("scheme")) return "Scheme";
  if (t.includes("secur")) return "Security";
  return "System";
};

// Internal category mapping for filters
const getNotificationCategory = (type) => {
  const label = getNotificationLabel(type);
  if (["Farmer", "Verification", "Market"].includes(label)) return label.toLowerCase();
  return "system"; // Everything else falls into system filter
};

// Normalize raw backend notification
const normalizeNotification = (raw) => {
  let dateStr = "Recently";
  if (raw.createdAt || raw.timestamp) {
    const d = new Date(raw.createdAt || raw.timestamp);
    dateStr = d.toLocaleDateString();
  }

  const type = raw.type ?? raw.notificationType ?? "system";
  
  return {
    id: raw.id ?? raw.notificationId,
    type: type,
    category: getNotificationCategory(type),
    title: raw.title ?? raw.subject ?? "Notification",
    message: raw.message ?? raw.content ?? raw.description ?? "",
    time: dateStr,
    unread: raw.unread ?? raw.isUnread ?? !(raw.read ?? raw.isRead),
    reference: getNotificationLabel(type),
  };
};

/* =========================================================
   COMPONENT
========================================================= */

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState("all");
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await notificationService.getNotifications();
      const list = Array.isArray(data) ? data : (data?.notifications ?? data?.content ?? []);
      setNotifications(list.map(normalizeNotification));
    } catch (err) {
      console.error('Failed to load admin notifications:', err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Unable to load notifications.'
      );
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => n.unread).length;
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "all") return notifications;
    if (activeFilter === "unread") return notifications.filter((n) => n.unread);
    return notifications.filter((n) => n.category === activeFilter);
  }, [notifications, activeFilter]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleMarkAsRead = async (id) => {
    // Optimistic UI update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
    setMenuAnchor(null);
    setSelectedNotification(null);
    try {
      await notificationService.markAsRead(id);
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) {
      showSnackbar("All notifications are already read", "info");
      return;
    }
    // Optimistic UI update
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    showSnackbar("All notifications marked as read");
    try {
      await notificationService.markAllAsRead();
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  // The backend might not support DELETE for notifications for compliance reasons.
  // For now we keep the UI action but it just hides it locally unless the API is present.
  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    setMenuAnchor(null);
    setSelectedNotification(null);
    showSnackbar("Notification removed (local)");
  };

  const handleOpenMenu = (event, notification) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedNotification(notification);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setSelectedNotification(null);
  };

  const handleNotificationClick = (notification) => {
    if (notification.unread) {
      handleMarkAsRead(notification.id);
    }
    showSnackbar(`${notification.reference} section selected`, "info");
  };

  if (loading) {
    return (
      <Box className="admin-notifications-page">
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress color="success" />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="admin-notifications-page">
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
          <Button variant="outlined" size="small" onClick={loadNotifications} sx={{ mt: 2 }}>
            Retry
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="admin-notifications-page">
      <Box className="admin-notifications-header">
        <Box>
          <Typography variant="h5" className="admin-notifications-title">
            Notifications
          </Typography>
          <Typography variant="body2" color="text.secondary" className="admin-notifications-subtitle">
            Stay updated with important FarmXP activities that require your attention.
          </Typography>
        </Box>
        <Box className="notification-header-actions">
          <Chip
            icon={<NotificationsNoneOutlinedIcon />}
            label={`${unreadCount} unread`}
            className="unread-count-chip"
          />
          <Button
            variant="outlined"
            size="small"
            startIcon={<DoneAllIcon />}
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </Button>
        </Box>
      </Box>

      <Box className="notification-summary">
        <Box className="summary-card">
          <Box className="summary-icon unread">
            <NotificationsNoneOutlinedIcon />
          </Box>
          <Box>
            <Typography className="summary-value">{unreadCount}</Typography>
            <Typography variant="caption" color="text.secondary">
              Unread notifications
            </Typography>
          </Box>
        </Box>
        <Box className="summary-card">
          <Box className="summary-icon verification">
            <VerifiedIcon />
          </Box>
          <Box>
            <Typography className="summary-value">
              {notifications.filter((item) => item.category === "verification" && item.unread).length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Awaiting verification
            </Typography>
          </Box>
        </Box>
        <Box className="summary-card">
          <Box className="summary-icon farmer">
            <PeopleIcon />
          </Box>
          <Box>
            <Typography className="summary-value">
              {notifications.filter((item) => item.category === "farmer").length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Farmer activities
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box className="notification-toolbar">
        <Box className="notification-filter-title">
          <FilterListIcon />
          <Typography variant="body2">Filter notifications</Typography>
        </Box>
        <Box className="notification-filters">
          {FILTERS.map((filter) => (
            <Button
              key={filter.value}
              size="small"
              className={`notification-filter ${activeFilter === filter.value ? "active" : ""}`}
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
              {filter.value === "unread" && unreadCount > 0 && (
                <span className="filter-count">{unreadCount}</span>
              )}
            </Button>
          ))}
        </Box>
      </Box>

      <Box className="notification-list">
        {filteredNotifications.length === 0 ? (
          <Box className="notification-empty">
            <Box className="empty-icon"><VerifiedIcon /></Box>
            <Typography variant="h6" className="empty-title">You're all caught up</Typography>
            <Typography variant="body2" color="text.secondary">There are no notifications in this category.</Typography>
          </Box>
        ) : (
          filteredNotifications.map((notification) => (
            <Box
              key={notification.id}
              className={`notification-card ${notification.unread ? "unread" : ""}`}
              onClick={() => handleNotificationClick(notification)}
            >
              <Box className={`notification-icon ${notification.category}`}>
                {getNotificationIcon(notification.type)}
              </Box>
              <Box className="notification-content">
                <Box className="notification-top">
                  <Typography className="notification-title">{notification.title}</Typography>
                  {notification.unread && <span className="unread-dot" />}
                </Box>
                <Typography variant="body2" color="text.secondary" className="notification-message">
                  {notification.message}
                </Typography>
                <Box className="notification-meta">
                  <Chip
                    label={notification.reference}
                    size="small"
                    className="notification-type-chip"
                  />
                  <Typography variant="caption" color="text.secondary">
                    {notification.time}
                  </Typography>
                </Box>
              </Box>
              <IconButton
                size="small"
                className="notification-menu-button"
                onClick={(event) => handleOpenMenu(event, notification)}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>
          ))
        )}
      </Box>

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleCloseMenu}>
        {selectedNotification?.unread && (
          <MenuItem onClick={() => handleMarkAsRead(selectedNotification.id)}>
            <VerifiedIcon fontSize="small" sx={{ mr: 1.5 }} /> Mark as read
          </MenuItem>
        )}
        <MenuItem onClick={() => { if (selectedNotification) handleDelete(selectedNotification.id); }}>
          <NotificationsNoneOutlinedIcon fontSize="small" sx={{ mr: 1.5 }} /> Delete
        </MenuItem>
      </Menu>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} variant="filled" onClose={closeSnackbar}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminNotifications;