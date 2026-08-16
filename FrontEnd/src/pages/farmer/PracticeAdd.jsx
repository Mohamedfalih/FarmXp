import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import farmerService from "../../services/farmerService";
import "./PracticeAdd.css";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ScienceIcon from '@mui/icons-material/Science';

// Page-specific constants
const CATEGORIES = [
  { value: "SOIL", label: "Soil Health (e.g., Organic mulching, crop rotation)" },
  { value: "WATER", label: "Water Management (e.g., Drip irrigation, rainwater harvesting)" },
  { value: "PEST_CONTROL", label: "Pest Control (e.g., Bio-pesticides)" },
  { value: "CROP_DIVERSITY", label: "Crop Diversity (e.g., Intercropping)" },
];

const PRACTICE_LOGS_ROUTE = "/farmer/practice-logs";

const PracticeAdd = () => {
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [practiceName, setPracticeName] = useState("");
  const [description, setDescription] = useState("");
  const [evidence, setEvidence] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleBack = () => {
    navigate(PRACTICE_LOGS_ROUTE);
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      const newLog = await farmerService.submitPractice({
        category,
        practiceName,
        description,
        evidence: evidence || "No evidence provided",
      });

      navigate(PRACTICE_LOGS_ROUTE);
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid =
    category.trim() && practiceName.trim() && description.trim();

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

        <form className="practice-add-form" onSubmit={(e) => e.preventDefault()}>
          <TextField
            select
            fullWidth
            label="Practice Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            margin="normal"
            slotProps={{ inputLabel: { shrink: true } }}
          >
            {CATEGORIES.map((cat) => (
              <MenuItem key={cat.value} value={cat.value}>
                {cat.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Practice Name"
            placeholder="e.g. Drip Irrigation System"
            value={practiceName}
            onChange={(e) => setPracticeName(e.target.value)}
            margin="normal"
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <TextField
            fullWidth
            label="Description"
            multiline
            rows={4}
            placeholder="Describe how you implemented this practice..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <TextField
            fullWidth
            label="Evidence (Optional link or note)"
            placeholder="Link to photo or document"
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            margin="normal"
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <Button
            variant="contained"
            color="success"
            size="large"
            disabled={!isFormValid || submitting}
            onClick={handleSubmit}
            className="practice-add-submit"
          >
            {submitting ? "Submitting..." : "Submit for Verification"}
          </Button>
        </form>
      </Card>
    </Box>
  );
};

export default PracticeAdd;