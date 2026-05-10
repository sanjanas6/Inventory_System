import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  MenuItem
} from "@mui/material";
import API from "../services/api";

function PartsDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [entry, setEntry] = useState(null);
  const [parts, setParts] = useState([]);

  useEffect(() => {
    fetchEntry();
  }, []);

  const fetchEntry = async () => {
    try {
      const res = await API.get(`/entries/${id}`);
      setEntry(res.data);

      if (res.data.indent?.parts?.length) {
        const formatted = res.data.indent.parts.map((p) => ({
          partName: p.partName,
          quantity: p.quantity,
          status: "",
          eta: ""
        }));
        setParts(formatted);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...parts];
    updated[index][field] = value;
    setParts(updated);
  };

  const save = async () => {
    try {
      await API.put(`/entries/${id}`, {
        partsDetails: parts,
        status: "PARTS_DONE",
        partsStatus: "ESTIMATE"
      });

      alert("Parts status submitted ✅");
      navigate("/parts");
    } catch (err) {
      console.log(err);
    }
  };

  if (!entry) return "Loading...";

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3 }}>

        <Typography variant="h6">
          Vehicle: {entry.vehicleNo}
        </Typography>

        <Typography sx={{ mb: 3 }}>
          Customer: {entry.customerName}
        </Typography>

        {/* 🔥 PARTS LIST */}
        {parts.map((p, i) => (
          <Grid container spacing={2} key={i} sx={{ mb: 2 }}>

            {/* PART NAME */}
            <Grid item xs={12} md={4}>
              <TextField
                label="Part"
                value={p.partName}
                fullWidth
                disabled
              />
            </Grid>

            {/* QTY */}
            <Grid item xs={12} md={2}>
              <TextField
                label="Qty"
                value={p.quantity}
                fullWidth
                disabled
              />
            </Grid>

            {/* STATUS */}
            <Grid item xs={12} md={3}>
              <TextField
                select
                label="Status"
                value={p.status}
                fullWidth
                onChange={(e) =>
                  handleChange(i, "status", e.target.value)
                }
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="AVAILABLE">Available</MenuItem>
                <MenuItem value="NOT_AVAILABLE">Not Available</MenuItem>
              </TextField>
            </Grid>

            {/* ETA */}
            <Grid item xs={12} md={3}>
              <TextField
                label="ETA"
                placeholder="If not available"
                value={p.eta}
                fullWidth
                onChange={(e) =>
                  handleChange(i, "eta", e.target.value)
                }
              />
            </Grid>

          </Grid>
        ))}

        {/* SUBMIT */}
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={save}
        >
          Submit Parts Status
        </Button>

      </Paper>
    </Container>
  );
}

export default PartsDetails;