import { useMemo, useState } from "react";
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
} from "@mui/material";

import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PeopleIcon from "@mui/icons-material/People";
import VerifiedIcon from "@mui/icons-material/Verified";
import StorefrontIcon from "@mui/icons-material/Storefront";
import BarChartIcon from "@mui/icons-material/BarChart";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SettingsIcon from "@mui/icons-material/Settings";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import FilterListIcon from "@mui/icons-material/FilterList";

import "./AdminNotifications.css";

/* =========================================================
   MOCK NOTIFICATIONS
   Later:
   GET /api/admin/notifications
========================================================= */

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: "verification",
    title: "Practice Verification Required",
    message:
      "A farmer has submitted a sustainable farming practice for verification.",
    time: "5 minutes ago",
    unread: true,
    reference: "Verification",
  },
  {
    id: 2,
    type: "farmer",
    title: "New Farmer Registration",
    message:
      "A new farmer has registered on the FarmXP platform.",
    time: "20 minutes ago",
    unread: true,
    reference: "Farmers",
  },
  {
    id: 3,
    type: "market",
    title: "New Buyer Activity",
    message:
      "A new market buyer profile requires your attention.",
    time: "1 hour ago",
    unread: true,
    reference: "Market Buyers",
  },
  {
    id: 4,
    type: "report",
    title: "New Farmer Report",
    message:
      "A farmer has submitted a report that requires admin review.",
    time: "2 hours ago",
    unread: false,
    reference: "Reports",
  },
  {
    id: 5,
    type: "scheme",
    title: "Government Scheme Update",
    message:
      "A government scheme has been updated and may need review.",
    time: "Yesterday",
    unread: false,
    reference: "Government Schemes",
  },
  {
    id: 6,
    type: "security",
    title: "Security Alert",
    message:
      "Multiple unsuccessful login attempts were detected.",
    time: "Yesterday",
    unread: false,
    reference: "Security",
  },
  {
    id: 7,
    type: "verification",
    title: "Practice Verification Completed",
    message:
      "A previously submitted practice has been verified successfully.",
    time: "2 days ago",
    unread: false,
    reference: "Verification",
  },
];

/* =========================================================
   FILTERS
========================================================= */

const FILTERS = [
  {
    value: "all",
    label: "All",
  },
  {
    value: "unread",
    label: "Unread",
  },
  {
    value: "verification",
    label: "Verification",
  },
  {
    value: "farmer",
    label: "Farmers",
  },
  {
    value: "market",
    label: "Market",
  },
  {
    value: "system",
    label: "System",
  },
];

/* =========================================================
   ICONS
   Using icons already present in your AdminSidebar.
========================================================= */

const getNotificationIcon = (type) => {
  switch (type) {
    case "farmer":
      return <PeopleIcon />;

    case "verification":
      return <VerifiedIcon />;

    case "market":
      return <StorefrontIcon />;

    case "report":
      return <BarChartIcon />;

    case "scheme":
      return <AccountBalanceIcon />;

    case "security":
      return <AdminPanelSettingsIcon />;

    default:
      return <NotificationsNoneOutlinedIcon />;
  }
};

/* =========================================================
   LABEL
========================================================= */

const getNotificationLabel = (type) => {
  switch (type) {
    case "farmer":
      return "Farmer";

    case "verification":
      return "Verification";

    case "market":
      return "Market";

    case "report":
      return "Report";

    case "scheme":
      return "Scheme";

    case "security":
      return "Security";

    default:
      return "System";
  }
};

/* =========================================================
   COMPONENT
========================================================= */

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState(
    INITIAL_NOTIFICATIONS
  );

  const [activeFilter, setActiveFilter] = useState("all");

  const [menuAnchor, setMenuAnchor] = useState(null);

  const [selectedNotification, setSelectedNotification] =
    useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  /* =======================================================
     UNREAD COUNT
  ======================================================= */

  const unreadCount = useMemo(() => {
    return notifications.filter(
      (notification) => notification.unread
    ).length;
  }, [notifications]);

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "all") {
      return notifications;
    }

    if (activeFilter === "unread") {
      return notifications.filter(
        (notification) => notification.unread
      );
    }

    if (activeFilter === "system") {
      return notifications.filter((notification) =>
        ["report", "scheme", "security"].includes(
          notification.type
        )
      );
    }

    return notifications.filter(
      (notification) =>
        notification.type === activeFilter
    );
  }, [notifications, activeFilter]);

  /* =======================================================
     SNACKBAR
  ======================================================= */

  const showSnackbar = (
    message,
    severity = "success"
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const closeSnackbar = () => {
    setSnackbar((previous) => ({
      ...previous,
      open: false,
    }));
  };

  /* =======================================================
     MARK AS READ
  ======================================================= */

  const handleMarkAsRead = (id) => {
    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              unread: false,
            }
          : notification
      )
    );

    setMenuAnchor(null);
    setSelectedNotification(null);
  };

  /* =======================================================
     MARK ALL AS READ
  ======================================================= */

  const handleMarkAllAsRead = () => {
    if (unreadCount === 0) {
      showSnackbar(
        "All notifications are already read",
        "info"
      );
      return;
    }

    setNotifications((previous) =>
      previous.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );

    showSnackbar("All notifications marked as read");
  };

  /* =======================================================
     DELETE
     
     For now this removes the notification locally.
     Later:
     DELETE /api/admin/notifications/{id}
  ======================================================= */

  const handleDelete = (id) => {
    setNotifications((previous) =>
      previous.filter(
        (notification) => notification.id !== id
      )
    );

    setMenuAnchor(null);
    setSelectedNotification(null);

    showSnackbar("Notification removed");
  };

  /* =======================================================
     OPEN MENU
  ======================================================= */

  const handleOpenMenu = (
    event,
    notification
  ) => {
    event.stopPropagation();

    setMenuAnchor(event.currentTarget);
    setSelectedNotification(notification);
  };

  /* =======================================================
     CLOSE MENU
  ======================================================= */

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setSelectedNotification(null);
  };

  /* =======================================================
     NOTIFICATION CLICK
  ======================================================= */

  const handleNotificationClick = (
    notification
  ) => {
    if (notification.unread) {
      handleMarkAsRead(notification.id);
    }

    showSnackbar(
      `${notification.reference} section selected`,
      "info"
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <Box className="admin-notifications-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <Box className="admin-notifications-header">

        <Box>
          <Typography
            variant="h5"
            className="admin-notifications-title"
          >
            Notifications
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            className="admin-notifications-subtitle"
          >
            Stay updated with important FarmXP
            activities that require your attention.
          </Typography>
        </Box>

        <Box className="notification-header-actions">

          <Chip
            icon={
              <NotificationsNoneOutlinedIcon />
            }
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

      {/* =================================================
          SUMMARY
      ================================================= */}

      <Box className="notification-summary">

        <Box className="summary-card">

          <Box className="summary-icon unread">
            <NotificationsNoneOutlinedIcon />
          </Box>

          <Box>
            <Typography className="summary-value">
              {unreadCount}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
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
              {
                notifications.filter(
                  (item) =>
                    item.type === "verification" &&
                    item.unread
                ).length
              }
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
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
              {
                notifications.filter(
                  (item) =>
                    item.type === "farmer"
                ).length
              }
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Farmer activities
            </Typography>
          </Box>

        </Box>

      </Box>

      {/* =================================================
          FILTER TOOLBAR
      ================================================= */}

      <Box className="notification-toolbar">

        <Box className="notification-filter-title">

          <FilterListIcon />

          <Typography variant="body2">
            Filter notifications
          </Typography>

        </Box>

        <Box className="notification-filters">

          {FILTERS.map((filter) => (
            <Button
              key={filter.value}
              size="small"
              className={`notification-filter ${
                activeFilter === filter.value
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveFilter(filter.value)
              }
            >

              {filter.label}

              {filter.value === "unread" &&
                unreadCount > 0 && (
                  <span className="filter-count">
                    {unreadCount}
                  </span>
                )}

            </Button>
          ))}

        </Box>

      </Box>

      {/* =================================================
          NOTIFICATION LIST
      ================================================= */}

      <Box className="notification-list">

        {filteredNotifications.length === 0 ? (

          <Box className="notification-empty">

            <Box className="empty-icon">
              <VerifiedIcon />
            </Box>

            <Typography
              variant="h6"
              className="empty-title"
            >
              You're all caught up
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              There are no notifications in this
              category.
            </Typography>

          </Box>

        ) : (

          filteredNotifications.map(
            (notification) => (

              <Box
                key={notification.id}
                className={`notification-card ${
                  notification.unread
                    ? "unread"
                    : ""
                }`}
                onClick={() =>
                  handleNotificationClick(
                    notification
                  )
                }
              >

                {/* ICON */}

                <Box
                  className={`notification-icon ${notification.type}`}
                >
                  {getNotificationIcon(
                    notification.type
                  )}
                </Box>

                {/* CONTENT */}

                <Box className="notification-content">

                  <Box className="notification-top">

                    <Typography
                      className="notification-title"
                    >
                      {notification.title}
                    </Typography>

                    {notification.unread && (
                      <span className="unread-dot" />
                    )}

                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className="notification-message"
                  >
                    {notification.message}
                  </Typography>

                  <Box className="notification-meta">

                    <Chip
                      label={getNotificationLabel(
                        notification.type
                      )}
                      size="small"
                      className="notification-type-chip"
                    />

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {notification.time}
                    </Typography>

                  </Box>

                </Box>

                {/* MENU */}

                <IconButton
                  size="small"
                  className="notification-menu-button"
                  onClick={(event) =>
                    handleOpenMenu(
                      event,
                      notification
                    )
                  }
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>

              </Box>

            )
          )

        )}

      </Box>

      {/* =================================================
          ACTION MENU
      ================================================= */}

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
      >

        {selectedNotification?.unread && (

          <MenuItem
            onClick={() =>
              handleMarkAsRead(
                selectedNotification.id
              )
            }
          >

            <VerifiedIcon
              fontSize="small"
              sx={{ mr: 1.5 }}
            />

            Mark as read

          </MenuItem>

        )}

        <MenuItem
          onClick={() => {
            if (selectedNotification) {
              handleDelete(
                selectedNotification.id
              );
            }
          }}
        >

          <NotificationsNoneOutlinedIcon
            fontSize="small"
            sx={{ mr: 1.5 }}
          />

          Delete

        </MenuItem>

      </Menu>

      {/* =================================================
          SNACKBAR
      ================================================= */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >

        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={closeSnackbar}
        >
          {snackbar.message}
        </Alert>

      </Snackbar>

    </Box>
  );
};

export default AdminNotifications;