import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Box,
  Button,
  Paper,
  Chip
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function EntryList() {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const res = await API.get("/entries");
      setEntries(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Filter
  const filteredData = entries.filter((item) => {
    const matchSearch =
      item?.vehicleNo?.toLowerCase().includes(search.toLowerCase()) ||
      item?.customerName?.toLowerCase().includes(search.toLowerCase());

    const matchDate = dateFilter ? item?.date === dateFilter : true;

    return matchSearch && matchDate;
  });

  // Columns
  const columns = [
    { field: "vehicleNo", headerName: "Vehicle", flex: 1 },
    { field: "customerName", headerName: "Customer", flex: 1 },
    { field: "mobileNo", headerName: "Mobile", flex: 1 },

    {
      field: "date",
      headerName: "Date",
      flex: 1,
      renderCell: (params) => {
        const date = params.value;

        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-IN");
      }
    },

    // STATUS
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        const status = params.row.status;

        const map = {
          GATE_IN: { label: "Gate IN", color: "default" },
          FLOOR_IN: { label: "Floor In", color: "warning" },
          JOBCARD: { label: "JobCard Open", color: "info" },
          PARTS_REQUESTED: { label: "Parts Requested", color: "secondary" },
          PARTS_DONE: { label: "Parts Ready", color: "success" },
          ESTIMATE_CREATED: { label: "Estimate Created", color: "info" },
          ESTIMATE_APPROVED: { label: "Approved", color: "success" },
          ESTIMATE_REJECTED: { label: "Rejected", color: "error" },
          GATE_OUT: { label: "Gate Out", color: "success" }
        };

        return (
          <Chip
            label={map[status]?.label}
            color={map[status]?.color}
            size="small"
          />
        );
      }
    },

    // ACTION
    {
  field: "action",
  headerName: "Action",
  flex: 1,
  renderCell: (params) => {
    const row = params.row;

    const handleClick = () => {
      if (row.status === "GATE_IN") {
        navigate(`/supervisor/${row._id}`);
      }
      else if (row.status === "FLOOR_IN") {
        navigate(`/checksheet/${row._id}`);
      }
      else if (row.status === "JOBCARD") {
        navigate(`/indent/${row._id}`);
      }
      else if (row.status === "PARTS_REQUESTED") {
        navigate(`/indent/${row._id}`);
      }
      else if (row.status === "PARTS_DONE") {
        navigate(`/parts-view/${row._id}`);
      }
      else if (row.status === "ESTIMATE_CREATED") {
        navigate(`/estimate-view/${row._id}`); // 🔥 KEY
      }
    };

    return (
      <Button variant="contained" onClick={handleClick}>
        {row.status === "ESTIMATE_CREATED"
          ? "View"
          : row.status === "PARTS_DONE"
          ? "View"
          : "Continue"}
      </Button>
    );
  }
}
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h5" sx={{ mt: 2, mb: 2 }}>
        Supervisor Panel
      </Typography>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
        <TextField
          label="Search Vehicle / Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <TextField
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        <Button
          variant="outlined"
          onClick={() => {
            setSearch("");
            setDateFilter("");
          }}
        >
          Clear
        </Button>
      </Box>

      {/* Table */}
      <Paper elevation={3} sx={{ height: 500 }}>
        <DataGrid
          rows={filteredData}
          columns={columns}
          getRowId={(row) => row._id}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
        />
      </Paper>
    </Container>
  );
}

export default EntryList;