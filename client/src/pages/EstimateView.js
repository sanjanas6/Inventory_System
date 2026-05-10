import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container, Typography, Paper, Button, Grid
} from "@mui/material";
import API from "../services/api";

function EstimateView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    fetchEntry();
  }, []);

  const fetchEntry = async () => {
    const res = await API.get(`/entries/${id}`);
    setEntry(res.data);
  };

  const approve = async () => {
    await API.put(`/entries/${id}`, {
      estimate: { ...entry.estimate, approved: "APPROVED" },
      status: "ESTIMATE_APPROVED"
    });

    alert("Approved ✅");
    navigate("/entries");
  };

  const reject = async () => {
    await API.put(`/entries/${id}`, {
      estimate: { ...entry.estimate, approved: "REJECTED" },
      status: "ESTIMATE_REJECTED"
    });

    alert("Rejected ❌");
    navigate("/entries");
  };

  if (!entry) return "Loading...";

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Estimate View</Typography>

        <Typography>KM: {entry.estimate?.kilometer}</Typography>
        <Typography>Work Type: {entry.estimate?.workType}</Typography>

        <Typography sx={{ mt: 2 }}>Parts</Typography>
        {entry.estimate?.parts?.map((p, i) => (
          <Grid container key={i}>
            <Grid item xs={6}>{p.description}</Grid>
            <Grid item xs={6}>₹ {p.amount}</Grid>
          </Grid>
        ))}

        <Typography sx={{ mt: 2 }}>Labour</Typography>
        {entry.estimate?.labour?.map((l, i) => (
          <Grid container key={i}>
            <Grid item xs={6}>{l.description}</Grid>
            <Grid item xs={6}>₹ {l.amount}</Grid>
          </Grid>
        ))}

        <Typography sx={{ mt: 2 }}>
          <b>Total: ₹ {entry.estimate?.total}</b>
        </Typography>

        {/* APPROVAL */}
        {entry.estimate?.approved === "PENDING" && (
          <>
            <Button
              variant="contained"
              color="success"
              fullWidth
              sx={{ mt: 2 }}
              onClick={approve}
            >
              Approve
            </Button>

            <Button
              variant="contained"
              color="error"
              fullWidth
              sx={{ mt: 2 }}
              onClick={reject}
            >
              Reject
            </Button>
          </>
        )}

        <Typography sx={{ mt: 2 }}>
          Status: {entry.estimate?.approved}
        </Typography>
      </Paper>
    </Container>
  );
}

export default EstimateView;