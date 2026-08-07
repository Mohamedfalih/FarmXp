import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";


const AdminDashboard = () => {
  return (
    <Box className="admin-dashboard-test">
      <Typography variant="h5">Dashboard</Typography>
      <Typography variant="body2" color="text.secondary">
        If you can see this with the sidebar and topbar showing correctly,
        AdminLayout is wired up. Click through the other sidebar links —
        they'll 404 or blank out until we build those pages next.
      </Typography>
    </Box>
  );
};

export default AdminDashboard;