import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Typography,
  Button,
  Grid,
  Paper,
  Snackbar,
  Alert,
  CircularProgress
} from "@mui/material";
import API from "../services/api";

function EntryCoupon() {
  const getInitialForm = () => {
    const now = new Date();
    return {
      timeIn: now.toTimeString().slice(0, 5),
      date: now.toISOString().split("T")[0],
      kilometer: "",
      vehicleNo: "",
      model: "",
      chassisNo: "",
      customerName: "",
      mobileNo: "",
      signature: ""
    };
  };

  const [form, setForm] = useState(getInitialForm());
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Reset form
  const resetForm = () => {
    setForm(getInitialForm());
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.vehicleNo || !form.mobileNo) {
      setToast({
        open: true,
        message: "Vehicle No & Mobile No required ⚠️",
        severity: "warning"
      });
      return;
    }

    try {
      setLoading(true);

      await API.post("/entries", form);

      setToast({
        open: true,
        message: "Entry Saved Successfully ✅",
        severity: "success"
      });

      resetForm();

    } catch (err) {
      console.log(err);
      setToast({
        open: true,
        message: "Error saving entry ❌",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ px: { xs: 1, sm: 2 } }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3 },
          mt: { xs: 6, sm: 4 },
          borderRadius: 2
        }}
      >
        <Typography variant="h5" gutterBottom>
          A. Entry Coupon
        </Typography>

        <Typography variant="subtitle2" gutterBottom>
          To be filled by Guard
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>

            {/* Time */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Time In"
                type="time"
                name="timeIn"
                value={form.timeIn}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Date */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Fields */}
            <Grid item xs={12}>
              <TextField fullWidth label="Kilometer" name="kilometer" value={form.kilometer} onChange={handleChange} />
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth label="Vehicle No" name="vehicleNo" value={form.vehicleNo} onChange={handleChange} required />
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth label="Model" name="model" value={form.model} onChange={handleChange} />
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth label="Chassis No" name="chassisNo" value={form.chassisNo} onChange={handleChange} />
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth label="Customer Name" name="customerName" value={form.customerName} onChange={handleChange} />
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth label="Mobile No" name="mobileNo" value={form.mobileNo} onChange={handleChange} required />
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth label="Signature" name="signature" value={form.signature} onChange={handleChange} />
            </Grid>

            {/* Submit */}
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                type="submit"
                disabled={loading}
                sx={{ mt: 1 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Submit Entry"}
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

export default EntryCoupon;