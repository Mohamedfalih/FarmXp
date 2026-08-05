import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: "#FFFFFF",
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      <Toolbar
        sx={{
          maxWidth: "1280px",
          width: "100%",
          mx: "auto",
          display: "flex",
          justifyContent: "space-between",
          py: 1,
        }}
      >
        {/* Logo */}
        <Typography
          variant="h5"
          sx={{
            color: "primary.main",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          🌱 FarmXP
        </Typography>

        {/* Navigation */}
        <Box sx={{ display: "flex", gap: 4 }}>
          <Button href="#home" color="inherit">
            Home
          </Button>

          <Button href="#features" color="inherit">
            Features
          </Button>

          <Button href="#how-it-works" color="inherit">
            How It Works
          </Button>

          <Button href="#about" color="inherit">
            About
          </Button>
        </Box>

        {/* Buttons */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            component={Link}
            to="/login"
            variant="text"
            color="primary"
          >
            Login
          </Button>

          <Button
            component={Link}
            to="/register"
            variant="contained"
          >
            Get Started
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;