import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress
} from "@mui/material";
import API from "../services/api";
import {
  Box 
} from "@mui/material";

function Supervisor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [entryData, setEntryData] = useState(null);

  const [form, setForm] = useState({
    serviceAdvisor: "",
    signature: "",
    complaints: [""],
    workType: "",
    mechanicName: ""
  });

  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // FETCH ENTRY DATA
  useEffect(() => {
    fetchEntry();
  }, []);

  const fetchEntry = async () => {
    try {
      const res = await API.get(`/entries/${id}`);

      setEntryData(res.data);

      setForm({
        serviceAdvisor: res.data.serviceAdvisor || "",
        signature: res.data.signature || "",
        complaints: res.data.complaints?.length
          ? res.data.complaints
          : [""],
        workType: res.data.workType || "",
        mechanicName: res.data.mechanicName || ""
      });

    } catch (err) {
      console.log(err);
    }
  };

  // INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleComplaintChange = (index, value) => {
    const updated = [...form.complaints];
    updated[index] = value;
    setForm({ ...form, complaints: updated });
  };
  const addRow = () => {
    if (form.complaints.length < 5) {
      setForm({
        ...form,
        complaints: [...form.complaints, ""]
      });
    }
  };

  const removeRow = (index) => {
    const updated = form.complaints.filter((_, i) => i !== index);
    setForm({ ...form, complaints: updated });
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.serviceAdvisor || !form.workType) {
      setToast({
        open: true,
        message: "Advisor & Work Type required ⚠️",
        severity: "warning"
      });
      return;
    }

    try {
      setLoading(true);

      await API.put(`/entries/${id}`, {
        ...form,
        status: "FLOOR_IN"
      });

      setToast({
        open: true,
        message: "Supervisor data saved ✅",
        severity: "success"
      });

      // 🔥 REDIRECT TO CHECKSHEET
      setTimeout(() => {
        navigate(`/checksheet/${id}`);
      }, 800);

    } catch (err) {
      console.log(err);
      setToast({
        open: true,
        message: "Error saving data ❌",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, mt: 4, borderRadius: 2 }}>

        <Typography variant="h5" gutterBottom>
          Supervisor Form
        </Typography>

        {/* SHOW ENTRY DETAILS */}
        <Typography variant="subtitle2">
          Vehicle: {entryData?.vehicleNo || "-"}
        </Typography>

        <Typography variant="subtitle2">
          Customer: {entryData?.customerName || "-"}
        </Typography>

        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Date: {entryData?.date || "-"}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>

            {/* Advisor */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Service Advisor Name"
                name="serviceAdvisor"
                value={form.serviceAdvisor}
                onChange={handleChange}
              />
            </Grid>

            {/* Signature */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Signature"
                name="signature"
                value={form.signature}
                onChange={handleChange}
              />
            </Grid>

            {/* Complaints */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Nature of Complaints</Typography>

              {form.complaints.map((c, index) => (
                <Box key={index} sx={{ display: "flex", gap: 1, mb: 1 }}>

                  <TextField
                    fullWidth
                    label={`Complaint ${index + 1}`}
                    value={c}
                    onChange={(e) =>
                      handleComplaintChange(index, e.target.value)
                    }
                  />

                  {form.complaints.length > 1 && (
                    <Button
                      color="error"
                      onClick={() => removeRow(index)}
                    >
                      X
                    </Button>
                  )}
                </Box>
              ))}

              <Button
                variant="outlined"
                onClick={addRow}
                disabled={form.complaints.length >= 5}
              >
                + Add Complaint
              </Button>
            </Grid>
            {/* Work Type */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Work Type"
                name="workType"
                value={form.workType}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              >
                <MenuItem value="">
                  <em>Select Work Type</em>
                </MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Warranty">Warranty</MenuItem>
                <MenuItem value="AMC">AMC</MenuItem>
                <MenuItem value="Accidental">Accidental</MenuItem>
              </TextField>
            </Grid>

            {/* Mechanic */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mechanic Name"
                name="mechanicName"
                value={form.mechanicName}
                onChange={handleChange}
              />
            </Grid>

            {/* Submit */}
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? <CircularProgress size={24} color="inherit" />
                  : "Submit Supervisor Form"}
              </Button>
            </Grid>

          </Grid>
        </form>
      </Paper>

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Supervisor;