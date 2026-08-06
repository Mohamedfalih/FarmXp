import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ScienceIcon from "@mui/icons-material/Science";
import { submitPractice } from "../../services/farmerService";
import "./PracticeAdd.css";

// Page-specific constants — only this page uses these
const PRACTICE_TYPES = [
  "Organic mulching",
  "Drip irrigation",
  "Bio-pesticide use",
  "Crop rotation",
  "Rainwater harvesting",
];

// Kept as a named constant instead of a raw string — swap for ROUTES.PRACTICE_LOGS
// if a routes.js file gets introduced later
const PRACTICE_LOGS_ROUTE = "/farmer/practice-logs";

const PracticeAdd = () => {
  const navigate = useNavigate();

  const [practiceType, setPracticeType] = useState("");
  const [description, setDescription] = useState("");
  const [datePracticed, setDatePracticed] = useState("");
  const [photo, setPhoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleBack = () => navigate(PRACTICE_LOGS_ROUTE);

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (file) setPhoto(file);
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const newLog = await submitPractice({
        type: practiceType,
        description,
        datePracticed,
        photo,
      });

      navigate(`${PRACTICE_LOGS_ROUTE}/status/${newLog.id}`);
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid =
    practiceType.trim() && description.trim() && datePracticed;

  return (
    <Box className="practice-add">
      <IconButton onClick={handleBack} className="practice-add-back">
        <ArrowBackIcon />
      </IconButton>

      <Card className="practice-add-card">
        <Box className="practice-add-title">
          <ScienceIcon color="success" />
          <Typography variant="h6">Submit a Sustainable Practice</Typography>
        </Box>

        <TextField
          select
          fullWidth
          label="Practice type"
          value={practiceType}
          onChange={(e) => setPracticeType(e.target.value)}
          margin="normal"
        >
          {PRACTICE_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Description"
          placeholder="Briefly describe what you did..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
        />

        <Box className="practice-add-upload">
          <Typography variant="body2" className="practice-add-upload-label">
            Upload evidence photo
          </Typography>

          <Box
            component="label"
            className={`practice-add-upload-box ${photo ? "has-photo" : ""}`}
          >
            <CameraAltIcon fontSize="large" color="disabled" />
            <Typography variant="caption" color="text.secondary">
              {photo ? photo.name : "Choose Image"}
            </Typography>
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handlePhotoChange}
            />
          </Box>
        </Box>

        <TextField
          fullWidth
          type="date"
          label="Date practiced"
          value={datePracticed}
          onChange={(e) => setDatePracticed(e.target.value)}
          InputLabelProps={{ shrink: true }}
          margin="normal"
        />

        <Button
          fullWidth
          variant="contained"
          color="success"
          size="large"
          disabled={!isFormValid || submitting}
          onClick={handleSubmit}
          className="practice-add-submit"
        >
          {submitting ? "Submitting..." : "Submit for Verification"}
        </Button>
      </Card>
    </Box>
  );
};

export default PracticeAdd;