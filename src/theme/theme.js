import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6FA83A",
    },
    secondary: {
      main: "#25422A",
    },
    success: {
      main: "#4C8C4A", // Verified status
    },
    warning: {
      main: "#D9A441", // Pending status
    },
    error: {
      main: "#C0392B", // Rejected status
    },
    background: {
      default: "#FBF7EC",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#173019",
      secondary: "#5A5A5A",
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 700,
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
});

export default theme;