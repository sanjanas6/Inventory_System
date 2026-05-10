import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress
} from "@mui/material";
import API from "../services/api";

function Indent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [entry, setEntry] = useState(null);
  const [parts, setParts] = useState([{ partName: "", quantity: "" }]);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH ENTRY
  useEffect(() => {
    fetchEntry();
  }, []);

  const fetchEntry = async () => {
    try {
      const res = await API.get(`/entries/${id}`);

      setEntry(res.data);

      // ✅ agar pehle se indent hai → load karo
      if (res.data.indent?.parts?.length) {
        setParts(res.data.indent.parts);
      }

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 INPUT CHANGE
  const handleChange = (i, field, value) => {
    const updated = [...parts];
    updated[i][field] = value;
    setParts(updated);
  };

  // 🔥 ADD ROW
  const addRow = () => {
    setParts([...parts, { partName: "", quantity: "" }]);
  };

  // 🔥 REMOVE ROW
  const removeRow = (index) => {
    const updated = parts.filter((_, i) => i !== index);
    setParts(updated);
  };

  // 🔥 SAVE
  const save = async () => {
    try {
      await API.put(`/entries/${id}`, {
        indent: { parts },
        status: "PARTS_REQUESTED"
      });

      navigate("/entries"); // Parts panel
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 LOADER
  if (loading) {
    return (
      <Box sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">

      <Typography variant="h5" sx={{ mb: 2 }}>
        Indent Form
      </Typography>

      {/* VEHICLE INFO */}
      <Typography>Vehicle: {entry?.vehicleNo}</Typography>
      <Typography>Customer: {entry?.customerName}</Typography>

      {/* PARTS */}
      {parts.map((p, i) => (
        <Box key={i} sx={{ display: "flex", gap: 1, mb: 1 }}>

          <TextField
            fullWidth
            label="Part Name"
            value={p.partName}
            onChange={(e)=>handleChange(i,"partName",e.target.value)}
          />

          <TextField
            label="Qty"
            value={p.quantity}
            onChange={(e)=>handleChange(i,"quantity",e.target.value)}
          />

          {parts.length > 1 && (
            <Button color="error" onClick={() => removeRow(i)}>
              X
            </Button>
          )}

        </Box>
      ))}

      <Button onClick={addRow} sx={{ mr: 2 }}>
        + Add Part
      </Button>

      <Button variant="contained" onClick={save}>
        Submit Indent
      </Button>

    </Container>
  );
}

export default Indent;