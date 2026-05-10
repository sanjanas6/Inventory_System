import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Snackbar,
  Alert
} from "@mui/material";

import API from "../services/api";

function Estimate() {

  const { id } = useParams();
  const navigate = useNavigate();

  // ================= STATES =================

  const [km, setKm] = useState("");
  const [workType, setWorkType] = useState("");

  const [parts, setParts] = useState([
    {
      desc: "",
      amount: ""
    }
  ]);

  const [labour, setLabour] = useState([
    {
      desc: "",
      amount: ""
    }
  ]);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // ================= HANDLE CHANGE =================

  const handleChange = (
    list,
    setList,
    index,
    field,
    value
  ) => {

    const updated = [...list];

    updated[index][field] = value;

    setList(updated);
  };

  // ================= ADD ROWS =================

  const addPart = () => {
    setParts([
      ...parts,
      {
        desc: "",
        amount: ""
      }
    ]);
  };

  const addLabour = () => {
    setLabour([
      ...labour,
      {
        desc: "",
        amount: ""
      }
    ]);
  };

  // ================= TOTAL =================

  const total =
    parts.reduce(
      (sum, item) =>
        sum + Number(item.amount || 0),
      0
    ) +
    labour.reduce(
      (sum, item) =>
        sum + Number(item.amount || 0),
      0
    );

  // ================= SAVE =================

  const save = async () => {

    // Basic validation
    if (!km || !workType) {

      setToast({
        open: true,
        message: "Please fill required fields ⚠️",
        severity: "warning"
      });

      return;
    }

    try {

      await API.put(`/entries/${id}`, {

        estimate: {

          kilometer: km,

          workType,

          parts: parts.map((part) => ({
            description: part.desc,
            amount: Number(part.amount || 0)
          })),

          labour: labour.map((item) => ({
            description: item.desc,
            amount: Number(item.amount || 0)
          })),

          total,

          approved: "PENDING"
        },

        status: "ESTIMATE_CREATED"
      });

      setToast({
        open: true,
        message: "Estimate Saved Successfully ✅",
        severity: "success"
      });

      // Delay navigation so toast visible rahe
      setTimeout(() => {
        navigate("/entries");
      }, 1200);

    } catch (err) {

      console.log(err);

      setToast({
        open: true,
        message: "Error saving estimate ❌",
        severity: "error"
      });
    }
  };

  return (

    <Container maxWidth="md" sx={{ py: 3 }}>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2
        }}
      >

        {/* ================= HEADER ================= */}

        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
        >
          Estimate
        </Typography>

        {/* ================= MAIN FIELDS ================= */}

        <TextField
          label="Kilometer"
          fullWidth
          size="small"
          sx={{ mt: 2 }}
          value={km}
          onChange={(e) => setKm(e.target.value)}
        />

        <TextField
          label="Work Type"
          fullWidth
          size="small"
          sx={{ mt: 2 }}
          value={workType}
          onChange={(e) => setWorkType(e.target.value)}
        />

        {/* ================= PARTS ================= */}

        <Typography
          sx={{
            mt: 4,
            mb: 2,
            fontWeight: "bold"
          }}
        >
          Parts
        </Typography>

        {parts.map((part, index) => (

          <Grid
            container
            spacing={2}
            key={index}
            sx={{ mb: 1 }}
          >

            <Grid item xs={12} sm={7}>

              <TextField
                label="Description"
                fullWidth
                size="small"
                value={part.desc}
                onChange={(e) =>
                  handleChange(
                    parts,
                    setParts,
                    index,
                    "desc",
                    e.target.value
                  )
                }
              />

            </Grid>

            <Grid item xs={12} sm={5}>

              <TextField
                label="Amount"
                type="number"
                fullWidth
                size="small"
                value={part.amount}
                onChange={(e) =>
                  handleChange(
                    parts,
                    setParts,
                    index,
                    "amount",
                    e.target.value
                  )
                }
              />

            </Grid>

          </Grid>
        ))}

        <Button
          variant="outlined"
          sx={{ mt: 1 }}
          onClick={addPart}
        >
          + Add Part
        </Button>

        {/* ================= LABOUR ================= */}

        <Typography
          sx={{
            mt: 4,
            mb: 2,
            fontWeight: "bold"
          }}
        >
          Labour
        </Typography>

        {labour.map((item, index) => (

          <Grid
            container
            spacing={2}
            key={index}
            sx={{ mb: 1 }}
          >

            <Grid item xs={12} sm={7}>

              <TextField
                label="Description"
                fullWidth
                size="small"
                value={item.desc}
                onChange={(e) =>
                  handleChange(
                    labour,
                    setLabour,
                    index,
                    "desc",
                    e.target.value
                  )
                }
              />

            </Grid>

            <Grid item xs={12} sm={5}>

              <TextField
                label="Amount"
                type="number"
                fullWidth
                size="small"
                value={item.amount}
                onChange={(e) =>
                  handleChange(
                    labour,
                    setLabour,
                    index,
                    "amount",
                    e.target.value
                  )
                }
              />

            </Grid>

          </Grid>
        ))}

        <Button
          variant="outlined"
          sx={{ mt: 1 }}
          onClick={addLabour}
        >
          + Add Labour
        </Button>

        {/* ================= TOTAL ================= */}

        <Typography
          sx={{
            mt: 4,
            fontSize: 18
          }}
        >
          <b>Total: ₹ {total}</b>
        </Typography>

        {/* ================= SAVE ================= */}

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          onClick={save}
        >
          Submit Estimate
        </Button>

      </Paper>

      {/* ================= TOAST ================= */}

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() =>
          setToast((prev) => ({
            ...prev,
            open: false
          }))
        }
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
      >

        <Alert
          severity={toast.severity}
          variant="filled"
        >
          {toast.message}
        </Alert>

      </Snackbar>

    </Container>
  );
}

export default Estimate;