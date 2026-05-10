import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider
} from "@mui/material";
import API from "../services/api";

function AdminView() {
  const { id } = useParams();
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    fetchEntry();
  }, []);

  const fetchEntry = async () => {
    try {
      const res = await API.get(`/entries/${id}`);
      setEntry(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!entry) return <Typography>Loading...</Typography>;

  // ✅ STATUS MAP
  const statusMap = {
    GATE_IN: { label: "Gate IN", color: "default" },
    FLOOR_IN: { label: "Supervisor Done", color: "warning" },
    JOBCARD: { label: "Checksheet Done", color: "info" },
    PARTS_REQUESTED: { label: "Parts Requested", color: "secondary" },
    PARTS_DONE: { label: "Parts Ready", color: "success" },
    ESTIMATE_CREATED: { label: "Estimate Created", color: "info" },
    ESTIMATE_APPROVED: { label: "Approved", color: "success" },
    ESTIMATE_REJECTED: { label: "Rejected", color: "error" },
    GATE_OUT: { label: "Gate Out", color: "success" }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3 }}>

        {/* 🔷 BASIC INFO */}
        <Typography variant="h5" gutterBottom>
          Vehicle: {entry.vehicleNo}
        </Typography>

        <Typography>Customer: {entry.customerName}</Typography>
        <Typography>Mobile: {entry.mobileNo}</Typography>

        <Chip
          label={statusMap[entry.status]?.label || "Unknown"}
          color={statusMap[entry.status]?.color || "default"}
          sx={{ mt: 1 }}
        />

        <Divider sx={{ my: 2 }} />

        {/* 🔶 SUPERVISOR */}
        <Typography variant="h6">Supervisor Details</Typography>
        <Typography>Mechanic: {entry.mechanicName || "-"}</Typography>
        <Typography>Advisor: {entry.serviceAdvisor || "-"}</Typography>

        <Divider sx={{ my: 2 }} />

        {/* 🔶 CHECKSHEET */}
        <Typography variant="h6">Checksheet</Typography>
        {entry.checklist?.length > 0 ? (
          entry.checklist.map((item, i) => (
            <Grid container key={i} spacing={2}>
              <Grid item xs={6}>{item.label}</Grid>
              <Grid item xs={3}>Before: {item.before}</Grid>
              <Grid item xs={3}>After: {item.after}</Grid>
            </Grid>
          ))
        ) : (
          <Typography color="text.secondary">Not Filled</Typography>
        )}

        <Divider sx={{ my: 2 }} />

        {/* 🔶 PARTS */}
        <Typography variant="h6">Parts</Typography>
        {entry.partsDetails?.length > 0 ? (
          entry.partsDetails.map((p, i) => (
            <Grid container key={i} spacing={2}>
              <Grid item xs={4}>{p.partName}</Grid>
              <Grid item xs={2}>Qty: {p.quantity}</Grid>
              <Grid item xs={3}>
                <Chip
                  label={p.status}
                  color={p.status === "AVAILABLE" ? "success" : "warning"}
                />
              </Grid>
              <Grid item xs={3}>
                {p.status === "NOT_AVAILABLE"
                  ? `ETA: ${p.eta || "-"}`
                  : "-"}
              </Grid>
            </Grid>
          ))
        ) : (
          <Typography color="text.secondary">No Parts Requested</Typography>
        )}

        <Divider sx={{ my: 2 }} />

        {/* 🔶 ESTIMATE */}
        <Typography variant="h6">Estimate</Typography>

        {entry.estimate ? (
          <>
            <Typography>KM: {entry.estimate.kilometer}</Typography>
            <Typography>Work Type: {entry.estimate.workType}</Typography>

            <Typography sx={{ mt: 1 }}><b>Parts:</b></Typography>
            {entry.estimate.parts?.map((p, i) => (
              <Typography key={i}>
                {p.description} - ₹{p.amount}
              </Typography>
            ))}

            <Typography sx={{ mt: 1 }}><b>Labour:</b></Typography>
            {entry.estimate.labour?.map((l, i) => (
              <Typography key={i}>
                {l.description} - ₹{l.amount}
              </Typography>
            ))}

            <Typography sx={{ mt: 2 }}>
              <b>Total: ₹ {entry.estimate.total}</b>
            </Typography>
          </>
        ) : (
          <Typography color="text.secondary">Estimate Not Created</Typography>
        )}

      </Paper>
    </Container>
  );
}

export default AdminView;