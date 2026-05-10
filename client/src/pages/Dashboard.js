import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Button,
  Chip
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const res = await API.get("/entries");
    setEntries(res.data);
  };

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

  const columns = [
    { field: "vehicleNo", headerName: "Vehicle", flex: 1 },
    { field: "customerName", headerName: "Customer", flex: 1 },

    {
      field: "date",
      headerName: "Date",
      flex: 1,
      renderCell: (params) =>
        params.value
          ? new Date(params.value).toLocaleDateString("en-IN")
          : "-"
    },

    // STATUS
    {
      field: "status",
      headerName: "Current Status",
      flex: 1,
      renderCell: (params) => {
        const s = params.value;
        return (
          <Chip
            label={statusMap[s]?.label || "Unknown"}
            color={statusMap[s]?.color || "default"}
            size="small"
          />
        );
      }
    },

    // ACTION
    {
      field: "action",
      headerName: "View Full Process",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => navigate(`/admin-view/${params.row._id}`)}
        >
          View
        </Button>
      )
    }
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h5" sx={{ mt: 2, mb: 2 }}>
        Admin Dashboard
      </Typography>

      <Paper sx={{ height: 500 }}>
        <DataGrid
          rows={entries}
          columns={columns}
          getRowId={(row) => row._id}
        />
      </Paper>
    </Container>
  );
}

export default Dashboard;