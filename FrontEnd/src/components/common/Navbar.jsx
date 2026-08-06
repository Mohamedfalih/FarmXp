import React from "react";
import { Box, Typography, Badge } from "@mui/material";
import { Link } from "react-router-dom";

const drawerWidth = 260;

const Navbar = ({ onMenuClick, pageTitle = "Dashboard" }) => {
  const farmerName = "Guest Farmer";
  const notificationCount = 0;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: { xs: 0, md: `${drawerWidth}px` },
        right: 0,
        height: "72px",
        bgcolor: "#FFFFFF",
        borderBottom: "1px solid #E4DFCF",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 4,
        zIndex: 1200,
      }}
    >
      {/* Left Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          component="button"
          onClick={onMenuClick}
          sx={{
            display: { xs: "flex", md: "none" },
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "1px solid #E4DFCF",
            bgcolor: "#FBF7EC",
            cursor: "pointer",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
          }}
        >
          ☰
        </Box>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: "#173019",
          }}
        >
          {pageTitle}
        </Typography>
      </Box>

      {/* Right Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* Notification */}
        <Box
          component={Link}
          to="/farmer/notifications"
          sx={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            bgcolor: "#FBF7EC",
            border: "1px solid #E4DFCF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textDecoration: "none",
            position: "relative",
            fontSize: 18,
          }}
        >
          🔔

          {notificationCount > 0 && (
            <Badge
              badgeContent={notificationCount}
              color="error"
              sx={{
                position: "absolute",
                top: 6,
                right: 6,
              }}
            />
          )}
        </Box>

        {/* Profile */}
        <Box
          component={Link}
          to="/farmer/profile"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1,
            py: 0.5,
            borderRadius: "999px",
            bgcolor: "#FBF7EC",
            border: "1px solid #E4DFCF",
            textDecoration: "none",
          }}
        >
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              bgcolor: "#6FA83A",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
            }}
          >
            {farmerName.charAt(0)}
          </Box>

          <Typography
            sx={{
              fontWeight: 600,
              color: "#173019",
            }}
          >
            {farmerName}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Navbar;