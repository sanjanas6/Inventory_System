import { useEffect, useState } from "react";
import {
  Container, Typography, Paper, Button
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function PartsList() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await API.get("/entries");

      // 🔥 only PARTS_REQUESTED
      const filtered = res.data.filter(
        (e) => e.status === "PARTS_REQUESTED"
      );

      setData(filtered);
    } catch (err) {
      console.log(err);
    }
  };

  const columns = [
    { field: "vehicleNo", headerName: "Vehicle", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },

    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          onClick={() => navigate(`/parts/${params.row._id}`)}
        >
          View
        </Button>
      )
    }
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h5" sx={{ mb: 2 }}>
        Parts Team Panel
      </Typography>

      <Paper sx={{ height: 400 }}>
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row._id}
        />
      </Paper>
    </Container>
  );
}

export default PartsList;