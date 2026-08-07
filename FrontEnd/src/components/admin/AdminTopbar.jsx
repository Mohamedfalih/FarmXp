import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import "./AdminTopbar.css";

const AdminTopbar = ({ pageTitle, onMenuToggle }) => {
  return (
    <Box className="admin-topbar">
      <Box className="admin-topbar-left">
        <IconButton onClick={onMenuToggle} className="admin-topbar-menu-btn">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className="admin-topbar-title">
          {pageTitle}
        </Typography>
      </Box>

      <Box className="admin-topbar-actions">
        <IconButton className="admin-topbar-icon-btn">
          <Badge variant="dot" color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <Box className="admin-topbar-profile">
          <Avatar className="admin-topbar-avatar">AD</Avatar>
          <Typography variant="body2" className="admin-topbar-name">
            Admin
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminTopbar;